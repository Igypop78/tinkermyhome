---
id: start-avoid
title: Čím začať smart dom a čomu sa vyhnúť – 6 krokov a 8 chýb
description: Čím začať smart dom krok za krokom – od centrály a protokolu cez meranie spotreby až po prvé svetlá – a 8 chýb, ktoré ma za 13 rokov stáli najviac času a peňazí.
section: start
level: 1
step: 4
date: 2026-11-19
time: '20:00'
slug: cim-zacat-a-comu-sa-vyhnut
tldr: Začni **centrálou a jedným protokolom**, potom **meraním spotreby** a až potom svetlami cez **relé za vypínačom**. Od prvého dňa **zálohuj** a **pomenúvaj poriadne**. Vyhni sa zariadeniam len cez cloud, rušeniu vypínačov, automatizovaniu všetkého a lacným batériovým zariadeniam. A ak to prvýkrát nepôjde, nevzdávaj sa – ja som Home Assistant vzdal dvakrát.
---

Máš za sebou prvé tri časti: vieš, [čo je Home Assistant](/zacni-tu/home-assistant-pre-zaciatocnikov/), [na čom ho spustiť](/zacni-tu/instalacia-home-assistanta/) a [akým jazykom sa zariadenia rozprávajú](/zacni-tu/zigbee-wifi-zwave-matter/). Teraz príde otázka, ktorú dostávam najčastejšie: **čím začať smart dom?**

Odpoveď mám z vlastnej skúsenosti. Smart domácnosť mám od roku 2013 a za ten čas som vystriedal päť centrál a spravil skoro každú chybu, ktorá sa dá spraviť. Tu je poradie, ktoré by som dnes zvolil, a chyby, ktorým sa vyhni.

## Čím začať smart dom: 6 krokov

### 1. Ujasni si, či ho naozaj chceš

Smart home nie je pre každého – a to je v poriadku. Ak ti stačí pár jednoduchých automatizácií, kúp hotový systém a zmier sa s jeho obmedzeniami. Ak ťa to baví a chceš mať dom pod kontrolou, choď cestou Home Assistanta. Podrobne v článku [Potrebuješ vôbec smart home?](/zacni-tu/potrebujem-smart-home/)

### 2. Centrála na samostatnom zariadení

**Home Assistant OS** na zariadení, ktoré beží 24/7 – Home Assistant Green, mini PC alebo Raspberry Pi. Výkon nie je dôležitý, spotreba áno. Proxmox a virtuálne stroje nechaj na neskôr. → [Inštalácia Home Assistanta](/zacni-tu/instalacia-home-assistanta/)

### 3. Vyber si protokol hneď na začiatku

Zigbee, Z-Wave, WiFi alebo Matter? Rozhodni sa na začiatku – zmena neskôr znamená párovať všetko nanovo. Pre Zigbee alebo Z-Wave si rovno kúp adaptér. → [Zigbee, WiFi, Z-Wave alebo Matter](/zacni-tu/zigbee-wifi-zwave-matter/)

:::me Ako to mám ja
Zigbee aj Z-Wave mi obsluhuje jeden multi-radio adaptér **SLZB-MRW10U**. Shelly a ďalšie zariadenia idú cez WiFi alebo kábel. Matter cez Thread zatiaľ obchádzam.
:::

### 4. Prvý projekt: meranie spotreby

Keby som začínal odznova, prvé by bolo **centrálne meranie elektriny, vody a plynu**. Ukáže, kam energia ide, prezradí, čo práve beží (aj „hlúpe“ spotrebiče), postráži dom, keď nikto nie je doma, a nájde aj únik vody, ktorý inak nevidno. Na elektrinu odporúčam **Shelly 3EM-63W Gen3** – nasadí sa priamo na ističe. → [Začni meraním spotreby](/energia/zacni-meranim-spotreby/)

### 5. Svetlá: relé za vypínač, nie len smart žiarovka

Smart žiarovka prestane fungovať, keď ju niekto vypne vypínačom. Najlepšie z oboch svetov dá **smart relé za pôvodným vypínačom** – vypínač funguje ďalej, aj keď centrála vypadne. → [Smart žiarovka a vypínač](/zacni-tu/smart-ziarovka-a-vypinac/)

:::tip Ak práve prerábaš
Pýtaj si **hlbšie inštalačné krabice** a **nulový vodič pod každým vypínačom**. Stoja skoro rovnako ako plytké, ale neskoršia montáž smart relé je potom hračka. Ja som to v byte nemal a riešil som to „s trochou chcenia a sily“.
:::

### 6. Od prvého dňa záloha a poriadok v názvoch

Dve veci, ktoré je ľahké odložiť a ťažké dobehnúť:

- **Záloha mimo zariadenia** – na iný počítač, NAS alebo do cloudu. Centrála sa môže pokaziť tiež.
- **Názvy podľa jednej schémy** – napríklad `sensor.kupelna_dole_teplota` (`doména.miestnosť_zariadenie_veličina`). Keď zariadení pribudnú desiatky, poďakuješ si.

Potom už pridávaj **zariadenie po zariadení**. Pri každom sa opýtaj, či ho naozaj budeš používať.

## Čomu sa vyhnúť: 8 chýb

### 1. Zariadenia, ktoré fungujú len cez cloud

Keď vypadne internet alebo výrobca zruší službu, z „smart“ zariadenia ostane obyčajné. Uprednostni Zigbee, Z-Wave, Matter alebo lokálnu WiFi. Napríklad **Tuya** mi nikdy nesadla – aj keď sa dá ovládať lokálne, väčšina zariadení tlačí pripojenie cez cloud.

### 2. Zrušiť klasické vypínače

Ak sú svetlá len cez centrálu a tá vypadne, nezasvietiš si. Dom musí fungovať, aj keď smart home nefunguje – a ručné ovládanie ocení každý v rodine, kto smart home nenastavoval. U nás je „testom domácnosti“ Katka.

### 3. Automatizovať všetko

Z dvadsiatich zásuviek reálne používaš päť. Aj ja som to prehnal – mal som skoro **3000 entít** a hľadať v nich bolo trápenie. Po upratovaní ich mám necelých 2000 a nič mi nechýba. Automatizuj to, čo reálne používaš.

### 4. Odkladať zálohy

Pri pokusoch som viackrát spravil chybu a záloha chýbala alebo bola stará. Prišiel som o dlhodobé štatistiky spotreby a raz o **celú databázu Home Assistanta**. Stavať to odznova je prechádzka peklom.

### 5. Náhodné názvy

Premenovať takmer 3000 entít mi trvalo **dva dni**. Keby som mal schému od začiatku, nemusel by som.

### 6. Lacné batériové zariadenia a hlavice

Batériové zariadenia sú najväčšia lotéria. Batériové Shelly mi nesadli a batériové zariadenia IKEA občas vypadávajú a žerú batérie. Pri hlaviciach na radiátory skončili v koši **Aqara, Tuya aj Popp/Danfoss**, kým som našiel Tado X. Ktoré značky mi vydržali, je v článku [Značky smart zariadení](/recenzie/znacky-smart-zariadeni/).

### 7. Uzavretá centrála a spotrebiče bez integrácie

Roky na uzavretých centrálach (Fibaro, Homey, Hubitat) znamenali niekoľkokrát **párovať všetko nanovo**. To isté platí pre spotrebiče: pred kúpou práčky či umývačky si over, či ide do Home Assistanta a či lokálne. → [Smart spotrebiče](/zacni-tu/smart-spotrebice/)

### 8. Vzdať to po prvom pokuse

Home Assistant som **dvakrát vzdal**. Nechápal som logiku entít a zariadení a Raspberry Pi skončilo na rok v šuplíku. Keď som sa k nemu vrátil, začal som odznova, krok po kroku, s 30–40 zariadeniami – a otvorili sa možnosti, o ktorých som predtým ani nesníval. Ak ťa to teraz trápi, vráť sa k článku [Home Assistant pre začiatočníkov](/zacni-tu/home-assistant-pre-zaciatocnikov/).

## Zhrnutie

| Urob | Vyhni sa |
|---|---|
| Centrála na samostatnom zariadení | Zariadeniam len cez cloud |
| Jeden protokol od začiatku | Rušeniu klasických vypínačov |
| Meranie spotreby ako prvý projekt | Automatizovaniu všetkého |
| Relé za vypínač | Lacným batériovým zariadeniam |
| Záloha a názvy od prvého dňa | Vzdať to po prvom pokuse |

Všetky pravidlá, ktorých sa držím pri každom novom zariadení, sú v článku [6 zásad, podľa ktorých staviam smart dom](/moj-dom/zasady-smart-domu/). A ak chceš vidieť, kam sa to dá dotiahnuť, prečítaj si [moju cestu smart domácnosťou](/moj-dom/moja-cesta-smart-domacnostou/).
