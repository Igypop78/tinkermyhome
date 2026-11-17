---
id: fve-setup
title: My solar setup – what I have at home, what it cost and how it works
description: An overview of my self-built ~13.9 kWp solar system with a Deye inverter and a 34 kWh battery – what it is made of, what it produces, what it cost and how I run it from Home Assistant.
section: energy
level: 1
date: 2026-11-17
time: '15:30'
slug: my-solar
cover: /img/clanky/titulky/moja-fve.jpg
tldr: I have **28 panels (~13.9 kWp)**, a **Deye 10 kW** inverter and a DIY **LiFePO4 battery of ~34 kWh**. I **installed it all myself** and had it inspected by an electrical inspector – that is why it cost only **~€8,000** including the battery. I run it from **Home Assistant** – the battery buys and sells electricity on its own based on spot prices. Here is what it is made of and how it fits together.
---

I write a lot about solar on this site, often in depth. This article is the opposite – a simple overview of what I really have at home. If you want to go further, each part ends with a link to a detailed article.

![Deye inverter, batteries, distribution boards and the ESP box in our carport](/img/clanky/fve-pristresok.jpg)

## Everything on one page

| Part | What I have |
|---|---|
| **Panels** | 22 × JA Solar JAM60D41 LB 500 Wp (SE/NW 11 : 11) + 6 × DAH frameless ~480 Wp, ~13.9 kWp in total |
| **Inverter** | Deye SUN-10K-SG04LP3-EU – hybrid, 10 kW, 3-phase |
| **Battery** | LiFePO4 ~34 kWh: 2 × 280 Ah + 1 × 105 Ah |
| **BMS** | 3 × JK BMS (one per battery), into Home Assistant via ESP |
| **Battery metering** | Victron SmartShunt on the whole bank |
| **Monitoring** | Solarman, Deye Cloud and above all Home Assistant |
| **Production forecast** | Solcast |
| **Grid export limit** | 10 kW |
| **Main breaker** | 3 × 25 A |
| **Installation** | DIY, checked by an independent electrical inspector |
| **Price** | ~€8,000 in total (DIY installation), battery ~€3,500 of that |

## Panels and inverter

I have **22 JA Solar JAM60D41 LB panels, 500 Wp each**. Half face south-east, half north-west (11 : 11). On top of that there are **6 frameless DAH panels** of about 480 Wp. That is roughly **13.9 kWp** in total.

The **Deye** inverter is rated **10 kW** and is three-phase. It is a hybrid inverter – it handles panels, battery and grid at once and can be controlled from Home Assistant.

Production is forecast by **Solcast**. In my experience real production is about **80 % of the forecast**, and I plan with that.

:::info What is kWp
Kilowatt-peak is the panels' output under ideal lab conditions. Real panels deliver less, depending on sun, temperature and orientation. That is why the inverter can be smaller than the panels add up to – and with a SE/NW layout the panels never deliver full power at once anyway.
:::

## The battery – three units, one meter

My battery is not one box from a shop. It is three separate LiFePO4 batteries: **2 × 280 Ah and 1 × 105 Ah**, about **34 kWh** together. Each has its own **JK BMS** that protects it and that I see in Home Assistant via ESP.

On top of that a **Victron SmartShunt** measures the whole bank. That is my **source of truth** – I do not trust the battery data from the Deye inverter. BMS state of charge drifts in winter, the SmartShunt measures precisely. How I got its data into the inverter is in [Accurate SOC in a Deye inverter](/en/energy/soc-from-smartshunt-to-deye/).

:::me How I do it
The battery is rated for **4,000 cycles** and a maximum discharge current of **220 A**. On 1 Nov 2026 it had about **491 cycles** behind it – roughly 12 % of the rated life. Because the battery also trades, it cycles more than if it only covered the house. I therefore count wear as a cost – about €45/MWh.
:::

## What it produces and what we use

Solar production in recent months:

| Month 2026 | Solar production |
|---|---|
| July | 2,281 kWh |
| August | 2,037 kWh |
| September | 1,512 kWh |
| October | 1,099 kWh |

Without the car the house uses **15 to 20 kWh a day**. Including the car it is **1,200 to 1,345 kWh a month**. Our heating is mainly a gas boiler; the electric underfloor heating downstairs is just an alternative. Solar production drops in winter, so then I charge the battery from the grid at the low tariff.

You can see how it looks right now on the [home page](/en/) in the “How our house works” card. My Home Assistant sends the numbers every 5 minutes.

## Car and wallbox on the same cable

We charge a **Tesla Model Y** at home with a **SmartEVSE** wallbox (3-phase, 6–16 A, so up to ~11 kW). The inverter and the wallbox share one cable, so I keep the draw under **12 kW**. Once I hit the limit of the main breaker – the car was charging while the battery was charging from the grid. Since then logic in Home Assistant guards it.

## How I run it all

Everything goes through **Home Assistant**. It reads the inverter, the BMS, the SmartShunt and the wallbox and switches the Deye modes according to a plan.

I **buy electricity at a fixed two-rate tariff** (ZSE, DD3 rate) and since September 2026 I **sell at spot prices** (V-elektra, OKTE spot − €15/MWh). The battery charges at the cheap low tariff and sells in the most expensive 15-minute slots. My own integration **AI Energy** does the planning.

In detail:

- [A battery that trades](/en/energy/battery-trading-on-spot/) – a real day in a chart, Deye settings and monthly numbers.
- [AI Energy](/en/projects/ai-energy/) – how the integration plans buying and selling.
- [Start your smart home with metering](/en/energy/start-with-energy-metering/) – how I measure consumption per circuit.

## What it cost and what it brings

The whole solar system with the battery cost **about €8,000**, the battery about **€3,500** of that.

:::warn The price is for a DIY installation
I mounted and wired everything **myself**. The finished installation was then checked by an **independent electrical inspector** – in Slovakia the inspection is mandatory and without the inspection report the grid operator will not connect your system. So the price does not include an installer's labour. If you have no experience with electrics, I do not recommend a DIY installation – inverters and batteries work with high voltages and currents.
:::

From electricity alone (sales minus purchases) I made **€95** in July and August with the virtual battery. In September and October, already on spot and with less sun, **€352**. How that is possible is explained in [A battery that trades](/en/energy/battery-trading-on-spot/).

## What I would do differently today

I would do it **all properly in one go**. I built my solar system step by step. Why I would not do that today is coming in a separate article.
