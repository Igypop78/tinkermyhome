---
id: ha-basics
title: Home Assistant pre začiatočníkov: entity, zariadenia, automatizácie a celý ten zvyšok
description: Integrácia, zariadenie, entita, automatizácia, scéna, aplikácie, HACS, dashboardy a karty – vysvetlené jednoducho, na príkladoch z reálneho domu.
section: start
level: 1
step: 1
date: 2026-11-08
updated: 2026-11-08
slug: home-assistant-pre-zaciatocnikov
tldr: **Integrácia** sa spojí s tvojím hardvérom a vytvorí **zariadenia**. Každé zariadenie má **entity** – jednotlivé hodnoty a ovládače. **Automatizácie** na entity reagujú, **scény** nastavia veľa entít naraz a **dashboardy** ich ukazujú na **kartách**. Keď pochopíš týchto pár slov, zvyšok Home Assistanta dáva zmysel.
---

Keď prvýkrát otvoríš Home Assistant, zasype ťa slovami: integrácie, entity, pomocníci, scény, skripty, HACS, karty… Netreba sa ich učiť naspamäť. Stačí pochopiť, ako do seba zapadajú – a na to ti stačí jeden obrázok v hlave.

## Celé to v jednom riadku

**Integrácia → zariadenie → entita → automatizácia / scéna → dashboard**

Najlepšie sa to vysvetľuje na konkrétnej veci. Zoberme si smart práčku, napríklad Electrolux.

- **Integrácia** je spôsob, akým sa práčka dorozumie s Home Assistantom. Integrácia Electrolux vie, ako sa s práčkou spojiť a čo znamenajú údaje, ktoré posiela – aby HA vedel, čo je čo.
- **Zariadenie** je samotná práčka. V HA ju uvidíš ako jednu položku s výrobcom, modelom a miestnosťou, v ktorej stojí.
- **Entity** sú jednotlivé funkcie a údaje práčky. Každú vieš čítať alebo ovládať zvlášť.

| Entita práčky | Čo ukazuje | Príklad stavu |
|---|---|---|
| Stav prania | v akej fáze práčka je | pranie, žmýkanie, hotovo |
| Čas do konca | koľko ešte zostáva | 42 min |
| Koniec prania | kedy bude hotovo | 14:35 |
| Zvolený program | čo práve beží | Bavlna |
| Teplota | na koľko perie | 40 °C |
| Otáčky | ako rýchlo žmýka | 1200 ot./min |

Všetko, čo budeš robiť neskôr, robíš s entitami, nie s celou práčkou. Automatizácia „pošli správu, keď je pranie hotové“ sleduje len entitu stavu prania. Karta na dashboarde zas ukáže čas do konca a zvolený program.

Rovnako to funguje aj pri malom senzore: integrácia Zigbee2MQTT nájde pohybový senzor v kúpeľni (zariadenie). Ten má niekoľko entít: pohyb, osvetlenie, batériu a teplotu. Automatizácia „rozsvieť pri pohybe“ potom pracuje len s entitou pohybu.

## Slovník, ktorý budeš vidieť všade

| Pojem | Čo to je | Príklad |
|---|---|---|
| Integrácia | Spojenie s výrobcom, protokolom alebo službou | Electrolux, Zigbee2MQTT, Shelly, Solarman |
| Zariadenie | Jedna fyzická (alebo virtuálna) vec, ktorú integrácia našla | Práčka, pohybový senzor v kúpeľni |
| Entita | Jedna hodnota alebo ovládač zariadenia | `binary_sensor.kupelna_pohyb` |
| Stav a atribúty | Aktuálna hodnota entity a jej doplňujúce údaje | `on`, jas 80 % |
| Miestnosť (area) | Kde zariadenie je; podľa toho sa triedi všetko ostatné | Kúpeľňa, Obývačka |
| Automatizácia | Keď sa niečo stane, a ak to sedí, urob toto | pohyb po zotmení → svetlo |
| Scéna | Uložený stav viacerých entít naraz | Večer pri filme |
| Skript | Postupnosť krokov, ktorú spustíš jedným príkazom | Odchod z domu |
| Pomocník (helper) | Tvoja vlastná virtuálna entita | prepínač „Hostia doma“ |
| Aplikácie (doplnky) | Ďalšie programy bežiace vedľa HA na tom istom stroji | Mosquitto, Zigbee2MQTT |
| HACS | Komunitný obchod s neoficiálnymi integráciami a kartami | AI Energy, Igy Cards |
| Dashboard a karta | Obrazovka tvojho domu a jeden blok na nej | prehľad na mobile, karta termostatu |

### Entita je to najdôležitejšie

Každá entita má **identifikátor** v tvare `doména.názov`. Doména hovorí, čo to je: `light` je svetlo, `switch` vypínač, `sensor` meraná hodnota, `binary_sensor` niečo áno/nie (pohyb, otvorené okno), `climate` termostat. Vždy má aj **stav** – napríklad `on`, `21.5` alebo `unavailable`, keď zariadenie nekomunikuje.

Keď niečo nefunguje, prvé miesto, kam sa pozrieš, je **Nástroje pre vývojárov → Stavy**. Uvidíš tam každú entitu, jej stav aj atribúty.

### Automatizácia má tri časti

1. **Spúšťač** – kedy sa má niečo stať (pohyb, čas, zmena ceny elektriny).
2. **Podmienka** – či sa to má stať práve teraz (je tma, niekto je doma).
3. **Akcia** – čo sa stane (zapni svetlo, pošli notifikáciu).

Celé si to naklikáš v rozhraní, YAML písať nemusíš. Ale je dobré vedieť, ako to vyzerá vnútri – raz to budeš kopírovať z návodu:

```yaml automations.yaml
alias: "Kúpeľňa – svetlo pri pohybe"
triggers:
  - trigger: state
    entity_id: binary_sensor.kupelna_pohyb
    to: "on"
conditions:
  - condition: sun
    after: sunset
actions:
  - action: light.turn_on
    target:
      entity_id: light.kupelna_strop
```

### Scéna, skript, alebo automatizácia?

- **Scéna** je fotka stavu: „tieto svetlá na 30 %, žalúzie dole“. Nič nečaká, nič nerozhoduje.
- **Skript** je recept krok za krokom: „zhasni všetko, počkaj minútu, zamkni“. Spustíš ho ty, tlačidlo alebo automatizácia.
- **Automatizácia** sa spúšťa sama, keď nastane spúšťač.

## Aplikácie a HACS – ako rozšíriť Home Assistant

**Aplikácie** (predtým doplnky) sú samostatné programy, ktoré bežia vedľa Home Assistanta – napríklad MQTT broker Mosquitto alebo Zigbee2MQTT. Máš ich, ak používaš Home Assistant OS.

**HACS** je komunitný obchod. Nájdeš tam integrácie a karty, ktoré nie sú oficiálne – často presne tie, ktoré ti chýbajú. Aj moje [projekty](/projekty/) sa inštalujú cez HACS. Len pozor: čo nie je oficiálne, môže sa po aktualizácii HA pokaziť.

## Dashboardy a karty

**Dashboard** je obrazovka tvojho domu – na mobile, počítači alebo na tablete na stene. Skladá sa zo **zobrazení** (záložiek) a tie z **kariet**. Karta je jeden blok: termostat, graf, kamera, zoznam svetiel.

Na začiatok úplne stačí automatický dashboard, ktorý si HA vytvorí sám podľa miestností. Vlastný stav až keď vieš, čo na ňom naozaj chceš vidieť.

:::me Ako to mám ja
Mám doma okolo 3000 entít a 94 automatizácií. Najviac času mi nezabrala elektrika, ale **hľadanie správnej entity**. Preto dnes všetko pomenúvam rovnako: `doména.miestnosť_zariadenie_veličina`, napríklad `sensor.kupelna_dole_teplota`. Na entite je celý názov, na karte krátky. Začni s tým hneď na začiatku – ušetríš si víkend upratovania.
:::

## Najčastejšie chyby začiatočníkov

- **Automatizácie na zariadenie namiesto entity.** Spúšťač „zariadenie“ sa viaže na konkrétny kus hardvéru – keď senzor vymeníš, automatizácia prestane fungovať. Spúšťač na entitu stačí premenovať.
- **Nechané predvolené názvy** typu `sensor.0x00158d0001_temperature`. Za mesiac nebudeš vedieť, čo to je.
- **Dvadsať vecí z HACS v prvom týždni.** Začni bez nich a pridávaj, až keď niečo naozaj chýba.
- **Žiadna záloha** pred prvou veľkou aktualizáciou. Zapni si automatické zálohy a aspoň jednu drž mimo počítača s HA.
- **Všetko naraz.** Začni jednou miestnosťou a jednou automatizáciou, ktorá ti reálne pomáha.

## Čo ďalej

Teraz vieš, z čoho sa Home Assistant skladá. V ďalšej časti si vyberieme, **na čom ho rozbehnúť** – Raspberry Pi, mini PC, virtuálka v Proxmoxe alebo hotová krabička – a prečo mám ja HA ako virtuálku na Proxmoxe.
