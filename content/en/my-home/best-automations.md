---
id: best-automations
cover: /img/clanky/titulky/automatizacie.jpg
title: 7 automations that really work in our house – and why lights aren't among them
description: My best Home Assistant automations after 13 years of a smart home – arrivals and departures, the fridge, water, heating, power outages, a doorbell with a camera, the cooker hood and the gate. What they do, how they're wired and why lights aren't on the list.
section: home
level: 1
date: 2026-11-19
time: '21:00'
slug: best-automations
tldr: Our best automations **watch, warn and take worries away** – arrivals and departures, an open freezer, running water, room-by-room heating, **power outages**, a doorbell with a photo on my phone, a cooker hood that turns on by itself and a gate that opens when I shift into D. **Lights aren't among them** – for me their main benefit is control from a better spot, not automation.
---

When people ask about a smart home, they usually expect lights that switch on by themselves. In our house it's different. The best automations are the ones **you barely notice** – until they save your food, warn you about running water or tell you the power is out at home.

I have **over 90 automations** in Home Assistant. These are the seven that have proven their worth the most over the years. They all run in Home Assistant and I describe each one the way I have it at home.

## 1. Arrivals and departures – who's home

Home Assistant knows who's home thanks to the **Home Assistant app on the phone** – from its location and from the phone **joining the home WiFi** when we arrive. The **home security** is tied to presence as well.

:::tip What this means
Every member of the household has their own person (`person`) in Home Assistant. When everyone is away, the house knows it's empty – and can behave accordingly.
:::

Presence is the foundation other automations build on – like the gate in point 7.

## 2. Alerts that save food and floors

This is the category that has paid off the most.

- **Open fridge or freezer.** There are sensors on the doors – when one is left open, an alert comes. **More than once it saved our food.**
- **Water running for too long.** I meter water continuously, so I can see the current flow. When water runs suspiciously long, a message comes – for example with a stuck toilet flush that could let through up to 10,000 litres a day. More in [Start with energy metering](/en/energy/start-with-energy-metering/).
- **Water on the floor.** There are flood sensors in the kitchen and the bathrooms.

## 3. Heating that actually works

Every room is exactly as warm as it should be. Sounds trivial, but it never worked with one thermostat for the whole house.

Every room has its own **virtual thermostat** and an **Aqara W100** panel to set the temperature. Relays switch the radiator valves and **the boiler only fires when at least one room is heating**. When someone opens a window for more than 2 minutes, heating in that room switches off. The whole setup, YAML included, is in [Smart heating](/en/my-home/smart-heating/).

## 4. Power outage – a message right away, even when I'm away

One of the most useful things in the whole house. When the power goes out, I know straight away.

The **breaker out on the street** used to trip a lot. Thanks to the alert I could act right away, even remotely when nobody was home – I just asked a neighbour to flip it back. Otherwise the freezer and everything else would have waited until we got home.

:::me How I do it
I have one spare relay on an ESP that is always on (**always ON**). When the power goes out, the relay opens. An **Aqara door sensor** is soldered to its contacts – and it "opens" like a door. Home Assistant then sends a notification via **Pushover**.
:::

:::warn It won't work without backup power
For Home Assistant to send you a message when the house has no power, it has to keep running – and so do the network and the internet. That's why my whole homelab is on a **backup battery**. Without it, you'll only find out about the outage when the power comes back.
:::

## 5. A doorbell with a camera – I know who's ringing even when I'm away

When someone presses the doorbell, my phone gets a message **"Someone is ringing" with a photo from the camera**. So I know who's at the gate even when I'm not home. 🙂 At the same time our own "ding dong" plays from the **Sonos** speakers at home.

:::me How I do it
The doorbell button is from **IKEA**, the camera is an **Aqara G5** and the sound goes through **Sonos** speakers.
:::

## 6. A cooker hood that turns on by itself

It often happened that someone in the family forgot to switch on the extractor while cooking – and the whole house smelled of it afterwards. Today the hood turns on by itself when the hob does.

:::me How I do it
The hob sends an infrared signal meant for the hood (**Hob2Hood**). Our hood can't receive it, so an **ESP32** catches it and switches the hood via a relay. No new hood needed. More in [ESP32 – my projects](/en/diy/esp32-my-projects/).
:::

## 7. The gate opens by itself – on arrival and when I shift into D

I don't reach for the gate remote anymore.

- **Arriving:** when I'm getting close to home and the car isn't home yet, the gate opens by itself. Home Assistant knows from the **location in the phone app**.
- **Leaving:** in the morning I just **shift the Tesla into D** and the gate opens.

:::me How I do it
The gate is switched by a **Shelly**. The Tesla is in Home Assistant locally via **an ESP and Bluetooth** – and since the ESP only has range at home, it works both ways: when the car isn't connected, it isn't home (arriving), and when I shift into D, the car is definitely standing in the yard (leaving).
:::

## And what about lights?

Did you notice there are no lights on the list? That's no accident.

I see automatic lights as **a basic feature where it really makes sense**. Most of our lights, though, we switch with a wall switch or a remote – our needs change from evening to evening and automation would get in the way more than help.

I see the main benefit of smart lights elsewhere: **I can control them from a spot that's more convenient than the original switch**. For example in the bedroom, from the bed, without getting up. How to make a smart light work with a wall switch too is in [Smart bulb and wall switch](/en/start-here/smart-bulb-and-wall-switch/).

## What they have in common

1. **They solve a real problem** – spoiled food, water on the floor, a cold room, a tripped breaker.
2. **They don't restrict anyone** – manual control stays.
3. **Mostly they just alert** – the decision is left to a person.
4. **They run locally** – even the Tesla and the hood go through an ESP, not the cloud.

I go into these principles in more detail in [6 rules I build my smart home by](/en/my-home/smart-home-rules/).

## Want the YAML?

Which automation would you like a detailed guide for, with YAML to copy? **Vote** – the winner gets written up first.

:::poll automatizacie-yaml Which automation do you want a YAML guide for?
- pritomnost: Arrivals and departures
- chladnicka-voda: Fridge, freezer and water
- vypadok: Power outage via a relay and an Aqara sensor
- zvoncek: Doorbell with a photo and Sonos
- digestor: Cooker hood from the hob
- brana: Gate by location and shifting into D
:::

If you have a question about any of them or an idea of your own, [get in touch](/en/about/).
