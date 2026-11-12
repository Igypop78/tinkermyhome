---
id: protocols
cover: /img/clanky/titulky/protokoly.jpg
title: Zigbee, WiFi, Z-Wave alebo Matter – ktorou cestou ísť
description: Akým „jazykom“ sa smart zariadenia rozprávajú s Home Assistantom, čím sa WiFi, Zigbee, Z-Wave a Matter líšia a na čo si dať pozor pri výbere.
section: start
level: 1
step: 3
date: 2026-11-08
time: '19:50'
slug: zigbee-wifi-zwave-matter
tldr: Smart zariadenie potrebuje „jazyk“, ktorým sa rozpráva s centrálou. **WiFi** máš doma zadarmo, ale pri desiatkach zariadení potrebuješ dobrý router. **Zigbee** a **Z-Wave** sú stavané pre smart home – úsporné, spoľahlivé, no potrebujú vlastný adaptér. **Matter** chce všetko spojiť, ale je ešte mladý. Rozhodni sa na začiatku – zmena neskôr znamená párovať všetko nanovo.
---

Doba jedného štandardu je dávno preč – a v smart home to platí dvojnásobne. Podobne ako sa telefón pripája na WiFi alebo mobilnú sieť, aj smart zariadenie sa potrebuje k niečomu pripojiť, aby sa vedelo rozprávať s okolím. Tomu „niečomu“ hovoríme komunikačný štandard alebo protokol.

Je to jedno z rozhodnutí, ktoré sa oplatí spraviť hneď na začiatku. Ušetríš peniaze a vyhneš sa problémom, keď zariadení pribudnú desiatky.

## WiFi

Domácu WiFi už máš, takže je to najlacnejšia cesta. Cez WiFi sa pripájajú nielen televízory, práčky či chladničky, ale aj senzory, relé na svetlá, ovládanie žalúzií a kúrenia. Veľa nových spotrebičov používa práve WiFi.

Znie to až príliš dobre? Má to háčiky:

- **Router.** Nie každý zvládne stovky zariadení naraz. Ak chceš stavať na WiFi, investuj do kvalitného routera – pár eur navyše ti ušetrí jeho výmenu.
- **Rušenie.** V bytovkách, kde je vedľa seba desiatky WiFi sietí, to vie potrápiť.
- **Zmena hesla.** Keď zmeníš názov siete alebo heslo, musíš nanovo pripojiť každé zariadenie. Preto sa oplatí **samostatná WiFi len pre smart zariadenia**, ku ktorej máš prístup iba ty.
- **Cloud.** Niektoré WiFi zariadenia komunikujú lokálne, iné len cez server výrobcu. Tým druhým sa vyhni – viac v [6 zásadách](/moj-dom/zasady-smart-domu/).

Veľká výhoda: WiFi zariadenie môžeš mať naraz vo viacerých systémoch (napríklad v Home Assistante aj v Google Home) a pri výmene centrály ho netreba znova párovať.

**Jednou vetou:** WiFi je lacná a všade, ale stojí na kvalitnom routeri.

## Zigbee

Zigbee je bezdrôtový protokol navrhnutý priamo pre smart home. Vytvára **mesh sieť** – zariadenia si signál posielajú medzi sebou, takže sieť má väčší dosah. Beží na rovnakej frekvencii ako WiFi (2,4 GHz), ale inak s ňou nemá nič spoločné.

Je úsporný (dôležité pri batériových senzoroch), stabilný a zariadení je obrovský výber za rozumné peniaze – napríklad od IKEA alebo Aqara. Aby fungoval dobre, treba myslieť na štyri veci:

1. **Potrebuješ adaptér (koordinátor)** – niečo ako router pre Zigbee. Niektoré centrály ho majú zabudovaný.
2. **Pri väčšom počte zariadení potrebuješ routre.** Mesh sieť stavajú zariadenia napájané zo siete (žiarovky, zásuvky, relé), nie batériové senzory.
3. **Kompatibilita.** Zigbee je spoločný štandard, ale nie každé zariadenie podporuje každá centrála.
4. **Jedno zariadenie = jedna centrála.** Keď zmeníš systém, musíš všetko spárovať nanovo, kus po kuse.

:::warn Žiarovka ako router
Ak ti ako Zigbee router slúži smart žiarovka a vypneš ju klasickým vypínačom, prestane posielať signál ďalej. Ostatné zariadenia si musia nájsť inú cestu – a to vie spôsobiť pomalé reakcie alebo výpadky.
:::

**Jednou vetou:** Zigbee je najlepší pomer cena/výkon pre senzory, ale chce adaptér a dosť zariadení napájaných zo siete.

## Z-Wave

Princíp je podobný ako pri Zigbee: mesh sieť, vlastný adaptér, párovanie k jednej centrále. Rozdiel je vo frekvencii. Z-Wave v Európe beží na **868 MHz**, takže ho WiFi neruší a má väčší dosah (pri Z-Wave Long Range výrobcovia uvádzajú až 2,4 km pri priamej viditeľnosti).

Pozor pri nákupe mimo EÚ: Z-Wave má v rôznych častiach sveta iné frekvencie. Kupuj zariadenia určené pre európsky trh (868,42 MHz).

**Jednou vetou:** Z-Wave je spoľahlivý a nerušený, ale zariadenia bývajú drahšie.

## Matter

Najnovší štandard. Vytvorila ho aliancia najväčších firiem – Apple, Google, Amazon, Samsung a ďalšie. Cieľ: zariadenie s logom Matter má fungovať v každom systéme bez ohľadu na značku.

Aby to nebolo také jednoduché, Matter má dve cesty:

- **Matter cez WiFi** používa bežnú domácu sieť. Hodí sa pre zariadenia napájané zo siete, ktoré potrebujú rýchlu odozvu – zásuvky, svetlá, termostaty. Netreba hub, ale zaťaží WiFi (opäť: kvalitný router).
- **Matter cez Thread.** Thread je nová úsporná mesh sieť pre malé batériové zariadenia – senzory, tlačidlá, zámky. Potrebuje aspoň jeden **Thread Border Router**, ktorý býva zabudovaný napríklad v HomePod mini, Google Nest Hub alebo niektorých zariadeniach Aqara, alebo si ho kúpiš samostatne.

:::me Ako to mám ja
Matter je u mňa stále „trouble maker“, hlavne cez Thread. Zatiaľ sa mu radšej vyhýbam.
:::

**Jednou vetou:** Matter má ambíciu všetko zjednodušiť, ale je ešte mladý.

## Porovnanie na jednom mieste

| | Matter (WiFi) | Matter (Thread) | Zigbee | Z-Wave |
|---|---|---|---|---|
| Typ siete | WiFi | mesh (Thread) | mesh | mesh |
| Spotreba energie | vyššia | nízka | nízka | nízka |
| Rýchlosť odozvy | veľmi rýchla | rýchla | dobrá | dobrá |
| Spoľahlivosť | dobrá (závisí od routera) | veľmi dobrá | dobrá | dobrá |
| Dosah | dobrý (router) | stredný (mesh) | stredný (mesh) | veľký (mesh) |
| Kompatibilita | vysoká, naprieč systémami | vysoká, naprieč systémami | podľa centrály | podľa centrály |
| Potrebuje hub | nie | len Border Router | áno | áno |
| Frekvencia | 2,4 / 5 GHz | 2,4 GHz | 2,4 GHz | 868 MHz (Európa) |

## Ktorou cestou ísť

Nemusíš si vybrať len jednu. Home Assistant zvládne všetky naraz a väčšina domácností skončí pri kombinácii:

- **Spotrebiče** (práčka, klimatizácia, TV) budú takmer vždy na WiFi – pred kúpou si over, či majú integráciu do Home Assistanta.
- **Senzory na batérie** (teplota, pohyb, okná) – Zigbee. Thread zatiaľ len ak sa nebojíš experimentovať.
- **Relé za vypínačmi** – Zigbee, Z-Wave alebo lokálna WiFi (napr. Shelly).

:::me Ako to mám ja
Zigbee (cez Zigbee2MQTT) aj Z-Wave mi obsluhuje jeden multi-radio adaptér SLZB-MRW10U. Bluetooth zariadenia chytám cez Bluetooth proxy – malé ESP32 zariadenia, ktoré zachytia signál a pošlú ho do Home Assistanta. Shelly a ďalšie zariadenia idú cez WiFi alebo kábel (LAN). Matter cez Thread zatiaľ obchádzam.
:::

V ďalšej časti: **Čím doma začať a čomu sa vyhnúť**.
