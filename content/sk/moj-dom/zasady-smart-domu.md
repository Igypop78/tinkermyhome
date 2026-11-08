---
id: my-rules
title: 6 zásad, podľa ktorých staviam smart dom
description: Čo som sa naučil za 13 rokov smart domácnosti – šesť pravidiel, vďaka ktorým smart dom pomáha a nekomplikuje život celej rodine.
section: home
level: 1
date: 2026-11-08
time: '19:30'
slug: zasady-smart-domu
tldr: Dom musí fungovať aj bez smart home, manuálne ovládanie zostáva, **menej je viac**, zálohuješ mimo zariadenie, vyhýbaš sa cloudu a od začiatku máš **poriadok v názvoch**. Ak sa týchto šesť pravidiel držíš, ušetríš si väčšinu chýb, ktoré som spravil ja.
---

Nie je nič horšie ako automatizácia, ktorá skomplikuje život, alebo smart zariadenie, ktoré v domácnosti nikto nevie používať. Také veci skončia sklamaním a vyhodenými peniazmi. Za 13 rokov – od prvého relé v byte až po dom s fotovoltikou a Home Assistantom – som si spísal šesť pravidiel. Držím sa ich pri každom novom zariadení.

Ak ťa zaujíma, ako som sa k nim dopracoval, prečítaj si [moju cestu smart domácnosťou](/moj-dom/moja-cesta-smart-domacnostou/).

## 1. Dom musí fungovať, aj keď smart home nefunguje

Každá vec sa raz pokazí. Pri smart domácnosti je možných porúch ešte viac: okrem samotného svetla či kúrenia môže vypadnúť aj riadiaca jednotka, sieť alebo internet. Predstav si, že máš všetky svetlá ovládané len cez centrálu a klasické vypínače si zrušil. Keď centrála vypadne, jednoducho si nezasvietiš.

Preto vyberaj riešenia, pri ktorých koncové zariadenie ovládaš aj vtedy, keď je centrála nedostupná. Ideálne sú moduly, ktoré sa montujú za pôvodný vypínač (Shelly, Fibaro, Aqara, Sonoff a pod.). Vypínač funguje ďalej a smart ovládanie je len niečo navyše.

:::me Ako to mám ja
Pri úpravách domu som chcel hlbšie inštalačné krabice, aby sa relé zmestilo za pôvodný vypínač. Servery, na ktorých beží Home Assistant, sú navyše zálohované batériou, takže krátky výpadok prúdu ich nevypne.
:::

**Jednou vetou:** ovládanie dôležitých zariadení musí fungovať aj bez smart home.

## 2. Zachovaj manuálne ovládanie, kde sa len dá

Hovorí sa, že smart home má robiť všetko za teba. Táto doba je ešte ďaleko. Aj pri najlepšie nastavených automatizáciách príde chvíľa, keď chceš niečo inak – zhasnúť tam, kde sa bežne svieti, alebo naopak.

Je tu aj druhý dôvod: ľudia v domácnosti. Kto nie je technický typ alebo je zvyknutý na klasický vypínač, nesmie byť ukrátený. Inak sa z neho rýchlo stane odporca celého smart home.

:::me Ako to mám ja
U nás je „testom domácnosti“ Katka. Ak niečo nefunguje aj pre ňu, nie je to hotové.
:::

**Jednou vetou:** automatizácia má pomáhať, nie brať možnosť urobiť to po svojom.

## 3. Menej je viac

Prvé nadšenie z automatizácie všetkého často vystrieda sklamanie. Veľa zariadení v domácnosti použiješ len občas a nemá zmysel ich meniť za smart. Načo monitorovať a ovládať každú zásuvku, keď z dvadsiatich reálne používaš päť?

Neznamená to, že prídeš o prehľad. Spotrebu celého domu vieš sledovať inak a lacnejšie ako cez desiatky smart zásuviek – o tom bude samostatný článok.

:::me Ako to mám ja
Aj ja som to prehnal. Raz som mal v Home Assistantovi takmer 3000 entít a hľadať v nich bolo trápenie. Po upratovaní ich mám necelých 2000 – a nič mi nechýba.
:::

**Jednou vetou:** automatizuj to, čo reálne používaš, nie všetko, čo sa dá.

## 4. Zálohuj a mysli na najhoršie

Znie to samozrejme, ale aj mne sa pár krát stalo, že som pri pokusoch spravil chybu a záloha chýbala alebo bola stará. Časom bude mať tvoj smart home stovky zariadení, tisíce entít, históriu a automatizácie, do ktorých si vložil hodiny až dni práce. Stavať to celé odznova je prechádzka peklom.

Pravidelná záloha celého systému je preto základ. A záloha musí byť **mimo** zariadenia – pokaziť sa môže aj samotná riadiaca jednotka. Ulož ju na iný počítač, NAS alebo do cloudu.

:::me Ako to mám ja
Viackrát som prišiel o dlhodobé štatistiky spotreby a raz o celú databázu Home Assistanta. Dnes zálohujem na samostatné mini PC s Proxmox Backup Serverom a históriu energie mi drží vlastný [energetický archív](https://github.com/Igypop78/energy-archiv), ktorý ju vie do HA obnoviť.
:::

**Jednou vetou:** zálohuj pravidelne a vždy na iné zariadenie.

## 5. Vyhni sa cloudu, kde sa dá

Cloud je dobrý sluha, ale zlý pán. Ak sú tvoje zariadenia pripojené cez cloud (cez internet a server výrobcu, nie cez domácu sieť), výpadok internetu ťa pripraví o ich ovládanie. Výrobca navyše môže bezplatný cloud spoplatniť alebo úplne zrušiť – napríklad keď skrachuje. Doma ti potom zostanú „smart“ zariadenia, ktoré už nie sú smart.

Pri výbere preto uprednostni zariadenia, ktoré sa s centrálou spoja priamo: Zigbee, Z-Wave, Matter alebo WiFi. Pri WiFi pozor – niektoré zariadenia ju používajú lokálne, iné len na spojenie so serverom výrobcu. Tým druhým sa vyhni.

:::me Ako to mám ja
Aj Teslu mám v Home Assistantovi lokálne – cez malé ESP zariadenie, ktoré s autom komunikuje cez Bluetooth. Na riadenie nabíjania nepotrebujem cloud výrobcu.
:::

**Jednou vetou:** uprednostni zariadenia, ktoré fungujú bez internetu.

## 6. Buď štruktúrovaný

Keď domácnosť narastie na desiatky až stovky zariadení, náhodné názvy sa ti vypomstia. Prestaneš tušiť, čo ktorá entita robí, a každá automatizácia aj hľadanie chyby trvá dvakrát dlhšie.

Príklad: termostat, chladnička, robotický vysávač a svetlo môžu mať každé teplotný senzor. Buď skončíš so štyrmi senzormi s nič nehovoriacimi názvami, alebo s takými, kde hneď vidíš, o čo ide. To isté platí pre automatizácie – pri názve „Svetlo“ po pár týždňoch nebudeš vedieť, čo robí. „Automatické svetlo v obývačke“ už áno.

Dobré názvy pomôžu aj pri hlasovom ovládaní a AI. Ak zariadenie nemá miestnosť a zrozumiteľný názov, príkaz „zapni všetky svetlá v spálni“ ho nenájde.

:::me Ako to mám ja
Všetko mám po slovensky podľa jednej schémy: `doména.miestnosť_zariadenie_veličina`, napríklad `sensor.kupelna_dole_teplota`. Entita má celý názov, na karte v dashboarde krátky. Premenovať takmer 3000 entít naraz mi trvalo dva dni – radšej to sprav hneď na začiatku.
:::

**Jednou vetou:** názvy zariadení, miestností a automatizácií premysli skôr, než ich bude veľa.

## Ak si práve začínaš

Nemusíš všetko vyriešiť naraz. Začni v malom, drž sa týchto šiestich pravidiel a pridávaj zariadenie po zariadení. Ak ešte nevieš, čo je entita alebo integrácia, pokračuj článkom [Home Assistant pre začiatočníkov](/zacni-tu/home-assistant-pre-zaciatocnikov/).
