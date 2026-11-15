---
id: ai-energy
cover: /img/clanky/titulky/ai-energy.jpg
title: AI Energy – batéria, ktorá vie, kedy predať, a povie prečo
description: Moja HACS integrácia AI Energy každých 15 minút podľa spotových cien OKTE a tarify rozhodne, kedy batériu nabiť lacno zo siete, kedy predávať a kedy nabíjať auto. A pri každom kroku napíše, čo robí a prečo.
section: projects
level: 3
date: 2026-11-15
time: '19:00'
slug: ai-energy
tldr: '**AI Energy** je moja integrácia pre Home Assistant. Podľa spotových cien OKTE a tarify distribúcie každých 15 minút rozhodne, kedy domácu batériu **nabiť lacno zo siete**, kedy z nej **predávať** a kedy **nabíjať auto**. Pri každom rozhodnutí napíše **čo robí a prečo**. Funguje s akýmkoľvek meničom, nastavíš ju v sprievodcovi bez YAML. Aktuálne verzia 0.9.5, open source pod licenciou MIT.'
---

Nemám rád, keď neviem, čo a prečo sa deje v mojom dome. Batéria, ktorá sama nakupuje a predáva elektrinu, je presne tá vec, pri ktorej to chcem vedieť najviac. Ide predsa o peniaze.

Preto vznikla **AI Energy**. Každé jej rozhodnutie má textový dôvod, napríklad:

> *Predaj 331 € ≥ hranica 328 € (ráno do 13:45, SOC 64 % / min 13 %)*

V tomto článku ukážem, prečo integrácia vznikla, ako plánuje deň, čo ma pri vývoji prekvapilo a ako si ju nainštaluješ.

:::info Čísla a celý príbeh predaja na spote
Koľko mi to zarobilo, ako prepínam menič Deye a video nájdeš v článku [Batéria, ktorá obchoduje](/energia/bateria-obchoduje-na-spote/). Tento článok je o samotnej integrácii.
:::

## Ako to začalo

Doma mám FVE s batériou približne 34 kWh, menič Deye pripojený do Home Assistanta cez integráciu Solarman, wallbox SmartEVSE (11 kW) a elektromobil. Elektrinu zo siete kupujem od ZSE na sadzbe **DD3** pre elektromobily:

| | Kedy | Cena |
|---|---|---|
| **Nákup – nízka tarifa (NT)** | 23:45–05:45 a 13:45–15:45 | ~0,12 €/kWh |
| **Nákup – vysoká tarifa (VT)** | inak | ~0,21 €/kWh |
| **Predaj** | každých 15 minút iná cena | spot OKTE mínus ~0,015 €/kWh |

Spot je večer bežne 0,30–0,60 €/kWh, v noci okolo 0,20. Nápad je teda jednoduchý: **nabiť batériu v NT lacno a predať v najdrahších 15-minútových úsekoch dňa.**

Na papieri jednoduché. V praxi sa každých 15 minút rozhoduje medzi kapacitou batérie, výkonom meniča, slnkom, spotrebou domu, autom a hlavným ističom.

Najprv som všetko poskladal priamo v Home Assistante – automatizácie, Jinja šablóny, plán ako šablónový senzor. Fungovalo to, ale nastaviť by to vedel len ja. Tak som to celé prepísal do Pythonu ako integráciu pre HACS, aby si ju vedel nastaviť aj niekto iný bez YAML. Vyvíjal som ju spolu s AI (Claude) približne dva týždne – od prvých automatizácií po verziu 0.9.5.

## Čo AI Energy robí

- **Číta spotové ceny** z integrácie OKTE (alebo Nord Pool), dnes aj zajtra po 15 minútach. Má vlastnú zálohu cien, ktorá prežije reštart Home Assistanta aj výpadok portálu OKTE.
- **Plánuje batériu** na dnes a zajtra po 15 minútach.
- **Odporučí režim** a napíše dôvod – a ak jej to dovolíš, režim aj prepne.
- **Nabíja auto** v NT, z prebytkov FVE alebo pri lacnom spote.
- **Ukáže všetko na kartách**, ktoré sa inštalujú spolu s integráciou.

Takto vyzerá karta **Cena elektriny** s plánom na zajtra:

![Karta Igy Price Action Card – ceny na zajtra a plán batérie](/img/clanky/ai-energy-cena-elektriny-zajtra.png)

*Zajtra je pokojný deň: spot len 163 až 309 €/MWh, predajná hranica 260. Pod grafom je farebný pás akcií a pod ním plán ako časová os – o polnoci nabíjanie zo siete z 34 na 100 % za 120 €/MWh, od 2:30 ide dom zo siete a batéria čaká na drahšie úseky.*

## Ako plánuje deň

Deň sa delí na **okná medzi nízkymi tarifami**: ranné (po nočnej NT do poobednej) a večerné (po poobednej NT do nočnej). V každom okne integrácia:

1. **Spočíta, koľko energie bude mať batéria** – z nabíjania v NT, zo zostatku z predchádzajúceho okna aj zo slnka podľa predpovede Solcast.
2. **Predá v najdrahších úsekoch**, na ktoré táto energia stačí. Cena najlacnejšieho z nich je **predajná hranica**.
3. **V NT nabije len toľko, koľko treba** – na predaje, a ak je to lacnejšie ako VT, aj na spotrebu domu do ďalšej NT.

Výsledkom je plán po 15 minútach, kde má každý úsek jednu akciu:

| Akcia | Čo sa deje |
|---|---|
| 💰 Predaj z batérie | batéria predáva do siete |
| 🌤️ Predaj len z FVE | predáva sa len to, čo práve vyrába slnko |
| 🔋 Nabíjanie zo siete | lacné nabíjanie v NT |
| ☀️ FVE nabíja batériu | slnko dobíja na neskorší predaj |
| Prebytok do siete | batéria je plná, prebytok ide von |
| ⏸️ Dom zo siete | batéria stojí a čaká na drahšie úseky |
| 🏠 Dom z batérie | bežná prevádzka |

Z plánu vychádza **odporúčaný režim** (`sensor.ai_energy_odporucany_rezim`) a jedna veta, prečo práve on (`sensor.ai_energy_dovod`).

## Mozog v integrácii, ruky v automatizácii

Najväčší problém s riadením batérií je, že každý menič sa ovláda inak. Nechcel som písať podporu pre každý menič zvlášť.

AI Energy preto **zapisuje režim do výberu** (`input_select`), ktorý ovláda tvoja vlastná automatizácia meniča. V sprievodcovi každému režimu AI Energy priradíš možnosť z tohto výberu – napríklad *Predaj z batérie → Export from Battery*, *Nabíjanie zo siete → Charge from Grid*. Integrácia rozhoduje **čo**, automatizácia vie **ako**. Vďaka tomu funguje s akýmkoľvek meničom.

- **Batéria – riadenie.** Kým je prepínač vypnutý, integrácia len odporúča a nič neprepína. Bezpečný štart.
- **Ručný režim na čas.** 1 h, 2 h, 4 h, do ďalšej NT alebo natrvalo – potom sa sám vráti na Auto.
- **Stráženie prúdu.** Voliteľne hlída nabíjací prúd batérie zo siete: spoločný kábel s wallboxom (batéria má prednosť) a hlavný istič.

:::me Ako to mám ja
Moja automatizácia pre Deye aj s tabuľkou nastavení pre každý režim je v článku [Batéria, ktorá obchoduje](/energia/bateria-obchoduje-na-spote/#ako-home-assistant-prepina-deye). Najviac mi pomohlo zapisovať do meniča **len rozdiely**, každý zápis zvlášť s odstupom 2 sekúnd, po 30 sekundách overiť a skúsiť najviac 3×. Pôvodne jeden neúspešný Modbus zápis zastavil všetky ďalšie a kontrola overovala len pracovný režim.
:::

## Nabíjanie auta

Režimy: **Vypnuté / Nabíjať hneď / Nabíjať od času / AI**. V režime AI auto nabíja:

- v **nízkej tarife** plným prúdom, ktorý dovolí istič,
- z **prebytkov FVE** – prúd sa prispôsobuje prebytku, zapne sa po 2 minútach prebytku a vypne po 3 minútach bez neho. Počas predaja z batérie sa prebytok na auto nepoužije,
- voliteľne pri **lacnom spote**.

Hlavný istič zadáš v ampéroch (napríklad 3 × 25 A), integrácia si nechá rezervu 10 %. Funguje s každou nabíjačkou, ktorá má v Home Assistante vypínač alebo výber režimu a prúd. SmartEVSE sa predvyplní automaticky.

## Tri karty na dashboard

Karty sa inštalujú spolu s integráciou, nič netreba kopírovať ani pridávať ako zdroj.

1. **Igy Price Action Card** – graf cien na dnes a zajtra, predajná hranica a plán batérie ako časová os, napríklad *Predaj z batérie 16:30–18:00 · 91 → 44 %*. Pri nabíjaní a „dom zo siete“ ukazuje cenu nákupu podľa tarify.
2. **Igy Battery Action Card** („AI nastavenia“) – stav nabitia, výkon batérie (zelená nabíja, červená vybíja), aktuálny režim a dôvod. Pod tlačidlom *Nastavenia* je režim meniča, min/max SOC a minimálna predajná cena.
3. **Igy EV Action Card** – režim nabíjania auta, čas, prúd a zdroje pre AI (NT / FVE / spot).

Všetko je klikateľné a otvára detail entity s históriou.

## Sprievodca pre bežných ľudí

Sprievodca ukáže len kroky, ktoré sa ťa týkajú:

**Vitaj** → **Spotové ceny** → **Nákup** (časy NT, ceny) → **Predaj** (spot mínus poplatok / pevná výkupná cena / nepredávam) → **Batéria a spotreba domu** → **Fotovoltika** (Solcast) → **Ovládanie meniča** → **Nabíjačka auta** → **Istič a elektromer** → **Hotovo**.

Pri každom poli je vysvetlené, čo tam patrí, aj s príkladom. SmartEVSE a OKTE nájde sám.

## Čo ma vývoj naučil

Tu je pár vecí, ktoré na prvý pohľad nie sú zrejmé – a ktoré som si musel prerátať.

### Minimálna predajná cena je len poistka

Väčšina ľudí čaká, že keď ju znížia, predá sa viac. Nie. Predaj určuje **energia v batérii**: predá sa len v toľkých najdrahších úsekoch, na koľko energia stačí. Karta preto pri nastavení píše napríklad *„teraz nič nemení – predáva sa od 0,295 €/kWh“*.

### Min SOC je cieľ, nie stena

Minimálny stav nabitia v AI Energy znamená, **kde má batéria skončiť pred ďalšou NT**. Predaj skončí včas, aby po spotrebe domu do nočnej NT ostala batéria na minime. Tvrdú spodnú hranicu drží menič.

Rátal som aj opačný prípad: predať viac a dom potom napájať zo siete (predaj za 0,40 oproti nákupu vo VT za 0,21 €/kWh). Rozhodol som sa, že min SOC je cieľ na konci dňa – dom večer ide z batérie.

### Predávať počas drahej NT? Spravidla nie

Aj keď je spot počas NT vysoko, v NT sa nedá súčasne nabíjať a predávať. Každých 15 minút predaja v NT znamená 15 minút nabíjania menej. Príklad z praxe: predaj za 455 €/MWh v NT vyšiel pri drahom večeri (347 €/MWh) na **−0,23 € za úsek**.

### Ráno nepredať všetko, keď večer príde žatva

Ak by batéria ráno všetko predala za 330–400 €/MWh, poobedná NT (2 h × 10 kW = 20 kWh) ju nestihne nabiť do plna na večer za 600 €/MWh. Plán preto ráno nechá rezervu: to, čo NT nestihne nabiť, mínus slnko, ktoré ešte príde.

### Nabiť v NT aj na spotrebu domu sa oplatí

Platí to vtedy, keď cena NT so stratami (delené 0,9) plus opotrebenie batérie (0,045 €/kWh) je nižšia ako VT. Pri DD3: 0,12 / 0,9 + 0,045 = **0,178 € < 0,21 €/kWh**. Rozdiel je ~0,03 €/kWh – pri 10 kWh ráno asi 0,30 € denne. Malé číslo, ale každý deň.

### Hysterézia proti kmitaniu

Nový predaj sa spustí len vtedy, keď je v batérii energia aspoň na celý 15-minútový úsek. Nabíjanie v NT začne až 3 % pod cieľom. A rovnaké pravidlá platia v pláne aj v odporúčaní – aby karta neklamala.

## Pre pokročilých: pod kapotou

:::tip Technické detaily
- **Python integrácia** s config flow aj options flow, `DataUpdateCoordinator`: ceny každých 15 minút, plán každú minútu a pri zmene SOC alebo cien.
- **Plánovač je čistý Python bez závislosti od Home Assistanta**, pokrytý ~50 testami (pytest).
- **Testy priamo v Home Assistante** (`pytest-homeassistant-custom-component`): celý sprievodca, načítanie, riadenie meniča.
- **GitHub Actions:** hassfest, HACS validácia, testy. Release sa vytvorí automaticky pri zvýšení verzie v manifeste.
- **Karty** sú čistý JavaScript (custom elements) a registrujú sa automaticky s integráciou. Zaujímavá chyba: v niektorých verziách HA sa karta načítaná cez `extra_module_url` registrovala skôr, než Home Assistant pripravil „scoped custom element registry“ – v zozname kariet sa potom donekonečna točilo koliesko. Oprava: registrovať kartu až po štarte aplikácie.
- **Ikona integrácie** je v priečinku `brand/`, HA 2026.3+ ju zobrazí bez PR do repozitára brands.
:::

## Obmedzenia – férovo

- Batériu riadi cez **výber režimu a tvoju automatizáciu meniča**. Hotový blueprint pre Deye zatiaľ nie je.
- Plánovač stojí na **pravidlách**, nie na matematickej optimalizácii. V nezvyčajných dňoch nemusí nájsť úplné optimum – napríklad nepredáva počas vlastnej NT ani vtedy, keď by sa to výnimočne oplatilo.
- **Spotový nákup** (platba za odber podľa spotu) a **virtuálna batéria** zatiaľ nie sú podporované.
- Plán stojí na predpovedi FVE a odhade spotreby domu. Keď sa predpoveď mýli, mýli sa aj plán – prepočítava sa však každú minútu.
- Zatiaľ je vyvíjaná a testovaná na jednom dome: ZSE DD3, Deye, SmartEVSE.

## Čo príde ďalej

- **Optimalizátor** (dynamické programovanie): pre každý 15-minútový úsek vyskúša nabíjať / predávať / nič a vyberie najvyšší zisk. Vedel by vysvetliť aj „hodnotu kWh v batérii“ – napríklad *„o 12:00 má kWh hodnotu 0,58 €, lebo večer sa predá za 600“*. Najprv pobeží v tieni vedľa súčasného plánu.
- **Blueprint pre Deye/Solarman.**
- **Spotový nákup**, ďalšie tarify a distribúcie.

## Inštalácia krok za krokom

Potrebuješ HACS, integráciu **OKTE** (alebo Nord Pool) a senzor nabitia batérie v %. Voliteľne Solcast, nabíjačku auta v Home Assistante a výber režimu meniča s automatizáciou.

1. **HACS → ⋮ → Custom repositories** → vlož `https://github.com/Igypop78/ai-energy`, typ **Integration**.
2. Stiahni **AI Energy** a reštartuj Home Assistant.
3. **Nastavenia → Zariadenia a služby → Pridať integráciu → AI Energy** a prejdi sprievodcom.
4. Na dashboard pridaj karty **Igy Price Action Card**, **Igy Battery Action Card** a **Igy EV Action Card**.
5. Nechaj **riadenie vypnuté** a pár dní porovnávaj odporúčania s tým, čo by si urobil sám. Potom zapni *Batéria – riadenie* a vypni svoje pôvodné automatizácie, aby sa navzájom neprepisovali.

:::tip Vyskúšaj aj bez batérie
Vytvor si pomocníka typu Číslo s názvom *Sim SOC* (0–100 %) a v sprievodcovi ho vyber ako SOC batérie. Posúvaním hodnoty uvidíš, ako sa mení plán a odporúčaný režim.
:::

## Vyskúšaj a daj vedieť

AI Energy je open source pod licenciou MIT: [github.com/Igypop78/ai-energy](https://github.com/Igypop78/ai-energy).

Zatiaľ beží na jednom dome – na mojom. Ak máš inú tarifu, iný menič alebo inú nabíjačku, budem rád za každú skúsenosť. Napíš na [ahoj@tinkermyhome.com](mailto:ahoj@tinkermyhome.com) alebo založ issue na GitHube.
