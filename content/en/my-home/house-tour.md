---
id: house-tour
title: A tour of our house – what we've automated and what we deliberately haven't
description: Room by room through a house where a family of four and a dog live with over 300 smart devices. What we have where, everyone's favourite, and what we kept ordinary.
section: home
level: 1
date: 2026-11-08
time: '23:30'
draft: true
slug: house-tour
tldr: We have **311 devices in Home Assistant** – from backlit stairs and room-by-room heating to a battery that trades electricity. Most of it runs on its own. But **lights, the front door and morning blinds** we kept manual. Why is at the end.
---

Let's walk through the house. Not a showroom – an ordinary house where the four of us and Megie the dog live. There are over 300 smart devices here, but what matters more is what we actually use – and what we kept ordinary.

## Who lives here and what they like best

| Who | Favourite thing |
|---|---|
| **Igy** | Knowing what's happening in the house and why – and that most things run on their own |
| **Katka** | Room-by-room heating – every room is as warm as that room should be |
| **Martin** | Effect lights – Nanoleaf on the wall, a backlit window, the desk lamp. He starts them with a remote, by voice and in the morning when he gets up |
| **Jakub** | A painting with smart backlighting that he designed himself and built with me |
| **Megie** | The click of the gate relay when someone's coming, and the doorbell that rings through the Sonos speaker |

## Hallway – backlit stairs

Right by the entrance, the stairs are lit by LED strips. The hallway has a motion sensor, a sensor on the front door and a button to open the gate. There's also an air conditioner connected to the rooms upstairs and downstairs that cools the whole house in summer. It's connected to Home Assistant through a small ESP device.

## Kitchen – a tablet on the wall and the cooker hood

In the kitchen there's a touch display on the wall with our own page instead of a regular dashboard. Around it is an LED strip that shows the state of the house by colour – you can see it from across the room. In the morning we open the blinds from it with one tap.

We retrofitted the cooker hood (Hob2Hood) – with an ESP32 and a wireless remote. Also here:

- **sensors on the fridge and freezer** – temperature and open doors,
- **a water leak sensor and a smoke detector**,
- **underfloor heating** with its own thermostat,
- **the oven, dishwasher and robot vacuum** in Home Assistant.

## Living room

Lights, two sets of blinds and a convector are in Home Assistant, and you can also control them with an IKEA wireless remote. Sound comes through a Sonos – and the doorbell rings through it too.

## Pantry – the heart of the system

The pantry holds the rack everything runs from: a mini PC with Proxmox running Home Assistant, the cameras (Frigate), a NAS and other containers. Backups go to a second mini PC, and one multi-radio adapter takes care of Zigbee and Z-Wave. The whole rack is backed up by a battery, so a short power cut doesn't take it down.

How I got here is in [my smart home journey](/en/my-home/my-smart-home-journey/), and what to run your own Home Assistant on is in [Installing Home Assistant](/en/start-here/installing-home-assistant/).

## The boys' rooms – lights and moods

Martin's and Jakub's rooms have the most lights in the house. Martin has Nanoleaf on the wall, LEDs around the window (WLED), a desk lamp, a globe and a Sonos speaker. He starts the effects with a remote and by voice – and in the morning when he gets up.

Besides a lamp and the main light, Jakub has a painting whose backlighting he designed himself, and we built it together. Both have blinds, window sensors and their own heating panel.

## Heating room by room

Katka's favourite. Every room has a small Aqara W100 panel – it shows the temperature and lets you set how warm the room should be. A relay switches the radiator valve and Home Assistant holds all the logic. The gas boiler only turns on when at least one room is heating. When someone opens a window, heating in that room switches off.

## Bathrooms – water under control

The bathrooms have water leak, motion and temperature and humidity sensors. Downstairs there's a smart extractor fan, upstairs an AEG washing machine and dryer that are in Home Assistant too. The upstairs bathroom also has an ESP module for the heating and the water heater.

## Bedroom – just one shot

The bedroom is off limits. But we'll show one thing from it: the roller shade and the blinds that move in sync. That deserves an article of its own.

## Garden – watering, the pond and the fish

Outside, watering is automatic, and the pond runs its filtration and fish feeding – all through relays on an ESP32. The lanterns and the lights by the entrance and on the terrace are smart too, there's an air quality sensor and a doorbell by the entrance. One of the ESPs also works as a Bluetooth proxy, and another talks to our Tesla over Bluetooth.

## Carport and workshop – energy

This is where everything around the solar lives: the Deye inverter, the 34 kWh battery with a SmartShunt and BMS, and the SmartEVSE charger for the Tesla. Consumption is measured per group of circuit breakers, so I can see exactly where electricity goes. The battery buys and sells by itself based on spot prices – in detail in [A battery that trades](/en/energy/battery-trading-on-spot/). What it looks like right now, you can see on the [home page](/en/) in the "How our house works" card.

## What we deliberately haven't automated

- **Most of the lights.** Our needs change from evening to evening. For us, automation works at most at sunset. I haven't yet found a way to automate lights so that it doesn't get in the way. So we switch them with a switch or a remote.
- **The front door.** A smart lock hasn't earned my trust yet. We unlock the door with a key.
- **Morning blinds.** When they opened at a fixed time, they often woke us up for nothing – we don't always get up at the same time. Today we open them in the morning with one tap on the kitchen display.

Everything else runs on its own. To me, a smart home isn't about how many things are automated but whether they help – exactly in line with the [6 rules](/en/my-home/smart-home-rules/) I follow.
