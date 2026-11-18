---
id: fve-setup
title: Moja fotovoltika – čo mám doma, koľko to stálo a ako to funguje
description: Prehľad mojej svojpomocne postavenej FVE ~13,9 kWp s meničom Deye a batériou 34 kWh – z čoho sa skladá, čo vyrobí, koľko stála a ako ju riadim z Home Assistanta.
section: energy
level: 1
date: 2026-11-17
time: '15:30'
slug: moja-fve
cover: /img/clanky/titulky/moja-fve.jpg
tldr: Mám **28 panelov (~13,9 kWp)**, menič **Deye 10 kW** a vlastnú batériu **LiFePO4 ~34 kWh**. Všetko som **zapojil sám** a dal skontrolovať revíznemu technikovi – preto to stálo len **~8 000 €** vrátane batérie. Riadim to z **Home Assistanta** – batéria podľa spotových cien sama nakupuje a predáva. Tu je prehľad, z čoho sa to skladá a ako to spolu súvisí.
---

Na webe píšem o fotovoltike veľa a často do hĺbky. Tento článok je opačný – jednoduchý prehľad, čo doma naozaj mám. Ak chceš ísť ďalej, na konci každej časti je odkaz na podrobný článok.

![Menič Deye, batérie, rozvádzače a skrinka s ESP v prístrešku](/img/clanky/fve-pristresok.jpg)

## Prehľad na jednej stránke

| Časť | Čo mám |
|---|---|
| **Panely** | 22 × JA Solar JAM60D41 LB 500 Wp (JV/SZ 11 : 11) + 6 × DAH bezrámové ~480 Wp, spolu ~13,9 kWp |
| **Menič** | Deye SUN-10K-SG04LP3-EU – hybridný, 10 kW, 3-fázový |
| **Batéria** | LiFePO4 ~34 kWh: 2 × 280 Ah + 1 × 105 Ah |
| **BMS** | 3 × JK BMS (každá batéria má vlastnú), do Home Assistanta cez ESP |
| **Meranie batérie** | Victron SmartShunt na celú banku |
| **Monitoring** | Solarman, Deye Cloud a hlavne Home Assistant |
| **Predpoveď výroby** | Solcast |
| **Limit dodávky do siete** | 10 kW |
| **Hlavný istič** | 3 × 25 A |
| **Montáž** | svojpomocne, revízia externým revíznym technikom |
| **Cena** | ~8 000 € spolu (pri vlastnej montáži), z toho batéria ~3 500 € |

## Panely a menič

Mám **22 panelov JA Solar JAM60D41 LB po 500 Wp**. Polovica mieri na juhovýchod, polovica na severozápad (11 : 11). K tomu mám **6 bezrámových panelov DAH** s výkonom okolo 480 Wp. Spolu je to približne **13,9 kWp**.

Menič **Deye** má výkon **10 kW** a je trojfázový. Je to hybridný menič – zvládne panely, batériu aj sieť naraz a dá sa ovládať z Home Assistanta.

Výrobu predpovedá **Solcast**. Z mojej skúsenosti je reálna výroba zhruba **80 % predpovede**, s tým počítam aj pri plánovaní.

:::info Čo je kWp
Kilowatt-peak je výkon panelov v ideálnych laboratórnych podmienkach. Reálne panely dávajú menej – podľa slnka, teploty a natočenia. Preto môže mať menič menší výkon, ako je súčet panelov – a pri orientácii JV/SZ panely aj tak nikdy nedávajú plný výkon naraz.
:::

## Batéria – tri kusy, jedno meranie

Batériu nemám kúpenú ako jednu krabicu. Skladá sa z troch samostatných LiFePO4 batérií: **2 × 280 Ah a 1 × 105 Ah**, spolu približne **34 kWh**. Každá má vlastnú **JK BMS**, ktorá ju chráni a ktorú vidím v Home Assistante cez ESP.

Celú banku navyše meria **Victron SmartShunt**. To je pre mňa **zdroj pravdy** – údajom o batérii z meniča Deye neverím. SOC z BMS v zime ujde, SmartShunt meria presne. Ako som jeho údaje dostal až do meniča, je v článku [Presné SOC v meniči Deye](/energia/soc-zo-smartshunt-do-deye/).

:::me Ako to mám ja
Batéria má garantovaných **4 000 cyklov** a maximálny vybíjací prúd **220 A**. K 1. 11. 2026 mala za sebou približne **491 cyklov** – zhruba 12 % garantovanej životnosti. Keďže batéria dnes aj obchoduje, cyklí viac, ako keby len kryla spotrebu domu. Opotrebenie si preto počítam ako náklad – asi 45 €/MWh.
:::

## Koľko vyrobí a koľko spotrebujeme

Výroba FVE za posledné mesiace:

| Mesiac 2026 | Výroba FVE |
|---|---|
| júl | 2 281 kWh |
| august | 2 037 kWh |
| september | 1 512 kWh |
| október | 1 099 kWh |

Dom bez auta spotrebuje **15 až 20 kWh denne**. Aj s autom je to **1 200 až 1 345 kWh mesačne**. Kúri u nás hlavne plynový kotol, elektrické podlahové kúrenie dole je len alternatíva. Výroba FVE v zime padá, preto vtedy batériu nabíjam zo siete v nízkej tarife.

Ako to vyzerá práve teraz, vidíš naživo na [úvodnej stránke](/) v karte „Ako funguje náš dom“. Čísla posiela priamo môj Home Assistant každých 5 minút.

## Auto a wallbox na tom istom kábli

Doma nabíjame **Teslu Model Y** cez wallbox **SmartEVSE** (3-fázový, 6–16 A, teda do ~11 kW). Menič a wallbox zdieľajú jeden kábel, preto držím odber pod **12 kW**. Raz som bol na hranici hlavného ističa – auto sa nabíjalo a batéria zároveň brala zo siete. Odvtedy to stráži logika v Home Assistante.

## Ako to celé riadim

Všetko beží cez **Home Assistant**. Ten číta menič, BMS, SmartShunt aj wallbox a podľa plánu prepína režimy meniča Deye.

Elektrinu **nakupujem za pevnú dvojtarifu** (ZSE, sadzba DD3) a od septembra 2026 **predávam za spotové ceny** (V-elektra, spot OKTE − 15 €/MWh). Batéria sa v lacnej nízkej tarife nabije a predáva v najdrahších 15-minútových úsekoch. Plánuje to moja vlastná integrácia **AI Energy**.

Podrobne:

- [Batéria, ktorá obchoduje](/energia/bateria-obchoduje-na-spote/) – reálny deň v grafe, nastavenia Deye a čísla za jednotlivé mesiace.
- [AI Energy](/projekty/ai-energy/) – ako integrácia plánuje nákup a predaj.
- [Čím začať smart dom? Meraním](/energia/zacni-meranim-spotreby/) – ako meriam spotrebu po okruhoch.

## Koľko to stálo a čo to prináša

Celá FVE s batériou stála **približne 8 000 €**, z toho batéria asi **3 500 €**.

:::warn Cena platí pri vlastnej montáži
Všetko som montoval a zapájal **sám**. Hotovú inštaláciu potom skontroloval **externý revízny technik** – revízia je povinná a bez revíznej správy ti distribučka FVE k sieti nepripojí. Cena preto nezahŕňa prácu montážnej firmy. Ak nemáš skúsenosti s elektrinou, svojpomocnú montáž neodporúčam – meniče a batérie pracujú s vysokým napätím a prúdom.
:::

Za samotnú elektrinu (predaj mínus nákup) som v júli a auguste s virtuálnou batériou zarobil spolu **95 €**. V septembri a októbri, už na spote a s menej slnkom, **352 €**. Ako je to možné, rozpisujem v článku [Batéria, ktorá obchoduje](/energia/bateria-obchoduje-na-spote/).

## Čo by som dnes spravil inak

Spravil by som to **celé poriadne naraz**. FVE som staval postupne – celý príbeh aj s chybami je v článku [Moja FVE cesta](/energia/moja-fve-cesta/).
