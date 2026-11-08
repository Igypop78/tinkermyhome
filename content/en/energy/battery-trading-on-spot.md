---
id: fve-payback
title: A battery that trades – running solar on spot prices with AI Energy
description: How my home battery buys electricity at the low tariff and sells it at spot prices. A real day in a chart, the AI Energy logic, controlling a Deye inverter from Home Assistant and the numbers from the first two months.
section: energy
level: 3
date: 2026-11-08
time: '22:30'
slug: battery-trading-on-spot
tldr: Since September I sell electricity at **spot prices** and still buy at a **fixed two-rate tariff**. I charge the battery at the low tariff for €0.12/kWh and sell it in the most expensive 15-minute slots – morning and evening. My integration **AI Energy** plans it and a Home Assistant automation switches the Deye inverter. In September and October electricity earned me **€352**; in July and August, on a virtual battery with 65 % more solar, only **€95**.
---

I often hear that a battery for solar is nice to have but will never pay for itself. Today my battery trades electricity twice a day, and in October – with half the sun of July – it earned three times as much as in summer. In this article I'll show how it works, what you need and what the real numbers are.

:::warn For advanced users
This article assumes you have solar with a battery, an inverter you can control from Home Assistant, and you know what HACS is. If not, start with the [Start here](/en/start-here/home-assistant-explained/) series.
:::

## How it started

I had been eyeing the spot market for a while. With a 34 kWh battery I can really push a lot of energy into the grid at once. But the "virtual battery" offered by my supplier ZSE paid only a fraction of what electricity traded for on the spot market.

While I was on the virtual battery, I tried to use my surplus at home. I only exported what I couldn't burn – for a few cents.

The turning point came when I learned two things from the community: in Slovakia **a private person can sell at spot prices**, and at the same time I can **keep buying at a fixed price**. I've been on spot since 1 September 2026. At first I controlled the battery only roughly, with manual rules. Then the AI Energy integration was born – I put it live the day after it was created, and you could see it worked.

I also tried the ready-made [Predbat](https://github.com/springfall2008/batpred), but it was too complex for me. I wanted my own transparent logic. I want to know what's happening in my house and why.

## How it works in short

The whole trick is that **I buy and sell at different prices**:

| | At what price | How I have it |
|---|---|---|
| **Buying** | fixed two-rate tariff | ZSE, DD3 tariff: low tariff (NT) ~€0.12/kWh, high tariff (VT) ~€0.21/kWh including distribution |
| **Selling** | spot price minus a fee | V-elektra: OKTE spot − €15/MWh |

The spot price changes every 15 minutes, and prices for the next day are known a day ahead. They tend to be high in the morning and especially in the evening, lower during the day and at night.

So the battery buys at the low tariff for a fixed €120/MWh and sells in the most expensive 15-minute slots. Since buying is fixed, I don't care what the spot price is while charging.

:::info Units
Spot prices are quoted in €/MWh. €120/MWh = €0.12/kWh, €600/MWh = €0.60/kWh.
:::

## One real day

This is the AI Energy plan for Monday 9 November 2026. The blue line is the spot price, the dashed line the selling threshold, the colours show what the battery is doing, and below is the battery's state of charge.

![Spot prices and battery plan for 9 Nov 2026](/img/clanky/spot-2026-11-09-en.svg)

1. **00:00 – 02:45 – charging at the low tariff.** The battery charges to 100 % for a fixed €0.12/kWh.
2. **02:45 – 06:00 – house from the grid.** Still low tariff; the house runs from the grid and the battery waits for the morning peak.
3. **06:00 – 09:00 – morning sale.** Spot rises to €356–438/MWh, above the morning selling threshold of €350/MWh. The battery sells down to 13 %.
4. **09:00 – 13:45 – sunshine.** First only solar output is sold, then solar charges the battery.
5. **13:45 – 15:30 – afternoon low tariff.** The battery tops up to 100 %. Spot is already €566/MWh by then, but I'm buying at a fixed €120.
6. **15:45 – 18:00 – evening sale.** The most expensive slots of the day, up to €637/MWh. It sells above the evening threshold of €585/MWh.
7. **In the evening** the house runs from the battery; at 23:45 the next low-tariff period starts.

According to the plan, on this day the battery **sells 56 kWh for €26.45** and **buys 51 kWh for €6.11**.

## How AI Energy decides

[AI Energy](https://github.com/Igypop78/ai-energy) is my Home Assistant integration. It plans the battery in 15-minute steps and always tells you what it's doing and why – for example *"Selling €287 ≥ threshold €281"*.

- **Windows between low tariffs.** The day is split into windows between low-tariff periods. In each window the battery sells in the **most expensive slots** – as many as there is energy for. The price of the cheapest of them is the selling threshold.
- **At the low tariff it charges only what's needed** for the sales in the next window and for the house until the next low tariff (minus the sun expected by Solcast). Running the house from the battery pays off when the low tariff with losses and wear is cheaper than the high tariff: 120 / 0.9 + 45 = €178/MWh < €210/MWh.
- **Battery wear** I count as €45/MWh. Every kWh that goes through the battery wears it a little, and the sale has to pay for that too.
- **Minimum selling price** is the selling fee + low tariff with losses + wear + profit: 15 + 133 + 45 + 40 = **€233/MWh**. Below it, nothing is sold. I have mine set to €300/MWh.
- **Min SOC is a target, not a wall.** Selling stops so that after the house's consumption until the next low tariff the battery ends at the minimum. The inverter holds the hard lower limit.

You see it all on the cards that install with the integration. The Igy Price Action Card shows prices, the selling threshold and the plan as a timeline; the Igy Battery Action Card shows the mode, the reason and the settings.

## What you need

- **A battery and an inverter you can control from Home Assistant.** I have a Deye SUN-10K-SG04LP3-EU connected locally through the Solarman integration.
- **A reliable state of charge (SOC).** The plan depends on how much energy is really in the battery. My bank is measured by a Victron SmartShunt – it's the source of truth; I don't use the battery data from the Deye.
- **Spot prices in Home Assistant** – a sensor with OKTE prices for today and tomorrow.
- **A solar forecast** – I use Solcast. My real production is about 80 % of the forecast, which is why AI Energy has a correction.
- **A contract to sell at spot.** I sell through V-elektra and keep buying from ZSE.
- **A two-rate tariff.** Without a cheap low tariff there's nothing cheap to charge from. Without it you can only sell what the sun produces.
- **HACS** and the [AI Energy](https://github.com/Igypop78/ai-energy) integration.

## How Home Assistant switches the Deye

AI Energy decides **what** should happen – for example *selling from battery* or *charging from grid*. It sends that to the inverter through the mode selector `input_select.deye_operation_mode`. How each mode translates into Deye settings is handled by my automation.

This was the biggest torture of the whole project. Finding the right combination of Deye settings for every mode took me a long time. The result:

| Mode | Work mode | Time of use (TOU) | Battery charge | Battery discharge | Export surplus | Grid charging |
|---|---|---|---|---|---|---|
| Normal | Zero Export To CT | on | 200 A | 200 A | yes | no |
| Export Now | Zero Export To CT | on | 0 A | 200 A | yes | no |
| Export from Battery | Export First | on | 0 A | 200 A | yes | no |
| Zero Export | Zero Export To CT | on | 200 A | 200 A | no | no |
| Charge from Grid | Zero Export To CT | off | 200 A | 200 A | – | yes |
| Grid Only | Zero Export To CT | on | 200 A | 0 A | yes | no |

Three principles helped me write the automation:

- **Write only what doesn't match, one value at a time.** A failure in one write doesn't stop the others.
- **Verify and retry.** After writing, the automation checks the inverter and retries whatever doesn't match – up to 3 times. If the inverter still doesn't match, you get a notification.
- **Check regularly.** Every 5 minutes and whenever Solarman comes back after an outage – so the settings get fixed even after a communication drop.

```yaml automations.yaml
alias: Menič – aplikovanie stavu
description: >-
  Nastavuje Deye podľa input_select.deye_operation_mode. Pre každý režim je
  jedna tabuľka požadovaných hodnôt; zapisuje sa len to, čo na meniči nesedí,
  každý zápis zvlášť (chyba jedného nezastaví ostatné), potom sa overí a
  nesediace sa skúsi znova (max 3×). Kontrola všetkých nastavení každých 5 min a
  po návrate Solarmanu. Ak menič ani po 3 pokusoch nesedí, príde upozornenie.
triggers:
  - trigger: state
    entity_id: input_select.deye_operation_mode
    id: zmena
  - trigger: state
    entity_id:
      - select.menic_pracovny_rezim
      - select.menic_cas_pouzitia
      - number.menic_bateria_max_nabijanie_prud
      - number.menic_bateria_max_vybijanie_prud
      - switch.menic_dodavka_prebytok
      - switch.menic_bateria_siet_nabijanie
    from:
      - unavailable
      - unknown
    for:
      seconds: 30
    id: obnova
  - trigger: time_pattern
    minutes: /5
    id: kontrola
  - trigger: homeassistant
    event: start
    id: obnova
conditions: []
actions:
  - variables:
      rezim: '{{ states(''input_select.deye_operation_mode'') }}'
      ciel: |-
        {% set t = {
          'Normal':              {'wm': 'Zero Export To CT', 'tou': 'Enabled',  'chg': 200, 'dis': 200, 'exp': 'on',  'grid': 'off'},
          'Export Now':          {'wm': 'Zero Export To CT', 'tou': 'Enabled',  'chg': 0,   'dis': 200, 'exp': 'on',  'grid': 'off'},
          'Export from Battery': {'wm': 'Export First',      'tou': 'Enabled',  'chg': 0,   'dis': 200, 'exp': 'on',  'grid': 'off'},
          'Zero Export':         {'wm': 'Zero Export To CT', 'tou': 'Enabled',  'chg': 200, 'dis': 200, 'exp': 'off', 'grid': 'off'},
          'Charge from Grid':    {'wm': 'Zero Export To CT', 'tou': 'Disabled', 'chg': 200, 'dis': 200, 'exp': none,  'grid': 'on'},
          'Grid Only':           {'wm': 'Zero Export To CT', 'tou': 'Enabled',  'chg': 200, 'dis': 0,   'exp': 'on',  'grid': 'off'},
        } %}{{ t.get(rezim, {}) }}
      ent:
        wm: select.menic_pracovny_rezim
        tou: select.menic_cas_pouzitia
        chg: number.menic_bateria_max_nabijanie_prud
        dis: number.menic_bateria_max_vybijanie_prud
        exp: switch.menic_dodavka_prebytok
        grid: switch.menic_bateria_siet_nabijanie
  - condition: template
    value_template: '{{ ciel | count > 0 }}'
  - wait_template: >-
      {{ ent.values() | map('states') | select('in', ['unavailable', 'unknown'])
      | list | count == 0 }}
    timeout: '00:02:00'
    continue_on_timeout: false
  - repeat:
      sequence:
        - variables:
            zle: >-
              {% set ns = namespace(z=[]) %} {% for k, v in ciel.items() if v is
              not none %}
                {% set s = states(ent[k]) %}
                {% if k in ['chg', 'dis'] %}{% set ok = s | float(-1) == v | float %}{% else %}{% set ok = s == v %}{% endif %}
                {% if not ok %}{% set ns.z = ns.z + [k] %}{% endif %}
              {% endfor %}{{ ns.z }}
        - if:
            - condition: template
              value_template: '{{ zle | count == 0 }}'
          then:
            - action: persistent_notification.dismiss
              data:
                notification_id: deye_nesedi
            - stop: Menič sedí
        - if:
            - condition: template
              value_template: '{{ ''wm'' in zle }}'
          then:
            - action: select.select_option
              target:
                entity_id: select.menic_pracovny_rezim
              data:
                option: '{{ ciel.wm }}'
              continue_on_error: true
            - delay: 2
        - if:
            - condition: template
              value_template: '{{ ''tou'' in zle }}'
          then:
            - action: select.select_option
              target:
                entity_id: select.menic_cas_pouzitia
              data:
                option: '{{ ciel.tou }}'
              continue_on_error: true
            - delay: 2
        - if:
            - condition: template
              value_template: '{{ ''chg'' in zle }}'
          then:
            - action: number.set_value
              target:
                entity_id: number.menic_bateria_max_nabijanie_prud
              data:
                value: '{{ ciel.chg }}'
              continue_on_error: true
            - delay: 2
        - if:
            - condition: template
              value_template: '{{ ''dis'' in zle }}'
          then:
            - action: number.set_value
              target:
                entity_id: number.menic_bateria_max_vybijanie_prud
              data:
                value: '{{ ciel.dis }}'
              continue_on_error: true
            - delay: 2
        - if:
            - condition: template
              value_template: '{{ ''exp'' in zle }}'
          then:
            - action: switch.turn_{{ ciel.exp }}
              target:
                entity_id: switch.menic_dodavka_prebytok
              continue_on_error: true
            - delay: 2
        - if:
            - condition: template
              value_template: '{{ ''grid'' in zle }}'
          then:
            - action: switch.turn_{{ ciel.grid }}
              target:
                entity_id: switch.menic_bateria_siet_nabijanie
              continue_on_error: true
            - delay: 2
        - action: logbook.log
          data:
            name: Deye
            message: >-
              {{ rezim }}: zapisujem {{ zle | join(', ') }} (pokus {{
              repeat.index }}, {{ {'zmena': 'zmena režimu', 'obnova': 'po
              výpadku / štarte', 'kontrola': 'kontrola – menič
              nesedel'}.get(trigger.id, trigger.id) }})
        - delay: 30
      until:
        - condition: template
          value_template: '{{ repeat.index >= 3 }}'
  - variables:
      zle: >-
        {% set ns = namespace(z=[]) %} {% for k, v in ciel.items() if v is not
        none %}
          {% set s = states(ent[k]) %}
          {% if k in ['chg', 'dis'] %}{% set ok = s | float(-1) == v | float %}{% else %}{% set ok = s == v %}{% endif %}
          {% if not ok %}{% set ns.z = ns.z + [k ~ '=' ~ s ~ ' (chcem ' ~ v ~ ')'] %}{% endif %}
        {% endfor %}{{ ns.z }}
  - if:
      - condition: template
        value_template: '{{ zle | count > 0 }}'
    then:
      - action: persistent_notification.create
        data:
          notification_id: deye_nesedi
          title: Deye nesedí s režimom {{ rezim }}
          message: 'Ani po 3 pokusoch: {{ zle | join('', '') }}'
    else:
      - action: persistent_notification.dismiss
        data:
          notification_id: deye_nesedi
mode: restart
```

The `select.menic_…`, `number.menic_…` and `switch.menic_…` entities come from the Solarman integration, just renamed in Slovak following my [naming scheme](/en/my-home/smart-home-rules/#6-be-structured). Yours will be named differently.

## What to watch out for

:::warn Main breaker
Once, car charging and battery charging from the grid started at the same time. I was at the limit of my main breaker (3 × 25 A). Luckily I noticed straight away. On top of that, my inverter and wallbox share one cable, so the draw must stay below 12 kW. AI Energy now knows the breaker and the shared limit, and the battery takes priority over the car when charging.
:::

Other things I had to fix are in the [AI Energy changelog](https://github.com/Igypop78/ai-energy/blob/main/CHANGELOG.md). The two most instructive:

- **Selling during its own low tariff.** When prices during the afternoon low tariff were higher than in the evening, the plan picked exactly those slots to sell. But that's when the battery charges, so almost nothing was sold and in the evening the house just ran from the battery.
- **Unused battery.** When the sun topped up the battery before the low tariff, the plan didn't count that energy. In the evening the battery ended at 30 % with a 10 % minimum and high prices.

## The numbers: virtual battery vs. spot

Electricity only – no gas or water. "Total" is sales minus grid purchases. House consumption is 1,200 to 1,350 kWh a month, including charging the car.

| Month | Mode | Solar production | Exported | Imported | Total |
|---|---|---|---|---|---|
| July 2026 | virtual battery | 2,281 kWh | 1,046 kWh / €53.42 | 5 kWh / €1.03 | **+€52.39** |
| August 2026 | virtual battery | 2,037 kWh | 819 kWh / €44.29 | 8 kWh / €1.64 | **+€42.65** |
| September 2026 | spot | 1,512 kWh | 1,051 kWh / €225.87 | 408 kWh / €50.87 | **+€175.00** |
| October 2026 | spot | 1,099 kWh | 1,251 kWh / €342.26 | 1,292 kWh / €164.91 | **+€177.35** |

In summer I got on average **5 cents** per kWh exported, in October **27 cents**. In October I bought more than three times as much from the grid as in September, but at an average of €0.13/kWh – almost all at the low tariff – and sold it for more.

Honestly, also what isn't in the table: about 1.4 MWh went through the battery in October, which at €45/MWh means **around €64 of wear**. Even after subtracting it, October earned more than July and August together. And I'm comparing summer with autumn – in winter there will be even less sun; I'll keep publishing the numbers.

## Does a battery pay off?

The whole solar system with the battery cost me around €8,000, of which the battery was about €3,500. On the virtual battery, the battery mainly covered the nights – in summer I bought almost nothing from the grid. On spot it earns twice a day – morning and evening – and most of all exactly when the sun isn't shining.

If you have a battery and a two-rate tariff and you're still on a virtual battery or a fixed feed-in price, it's worth calculating what spot would give you. And if you don't have a battery yet because you've heard it never pays off – these numbers are worth a thought.

## Getting started with AI Energy

1. In HACS add the custom repository `https://github.com/Igypop78/ai-energy` (category Integration), download **AI Energy** and restart Home Assistant.
2. **Settings → Devices & services → Add integration → AI Energy.** The wizard guides you step by step: prices, tariff, selling, battery, solar, inverter, car charger and breaker.
3. At first, leave **Battery control off**. The integration then only recommends, switches nothing, and you see what it would do and why.

:::tip Try it without a battery
Create a Number helper called *Sim SOC* (0–100 %) and pick it as the battery SOC in the wizard. Moving the value shows you how the plan and the recommended mode change.
:::

AI Energy is still in development and its interface is in Slovak for now. If you try it, let me know at [ahoj@tinkermyhome.com](mailto:ahoj@tinkermyhome.com) or on [GitHub](https://github.com/Igypop78/ai-energy) – how it works for you and what you'd need.
