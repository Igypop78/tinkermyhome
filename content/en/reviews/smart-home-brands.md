---
id: brands
cover: /img/clanky/titulky/znacky.jpg
title: Smart home brands – what lasted in my house and what ended up in the bin
description: Shelly, Aqara, IKEA, Sonoff, Fibaro, Tado, UniFi, Hikvision, Lidl and Tuya – my experience with smart home brands after 13 years of a smart home. What I recommend, what comes with caveats and what I avoid.
section: reviews
level: 1
date: 2026-11-19
time: '18:00'
slug: smart-home-brands
tldr: I don't stick to one brand – I pick by device type. **Shelly** for in-wall modules, **Aqara** for battery sensors, **Fibaro** for Z-Wave, **ESP32** for DIY projects, **Tado X** for radiator valves, **UniFi** for WiFi. **IKEA** is the best value, but with caveats. **Tuya** never clicked with me, and neither did battery-powered Shelly.
---

Which smart home brand should you buy? That's the question I get most often. The answer is simple and not simple at the same time: **I don't recommend one brand for everything**. Every maker is good at something different.

I've had a smart home since 2013 and today our house has **311 devices in Home Assistant**. This is a summary of what has lasted, what works with caveats and what ended up in the bin.

## Summary table

| Brand | What I use it for | Verdict |
|---|---|---|
| **Shelly** | in-wall modules, energy metering | ✅ recommended (not the battery ones) |
| **Aqara** | battery sensors, W100 panels, G5 camera | ✅ recommended |
| **Sonoff** | WiFi and Zigbee modules | ✅ recommended |
| **Fibaro** | Z-Wave modules from my first install | ✅ reliable, pricier |
| **ESP32** | DIY projects | ✅ made for it |
| **Tado X** | radiator valves in the flat | ✅ pricier, but the only ones that lasted |
| **UniFi** | WiFi network | ✅ no question |
| **Hikvision** | cameras | ✅ most settings |
| **IKEA** | bulbs, remotes | ⚠️ best value, with caveats |
| **Lidl** | doorbell button | ⚠️ works, but bulky |
| **Tuya** | – | ❌ didn't work for me |

## Shelly – in-wall modules

Shelly is my number one for **modules that hide behind the original wall switch**. The newer generations are extremely versatile and reliable:

- **WiFi and Zigbee** – pick based on the network you're building,
- **local control** without the cloud – the module works even when Home Assistant is down,
- **a great price**.

The first generations had **capacitor** problems and died after 2–3 years. Newer versions no longer have that issue.

**Battery-powered Shelly devices** didn't work out for me, though. For battery sensors I'd rather use Aqara.

![Shelly 3EM-63W Gen3 – a three-phase meter that sits directly on the breakers](/img/clanky/shelly-3em-63w-gen3.png)

:::me How I do it
Each section of my distribution board has one **Shelly 3EM Gen3** measuring consumption – more in [Start with energy metering](/en/energy/start-with-energy-metering/). How to wire a relay behind a switch is in [Smart bulb and wall switch](/en/start-here/smart-bulb-and-wall-switch/).
:::

## Aqara – battery sensors

For **temperature, motion and open doors or windows** I use Aqara. The sensors are **small, good-looking and reliable**, and the batteries last incredibly long.

Every room also has an **Aqara W100** panel – it shows the temperature and sets how warm the room should be.

![Aqara W100 – controller and display in the room](/img/clanky/kurenie-aqara-w100.jpg)

## Sonoff – a big range for sensible money

Sonoff offers **great value** and a huge range of modules for **both WiFi and Zigbee**. Zigbee relays also strengthen your Zigbee network, because they act as routers.

## Fibaro – Z-Wave that doesn't fail

I still have the **Fibaro Z-Wave modules** from my very first install. **Not a single one has died** and they all still work. They're a bit pricier. How I started with Fibaro is in [my smart home journey](/en/my-home/my-smart-home-journey/).

## ESP32 – for DIY projects

For DIY home projects the **ESP32** is made for the job – for example the **ESP32-C6 mini**, **ESP32 WROOM** or a similar alternative. It costs a few euros and with ESPHome you flash it without programming. What runs on it in our house is in [ESP32 – my projects](/en/diy/esp32-my-projects/).

## Tado X – radiator valves

Radiator valves were my longest search. **Aqara, Tuya and Popp/Danfoss all ended up in the bin.** What finally lasted was **Tado X**:

- **quiet**,
- **rechargeable batteries** via USB-C that last the whole season,
- **beautiful design** and pleasant controls.

The downsides: they're **pricier**, work **only over Matter** and need **their own bridge**.

![Tado X smart radiator heads](/img/clanky/kurenie-tado-x.jpg)

:::me How I do it
I have Tado X in the flat, where heat comes from a central source. In the house we heat differently – relays switch the valves and Home Assistant holds the logic. I cover both in [Smart heating](/en/my-home/smart-heating/).
:::

## UniFi – the WiFi network

For WiFi it's **UniFi**, no question. When dozens of WiFi devices run at home, a good network is the foundation – more in [Zigbee, WiFi, Z-Wave or Matter](/en/start-here/zigbee-wifi-zwave-matter/).

## Cameras – Hikvision and Aqara G5

I have **Hikvision** and **Aqara G5** cameras. Both do **colour night vision**. Hikvision has **more settings**.

## IKEA – best value, with caveats

IKEA is the **best value for money**. Their **smart bulbs** are excellent when it comes to light output.

But there are catches:

- **pairing** is a big problem, and sometimes **stability** too,
- **battery devices** occasionally drop out and often eat batteries,
- since 2025 IKEA sells **Matter devices only**.

## Lidl – works, but bulky

Lidl's smart devices work, but they're rather bulky. One exception is a favourite of mine: the **doorbell button**. It's weatherproof – it has been outside in sun and rain for **over 2 years** and still works.

## Tuya – never clicked with me

Tuya can be controlled locally, but **most devices push a cloud connection**. That goes against [my rules](/en/my-home/smart-home-rules/) – the house must work without the internet. This brand never clicked with me. Maybe I'm being unfair to it, but I don't miss it.

## Takeaways

1. **Choose by device type**, not by brand. In-wall modules, sensors and radiator valves are three different worlds.
2. **Local control without the cloud** – the house must work even when the internet doesn't.
3. **Battery devices** are the biggest lottery – this is where a proven brand pays off.
4. **With radiator valves** I threw out three brands before I ended up with Tado X.

Not sure which "language" your devices should speak? Start with [Zigbee, WiFi, Z-Wave or Matter](/en/start-here/zigbee-wifi-zwave-matter/). More answers are in the [FAQ](/en/faq/).
