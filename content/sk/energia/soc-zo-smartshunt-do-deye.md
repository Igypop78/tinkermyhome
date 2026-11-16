---
id: deye-soc
cover: /img/clanky/titulky/deye-soc.jpg
title: Presné SOC v meniči Deye – Victron SmartShunt cez ESP32 za 24 €
description: Ako som dostal presný stav nabitia batérie z Victron SmartShuntu do meniča Deye cez ESP32 a CAN zbernicu – zapojenie kábla, párovanie so SmartShuntom a hotový kód pre ESPHome.
section: energy
level: 2
date: 2026-11-16
time: '20:00'
slug: soc-zo-smartshunt-do-deye
tldr: 'BMS v mojich batériách po týždňoch bez nabitia na 100 % **ukazovali SOC, ktoré nesedelo s realitou**. Presne meria až **Victron SmartShunt** – lenže ten sa s meničom Deye nevie rozprávať. Vyriešila to doska **Waveshare ESP32-S3-RS485-CAN za 24 €**: cez Bluetooth číta SmartShunt, tvári sa ako batéria **Pylontech** a posiela meniču údaje cez **CAN**. Deye tak beží v režime **Lithium** s presným SOC. Nižšie je zapojenie, párovanie aj kód na skopírovanie.'
---

Od začiatku mojej FVE riešim jednu vec: **ako dostať do meniča správny stav nabitia batérie (SOC)**.

Batérie mám vlastné, LiFePO4 s **JK BMS**. JK BMS vie protokol **Pylontech**, takže poslať SOC z BMS do meniča sa dá. Lenže to číslo nebolo spoľahlivé – hlavne v zime.

## Prečo SOC z BMS nesedí

BMS počíta SOC tak, že sčítava prúd, ktorý do batérie vtečie a vytečie. Malá chyba merania sa každý deň pripočíta k ďalšej. Opraví sa až vtedy, keď batéria dosiahne **100 %** – BMS vtedy vie s istotou, že je plná, a počítadlo vynuluje.

Lenže v zime sa batéria na 100 % dostane len málokedy. Po pár týždňoch **mal údaj o SOC s realitou málo spoločné**. Je to známy problém lacnejších BMS – ich meranie prúdu jednoducho nie je na toto stavané.

## Ako to riešiť – štyri cesty

| Spôsob | Ako to funguje | Háčik |
|---|---|---|
| **SOC z BMS cez CAN/RS485** | BMS posiela meniču SOC v protokole Pylontech, menič beží v režime Lithium | SOC sa bez nabitia na 100 % rozchádza s realitou |
| **Menič si počíta SOC sám (režim %)** | Deye odhaduje SOC z vlastného merania napätia a prúdu | tiež nepresné, chyba sa časom nazbiera |
| **Napäťový režim + Home Assistant** | menič riadi batériu podľa napätia, HA na pozadí prepína nastavenia podľa SmartShuntu | zložité, HA musí stále bežať, menič sám „nevie“, koľko v batérii je |
| **SmartShunt → ESP32 → menič** | ESP prečíta SmartShunt a meniču sa tvári ako batéria Pylontech | treba ESP a pár minút zapájania – tento článok |

Na Deye som preto režim Lithium nepoužíval. Najprv som mal režim **podľa percent**, v ktorom si SOC počíta menič sám – ani to však nebolo presné.

Potom som objavil **Victron SmartShunt**. Zapojí sa do mínusu medzi batériu a menič a veľmi presne meria prúd, napätie a výkon. A samozrejme SOC – a ten bol **prekvapivo presný aj po niekoľkých týždňoch**, keď sa batéria plne nenabila.

Háčik: SmartShunt je stavaný pre systém Victron. Pripája sa cez rozhranie **VE.Direct**, dá sa čítať aj cez **Bluetooth** – ale menič Deye mu nerozumie.

Prvé riešenie bolo cez Home Assistant. Na meniči som mal batériu v **napäťovom režime (V)** a o tom, kedy prestať batériu vybíjať alebo nabíjať, rozhodoval HA podľa SmartShuntu – na pozadí menil nastavenia meniča. Fungovalo to, ale bola to obchádzka.

Nedalo mi to. Keďže mi AI už pomohla vyriešiť veľa vecí, spýtal som sa, ako dostať údaje zo SmartShuntu priamo do Deye. Odpoveď aj realizácia boli **prekvapivo rýchle a lacné**.

:::me Ako to mám ja
Menič **Deye SUN-10K-SG04LP3-EU**, batéria LiFePO4 ~34 kWh (2 × 280 Ah + 1 × 105 Ah, každá s vlastnou JK BMS) a celú banku meria jeden **Victron SmartShunt 300 A**. SmartShunt je pre mňa zdroj pravdy – riadi sa podľa neho aj moja [AI Energy](/projekty/ai-energy/). JK BMS ostali v batériách ako ochrana a ich údaje čítam do HA cez Bluetooth.
:::

## Čo potrebuješ

- **Victron SmartShunt** zapojený v mínuse batérie (ja mám verziu 300 A / 50 mV),
- **Waveshare ESP32-S3-RS485-CAN** – priemyselná doska na DIN lištu s CAN aj RS485, napájanie 7–36 V. Stála ma **24 €**,
- **kus LAN kábla** s konektorom RJ45 na jednom konci,
- **ESPHome** (doplnok v Home Assistante alebo v prehliadači) a USB-C kábel na prvé nahratie.

Doska číta údaje zo SmartShuntu cez Bluetooth, **prekladá ich do štandardu Pylontech** a posiela ich cez CAN do meniča. Napája sa priamo z **12 V výstupu na svorkovnici Deye**, takže nepotrebuje vlastný zdroj.

## Ako zapojiť kábel

![Schéma zapojenia SmartShunt → ESP32-S3 → Deye](/img/clanky/deye-soc-zapojenie-sk.svg)

1. **Kábel do meniča.** Vezmi LAN kábel (zapojenie T568B), na jednom konci nechaj konektor RJ45 a ten zastrč do portu **BMS** na Deye. Druhý koniec odstrihni. Ostatné vodiče nezapájaj a zaizoluj.
2. **CAN.** Použiješ len dva vodiče:
   - pin **4 – modrý** → svorka **H** (CAN-H) na doske Waveshare,
   - pin **5 – bielo-modrý** → svorka **L** (CAN-L).
3. **Terminácia.** Na doske Waveshare zapni **jumper 120 Ω**. ESP je na konci CAN zbernice a bez terminácie komunikácia nemusí fungovať spoľahlivo.
4. **Napájanie.** Zo **12 V výstupu na svorkovnici Deye** priveď + a − do svoriek napájania dosky (DC 7–36 V).

:::warn Pracuj pri vypnutom meniči
Svorkovnica s 12 V výstupom je vo vnútri meniča, kde sú aj nebezpečné napätia z batérie, panelov a siete. Pred otvorením menič vypni (AC, FVE aj batériu) a počkaj, kým sa vybijú kondenzátory. Ak si nie si istý, nechaj to urobiť elektrikára.
:::

## Ako spárovať ESP so SmartShuntom

SmartShunt vysiela údaje cez Bluetooth **šifrovane**. ESP na ich čítanie potrebuje dve veci: **MAC adresu** SmartShuntu a **šifrovací kľúč** (bindkey). Obe nájdeš v aplikácii **VictronConnect**:

1. Pripoj sa v aplikácii k SmartShuntu.
2. Ťukni na **ozubené koliesko** (nastavenia) a potom na **tri bodky** vpravo hore → **Product info**.
3. Zapni **Instant readout via Bluetooth**.
4. Pri **Instant readout details** ťukni na **Show** – zobrazí sa MAC adresa a šifrovací kľúč.

Obe hodnoty si ulož do súboru `secrets.yaml` v ESPHome – **MAC zapíš bez dvojbodiek, malými písmenami**:

```yaml secrets.yaml
wifi_ssid: "MojaWiFi"
wifi_password: "heslo-k-wifi"
smartshunt_mac: "aabbccddeeff"
smartshunt_bindkey: "sem-vloz-32-znakovy-kluc-z-aplikacie"
```

:::tip Kľúč nikomu neposielaj
Kto má šifrovací kľúč, číta údaje z tvojej batérie. Do fór, na GitHub ani do správ pre AI ho nedávaj – preto je v `secrets.yaml`, nie priamo v kóde.
:::

## Kód pre ESPHome

Toto je konfigurácia, ktorá mi beží. Komponent [victron_ble](https://github.com/Fabian-Schmidt/esphome-victron_ble) číta SmartShunt a každú sekundu odchádza do Deye päť správ v protokole Pylontech.

```yaml esp-can.yaml
esphome:
  name: esp-can
  friendly_name: ESP CAN
  min_version: 2026.4.0
  name_add_mac_suffix: false

esp32:
  variant: esp32s3
  framework:
    type: esp-idf

external_components:
  - source: github://Fabian-Schmidt/esphome-victron_ble

logger:
  level: DEBUG

api:

ota:
  - platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

esp32_ble_tracker:

victron_ble:
  - mac_address: !secret smartshunt_mac
    bindkey: !secret smartshunt_bindkey
    id: my_shunt

sensor:
  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_voltage
    id: shunt_voltage
    name: "SmartShunt Napätie"

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_current
    id: shunt_current
    name: "SmartShunt Prúd"

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: state_of_charge
    id: shunt_soc
    name: "SmartShunt SOC"

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_power
    id: shunt_power
    name: "SmartShunt Výkon"

canbus:
  - platform: esp32_can
    id: deye_can
    can_id: 0
    tx_pin: GPIO15
    rx_pin: GPIO16
    bit_rate: 500kbps

interval:
  - interval: 1s
    then:
      - lambda: |-
          if (id(shunt_voltage).has_state() && id(shunt_soc).has_state() && id(shunt_current).has_state()) {
            // 1. CAN ID 0x351 - Limity (CVL 56.8V, CCL 200A, DCL 200A, DVL 47.0V)
            uint16_t cvl = 568;
            uint16_t ccl = 2000;
            uint16_t dcl = 2000;
            uint16_t dvl = 470;

            std::vector<uint8_t> data1 = {
              uint8_t(cvl & 0xFF), uint8_t((cvl >> 8) & 0xFF),
              uint8_t(ccl & 0xFF), uint8_t((ccl >> 8) & 0xFF),
              uint8_t(dcl & 0xFF), uint8_t((dcl >> 8) & 0xFF),
              uint8_t(dvl & 0xFF), uint8_t((dvl >> 8) & 0xFF)
            };
            id(deye_can)->send_data(0x351, false, data1);

            // 2. CAN ID 0x355 - SOC a SOH
            uint16_t soc = (uint16_t)(id(shunt_soc).state);
            uint16_t soh = 100;

            std::vector<uint8_t> data5 = {
              uint8_t(soc & 0xFF), uint8_t((soc >> 8) & 0xFF),
              uint8_t(soh & 0xFF), uint8_t((soh >> 8) & 0xFF),
              0, 0, 0, 0
            };
            id(deye_can)->send_data(0x355, false, data5);

            // 3. CAN ID 0x356 - Reálne hodnoty (Napätie, Prúd, Teplota)
            uint16_t real_voltage = (uint16_t)(id(shunt_voltage).state * 100.0);
            int16_t real_current = (int16_t)(id(shunt_current).state * 10.0);
            int16_t real_temp = 250;

            std::vector<uint8_t> data6 = {
              uint8_t(real_voltage & 0xFF), uint8_t((real_voltage >> 8) & 0xFF),
              uint8_t(real_current & 0xFF), uint8_t((real_current >> 8) & 0xFF),
              uint8_t(real_temp & 0xFF), uint8_t((real_temp >> 8) & 0xFF),
              0, 0
            };
            id(deye_can)->send_data(0x356, false, data6);

            // 4. CAN ID 0x359 - Alarmy (všetko OK)
            std::vector<uint8_t> data9 = {0, 0, 0, 0, 0, 0, 0, 0};
            id(deye_can)->send_data(0x359, false, data9);

            // 5. CAN ID 0x35E - Identifikátor batérie
            std::vector<uint8_t> dataE = {'P', 'Y', 'L', 'O', 'N', ' ', ' ', ' '};
            id(deye_can)->send_data(0x35E, false, dataE);
          }
```

Prvýkrát nahraj firmvér cez USB-C, ďalšie zmeny už idú cez WiFi. Senzory SmartShuntu sa zároveň objavia v Home Assistante – nepotrebuješ teda žiadnu ďalšiu integráciu pre Victron.

### Čo sa posiela do Deye

| CAN ID | Obsah | Moje hodnoty |
|---|---|---|
| `0x351` | limity batérie | nabíjacie napätie 56,8 V, nabíjanie aj vybíjanie max. 200 A, spodné napätie 47,0 V |
| `0x355` | stav nabitia | SOC zo SmartShuntu, zdravie (SOH) 100 % |
| `0x356` | merané hodnoty | napätie a prúd zo SmartShuntu, teplota pevne 25 °C |
| `0x359` | alarmy a ochrany | všetko v poriadku |
| `0x35E` | výrobca | `PYLON` |

Limity si prispôsob svojej batérii. Ja mám prúd nastavený na **200 A**, aby Deye mohol batériu nabíjať zo siete plným výkonom **10 kW** – pri arbitráži so spotom to potrebujem.

## Nastavenie Deye

V nastaveniach batérie na meniči prepni:

- **typ batérie: Lithium**,
- **protokol: 00** (Pylontech CAN).

Do minúty by sa na displeji mal objaviť SOC a údaje o batérii. Ak nie, skontroluj prehodené H a L, jumper 120 Ω a či v logu ESPHome vidíš údaje zo SmartShuntu.

## Na čo si dať pozor

- **Ochranu stále robí BMS.** ESP posiela meniču vždy „všetko OK“ a pevné limity. O prepätí, podpätí či teplote článkov menič nevie nič – to stráži JK BMS v každej batérii. Bez funkčnej BMS takéto riešenie nepoužívaj.
- **Teplota je pevná.** Deye dostáva stále 25 °C. Ak máš batériu v nevykurovanej garáži, nabíjanie pri mraze musí zastaviť BMS.
- **Výpadok Bluetooth.** Keď ESP prestane prijímať údaje zo SmartShuntu, posiela meniču ďalej posledné známe hodnoty. U mňa to zatiaľ istí BMS – keby sa napätie článkov dostalo mimo bezpečného rozsahu, batériu odpojí. Poistku priamo v ESP (prestať posielať, keď sú údaje staré) plánujem doplniť.
- **Iné meniče.** Rovnako by to malo fungovať s každým meničom, ktorý podporuje batérie Pylontech cez CAN (napríklad GoodWe, Growatt, Solis). Pinout portu BMS si však over v návode svojho meniča.

## Výsledok

Deye má konečne **presný SOC** a beží v režime **Lithium** – bez obchádzok cez napäťový režim a bez toho, aby Home Assistant musel na pozadí neustále meniť nastavenia meniča. **Zariadenie za 24 € mi vyriešilo problém, ktorý som dovtedy musel pracne obchádzať.**

Ďalšie projekty na ESP32 nájdeš v článku [ESP32 – čip za pár eur, ktorý mi v dome vyriešil najviac](/diy/esp32-moje-projekty/). Ak ti niečo nefunguje, [napíš mi](/o-mne/).
