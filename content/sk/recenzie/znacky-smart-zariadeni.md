---
id: brands
cover: /img/clanky/titulky/znacky.jpg
title: Značky smart zariadení – čo u mňa vydržalo a čo skončilo v koši
description: Shelly, Aqara, IKEA, Sonoff, Fibaro, Tado, UniFi, Hikvision, Lidl aj Tuya – moje skúsenosti so značkami smart zariadení po 13 rokoch smart domácnosti. Čo odporúčam, čo s výhradami a čomu sa vyhýbam.
section: reviews
level: 1
date: 2026-11-19
time: '18:00'
slug: znacky-smart-zariadeni
tldr: Neviažem sa na jednu značku – vyberám podľa typu zariadenia. **Shelly** na moduly za vypínače, **Aqara** na batériové senzory, **Fibaro** na Z-Wave, **ESP32** na kutilské projekty, **Tado X** na hlavice, **UniFi** na WiFi. **IKEA** má najlepšiu cenu, ale s výhradami. **Tuya** mi nikdy nesadla a batériové Shelly tiež nie.
---

Ktorú značku smart zariadení kúpiť? Túto otázku dostávam najčastejšie. Odpoveď je jednoduchá a zároveň nie: **jednu značku na všetko neodporúčam**. Každý výrobca je dobrý v niečom inom.

Smart domácnosť mám od roku 2013 a dnes mám v dome **311 zariadení v Home Assistante**. Toto je zhrnutie, čo mi za ten čas vydržalo, čo funguje s výhradami a čo skončilo v koši.

## Zhrnutie v tabuľke

| Značka | Na čo ju mám | Verdikt |
|---|---|---|
| **Shelly** | moduly za vypínače, meranie spotreby | ✅ odporúčam (batériové nie) |
| **Aqara** | batériové senzory, panely W100, kamera G5 | ✅ odporúčam |
| **Sonoff** | moduly na WiFi aj Zigbee | ✅ odporúčam |
| **Fibaro** | Z-Wave moduly z prvej inštalácie | ✅ spoľahlivé, drahšie |
| **ESP32** | kutilské projekty | ✅ ako stvorené |
| **Tado X** | hlavice na radiátory v byte | ✅ drahšie, ale jediné, čo vydržali |
| **UniFi** | WiFi sieť | ✅ jednoznačne |
| **Hikvision** | kamery | ✅ najviac nastavení |
| **IKEA** | žiarovky, ovládače | ⚠️ najlepšia cena, ale s výhradami |
| **Lidl** | tlačidlo zvončeka | ⚠️ funkčné, ale objemné |
| **Tuya** | – | ❌ mne nesadla |

## Shelly – moduly za vypínače

Shelly je u mňa jednička na **moduly, ktoré sa schovajú za pôvodný vypínač**. Novšie generácie sú maximálne univerzálne a spoľahlivé:

- **WiFi aj Zigbee** – vyberieš si podľa toho, akú sieť doma staviaš,
- **lokálne ovládanie** bez cloudu – modul funguje, aj keď Home Assistant práve nebeží,
- **super cena**.

Prvé generácie mali problém s **kondenzátormi** a odchádzali po 2–3 rokoch. Novšie verzie už tento problém nemajú.

**Batériové zariadenia Shelly** mi však nesadli. Na senzory na batérie používam radšej Aqaru.

![Shelly 3EM-63W Gen3 – trojfázový merač, ktorý sa nasadí priamo na ističe](/img/clanky/shelly-3em-63w-gen3.png)

:::me Ako to mám ja
Spotrebu meria v každej sekcii rozvádzača jedno **Shelly 3EM Gen3** – viac v článku [Začni meraním spotreby](/energia/zacni-meranim-spotreby/). Ako zapojiť relé za vypínač, je v článku [Smart žiarovka a vypínač](/zacni-tu/smart-ziarovka-a-vypinac/).
:::

## Aqara – batériové senzory

Na **teplotu, pohyb a otvorené dvere či okná** používam Aqaru. Senzory sú **malé, pekné, funkčné** a batérie v nich vydržia neuveriteľne dlho.

V každej izbe mám aj panel **Aqara W100** – ukazuje teplotu a nastavuje sa na ňom, koľko má byť v izbe stupňov.

![Aqara W100 – ovládač a displej v izbe](/img/clanky/kurenie-aqara-w100.jpg)

## Sonoff – veľký výber za rozumné peniaze

Sonoff má **super pomer ceny a výkonu** a obrovský výber modulov na **WiFi aj Zigbee**. Zigbee relé navyše posilnia Zigbee sieť, lebo samy fungujú ako router.

## Fibaro – Z-Wave, ktoré nezlyhá

Z mojej prvej inštalácie mám stále **Z-Wave moduly Fibaro**. **Neodišiel ani jeden** a všetky sú stále funkčné. Sú trochu drahšie. Ako som s Fibarom začínal, píšem v [mojej ceste smart domácnosťou](/moj-dom/moja-cesta-smart-domacnostou/).

## ESP32 – na kutilské projekty

Na domáce kutilské projekty je **ESP32** ako stvorené – napríklad **ESP32-C6 mini**, **ESP32 WROOM** alebo iná alternatíva. Stojí pár eur a s ESPHome ho nahráš bez programovania. Čo všetko mi na ňom beží, je v článku [ESP32 – moje projekty](/diy/esp32-moje-projekty/).

## Tado X – hlavice na radiátory

Hlavice na radiátory boli u mňa najdlhšie hľadanie. **Aqara, Tuya aj staršie verzie hlavíc Popp a Danfoss skončili v koši.** Vydržal až **Tado X**:

- **tiché**,
- **nabíjateľné batérie** cez USB-C, vydržia celú sezónu,
- **krásny dizajn** a príjemné ovládanie.

Majú aj nevýhody: sú **drahšie**, fungujú **len cez Matter** a potrebujú **vlastnú bránu**.

![Smart hlavice Tado X](/img/clanky/kurenie-tado-x.jpg)

:::me Ako to mám ja
Tado X mám v byte, kde je teplo z centrálneho zdroja. V dome kúrime inak – ventily spínajú relé a logiku drží Home Assistant. Oba prípady rozoberám v článku [Smart kúrenie](/moj-dom/smart-kurenie/).
:::

## UniFi – WiFi sieť

Na WiFi jednoznačne **UniFi**. Keď má doma bežať desiatky WiFi zariadení, kvalitná sieť je základ – viac o tom v článku [Zigbee, WiFi, Z-Wave alebo Matter](/zacni-tu/zigbee-wifi-zwave-matter/).

## Kamery – Hikvision a Aqara G5

Mám kamery **Hikvision** a **Aqara G5**. Obe zvládnu **nočný režim vo farbe**. Hikvision má **viac možností nastavenia**.

## IKEA – najlepšia cena, ale s výhradami

IKEA je **najlepší pomer ceny a hodnoty**. Ich **smart žiarovky** sú výborné, čo sa svietivosti týka.

Má to však háčiky:

- **párovanie** je veľký problém a občas aj **stabilita**,
- **batériové zariadenia** občas vypadávajú a často žerú batérie,
- od roku 2025 IKEA predáva **už len Matter zariadenia**.

## Lidl – funkčné, ale objemné

Smart zariadenia z Lidla sú funkčné, ale dosť objemné. Jedna výnimka je u mňa veľmi obľúbená: **tlačidlo zvončeka**. Je odolné voči počasiu – visí vonku na slnku aj v daždi **vyše 2 roky** a stále funguje.

## Tuya – mne nikdy nesadla

Tuya sa dá ovládať aj lokálne, ale **väčšina zariadení tlačí pripojenie cez cloud**. To je proti [mojim zásadám](/moj-dom/zasady-smart-domu/) – dom musí fungovať aj bez internetu. Táto značka mi nikdy nesadla. Možno jej krivdím, ale nechýba mi.

## Čo si z toho zobrať

1. **Vyberaj podľa typu zariadenia**, nie podľa značky. Moduly za vypínače, senzory a hlavice sú tri rôzne svety.
2. **Lokálne ovládanie bez cloudu** – dom musí fungovať, aj keď internet nejde.
3. **Batériové zariadenia** sú najväčšia lotéria – tu sa oplatí siahnuť po overenej značke.
4. **Pri hlaviciach na radiátory** som tri značky vyhodil, kým som skončil pri Tado X.

Nevieš, akým „jazykom“ majú zariadenia hovoriť? Začni článkom [Zigbee, WiFi, Z-Wave alebo Matter](/zacni-tu/zigbee-wifi-zwave-matter/). A ďalšie otázky nájdeš v [častých otázkach](/caste-otazky/).
