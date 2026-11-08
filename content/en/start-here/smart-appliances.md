---
id: smart-appliances
title: Buying a new appliance? Check this if you want it in your smart home
description: When buying a washing machine, dishwasher or air conditioner, it pays to look at connectivity too. How to check whether an appliance will work with Home Assistant.
section: start
level: 1
date: 2026-11-08
time: '21:40'
slug: smart-appliances
tldr: Connectivity is a normal part of appliances today and worth considering even if you don't have a smart home yet. Before buying, though, **check whether the appliance can be integrated into Home Assistant** – many "smart" appliances are closed and useless to the rest of the house.
---

Connectivity and smart features are now a normal part of many appliances. Even if you don't have a smart home yet, it's worth thinking about when buying. Later you can use the appliance and its sensor data in your smart home without spending anything more.

## What a smart appliance gives you

- **Status notifications** – for example that the wash is done.
- **Convenient settings** straight from the manufacturer's app.
- **Operating information** – service intervals, consumables, consumption.
- **Data for the rest of the house** – if the appliance is in Home Assistant, its [entities](/en/start-here/home-assistant-explained/) (state, time remaining, programme) can be used in automations and on dashboards.

## Smart doesn't automatically mean integrable

Here's the catch. Many appliances have a closed solution that can't easily be connected to other devices. Such an appliance is smart, but useless to the devices around it and especially to the hub. It only works in the manufacturer's own app.

## How to check before buying

1. **Find the exact model** of the appliance.
2. **Ask Google or an AI** whether that model can be integrated into Home Assistant. Search for something like "model name Home Assistant".
3. **Check the integrations list** on the Home Assistant website for an official integration from the manufacturer. If there isn't one, there's often a community one via [HACS](/en/start-here/home-assistant-explained/).
4. **Check whether the integration works locally or through the cloud.** A cloud integration stops working when the internet goes down or the vendor changes its terms – more in the [6 rules](/en/my-home/smart-home-rules/#5-avoid-the-cloud-where-you-can).

:::tip Smart isn't the main spec
Connectivity shouldn't come at the expense of the features that matter more for the appliance. A better washing machine without an app is still a better washing machine.
:::

If you don't know yet what an integration, device and entity are, start with [Home Assistant explained](/en/start-here/home-assistant-explained/) – I explain it using a smart washing machine as the example.
