---
id: esp32
cover: /img/clanky/titulky/esp32.jpg
title: ESP32 – the few-euro chip that solved the most in my house
description: How I discovered ESP32 two years ago, everything it runs in my house today (from the Tesla to the cooker hood) and why it is the first thing I think of for every new project.
section: diy
level: 1
date: 2026-11-15
time: '20:00'
slug: esp32-my-projects
tldr: '**ESP32** is a tiny board with WiFi and Bluetooth for a few euros. With **ESPHome** you flash it without programming and it shows up in Home Assistant on its own. In my house it runs **more than ten projects** – from local Tesla control through batteries and the gas boiler to a cooker hood that switches on from the hob. At the end, **vote** for which project I should write a guide for first.'
---

For a long time I avoided ESP32. I thought it was for people who can code, own an oscilloscope and understand processor registers. I wanted a smart home, not a second job.

Then, about two years ago, I needed to get my **Deye** inverter into Home Assistant. Ironically, that was a pretty hard first project – talking to the inverter directly over **UART**, a serial line. And I found out that with help from the internet (and later AI) it **is not rocket science**.

Since then, whenever I think about a new project, the first question is: **can I use an ESP for this?**

## What is ESP32

ESP32 is a small chip (and the board around it) made by the Chinese company Espressif. It has:

- **WiFi and Bluetooth** – it joins your network on its own, no hub and no cloud,
- **inputs and outputs (GPIO)** – connect sensors, relays, LED strips, buttons,
- **serial buses (UART, I2C, SPI)** – it can "talk" to an inverter, a BMS, an air conditioner or a display.

A board costs **a few euros** and fits into a wall box behind a switch.

![ESP32 DevKit – the classic board with USB and two rows of pins (illustrative photo)](/img/clanky/esp32-devkit.jpg)

:::info No programming: ESPHome
My most important discovery was **ESPHome**. You write a simple YAML file describing what is connected to which pin ("thermometer here, relay there"), ESPHome builds the firmware and flashes it to the ESP. The device then **shows up in Home Assistant by itself** with all its sensors and switches. For most common things (sensors, relays, LEDs, Bluetooth) there is a ready-made component – you just configure it.
:::

The first flash goes over a **USB cable** from your browser or from the ESPHome add-on in HA. Every change after that goes **over the air via WiFi (OTA)** – the ESP can sit inside a wall and you never have to take it out.

## Which ESP to buy

There are many variants and it is confusing at first. For home projects you only need to know these:

| Chip | What is different | Good for |
|---|---|---|
| **ESP32** (classic, DevKit) | 2 cores, WiFi + Bluetooth, lots of pins | the all-rounder, Bluetooth proxy, several sensors at once |
| **ESP32-C3** | 1 core, small, cheap, USB-C | simple sensors and relays when space is tight |
| **ESP32-S3** | more memory and power, USB | displays, cameras, heavier projects |
| **ESP32-C6** | WiFi 6, also does **Zigbee and Thread** | when the device should live in a Zigbee network |

![ESP32-C3 Zero – a stamp-sized board with USB-C (illustrative photo)](/img/clanky/esp32-c3-zero.jpg)

:::tip My tip for starting out
Buy **two or three boards** right away and a few cheap sensors. You will probably "kill" the first one or leave it half-finished in a drawer. And once your first project works, the second one comes sooner than you expect.
:::

## What runs on ESP in my house today

These are the things running right now – every day, without me touching them:

- **Tesla in Home Assistant, locally** – controlling the car over Bluetooth straight from the house, without the Tesla cloud.
- **Garden relays** – 4- and 8-channel boards for everything in the garden that switches on and off.
- **Gas boiler** – controlling the boiler and measuring temperatures in the hot water tank and on the pipes from the boiler.
- **Room temperatures over LAN cables** – **DS18B20** temperature sensors (1-Wire bus) in the rooms connected to the ESP through network (LAN) cables.
- **Wall tablet backlight** – an addressable LED strip around the display that shows the state of the house by colour, visible from across the room.
- **Samsung air conditioner** – an older unit the manufacturer stopped supporting. With ESP it works normally in HA.
- **3 × JK BMS over Bluetooth** – reading data from all three BMS of my batteries.
- **SOC from a Victron SmartShunt into the Deye inverter** – the ESP pretends to be a battery and feeds the inverter the exact state of charge from the SmartShunt instead of an inaccurate estimate. [Guide with wiring and code](/en/energy/soc-from-smartshunt-to-deye/).
- **A "dumb" cooker hood controlled from the hob (Hob2Hood)** – the hob sends an infrared signal meant for the hood, the ESP catches it and switches the hood via relays.
- **Water and gas metering** – on an **ESP32-C6** that sits directly in the Zigbee network.
- **Garden watering and pool filtration.**

And projects that ran on ESP in the past:

- water level in the rainwater barrel,
- controlling the TV over HDMI (HDMI-CEC),
- a standalone Bluetooth proxy for Home Assistant,
- and lots of other experiments.

:::me How I have it
What makes me happiest are the things that would otherwise **cost a lot or could not be bought at all**. A hood that reacts to the hob would have meant a new hood. An exact SOC in the Deye inverter would have meant a different battery with a "compatible" BMS. I would have had to replace the old air conditioner just because it lost support. With ESP I solved it for a few euros.
:::

## What I had to learn

The beginning was harder. Not because it is complicated, but because I did not know what I did not know. I wish I had known these from day one:

- **How the ESP behaves after a power cut.** After a restart the ESP starts in the state you set (`restore_mode`). For relays on a boiler or watering this matters – you do not want something left on after an outage.
- **How much fits on it at once.** WiFi and Bluetooth share one radio and memory is limited. A Bluetooth proxy, several BMS and a display on one small board is already pushing it.
- **What happens when WiFi or Home Assistant goes down.** Important logic (a safety shut-off, for example) is better placed directly in the ESP, not in an HA automation. Then the ESP keeps working even while you restart HA.
- **Power supply.** Most "mysterious" restarts and dropouts are a bad power supply or a long thin cable, not a bug in the code.

:::warn Careful with 230 V
The ESP itself runs on safe 3.3 V and 5 V. But as soon as it switches a boiler, a hood or a pump, you are working with mains voltage. Use ready-made isolated relay modules, put everything in an enclosure, and if you are not sure, have an electrician check the 230 V wiring.
:::

You need to be able to connect wires, solder a bit and understand basic electricity. But it is **a craft you can learn** – and today the community and AI help you with every step.

## Which guide do you want first?

I will gradually add guides for my projects here – with exact wiring, ESPHome YAML and everything that went wrong along the way. Videos will follow later. **Vote for the one you are most interested in** – I will pick it first.

:::poll esp-navody Which ESP project should get the first guide?
- tesla: Tesla in Home Assistant locally over Bluetooth
- smartshunt-deye: SOC from a Victron SmartShunt into a Deye inverter
- jk-bms: 3 × JK BMS over Bluetooth
- hob2hood: Cooker hood controlled from the hob (Hob2Hood)
- klima-samsung: Old Samsung air conditioner in HA
- kotol: Gas boiler control and hot water temperatures
- teploty-lan: Room temperatures over LAN cables
- zahrada-rele: Garden relays (4 and 8 channels)
- polievanie-bazen: Garden watering and pool filtration
- led-tablet: LED backlight for the wall tablet
- voda-plyn: Water and gas metering
:::

If you have an idea for something ESP could solve, or want me to look at your project, [get in touch](/en/about/).
