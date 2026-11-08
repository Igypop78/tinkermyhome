---
id: house-tour
title: Prehliadka nášho domu – čo máme automatizované a čo naschvál nie
description: Miestnosť po miestnosti cez dom, kde žije štvorčlenná rodina so psom a viac ako 300 smart zariadení. Čo kde máme, čo má kto najradšej a čo sme nechali obyčajné.
section: home
level: 1
date: 2026-11-08
time: '23:30'
draft: true
slug: prehliadka-domu
tldr: V dome máme **311 zariadení v Home Assistante** – od podsvietených schodov cez kúrenie izba po izbe až po batériu, ktorá obchoduje s elektrinou. Väčšina beží sama. **Svetlá, vchodové dvere a ranné žalúzie** sme však nechali na ručné ovládanie. Prečo, je na konci.
---

Poďme sa prejsť po dome. Nie po showroome, ale po normálnom dome, kde žijeme štyria a pes Megie. Je tu viac ako 300 smart zariadení, ale podstatnejšie je, čo z toho reálne používame – a čo sme nechali obyčajné.

## Kto tu býva a čo má najradšej

| Kto | Obľúbená vec |
|---|---|
| **Igy** | Že vie, čo sa v dome deje a prečo – a že väčšina vecí beží sama |
| **Katka** | Kúrenie izba po izbe – v každej izbe je teplo, aké chce mať tá izba |
| **Martin** | Efektové svetlá – Nanoleaf na stene, podsvietené okno, stolná lampa. Spúšťa ich ovládačom, hlasom a ráno, keď vstane |
| **Jakub** | Obraz so smart podsvietením, ktoré sám navrhol a spravil so mnou |
| **Megie** | Kliknutie relé brány, keď niekto prichádza, a zvonček, ktorý zvoní cez reproduktor Sonos |

## Chodba – podsvietené schody

Hneď pri vchode sú schody podsvietené LED pásmi. Na chodbe je senzor pohybu, senzor na vchodových dverách a tlačidlo na otvorenie brány. Je tu aj klimatizácia, ktorá je prepojená s izbami hore aj dole a v lete chladí celý dom. Do Home Assistanta je pripojená cez malé ESP zariadenie.

## Kuchyňa – tablet na stene a digestor

V kuchyni visí na stene dotykový displej s vlastnou stránkou namiesto bežného dashboardu. Okolo neho je LED pás, ktorý farbou ukazuje stav domu – vidno ho aj z druhého konca miestnosti. Ráno cez neho jedným ťuknutím otvárame žalúzie.

Digestor sme dodatočne zosmartnili (Hob2Hood) – pomocou ESP32 a bezdrôtového ovládača. Ďalej tu sú:

- **senzory na chladničke a mrazničke** – teplota a otvorené dvierka,
- **senzor zatopenia a dymový hlásič**,
- **podlahové kúrenie** s vlastným termostatom,
- **rúra, umývačka a robotický vysávač** v Home Assistante.

## Obývačka

Svetlá, dvoje žalúzií a konvektor sú v Home Assistante a ovládať ich ide aj bezdrôtovým ovládačom IKEA. Zvuk ide cez Sonos – a cez neho zvoní aj zvonček.

## Komora – srdce systému

V komore je rack, odkiaľ to celé beží: mini PC s Proxmoxom, na ktorom je Home Assistant, kamery (Frigate), NAS a ďalšie kontajnery. Zálohy idú na druhé mini PC a o Zigbee a Z-Wave sa stará jeden multi-radio adaptér. Celý rack je zálohovaný batériou, takže ho krátky výpadok prúdu nevypne.

Ako som sa k tomu dopracoval, píšem v [mojej ceste smart domácnosťou](/moj-dom/moja-cesta-smart-domacnostou/) a na čom spustiť Home Assistant ty, v [inštalácii Home Assistanta](/zacni-tu/instalacia-home-assistanta/).

## Izby chalanov – svetlá a nálady

U Martina a Jakuba je najviac svetiel v celom dome. Martin má Nanoleaf na stene, LED okolo okna (WLED), stolnú lampu, glóbus a reproduktor Sonos. Efekty spúšťa ovládačom aj hlasom – a ráno, keď vstane.

Jakub má okrem lampy a hlavného svetla obraz, ktorého podsvietenie si sám navrhol a spolu sme ho postavili. Obaja majú žalúzie, senzory na oknách a vlastný panel na kúrenie.

## Kúrenie izba po izbe

Katkina obľúbená vec. V každej izbe visí malý panel Aqara W100 – ukazuje teplotu a dá sa na ňom nastaviť, koľko má byť v izbe stupňov. Ventil na radiátore spína relé a celú logiku drží Home Assistant. Plynový kotol sa zapne len vtedy, keď kúri aspoň jedna izba. Keď niekto otvorí okno, kúrenie v tej izbe sa vypne.

## Kúpeľne – voda pod kontrolou

V kúpeľniach sú senzory zatopenia, pohybu a teploty a vlhkosti. Dole je smart odvetranie, hore práčka a sušička AEG, ktoré sú tiež v Home Assistante. V kúpeľni hore je aj ESP modul pre kúrenie a bojler.

## Spálňa – len jeden záber

Spálňa je tabu. Jednu vec si z nej ale ukážeme: roletu a žalúzie, ktoré idú synchronizovane. To si zaslúži samostatný článok.

## Záhrada – polievanie, jazierko a ryby

Vonku sa automaticky polieva a v jazierku beží filtrácia aj krmenie rýb – všetko cez relé na ESP32. Smart sú aj lampáše a svetlá pri vchode a na terase, je tu senzor kvality vzduchu a zvonček pri vchode. Jedno z ESP zároveň slúži ako Bluetooth proxy a ďalšie sa cez Bluetooth rozpráva s Teslou.

## Prístrešok a dielňa – energia

Tu je všetko okolo fotovoltiky: menič Deye, batéria 34 kWh so SmartShuntom a BMS a nabíjačka auta SmartEVSE pre Teslu. Spotreba je meraná po jednotlivých skupinách ističov, takže presne vidím, kam elektrina ide. Batéria podľa spotových cien sama nakupuje a predáva – podrobne v článku [Batéria, ktorá obchoduje](/energia/bateria-obchoduje-na-spote/). Ako to práve vyzerá, vidíš na [úvodnej stránke](/) v karte „Ako funguje náš dom“.

## Čo naschvál nie je automatizované

- **Väčšina svetiel.** Naše potreby sa menia z večera na večer. Automatika u nás funguje maximálne pri západe slnka. Zatiaľ som nenašiel spôsob, ako svetlá automatizovať tak, aby to neobťažovalo. Preto ich zapíname vypínačom alebo ovládačom.
- **Vstup do domu.** Smart zámok si moju dôveru zatiaľ nezískal. Dvere odomykáme kľúčom.
- **Ranné žalúzie.** Kým sa otvárali na pevný čas, často nás zbytočne zobudili – nie vždy vstávame v rovnakom čase. Dnes ich ráno otvoríme jedným ťuknutím na displeji v kuchyni.

Všetko ostatné beží samo. Smart dom podľa mňa nie je o tom, koľko vecí je automatizovaných, ale o tom, či pomáhajú – presne podľa [6 zásad](/moj-dom/zasady-smart-domu/), ktorých sa držím.
