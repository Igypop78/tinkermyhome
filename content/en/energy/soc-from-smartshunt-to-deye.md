---
id: deye-soc
cover: /img/clanky/titulky/deye-soc.jpg
title: Accurate SOC in a Deye inverter – Victron SmartShunt via a €24 ESP32
description: How I got the exact battery state of charge from a Victron SmartShunt into a Deye inverter with an ESP32 and the CAN bus – cable wiring, pairing with the SmartShunt and ready-to-use ESPHome code.
section: energy
level: 2
date: 2026-11-16
updated: 2026-11-18
time: '20:00'
slug: soc-from-smartshunt-to-deye
tldr: 'After weeks without a full charge, the BMS in my batteries **showed an SOC that had little to do with reality**. The accurate one is the **Victron SmartShunt** – but it can't talk to a Deye inverter. A **€24 Waveshare ESP32-S3-RS485-CAN** board fixed that: it reads the SmartShunt over Bluetooth, pretends to be a **Pylontech** battery and sends the data to the inverter over **CAN**. The Deye now runs in **Lithium** mode with an accurate SOC. Wiring, pairing and code are below. **Warning: this is a risky setup for now – the inverter can't see the BMS status. I'm working on a version with BMS data.**'
---

:::warn Risky setup – work in progress
In this version the inverter **knows nothing about the batteries** except SOC, voltage and current from the SmartShunt. The ESP sends a fixed temperature, fixed 200 A limits and always "no alarm". If the BMS of one battery disconnects it (e.g. over-temperature), the inverter doesn't know, raises no alarm and may keep pushing full current into the remaining batteries.

That's why I **don't recommend copying this into a production system** until the version where the ESP uses real BMS data is done (see [Next step](#next-step-data-from-the-bms)). For now, treat this article as a description of an experiment, not a finished guide.
:::

Since I built my solar setup, one thing has bugged me: **how to get the right battery state of charge (SOC) into the inverter**.

My batteries are DIY LiFePO4 packs with **JK BMS**. The JK BMS speaks the **Pylontech** protocol, so sending the SOC from the BMS to the inverter is possible. But the number wasn't reliable – especially in winter.

## Why the BMS SOC drifts

A BMS calculates SOC by adding up the current flowing in and out of the battery. A small measurement error adds up day after day. It only gets corrected when the battery reaches **100 %** – the BMS then knows for sure it's full and resets the counter.

In winter, though, the battery rarely gets to 100 %. After a few weeks **the SOC had little to do with reality**. It's a well-known issue with cheaper BMSs – their current measurement simply isn't built for this.

## Four ways to solve it

| Method | How it works | The catch |
|---|---|---|
| **SOC from the BMS over CAN/RS485** | the BMS sends SOC in the Pylontech protocol, inverter runs in Lithium mode | SOC drifts without regular full charges |
| **Inverter calculates SOC itself (% mode)** | the Deye estimates SOC from its own voltage and current readings | also inaccurate, the error builds up over time |
| **Voltage mode + Home Assistant** | inverter manages the battery by voltage, HA changes settings in the background based on the SmartShunt | complex, HA must always run, the inverter itself doesn't "know" how much is in the battery |
| **SmartShunt → ESP32 → inverter** | the ESP reads the SmartShunt and pretends to be a Pylontech battery | needs an ESP and a few minutes of wiring – this article |

That's why I didn't use Lithium mode on the Deye. At first I ran the **percentage mode**, where the inverter calculates SOC itself – but that wasn't accurate either.

Then I found the **Victron SmartShunt**. It goes into the negative line between the battery and the inverter and measures current, voltage and power very precisely. And of course SOC – which was **surprisingly accurate even after several weeks** without a full charge.

The catch: the SmartShunt is built for the Victron ecosystem. It connects over **VE.Direct** and can also be read over **Bluetooth** – but the Deye inverter doesn't understand it.

My first solution went through Home Assistant. The inverter had the battery in **voltage mode (V)** and HA decided when to stop discharging or charging based on the SmartShunt, changing the inverter settings in the background. It worked, but it was a workaround.

That kept bugging me. Since AI had already helped me solve many things, I asked how to get the SmartShunt data straight into the Deye. Both the answer and the build turned out **surprisingly quick and cheap**.

:::me How I have it
Inverter **Deye SUN-10K-SG04LP3-EU**, LiFePO4 battery ~34 kWh (2 × 280 Ah + 1 × 105 Ah, each with its own JK BMS), and the whole bank is measured by one **Victron SmartShunt 300 A**. The SmartShunt is my source of truth – my [AI Energy](/en/projects/ai-energy/) uses it too. The JK BMSs stay in the batteries as protection and I read their data into HA over Bluetooth.
:::

## What you need

- a **Victron SmartShunt** in the battery negative (mine is the 300 A / 50 mV version),
- a **Waveshare ESP32-S3-RS485-CAN** – an industrial DIN-rail board with CAN and RS485, 7–36 V supply. Mine cost **€24**,
- **a piece of LAN cable** with an RJ45 plug on one end,
- **ESPHome** (Home Assistant add-on or in the browser) and a USB-C cable for the first flash.

The board reads the SmartShunt over Bluetooth, **translates the data into the Pylontech standard** and sends it to the inverter over CAN. It's powered straight from the **12 V output on the Deye terminal block**, so it needs no power supply of its own.

## How to wire the cable

![Wiring diagram SmartShunt → ESP32-S3 → Deye](/img/clanky/deye-soc-zapojenie-en.svg)

1. **Cable to the inverter.** Take a LAN cable (T568B), keep the RJ45 plug on one end and plug it into the **BMS** port on the Deye. Cut off the other end. Leave the other wires unconnected and insulate them.
2. **CAN.** You only need two wires:
   - pin **4 – blue** → terminal **H** (CAN-H) on the Waveshare board,
   - pin **5 – white-blue** → terminal **L** (CAN-L).
3. **Termination.** Turn on the **120 Ω jumper** on the Waveshare board. The ESP is at the end of the CAN bus and without termination communication may be unreliable.
4. **Power.** Run + and − from the **12 V output on the Deye terminal block** to the board's power terminals (DC 7–36 V).

:::warn Work with the inverter switched off
The terminal block with the 12 V output is inside the inverter, where there are also dangerous voltages from the battery, panels and grid. Switch the inverter off (AC, PV and battery) before opening it and wait for the capacitors to discharge. If you're not sure, get an electrician to do it.
:::

## How to pair the ESP with the SmartShunt

The SmartShunt broadcasts its data over Bluetooth **encrypted**. To read it, the ESP needs two things: the SmartShunt's **MAC address** and the **encryption key** (bindkey). You'll find both in the **VictronConnect** app:

1. Connect to the SmartShunt in the app.
2. Tap the **gear icon** (settings), then the **three dots** in the top right → **Product info**.
3. Turn on **Instant readout via Bluetooth**.
4. Next to **Instant readout details**, tap **Show** – the MAC address and encryption key appear.

Save both into `secrets.yaml` in ESPHome – **write the MAC without colons, in lowercase**:

```yaml secrets.yaml
wifi_ssid: "MyWiFi"
wifi_password: "wifi-password"
smartshunt_mac: "aabbccddeeff"
smartshunt_bindkey: "paste-the-32-character-key-from-the-app"
```

:::tip Don't share the key
Anyone with the encryption key can read your battery data. Don't post it in forums, on GitHub or in messages to an AI – that's why it lives in `secrets.yaml`, not in the code itself.
:::

## ESPHome code

This is the configuration running at my place. The [victron_ble](https://github.com/Fabian-Schmidt/esphome-victron_ble) component reads the SmartShunt, and every second five messages in the Pylontech protocol go to the Deye.

```yaml esp-can.yaml
esphome:
  name: esp-can
  friendly_name: ESP CAN
  min_version: 2026.4.0
  name_add_mac_suffix: false

esp32:
  variant: esp32s3
  framework:
    type: esp-idf

external_components:
  - source: github://Fabian-Schmidt/esphome-victron_ble

logger:
  level: DEBUG

api:

ota:
  - platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

esp32_ble_tracker:

victron_ble:
  - mac_address: !secret smartshunt_mac
    bindkey: !secret smartshunt_bindkey
    id: my_shunt

sensor:
  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_voltage
    id: shunt_voltage
    name: "SmartShunt Napätie"

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_current
    id: shunt_current
    name: "SmartShunt Prúd"

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: state_of_charge
    id: shunt_soc
    name: "SmartShunt SOC"

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_power
    id: shunt_power
    name: "SmartShunt Výkon"

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
          if (id(shunt_voltage).has_state() && id(shunt_soc).has_state() && id(shunt_current).has_state()) {
            // 1. CAN ID 0x351 - Limity (CVL 56.8V, CCL 200A, DCL 200A, DVL 47.0V)
            uint16_t cvl = 568;
            uint16_t ccl = 2000;
            uint16_t dcl = 2000;
            uint16_t dvl = 470;

            std::vector<uint8_t> data1 = {
              uint8_t(cvl & 0xFF), uint8_t((cvl >> 8) & 0xFF),
              uint8_t(ccl & 0xFF), uint8_t((ccl >> 8) & 0xFF),
              uint8_t(dcl & 0xFF), uint8_t((dcl >> 8) & 0xFF),
              uint8_t(dvl & 0xFF), uint8_t((dvl >> 8) & 0xFF)
            };
            id(deye_can)->send_data(0x351, false, data1);

            // 2. CAN ID 0x355 - SOC a SOH
            uint16_t soc = (uint16_t)(id(shunt_soc).state);
            uint16_t soh = 100;

            std::vector<uint8_t> data5 = {
              uint8_t(soc & 0xFF), uint8_t((soc >> 8) & 0xFF),
              uint8_t(soh & 0xFF), uint8_t((soh >> 8) & 0xFF),
              0, 0, 0, 0
            };
            id(deye_can)->send_data(0x355, false, data5);

            // 3. CAN ID 0x356 - Reálne hodnoty (Napätie, Prúd, Teplota)
            uint16_t real_voltage = (uint16_t)(id(shunt_voltage).state * 100.0);
            int16_t real_current = (int16_t)(id(shunt_current).state * 10.0);
            int16_t real_temp = 250;

            std::vector<uint8_t> data6 = {
              uint8_t(real_voltage & 0xFF), uint8_t((real_voltage >> 8) & 0xFF),
              uint8_t(real_current & 0xFF), uint8_t((real_current >> 8) & 0xFF),
              uint8_t(real_temp & 0xFF), uint8_t((real_temp >> 8) & 0xFF),
              0, 0
            };
            id(deye_can)->send_data(0x356, false, data6);

            // 4. CAN ID 0x359 - Alarmy (všetko OK)
            std::vector<uint8_t> data9 = {0, 0, 0, 0, 0, 0, 0, 0};
            id(deye_can)->send_data(0x359, false, data9);

            // 5. CAN ID 0x35E - Identifikátor batérie
            std::vector<uint8_t> dataE = {'P', 'Y', 'L', 'O', 'N', ' ', ' ', ' '};
            id(deye_can)->send_data(0x35E, false, dataE);
          }
```

Flash it over USB-C the first time; later changes go over WiFi. The SmartShunt sensors also show up in Home Assistant – so you don't need any other Victron integration.

### What gets sent to the Deye

| CAN ID | Content | My values |
|---|---|---|
| `0x351` | battery limits | charge voltage 56.8 V, charge and discharge max. 200 A, minimum voltage 47.0 V |
| `0x355` | state of charge | SOC from the SmartShunt, state of health (SOH) 100 % |
| `0x356` | measured values | voltage and current from the SmartShunt, temperature fixed at 25 °C |
| `0x359` | alarms and protections | all OK |
| `0x35E` | manufacturer | `PYLON` |

Adjust the limits to your battery. I set the current to **200 A** so the Deye can charge the battery from the grid at the full **10 kW** – I need that for spot-price arbitrage.

## Deye settings

In the inverter's battery settings, set:

- **battery type: Lithium**,
- **protocol: 00** (Pylontech CAN).

Within a minute the display should show the SOC and battery data. If not, check for swapped H and L, the 120 Ω jumper, and whether the ESPHome log shows data from the SmartShunt.

## Things to watch out for

- **The inverter charges blind.** The ESP always tells the inverter "all OK" and sends fixed limits. The inverter knows nothing about cell over- or undervoltage, temperature or a disconnected battery. Example: I have 3 batteries in parallel. When the BMS of one of them disconnects it, the inverter raises no alarm and keeps sending up to 200 A into the other two. This is the main reason this setup is risky for now.
- **The temperature is fixed.** The Deye always gets 25 °C. If your battery is in an unheated garage, the BMS must stop charging in freezing temperatures.
- **Bluetooth dropouts.** When the ESP stops receiving SmartShunt data, it keeps sending the last known values to the inverter. At my place the BMS covers this for now – if cell voltages leave the safe range, it disconnects the battery. I plan to add a safeguard directly in the ESP (stop sending when the data is stale).
- **Other inverters.** This should work the same with any inverter that supports Pylontech batteries over CAN (e.g. GoodWe, Growatt, Solis). Check the BMS port pinout in your inverter's manual, though.

## Next step: data from the BMS

My JK BMSs have an inverter output (Pylontech protocol over CAN/RS485) and run in parallel – one master collects data from the others. The plan:

- the master BMS sends its data to the ESP (the Waveshare board has both CAN and RS485, so one port is the input and the other the output),
- the ESP **replaces only the SOC** with the SmartShunt value – alarms, temperatures, current limits and charge/discharge enable go to the inverter exactly as the BMS sends them,
- when the ESP stops getting fresh data from the BMS or the SmartShunt, it **stops sending** and the inverter reports a battery communication fault,
- I'm also considering connecting the SmartShunt via **VE.Direct** (with galvanic isolation) instead of Bluetooth.

Once it's done and tested, I'll update this article.

## The result

The Deye finally has an **accurate SOC** and runs in **Lithium** mode – no workaround through voltage mode, and Home Assistant doesn't have to keep changing inverter settings in the background. **A €24 device solved a problem I'd been painfully working around** – but until the version with BMS data is finished, it's an experiment, not something to copy.

You'll find more ESP32 projects in [ESP32 – the few-euro chip that solved the most in my house](/en/diy/esp32-my-projects/). If something doesn't work for you, [get in touch](/en/about/).
