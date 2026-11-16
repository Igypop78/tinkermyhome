---
id: heating
cover: /img/clanky/titulky/kurenie.jpg
title: Smart kúrenie – ako na to podľa toho, čím doma kúriš
description: Ako zautomatizovať kúrenie v Home Assistante pri centrálnom zdroji, vlastnom kotle aj lokálnom kúrení – hlavice, termopohony, senzory, virtuálne termostaty, otvorené okno a hotové automatizácie.
section: home
level: 2
date: 2026-11-16
time: '21:00'
slug: smart-kurenie
tldr: 'Dobre nastavené kúrenie **zvýši komfort a zníži náklady** – a vie zachrániť aj zle naprojektované kúrenie, kde je jedna izba stále studená. Ako na to, rozhoduje hlavne **zdroj tepla**: centrálny cudzí zdroj a lokálne kúrenie sa automatizujú najľahšie, **vlastný kotol je oriešok**, lebo treba riadiť aj ten. Nižšie je, ako to mám doma: **teplota z ESP cez LAN káble, termopohony 230 V cez relé, kotol cez ESP relé** a všetko riadia virtuálne termostaty v HA. Aj s automatizáciami a blueprintom na otvorené okno.'
---

Dobre nastavené kúrenie **zásadne mení komfort v dome** a zároveň vie znížiť náklady. Vďaka smart riadeniu sa dá vyriešiť aj **chybne naprojektované kúrenie** – napríklad keď je jedna z izieb stále nedokúrená.

Najdôležitejšia otázka na začiatok: **čím vlastne kúriš?**

| Zdroj tepla | Príklad | Náročnosť |
|---|---|---|
| **1. Externý centrálny zdroj** | spoločná kotolňa v bytovke, centrálne teplo v meste | najľahšie |
| **2. Vlastný centrálny zdroj** | vlastný plynový kotol, tepelné čerpadlo | trochu tricky |
| **3. Lokálny zdroj v izbe** | elektrické podlahové kúrenie, elektrické radiátory, klimatizácia | ľahké |

Prvý a tretí spôsob sa automatizujú najľahšie. Pri druhom treba **riadiť aj samotný zdroj** – a to je ten oriešok.

Poďme krok po kroku.

## 1. Externý centrálny zdroj – stačia smart hlavice

Teplo ti „chodí“ z kotolne a ty riešiš len to, koľko ho pustíš do radiátora. Na radiátory stačí namontovať **smart termostatické hlavice** a teplotu v izbe vieš riadiť aj na diaľku a podľa vlastnej logiky – rozvrh, prítomnosť, otvorené okno.

Má to však pár „ale“:

- **Meranie teploty pri hlavici býva skreslené.** Senzor je priamo pri radiátore, teda pri zdroji tepla – hlavica si myslí, že je v izbe teplejšie, ako naozaj je. Oplatí sa hľadať také hlavice, ktoré vedia pracovať s **externým senzorom teploty** umiestneným v izbe.
- **Pozor na lacné hlavice.** Batérie v nich často dlho nevydržia a hlavne bývajú **dosť hlučné** – motorček v spálni v noci počuť.

:::me Ako to mám ja
V byte (teplo z centrálneho zdroja) som vyskúšal viacero hlavíc a skončil som pri **Tado Smart Radiator Thermostat X**. Majú **nabíjateľnú batériu**, ktorá vydrží celú sezónu (nabíja sa cez USB-C), ľahko sa nastavujú a hlavne sú **tiché**.
:::

![Smart hlavice Tado X](/img/clanky/kurenie-tado-x.jpg)

## 2. Vlastný centrálny zdroj – kotol, ventily a teplota

Tu je to zložitejšie. Platia dve pravidlá naraz:

- **kotol musí bežať**, keď aspoň jedna izba chce kúriť,
- izby, ktoré kúriť nechcú, **musia byť medzitým zavreté** – inak ich kotol vykúri tiež.

Potrebuješ na to tri veci.

### Ovládanie kotla cez Home Assistant

Väčšina kotlov má svorky na pripojenie **externého ON/OFF termostatu**. Tam zapojíš smart relé. Na pôvodnom priestorovom termostate potom nastavíš **vyššiu teplotu**, aby kotlu „nebránil“, a zapínanie a vypínanie kúrenia riadi už len tvoje relé.

Prečo pôvodný termostat jednoducho nevymeniť? Často slúži aj na iné veci – nastavenia kotla, ohrev vody, ekvitermiku. Bez neho by kotol nemusel fungovať správne.

:::warn Pozor na zapojenie
Vstup pre termostat na kotle je zvyčajne **bezpotenciálový kontakt** – relé ho len spína, nesmie doň pustiť 230 V. Použi relé so suchým kontaktom (napr. Shelly 1 alebo relé modul na ESP) a ak si nie si istý, nechaj to urobiť servisného technika. Pri zásahoch do kotla mysli aj na záruku.
:::

### Ovládanie radiátorov v izbách

Dve možnosti:

- **Smart hlavice** – rovnaké ako v bode 1, len ich používaš v krajných hodnotách (úplne otvorené / úplne zavreté), aby sa správali ako ON/OFF ventil.
- **Termoelektrické pohony** (termopohony) – ak máš ku radiátorom kabeláž alebo rozdeľovač podlahovky. Pohon sa nasadí na ventil namiesto hlavice, pri napájaní sa ventil otvorí, bez napájania zavrie. Ovládaš ho **smart zásuvkou alebo relé**. Jeden pohon stojí **do 20 €** a je **úplne bezhlučný**.

![Termoelektrický pohon ventilu (ilustračný)](/img/clanky/kurenie-pohon-ventilu.jpg)

:::info Na čo si dať pozor pri pohonoch
- **Napätie:** pohony sú na **230 V** aj na **24 V** (napríklad ten na fotke je 24 V verzia). Na 24 V potrebuješ ešte transformátor – kúp taký, aký vieš zapojiť.
- **NC alebo NO:** NC (normally closed) je bez prúdu **zavretý**, NO naopak otvorený. Pri NC relé zapnuté = kúri.
- **Je pomalý:** pohon sa otvára zohriatím vosku vnútri, takže mu otvorenie trvá pár minút. Na kúrenie to nevadí, len sa nečuduj, že ventil „necvakne“ hneď.
:::

### Meranie teploty na správnom mieste

Batériový alebo káblový senzor – je to jedno. Dôležité sú dve veci:

- senzor **posiela zmenu teploty priebežne** (nie raz za 10 minút),
- je **na správnom mieste** – nie pri radiátore, nie na slnku, nie pri dverách, ideálne v strede izby vo výške, kde sa zdržiavaš.

Keď máš všetky tri časti, môžeš sa pustiť do riadenia.

## Logika: virtuálne termostaty + jedna automatizácia

Logika je jednoduchá:

1. V HA si pre každú izbu vytvoríš **virtuálny termostat** (pomocník **Generic thermostat**), ktorý spáruje **ventil radiátora** (relé/zásuvku) so **senzorom teploty**. Termostat sám otvára a zatvára ventil podľa cieľovej teploty.
2. **Jedna automatizácia** sleduje všetky termostaty. Keď aspoň jeden kúri (`hvac_action: heating`), zapne kotol. Keď už nekúri žiadny, kotol vypne.

Generic thermostat si vytvoríš v **Nastavenia → Zariadenia a služby → Pomocníci → Vytvoriť pomocníka → Generic thermostat**. Dôležité parametre:

- **Spínač ohrievača** – relé termopohonu v izbe,
- **Senzor teploty** – teplomer v izbe,
- **Tolerancia studená / teplá** – hysterézia, o koľko môže teplota klesnúť pod cieľ a stúpnuť nad cieľ, kým termostat zopne/vypne,
- **Minimálna dĺžka cyklu** – ako dlho musí ventil ostať v jednom stave.

:::tip Menej štartov kotla
- **Rozumná hysterézia** (napr. pár desatín stupňa) a minimálna dĺžka cyklu znížia počet zopnutí kotla aj pohonov.
- **Kúr naraz.** Keď chce kúriť jedna izba, pustím kúrenie aj v izbách, kde je teplota **blízko hranice kúrenia**. Kotol ich vykúri naraz, namiesto toho, aby sa o chvíľu zapínal znova kvôli ďalšej izbe. Kotol tak štartuje menej krát za deň – automatizácia je nižšie.
:::

### Automatizácia: kotol podľa termostatov

Toto je moja automatizácia, ktorá zapína a vypína kotol. Okrem zmeny stavu termostatov sa spustí aj **každých 30 minút** a **po štarte HA** – ako poistka, keby sa nejaká zmena stratila.

```yaml kurenie-kotol.yaml
alias: Kúrenie – kotol podľa termostatov
description: Kotol beží, keď kúri aspoň jedna izba.
triggers:
  - trigger: state
    entity_id:
      - climate.spalna_termostat
      - climate.pracovna_termostat
      - climate.jakub_termostat
      - climate.martin_termostat
      - climate.kuchyna_termostat
    attribute: hvac_action
  - trigger: time_pattern
    minutes: /30
  - trigger: homeassistant
    event: start
conditions: []
actions:
  - if:
      - condition: or
        conditions:
          - condition: state
            entity_id: climate.spalna_termostat
            attribute: hvac_action
            state: heating
          - condition: state
            entity_id: climate.martin_termostat
            attribute: hvac_action
            state: heating
          - condition: state
            entity_id: climate.jakub_termostat
            attribute: hvac_action
            state: heating
          - condition: state
            entity_id: climate.kuchyna_termostat
            attribute: hvac_action
            state: heating
          - condition: state
            entity_id: climate.pracovna_termostat
            attribute: hvac_action
            state: heating
    then:
      - action: switch.turn_on
        target:
          entity_id: switch.kurenie_kotol
    else:
      - action: switch.turn_off
        target:
          entity_id: switch.kurenie_kotol
mode: single
```

Stačí prepísať názvy termostatov a relé kotla na svoje.

### Automatizácia: prikúrenie izieb pri štarte kotla

Toto je tip „kúr naraz“ v praxi. Keď sa kotol zapne, automatizácia prejde všetky izby v režime `heat` a otvorí ventil tam, kde je teplota **pod cieľom + 0,2 °C** – teda izby, ktoré by o chvíľu chceli kúriť tiež. Termostat ich potom dokúri a ventil **sám zavrie**, keď dosiahne svoju hornú toleranciu.

Funguje to preto, že generic thermostat zapnutý ventil nechá zapnutý, kým izba nie je dosť teplá. Netreba meniť cieľovú teplotu ani nič vracať späť. 10-sekundové čakanie na začiatku dá kotlu a termostatom chvíľu, kým sa stavy ustália.

```yaml kurenie-prikurenie.yaml
alias: Kúrenie – prikúrenie izieb pri štarte kotla
description: >-
  Pri zapnutí kotla zapne relé len v izbách v režime heat, ktorým do cieľa
  chýba málo. Generic thermostat ich dokúri a sám vypne.
triggers:
  - trigger: state
    entity_id: switch.kurenie_kotol
    from: "off"
    to: "on"
conditions: []
actions:
  - delay:
      seconds: 10
  - if:
      - condition: state
        entity_id: climate.spalna_termostat
        state: heat
      - condition: template
        value_template: >-
          {{ state_attr('climate.spalna_termostat', 'current_temperature') | float(99)
             < state_attr('climate.spalna_termostat', 'temperature') | float(0) + 0.2 }}
    then:
      - action: switch.turn_on
        target:
          entity_id: switch.spalna_ventil
  - if:
      - condition: state
        entity_id: climate.martin_termostat
        state: heat
      - condition: template
        value_template: >-
          {{ state_attr('climate.martin_termostat', 'current_temperature') | float(99)
             < state_attr('climate.martin_termostat', 'temperature') | float(0) + 0.2 }}
    then:
      - action: switch.turn_on
        target:
          entity_id: switch.martin_ventil
  - if:
      - condition: state
        entity_id: climate.jakub_termostat
        state: heat
      - condition: template
        value_template: >-
          {{ state_attr('climate.jakub_termostat', 'current_temperature') | float(99)
             < state_attr('climate.jakub_termostat', 'temperature') | float(0) + 0.2 }}
    then:
      - action: switch.turn_on
        target:
          entity_id: switch.jakub_ventil
  - if:
      - condition: state
        entity_id: climate.pracovna_termostat
        state: heat
      - condition: template
        value_template: >-
          {{ state_attr('climate.pracovna_termostat', 'current_temperature') | float(99)
             < state_attr('climate.pracovna_termostat', 'temperature') | float(0) + 0.2 }}
    then:
      - action: switch.turn_on
        target:
          entity_id: switch.pracovna_ventil
  - if:
      - condition: state
        entity_id: climate.kuchyna_termostat
        state: heat
      - condition: template
        value_template: >-
          {{ state_attr('climate.kuchyna_termostat', 'current_temperature') | float(99)
             < state_attr('climate.kuchyna_termostat', 'temperature') | float(0) + 0.2 }}
    then:
      - action: switch.turn_on
        target:
          entity_id: switch.kuchyna_ventil
mode: single
```

### Blueprint: otvorené okno vypne kúrenie v izbe

Kúriť von oknom nemá zmysel. Na to mám **blueprint** – jedna automatizácia = jedna izba:

- okno otvorené dlhšie ako **2 minúty** → termostat izby sa vypne,
- okno zatvorené dlhšie ako **10 minút** → termostat sa vráti do kúrenia,
- **po štarte HA** vypne termostat, ak je okno práve otvorené.

Kúrenie po zatvorení okna **nezapne**, ak si termostat vypol ručne ty (z dashboardu alebo aplikácie) – takže ti zatvorenie okna v lete nepustí kúrenie. Oba časy si v blueprinte nastavíš.

Vypnutý termostat prestane hlásiť `heating`, takže ak to bola posledná kúriaca izba, **vypne sa aj kotol** – to rieši prvá automatizácia.

[Importovať blueprint do Home Assistanta](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fgithub.com%2FIgypop78%2Fblueprints%2Fblob%2Fmain%2Fautomation%2Fkurenie_otvorene_okno.yaml) · [zdrojový kód na GitHube](https://github.com/Igypop78/blueprints/blob/main/automation/kurenie_otvorene_okno.yaml)

## Moje kúrenie doma

:::me Ako to mám ja
Dom vykuruje **plynový kotol** (aj zásobník teplej vody), kúrenie riadi Home Assistant v **5 izbách**:

- **Teplota:** v každej izbe senzor **DS18B20**, ktorý cez **LAN kábel** zbiera **ESP32**. Káblové meranie – žiadne batérie a hodnoty chodia priebežne.
- **Nastavenie teploty:** v každej izbe **Aqara W100**. Vie byť aj externým senzorom teploty, ja ho však používam hlavne ako **ovládač** – tlačidlami +/− nastavujem cieľovú teplotu a na displeji vidno, čo sa deje.
- **Radiátory:** na každom ventile **termopohon 230 V (NC)** ovládaný smart relé.
- **Kotol:** cez **relé na ESP**, ktoré zároveň meria teploty teplej vody a potrubí.
- **Riadenie:** všetko cez **virtuálne termostaty** (`generic_thermostat`), dve automatizácie vyššie a blueprint na otvorené okno.

Dole mám okrem toho **elektrické podlahové kúrenie** ako alternatívu ku plynu – na karte je ako samostatný termostat „Podlaha“.
:::

![Aqara W100 – ovládač a displej v izbe](/img/clanky/kurenie-aqara-w100.jpg)

Takto vyzerá karta termostatov na mojom dashboarde – je to `igy-thermostat-card` z môjho balíka kariet [Igy Cards](https://github.com/Igypop78/igy-cards) (inštalácia cez HACS). Hneď vidno, ktoré izby práve kúria (oranžové), aká je v nich teplota a aký je cieľ. Oranžový pás dole ukazuje, **kedy sa kúrilo za posledných 24 hodín**. Karta vie upozorniť aj na otvorené okno.

![Karta termostatov na dashboarde](/img/clanky/kurenie-karta-termostatov.png)

```yaml karta-termostatov.yaml
type: custom:igy-thermostat-card
title: Kúrenie
entities:
  - entity: climate.spalna_termostat
    window: binary_sensor.spalna_okno
  - entity: climate.martin_termostat
  - entity: climate.jakub_termostat
```

## 3. Lokálne kúrenie – termostat alebo senzor + zásuvka

Asi najjednoduchšie riešenie. Stačí kúpiť vhodný **smart termostat** a prepojiť ho so zdrojom tepla. Alebo skombinovať **senzor teploty** a **smart zásuvku** – napríklad pre elektrický radiátor – a spojiť ich virtuálnym termostatom ako v bode 2. Ostatné platí rovnako: senzor na správnom mieste, rozumná hysterézia, otvorené okno vypne kúrenie.

:::warn Elektrické radiátory a zásuvky
Elektrický radiátor má často 2 kW a viac. Skontroluj, či smart zásuvka alebo relé zvládne takú záťaž **dlhodobo** – nie len na papieri.
:::

Ak kúriš **klimatizáciou**, treba ju najprv dostať do HA. Novšie klimy to vedia cez WiFi integráciu, staršie sa dajú oživiť cez ESP – ja mám takto pripojenú starú klimu Samsung (viac v článku [ESP32 – moje projekty](/diy/esp32-moje-projekty/), návod pridám čoskoro). Potom platí to isté ako vyššie.

## Na záver

- **Začni zdrojom tepla** – podľa neho vyber hlavice, pohony alebo termostat.
- **Teplota z izby, nie od radiátora.**
- Pri vlastnom kotle: **kotol zapína HA**, pôvodný termostat nechaj na vyššej teplote.
- **Hysterézia + kúrenie naraz** = menej štartov kotla.
- **Otvorené okno = vypnuté kúrenie** v danej izbe.
