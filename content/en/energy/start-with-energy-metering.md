---
id: metering
cover: /img/clanky/titulky/meranie-en.jpg
title: Where to start a smart home? Metering electricity, water and gas
description: Why I recommend starting any smart home with whole-house metering – from savings and security to catching a stuck toilet flush while you're on holiday.
section: energy
level: 1
date: 2026-11-16
slug: start-with-energy-metering
tldr: 'I have hundreds of smart devices and thousands of entities at home. But if I started again, the first thing would be **whole-house metering of electricity, water and gas**. It shows where the energy goes, tells you what is running (even "dumb" appliances), watches the house when nobody is home and even finds a **hidden water leak**. At the end, **vote** on what you measure.'
---

I have thousands of entities and hundreds of smart devices at home. People often ask me: **which of them are really useful, and where would I start if I did it all again?**

Of course, the answer depends on what *you* expect from a smart home. But there's one thing I recommend to everyone: **start with central metering of electricity, water and gas** (if you have gas). Why?

## 1. You'll see whether savings really work

What you don't measure, you can't improve. Long-term statistics show whether the new fridge, LED bulbs or lower room temperature actually made a difference.

To be fair – your **annual utility bill** would do for that. But it only tells you **how much**, not **when** and **what**.

## 2. You see the curve, not just the total

The bill won't tell you **what drives your consumption**. Continuous metering shows the curve over the whole day – and right away you see where it's worth looking for savings.

A good example is **standby consumption** – what the house draws when "nothing is running": computers, router, NAS, chargers, a TV in standby. Each takes a little, but runs **24 hours a day, 365 days a year**.

:::info What 50 W you don't see costs
50 W × 24 h × 365 days = **about 440 kWh a year**. At around €0.21/kWh that's **over €90 on your annual bill** – for things you often don't even notice.
:::

## 3. Security: consumption mirrors your behaviour

With continuous metering you have a **24/7 view** of what's going on in the house. Consumption faithfully mirrors how the house lives. When nobody's home, the graph looks completely different from when the whole family is in.

This is what consumption looks like in a **flat where nobody is home**. Can you guess which appliance runs roughly every hour with 15–20-minute breaks and the occasional spike?

![Consumption of an empty flat over one day – the regular "teeth" are the fridge](/img/clanky/meranie-byt-chladnicka.png)

Yes, it's the **fridge**. As soon as any other appliance switches on, you see it immediately – like the higher "bench" in the middle of the day.

## 4. Patterns that help automations

These repeating patterns can later be used in automations too – for example as confirmation that today really is the right day for an automation to run. If the morning looks like a weekend, there's no point in running the "workday" routine.

That's exactly the problem I'm tackling in [Pattern Pilot](/en/projects/pattern-pilot/) – an integration that learns the habits of the house and suggests automations on its own.

## 5. You'll recognise "dumb" appliances too

If you meter energy at a reasonable level of detail – **per circuit or group of breakers** – over time you'll be able to tell **from consumption alone** which appliance is running. And just as easily you'll find out that the **iron** is still on after you've left the house.

Try it yourself: which appliance is causing the high consumption in this picture?

![House consumption per phase and breaker group – one circuit draws over 1.8 kW](/img/clanky/meranie-okruhy-podlahovka.png)

Yes, it's the **electric underfloor heating**. The terrace socket with nothing plugged in is probably not the culprit. 🙂

:::me How I do it
My distribution board is split into **three sections, each with its own RCD**. Each section has one **Shelly 3EM Gen3** measuring all three phases – nine measurements in total. Whole-house consumption is their sum plus a separate meter in the carport, where the wallbox is. I'd never watch those circuits by hand, but one look at a card in Home Assistant shows me where the energy goes right now.
:::

### The fridge from the graph: an example for advanced users

Once you know an appliance's "signature", a simple template can assign its consumption. In the flat's graph the base load is around 15–20 W, and when the fridge runs the total rises to about 50 W. That gives you an estimated fridge power:

```yaml configuration.yaml
template:
  - sensor:
      - name: "Flat fridge power (estimate)"
        unique_id: flat_fridge_power_estimate
        unit_of_measurement: W
        device_class: power
        state_class: measurement
        # total flat power minus standby; the fridge runs above the threshold
        state: >
          {% set p = states('sensor.flat_electricity_power') | float(0) %}
          {{ (p - 17) | round(0) if 40 <= p <= 80 else 0 }}
```

Then in **Settings → Devices & services → Helpers → Create helper → Integral sensor** turn it into kWh and add it to the Energy dashboard as an individual device. Adjust the sensor name and thresholds to your own graph – this is an illustrative example.

:::tip
Don't expect meter-grade accuracy. The goal is to see the **trend** – whether the fridge starts running more often (seal, ice build-up) and what it costs you per year.
:::

## 6. Water leaks and a stuck toilet flush

If you meter water continuously, you see the **instant flow**. When nobody is home and litres keep adding up, it's either the washing machine, the dishwasher or the garden irrigation. **If it's none of those, you probably have a leak somewhere.**

If you read the **utility water meter**, you'll even find a leak you **can't see** – in a wall, underground, in the pipe to the garden. Smart flood sensors under the washing machine or sink won't help you there.

:::warn Holiday and a stuck flush
Imagine leaving for holiday and the toilet flush gets stuck. It can run up to **10,000 litres a day**. At today's Bratislava water prices (water + sewage about €3.59/m³ incl. VAT) that's about **€36 a day** – a nice **€360** over a 10-day holiday. With metering you get an alert the same day.
:::

If you water the garden from the mains, metering helps you dose **exactly the right amount** for the irrigated area. Not a litre more, not a litre less. 🙂

## What it costs

Less than you'd expect.

- **Electricity:** I recommend the **Shelly 3EM-63W Gen3**. It sits on top of the breakers and the wires pass through holes with current transformers, so it **takes up no space on the DIN rail**. It measures three phases (or three separate circuits) and works locally and reliably in Home Assistant.
- **Water and gas:** cost me about **€30** in total. I read the utility meters directly: the water meter with an **inductive sensor**, the gas meter with a **magnetic sensor** (the kind used in door sensors). Both run on an **ESP32-C6** that sits directly in the Zigbee network. It does take some ESP skills, though – the full how-to with wiring and code is in [Water and gas metering with an ESP32](/en/diy/water-and-gas-metering-esp32/).

![Shelly 3EM-63W Gen3 – a three-phase meter that sits directly on the breakers](/img/clanky/shelly-3em-63w-gen3.png)

:::warn The distribution board is an electrician's job
Installing a meter in the distribution board means working with voltage that kills. If it's not your profession, leave it to an electrician – it takes them a few minutes.
:::

## What's next

Continuous metering gives you many more options like these. Just watch it for a while – and the house will start telling you what's going on inside.

:::poll meranie-doma What do you already measure at home?
- nic: Nothing yet, just the bills
- elektrina: Electricity for the whole house
- okruhy: Electricity per circuit
- voda: Electricity and water
- vsetko: Electricity, water and gas
:::

What are you planning? If you're figuring out how to wire it up at home, [write to me](/en/about/).
