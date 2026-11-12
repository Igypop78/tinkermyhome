---
id: smart-devices
cover: /img/clanky/titulky/smart-zariadenia.jpg
title: Čo všetko je smart zariadenie – senzory, ovládače, virtuálne zariadenia a mozog domu
description: Nie všetko, čo je pripojené na internet, je smart. Prehľad druhov smart zariadení – od senzorov cez aktívne a virtuálne zariadenia až po riadiacu jednotku.
section: start
level: 1
date: 2026-11-08
time: '21:35'
slug: smart-zariadenia
tldr: Smart je zariadenie, ktoré sa vie **rozprávať s ostatnými** – dať im informáciu alebo sa nechať ovládať. Delíme ich na **senzory, vstupné a aktívne zariadenia, koordinátory a repeatery, virtuálne a zobrazovacie zariadenia** a nad tým všetkým stojí **riadiaca jednotka** – mozog domu.
---

Pod pojem „smart“ dnes výrobcovia zaradia takmer všetko. Preto si najprv ujasnime, čo smart zariadenie na tomto webe znamená.

**Smart zariadenie vie komunikovať s inými zariadeniami** – dať im informácie alebo sa nechať nimi ovládať. Robotický vysávač preto pre mňa nie je smart, kým ho neviem automaticky pustiť, keď odídem z domu. A „smart“ žiarovka na diaľkové ovládanie nie je smart, kým ju neviem ovládať z riadiacej jednotky alebo mimo domu.

Zjednodušene: smart sú zariadenia, ktoré sa navzájom vidia a vedia sa dorozumieť – priamo alebo cez riadiacu jednotku.

## Senzory

Najpočetnejšia skupina. Senzor môže byť jednoúčelový (teplomer) alebo viacúčelový (teplota, vlhkosť, svetlo a pohyb v jednom). Zvyčajne bývajú na batérie, ale sú aj senzory napájané zo siete. Ich informácie slúžia na ovládanie iných zariadení, upozornenia alebo štatistiky.

| Druh | Príklady |
|---|---|
| Meranie prostredia | teplota, vlhkosť, intenzita svetla, kvalita vzduchu (prach, CO, CO₂), hluk |
| Detekcia stavu | otvorené dvere a okná, pohyb a prítomnosť, únik vody, dym a iné škodlivé látky |
| Meranie spotreby | spotreba a výroba elektriny, prietok vody a plynu |

## Vstupné zariadenia

Podobne ako senzory len posielajú informáciu ďalej. Rozdiel je v tom, že potrebujú **akciu** – od teba alebo iného zariadenia. Patria sem diaľkové ovládače, tlačidlá, klávesnica alarmu, stav vypínača, ale aj senzory otvorených okien a dverí.

Cez ne vyvolávaš ďalšie akcie v dome a ovládaš aktívne zariadenia.

## Aktívne zariadenia

Všetko, čo niečo robí: svetlá, kúrenie, chladenie, zámky, motory žalúzií, ventily, vypínače, reproduktory aj spotrebiče, ktoré perú, vysávajú či umývajú. Takmer vždy fungujú obojsmerne – dajú sa ovládať a zároveň hlásia svoj stav. So senzormi sa vedia prepojiť aj priamo, najčastejšie však cez riadiacu jednotku.

## Koordinátory a repeatery

**Koordinátor** (niekedy aj router) je jednoúčelové zariadenie, cez ktoré riadiaca jednotka komunikuje so zariadeniami v danom štandarde – niečo ako anténa. Ktoré štandardy existujú, vysvetľujem v článku [Zigbee, WiFi, Z-Wave alebo Matter](/zacni-tu/zigbee-wifi-zwave-matter/).

**Repeater** šíri signál ďalej a zväčšuje pokrytie vo väčších domácnostiach. Často túto úlohu plnia smart zariadenia napájané zo siete (žiarovky, zásuvky), ale môže to byť aj zariadenie určené len na to.

:::warn Pozor na žiarovky
Ak ako repeater slúži žiarovka a vypneš ju klasickým vypínačom, prestane posielať signál ďalej. Ostatné zariadenia si musia nájsť inú cestu – a to vie spôsobiť pomalé reakcie alebo výpadky.
:::

## Virtuálne zariadenia

Okrem zariadení, ktoré vieš chytiť do ruky, sa v smart home veľmi často používajú virtuálne. Zjednodušujú automatizácie a ovládanie, slúžia aj na štatistiky. Napríklad:

- teplotný senzor, ktorý počíta priemernú teplotu v dome z ostatných senzorov,
- senzor spotreby plynu v kWh, ktorý sa prepočíta z hodnoty odčítanej z plynomera,
- senzor „je niekto doma“, ktorý vyhodnotí stav viacerých iných senzorov.

Časom ich budeš mať desiatky až stovky. V Home Assistante sa im hovorí pomocníci (helpers).

:::me Ako to mám ja
Aj termostaty v jednotlivých izbách mám virtuálne. Teplotu meria malý ovládač na stene, termohlavicu spína relé a celú logiku – kedy kúriť – drží virtuálny termostat v Home Assistante.
:::

## Zobrazovacie zariadenia

Mobil, tablet, nástenný panel, LED pás aj reproduktor. Poskytujú informácie a zároveň slúžia na ručné ovládanie. Informácia nemusí byť len na obrazovke – vie to byť aj zmena farby svetla alebo hlasové oznámenie. Na prehľad sa najčastejšie používa tablet alebo mobil s upraveným dashboardom. Čo na ňom bude, je len na tebe.

:::me Ako to mám ja
Na stene máme dotykový displej s vlastnou stránkou namiesto bežného dashboardu. Okolo neho je LED pás, ktorý farbou ukazuje stav domu – vidno ho aj z druhého konca miestnosti, bez čítania.
:::

## Riadiaca jednotka – mozog domu

Na záver to najdôležitejšie, bez čoho by smart home nebol smart. Riadiaca jednotka (hub, centrála):

- **prepája všetky zariadenia** – všetko nájdeš na jednom mieste,
- **zbiera informácie a pokyny** zo zariadení,
- **uchováva a vykonáva automatizácie**, ktoré si nastavíš.

V podstate je to počítač. Kľúčový nie je ani tak hardvér ako softvér, cez ktorý smart home ovládaš. Výkonovo stačí veľmi jednoduché zariadenie – rozhoduje **spotreba**, keďže beží 24/7, a **komunikačné rozhrania**. Tie určia, s akými zariadeniami sa jednotka dohovorí. Výrobcovia sa väčšinou zamerajú len na niektoré štandardy (najčastejšie WiFi a Zigbee, najnovšie Matter) a Z-Wave býva pri lacných jednotkách zriedkavý.

Na trhu sú desiatky riadiacich jednotiek – od jednoduchých za pár eur po sofistikované za niekoľko stoviek. Univerzálne riešenie neexistuje. Ako vybrať medzi hotovým systémom a Home Assistantom, píšem v článku [Potrebuješ vôbec smart home?](/zacni-tu/potrebujem-smart-home/), a na čom Home Assistant spustiť, v [inštalácii Home Assistanta](/zacni-tu/instalacia-home-assistanta/).
