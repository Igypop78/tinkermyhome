---
type: page
title: FAQ
slug: faq
pair: caste-otazky
description: Short answers to the questions I get most often – solar, home battery, EV and Home Assistant. From our house, with links to the details.
---

These are the questions I get asked most. The answers are short and come from our house. You'll always find the details in the linked article.

:::faq Solar and battery
? What solar setup do you have and what did it cost?
On the roof and the carport I have **28 panels, ~13.9 kWp in total**, a **Deye 10 kW** inverter and a **~34 kWh LiFePO4** battery. The whole thing cost **~€8,000** including the battery – I installed everything myself and had it checked by a certified inspector. → [My solar](/en/energy/my-solar/)
? Is a lead-acid battery worth it?
In my view, no. You shouldn't discharge lead-acid below ~50 %, so you really only use half the capacity. I got rid of mine after six months. LiFePO4 handles 80–90 % of its capacity and thousands of cycles. → [My solar journey](/en/energy/my-solar-journey/)
? Start small or do it all at once?
If you can, **do it once and do it right** – compromises cost me the most. Go for the maximum your roof and grid operator allow; the consumption will come. But starting small still beats not starting at all. → [My solar journey](/en/energy/my-solar-journey/)
? Does selling electricity at spot prices pay off?
For me it does. I charge the battery at the low tariff and sell in expensive 15-minute slots. Electricity earned me **€352** in September and October, compared with just **€95** in July and August with a virtual battery. → [A battery that trades](/en/energy/battery-trading-on-spot/)
? How many cycles does a home battery last?
Mine is guaranteed for **4,000 cycles**. On 1 Nov 2026 it had done ~491, about 12 % of its life. Because it trades, it cycles more – I count wear as a cost of roughly €45/MWh. → [My solar](/en/energy/my-solar/)
? Why does my Deye inverter show an inaccurate battery SOC?
After weeks without a full charge, BMS state of charge drifts away from reality. A Victron SmartShunt measures it precisely – I fed it into the Deye with a €24 ESP32 board. It's still a risky version though; I'm working on a better one. → [Accurate SOC in a Deye inverter](/en/energy/soc-from-smartshunt-to-deye/)
:::

:::faq Electric car
? How much energy does an EV use?
My Tesla Model Y RWD has averaged **16.9 kWh/100 km** since I bought it – summer and winter, city and motorway combined. → [Living with an EV](/en/my-home/living-with-an-ev/)
? How much range do you lose in winter?
Roughly a third. If you do 300 km on the motorway in summer, in winter it will be a little over 200 km. → [Living with an EV](/en/my-home/living-with-an-ev/)
? Is rear-wheel drive a problem in winter?
Not once for me. It was my biggest worry and it was for nothing. → [Living with an EV](/en/my-home/living-with-an-ev/)
? Can the car charge from solar automatically?
Yes. I have a SmartEVSE wallbox, and in AI mode my AI Energy integration picks the cheapest time based on spot prices. → [AI Energy](/en/projects/ai-energy/)
:::

:::faq Home Assistant and the smart home
? Where should I start with a smart home?
Today I would start by **metering electricity, water and gas**. It shows where energy goes, keeps an eye on the house and even finds water leaks. → [Start with energy metering](/en/energy/start-with-energy-metering/)
? What should I run Home Assistant on?
For beginners I recommend **Home Assistant OS** on a dedicated always-on device – Home Assistant Green, a mini PC or a Raspberry Pi. Performance doesn't matter much, power draw does. → [Installing Home Assistant](/en/start-here/installing-home-assistant/)
? Zigbee, WiFi, Z-Wave or Matter?
WiFi is free, but with dozens of devices you need a good router. Zigbee and Z-Wave are built for smart homes and need an adapter. Matter is still young – I avoid it for now. Decide at the start. → [Zigbee, WiFi, Z-Wave or Matter](/en/start-here/zigbee-wifi-zwave-matter/)
? Why does my smart bulb stop working when I flip the wall switch?
It needs power all the time. Best is to keep it powered and turn the switch into a button – or use a smart relay with a detached input. → [Smart bulb and wall switch](/en/start-here/smart-bulb-and-wall-switch/)
? What is an ESP32 and do I need to code?
A small board with WiFi and Bluetooth for a few euros. With ESPHome you flash it without programming and it shows up in Home Assistant by itself. → [ESP32 – my projects](/en/diy/esp32-my-projects/)
? Should a smart home work without the internet?
I think so – the house must work without the smart home, manual control stays, and I avoid the cloud. → [Smart home rules](/en/my-home/smart-home-rules/)
:::

:::faq My projects
? Is AI Energy free and does it work with my inverter?
Yes, it's open source (MIT licence) and installs through HACS. It works with any inverter and you set it up in a wizard, no YAML. → [AI Energy](/en/projects/ai-energy/)
? Does Pattern Pilot use the cloud or AI?
No. It runs locally only, never runs anything by itself and just suggests automations – with evidence from your own history. It's still in development. → [Pattern Pilot](/en/projects/pattern-pilot/)
:::

Didn't find your answer? Leave a comment under a [video on YouTube](https://www.youtube.com/@TinkerMyHome) – I'll add the most common questions here.
