---
id: smart-devices
title: What counts as a smart device – sensors, controls, virtual devices and the brain of the house
description: Not everything connected to the internet is smart. An overview of smart device types – from sensors through active and virtual devices to the hub.
section: start
level: 1
date: 2026-11-08
time: '21:35'
slug: smart-devices
tldr: A smart device is one that can **talk to others** – give them information or be controlled by them. We split them into **sensors, input and active devices, coordinators and repeaters, virtual and display devices**, and above them all sits the **hub** – the brain of the house.
---

Manufacturers call almost anything "smart" today. So let's first be clear about what a smart device means on this site.

**A smart device can communicate with other devices** – give them information or be controlled by them. That's why a robot vacuum isn't smart to me until I can start it automatically when I leave the house. And a "smart" bulb on a remote isn't smart until I can control it from the hub or from outside the house.

Put simply: smart devices are those that can see each other and talk – directly or through the hub.

## Sensors

The largest group. A sensor can be single-purpose (a thermometer) or multi-purpose (temperature, humidity, light and motion in one). They're usually battery-powered, but there are mains-powered ones too. Their information is used to control other devices, for notifications or for statistics.

| Type | Examples |
|---|---|
| Environment | temperature, humidity, light level, air quality (dust, CO, CO₂), noise |
| State detection | open doors and windows, motion and presence, water leaks, smoke and other harmful substances |
| Consumption | electricity use and production, water and gas flow |

## Input devices

Like sensors, they only send information onwards. The difference is that they need an **action** – from you or another device. Remotes, buttons, alarm keypads, the state of a switch, and also open window and door sensors belong here.

Through them you trigger further actions in the house and control active devices.

## Active devices

Everything that does something: lights, heating, cooling, locks, blind motors, valves, switches, speakers and appliances that wash, vacuum or clean. They almost always work both ways – you can control them and they report their state. They can link to sensors directly, but most often through the hub.

## Coordinators and repeaters

A **coordinator** (sometimes called a router) is a single-purpose device the hub uses to talk to devices of a given standard – something like an antenna. Which standards exist, I explain in [Zigbee, WiFi, Z-Wave or Matter](/en/start-here/zigbee-wifi-zwave-matter/).

A **repeater** passes the signal on and extends coverage in bigger homes. Mains-powered smart devices (bulbs, plugs) often do this job, but it can also be a device made only for it.

:::warn Watch out for bulbs
If a bulb acts as a repeater and you switch it off at the wall, it stops passing the signal on. Other devices have to find another route – which can cause slow responses or dropouts.
:::

## Virtual devices

Besides devices you can hold in your hand, smart homes use virtual ones a lot. They simplify automations and control, and they're also used for statistics. For example:

- a temperature sensor that calculates the average temperature in the house from other sensors,
- a gas consumption sensor in kWh, converted from the reading on the gas meter,
- an "is anyone home" sensor that evaluates the state of several other sensors.

Over time you'll have dozens to hundreds of them. In Home Assistant they're called helpers.

:::me How I do it
Even the thermostats in our rooms are virtual. A small controller on the wall measures the temperature, a relay switches the radiator valve, and all the logic – when to heat – lives in a virtual thermostat in Home Assistant.
:::

## Display devices

A phone, tablet, wall panel, LED strip or speaker. They give you information and also serve for manual control. Information doesn't have to be on a screen – it can be a change of light colour or a voice announcement. For an overview people mostly use a tablet or phone with a customised dashboard. What's on it is entirely up to you.

:::me How I do it
We have a touch display on the wall with our own page instead of a regular dashboard. Around it is an LED strip that shows the state of the house by colour – you can see it from across the room without reading anything.
:::

## The hub – the brain of the house

Finally, the most important part, without which a smart home wouldn't be smart. The hub (controller):

- **connects all devices** – you find everything in one place,
- **collects information and commands** from the devices,
- **stores and runs the automations** you set up.

Basically it's a computer. What matters isn't so much the hardware as the software you control the smart home with. Performance-wise a very simple device is enough – what counts is **power consumption**, since it runs 24/7, and the **communication interfaces**. They decide which devices the hub can talk to. Vendors usually focus on only some standards (most often WiFi and Zigbee, recently Matter), and Z-Wave is rare in cheap hubs.

There are dozens of hubs on the market – from simple ones for a few euros to sophisticated ones for several hundred. There's no universal solution. How to choose between a ready-made system and Home Assistant is in [Do you even need a smart home?](/en/start-here/do-you-need-a-smart-home/), and what to run Home Assistant on is in [Installing Home Assistant](/en/start-here/installing-home-assistant/).
