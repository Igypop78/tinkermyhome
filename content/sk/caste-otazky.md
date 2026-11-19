---
type: page
title: Časté otázky
slug: caste-otazky
pair: faq
description: Krátke odpovede na otázky, ktoré dostávam najčastejšie – fotovoltika, batéria, elektromobil a Home Assistant. Z nášho domu, s odkazom na podrobnosti.
---

Na tieto otázky odpovedám najčastejšie. Odpovede sú krátke a z nášho domu. Podrobnosti nájdeš vždy v článku, na ktorý odkazujem.

:::faq Kde začať
? Čím začať?
Ja by som dnes začal **meraním elektriny, vody a plynu**. Ukáže, kam energia ide, prezradí, čo práve beží, postráži dom, keď nikto nie je doma, a nájde aj únik vody. → [Začni meraním spotreby](/energia/zacni-meranim-spotreby/) · celý postup v 6 krokoch: [Čím začať a čomu sa vyhnúť](/zacni-tu/cim-zacat-a-comu-sa-vyhnut/)
? Na čom je najlepšie bežať Home Assistant?
Začiatočníkovi odporúčam **Home Assistant OS** na samostatnom zariadení, ktoré beží stále – Home Assistant Green, mini PC alebo Raspberry Pi. Výkon nie je dôležitý, spotreba áno. Mne beží ako virtuálny stroj na HP mini PC s Proxmoxom, ale to nechaj na neskôr. → [Inštalácia Home Assistanta](/zacni-tu/instalacia-home-assistanta/)
? Ktorú značku zariadení odporúčaš?
Neviažem sa na jednu značku – vyberám podľa typu zariadenia. **Shelly** na moduly za vypínače, **Aqara** na batériové senzory, **Fibaro** na Z-Wave, **ESP32** na kutilské projekty, **Tado X** na hlavice a **UniFi** na WiFi. **IKEA** má najlepšiu cenu, ale s výhradami a **Tuya** mi nesadla. → [Značky smart zariadení](/recenzie/znacky-smart-zariadeni/)
:::

:::faq Fotovoltika a batéria
? Akú FVE máš?
Na streche a prístrešku mám **28 panelov, spolu ~13,9 kWp**, menič **Deye 10 kW** a vlastnú batériu **LiFePO4 ~34 kWh**. Riadim ju z Home Assistanta. → [Moja fotovoltika](/energia/moja-fve/)
? Koľko ťa stála FVE a batéria?
Celá FVE s batériou okolo **8 000 €**, z toho batéria asi **3 500 €**. Všetko som montoval sám a skontroloval revízny technik – s montážnou firmou to bude viac. → [Moja fotovoltika](/energia/moja-fve/)
? Naozaj sa dá nakupovať za fixnú cenu a predávať na spote?
Áno, tak to mám od septembra. **Nakupujem od ZSE za pevnú dvojtarifu** (DD3: nízka tarifa ~0,12 €/kWh, vysoká ~0,21 €/kWh vrátane distribúcie) a **predávam cez V-elektru za spotovú cenu**. Potrebuješ zmluvu na predaj za spot a dvojtarifu – bez lacnej nízkej tarify nemáš lacno za čo nabíjať. Over si aj zmluvu o pripojení zdroja a podmienky sadzby. → [Batéria, ktorá obchoduje](/energia/bateria-obchoduje-na-spote/)
? Oplatí sa predávať elektrinu za spotové ceny?
U mňa áno. Batériu nabijem v nízkej tarife a predám ju v drahých 15-minútových úsekoch – ráno aj večer. Za september a október mi elektrina zarobila **352 €**, v júli a auguste s virtuálnou batériou len **95 €**. → [Batéria, ktorá obchoduje](/energia/bateria-obchoduje-na-spote/)
? Nezničím si batériu obchodovaním a častým nabíjaním?
Batéria sa opotrebuje viac, preto to **počítam ako náklad – 45 €/MWh**, ktoré musí každý predaj zaplatiť. Pod minimálnou cenou sa nepredáva vôbec. Moja batéria má garantovaných **4 000 cyklov** a k 1. 11. 2026 mala za sebou ~491, teda asi 12 %. V októbri ňou prešlo ~1,4 MWh, čo je asi 64 € opotrebenia – a aj tak mi október zarobil viac ako júl a august spolu. → [Batéria, ktorá obchoduje](/energia/bateria-obchoduje-na-spote/)
? Oplatí sa olovená batéria?
Podľa mňa nie. Olovo by si nemal vybíjať pod ~50 %, takže reálne využiješ len polovicu kapacity. Ja som ho po pol roku vyhodil. LiFePO4 zvládne 80–90 % kapacity a tisíce cyklov. → [Moja FVE cesta](/energia/moja-fve-cesta/)
? Je lepšie začať v malom, alebo to spraviť celé naraz?
Ak môžeš, **raz a poriadne** – kompromisné riešenia ma stáli najviac. Choď na maximum, čo strecha a distribučka dovolia, spotreba príde. Ale začať v malom je stále lepšie ako nezačať vôbec. → [Moja FVE cesta](/energia/moja-fve-cesta/)
? Čo je MRK?
Maximálna rezervovaná kapacita – koľko výkonu smieš posielať do siete. Určí ti ju distribučka pri pripojení zdroja. Ako súkromná osoba mám **10 kW**. → [Moja FVE cesta](/energia/moja-fve-cesta/)
? Prečo menič Deye ukazuje nepresné SOC batérie?
BMS po týždňoch bez nabitia na 100 % ukazujú stav nabitia, ktorý nesedí s realitou. Presne meria až Victron SmartShunt – ten som do Deye dostal cez ESP32 za 24 €. Zatiaľ je to však riziková verzia, pracujem na lepšej. → [Presné SOC v meniči Deye](/energia/soc-zo-smartshunt-do-deye/)
:::

:::faq Elektromobil
? Koľko míňa elektromobil?
Moja Tesla Model Y RWD má od kúpy dlhodobú spotrebu **16,9 kWh/100 km** – leto aj zima, mesto aj diaľnica. → [Život s elektromobilom](/moj-dom/zivot-s-elektromobilom/)
? O koľko klesne dojazd v zime?
Zhruba o tretinu. Ak v lete dáš 300 km po diaľnici, v zime to bude niečo nad 200 km. → [Život s elektromobilom](/moj-dom/zivot-s-elektromobilom/)
? Je zadný pohon v zime problém?
U mňa ani raz. Bál som sa toho najviac a zbytočne. → [Život s elektromobilom](/moj-dom/zivot-s-elektromobilom/)
? Dá sa auto nabíjať z fotovoltiky automaticky?
Áno. Mám wallbox SmartEVSE a v režime AI si moja integrácia AI Energy vyberie najlacnejší čas podľa spotových cien. → [AI Energy](/projekty/ai-energy/)
:::

:::faq Home Assistant a smart dom
? Zigbee, WiFi, Z-Wave alebo Matter?
WiFi máš zadarmo, ale pri desiatkach zariadení potrebuješ dobrý router. Zigbee a Z-Wave sú stavané pre smart home a potrebujú adaptér. Matter je ešte mladý – ja sa mu zatiaľ vyhýbam. Rozhodni sa na začiatku. → [Zigbee, WiFi, Z-Wave alebo Matter](/zacni-tu/zigbee-wifi-zwave-matter/)
? Prečo smart žiarovka nefunguje, keď ju vypnem vypínačom?
Potrebuje prúd stále. Najlepšie je nechať ju pod prúdom a z vypínača spraviť len tlačidlo – alebo použiť smart relé s odpojeným vstupom. → [Smart žiarovka a vypínač](/zacni-tu/smart-ziarovka-a-vypinac/)
? Čo je ESP32 a potrebujem vedieť programovať?
Malá doska s WiFi a Bluetooth za pár eur. S ESPHome ju nahráš bez programovania a v Home Assistante sa objaví sama. → [ESP32 – moje projekty](/diy/esp32-moje-projekty/)
? Musí smart dom fungovať aj bez internetu?
Podľa mňa áno – dom musí fungovať aj bez smart home, ručné ovládanie zostáva a cloudu sa vyhýbam. → [6 zásad smart domu](/moj-dom/zasady-smart-domu/)
:::

:::faq Moje projekty
? Je AI Energy zadarmo a funguje s mojím meničom?
Áno, je to open source (licencia MIT) a inštaluje sa cez HACS. Funguje s akýmkoľvek meničom a nastavíš ju v sprievodcovi bez YAML. → [AI Energy](/projekty/ai-energy/)
? Používa Pattern Pilot cloud alebo AI?
Nie. Beží len lokálne, sám nič nespustí a automatizácie len navrhuje – s dôkazom z tvojej histórie. Je zatiaľ vo vývoji. → [Pattern Pilot](/projekty/pattern-pilot/)
:::

Nenašiel si odpoveď? Napíš mi komentár pod [videom na YouTube](https://www.youtube.com/@TinkerMyHome) – najčastejšie otázky sem doplním.
