---
id: water-gas-esp
cover: /img/clanky/titulky/voda-plyn-en.jpg
title: Water and gas metering with an ESP32 – your utility meters in Home Assistant for a few euros
description: How I read pulses from an ordinary water meter with an inductive sensor and from the gas meter with a reed sensor, how to wire them to an ESP32, mount them without touching the meter and get usage, flow and gas power into the Home Assistant Energy dashboard.
section: diy
also: energy
level: 2
date: 2026-11-25
time: '21:00'
slug: water-and-gas-metering-esp32
tldr: 'Water and gas metering with an ESP32 won the poll, so here is the guide. I read the water meter with an **inductive sensor** (every turn of the wheel with a metal plate = 1 litre) and the gas meter with a **reed sensor** (magnet on the last wheel = 0.01 m³). The ESP32 counts the pulses and sends **usage, water flow and gas power in kW** to Home Assistant. You don’t touch the meter, the parts cost **a few euros** – most of the time goes into finding the right sensor position. It has been working like this for me **for several years**.'
---

In the [poll under the ESP32 article](/en/diy/esp32-my-projects/) you were clear: the first guide should be **water and gas metering**. I get it – it is one of the projects with the best value for money. For a few euros you get readings from the utility meters in Home Assistant, live water flow and the power your boiler is burning right now.

Why measure it at all is covered in [Where to start a smart home? Metering electricity, water and gas](/en/energy/start-with-energy-metering/). This one is pure practice: parts, wiring, code and above all **how to mount the sensor**, because that is the tricky part.

:::me How I do it
I read the **utility water and gas meters** directly. The water meter has an **inductive proximity sensor**, the gas meter a **reed magnetic sensor**. I started on an **ESP32 DevKit (NodeMCU)** board, then moved to an **ESP32-C6** over Wi-Fi, and today it runs in my **Zigbee** network. I don’t cover the Zigbee version here – this guide is for Wi-Fi and ESPHome. Measured like this, it has worked for me **for several years**.
:::

## How water and gas metering with an ESP32 works

Both meters have a **rotating wheel** inside. You don’t need to open or dismantle anything – you just catch from the outside **when it turns**:

- The **water meter** (usually) has a wheel with a **metal plate**. The inductive sensor notices the metal when it passes underneath. For me **1 turn = 1 litre**.
- The **gas meter** has a **magnet** on the last wheel of the counter. The reed sensor picks up its field. On my gas meter **1 turn = 0.01 m³** (the manufacturer prints it right on the label, e.g. “1 pulse = 0.01 m³”).

The ESP32 adds every pulse to a counter, works out the flow from the time between pulses and sends everything to Home Assistant over Wi-Fi.

![How it works: water meter → inductive sensor → logic level converter → ESP32; gas meter → reed module → ESP32; ESP32 → Home Assistant → Energy dashboard](/img/clanky/voda-plyn-princip-en.svg)

## What you need

- **ESP32** – I started on a classic **ESP32 DevKit (NodeMCU)** board and the code below is for it. More about ESP32 variants in the [ESP32 article](/en/diy/esp32-my-projects/#which-esp-to-buy).
- An **inductive proximity sensor** that already works from **5 V** (for water).
- A **5 V / 3.3 V logic level converter** (for water).
- A **reed module** – a magnetic field sensor (for gas).
- A **5 V USB supply** for the ESP, cables and jumper wires, a soldering iron.
- **Patience.** I mean it – the wiring takes an hour, finding the right sensor position can take days.

Water and gas together cost me about **€30**.

## Water metering

### Find out what water meter you have

Do this first, before buying anything. **Standard utility water meters** have a small wheel in the dial with part of its surface **made of metal**. Yours may not.

![Sensus utility water meter with the lid open – dial with pointers and small wheels](/img/clanky/voda-plyn-vodomer.jpg)

If you do have the metal wheel, find out **how many litres one turn is** – 1 l, 10 l…? If you can’t read it from the dial or the meter’s documentation, run, say, 10 litres into a bucket and count the turns. For me it is **1 litre**. You will need this number in the code.

:::tip Water meter with a pulse output
Some water meters have a **ready-made pulse output** (a cable or a spot for the manufacturer’s sensor). It is rather rare, but if you have one, you skip all the position tuning – just wire the output in place of the sensor.
:::

### Test the inductive sensor

The inductive sensor has **three wires**: plus, minus and signal. It works simply – when there is **a metal object nearby**, it switches on (or off) and a voltage appears on (or disappears from) the signal wire. Whether it switches on or off depends on the version – **NO** (normally open) or **NC** (normally closed). The output type is usually on the sensor’s label.

Every switch = one turn of the wheel = **1 litre** for me.

![Inductive proximity sensor with a cable – the LED at the end lights up near metal](/img/clanky/voda-plyn-indukcny-snimac.jpg)

Before you solder anything, test it: connect the sensor to **5 V** and hold a metal object (a key, a screwdriver) to it. **The LED on the sensor should light up.** If it does, the sensor is fine.

### Why a logic level converter

You can power the ESP32 from 5 V, but its **inputs (GPIO) only take 3.3 V**. The signal from the sensor is 5 V, so it needs a “reducer” in between – a **5 V / 3.3 V logic level converter**. This takes a bit of soldering, but it’s doable.

![5 V / 3.3 V logic level converter – HV side for 5 V, LV side for 3.3 V, two channels](/img/clanky/voda-plyn-konvertor.jpg)

The **HV** side is the 5 V world (sensor), the **LV** side the 3.3 V world (ESP). Connect the sensor signal to a channel input on the HV side and go from the output of **the same channel** on the LV side to the ESP pin. On the board in the photo that is the **RXI → RXO** direction (the green and blue arrows go from 5 V to 3.3 V).

:::warn Without a converter you risk the ESP
For a while it ran without the converter and it worked. But 5 V on an ESP input is out of spec and you can **fry the ESP**. The converter costs a few cents – don’t skip it.
:::

### Wiring

![Wiring: inductive sensor (brown +5 V, blue GND, black signal) through the logic level converter to GPIO27 of the ESP32; reed module (+ 3.3 V, G, D0) directly to GPIO14](/img/clanky/voda-plyn-zapojenie-en.svg)

- **Sensor:** plus to 5 V, minus to GND, signal to the converter’s **HV** input. Wire colours are usually brown (+), blue (−), black (signal) – check the label.
- **Converter:** HV to **5 V** (the 5V or VIN pin on the ESP), LV to **3.3 V** (3V3 pin), GND to GND.
- **Converter output** (LV side) to the ESP pin of your choice – **GPIO27** in my code.

:::info Which pin to choose
On an ESP32 DevKit board, safe inputs with an internal pull-up resistor include **GPIO 13, 14, 16–19, 21–23, 25–27, 32 and 33**. Avoid pins **0, 2, 5, 12 and 15** (they affect ESP boot), **6–11** (flash) and **34–39** (no internal pull-up). I originally had water on GPIO5 and ESPHome warned me on every upload – that’s why the code below uses GPIO27.
:::

### How to mount the sensor on the water meter

This is the **tricky part**. And one rule to start with:

:::warn Don’t physically tamper with the water meter
The water meter is a billing instrument – don’t drill into it, don’t glue anything inside, don’t remove seals. The construction must be **non-invasive**: the sensor only rests on the glass from the outside and the holder grips around the meter or the pipe.
:::

![Sensor placement: inductive sensor perpendicular on the glass right above the metal wheel, holder around the water meter; reed tube in the recess under the last wheel of the gas meter, perpendicular in my case](/img/clanky/voda-plyn-umiestnenie-en.svg)

Whether you use a **3D print** or a **metal bracket** is up to you. What matters is that the sensor **touches the glass right above the wheel** and sits exactly over it.

1. Move the sensor into a position where **the LED is on** (the metal plate is underneath).
2. Run water and watch the LED **blink** – it goes off and on with every turn.
3. If it blinks reliably at both low and high flow, you’ve got it.

This tuning took me a while, so give it time. One millimetre makes a difference.

:::tip Sensor doesn’t pick up the signal?
Inductive sensors have a shorter range at 5 V than at higher voltage. If you can’t “catch” the metal through the glass, **a higher supply (e.g. 12 V)** may help. But then the sensor needs its **own power supply** and a **logic level converter that can handle 12 V** – an ordinary 5 V / 3.3 V converter won’t do.
:::

## Gas metering

### Magnet in the last wheel

Most gas meters have a **magnet in the last wheel of the counter**. And underneath that part there is usually a **recess** that fits a sensor – manufacturers expect someone to read the pulses.

![Elster BK-G4 gas meter – the label says “1 pulse = 0.01 m³”, the last counter wheel is highlighted](/img/clanky/voda-plyn-plynomer.jpg)

You can buy the manufacturer’s original sensor or make one yourself. The principle is the same as for water – read every turn of the wheel. Only the sensor is different: **a reed sensor works for me**.

### Reed module

A reed sensor is a glass tube with two contacts that close near a magnet. On a module it also has **three wires** (+, −, signal), and the advantage is that powered from 3.3 V it **outputs 3.3 V directly**. So no converter needed here.

![Reed module with a glass tube, a potentiometer and four pins A0, G, +, D0](/img/clanky/voda-plyn-reed-modul.jpg)

Wiring: **+ to 3V3**, **G to GND**, **D0 to a pin of your choice** – **GPIO14** in my code (see the diagram above). You don’t need the A0 (analogue) pin.

### What I did differently

- I **carefully desoldered the glass tube** from the module board (it breaks easily!) and connected it to a **longer wire**.
- I **put the module board behind the gas meter** and placed **only the tube** in the reading recess.
- It worked most reliably when I placed it **not horizontally with the wheel, but – paradoxically – perpendicular**. It made no sense to me, but it works. So play with the position yourself.

The tube is light, so you can **tape it in place** or **3D print a holder**. The rest is 1 : 1 like water: pick a pin, edit the code, upload and test.

## ESPHome code

How to upload code to an ESP and get the ESP into Home Assistant is all over the internet – there are plenty of guides and no point in writing another. There’s a short version in the [ESP32 article](/en/diy/esp32-my-projects/) too. And if you don’t feel up to it, feel free to use an **AI assistant** – there isn’t much you can break.

In the code, mainly change the `substitutions` section at the top:

- the **pins** you wired the sensors to,
- **how many m³ one pulse is** (water 1 l = `0.001`, gas from the label, `0.01` for me),
- the **gas factor** in kWh per m³ – I use 11; the exact value (gross calorific value) is on your gas supplier’s bill.

Wi-Fi details and passwords belong in `secrets.yaml`, not in the code. If ESPHome generated an encryption key in the `api:` section when you created the device (`encryption: key:`), keep it there.

```yaml water-gas.yaml
substitutions:
  name: esp-water-gas
  friendly_name: Water and gas
  # Pins – change to wherever you wired the sensors
  water_pin: GPIO27       # water meter (logic level converter output)
  gas_pin: GPIO14         # gas meter (reed module D0)
  # How many m³ one pulse is
  water_pulse: "0.001"    # 1 turn = 1 litre
  gas_pulse: "0.01"       # from the gas meter label
  # Gas to energy conversion (calorific value from your bill)
  kwh_per_m3: "11.0"

esphome:
  name: ${name}
  friendly_name: ${friendly_name}
  comment: Water and gas metering (+ Bluetooth proxy)
  min_version: 2024.6.0
  name_add_mac_suffix: false

esp32:
  board: esp32dev
  framework:
    type: esp-idf

logger:

api:

ota:
  - platform: esphome

improv_serial:

wifi:
  fast_connect: true
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:
    ssid: "ESP Water Gas"
    password: !secret ap_password

captive_portal:

web_server:

# Optional: besides metering, the ESP also works as a Bluetooth proxy for Home Assistant
esp32_ble_tracker:
  scan_parameters:
    active: true

bluetooth_proxy:
  active: true

button:
  - platform: safe_mode
    name: Safe Mode Boot
  - platform: factory_reset
    name: Factory reset

# =====================
# COUNTERS (meter readings)
# Visible in HA under the device configuration – set once to match the meter
# =====================
number:
  - platform: template
    name: Water meter reading
    id: water_meter
    entity_category: config
    mode: box
    min_value: 0
    max_value: 10000000
    step: ${water_pulse}
    restore_value: true
    optimistic: true
    unit_of_measurement: "m³"
    icon: "mdi:water"

  - platform: template
    name: Gas meter reading
    id: gas_meter
    entity_category: config
    mode: box
    min_value: 0
    max_value: 10000000
    step: ${gas_pulse}
    restore_value: true
    optimistic: true
    unit_of_measurement: "m³"
    icon: "mdi:fire"

# =====================
# GLOBALS
# =====================
globals:
  - id: last_water_reading
    type: float
    restore_value: no
    initial_value: '-1.0'     # -1 = nothing to compare with yet after boot

  - id: water_flow_lpm
    type: float
    restore_value: no
    initial_value: '0.0'

  - id: last_gas_pulse_time
    type: uint32_t
    restore_value: no
    initial_value: '0'

  - id: gas_flow_m3h
    type: float
    restore_value: no
    initial_value: '0.0'

# =====================
# PULSES FROM THE SENSORS
# Shown in HA as binary sensors – handy for the first test
# =====================
binary_sensor:
  - platform: gpio
    name: Water pulse
    pin:
      number: ${water_pin}
      mode: INPUT_PULLUP
    filters:
      - delayed_on: 50ms
      - delayed_off: 50ms
    on_press:
      then:
        - number.increment:
            id: water_meter
            cycle: true

  - platform: gpio
    name: Gas pulse
    pin:
      number: ${gas_pin}
      mode: INPUT_PULLUP
    filters:
      - delayed_on: 50ms
      - delayed_off: 50ms
    on_press:
      then:
        - number.increment:
            id: gas_meter
            cycle: true
        - lambda: |-
            uint32_t now = millis();
            if (id(last_gas_pulse_time) > 0) {
              float dt_h = (now - id(last_gas_pulse_time)) / 3600000.0;  // time between pulses in hours
              if (dt_h > 0) {
                id(gas_flow_m3h) = ${gas_pulse} / dt_h;                 // m³/h
              }
            }
            id(last_gas_pulse_time) = now;

# =====================
# SENSORS FOR HOME ASSISTANT
# =====================
sensor:
  - platform: template
    name: Water usage
    id: water_total
    unit_of_measurement: "m³"
    accuracy_decimals: 3
    device_class: water
    state_class: total_increasing
    lambda: return id(water_meter).state;
    update_interval: 15s

  - platform: template
    name: Water flow
    id: water_flow
    unit_of_measurement: "L/min"
    device_class: volume_flow_rate
    state_class: measurement
    accuracy_decimals: 1
    lambda: return id(water_flow_lpm);
    update_interval: 15s

  - platform: template
    name: Gas usage
    id: gas_total
    unit_of_measurement: "m³"
    accuracy_decimals: 2
    device_class: gas
    state_class: total_increasing
    lambda: return id(gas_meter).state;
    update_interval: 15s

  - platform: template
    name: Gas flow
    id: gas_flow
    unit_of_measurement: "m³/h"
    device_class: volume_flow_rate
    state_class: measurement
    accuracy_decimals: 3
    lambda: return id(gas_flow_m3h);
    update_interval: 10s

  - platform: template
    name: Gas power
    id: gas_power
    unit_of_measurement: "kW"
    device_class: power
    state_class: measurement
    accuracy_decimals: 2
    force_update: true
    lambda: return id(gas_flow_m3h) * ${kwh_per_m3};   // m³/h × kWh/m³ = kW
    update_interval: 10s

# =====================
# PERIODIC CALCULATIONS
# =====================
interval:
  # Water flow – change in reading over 15 s converted to litres per minute
  - interval: 15s
    then:
      - lambda: |-
          float current = id(water_meter).state;
          if (isnan(current)) return;
          if (id(last_water_reading) < 0) {          // first run after boot – just remember the reading
            id(last_water_reading) = current;
            return;
          }
          float flow = (current - id(last_water_reading)) * 4.0 * 1000.0;  // m³ per 15 s → L/min
          id(water_flow_lpm) = flow > 0 ? flow : 0;  // lowering the reading by hand gives no negative flow
          id(last_water_reading) = current;

  # Gas – no pulse for 3 minutes means flow and power are 0
  - interval: 60s
    then:
      - lambda: |-
          if (id(last_gas_pulse_time) > 0) {
            float minutes_since_last = (millis() - id(last_gas_pulse_time)) / 60000.0;
            if (minutes_since_last > 3.0) {
              id(gas_flow_m3h) = 0.0;
            }
          }
```

And in `secrets.yaml` in ESPHome:

```yaml secrets.yaml
wifi_ssid: "YourNetworkName"
wifi_password: "YourWiFiPassword"
ap_password: "FallbackHotspotPassword"
```

:::info What I changed compared to the version I was running
- The **fallback Wi-Fi password** (`ap:`) is in `secrets.yaml` – in my original code it was right in the text.
- **Water flow after a reboot** – after boot the ESP compared against a previous reading of 0, so the first calculation showed a nonsensically huge flow. Now it just remembers the first reading.
- **Water moved from GPIO5 to GPIO27** – GPIO5 affects ESP boot.
- **The counters are visible in HA** – they used to be hidden (`internal: true`), so you couldn’t set the starting reading to match the meter.
- **Gas flow in m³/h** instead of m³/min and water flow in **L/min** – units Home Assistant knows. Gas power comes out the same.
:::

## First test

Once the code is uploaded and you see the device in Home Assistant, it’s time for the first test – still **on the desk**, not on the meter:

1. Open the device in HA and find **Water pulse** and **Gas pulse**.
2. Hold a **metal object** to the inductive sensor and a **magnet** to the reed sensor.
3. The pulse should toggle and **Water usage** should go up by 0.001 m³ (**Gas usage** by 0.01 m³) each time.

If it does, you’ve got it. Only then mount the sensors on the meters and tune the position.

## Home Assistant and the Energy dashboard

In Home Assistant you’ll see these sensors:

| Sensor | What it shows |
|---|---|
| **Water usage** | total reading in m³ |
| **Water flow** | current flow in L/min (calculated every 15 s) |
| **Gas usage** | total reading in m³ |
| **Gas flow** | current flow in m³/h |
| **Gas power** | the power your boiler is burning right now, in kW |

You can create helpers, such as daily usage. But if you add **Water usage** and **Gas usage** to the **Energy dashboard**, it does that for you – daily, weekly and monthly usage. And if you also enter the **price per m³** in the Energy settings (for water, supply + sewage), you see the usage straight **in euros**.

![Water usage in the Energy dashboard for October 2026 – one bar per day, 17.81 m³ in total (screenshot from my HA)](/img/clanky/voda-plyn-ha-spotreba-oktober.png)

![Water summary for October 2026 in the Energy dashboard: 17.81 m³ for €58.32](/img/clanky/voda-plyn-ha-naklady-oktober.png)

In October that was **17.81 m³ of water for €58.32** at our house. You can also clearly see days when something extra happened – almost 1.6 m³ on 13 October.

:::tip How to set the reading to match the meter
If you want the number in HA to match the water meter, set **Water meter reading** (and **Gas meter reading**) once by hand in the device configuration – ideally **right after the first start**. The Energy dashboard may count that jump as usage in that hour. You can fix it in **Developer tools on the Statistics tab** (adjust the sum for the entity). If you only care about usage, you don’t need to set it – the Energy dashboard works with differences.
:::

## Things to watch out for

- **Don’t tamper with the meter.** The sensor only rests on the outside, the holder grips around.
- **Never 5 V straight into an ESP pin.** Water always goes through the logic level converter.
- **Compare HA with the meter now and then.** If they drift apart after a few days, the sensor misses some turns (or catches them twice) – the position needs tuning.
- **Power cuts.** The reading is saved to the ESP’s memory (by default ESPHome does this once a minute), so after a power cut you lose at most the pulses from the last minute. And while the ESP isn’t running, pulses aren’t counted at all.
- **Low gas usage.** Power is calculated from the time between pulses and drops to 0 after 3 minutes without a pulse. At 0.01 m³ per pulse this means usage below roughly 2 kW (0.2 m³/h) shows as 0 – but the consumption is still counted correctly.
- **Water flow in steps.** With 1 litre per pulse and a calculation every 15 s, the smallest step is 4 L/min. That is enough for tracking usage and leaks.

:::tip Don’t feel like fiddling with an ESP?
For gas you can also use an ordinary **door sensor**. An **Aqara door sensor worked like this for me for 2 seasons**. To get it into the reading space, I had to take it out of its plastic case, or desolder the reed sensor and put it on an extended wire. It’s a battery solution and it lasted surprisingly long on one battery – **over a year**. Every turn = the “door” opening and closing, and in HA you count the state changes.
:::

## Result

It takes some fiddling – mainly with the sensor position. But for **a few euros** you get **reliable metering** straight from the utility meters, live water flow (ideal for spotting a leak) and the boiler’s power in kW. It has been working like this for me for several years.

If you get stuck or have a different type of water or gas meter, [write to me](/en/about/) – happy to help. And if you want to know what to do with the numbers next, see [Where to start a smart home? Metering electricity, water and gas](/en/energy/start-with-energy-metering/).
