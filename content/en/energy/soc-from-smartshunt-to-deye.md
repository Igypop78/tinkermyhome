---
id: deye-soc
cover: /img/clanky/titulky/deye-soc.jpg
title: Three BMS, one Deye – accurate SOC and gentle charging with an ESP32
description: How I turned three JK BMS and a Victron SmartShunt into one “smart BMS” for a Deye inverter on an ESP32 – accurate SOC, limits from the cells, smooth current reduction when a cell runs away, and the full ESPHome code.
section: energy
level: 3
date: 2026-11-16
updated: 2026-11-22
time: '20:00'
slug: soc-from-smartshunt-to-deye
tldr: 'My battery is made of three units (“packs”), each with its own **JK BMS**, and the total SOC is measured by one **Victron SmartShunt**. Since the BMS data wasn''t accurate (SOC) and one pack doesn''t even have a BMS with a CAN protocol, I decided to solve it differently. A **€24 Waveshare ESP32-S3-RS485-CAN** board now reads the SmartShunt and all three BMS over Bluetooth and presents itself to the inverter as **one Pylontech battery**: it sends the **accurate SOC from the SmartShunt** and **smoothly lowers the charge current by itself when a cell runs high** – before the BMS cuts the battery off hard. Below: wiring, logic, the debugging story and the complete code.'
---

:::info Updated 22 Nov 2026 – version 2
The first version of this guide (16 Nov) only sent the SOC from the SmartShunt and **fixed limits** – the inverter knew nothing about the BMS. A more experienced tinkerer, Andy, rightly pointed that out. Version 2 also reads all three BMS and calculates the limits from the real state of the cells.

It is still **not a replacement for a BMS that talks to the inverter directly**, and the BMS in the packs still do the protection. But it is much safer than an inverter running on fixed values – and it helps anyone whose BMS can't talk to the inverter directly but can be read over Bluetooth.
:::

## Why I'm doing this

:::me How I have it
Inverter **Deye SUN-10K-SG04LP3-EU**, a ~34 kWh LiFePO4 battery made up of three packs (**2 × 280 Ah + 1 × 105 Ah**, 16 cells), each with its own **JK BMS**. The whole bank is measured by one **Victron SmartShunt** – that is my source of truth, my [AI Energy](/en/projects/ai-energy/) also runs on it.
:::

I had two problems at once:

- **The BMS SOC isn't accurate.** A BMS calculates SOC by adding up current and only corrects itself at 100 %. In winter the battery gets there less often, and after a few days the number no longer matches reality. The **SmartShunt** measures the whole bank and stays much more accurate even after weeks – but Deye doesn't know it.
- **The JK BMS doesn't reduce the current at the end of charging.** It sends a fixed charge voltage and a fixed current. The slowdown is done by the inverter in the CV phase – based on the voltage of the **whole battery**. When one cell runs high, the bank is still "fine", but the cell goes all the way to the BMS protection (3.65 V for me) and the BMS **cuts off hard**. That's bad for the cells and for the MOSFETs in the BMS.

Forums also often mention issues between Deye and JK BMS over CAN – for example different voltage readings in the inverter and the BMS, or absorption restarting after a short voltage dip. I haven't verified them myself, but it was another reason to keep the logic in my own hands.

## How it works

![Wiring v2: SmartShunt and three JK BMS over Bluetooth to the ESP32-S3, CAN from there to Deye](/img/clanky/deye-esp-zapojenie-en.svg)

The **Waveshare ESP32-S3-RS485-CAN** board is "one smart BMS" for the Deye:

1. Over Bluetooth it **listens to the SmartShunt** (SOC, voltage and current of the whole bank) – it doesn't connect, it only reads the broadcast.
2. Over Bluetooth it **connects to all three JK BMS** – it takes the highest and lowest cell, the temperature and whether the BMS allows charging and discharging.
3. **Every second it calculates the limits** and sends them to Deye over CAN in the Pylontech protocol.

Everything runs **inside the ESP**. If Wi-Fi or Home Assistant goes down, control carries on. HA is only for display and manual caps.

| CAN ID | Content |
|---|---|
| `0x351` | charge voltage, **charge current**, **discharge current**, low voltage 47.0 V |
| `0x355` | **SOC from the SmartShunt**, health (SOH) 100 % |
| `0x356` | voltage and current from the SmartShunt, **temperature of the coldest pack** |
| `0x35C` | charge and discharge allowed (0 A = not allowed) |

## Charge current logic

The base is simple: **200 A × the number of packs** whose BMS allows charging and that sent data within the last minute. But never more than the cap set in HA (200 A for me – enough to charge from the grid at the full 10 kW).

The core is a **controller driven by the highest of all 48 cells**. It takes a step once every 10 s, because the JK BMS send data over Bluetooth exactly once every 10 s. All changes are calculated from the current **actually going to Deye**.

![Controller bands by the highest cell: 3.40 / 3.45 / 3.50 / 3.60 V](/img/clanky/deye-esp-pasma-en.svg)

| Highest cell | What the charge current does |
|---|---|
| below 3.40 V | rises fast (+20 A per 10 s) |
| 3.40 – 3.45 V | rises slowly (+2 A per 10 s) |
| 3.45 – 3.50 V | holds |
| 3.50 – 3.60 V | falls smoothly, the faster the higher the cell (3.51 V −3 %, 3.55 V −15 %, 3.59 V −27 % per step) |
| from 3.60 V | **0 A and a pause** |

**Pause after 3.60 V:** charging restarts only when 5 minutes have passed since the cut **and** the cell has been below 3.45 V for 60 seconds in a row. It restarts from 5 A. At the same time the cap is set to half of the current before the cut and released by 1 A per minute – so the current can't jump straight back to where it failed.

More safeguards:

- **Cold:** if the coldest pack is below 5 °C, no charging (again from 6 °C).
- **A BMS silent for 60 s:** that pack is not counted, the limit drops by its share. If all are silent, the **fallback current** set in HA applies (50 A for me).
- **SmartShunt silent for 5 minutes:** the ESP sends **nothing** to Deye. Deye shows **W31** (battery communication error) and carries on with its own settings – I've verified that.
- **Discharging** is limited by the lowest cell: from 3.00 V it falls smoothly, at 2.80 V it's 0 A.
- **The last line of defence** is always the BMS in the pack.

### How it works together with Deye

My charge voltage is **55.4 V** (3.46 V per cell). Ideal LFP charging is two controllers at once: **the inverter holds the voltage of the whole battery** (CV) and **the BMS guards the highest cell** (charge current). That's exactly how it works now:

![Three ways charging ends: balanced battery, runaway cell, no time to balance](/img/clanky/deye-esp-scenare-en.svg)

1. **Balanced battery** – Deye lowers the current itself in the CV phase, the ESP stays out.
2. **Runaway cell** – the bank is still below 55.4 V, but one cell passes 3.50 V. The ESP lowers the current and keeps it low enough for the cell to stay around the target while the others catch up (the balancer in the BMS pulls them together).
3. **No time to balance** – I don't have this in the code yet. The plan is to end charging after a time limit and mark the battery as "unbalanced".

The 3.60 V limit is only a safeguard. With correct settings it should appear only rarely.

:::tip If it's always the same cell running high
It's probably a cell with lower capacity. Balancing won't help – it's the ceiling of the whole bank. And when trading on the spot market you don't need 100 % every day. A full charge with balancing now and then is enough, also to sync the SmartShunt.
:::

## Debugging: why the current swung between 0 and 90 A

The first version didn't work well, and it's worth showing why.

![Chart of the sent charge current: v1 swings between 0 and 90 A, v3 falls smoothly](/img/clanky/deye-esp-ladenie-en.svg)

1. **v1 – linear reduction 3.50 → 3.60 V and +5 A per second.** The chart swung: 200 A → 25 A → 0 → 55 → 90 → 0 → 75… At 3.60 V the cell stopped charging, without current its voltage dropped (the drop across the internal resistance disappears), the logic quickly added current and the cell shot up again. **The cause:** the JK BMS send data once every 10 s, but the limit rose every second – between two readings it added +50 A blind. On top of that the reduction was calculated from 600 A (3 packs), so 10 mV on a cell meant 60 A.
2. **v2 – controller with a 10 s step, pause and learned cap.** A new bug: the controller lowered its internal value from 600 A (600 → 480 → 384 → 307), but Deye still got 200 A. The card said "falling (307 A)" and the current didn't move.
3. **v3 – the decrease is calculated from the current really sent to Deye.** In a simulation the cell settled around 3.50 V and the current fell smoothly from ~50 A to single amps without a single cut.

I ran the real test on purpose with a charge voltage of **57.4 V**, i.e. without help from Deye's CV phase – the ESP controlled everything. That's the worst case. Pack 2 had a cell delta of around 235 mV while charging – a textbook runaway cell:

![Home Assistant card during the 57.4 V test: 195 A, then 54 A at a 3.597 V cell, then a pause after 3.60 V](/img/clanky/deye-esp-test-57v.jpg)

First 195 A, at a 3.597 V cell only 54 A, and when a cell in pack 2 reached 3.609 V charging stopped with a pause and a countdown. The BMS didn't cut off – the ESP stopped it first. At the normal 55.4 V the battery shouldn't get here.

## What you need

- **Victron SmartShunt** in the battery negative (I have the 300 A / 50 mV) – you can also use data from a chosen BMS as the source of truth (the ESP code needs a change),
- **Waveshare ESP32-S3-RS485-CAN** – a DIN-rail board with CAN and RS485, 7–36 V supply, cost me **€24** – another board with CAN will do too,
- BMS that can be read over Bluetooth – **JK BMS** in my case (the [jk_bms_ble](https://github.com/syssi/esphome-jk-bms) component supports other JK versions too),
- a piece of **LAN cable** with an RJ45 plug,
- **ESPHome** (Home Assistant add-on) and a USB-C cable for the first flash.

:::warn A JK BMS accepts only one Bluetooth connection
While the ESP is connected to a pack, **the JK phone app can't connect** (and vice versa). If you read the BMS with another ESP or a Bluetooth proxy, switch that off first.
:::

## Wiring the cable

1. **Cable to the inverter.** LAN cable (T568B) – RJ45 plug into the **BMS** port on Deye, cut off the other end. Insulate the unused wires.
2. **CAN:** pin **4 – blue** → terminal **H**, pin **5 – white-blue** → terminal **L** on the Waveshare board.
3. **Termination:** switch on the **120 Ω jumper** on the board.
4. **Power:** from the **12 V output on the Deye terminal block** to the board's power terminals.

The packs aren't connected to the ESP by any cable – everything goes over Bluetooth.

:::warn Work with the inverter switched off
The terminal block with the 12 V output is inside the inverter, together with dangerous voltages from the battery, panels and grid. Switch the inverter off (AC, PV and battery) and wait for the capacitors to discharge before opening it. If you're not sure, let an electrician do it.
:::

## Pairing the ESP with the SmartShunt and the BMS

The **SmartShunt** broadcasts encrypted data. You need its **MAC address** and **encryption key**: in the **VictronConnect** app connect to the SmartShunt → **gear icon** → **three dots** → **Product info** → turn on **Instant readout via Bluetooth** → tap **Show** next to **Instant readout details**.

The **JK BMS** only need the MAC address – you'll find it in the JK app or a Bluetooth scanner. Also check the JK hardware version: newer ones (HW 11 and up) use protocol `JK02_32S`, older ones (HW 6–10) `JK02_24S`. My smallest pack is an older one.

Put everything into `secrets.yaml` in ESPHome:

```yaml secrets.yaml
wifi_ssid: "MyWiFi"
wifi_password: "wifi-password"
smartshunt_mac: "aabbccddeeff"            # no colons, lower case
smartshunt_bindkey: "paste-the-32-character-key"
bms1_mac: "AA:BB:CC:DD:EE:01"              # JK BMS with colons
bms2_mac: "AA:BB:CC:DD:EE:02"
bms3_mac: "AA:BB:CC:DD:EE:03"
```

:::tip Never share the key
Whoever has the encryption key can read your battery data. Don't post it on forums, GitHub or in messages to an AI – that's why it lives in `secrets.yaml`, not in the code.
:::

## ESPHome code

This is the configuration I run (as of 22 Nov 2026). The whole logic is described in words at the top of the file. All thresholds are in `substitutions`, so you can adjust them without touching the code. **The thresholds are tuned for LFP 16S and my hardware – check them for your batteries before use.**

```yaml esp-can.yaml
# =====================================================================
#  ESP CAN v2 – Waveshare ESP32-S3-RS485-CAN  →  Deye (CAN, Pylon protocol)
# =====================================================================
#
#  WHAT IT DOES (plain words)
#  --------------------------
#  1. SmartShunt (Bluetooth, listen only)    →  SOC, voltage and current of the whole bank.
#  2. Three JK BMS (Bluetooth connection)    →  highest/lowest cell, temperature,
#                                               whether the BMS allows charging/discharging.
#  3. Every second the ESP calculates the limits and sends them to Deye over CAN:
#        0x351  charge voltage, charge current, discharge current, min. voltage 47.0 V
#        0x355  SOC from the SmartShunt, SOH 100 %
#        0x356  voltage and current from the SmartShunt, temperature (coldest pack)
#        0x35C  charge / discharge allowed (0 A current = not allowed)
#
#  HOW THE CHARGE CURRENT IS CALCULATED
#  ------------------------------------
#   a) 200 A × number of packs whose BMS allows charging and that sent data
#      within the last minute (3 packs = 600 A, 2 = 400 A …).
#   b) Highest cell of all packs – controller (one step every 10 s,
#      because JK sends data once every 10 s).
#      All changes are calculated from the current that is CURRENTLY sent to Deye.
#        below 3.40 V    → limit rises fast (+20 A / 10 s)
#        3.40–3.45 V     → slowly (+2 A / 10 s)
#        3.45–3.50 V     → holds
#        3.50–3.60 V     → falls smoothly, the faster the higher the cell:
#                          3.51 V −3 %, 3.55 V −15 %, 3.59 V −27 % (min. 1 A) / 10 s
#        from 3.60 V     → 0 A and PAUSE: again only after 5 min and once the cell
#                          has been below 3.45 V for 60 s; restart from 5 A. The cap is
#                          set to half of the current before the cut and releases 1 A/min.
#      (BMS protection is 3.65 V – Deye lowers the current before the BMS cuts off.)
#   c) Coldest pack below 5 °C → 0 A (allowed again from 6 °C).
#   d) Never more than the "Charge current cap" field in HA.
#
#  HOW THE DISCHARGE CURRENT IS CALCULATED
#  ---------------------------------------
#   200 A × number of packs allowed to discharge, lowest cell:
#        from 3.00 V → 100 %,  3.00–2.80 V → falls smoothly,  below 2.80 V → 0 A
#   and never more than the "Discharge current cap".
#
#  The limit drops immediately and rises by at most 5 A per second.
#
#  WHEN SOMETHING FAILS
#  --------------------
#   • No BMS sends anything for 60 s → "Fallback current" (default 100 A, can be lowered),
#                                       temperature 25 °C.
#   • One BMS is silent              → not counted, the limit drops by its share.
#   • SmartShunt silent for 5 min    → ESP sends NOTHING to Deye → Deye shows W31
#                                       and runs on its own battery settings.
#   • Wi-Fi / Home Assistant down    → nothing happens, everything runs in the ESP.
#   • Switch "Control limits by BMS" off → only the caps from HA are sent.
#     After an ESP restart control turns itself back on.
#   • The last line of defence is always the BMS in the pack (hard cut-off).
#
#  NOTE: a JK BMS accepts only ONE Bluetooth connection at a time. No other ESP
#  and no JK phone app may be connected to the packs.
#
#  secrets.yaml: wifi_ssid, wifi_password, smartshunt_mac, smartshunt_bindkey,
#                bms1_mac, bms2_mac, bms3_mac
# =====================================================================

substitutions:
  # --- JK BMS Bluetooth addresses and protocols ---
  bms1_mac: !secret bms1_mac
  bms1_protocol: JK02_32S   # main, address 0
  bms2_mac: !secret bms2_mac
  bms2_protocol: JK02_32S
  bms3_mac: !secret bms3_mac
  bms3_protocol: JK02_24S   # older hardware

  # --- Rules (change = re-flash the ESP) ---
  per_bat_a: "200"          # max. current of one pack (A)
  cell_fast: "3.40"         # below this cell voltage the limit may rise fast (V)
  cell_slow: "3.45"         # 3.40–3.45 slowly, above it holds; below it charging may restart after a cut (V)
  cell_hi_start: "3.50"     # from this cell voltage the charge current falls smoothly (V)
  down_max_pct: "30"        # decrease per step just below cell_hi_stop (%), 0 % at cell_hi_start
  cell_hi_stop: "3.60"      # here the charge current is 0 A + pause (V)
  hi_step_s: "10"           # how often the controller reacts (s) – same as the JK BMS throttle
  up_fast_a: "20"           # increase per step below cell_fast (A)
  up_slow_a: "2"            # increase per step cell_fast–cell_slow (A)
  restart_a: "5"            # restart current after a cut (A)
  pause_min: "5"            # minimum pause after a cut (min)
  cap_release_a_min: "1"    # how many A per minute the cap releases after a cut
  cell_lo_start: "3.00"     # from this cell voltage the discharge current falls (V)
  cell_lo_stop: "2.80"      # here the discharge current is 0 A (V)
  cold_off_c: "5"           # no charging below this temperature (°C)
  cold_on_c: "6"            # charging allowed again from this temperature (°C)
  bms_timeout_s: "60"       # after how many seconds without data a pack is not counted
  shunt_timeout_min: "5"    # after how many minutes without shunt SOC stop sending
  ramp_up_a_s: "5"          # how many A per second the limit may rise

esphome:
  name: esp-can
  friendly_name: ESP CAN
  min_version: 2026.4.0
  name_add_mac_suffix: false
  on_boot:
    priority: -100
    then:
      - component.update: charge_voltage_cell

esp32:
  variant: esp32s3
  framework:
    type: esp-idf

external_components:
  - source: github://Igypop78/esphome-victron_ble
  - source: github://syssi/esphome-jk-bms@main
    components: [jk_bms_ble]
    refresh: 1d

logger:
  level: INFO
  logs:
    sensor: WARN
    binary_sensor: WARN

api:

ota:
  - platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

# ---------------- Bluetooth ----------------
esp32_ble_tracker:
  scan_parameters:
    active: false        # passive – less load on Wi-Fi

# SmartShunt – only listens to broadcasts, does not connect
victron_ble:
  - mac_address: !secret smartshunt_mac
    bindkey: !secret smartshunt_bindkey
    id: my_shunt

# JK BMS – three Bluetooth connections
ble_client:
  - mac_address: ${bms1_mac}
    id: client1
  - mac_address: ${bms2_mac}
    id: client2
  - mac_address: ${bms3_mac}
    id: client3

jk_bms_ble:
  - ble_client_id: client1
    protocol_version: ${bms1_protocol}
    throttle: 10s
    id: bms1
  - ble_client_id: client2
    protocol_version: ${bms2_protocol}
    throttle: 10s
    id: bms2
  - ble_client_id: client3
    protocol_version: ${bms3_protocol}
    throttle: 10s
    id: bms3

# ---------------- BMS state: charging / discharging allowed ----------------
binary_sensor:
  - platform: jk_bms_ble
    jk_bms_ble_id: bms1
    charging:
      id: b1_chg
      name: "Pack 1 – charging allowed (BMS)"
    discharging:
      id: b1_dis
      name: "Pack 1 – discharging allowed (BMS)"
  - platform: jk_bms_ble
    jk_bms_ble_id: bms2
    charging:
      id: b2_chg
      name: "Pack 2 – charging allowed (BMS)"
    discharging:
      id: b2_dis
      name: "Pack 2 – discharging allowed (BMS)"
  - platform: jk_bms_ble
    jk_bms_ble_id: bms3
    charging:
      id: b3_chg
      name: "Pack 3 – charging allowed (BMS)"
    discharging:
      id: b3_dis
      name: "Pack 3 – discharging allowed (BMS)"

  - platform: template
    name: "Deye – sending SOC and limits"
    icon: mdi:transmission-tower-export
    lambda: 'return id(sending);'

# ---------------- Sensors ----------------
sensor:
  # --- SmartShunt ---
  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_voltage
    filters:
      - throttle_average: 5s
    id: shunt_voltage
    name: "SmartShunt – voltage"

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_current
    filters:
      - throttle_average: 5s
    id: shunt_current
    name: "SmartShunt – current"

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: state_of_charge
    filters:
      - throttle_average: 5s
    id: shunt_soc
    name: "SmartShunt – SOC"
    on_value:
      - lambda: |-
          if (!std::isnan(x)) id(shunt_last_ms) = millis();

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_power
    filters:
      - throttle_average: 5s
    id: shunt_power
    name: "SmartShunt – power"

  # --- Pack 1 ---
  - platform: jk_bms_ble
    jk_bms_ble_id: bms1
    max_cell_voltage:
      id: b1_vmax
      name: "Pack 1 – highest cell"
      on_value:
        - lambda: |-
            if (!std::isnan(x)) id(b1_last_ms) = millis();
    min_cell_voltage:
      id: b1_vmin
      name: "Pack 1 – lowest cell"
    max_voltage_cell:
      name: "Pack 1 – highest cell number"
    min_voltage_cell:
      name: "Pack 1 – lowest cell number"
    delta_cell_voltage:
      name: "Pack 1 – cell delta"
    average_cell_voltage:
      name: "Pack 1 – average cell"
    total_voltage:
      name: "Pack 1 – voltage"
    current:
      name: "Pack 1 – current"
    power:
      name: "Pack 1 – power"
    temperature_sensor_1:
      id: b1_temp
      name: "Pack 1 – temperature"
    mosfet_temperature:
      name: "Pack 1 – MOS temperature"
    state_of_charge:
      name: "Pack 1 – SOC (BMS)"
    charging_cycles:
      name: "Pack 1 – cycles"
    balancer_status_bitmask:
      name: "Pack 1 – balancing"

  # --- Pack 2 ---
  - platform: jk_bms_ble
    jk_bms_ble_id: bms2
    max_cell_voltage:
      id: b2_vmax
      name: "Pack 2 – highest cell"
      on_value:
        - lambda: |-
            if (!std::isnan(x)) id(b2_last_ms) = millis();
    min_cell_voltage:
      id: b2_vmin
      name: "Pack 2 – lowest cell"
    max_voltage_cell:
      name: "Pack 2 – highest cell number"
    min_voltage_cell:
      name: "Pack 2 – lowest cell number"
    delta_cell_voltage:
      name: "Pack 2 – cell delta"
    average_cell_voltage:
      name: "Pack 2 – average cell"
    total_voltage:
      name: "Pack 2 – voltage"
    current:
      name: "Pack 2 – current"
    power:
      name: "Pack 2 – power"
    temperature_sensor_1:
      id: b2_temp
      name: "Pack 2 – temperature"
    mosfet_temperature:
      name: "Pack 2 – MOS temperature"
    state_of_charge:
      name: "Pack 2 – SOC (BMS)"
    charging_cycles:
      name: "Pack 2 – cycles"
    balancer_status_bitmask:
      name: "Pack 2 – balancing"

  # --- Pack 3 ---
  - platform: jk_bms_ble
    jk_bms_ble_id: bms3
    max_cell_voltage:
      id: b3_vmax
      name: "Pack 3 – highest cell"
      on_value:
        - lambda: |-
            if (!std::isnan(x)) id(b3_last_ms) = millis();
    min_cell_voltage:
      id: b3_vmin
      name: "Pack 3 – lowest cell"
    max_voltage_cell:
      name: "Pack 3 – highest cell number"
    min_voltage_cell:
      name: "Pack 3 – lowest cell number"
    delta_cell_voltage:
      name: "Pack 3 – cell delta"
    average_cell_voltage:
      name: "Pack 3 – average cell"
    total_voltage:
      name: "Pack 3 – voltage"
    current:
      name: "Pack 3 – current"
    power:
      name: "Pack 3 – power"
    temperature_sensor_1:
      id: b3_temp
      name: "Pack 3 – temperature"
    mosfet_temperature:
      name: "Pack 3 – MOS temperature"
    state_of_charge:
      name: "Pack 3 – SOC (BMS)"
    charging_cycles:
      name: "Pack 3 – cycles"
    balancer_status_bitmask:
      name: "Pack 3 – balancing"

  # --- What the ESP is sending to Deye ---
  - platform: template
    name: "Deye – sent charge current"
    icon: mdi:battery-arrow-up
    unit_of_measurement: A
    accuracy_decimals: 0
    update_interval: 10s
    lambda: 'return id(out_ccl);'
  - platform: template
    name: "Deye – sent discharge current"
    icon: mdi:battery-arrow-down
    unit_of_measurement: A
    accuracy_decimals: 0
    update_interval: 10s
    lambda: 'return id(out_dcl);'
  - platform: template
    name: "Deye – sent battery temperature"
    icon: mdi:thermometer
    unit_of_measurement: "°C"
    accuracy_decimals: 1
    update_interval: 10s
    lambda: 'return id(out_temp);'
  - platform: template
    name: "Control – high cell limit"
    icon: mdi:battery-alert-variant
    unit_of_measurement: A
    accuracy_decimals: 0
    update_interval: 10s
    lambda: 'return id(hi_lim);'
  - platform: template
    name: "Control – cap after cut"
    icon: mdi:arrow-collapse-up
    unit_of_measurement: A
    accuracy_decimals: 0
    update_interval: 10s
    lambda: 'return id(hi_cap);'
  - platform: template
    name: "Control – packs with data"
    icon: mdi:battery-sync
    accuracy_decimals: 0
    update_interval: 10s
    lambda: 'return id(n_fresh);'
  - platform: template
    id: charge_voltage_cell
    name: "Deye – charge voltage per cell"
    icon: mdi:battery-high
    unit_of_measurement: V
    accuracy_decimals: 3
    update_interval: never
    lambda: 'return id(charge_voltage).state / 16.0f;'

text_sensor:
  - platform: template
    name: "Control – mode"
    icon: mdi:state-machine
    update_interval: 10s
    lambda: 'return id(mode_text);'
  - platform: template
    name: "Control – what limits charging"
    icon: mdi:information-outline
    update_interval: 10s
    lambda: 'return id(reason_text);'

# ---------------- Controls in HA ----------------
switch:
  - platform: template
    id: control_on
    name: "Control limits by BMS"
    icon: mdi:robot
    optimistic: true
    restore_mode: ALWAYS_ON     # always on after an ESP restart

number:
  - platform: template
    id: max_charge_a
    name: "Charge current cap"
    icon: mdi:battery-arrow-up
    unit_of_measurement: A
    min_value: 0
    max_value: 200
    step: 5
    initial_value: 200
    restore_value: true
    optimistic: true
    mode: box
  - platform: template
    id: max_discharge_a
    name: "Discharge current cap"
    icon: mdi:battery-arrow-down
    unit_of_measurement: A
    min_value: 0
    max_value: 200
    step: 5
    initial_value: 200
    restore_value: true
    optimistic: true
    mode: box
  - platform: template
    id: fallback_a
    name: "Fallback current when BMS is silent"
    icon: mdi:shield-alert
    unit_of_measurement: A
    min_value: 0
    max_value: 100
    step: 5
    initial_value: 100
    restore_value: true
    optimistic: true
    mode: box
  - platform: template
    id: charge_voltage
    name: "Deye charge voltage"
    icon: mdi:flash-triangle
    unit_of_measurement: V
    min_value: 52.0
    max_value: 58.0
    step: 0.1
    initial_value: 55.4
    restore_value: true
    optimistic: true
    mode: box
    on_value:
      - component.update: charge_voltage_cell

globals:
  - { id: b1_last_ms, type: uint32_t, initial_value: '0' }
  - { id: b2_last_ms, type: uint32_t, initial_value: '0' }
  - { id: b3_last_ms, type: uint32_t, initial_value: '0' }
  - { id: shunt_last_ms, type: uint32_t, initial_value: '0' }
  - { id: sending, type: bool, initial_value: 'false' }
  - { id: cold_block, type: bool, initial_value: 'false' }
  - { id: out_ccl, type: float, initial_value: '0' }
  - { id: out_dcl, type: float, initial_value: '0' }
  - { id: out_temp, type: float, initial_value: '25' }
  - { id: n_fresh, type: int, initial_value: '0' }
  - { id: hi_lim, type: float, initial_value: '600' }       # limit from the high-cell controller
  - { id: hi_cap, type: float, initial_value: '600' }       # learned cap after a cut
  - { id: hi_cut, type: bool, initial_value: 'false' }      # pause after a cut at 3.60 V
  - { id: hi_cut_ms, type: uint32_t, initial_value: '0' }
  - { id: hi_below_ms, type: uint32_t, initial_value: '0' }
  - { id: hi_step_ms, type: uint32_t, initial_value: '0' }
  - { id: mode_text, type: std::string, initial_value: '"start"' }
  - { id: reason_text, type: std::string, initial_value: '"–"' }

# ---------------- CAN to Deye ----------------
canbus:
  - platform: esp32_can
    id: deye_can
    can_id: 0
    tx_pin: GPIO15
    rx_pin: GPIO16
    bit_rate: 500kbps

interval:
  - interval: 1s
    then:
      - lambda: |-
          const uint32_t now = millis();

          // ===== 1. SmartShunt: no fresh SOC → send nothing =====
          bool shunt_ok = id(shunt_last_ms) != 0 && (now - id(shunt_last_ms)) < ${shunt_timeout_min} * 60000UL
                          && id(shunt_voltage).has_state() && id(shunt_current).has_state()
                          && !std::isnan(id(shunt_soc).state) && !std::isnan(id(shunt_voltage).state);
          if (shunt_ok != id(sending)) {
            ESP_LOGW("deye", shunt_ok ? "SmartShunt OK – sending to Deye"
                                      : "SmartShunt silent – not sending to Deye (Deye: W31)");
            id(sending) = shunt_ok;
          }
          if (!shunt_ok) { id(mode_text) = "Off – SmartShunt silent"; return; }

          // ===== 2. Collect BMS data (fresh only) =====
          struct Bat { uint32_t last; sensor::Sensor *vmax, *vmin, *temp; binary_sensor::BinarySensor *chg, *dis; };
          Bat bats[3] = {
            { id(b1_last_ms), id(b1_vmax), id(b1_vmin), id(b1_temp), id(b1_chg), id(b1_dis) },
            { id(b2_last_ms), id(b2_vmax), id(b2_vmin), id(b2_temp), id(b2_chg), id(b2_dis) },
            { id(b3_last_ms), id(b3_vmax), id(b3_vmin), id(b3_temp), id(b3_chg), id(b3_dis) },
          };
          int n = 0, n_chg = 0, n_dis = 0;
          float vmax = 0, vmin = 99, tmin = 99;
          for (auto &b : bats) {
            if (b.last == 0 || (now - b.last) > ${bms_timeout_s} * 1000UL) continue;   // pack is silent
            if (std::isnan(b.vmax->state) || std::isnan(b.vmin->state)) continue;
            n++;
            vmax = std::max(vmax, b.vmax->state);
            vmin = std::min(vmin, b.vmin->state);
            if (!std::isnan(b.temp->state)) tmin = std::min(tmin, b.temp->state);
            if (b.chg->has_state() && b.chg->state) n_chg++;
            if (b.dis->has_state() && b.dis->state) n_dis++;
          }
          id(n_fresh) = n;

          // ===== 3. Calculate limits =====
          float t_ccl, t_dcl, temp = 25.0f;
          std::string reason = "nothing – full current";
          if (!id(control_on).state) {
            // Control off in HA: manual caps only
            t_ccl = id(max_charge_a).state;
            t_dcl = id(max_discharge_a).state;
            if (tmin < 99) temp = tmin;
            id(mode_text) = "Off – HA caps only";
            reason = "control off";
          } else if (n == 0) {
            // No BMS: fallback current
            t_ccl = t_dcl = id(fallback_a).state;
            id(mode_text) = "Fallback – no BMS data";
            reason = "fallback";
          } else {
            if (tmin < 99) temp = tmin;
            // a) number of packs × current of one
            t_ccl = n_chg * ${per_bat_a}.0f;
            t_dcl = n_dis * ${per_bat_a}.0f;
            if (n_chg < n) reason = "pack with charging off";
            // b1) high cell – controller with pause after a cut
            const float HI_MAX = 3 * ${per_bat_a}.0f;
            char hb[96] = "";
            if (vmax >= ${cell_hi_stop}f) {
              // hard cut – reacts immediately, does not wait for a step
              if (!id(hi_cut)) {
                id(hi_cap) = std::max(${restart_a}.0f, id(out_ccl) * 0.5f);
                id(hi_cut) = true;
                ESP_LOGW("deye", "Cell %.3f V – charging off, new cap %.0f A", vmax, id(hi_cap));
              }
              id(hi_cut_ms) = now; id(hi_below_ms) = 0; id(hi_lim) = 0;
            }
            if (id(hi_cut)) {
              // pause: at least pause_min and 60 s below cell_slow
              if (vmax < ${cell_slow}f) { if (id(hi_below_ms) == 0) id(hi_below_ms) = now; }
              else id(hi_below_ms) = 0;
              if ((now - id(hi_cut_ms)) >= ${pause_min} * 60000UL && id(hi_below_ms) != 0
                  && (now - id(hi_below_ms)) >= 60000UL) {
                id(hi_cut) = false;
                id(hi_lim) = ${restart_a}.0f;
                id(hi_step_ms) = now;
                ESP_LOGW("deye", "Pause over – restart from %d A (cap %.0f A)", ${restart_a}, id(hi_cap));
              } else {
                id(hi_lim) = 0;
                int left = (int) ((${pause_min} * 60000L - (long) (now - id(hi_cut_ms))) / 1000L);
                int left_lo = id(hi_below_ms) ? (int) ((60000L - (long) (now - id(hi_below_ms))) / 1000L) : 60;
                if (left > 0)
                  snprintf(hb, sizeof(hb), "pause after 3.60 V – %d s left (cell %.3f V)", left, vmax);
                else if (vmax >= ${cell_slow}f)
                  snprintf(hb, sizeof(hb), "pause – waiting for the cell to drop below 3.45 V (%.3f V)", vmax);
                else
                  snprintf(hb, sizeof(hb), "pause – cell %.3f V, restart in %d s", vmax, std::max(0, left_lo));
              }
            } else if ((now - id(hi_step_ms)) >= ${hi_step_s} * 1000UL) {
              // controller step once per hi_step_s (JK sends data once every 10 s)
              id(hi_step_ms) = now;
              // base = the current CURRENTLY sent to Deye (not the sum of packs)
              float l = std::min(id(hi_lim), id(out_ccl));
              if (vmax >= ${cell_hi_start}f) {
                float k = (vmax - ${cell_hi_start}f) / (${cell_hi_stop}f - ${cell_hi_start}f);   // 0…1
                l -= std::max(1.0f, l * k * ${down_max_pct} / 100.0f);
              }
              else if (vmax >= ${cell_slow}f)     { /* holds */ }
              else if (vmax >= ${cell_fast}f)     l += ${up_slow_a}.0f;
              else                                l = std::max(id(hi_lim), id(out_ccl)) + ${up_fast_a}.0f;
              id(hi_cap) = std::min(HI_MAX, id(hi_cap) + ${cap_release_a_min}.0f * ${hi_step_s} / 60.0f);
              id(hi_lim) = std::max(0.0f, std::min(l, id(hi_cap)));
            }
            if (!id(hi_cut) && id(hi_lim) < t_ccl) {
              const char *st = vmax >= ${cell_hi_start}f ? "falling" : vmax >= ${cell_slow}f ? "holding" : "rising";
              snprintf(hb, sizeof(hb), "high cell %.3f V – %s (%.0f A)", vmax, st, id(hi_lim));
            }
            if (hb[0]) reason = hb;
            t_ccl = std::min(t_ccl, id(hi_lim));

            // b2) low cell – linear reduction
            float f_lo = (vmin - ${cell_lo_stop}f) / (${cell_lo_start}f - ${cell_lo_stop}f);
            f_lo = std::max(0.0f, std::min(1.0f, f_lo));
            t_dcl *= f_lo;
            // c) cold – with hysteresis
            if (tmin < 99) {
              if (tmin < ${cold_off_c}.0f) id(cold_block) = true;
              else if (tmin >= ${cold_on_c}.0f) id(cold_block) = false;
            }
            if (id(cold_block)) { t_ccl = 0; char b[48]; snprintf(b, sizeof(b), "cold %.1f °C", tmin); reason = b; }
            char m[48]; snprintf(m, sizeof(m), "BMS (%d/3 packs)", n);
            id(mode_text) = m;
          }
          // d) never above the HA caps
          t_ccl = std::max(0.0f, std::min(t_ccl, id(max_charge_a).state));
          t_dcl = std::max(0.0f, std::min(t_dcl, id(max_discharge_a).state));
          if (t_ccl >= id(max_charge_a).state && reason == "nothing – full current") reason = "HA cap";
          id(reason_text) = reason;

          // down immediately, up slowly
          id(out_ccl) = (t_ccl < id(out_ccl)) ? t_ccl : std::min(t_ccl, id(out_ccl) + ${ramp_up_a_s}.0f);
          id(out_dcl) = (t_dcl < id(out_dcl)) ? t_dcl : std::min(t_dcl, id(out_dcl) + ${ramp_up_a_s}.0f);
          id(out_temp) = temp;

          // ===== 4. Send to Deye (Pylon, little-endian) =====
          auto le16 = [](std::vector<uint8_t> &d, int v) { d.push_back(v & 0xFF); d.push_back((v >> 8) & 0xFF); };
          int cvl = (int) lroundf(id(charge_voltage).state * 10);   // 0,1 V
          int ccl = (int) lroundf(id(out_ccl) * 10);                // 0,1 A
          int dcl = (int) lroundf(id(out_dcl) * 10);
          std::vector<uint8_t> d351; le16(d351, cvl); le16(d351, ccl); le16(d351, dcl); le16(d351, 470);
          id(deye_can)->send_data(0x351, false, d351);

          int soc = std::max(0, std::min(100, (int) lroundf(id(shunt_soc).state)));
          std::vector<uint8_t> d355; le16(d355, soc); le16(d355, 100); le16(d355, 0); le16(d355, 0);
          id(deye_can)->send_data(0x355, false, d355);

          std::vector<uint8_t> d356;
          le16(d356, (int) lroundf(id(shunt_voltage).state * 100));   // 0,01 V
          le16(d356, (int) lroundf(id(shunt_current).state * 10));    // 0,1 A
          le16(d356, (int) lroundf(temp * 10));                       // 0,1 °C
          le16(d356, 0);
          id(deye_can)->send_data(0x356, false, d356);

          uint8_t flags = 0;
          if (ccl > 0) flags |= 0x80;   // charging allowed
          if (dcl > 0) flags |= 0x40;   // discharging allowed
          std::vector<uint8_t> d35c = {flags, 0};
          id(deye_can)->send_data(0x35C, false, d35c);```

Flash the firmware over USB-C the first time, later changes go over Wi-Fi.

### What you'll see in Home Assistant

The ESP sends HA the sensors of all three BMS, the SmartShunt and what it's currently sending to Deye: the sent charge and discharge current, the **mode** ("BMS (3/3 packs)", "Fallback…"), **what limits charging** ("high cell 3.597 V – falling", "pause after 3.60 V – 298 s left", "cold 4.2 °C") and the number of packs with data.

You can control:

- **Charge / discharge current cap** – Deye never gets more,
- **Fallback current when BMS is silent** – 0 to 100 A,
- **Deye charge voltage** – 52 to 58 V (plus a voltage-per-cell sensor),
- the **Control limits by BMS** switch – when off, only the caps are sent. After an ESP restart it turns itself back on.

For an overview I use my own **igy-battery-card** from the [igy-cards](https://github.com/Igypop78/igy-cards) bundle (from version 1.8.0) – it shows the SmartShunt, what goes to the inverter and a BMS table with the highest and lowest cell. I also have an automation that notifies me when the ESP starts limiting Deye.

## Deye settings

In the inverter's battery settings switch to:

- **battery type: Lithium**,
- **protocol: 00** (Pylontech CAN).

Within a minute the display should show the SOC and battery data ("LiBms: PYLON"). If not, check for swapped H and L, the 120 Ω jumper and the ESPHome log.

:::tip Set sensible values in Deye too
On a communication error (W31) Deye uses its own battery settings. So don't leave them at maximum – they are your backup when the ESP or the SmartShunt drops out.
:::

## Limitations

To be fair, what this solution is not:

- **Bluetooth** to the JK BMS (data once every 10 s) is slower and less reliable than a cable (RS485). Fast protection is therefore always done by the BMS.
- **The thresholds** are tuned for LFP 16S and my batteries.
- The code **doesn't yet end charging by tail current** and has no "unbalanced battery" flag – that's the next step.
- BMS alarms are not sent to Deye yet (`0x359`) – Deye only sees limits and charge/discharge flags.
- Tested on one house. **It is not a replacement for BMS protections** – it's an extra layer.

## Result

Deye has an **accurate SOC from the SmartShunt** (or a chosen BMS) and the charge current follows the real state of all 48 cells. When a cell runs high, the current drops smoothly before the BMS cuts off hard – and when something fails, the ESP switches to a careful mode or stops sending altogether. All for a €24 board and a few evenings of tuning.

You'll find more ESP32 projects in [ESP32 – the few-euro chip that solved the most in my house](/en/diy/esp32-my-projects/). If something doesn't work for you, [write to me](/en/about/).
