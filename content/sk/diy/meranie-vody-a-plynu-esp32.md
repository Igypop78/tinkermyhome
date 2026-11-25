---
id: water-gas-esp
cover: /img/clanky/titulky/voda-plyn-sk.jpg
title: Meranie vody a plynu cez ESP32 – fakturačný vodomer a plynomer v Home Assistante za pár eur
description: Ako snímam impulzy z bežného vodomeru indukčným snímačom a z plynomeru reed snímačom, ako to zapojiť k ESP32, upevniť bez zásahu do merača a dostať spotrebu, prietok aj výkon plynu do Energy panela v Home Assistante.
section: diy
also: energy
level: 2
date: 2026-11-25
time: '21:00'
slug: meranie-vody-a-plynu-esp32
tldr: 'Meranie vody a plynu cez ESP32 vyhralo anketu, tak tu je návod. Vodomer snímam **indukčným snímačom** (každá otáčka kolieska s kovom = 1 liter), plynomer **reed snímačom** (magnet na poslednom koliesku = 0,01 m³). ESP32 impulzy počíta a do Home Assistanta posiela **spotrebu, prietok vody aj výkon plynu v kW**. Do merača nezasahuješ, súčiastky stoja **pár eur** – najviac času zaberie nájsť pre snímač správnu polohu. Mne to takto funguje **už niekoľko rokov**.'
---

V [ankete pri článku o ESP32](/diy/esp32-moje-projekty/) ste rozhodli jasne: ako prvý návod chcete **meranie vody a plynu**. Rozumiem – je to jeden z projektov s najlepším pomerom ceny a úžitku. Za pár eur máš v Home Assistante spotrebu z fakturačných meračov, prietok vody v reálnom čase a výkon, ktorým práve horí kotol.

Prečo to vôbec merať, som rozpísal v článku [Čím začať smart dom? Meraním elektriny, vody a plynu](/energia/zacni-meranim-spotreby/). Tu bude čisto prax: súčiastky, zapojenie, kód a hlavne **ako snímač pripevniť**, lebo to je tá zradná časť.

:::me Ako to mám ja
Snímam priamo **fakturačný vodomer a plynomer**. Na vodomere mám **indukčný snímač polohy**, na plynomere **reed snímač magnetického poľa**. Začínal som na doske **ESP32 DevKit (NodeMCU)**, potom som prešiel na **ESP32-C6** cez Wi-Fi a dnes mi to beží v **Zigbee** sieti. Zigbee verziu tu neriešim – návod je pre Wi-Fi a ESPHome. Takto merané mi to funguje **už niekoľko rokov**.
:::

## Ako meranie vody a plynu cez ESP32 funguje

Oba merače majú vo vnútri **otáčajúce sa koliesko**. Ty ho nemusíš otvárať ani rozoberať – stačí zvonka zachytiť, **kedy sa otočí**:

- **Vodomer** má (väčšinou) koliesko s **kovovou plôškou**. Indukčný snímač zachytí kov, keď prejde pod ním. U mňa je **1 otáčka = 1 liter**.
- **Plynomer** má na poslednom koliesku počítadla **magnet**. Reed snímač zachytí jeho pole. Na mojom plynomere je **1 otáčka = 0,01 m³** (výrobca to píše priamo na štítok, napr. „1 imp. = 0,01 m³“).

ESP32 každý impulz pripočíta k počítadlu, z času medzi impulzmi vypočíta prietok a všetko pošle cez Wi-Fi do Home Assistanta.

![Princíp: vodomer → indukčný snímač → logický konvertor → ESP32; plynomer → reed modul → ESP32; ESP32 → Home Assistant → Energy panel](/img/clanky/voda-plyn-princip-sk.svg)

## Čo potrebuješ

- **ESP32** – ja som začínal na klasickej doske **ESP32 DevKit (NodeMCU)**, kód nižšie je pre ňu. Viac o variantoch ESP32 nájdeš v [článku o ESP32](/diy/esp32-moje-projekty/#ktore-esp-si-kupit).
- **Indukčný snímač polohy**, ktorý pracuje už od **5 V** (na vodu).
- **Logický konvertor 5 V / 3,3 V** (na vodu).
- **Reed modul** – snímač magnetického poľa (na plyn).
- **USB zdroj 5 V** pre ESP, káble a kábliky, spájkovačka.
- **Trpezlivosť.** Myslím to vážne – zapojenie je otázka hodiny, nájsť správnu polohu snímača môže trvať dni.

Spolu ma voda aj plyn stáli zhruba **30 €**.

## Meranie vody

### Zisti, aký máš vodomer

Toto sprav ako prvé, ešte pred nákupom. **Štandardné fakturačné vodomery** majú v číselníku malé koliesko, ktoré má časť plochy **kovovú**. Na tvojom vodomere to tak byť nemusí.

![Fakturačný vodomer Sensus s otvoreným vekom – číselník s ručičkami a malými kolieskami](/img/clanky/voda-plyn-vodomer.jpg)

Ak koliesko s kovom máš, zisti, **koľko litrov je jedna otáčka** – 1 l, 10 l…? Ak to nevieš vyčítať z číselníka alebo z dokumentácie vodomeru, natoč napríklad 10 litrov do vedra a spočítaj otáčky. U mňa je to **1 liter**. Toto číslo budeš potrebovať v kóde.

:::tip Vodomer s impulzným výstupom
Niektoré vodomery majú **pripravený impulzný výstup** (kábel alebo miesto na nasadenie snímača od výrobcu). Je to skôr zriedkavé, ale ak ho máš, ušetríš si celé ladenie polohy – výstup zapojíš rovno ako snímač.
:::

### Vyskúšaj indukčný snímač

Indukčný snímač má **tri vodiče**: plus, mínus a signál. Funguje jednoducho – keď má **v blízkosti kovový predmet**, zopne (alebo rozopne) a na signálnom vodiči sa objaví (alebo zmizne) napätie. Či zopne, alebo rozopne, záleží na verzii – **NO** (normálne otvorený) alebo **NC** (normálne zatvorený). Typ výstupu býva na štítku snímača.

Každé zopnutie = jedna otáčka kolieska = u mňa **1 liter**.

![Indukčný snímač polohy s káblom – na konci má kontrolku, ktorá svieti pri kove](/img/clanky/voda-plyn-indukcny-snimac.jpg)

Než čokoľvek spájkuješ, vyskúšaj ho: pripoj snímač na **5 V** a prilož k nemu kovový predmet (kľúč, skrutkovač). **Kontrolka na snímači by sa mala rozsvietiť.** Ak áno, snímač je v poriadku.

### Prečo logický konvertor

ESP32 síce môžeš napájať z 5 V, ale jeho **vstupy (GPIO) znesú len 3,3 V**. Signál zo snímača má 5 V, preto medzi ne patrí „redukcia“ – **logický konvertor 5 V / 3,3 V**. Tu si to vyžiada trochu spájkovania, ale dá sa to.

![Logický konvertor 5 V / 3,3 V – strana HV pre 5 V, strana LV pre 3,3 V, dva kanály](/img/clanky/voda-plyn-konvertor.jpg)

Na strane **HV** je 5 V svet (snímač), na strane **LV** 3,3 V svet (ESP). Signál zo snímača zapojíš na vstup kanála na strane HV a z výstupu **toho istého kanála** na strane LV ideš na pin ESP. Na doske z fotky je to smer **RXI → RXO** (zelená a modrá šípka idú z 5 V do 3,3 V).

:::warn Bez konvertora riskuješ ESP
Chvíľu mi to bežalo aj bez konvertora a fungovalo to. Lenže 5 V na vstupe ESP je mimo špecifikácie a môžeš si ESP **odpáliť**. Konvertor stojí pár centov – nevynechávaj ho.
:::

### Zapojenie

![Zapojenie: indukčný snímač (hnedý +5 V, modrý GND, čierny signál) cez logický konvertor na GPIO27 ESP32; reed modul (+ 3,3 V, G, D0) priamo na GPIO14](/img/clanky/voda-plyn-zapojenie-sk.svg)

- **Snímač:** plus na 5 V, mínus na GND, signál na **HV** vstup konvertora. Farby vodičov býva hnedý (+), modrý (−), čierny (signál) – over si to na štítku.
- **Konvertor:** HV na **5 V** (pin 5V alebo VIN na ESP), LV na **3,3 V** (pin 3V3), GND na GND.
- **Výstup konvertora** (LV strana) na zvolený pin ESP – v mojom kóde **GPIO27**.

:::info Ktorý pin si vybrať
Na doske ESP32 DevKit sú na vstup s vnútorným pull-up rezistorom bezpečné napríklad **GPIO 13, 14, 16–19, 21–23, 25–27, 32 a 33**. Vyhni sa pinom **0, 2, 5, 12 a 15** (ovplyvňujú štart ESP), **6–11** (pamäť) a **34–39** (nemajú vnútorný pull-up). Pôvodne som mal vodu na GPIO5 a ESPHome ma pri každom nahratí varoval – preto je v kóde nižšie GPIO27.
:::

### Ako snímač pripevniť k vodomeru

Toto je tá **zradná vec**. A jedno pravidlo na začiatok:

:::warn Do vodomeru fyzicky nezasahuj
Vodomer je fakturačné meradlo – nevŕtaj doň, nelep nič dovnútra, neodstraňuj plomby. Konštrukcia musí byť **neinvazívna**: snímač len prilieha zvonka na sklíčko a držiak sa uchytí okolo vodomeru alebo potrubia.
:::

![Umiestnenie snímačov: indukčný snímač kolmo na sklíčku priamo nad kolieskom s kovom, držiak okolo vodomeru; reed trubička v priehlbine pod posledným kolieskom plynomera, u mňa kolmo](/img/clanky/voda-plyn-umiestnenie-sk.svg)

Či použiješ **3D tlač** alebo **kovovú konzolu**, je na tebe. Dôležité je, aby sa snímač **dotýkal priamo sklíčka nad kolieskom** a bol presne nad ním.

1. Snímač nastav do polohy, v ktorej **kontrolka svieti** (kovová plôška je pod ním).
2. Pusti vodu a sleduj, či kontrolka **bliká** – zhasne a rozsvieti sa pri každej otáčke.
3. Ak bliká spoľahlivo aj pri slabom aj pri silnom prúde vody, máš to.

Mne toto ladenie chvíľu trvalo, tak tomu daj čas. Posun o milimeter robí rozdiel.

:::tip Snímač nechytá signál?
Indukčné snímače majú pri 5 V kratší dosah, než pri vyššom napätí. Ak kov cez sklíčko nevieš „chytiť“, môže pomôcť **vyššie napájanie (napr. 12 V)**. Potom však potrebuješ pre snímač **samostatný zdroj** a **logický konvertor, ktorý zvládne 12 V** – bežný 5 V / 3,3 V konvertor nestačí.
:::

## Meranie plynu

### Magnet v poslednom koliesku

Väčšina plynomerov má na **poslednom koliesku počítadla magnet**. A pod touto časťou býva zospodu **priehlbina**, kam sa zmestí snímač – výrobcovia počítajú s tým, že niekto bude impulzy odčítavať.

![Plynomer Elster BK-G4 – na štítku „1 imp. = 0,01 m³“, posledné koliesko počítadla je zvýraznené](/img/clanky/voda-plyn-plynomer.jpg)

Originálny snímač od výrobcu si môžeš kúpiť, alebo si ho vyrobiť. Princíp je rovnaký ako pri vode – odčítať každú otáčku kolieska. Len snímač je iný: **mne funguje reed snímač**.

### Reed modul

Reed snímač je sklenená trubička s dvoma kontaktmi, ktoré sa pri magnete spoja. Na module má tiež **tri vodiče** (+, −, signál) a výhoda je, že pri napájaní z 3,3 V dáva **výstup rovno 3,3 V**. Konvertor tu teda nepotrebuješ.

![Reed modul so sklenenou trubičkou, potenciometrom a štyrmi vývodmi A0, G, +, D0](/img/clanky/voda-plyn-reed-modul.jpg)

Zapojenie: **+ na 3V3**, **G na GND**, **D0 na zvolený pin** – v mojom kóde **GPIO14** (pozri schému vyššie). Vývod A0 (analógový) nepotrebuješ.

### Čo som spravil inak

- Zo samotnej dosky modulu som **opatrne odspájkoval sklenenú trubičku** (ľahko sa láme!) a pripojil ju na **dlhší káblik**.
- **Dosku modulu som dal za plynomer** a do priehlbiny na odpočet som dal **len samotnú trubičku**.
- Najspoľahlivejšie mi fungovala, keď som ju dal **nie vodorovne s kolieskom, ale paradoxne kolmo**. Nedávalo mi to zmysel, ale funguje to. Tak sa aj ty pohraj s polohou.

Trubička je ľahká, takže ju môžeš **prilepiť páskou** alebo si vytlačiť **držiak na 3D tlačiarni**. Zvyšok je 1 : 1 ako pri vode: vybrať pin, upraviť kód, nahrať a testovať.

## Kód pre ESPHome

Postup, ako nahrať kód do ESP a ako ESP dostať do Home Assistanta, nájdeš na internete – návodov je spústa a nemá zmysel robiť ďalší. Stručne je to aj v [článku o ESP32](/diy/esp32-moje-projekty/). A ak sa na to necítiš, pokojne použi **AI asistenta** – pokaziť toho veľa nemôžeš.

V kóde zmeň hlavne časť `substitutions` na začiatku:

- **piny**, na ktoré si snímače zapojil,
- **koľko m³ je jeden impulz** (voda 1 l = `0.001`, plyn podľa štítka, u mňa `0.01`),
- **koeficient pre plyn** v kWh na m³ – ja mám 11; presnú hodnotu (spaľovacie teplo) nájdeš na faktúre od dodávateľa plynu.

Wi-Fi a heslá patria do súboru `secrets.yaml`, nie priamo do kódu. Ak ti ESPHome pri vytváraní zariadenia vygeneroval v sekcii `api:` šifrovací kľúč (`encryption: key:`), nechaj ho tam.

```yaml voda-plyn.yaml
substitutions:
  name: esp-voda-plyn
  friendly_name: Voda a plyn
  # Piny – zmeň podľa toho, kam si snímače zapojil
  pin_voda: GPIO27        # vodomer (výstup logického konvertora)
  pin_plyn: GPIO14        # plynomer (D0 reed modulu)
  # Koľko m³ je jeden impulz
  impulz_voda: "0.001"    # 1 otáčka = 1 liter
  impulz_plyn: "0.01"     # podľa štítka plynomera
  # Prepočet plynu na energiu (spaľovacie teplo z faktúry)
  kwh_na_m3: "11.0"

esphome:
  name: ${name}
  friendly_name: ${friendly_name}
  comment: Meranie vody a plynu (+ Bluetooth proxy)
  min_version: 2024.6.0
  name_add_mac_suffix: false

esp32:
  board: esp32dev
  framework:
    type: esp-idf

logger:

api:

ota:
  - platform: esphome

improv_serial:

wifi:
  fast_connect: true
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  ap:
    ssid: "ESP Voda Plyn"
    password: !secret ap_password

captive_portal:

web_server:

# Nepovinné: ESP popri meraní slúži aj ako Bluetooth proxy pre Home Assistant
esp32_ble_tracker:
  scan_parameters:
    active: true

bluetooth_proxy:
  active: true

button:
  - platform: safe_mode
    name: Safe Mode Boot
  - platform: factory_reset
    name: Factory reset

# =====================
# POČÍTADLÁ (stav meračov)
# Viditeľné v HA v konfigurácii zariadenia – raz nastavíš podľa merača
# =====================
number:
  - platform: template
    name: Stav vodomeru
    id: water_meter
    entity_category: config
    mode: box
    min_value: 0
    max_value: 10000000
    step: ${impulz_voda}
    restore_value: true
    optimistic: true
    unit_of_measurement: "m³"
    icon: "mdi:water"

  - platform: template
    name: Stav plynomeru
    id: gas_meter
    entity_category: config
    mode: box
    min_value: 0
    max_value: 10000000
    step: ${impulz_plyn}
    restore_value: true
    optimistic: true
    unit_of_measurement: "m³"
    icon: "mdi:fire"

# =====================
# GLOBÁLNE PREMENNÉ
# =====================
globals:
  - id: last_water_reading
    type: float
    restore_value: no
    initial_value: '-1.0'     # -1 = po štarte ešte nemáme porovnanie

  - id: water_flow_lpm
    type: float
    restore_value: no
    initial_value: '0.0'

  - id: last_gas_pulse_time
    type: uint32_t
    restore_value: no
    initial_value: '0'

  - id: gas_flow_m3h
    type: float
    restore_value: no
    initial_value: '0.0'

# =====================
# IMPULZY ZO SNÍMAČOV
# V HA ich vidíš ako binárne senzory – hodí sa na prvý test
# =====================
binary_sensor:
  - platform: gpio
    name: Impulz voda
    pin:
      number: ${pin_voda}
      mode: INPUT_PULLUP
    filters:
      - delayed_on: 50ms
      - delayed_off: 50ms
    on_press:
      then:
        - number.increment:
            id: water_meter
            cycle: true

  - platform: gpio
    name: Impulz plyn
    pin:
      number: ${pin_plyn}
      mode: INPUT_PULLUP
    filters:
      - delayed_on: 50ms
      - delayed_off: 50ms
    on_press:
      then:
        - number.increment:
            id: gas_meter
            cycle: true
        - lambda: |-
            uint32_t now = millis();
            if (id(last_gas_pulse_time) > 0) {
              float dt_h = (now - id(last_gas_pulse_time)) / 3600000.0;  // čas medzi impulzmi v hodinách
              if (dt_h > 0) {
                id(gas_flow_m3h) = ${impulz_plyn} / dt_h;               // m³/h
              }
            }
            id(last_gas_pulse_time) = now;

# =====================
# SENZORY DO HOME ASSISTANTA
# =====================
sensor:
  - platform: template
    name: Voda spotreba
    id: water_total
    unit_of_measurement: "m³"
    accuracy_decimals: 3
    device_class: water
    state_class: total_increasing
    lambda: return id(water_meter).state;
    update_interval: 15s

  - platform: template
    name: Voda prietok
    id: water_flow
    unit_of_measurement: "L/min"
    device_class: volume_flow_rate
    state_class: measurement
    accuracy_decimals: 1
    lambda: return id(water_flow_lpm);
    update_interval: 15s

  - platform: template
    name: Plyn spotreba
    id: gas_total
    unit_of_measurement: "m³"
    accuracy_decimals: 2
    device_class: gas
    state_class: total_increasing
    lambda: return id(gas_meter).state;
    update_interval: 15s

  - platform: template
    name: Plyn prietok
    id: gas_flow
    unit_of_measurement: "m³/h"
    device_class: volume_flow_rate
    state_class: measurement
    accuracy_decimals: 3
    lambda: return id(gas_flow_m3h);
    update_interval: 10s

  - platform: template
    name: Plyn výkon
    id: gas_power
    unit_of_measurement: "kW"
    device_class: power
    state_class: measurement
    accuracy_decimals: 2
    force_update: true
    lambda: return id(gas_flow_m3h) * ${kwh_na_m3};   // m³/h × kWh/m³ = kW
    update_interval: 10s

# =====================
# PRIEBEŽNÉ VÝPOČTY
# =====================
interval:
  # Prietok vody – rozdiel stavu za 15 s prepočítaný na litre za minútu
  - interval: 15s
    then:
      - lambda: |-
          float current = id(water_meter).state;
          if (isnan(current)) return;
          if (id(last_water_reading) < 0) {          // prvý beh po štarte – len si zapamätaj stav
            id(last_water_reading) = current;
            return;
          }
          float flow = (current - id(last_water_reading)) * 4.0 * 1000.0;  // m³ za 15 s → L/min
          id(water_flow_lpm) = flow > 0 ? flow : 0;  // ručná zmena stavu nadol nedá záporný prietok
          id(last_water_reading) = current;

  # Plyn – keď 3 minúty nepríde impulz, prietok a výkon sú 0
  - interval: 60s
    then:
      - lambda: |-
          if (id(last_gas_pulse_time) > 0) {
            float minutes_since_last = (millis() - id(last_gas_pulse_time)) / 60000.0;
            if (minutes_since_last > 3.0) {
              id(gas_flow_m3h) = 0.0;
            }
          }
```

A do `secrets.yaml` v ESPHome:

```yaml secrets.yaml
wifi_ssid: "NazovTvojejSiete"
wifi_password: "HesloKWiFi"
ap_password: "HesloNaZalozneWiFiESP"
```

:::info Čo som v kóde upravil oproti verzii, ktorá mi bežala
- **Heslo záložnej Wi-Fi** (`ap:`) je v `secrets.yaml` – v mojom pôvodnom kóde bolo priamo v texte.
- **Prietok vody po reštarte** – ESP si po štarte pamätalo predchádzajúci stav 0, takže prvý výpočet ukázal nezmyselne obrovský prietok. Teraz si prvý stav len zapamätá.
- **Voda z GPIO5 na GPIO27** – GPIO5 ovplyvňuje štart ESP.
- **Počítadlá sú viditeľné v HA** – predtým boli skryté (`internal: true`) a nedalo sa nastaviť začiatočný stav podľa merača.
- **Prietok plynu v m³/h** namiesto m³/min a prietok vody v **L/min** – jednotky, ktoré Home Assistant pozná. Výkon plynu vychádza rovnako.
:::

## Prvý test

Keď je kód nahratý a zariadenie vidíš v Home Assistante, je čas na prvý test – ešte **na stole**, nie na merači:

1. Otvor zariadenie v HA a nájdi **Impulz voda** a **Impulz plyn**.
2. Ku indukčnému snímaču prikladaj **kovový predmet**, k reed snímaču **magnet**.
3. Impulz by sa mal prepínať a **Voda spotreba** pribudnúť o 0,001 m³ (**Plyn spotreba** o 0,01 m³) pri každom priložení.

Ak áno, máš to. Až potom snímače montuj na merače a lad polohu.

## Home Assistant a Energy panel

V Home Assistante uvidíš tieto senzory:

| Senzor | Čo ukazuje |
|---|---|
| **Voda spotreba** | celkový stav v m³ |
| **Voda prietok** | aktuálny prietok v L/min (počíta sa každých 15 s) |
| **Plyn spotreba** | celkový stav v m³ |
| **Plyn prietok** | aktuálny prietok v m³/h |
| **Plyn výkon** | výkon, ktorým práve horí kotol, v kW |

Môžeš si vytvoriť pomocníkov, napríklad spotrebu za deň. Ale ak senzory **Voda spotreba** a **Plyn spotreba** pridáš do **Energy panela**, spraví to za teba – dennú, týždennú aj mesačnú spotrebu. A keď v nastaveniach Energy panela zadáš aj **cenu za m³** (pri vode vodné + stočné), uvidíš spotrebu rovno **v eurách**.

![Spotreba vody v Energy paneli za október 2026 – stĺpec za každý deň, spolu 17,81 m³](/img/clanky/voda-plyn-ha-spotreba-oktober.png)

![Súhrn vody za október 2026 v Energy paneli: 17,81 m³ za 58,32 €](/img/clanky/voda-plyn-ha-naklady-oktober.png)

U nás to v októbri bolo **17,81 m³ vody za 58,32 €**. Pekne vidno aj dni, keď sa niečo dialo navyše – 13. októbra skoro 1,6 m³.

:::tip Ako nastaviť stav podľa merača
Ak chceš, aby číslo v HA sedelo s vodomerom, nastav **Stav vodomeru** (a **Stav plynomeru**) v konfigurácii zariadenia raz ručne podľa merača – najlepšie **hneď po prvom spustení**. Energy panel tento skok môže započítať ako spotrebu v danej hodine. Opravíš ho v **Nástrojoch pre vývojárov na karte Štatistiky** (úprava súčtu pri entite). Ak ti stačí len spotreba, nastavovať nemusíš – Energy panel počíta rozdiely.
:::

## Na čo si dať pozor

- **Nezasahuj do merača.** Snímač len prilieha zvonka, držiak drží okolo.
- **5 V nikdy priamo na pin ESP.** Vodu vždy cez logický konvertor.
- **Občas porovnaj HA s meračom.** Ak sa po pár dňoch rozchádzajú, snímač niektoré otáčky nezachytí (alebo zachytí dvakrát) – treba doladiť polohu.
- **Výpadok prúdu.** Stav sa ukladá do pamäte ESP (ESPHome predvolene raz za minútu), takže po výpadku môžeš prísť najviac o impulzy z poslednej minúty. A kým ESP nebeží, impulzy sa nepočítajú vôbec.
- **Malý odber plynu.** Výkon sa počíta z času medzi impulzmi a po 3 minútach bez impulzu spadne na 0. Pri 0,01 m³ na impulz to znamená, že odber pod približne 2 kW (0,2 m³/h) sa ukáže ako 0 – spotreba sa však započíta správne.
- **Prietok vody v krokoch.** Pri 1 litri na impulz a výpočte každých 15 s je najmenší krok 4 L/min. Na sledovanie spotreby a únikov to stačí.

:::tip Nechce sa ti babrať s ESP?
Na plyn sa dá použiť aj obyčajný **dverový senzor**. U mňa takto fungoval **dverový senzor Aqara 2 sezóny**. Aby som ho dostal do priestoru na odpočet, musel som ho vybrať z plastového obalu, prípadne odspájkovať reed snímač a dať ho na predĺžený káblik. Je to batériové riešenie a na jednu batériu vydržal prekvapivo dlho – **vyše roka**. Každá otáčka = otvorenie a zatvorenie „dverí“, v HA potom počítaš zmeny stavu.
:::

## Výsledok

Je to trochu hrania – hlavne s polohou snímačov. Ale za **pár eur** máš **spoľahlivé meranie** priamo z fakturačných meračov, prietok vody v reálnom čase (na odhalenie úniku vody ideálne) a výkon kotla v kW. Mne to takto funguje už niekoľko rokov.

Ak sa niekde zasekneš alebo máš iný typ vodomeru či plynomeru, [napíš mi](/o-mne/) – rád pomôžem. A ak chceš vedieť, čo s nameranými číslami robiť ďalej, pozri [Čím začať smart dom? Meraním elektriny, vody a plynu](/energia/zacni-meranim-spotreby/).
