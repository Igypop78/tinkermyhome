---
id: my-story
cover: /img/clanky/titulky/moja-cesta.jpg
title: Od relé za vypínačom po dom, ktorý obchoduje s elektrinou
description: 13 rokov smart domácnosti – Fibaro, Homey, Hubitat a Home Assistant. Čo fungovalo, čo nie a čo by som dnes urobil inak.
section: home
level: 1
date: 2026-11-08
time: '19:20'
slug: moja-cesta-smart-domacnostou
tldr: Začal som v roku 2013 jedným **Fibaro relé za vypínačom** v byte. Cez tri ďalšie centrály (HC2, Homey, Hubitat) som sa dostal k **Home Assistantovi** – na druhý pokus, lebo prvé dva som vzdal. Dnes riadi vyše **300 zariadení** v dome aj v byte, fotovoltiku s batériou aj nabíjanie auta. Tu je celá cesta aj s chybami.
---

Smart dom som si nikdy nemohol postaviť „od nuly“. Byt aj dom, v ktorých sme bývali, už stáli, keď sme sa do nich sťahovali. Prerábať elektroinštaláciu alebo investovať tisíce eur hneď pri sťahovaní neprichádzalo do úvahy. Tento článok je teda príbeh smart domácnosti, ktorá rástla postupne – zariadenie po zariadení. Presne tak, ako to bude asi aj u teba.

## Celá cesta v skratke

| Rok | Čo sa zmenilo |
|---|---|
| 2013 | Byt, prvé Fibaro relé a centrála Home Center Lite |
| 2016 | Sťahujeme sa do domu, stále na Fibare (neskôr Home Center 2) |
| 2020 | Homey |
| 2021–2022 | Hubitat C7 |
| 2022 | Home Assistant – na druhý pokus a natrvalo |
| 2024 | Fotovoltika s batériou |
| 2026 | Predaj elektriny za spotové ceny |

## Začiatky: jedno relé za vypínačom

Technológiám sa venujem od roku 2013. Smart domácnosti som vtedy bral ako doménu drahých víl, na ktoré treba myslieť už pri stavbe. Ovládanie cez diaľkové ovládače som nemal rád – vždy som hľadal to správne.

Zlomom bolo **smart relé od Fibara**. Malá krabička, ktorá sa schová za vypínač a nezmení spôsob, akým svetlo ovládaš. Navyše meria spotrebu, vie stmievať a ovládať sa z mobilu. K nemu som pridal centrálu **Fibaro Home Center Lite** – na tú dobu prvé riešenie, ktoré spájalo dizajn, jednoduchosť a funkčnosť.

Na základné automatizácie v trojizbovom byte to stačilo. Narazil som však aj na prvé prekážky: pod vypínačom chýbal nulový vodič a inštalačné krabice boli príliš plytké. S trochou chcenia a sily sa to dalo vyriešiť.

:::me Čo som si z bytu odniesol
Keď sme sa sťahovali do domu, pri úpravách som rovno chcel **hlbšie inštalačné krabice** a nulový vodič pod vypínačmi. Stoja skoro rovnako ako plytké, ale neskoršia montáž smart relé je potom hračka.
:::

## Hľadanie tej správnej centrály

S pribúdajúcimi zariadeniami prestala malá centrála stačiť. Postupne som vystriedal tri ďalšie:

| Centrála | Čo ma potešilo | Prečo som šiel ďalej |
|---|---|---|
| Fibaro Home Center Lite | Jednoduchá, pekná, funguje | Len Z-Wave (čiastočne WiFi), nové zariadenia len keď ich pridá výrobca, UI sa nedá prispôsobiť |
| Fibaro Home Center 2 | Väčšia kapacita | Rovnaké obmedzenia, dlho som pri nej nevydržal |
| Homey | Podporovala skoro všetko, otvorila mi svet lacných senzorov (Xiaomi a pod.) za zlomok ceny | Uzavretý systém, vtedy bez lokálneho ovládania |
| Hubitat C7 | Univerzálna, bez cloudu | Horšie používateľské prostredie, časom odpájajúce sa zariadenia a pomalosť |

Homey bol obrovský krok vpred. Zrazu skoro všetko fungovalo so všetkým a počet zariadení utešene rástol bez veľkých investícií. Lacné Zigbee senzory ma prekvapili výdržou aj spoľahlivosťou.

## Home Assistant: dvakrát som to vzdal

Popri tom som skúšal **Home Assistant**. Lákala ma otvorenosť a obrovská komunita. Zároveň som mu neveril – ako môže byť riešenie zadarmo lepšie ako špecializované centrály, za ktoré som zaplatil?

Prvé pokusy dopadli zle. Nechápal som logiku entít a zariadení a rozbehať HA vtedy nebolo nič jednoduché. Dvakrát ma to odradilo. Raspberry Pi skončilo v šuplíku a asi rok som HA neriešil.

Zlom prišiel, keď Hubitat začal mať problémy. Povedal som si, že smart domácnosť postavím odznova – tentoraz v Home Assistantovi. Pekne krok po kroku, zariadenie po zariadení. Mal som ich vtedy zhruba 30–40.

Stačilo pochopiť, ako HA funguje, a otvorili sa možnosti, o ktorých som predtým ani nesníval. Ak si práve tam, kde som bol ja, začni článkom [Home Assistant pre začiatočníkov](/zacni-tu/home-assistant-pre-zaciatocnikov/) – presne ten by som vtedy potreboval.

## Kde sme dnes

Home Assistant dnes drží pokope celý dom, v ktorom žijeme štyria a pes, aj náš byt.

| Čo | Ako to máme |
|---|---|
| Zariadenia | 311 zariadení, necelých 2000 entít, 94 automatizácií, 12 miestností v dome |
| Fotovoltika | 12 kWp, menič Deye 10 kW |
| Batéria | LiFePO4 ~34 kWh, sama obchoduje so spotovými cenami |
| Auto | Tesla Model Y, nabíja sa, keď je elektrina najlacnejšia |
| Kúrenie | každá izba vlastný termostat, kotol kúri, len keď treba |
| Kamery | Frigate s rozpoznávaním osôb, áut a zvierat |
| Server | HP mini PC s Proxmoxom: Home Assistant, Frigate, NAS a ďalšie kontajnery a virtuálne stroje |
| Zálohy | druhé mini PC s Proxmox Backup Server |
| Rádiá | jeden multi-radio adaptér SLZB-MRW10U |
| Napájanie | servery sú zálohované batériou |

Čo z toho funguje dobre, čo nie a koľko to stojí, rozoberám v ďalších článkoch a videách.

## Čo by som dnes urobil inak

- **Skôr by som dal Home Assistantovi poriadnu šancu.** Roky na uzavretých centrálach znamenali niekoľkokrát párovať všetko nanovo.
- **Od začiatku by som zálohoval mimo zariadenie.** Pár krát som pri pokusoch spravil chybu a záloha chýbala alebo bola stará. Raz som prišiel o celú databázu HA.
- **Hneď by som premyslel pomenovanie.** Keď som mal skoro 3000 entít, bolo hľadanie tej správnej najväčšie trápenie. Upratovanie mi trvalo dva dni a dnes ich mám necelých 2000.
- **Menej cloudu.** Zariadenie, ktoré funguje len cez server výrobcu, prestane byť smart, keď vypadne internet alebo výrobca zruší službu.

## Moje zásady v skratke

Z tých rokov mi vzniklo šesť pravidiel, ktorých sa držím pri každom novom zariadení:

1. **Dom musí fungovať, aj keď smart home nefunguje.** Svetlo musí ísť zapnúť vypínačom.
2. **Zachovaj manuálne ovládanie, kde sa len dá.** Ocení to každý v rodine, kto smart home nenastavoval.
3. **Menej je viac.** Z 20 zásuviek reálne používaš päť – netreba, aby všetky boli smart.
4. **Zálohuj a mysli na najhoršie.** Záloha patrí na iné zariadenie.
5. **Vyhni sa cloudu, kde sa dá.** Zigbee, Z-Wave, Matter alebo lokálna WiFi.
6. **Buď štruktúrovaný.** Názvy zariadení, entít a automatizácií premysli na začiatku.

Podrobne aj s príkladmi z nášho domu ich rozoberám v článku [6 zásad, podľa ktorých staviam smart dom](/moj-dom/zasady-smart-domu/).
