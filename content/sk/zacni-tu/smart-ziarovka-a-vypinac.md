---
id: bulb-switch
title: Smart žiarovka a vypínač na stene – 5 spôsobov zapojenia a ktorý je ten správny
description: Prečo smart žiarovka prestane fungovať, keď ju niekto vypne vypínačom, a ako ju zapojiť tak, aby fungovala vždy. Päť zapojení so schémami, porovnanie a nastavenie v Home Assistante.
section: start
level: 1
date: 2026-11-12
time: '23:30'
slug: smart-ziarovka-a-vypinac
tldr: Smart žiarovka potrebuje prúd **stále** – keď ju niekto vypne vypínačom, ovládač ani aplikácia ju nenájdu a v Zigbee sieti zmizne jeden **router**. Ideálne je nechať žiarovku stále pod prúdom a z vypínača spraviť len **tlačidlo**, ktoré posiela signál do centrály. Najlepšie z oboch svetov dá **smart relé s odpojeným vstupom** – žiarovka je stále online a pri výpadku centrály relé svetlo aj tak prepne.
---

Takto začína smart home skoro každý. V IKEA kúpiš smart žiarovku s ovládačom, doma ju zaskrutkuješ, spáruješ a funguje to. Stmievaš z gauča, meníš teplotu svetla, paráda.

Večer príde manželka, ide okolo vypínača a – cvak – zhasne. Ako vždy. Na druhý deň stlačíš ovládač a nič. Žiarovka je bez prúdu, takže ju ovládač nemá ako zapnúť. Zapneš vypínač, žiarovka sa rozsvieti naplno a celé to „smart“ sa zmenší na drahú žiarovku s diaľkovým ovládačom, ktorý funguje len niekedy.

Po pár týždňoch to väčšina ľudí vzdá a smart home skončí v šuflíku. Netreba. V tomto článku ukážem, prečo sa to deje, aké sú možnosti zapojenia a ktoré z nich vydrží aj reálnu rodinu.

## Prečo ovládač prestane fungovať

Smart žiarovka nie je len žiarovka. Vo vnútri má malý počítač s rádiom, ktorý počúva príkazy – z ovládača, z aplikácie alebo z centrály. Aby mohol počúvať, **potrebuje prúd aj vtedy, keď nesvieti**.

Klasický vypínač robí jedinú vec: fyzicky preruší prúd do svietidla. Žiarovka tak nevie, že ju niekto „vypol“ – jednoducho prestane existovať. Ovládač potom kričí do prázdna.

![Schéma 1: žiarovka s ovládačom za klasickým vypínačom](/img/clanky/ziarovka-1-ostrov-sk.svg)

Je tu aj druhý, menej viditeľný problém. Žiarovka spárovaná priamo s ovládačom je **ostrov**. Nevie nič o ostatných svetlách, senzoroch ani o tom, že je západ slnka. Nedá sa prepojiť s pohybom na chodbe ani zhasnúť spolu s celým domom, keď odchádzaš. Presne preto ju v článku [Čo všetko je smart zariadenie](/zacni-tu/smart-zariadenia/) ešte nepovažujem za smart.

Riešenia sú dve a dajú sa kombinovať:

1. **Postaviť smart home s centrálou** – ideálne Home Assistant, ale funguje aj IKEA Dirigera, Hue Bridge, Homey a iné. Až centrála z ostrovov spraví systém.
2. **Vyriešiť vypínač** – aby rodina mohla dávať cvak ako doteraz a žiarovka pritom nezostala bez prúdu.

## Prečo by mala byť žiarovka stále pod prúdom

Okrem toho, že ju vždy vieš ovládať, je tu ešte jeden dôvod. Zigbee (a aj Thread) je **mesh sieť** – zariadenia si posielajú správy ďalej, takže sieť dosiahne aj tam, kam by centrála sama nedokázala. Túto prácu robia **routre**: zariadenia napájané zo siete, teda aj smart žiarovky. Viac o sieťach v článku [Zigbee, WiFi, Z-Wave alebo Matter](/zacni-tu/zigbee-wifi-zwave-matter/).

Batériové senzory (dvere, okná, teplota, pohyb) routre nie sú. Pripoja sa k najbližšiemu routru a cez neho posielajú dáta. Keď niekto ten router vypne vypínačom, senzor stratí cestu a musí si hľadať novú. Výsledok: senzor chvíľu nereaguje, automatizácia nespustí a ty nevieš prečo.

![Zigbee mesh – žiarovka ako router zapnutá a vypnutá](/img/clanky/ziarovka-mesh-sk.svg)

:::info Nie každá žiarovka je dobrý router
Väčšina Zigbee žiaroviek routuje, ale nie všetky rovnako dobre. Niektoré batériové senzory (známe sú staršie Aqara) si s niektorými routrami nerozumejú a odpájajú sa. Pri nových žiarovkách IKEA KAJPLATS (Matter cez Thread) sú niektoré modely v Thread sieti len koncové zariadenia, nie routre. Ak staviaš sieť, nespoliehaj sa len na žiarovky – doplň aj smart zásuvku alebo relé.
:::

## 5 spôsobov, ako zapojiť svetlo

Prejdime všetky možnosti od najhoršej po najlepšiu. Na schémach je **oranžovou** prúd 230 V, **sivou** signál z vypínača a **modrou prerušovanou** bezdrôtová komunikácia.

### 1. Žiarovka + ovládač, klasický vypínač

Stav, z ktorého väčšina z nás začínala. Funguje, kým nikto nesiahne na vypínač. Žiadne prepojenie, žiadne automatizácie.

**Kedy dáva zmysel:** v lampe so šnúrovým vypínačom, ktorý nikto nepoužíva, alebo ako prvé zoznámenie so smart svetlom. Na stropné svetlo s vypínačom pri dverách nie.

### 2. Smart relé + obyčajné svetlo

Za pôvodný vypínač sa schová **smart relé** (napríklad Shelly 1 Mini Gen3, Sonoff ZBMINIR2 alebo Aqara T1). Vypínač ostane, len už nespína svetlo priamo – posiela signál do relé a to spína svetlo. Relé vie ovládať aj centrála, takže máš mobil, automatizácie aj hlas. Žiarovka môže byť úplne obyčajná.

![Schéma 2: smart relé za vypínačom a obyčajná žiarovka](/img/clanky/ziarovka-2-rele-obycajna-sk.svg)

Najrobustnejšie riešenie. Ak centrála vypadne, vypínač funguje ďalej, lebo relé ho počúva priamo. Nevýhoda: nemáš farbu ani teplotu svetla, stmievanie len so stmievacím modulom (napríklad Shelly Dimmer).

**Kedy dáva zmysel:** pri väčšine svetiel v dome – chodba, kúpeľňa, komora, vonkajšie svetlá. Ak nepotrebuješ meniť farbu, smart žiarovku vôbec nepotrebuješ.

### 3. Smart relé + smart žiarovka („polovične smart“)

Rovnaké zapojenie ako v bode 2, len v svietidle je smart žiarovka. Vypínač cez relé zapína a vypína prúd do žiarovky. Keď svieti, vieš jej meniť jas a farbu. Keď je vypnutá, je bez prúdu – ako v bode 1.

![Schéma 3: smart relé a smart žiarovka za ním](/img/clanky/ziarovka-3-rele-smart-sk.svg)

Oproti bodu 1 je to veľký posun: svetlo vieš zapnúť z mobilu aj automatizáciou (cez relé) a funguje aj bez centrály. Polovičatosť je v tom, že vypnutá žiarovka nie je router a farbu ti „neprepíše“ – po každom zapnutí sa rozsvieti tak, ako má nastavené (viac v časti pre pokročilých).

**Kedy dáva zmysel:** keď už relé za vypínačom máš a chceš len občas inú farbu. Alebo tam, kde ti spoľahlivosť bez centrály stojí viac ako dokonalý smart.

### 4. Žiarovka stále pod prúdom + vstupný modul

Toto je „čistý“ smart. Elektrikár vypínač **premostí**, takže žiarovka má prúd stále. Za vypínač príde **vstupný modul** – zariadenie, ktoré nič nespína, len hlási centrále „niekto prepol vypínač“. Centrála potom povie žiarovke, čo má robiť.

![Schéma 4: žiarovka stále pod prúdom a vypínač so vstupným modulom](/img/clanky/ziarovka-4-vstupny-modul-sk.svg)

Príklady vstupných modulov:

- **Shelly i4 Gen3** (WiFi) – štyri vstupy, ideálny pod dvojitý vypínač.
- **Philips Hue Wall Switch Module** (Zigbee) – na batériu, takže **nepotrebuje nulový vodič**. Je tiež verzia napájaná zo siete.
- Alebo úplne bez elektrikára: vypínač zakryješ a vedľa nalepíš **bezdrôtové tlačidlo** (IKEA RODRET, STYRBAR, BILRESA, Hue Dimmer). Funguje, ale rodina musí zmeniť zvyk.

Žiarovka je stále online, robí router a jeden vypínač môže ovládať čokoľvek: scénu, celú skupinu svetiel, dvojklik môže zhasnúť celé prízemie. Nevýhoda: **keď centrála nebeží, vypínač nefunguje**. Dá sa to obísť priamym prepojením (bindingom) – o tom nižšie.

**Kedy dáva zmysel:** keď máš spoľahlivú centrálu (ideálne so záložným zdrojom) a chceš z vypínača dostať maximum.

### 5. Smart relé s odpojeným vstupom + smart žiarovka

Najlepšie z oboch svetov. Zapojenie je rovnaké ako v bode 3 – relé za vypínačom, žiarovka za relé. Rozdiel je v nastavení: relé prepneš do režimu **odpojeného vstupu** (Shelly ho volá *Detached*, Sonoff *Detach Relay*, Aqara *Decoupled*). Vypínač potom relé priamo neprepína, len posiela signál do centrály. Výstup relé ostáva **stále zapnutý**, takže žiarovka má prúd.

![Schéma 5: smart relé s odpojeným vstupom a smart žiarovka](/img/clanky/ziarovka-5-rele-odpojeny-vstup-sk.svg)

Čo tým získaš oproti bodu 4:

- **Záloha pri výpadku centrály.** Shelly Gen3/Gen4 vie mať skript, ktorý pri nedostupnom Home Assistante prepne relé priamo zo vstupu. Pri ESPHome sa to dá nastaviť v konfigurácii. Svetlo potom funguje aspoň ako obyčajný vypínač.
- **Reštart žiarovky na diaľku.** Ak sa žiarovka „zasekne“, vypneš a zapneš relé z mobilu. Nemusíš liezť ku vypínaču.
- **Netreba premosťovať vypínač** – stačí zmeniť nastavenie. Kedykoľvek sa vieš vrátiť k bodu 3.

Nevýhoda: relé pod vypínačom väčšinou potrebuje **nulový vodič** a trochu nastavovania.

**Kedy dáva zmysel:** všade, kde chceš smart žiarovku a vypínač, ktorý rodina používa ako doteraz. Toto je zapojenie, ktoré odporúčam.

## Porovnanie na jednom mieste

| | 1 Ovládač | 2 Relé + obyčajná | 3 Relé + smart | 4 Vstupný modul | 5 Relé, odpojený vstup |
|---|---|---|---|---|---|
| Vypínač funguje aj bez centrály | ✅ | ✅ | ✅ | ❌ (len s bindingom) | ✅ (so zálohou) |
| Ovládač a mobil fungujú vždy | ❌ | ✅ | ⚠️ len zap/vyp | ✅ | ✅ |
| Žiarovka robí router | ⚠️ len keď svieti | – | ⚠️ len keď svieti | ✅ | ✅ |
| Farba a stmievanie | ✅ | ❌ | ⚠️ len keď svieti | ✅ | ✅ |
| Automatizácie a prepojenie | ❌ | ✅ | ⚠️ | ✅ | ✅ |
| Treba elektrikára | nie | áno | áno | áno (premostenie) | áno |
| Nulový vodič pod vypínačom | nie | väčšinou áno | väčšinou áno | nie (Hue na batériu) | väčšinou áno |
| Cena | € | € | €€ | €€ | €€ |
| Vydrží rodinu | ❌ | ✅ | ✅ | ⚠️ keď centrála beží | ✅ |

## Ktoré zapojenie si vybrať

- **Nepotrebuješ farbu?** Bod 2. Smart relé a obyčajná LED žiarovka. Lacné a nezničiteľné.
- **Chceš farbu a jas a máš nulový vodič?** Bod 5. Relé s odpojeným vstupom a smart žiarovka.
- **Nemáš nulový vodič a máš Hue?** Bod 4 s Hue Wall Switch Module na batériu.
- **Bývaš v podnájme a nechceš nič rozoberať?** Bezdrôtové tlačidlo vedľa vypínača a na vypínač kryt. Nie je to krásne, ale funguje.
- **Máš len žiarovku a ovládač a zatiaľ nechceš viac?** Aspoň si v centrále nastav správanie po zapnutí prúdu (nižšie) a pripni na vypínač ceduľku. Vážne.

:::me Ako to mám ja
Väčšinu svetiel mám na smart relé za pôvodnými vypínačmi. Pri úpravách domu som rovno chcel hlbšie inštalačné krabice a nulový vodič pod každým vypínačom, takže montáž relé je hračka. V obývačke ovládam svetlá aj bezdrôtovým ovládačom IKEA.
:::

## Pre pokročilých: nastavenie v Home Assistante

### Správanie žiarovky po zapnutí prúdu

Každá Zigbee žiarovka má nastavenie, čo spraví, keď dostane prúd. V Zigbee2MQTT sa volá **Power-on behavior**, v ZHA **Start-up behavior**. Možnosti sú zapnúť sa, ostať vypnutá, prepnúť sa alebo vrátiť **posledný stav**.

- Pri zapojení **1 a 3** nastav *On* – vypínač sa potom správa ako klasický. Ak chceš, aby sa vrátila aj posledná farba a jas, skús *Previous* (nie všetky žiarovky ho podporujú rovnako).
- Pri zapojení **4 a 5** nastav *Previous*. Po výpadku prúdu sa svetlá nerozsvietia v noci naplno po celom dome.

### Vypínač ovláda svetlo cez centrálu

Pri zapojení 4 a 5 potrebuješ automatizáciu, ktorá prepnutie vypínača preloží na príkaz pre žiarovku. Pri klasickom (nie tlačidlovom) vypínači stačí reagovať na každú zmenu stavu vstupu. Podmienky `not_from` a `not_to` zabránia, aby sa svetlo prepínalo pri reštarte Home Assistanta.

```yaml obyvacka_vypinac_svetlo.yaml
alias: Obývačka – vypínač ovláda stropné svetlo
description: Každé prepnutie vypínača prepne smart žiarovky v obývačke.
triggers:
  - trigger: state
    entity_id: binary_sensor.obyvacka_vypinac_vstup
    not_from:
      - unavailable
      - unknown
    not_to:
      - unavailable
      - unknown
actions:
  - action: light.toggle
    target:
      entity_id: light.obyvacka_strop
mode: single
```

Pri Shelly Gen3/Gen4 je vstup ako `binary_sensor` dostupný, keď je vstup v režime *Switch*. Ak je entita v integrácii vypnutá, zapni ju v nastaveniach zariadenia. Pri tlačidlách použi spúšťač zariadenia (*device trigger*) – tak dostaneš aj dvojklik a dlhé podržanie.

### Záloha bez centrály: binding

Zigbee zariadenia sa vedia prepojiť aj **priamo**, bez centrály. Volá sa to **binding**. Vstupný modul (napríklad Hue Wall Switch Module) alebo relé v režime odpojeného vstupu (Sonoff ZBMINIR2) potom posiela príkaz rovno žiarovke alebo Zigbee skupine. Ak Home Assistant nebeží, svetlo stále funguje – stačí, že beží Zigbee sieť.

V Zigbee2MQTT to nastavíš v detaile zariadenia na karte **Bind**: zdroj je vypínač, cieľ žiarovka alebo skupina, klaster `OnOff` (a voliteľne `LevelCtrl` pre stmievanie). Podpora závisí od konkrétneho modelu a verzie integrácie, preto to po nastavení vyskúšaj s vypnutým Home Assistantom.

### Zapojenie 3: najprv prúd, potom farba

Keď je žiarovka za relé a chceš ju z automatizácie rozsvietiť napríklad na nočné svetlo, musíš najprv zapnúť relé. Žiarovka sa potom pár sekúnd pripája do siete, kým začne počúvať.

```yaml nocne_svetlo_chodba.yaml
alias: Chodba – nočné svetlo
triggers:
  - trigger: state
    entity_id: binary_sensor.chodba_pohyb
    to: "on"
conditions:
  - condition: time
    after: "23:00:00"
    before: "06:00:00"
actions:
  - action: switch.turn_on
    target:
      entity_id: switch.chodba_rele_strop
  - delay: "00:00:03"   # žiarovka sa po zapnutí prúdu pripája do siete
  - action: light.turn_on
    target:
      entity_id: light.chodba_strop
    data:
      brightness_pct: 10
      color_temp_kelvin: 2200
mode: restart
```

### Viac žiaroviek v jednom svietidle

Ak má luster tri žiarovky, nedávaj im tri príkazy za sebou – rozsvecujú sa postupne ako pukance. Vytvor z nich **Zigbee skupinu** (v Zigbee2MQTT aj v ZHA). Skupina dostane jeden príkaz a všetky žiarovky zareagujú naraz.

## Na čo si dať pozor

:::warn 230 V nie je hračka
Montáž relé alebo premostenie vypínača je práca s napätím, ktoré zabíja. Vždy vypni istič a over, že vo vodičoch nie je napätie. Ak si nie si istý, zavolaj elektrikára – a nechaj mu zapojiť rovno všetky vypínače, ktoré chceš mať smart.
:::

- **Nikdy nedávaj smart žiarovku za klasický stmievač.** Stmievač jej „okresáva“ napätie, žiarovka bliká, bzučí a môže sa poškodiť. Stmievač nahraď vypínačom alebo smart modulom.
- **Nulový vodič.** Väčšina relé ho potrebuje. Bez neho existujú moduly ako Shelly 1L Gen3 alebo Sonoff ZBMINI-L2, ale pred kúpou over, či vedia režim odpojeného vstupu. S LED záťažou bez nulového vodiča môže svetlo slabo svietiť alebo blikať.
- **Hĺbka krabice.** Relé sa za vypínač musí zmestiť. Ak staviaš alebo rekonštruuješ, chci hlbšie krabice – stoja skoro rovnako.
- **Schodiskové (striedavé) vypínače.** S relé v odpojenom režime fungujú výborne – každé prepnutie hociktorého vypínača je jeden signál. Treba ich však správne zapojiť na vstup.
- **WiFi vs. Zigbee relé.** Shelly (WiFi) je pohodlné a vie skripty. Zigbee relé (Sonoff, Aqara) posilní Zigbee sieť, lebo samo robí router. Obe cesty sú dobré, vyber podľa toho, na čom staviaš.

## Jednou vetou

Smart žiarovka má byť stále pod prúdom a vypínač má byť len tlačidlo, ktoré posiela signál – a ak k tomu chceš istotu aj bez centrály, daj za vypínač **smart relé s odpojeným vstupom**.

Ak ešte nemáš centrálu, pokračuj článkom [Home Assistant pre začiatočníkov](/zacni-tu/home-assistant-pre-zaciatocnikov/) a pozri si aj [6 zásad, podľa ktorých staviam smart dom](/moj-dom/zasady-smart-domu/) – prvá z nich hovorí presne o tomto.
