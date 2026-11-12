---
id: my-rules
cover: /img/clanky/titulky/zasady.jpg
title: 6 rules I build my smart home by
description: What 13 years of smart home taught me – six rules that make a smart home help the whole family instead of complicating life.
section: home
level: 1
date: 2026-11-08
time: '19:30'
slug: smart-home-rules
tldr: The house must work without the smart home, manual control stays, **less is more**, you back up off the device, avoid the cloud and keep **names in order** from the start. Stick to these six rules and you'll skip most of the mistakes I made.
---

There's nothing worse than an automation that makes life harder, or a smart device nobody in the house knows how to use. Things like that end in disappointment and wasted money. Over 13 years – from the first relay in a flat to a house with solar and Home Assistant – I wrote down six rules. I follow them with every new device.

If you want to know how I got to them, read [my smart home journey](/en/my-home/my-smart-home-journey/).

## 1. The house must work even when the smart home doesn't

Everything breaks one day. A smart home has even more ways to fail: besides the light or the heating itself, the hub, the network or the internet can go down. Imagine all your lights are controlled only through the hub and you got rid of the normal switches. When the hub fails, you simply can't turn on the light.

So choose solutions where you can still control the end device when the hub is unavailable. Modules that fit behind the original switch (Shelly, Fibaro, Aqara, Sonoff and similar) are ideal. The switch keeps working and smart control is just a bonus.

:::me How I do it
When renovating the house I asked for deeper wall boxes so a relay fits behind the original switch. The servers running Home Assistant are also backed up by a battery, so a short power cut doesn't take them down.
:::

**In one sentence:** important devices must be controllable without the smart home.

## 2. Keep manual control wherever you can

They say a smart home should do everything for you. We're not there yet. Even with the best automations there comes a moment when you want something different – lights off where they're usually on, or the other way round.

There's a second reason: the people you live with. Someone who isn't technical or is used to a normal switch must not lose out. Otherwise they quickly turn against the whole smart home.

:::me How I do it
In our house Katka is the "household test". If something doesn't work for her too, it isn't finished.
:::

**In one sentence:** automation should help, not take away the option to do it your way.

## 3. Less is more

The first excitement about automating everything often turns into disappointment. Many devices at home are used only now and then, and it makes no sense to swap them for smart ones. Why monitor and control every socket when you really use five out of twenty?

That doesn't mean losing the overview. You can track the whole house's consumption in a different and cheaper way than with dozens of smart plugs – there'll be a separate article on that.

:::me How I do it
I overdid it too. At one point I had almost 3000 entities in Home Assistant and finding anything was a pain. After a clean-up I have just under 2000 – and I don't miss a thing.
:::

**In one sentence:** automate what you really use, not everything you can.

## 4. Back up and plan for the worst

It sounds obvious, but a few times I made a mistake while experimenting and the backup was missing or old. Over time your smart home will have hundreds of devices, thousands of entities, history and automations you put hours or days into. Rebuilding all of it is a walk through hell.

Regular backups of the whole system are the foundation. And the backup must live **off** the device – the hub itself can fail too. Store it on another computer, a NAS or in the cloud.

:::me How I do it
Several times I lost long-term consumption statistics, and once the entire Home Assistant database. Today I back up to a separate mini PC running Proxmox Backup Server, and my energy history lives in my own [energy archive](https://github.com/Igypop78/energy-archiv), which can restore it into HA.
:::

**In one sentence:** back up regularly, and always to another device.

## 5. Avoid the cloud where you can

The cloud is a good servant but a bad master. If your devices connect through the cloud (via the internet and the vendor's server, not your home network), an internet outage takes away your control. The vendor can also start charging for a free cloud or shut it down completely – for example when it goes bust. You're left with "smart" devices that aren't smart anymore.

So prefer devices that talk to the hub directly: Zigbee, Z-Wave, Matter or WiFi. With WiFi, be careful – some devices use it locally, others only to reach the vendor's server. Avoid the second kind.

:::me How I do it
Even our Tesla is in Home Assistant locally – through a small ESP device that talks to the car over Bluetooth. I don't need the vendor's cloud to control charging.
:::

**In one sentence:** prefer devices that work without the internet.

## 6. Be structured

When your home grows to dozens or hundreds of devices, random names come back to bite you. You lose track of what each entity does, and every automation and every bug hunt takes twice as long.

Example: a thermostat, a fridge, a robot vacuum and a light can each have a temperature sensor. You either end up with four sensors with meaningless names, or with names that tell you at once what they are. The same goes for automations – an automation called "Light" means nothing after a few weeks. "Automatic light in the living room" does.

Good names also help with voice control and AI. If a device has no room and no clear name, "turn on all the lights in the bedroom" won't find it.

:::me How I do it
Everything is named in Slovak following one scheme: `domain.room_device_quantity`, for example `sensor.kupelna_dole_teplota` (bathroom downstairs temperature). The entity has the full name, the dashboard card a short one. Renaming almost 3000 entities at once took me two days – better do it right at the start.
:::

**In one sentence:** think through device, room and automation names before there are many of them.

## If you're just starting

You don't have to solve everything at once. Start small, stick to these six rules and add one device at a time. If you don't know yet what an entity or an integration is, continue with [Home Assistant explained](/en/start-here/home-assistant-explained/).
