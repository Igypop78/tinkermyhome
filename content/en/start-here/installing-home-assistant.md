---
id: ha-install
cover: /img/clanky/titulky/instalacia.jpg
title: Installing Home Assistant – every option and the one I recommend
description: Home Assistant OS or Container, Raspberry Pi, mini PC, Home Assistant Green or Proxmox – what to run Home Assistant on and what to prepare before you start.
section: start
level: 1
step: 2
date: 2026-11-08
time: '19:55'
slug: installing-home-assistant
tldr: Today there are only two official ways – **Home Assistant OS** and **Container**. For beginners I recommend HA OS on a dedicated device that runs 24/7 – a ready-made **Home Assistant Green**, a **mini PC** or a **Raspberry Pi**. Performance doesn't matter much, power consumption does. Leave Proxmox and virtual machines for later.
---

Home Assistant runs on almost anything. That's exactly why it's hard to choose at the start. In this part I'll show you the options, what to prepare and what I would pick to begin with. It won't be a click-by-click guide – the internet is full of those. Instead I'll point out what to watch for so you avoid the mistakes I made.

But first, the most important thing: **time and appetite**. At the start you need the appetite to try and learn something new. If you don't have it, buy a ready-made system instead (IKEA, Aqara, Google Home and similar) and accept its limits.

## Two official ways

There used to be four installation methods. Since version 2025.12 only two are officially supported – Home Assistant [retired](https://www.home-assistant.io/blog/2025/05/22/deprecating-core-and-supervised-installation-methods-and-32-bit-systems/) the Core and Supervised methods. If you come across an older guide recommending them, skip it.

| | Home Assistant OS | Home Assistant Container |
|---|---|---|
| What it is | A whole operating system made just for HA | HA as a Docker container on your own system |
| Apps (add-ons) | yes, one-click install | no, you handle everything yourself |
| Backups and updates | from the HA interface | manual |
| Who it's for | **most people** | people who already know Docker |

Apps are things like Zigbee2MQTT, Mosquitto or backup tools – without them you lose a big part of the convenience. So for a start, definitely **Home Assistant OS**.

## What to run it on

I recommend a dedicated device that can run 24/7. Performance isn't that important – Home Assistant isn't demanding. What matters is **power consumption** – the device will run all year without a break.

| Device | Pros | Watch out for |
|---|---|---|
| Home Assistant Green | A ready-made box from the HA makers, HA OS pre-installed – plug in the cable and go | No Zigbee or Z-Wave, you need to buy an adapter |
| Raspberry Pi | Cheap, small, low power | A good SD card is a must – a cheap one will die sooner or later, taking your data with it |
| Mini PC | Room to grow, often cheap refurbished | Should have a LAN port, ideally Bluetooth and at least 2 USB ports; watch the power draw |
| Virtual machine (Proxmox) | One computer runs HA and other things | Another layer you need to understand – too complex to start with |

If you come across a Home Assistant Yellow, note that it's no longer made ([announcement from October 2025](https://www.home-assistant.io/blog/2025/10/15/yellow-end-of-life/)). If you already have one, it keeps working and getting updates.

## What you need besides the computer

- **A network cable.** Home Assistant belongs on a cable, not on WiFi.
- **An adapter for your standard** – a USB or network adapter for Zigbee, Z-Wave or Thread. Which one depends on the path you choose – that's what the [next part](/en/start-here/zigbee-wifi-zwave-matter/) is about. If you'll only have WiFi devices (e.g. Shelly), you don't need one yet.
- **Somewhere for backups** off the device – a NAS, another computer or the cloud. Why, I explain in the [6 rules](/en/my-home/smart-home-rules/).

## What I recommend

Keep it simple. Start with a **dedicated device running Home Assistant OS** – Home Assistant Green if you want peace of mind, or a mini PC or Raspberry Pi if you want to save money and don't mind tinkering a bit.

Virtual machines and Proxmox can wait until you want to run other things on the same computer. Moving is easy: a backup from the old device and a restore on the new one.

:::me How I do it
I started with a Raspberry Pi that once ended up in a drawer (more in [my journey](/en/my-home/my-smart-home-journey/)). Today Home Assistant runs as a virtual machine on an HP mini PC with Proxmox. The same computer also handles the cameras (Frigate), a NAS and other containers. Backups go to a second mini PC running Proxmox Backup Server, and both are backed up by a battery. Zigbee and Z-Wave run through an SLZB-MRW10U multi-radio adapter.
:::

## After installation

- **You don't use Home Assistant on that computer directly.** You open it from your phone or laptop in a browser at `http://homeassistant.local`. If that doesn't work, find the device's IP address in your router and type it into the browser. Older guides use the address with `:8123` – since version 2026.8 a new Home Assistant OS install doesn't need it ([port change](https://www.home-assistant.io/integrations/http/)). With Container (Docker) and older installs it stays `:8123`.
- **Click through the whole interface.** It looks clumsy at first, but everything has a purpose you'll appreciate later.
- **Add what HA found by itself.** If you have devices on the same network, HA often finds them on its own. Go ahead and add them, and watch how their entities behave. What an entity and a device are is explained in the [first part](/en/start-here/home-assistant-explained/).
- **Set up backups right away.** Turn on automatic backups in the HA settings and store them off the device. Later you'll forget.
- **Think through names and rooms** before you add dozens of devices. It saves you days of clean-up – how to do it is in the [6 rules](/en/my-home/smart-home-rules/#6-be-structured).

Next part: **Zigbee, WiFi, Z-Wave or Matter – which way to go**.
