---
id: deye-soc
cover: /img/clanky/titulky/deye-soc.jpg
title: Tri BMS, jeden Deye – presné SOC a citlivé nabíjanie cez ESP32
description: Ako som z troch JK BMS a Victron SmartShuntu spravil pre menič Deye jeden „inteligentný BMS“ na ESP32 – presné SOC, limity z článkov, plynulé znižovanie prúdu pri uletenom článku a hotový kód pre ESPHome.
section: energy
level: 3
date: 2026-11-16
updated: 2026-11-22
time: '20:00'
slug: soc-zo-smartshunt-do-deye
tldr: 'Moja batéria sa skladá z troch kusov („packov“), každý s vlastnou **JK BMS**, a celkové SOC meria jeden **Victron SmartShunt**. Keďže údaje z BMS neboli presné (SOC) a jedna batéria navyše nemá BMS s CAN protokolom, rozhodol som sa to vyriešiť inak. Doska **Waveshare ESP32-S3-RS485-CAN za 24 €** teraz cez Bluetooth číta SmartShunt aj všetky tri BMS a meniču sa tvári ako **jedna batéria Pylontech**: posiela **presné SOC zo SmartShuntu** a nabíjací prúd **sama plynulo znižuje, keď niektorý článok uletí hore** – skôr, než BMS batériu tvrdo odpojí. Nižšie je zapojenie, logika, príbeh ladenia aj kompletný kód.'
---

:::info Aktualizované 22. 11. 2026 – verzia 2
Prvá verzia tohto návodu (16. 11.) posielala meniču len SOC zo SmartShuntu a **pevné limity** – menič o stave BMS nevedel nič. Na to ma právom upozornil skúsenejší kutil Andy. Verzia 2 číta aj všetky tri BMS a limity počíta z reálneho stavu článkov.

Stále to **nie je náhrada BMS, ktorá sa s meničom rozpráva priamo**, a ochranu robia ďalej BMS v batériách. Ale je to výrazne bezpečnejšie než menič nastavený napevno – a pomôže každému, koho BMS nevie komunikovať s meničom priamo, ale dá sa čítať cez Bluetooth.
:::

## Prečo to vôbec riešim

:::me Ako to mám ja
Menič **Deye SUN-10K-SG04LP3-EU**, batéria LiFePO4 ~34 kWh zložená z troch packov (**2 × 280 Ah + 1 × 105 Ah**, 16 článkov), každý s vlastnou **JK BMS**. Celú banku meria jeden **Victron SmartShunt** – ten je pre mňa zdroj pravdy, riadi sa podľa neho aj moja [AI Energy](/projekty/ai-energy/).
:::

Mal som dva problémy naraz:

- **SOC z BMS nie je presné.** BMS počíta SOC sčítavaním prúdu a opraví sa až pri nabití na 100 %. V zime sa tam batéria dostane menej často a po pár dňoch číslo s realitou nesedí. **SmartShunt** meria celú banku a je výrazne presnejší aj po týždňoch – lenže Deye ho nepozná.
- **JK BMS ku koncu nabíjania prúd neznižuje.** Pošle meniču pevné nabíjacie napätie a pevný prúd. Spomalenie robí až menič v CV fáze – podľa napätia **celej batérie**. Keď jeden článok uletí hore, celá banka je ešte „v pohode“, článok však dôjde až na ochranu BMS (u mňa 3,65 V) a BMS **tvrdo odpojí**. To nie je dobré ani pre články, ani pre tranzistory v BMS.

Na fórach sa navyše často spomínajú problémy Deye s JK BMS cez CAN – napríklad iné meranie napätia v meniči a v BMS alebo reštart absorpcie pri krátkom poklese napätia. Sám som ich neoveroval, ale aj to bol dôvod chcieť mať logiku vo vlastných rukách.

## Ako to funguje

![Schéma zapojenia v2: SmartShunt a tri JK BMS cez Bluetooth do ESP32-S3, odtiaľ CAN do Deye](/img/clanky/deye-esp-zapojenie-sk.svg)

Doska **Waveshare ESP32-S3-RS485-CAN** je pre Deye „jeden inteligentný BMS“:

1. Cez Bluetooth **počúva SmartShunt** (SOC, napätie a prúd celej banky) – nepripája sa k nemu, len číta jeho vysielanie.
2. Cez Bluetooth sa **pripája ku všetkým trom JK BMS** – berie najvyšší a najnižší článok, teplotu a či BMS dovoľuje nabíjanie a vybíjanie.
3. **Každú sekundu vypočíta limity** a pošle ich cez CAN do Deye v protokole Pylontech.

Všetko beží **priamo v ESP**. Keď vypadne Wi-Fi alebo Home Assistant, riadenie ide ďalej. HA slúži len na zobrazenie a ručné stropy.

| CAN ID | Obsah |
|---|---|
| `0x351` | nabíjacie napätie, **nabíjací prúd**, **vybíjací prúd**, spodné napätie 47,0 V |
| `0x355` | **SOC zo SmartShuntu**, zdravie (SOH) 100 % |
| `0x356` | napätie a prúd zo SmartShuntu, **teplota najchladnejšieho packu** |
| `0x35C` | povolenie nabíjania a vybíjania (0 A = zakázané) |

## Logika nabíjacieho prúdu

Základ je jednoduchý: **200 A × počet packov**, ktoré majú v BMS povolené nabíjanie a za poslednú minútu poslali údaje. Nikdy však viac, než je strop nastavený v HA (u mňa 200 A – stačí na nabíjanie zo siete plným výkonom 10 kW).

Jadro je **regulátor podľa najvyššieho článku zo všetkých 48**. Robí krok raz za 10 s, lebo JK BMS posielajú údaje cez Bluetooth práve raz za 10 s. Všetky zmeny počíta z prúdu, ktorý **naozaj odchádza do Deye**.

![Pásma regulátora podľa najvyššieho článku: 3,40 / 3,45 / 3,50 / 3,60 V](/img/clanky/deye-esp-pasma-sk.svg)

| Najvyšší článok | Čo robí nabíjací prúd |
|---|---|
| pod 3,40 V | rastie rýchlo (+20 A za 10 s) |
| 3,40 – 3,45 V | rastie pomaly (+2 A za 10 s) |
| 3,45 – 3,50 V | drží sa |
| 3,50 – 3,60 V | plynulo klesá, tým rýchlejšie, čím je článok vyššie (3,51 V −3 %, 3,55 V −15 %, 3,59 V −27 % za krok) |
| od 3,60 V | **0 A a pauza** |

**Pauza po 3,60 V:** nabíjanie sa znova zapne, až keď od vypnutia ubehlo 5 minút **a** článok je 60 sekúnd bez prestávky pod 3,45 V. Štartuje od 5 A. Zároveň sa nastaví strop na polovicu prúdu pred vypnutím a ten sa uvoľňuje o 1 A za minútu – prúd sa teda nevie hneď vrátiť tam, kde to vypadlo.

Ďalšie poistky:

- **Chlad:** keď je najchladnejší pack pod 5 °C, nenabíja sa (znova od 6 °C).
- **BMS mlčí 60 s:** daný pack sa nepočíta, limit klesne o jeho podiel. Keď mlčia všetky, ide sa na **záložný prúd** nastavený v HA (u mňa 50 A).
- **SmartShunt mlčí 5 minút:** ESP neposiela do Deye **nič**. Deye ohlási **W31** (chyba komunikácie s batériou) a ide ďalej podľa vlastných nastavení – to som si overil.
- **Vybíjanie** sa obmedzuje podľa najnižšieho článku: od 3,00 V plynulo klesá, pri 2,80 V je 0 A.
- **Poslednou poistkou** je vždy BMS v batérii.

### Ako to spolupracuje s Deye

Nabíjacie napätie mám na **55,4 V** (3,46 V na článok). Ideálne nabíjanie LFP sú dva regulátory naraz: **menič drží napätie celej batérie** (CV) a **BMS stráži najvyšší článok** (nabíjací prúd). Presne tak to teraz funguje:

![Tri scenáre konca nabíjania: vybalancovaná batéria, uletený článok, nestihne sa vyrovnať](/img/clanky/deye-esp-scenare-sk.svg)

1. **Vybalancovaná batéria** – prúd znižuje sám Deye v CV fáze, ESP nezasahuje.
2. **Uletený článok** – banka je ešte pod 55,4 V, ale jeden článok prejde 3,50 V. Prúd zníži ESP a drží ho tak nízko, aby článok ostal okolo cieľa a ostatné mohli dobehnúť (vyrovnávanie v BMS ich ťahá k sebe).
3. **Nestihne sa vyrovnať** – na toto zatiaľ nemám riešenie v kóde. Plán je ukončiť nabíjanie po čase a označiť batériu ako „nevyváženú“.

Hranica 3,60 V je len poistka. Pri správnom nastavení sa má objaviť výnimočne.

:::tip Ak ulieta stále ten istý článok
Je to pravdepodobne článok s menšou kapacitou. Vyrovnávanie mu nepomôže – je to strop celej banky. Pri obchodovaní so spotom navyše netreba batériu každý deň nabíjať na 100 %. Plné nabitie s vyrovnaním stačí občas, aj kvôli synchronizácii SmartShuntu.
:::

## Ladenie: prečo prúd kmital medzi 0 a 90 A

Prvá verzia nefungovala dobre a stojí za to ukázať prečo.

![Graf posielaného nabíjacieho prúdu: v1 kmitá medzi 0 a 90 A, v3 plynulo klesá](/img/clanky/deye-esp-ladenie-sk.svg)

1. **v1 – lineárny útlm 3,50 → 3,60 V a nárast 5 A za sekundu.** Na grafe kmitanie: 200 A → 25 A → 0 → 55 → 90 → 0 → 75… Článok pri 3,60 V vypol nabíjanie, bez prúdu jeho napätie spadlo (zmizne úbytok na vnútornom odpore), logika rýchlo pridala a článok znova vyletel. **Príčina:** JK BMS posielajú údaje raz za 10 s, ale limit rástol každú sekundu – medzi dvoma meraniami pridal +50 A naslepo. Navyše sa útlm počítal zo 600 A (3 packy), takže 10 mV na článku znamenalo 60 A.
2. **v2 – regulátor s krokom 10 s, pauzou a naučeným stropom.** Nová chyba: regulátor znižoval vnútornú hodnotu zo 600 A (600 → 480 → 384 → 307), ale do Deye išlo stále 200 A. Karta ukazovala „klesá (307 A)“ a prúd sa nehýbal.
3. **v3 – pokles sa počíta z prúdu, ktorý sa naozaj posiela do Deye.** V simulácii sa článok ustálil okolo 3,50 V a prúd plynulo klesol z ~50 A na jednotky ampérov bez jediného vypnutia.

Skutočný test som robil zámerne s nabíjacím napätím **57,4 V**, teda bez pomoci CV fázy Deye – všetko riadilo ESP. Je to najhorší prípad. BMS 2 mala pri nabíjaní rozdiel článkov okolo 235 mV – ukážkový uletený článok:

![Karta v Home Assistante počas testu pri 57,4 V: 195 A, potom 54 A pri článku 3,597 V, potom pauza po 3,60 V](/img/clanky/deye-esp-test-57v.jpg)

Najprv 195 A, pri článku 3,597 V už len 54 A a keď článok BMS 2 dosiahol 3,609 V, nabíjanie sa zastavilo s pauzou a odpočtom. BMS neodpojila – zastavilo to ESP skôr. Pri bežných 55,4 V sa sem batéria dostať nemá.

## Čo potrebuješ

- **Victron SmartShunt** v mínuse batérie (ja mám 300 A / 50 mV) – ako zdroj pravdy však môžeš použiť aj údaje z vybraného BMS (treba upraviť kód v ESP),
- **Waveshare ESP32-S3-RS485-CAN** – doska na DIN lištu s CAN aj RS485, napájanie 7–36 V, stála ma **24 €** – môže to byť aj iná doska s CAN,
- BMS, ktoré sa dajú čítať cez Bluetooth – u mňa **JK BMS** (komponent [jk_bms_ble](https://github.com/syssi/esphome-jk-bms) podporuje aj iné verzie JK),
- kus **LAN kábla** s konektorom RJ45,
- **ESPHome** (doplnok v Home Assistante) a USB-C kábel na prvé nahratie.

:::warn JK BMS prijme len jedno Bluetooth spojenie
Kým je k batérii pripojené ESP, **JK appka v mobile sa nepripojí** (a naopak). Ak čítaš BMS iným ESP alebo Bluetooth proxy, musíš ho najprv vypnúť.
:::

## Ako zapojiť kábel

1. **Kábel do meniča.** LAN kábel (zapojenie T568B) – konektor RJ45 do portu **BMS** na Deye, druhý koniec odstrihni. Nepotrebné vodiče zaizoluj.
2. **CAN:** pin **4 – modrý** → svorka **H**, pin **5 – bielo-modrý** → svorka **L** na doske Waveshare.
3. **Terminácia:** na doske zapni **jumper 120 Ω**.
4. **Napájanie:** z **12 V výstupu na svorkovnici Deye** do svoriek napájania dosky.

Batérie s ESP nespájaš žiadnym káblom – všetko ide cez Bluetooth.

:::warn Pracuj pri vypnutom meniči
Svorkovnica s 12 V výstupom je vo vnútri meniča, kde sú aj nebezpečné napätia z batérie, panelov a siete. Pred otvorením menič vypni (AC, FVE aj batériu) a počkaj, kým sa vybijú kondenzátory. Ak si nie si istý, nechaj to urobiť elektrikára.
:::

## Ako spárovať ESP so SmartShuntom a BMS

**SmartShunt** vysiela údaje šifrovane. Potrebuješ jeho **MAC adresu** a **šifrovací kľúč**: v aplikácii **VictronConnect** sa pripoj k SmartShuntu → **ozubené koliesko** → **tri bodky** → **Product info** → zapni **Instant readout via Bluetooth** → pri **Instant readout details** ťukni na **Show**.

**JK BMS** potrebujú len MAC adresu – nájdeš ju v JK appke alebo v Bluetooth skeneri. Pri JK si over aj verziu hardvéru: novšie (HW 11 a vyššie) majú protokol `JK02_32S`, staršie (HW 6–10) `JK02_24S`. Môj najmenší pack je starší kus.

Všetko daj do `secrets.yaml` v ESPHome:

```yaml secrets.yaml
wifi_ssid: "MojaWiFi"
wifi_password: "heslo-k-wifi"
smartshunt_mac: "aabbccddeeff"            # bez dvojbodiek, malými písmenami
smartshunt_bindkey: "sem-vloz-32-znakovy-kluc"
bms1_mac: "AA:BB:CC:DD:EE:01"              # JK BMS s dvojbodkami
bms2_mac: "AA:BB:CC:DD:EE:02"
bms3_mac: "AA:BB:CC:DD:EE:03"
```

:::tip Kľúč nikomu neposielaj
Kto má šifrovací kľúč, číta údaje z tvojej batérie. Do fór, na GitHub ani do správ pre AI ho nedávaj – preto je v `secrets.yaml`, nie priamo v kóde.
:::

## Kód pre ESPHome

Toto je konfigurácia, ktorá mi beží (stav 22. 11. 2026). Na začiatku súboru je celá logika popísaná slovami. Všetky prahy sú hore v `substitutions`, takže ich prispôsobíš bez zásahu do kódu. **Prahy sú ladené na LFP 16S a môj hardvér – pred použitím si ich over pre svoje batérie.**

```yaml esp-can.yaml
# =====================================================================
#  ESP CAN v2.0 – Waveshare ESP32-S3-RS485-CAN  →  Deye (CAN, protokol Pylon)
# =====================================================================
#
#  ČO TO ROBÍ (po lopate)
#  ----------------------
#  1. SmartShunt (Bluetooth, len počúvanie)  →  SOC, napätie a prúd celej banky.
#  2. Tri JK BMS (Bluetooth spojenie)        →  najvyšší/najnižší článok, teplota,
#                                               či má BMS zapnuté nabíjanie/vybíjanie.
#  3. Každú sekundu ESP vypočíta limity a pošle Deye cez CAN:
#        0x351  nabíjacie napätie, nabíjací prúd, vybíjací prúd, min. napätie 47,0 V
#        0x355  SOC zo SmartShuntu, SOH 100 %
#        0x356  napätie a prúd zo SmartShuntu, teplota (najchladnejšia batéria)
#        0x35C  povolenie nabíjania / vybíjania (prúd 0 A = zakázané)
#
#  AKO SA POČÍTA NABÍJACÍ PRÚD
#  ---------------------------
#   a) 200 A × počet batérií, ktoré majú v BMS zapnuté nabíjanie a poslali údaje
#      za poslednú minútu (3 batérie = 600 A, 2 = 400 A …).
#   b) Najvyšší článok zo všetkých batérií – regulátor (krok každých 10 s,
#      lebo JK posielajú údaje raz za 10 s):
#      Všetky zmeny sa počítajú z prúdu, ktorý sa PRÁVE posiela do Deye.
#        pod 3,40 V      → limit rastie rýchlo (+20 A / 10 s)
#        3,40–3,45 V     → pomaly (+2 A / 10 s)
#        3,45–3,50 V     → drží sa, nemení
#        3,50–3,60 V     → plynulo klesá, tým rýchlejšie, čím je článok vyššie:
#                          3,51 V −3 %, 3,55 V −15 %, 3,59 V −27 % (min. 1 A) / 10 s
#        od 3,60 V       → 0 A a PAUZA: znova až po 5 min a keď je článok
#                          60 s pod 3,45 V; štart od 5 A. Strop sa nastaví na
#                          polovicu prúdu pred vypnutím a uvoľňuje sa o 1 A/min.
#      (BMS ochrana je 3,65 V – Deye prúd zníži skôr, než BMS odpojí).
#   c) Najchladnejšia batéria pod 5 °C → 0 A (znova povolí od 6 °C).
#   d) Nikdy viac než políčko „Strop nabíjacieho prúdu“ v HA.
#
#  AKO SA POČÍTA VYBÍJACÍ PRÚD
#  ---------------------------
#   200 A × počet batérií so zapnutým vybíjaním, najnižší článok:
#        od 3,00 V → 100 %,  3,00–2,80 V → plynulo klesá,  pod 2,80 V → 0 A
#   a nikdy viac než „Strop vybíjacieho prúdu“.
#
#  Limit klesne okamžite, stúpa najviac o 5 A za sekundu (nekmitá).
#
#  KEĎ NIEČO VYPADNE
#  -----------------
#   • Žiadna BMS nič nepošle 60 s  → „Záložný prúd“ (predvolene 100 A, dá sa znížiť),
#                                     teplota 25 °C.
#   • Jedna BMS mlčí               → nepočíta sa, limit klesne o jej podiel.
#   • SmartShunt mlčí 5 min        → ESP do Deye neposiela NIČ → Deye hlási W31
#                                     a ide podľa vlastných nastavení batérie.
#   • Wi-Fi / Home Assistant       → nič sa nedeje, všetko beží v ESP.
#   • Prepínač „Riadenie limitov podľa BMS“ = vypnutý → posielajú sa len stropy
#     z HA. Po reštarte ESP sa riadenie samo zapne.
#   • Poslednou poistkou je vždy BMS v batérii (tvrdé odpojenie).
#
#  POZOR: JK BMS prijme naraz len JEDNO Bluetooth spojenie. Iné ESP
#  ani JK appka v mobile nesmú byť k batériám pripojené.
#
#  secrets.yaml: wifi_ssid, wifi_password, smartshunt_mac, smartshunt_bindkey,
#                bms1_mac, bms2_mac, bms3_mac
# =====================================================================

substitutions:
  # --- Bluetooth adresy a protokoly JK BMS ---
  bms1_mac: !secret bms1_mac
  bms1_protocol: JK02_32S   # hlavná, adresa 0
  bms2_mac: !secret bms2_mac
  bms2_protocol: JK02_32S
  bms3_mac: !secret bms3_mac
  bms3_protocol: JK02_24S   # starší hardvér

  # --- Pravidlá (zmena = nové nahratie do ESP) ---
  per_bat_a: "200"          # max. prúd jednej batérie (A)
  cell_fast: "3.40"         # pod týmto napätím článku smie limit rásť rýchlo (V)
  cell_slow: "3.45"         # 3,40–3,45 pomaly, nad tým sa drží; pod týmto sa smie po vypnutí znova nabíjať (V)
  cell_hi_start: "3.50"     # od tohto napätia článku nabíjací prúd plynulo klesá (V)
  down_max_pct: "30"        # pokles za krok tesne pod cell_hi_stop (%), pri cell_hi_start 0 %
  cell_hi_stop: "3.60"      # tu je nabíjací prúd 0 A + pauza (V)
  hi_step_s: "10"           # ako často regulátor reaguje (s) – zhodne s throttle JK BMS
  up_fast_a: "20"           # nárast za krok pod cell_fast (A)
  up_slow_a: "2"            # nárast za krok cell_fast–cell_slow (A)
  restart_a: "5"            # štartovací prúd po vypnutí (A)
  pause_min: "5"            # minimálna pauza po vypnutí (min)
  cap_release_a_min: "1"    # o koľko A za minútu sa uvoľňuje strop po vypnutí
  cell_lo_start: "3.00"     # od tohto napätia článku klesá vybíjací prúd (V)
  cell_lo_stop: "2.80"      # tu je vybíjací prúd 0 A (V)
  cold_off_c: "5"           # pod touto teplotou sa nenabíja (°C)
  cold_on_c: "6"            # od tejto teploty sa znova nabíja (°C)
  bms_timeout_s: "60"       # po koľkých sekundách bez údajov sa batéria nepočíta
  shunt_timeout_min: "5"    # po koľkých minútach bez SOC zo shuntu prestať posielať
  ramp_up_a_s: "5"          # o koľko A za sekundu smie limit stúpať

esphome:
  name: esp-can
  friendly_name: ESP CAN
  min_version: 2026.4.0
  name_add_mac_suffix: false
  on_boot:
    priority: -100
    then:
      - component.update: charge_voltage_cell

esp32:
  variant: esp32s3
  framework:
    type: esp-idf

external_components:
  - source: github://Igypop78/esphome-victron_ble
  - source: github://syssi/esphome-jk-bms@main
    components: [jk_bms_ble]
    refresh: 1d

logger:
  level: INFO
  logs:
    sensor: WARN
    binary_sensor: WARN

api:

ota:
  - platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

# ---------------- Bluetooth ----------------
esp32_ble_tracker:
  scan_parameters:
    active: false        # pasívne – menej záťaže pre Wi-Fi

# SmartShunt – len počúva vysielanie, nepripája sa
victron_ble:
  - mac_address: !secret smartshunt_mac
    bindkey: !secret smartshunt_bindkey
    id: my_shunt

# JK BMS – tri Bluetooth spojenia
ble_client:
  - mac_address: ${bms1_mac}
    id: client1
  - mac_address: ${bms2_mac}
    id: client2
  - mac_address: ${bms3_mac}
    id: client3

jk_bms_ble:
  - ble_client_id: client1
    protocol_version: ${bms1_protocol}
    throttle: 10s
    id: bms1
  - ble_client_id: client2
    protocol_version: ${bms2_protocol}
    throttle: 10s
    id: bms2
  - ble_client_id: client3
    protocol_version: ${bms3_protocol}
    throttle: 10s
    id: bms3

# ---------------- Stav BMS: nabíjanie / vybíjanie povolené ----------------
binary_sensor:
  - platform: jk_bms_ble
    jk_bms_ble_id: bms1
    charging:
      id: b1_chg
      name: "Batéria 1 – nabíjanie povolené (BMS)"
    discharging:
      id: b1_dis
      name: "Batéria 1 – vybíjanie povolené (BMS)"
  - platform: jk_bms_ble
    jk_bms_ble_id: bms2
    charging:
      id: b2_chg
      name: "Batéria 2 – nabíjanie povolené (BMS)"
    discharging:
      id: b2_dis
      name: "Batéria 2 – vybíjanie povolené (BMS)"
  - platform: jk_bms_ble
    jk_bms_ble_id: bms3
    charging:
      id: b3_chg
      name: "Batéria 3 – nabíjanie povolené (BMS)"
    discharging:
      id: b3_dis
      name: "Batéria 3 – vybíjanie povolené (BMS)"

  - platform: template
    name: "Deye – posiela sa SOC a limity"
    icon: mdi:transmission-tower-export
    lambda: 'return id(sending);'

# ---------------- Senzory ----------------
sensor:
  # --- SmartShunt ---
  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_voltage
    filters:
      - throttle_average: 5s
    id: shunt_voltage
    name: "SmartShunt – napätie"

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_current
    filters:
      - throttle_average: 5s
    id: shunt_current
    name: "SmartShunt – prúd"

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: state_of_charge
    filters:
      - throttle_average: 5s
    id: shunt_soc
    name: "SmartShunt – SOC"
    on_value:
      - lambda: |-
          if (!std::isnan(x)) id(shunt_last_ms) = millis();

  - platform: victron_ble
    victron_ble_id: my_shunt
    type: battery_power
    filters:
      - throttle_average: 5s
    id: shunt_power
    name: "SmartShunt – výkon"

  # --- Batéria 1 ---
  - platform: jk_bms_ble
    jk_bms_ble_id: bms1
    max_cell_voltage:
      id: b1_vmax
      name: "Batéria 1 – najvyšší článok"
      on_value:
        - lambda: |-
            if (!std::isnan(x)) id(b1_last_ms) = millis();
    min_cell_voltage:
      id: b1_vmin
      name: "Batéria 1 – najnižší článok"
    max_voltage_cell:
      name: "Batéria 1 – číslo najvyššieho článku"
    min_voltage_cell:
      name: "Batéria 1 – číslo najnižšieho článku"
    delta_cell_voltage:
      name: "Batéria 1 – rozdiel článkov"
    average_cell_voltage:
      name: "Batéria 1 – priemer článku"
    total_voltage:
      name: "Batéria 1 – napätie"
    current:
      name: "Batéria 1 – prúd"
    power:
      name: "Batéria 1 – výkon"
    temperature_sensor_1:
      id: b1_temp
      name: "Batéria 1 – teplota"
    mosfet_temperature:
      name: "Batéria 1 – teplota tranzistorov (MOS)"
    state_of_charge:
      name: "Batéria 1 – SOC (BMS)"
    charging_cycles:
      name: "Batéria 1 – cykly"
    balancer_status_bitmask:
      name: "Batéria 1 – vyrovnávanie"

  # --- Batéria 2 ---
  - platform: jk_bms_ble
    jk_bms_ble_id: bms2
    max_cell_voltage:
      id: b2_vmax
      name: "Batéria 2 – najvyšší článok"
      on_value:
        - lambda: |-
            if (!std::isnan(x)) id(b2_last_ms) = millis();
    min_cell_voltage:
      id: b2_vmin
      name: "Batéria 2 – najnižší článok"
    max_voltage_cell:
      name: "Batéria 2 – číslo najvyššieho článku"
    min_voltage_cell:
      name: "Batéria 2 – číslo najnižšieho článku"
    delta_cell_voltage:
      name: "Batéria 2 – rozdiel článkov"
    average_cell_voltage:
      name: "Batéria 2 – priemer článku"
    total_voltage:
      name: "Batéria 2 – napätie"
    current:
      name: "Batéria 2 – prúd"
    power:
      name: "Batéria 2 – výkon"
    temperature_sensor_1:
      id: b2_temp
      name: "Batéria 2 – teplota"
    mosfet_temperature:
      name: "Batéria 2 – teplota tranzistorov (MOS)"
    state_of_charge:
      name: "Batéria 2 – SOC (BMS)"
    charging_cycles:
      name: "Batéria 2 – cykly"
    balancer_status_bitmask:
      name: "Batéria 2 – vyrovnávanie"

  # --- Batéria 3 ---
  - platform: jk_bms_ble
    jk_bms_ble_id: bms3
    max_cell_voltage:
      id: b3_vmax
      name: "Batéria 3 – najvyšší článok"
      on_value:
        - lambda: |-
            if (!std::isnan(x)) id(b3_last_ms) = millis();
    min_cell_voltage:
      id: b3_vmin
      name: "Batéria 3 – najnižší článok"
    max_voltage_cell:
      name: "Batéria 3 – číslo najvyššieho článku"
    min_voltage_cell:
      name: "Batéria 3 – číslo najnižšieho článku"
    delta_cell_voltage:
      name: "Batéria 3 – rozdiel článkov"
    average_cell_voltage:
      name: "Batéria 3 – priemer článku"
    total_voltage:
      name: "Batéria 3 – napätie"
    current:
      name: "Batéria 3 – prúd"
    power:
      name: "Batéria 3 – výkon"
    temperature_sensor_1:
      id: b3_temp
      name: "Batéria 3 – teplota"
    mosfet_temperature:
      name: "Batéria 3 – teplota tranzistorov (MOS)"
    state_of_charge:
      name: "Batéria 3 – SOC (BMS)"
    charging_cycles:
      name: "Batéria 3 – cykly"
    balancer_status_bitmask:
      name: "Batéria 3 – vyrovnávanie"

  # --- Čo ESP práve posiela do Deye ---
  - platform: template
    name: "Deye – posielaný nabíjací prúd"
    icon: mdi:battery-arrow-up
    unit_of_measurement: A
    accuracy_decimals: 0
    update_interval: 10s
    lambda: 'return id(out_ccl);'
  - platform: template
    name: "Deye – posielaný vybíjací prúd"
    icon: mdi:battery-arrow-down
    unit_of_measurement: A
    accuracy_decimals: 0
    update_interval: 10s
    lambda: 'return id(out_dcl);'
  - platform: template
    name: "Deye – posielaná teplota batérie"
    icon: mdi:thermometer
    unit_of_measurement: "°C"
    accuracy_decimals: 1
    update_interval: 10s
    lambda: 'return id(out_temp);'
  - platform: template
    name: "Riadenie – limit vysokého článku"
    icon: mdi:battery-alert-variant
    unit_of_measurement: A
    accuracy_decimals: 0
    update_interval: 10s
    lambda: 'return id(hi_lim);'
  - platform: template
    name: "Riadenie – strop po vypnutí"
    icon: mdi:arrow-collapse-up
    unit_of_measurement: A
    accuracy_decimals: 0
    update_interval: 10s
    lambda: 'return id(hi_cap);'
  - platform: template
    name: "Riadenie – počet batérií s údajmi"
    icon: mdi:battery-sync
    accuracy_decimals: 0
    update_interval: 10s
    lambda: 'return id(n_fresh);'
  - platform: template
    id: charge_voltage_cell
    name: "Deye – nabíjacie napätie na článok"
    icon: mdi:battery-high
    unit_of_measurement: V
    accuracy_decimals: 3
    update_interval: never
    lambda: 'return id(charge_voltage).state / 16.0f;'

text_sensor:
  - platform: template
    name: "Riadenie – režim"
    icon: mdi:state-machine
    update_interval: 10s
    lambda: 'return id(mode_text);'
  - platform: template
    name: "Riadenie – čo obmedzuje nabíjanie"
    icon: mdi:information-outline
    update_interval: 10s
    lambda: 'return id(reason_text);'

# ---------------- Ovládanie v HA ----------------
switch:
  - platform: template
    id: control_on
    name: "Riadenie limitov podľa BMS"
    icon: mdi:robot
    optimistic: true
    restore_mode: ALWAYS_ON     # po reštarte ESP vždy zapnuté

number:
  - platform: template
    id: max_charge_a
    name: "Strop nabíjacieho prúdu"
    icon: mdi:battery-arrow-up
    unit_of_measurement: A
    min_value: 0
    max_value: 200
    step: 5
    initial_value: 200
    restore_value: true
    optimistic: true
    mode: box
  - platform: template
    id: max_discharge_a
    name: "Strop vybíjacieho prúdu"
    icon: mdi:battery-arrow-down
    unit_of_measurement: A
    min_value: 0
    max_value: 200
    step: 5
    initial_value: 200
    restore_value: true
    optimistic: true
    mode: box
  - platform: template
    id: fallback_a
    name: "Záložný prúd pri výpadku BMS"
    icon: mdi:shield-alert
    unit_of_measurement: A
    min_value: 0
    max_value: 100
    step: 5
    initial_value: 100
    restore_value: true
    optimistic: true
    mode: box
  - platform: template
    id: charge_voltage
    name: "Deye nabíjacie napätie"
    icon: mdi:flash-triangle
    unit_of_measurement: V
    min_value: 52.0
    max_value: 58.0
    step: 0.1
    initial_value: 55.4
    restore_value: true
    optimistic: true
    mode: box
    on_value:
      - component.update: charge_voltage_cell

globals:
  - { id: b1_last_ms, type: uint32_t, initial_value: '0' }
  - { id: b2_last_ms, type: uint32_t, initial_value: '0' }
  - { id: b3_last_ms, type: uint32_t, initial_value: '0' }
  - { id: shunt_last_ms, type: uint32_t, initial_value: '0' }
  - { id: sending, type: bool, initial_value: 'false' }
  - { id: cold_block, type: bool, initial_value: 'false' }
  - { id: out_ccl, type: float, initial_value: '0' }
  - { id: out_dcl, type: float, initial_value: '0' }
  - { id: out_temp, type: float, initial_value: '25' }
  - { id: n_fresh, type: int, initial_value: '0' }
  - { id: hi_lim, type: float, initial_value: '600' }       # limit od regulátora vysokého článku
  - { id: hi_cap, type: float, initial_value: '600' }       # naučený strop po vypnutí
  - { id: hi_cut, type: bool, initial_value: 'false' }      # pauza po vypnutí pri 3,60 V
  - { id: hi_cut_ms, type: uint32_t, initial_value: '0' }
  - { id: hi_below_ms, type: uint32_t, initial_value: '0' }
  - { id: hi_step_ms, type: uint32_t, initial_value: '0' }
  - { id: mode_text, type: std::string, initial_value: '"štart"' }
  - { id: reason_text, type: std::string, initial_value: '"–"' }

# ---------------- CAN do Deye ----------------
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
          const uint32_t now = millis();

          // ===== 1. SmartShunt: bez čerstvého SOC neposielame nič =====
          bool shunt_ok = id(shunt_last_ms) != 0 && (now - id(shunt_last_ms)) < ${shunt_timeout_min} * 60000UL
                          && id(shunt_voltage).has_state() && id(shunt_current).has_state()
                          && !std::isnan(id(shunt_soc).state) && !std::isnan(id(shunt_voltage).state);
          if (shunt_ok != id(sending)) {
            ESP_LOGW("deye", shunt_ok ? "SmartShunt OK – posielam do Deye"
                                      : "SmartShunt mlčí – do Deye neposielam (Deye: W31)");
            id(sending) = shunt_ok;
          }
          if (!shunt_ok) { id(mode_text) = "Vypnuté – SmartShunt mlčí"; return; }

          // ===== 2. Zber údajov z BMS (len čerstvé) =====
          struct Bat { uint32_t last; sensor::Sensor *vmax, *vmin, *temp; binary_sensor::BinarySensor *chg, *dis; };
          Bat bats[3] = {
            { id(b1_last_ms), id(b1_vmax), id(b1_vmin), id(b1_temp), id(b1_chg), id(b1_dis) },
            { id(b2_last_ms), id(b2_vmax), id(b2_vmin), id(b2_temp), id(b2_chg), id(b2_dis) },
            { id(b3_last_ms), id(b3_vmax), id(b3_vmin), id(b3_temp), id(b3_chg), id(b3_dis) },
          };
          int n = 0, n_chg = 0, n_dis = 0;
          float vmax = 0, vmin = 99, tmin = 99;
          for (auto &b : bats) {
            if (b.last == 0 || (now - b.last) > ${bms_timeout_s} * 1000UL) continue;   // batéria mlčí
            if (std::isnan(b.vmax->state) || std::isnan(b.vmin->state)) continue;
            n++;
            vmax = std::max(vmax, b.vmax->state);
            vmin = std::min(vmin, b.vmin->state);
            if (!std::isnan(b.temp->state)) tmin = std::min(tmin, b.temp->state);
            if (b.chg->has_state() && b.chg->state) n_chg++;
            if (b.dis->has_state() && b.dis->state) n_dis++;
          }
          id(n_fresh) = n;

          // ===== 3. Výpočet limitov =====
          float t_ccl, t_dcl, temp = 25.0f;
          std::string reason = "nič – plný prúd";
          if (!id(control_on).state) {
            // Riadenie vypnuté v HA: len ručné stropy
            t_ccl = id(max_charge_a).state;
            t_dcl = id(max_discharge_a).state;
            if (tmin < 99) temp = tmin;
            id(mode_text) = "Vypnuté – len stropy z HA";
            reason = "riadenie vypnuté";
          } else if (n == 0) {
            // Žiadna BMS: záložný prúd
            t_ccl = t_dcl = id(fallback_a).state;
            id(mode_text) = "Záloha – BMS neposielajú údaje";
            reason = "záloha";
          } else {
            if (tmin < 99) temp = tmin;
            // a) počet batérií × prúd jednej
            t_ccl = n_chg * ${per_bat_a}.0f;
            t_dcl = n_dis * ${per_bat_a}.0f;
            if (n_chg < n) reason = "batéria s vypnutým nabíjaním";
            // b1) vysoký článok – regulátor s pauzou po vypnutí
            const float HI_MAX = 3 * ${per_bat_a}.0f;
            char hb[96] = "";
            if (vmax >= ${cell_hi_stop}f) {
              // tvrdé vypnutie – reaguje hneď, nečaká na krok
              if (!id(hi_cut)) {
                id(hi_cap) = std::max(${restart_a}.0f, id(out_ccl) * 0.5f);
                id(hi_cut) = true;
                ESP_LOGW("deye", "Článok %.3f V – nabíjanie vypnuté, nový strop %.0f A", vmax, id(hi_cap));
              }
              id(hi_cut_ms) = now; id(hi_below_ms) = 0; id(hi_lim) = 0;
            }
            if (id(hi_cut)) {
              // pauza: aspoň pause_min a 60 s pod cell_slow
              if (vmax < ${cell_slow}f) { if (id(hi_below_ms) == 0) id(hi_below_ms) = now; }
              else id(hi_below_ms) = 0;
              if ((now - id(hi_cut_ms)) >= ${pause_min} * 60000UL && id(hi_below_ms) != 0
                  && (now - id(hi_below_ms)) >= 60000UL) {
                id(hi_cut) = false;
                id(hi_lim) = ${restart_a}.0f;
                id(hi_step_ms) = now;
                ESP_LOGW("deye", "Pauza skončila – štart od %d A (strop %.0f A)", ${restart_a}, id(hi_cap));
              } else {
                id(hi_lim) = 0;
                int left = (int) ((${pause_min} * 60000L - (long) (now - id(hi_cut_ms))) / 1000L);
                int left_lo = id(hi_below_ms) ? (int) ((60000L - (long) (now - id(hi_below_ms))) / 1000L) : 60;
                if (left > 0)
                  snprintf(hb, sizeof(hb), "pauza po 3,60 V – ešte %d s (článok %.3f V)", left, vmax);
                else if (vmax >= ${cell_slow}f)
                  snprintf(hb, sizeof(hb), "pauza – čakám, kým článok klesne pod 3,45 V (%.3f V)", vmax);
                else
                  snprintf(hb, sizeof(hb), "pauza – článok %.3f V, štart o %d s", vmax, std::max(0, left_lo));
              }
            } else if ((now - id(hi_step_ms)) >= ${hi_step_s} * 1000UL) {
              // krok regulátora raz za hi_step_s (JK posielajú údaje raz za 10 s)
              id(hi_step_ms) = now;
              // základ = prúd, ktorý sa PRÁVE posiela do Deye (nie súčet batérií)
              float l = std::min(id(hi_lim), id(out_ccl));
              if (vmax >= ${cell_hi_start}f) {
                float k = (vmax - ${cell_hi_start}f) / (${cell_hi_stop}f - ${cell_hi_start}f);   // 0…1
                l -= std::max(1.0f, l * k * ${down_max_pct} / 100.0f);
              }
              else if (vmax >= ${cell_slow}f)     { /* drží sa */ }
              else if (vmax >= ${cell_fast}f)     l += ${up_slow_a}.0f;
              else                                l = std::max(id(hi_lim), id(out_ccl)) + ${up_fast_a}.0f;
              id(hi_cap) = std::min(HI_MAX, id(hi_cap) + ${cap_release_a_min}.0f * ${hi_step_s} / 60.0f);
              id(hi_lim) = std::max(0.0f, std::min(l, id(hi_cap)));
            }
            if (!id(hi_cut) && id(hi_lim) < t_ccl) {
              const char *st = vmax >= ${cell_hi_start}f ? "klesá" : vmax >= ${cell_slow}f ? "drží" : "rastie";
              snprintf(hb, sizeof(hb), "vysoký článok %.3f V – %s (%.0f A)", vmax, st, id(hi_lim));
            }
            if (hb[0]) reason = hb;
            t_ccl = std::min(t_ccl, id(hi_lim));

            // b2) nízky článok – lineárne zníženie
            float f_lo = (vmin - ${cell_lo_stop}f) / (${cell_lo_start}f - ${cell_lo_stop}f);
            f_lo = std::max(0.0f, std::min(1.0f, f_lo));
            t_dcl *= f_lo;
            // c) chlad – s hysterézou
            if (tmin < 99) {
              if (tmin < ${cold_off_c}.0f) id(cold_block) = true;
              else if (tmin >= ${cold_on_c}.0f) id(cold_block) = false;
            }
            if (id(cold_block)) { t_ccl = 0; char b[48]; snprintf(b, sizeof(b), "chlad %.1f °C", tmin); reason = b; }
            char m[48]; snprintf(m, sizeof(m), "BMS (%d/3 batérie)", n);
            id(mode_text) = m;
          }
          // d) nikdy nad stropy z HA
          t_ccl = std::max(0.0f, std::min(t_ccl, id(max_charge_a).state));
          t_dcl = std::max(0.0f, std::min(t_dcl, id(max_discharge_a).state));
          if (t_ccl >= id(max_charge_a).state && reason == "nič – plný prúd") reason = "strop z HA";
          id(reason_text) = reason;

          // dole hneď, hore pomaly
          id(out_ccl) = (t_ccl < id(out_ccl)) ? t_ccl : std::min(t_ccl, id(out_ccl) + ${ramp_up_a_s}.0f);
          id(out_dcl) = (t_dcl < id(out_dcl)) ? t_dcl : std::min(t_dcl, id(out_dcl) + ${ramp_up_a_s}.0f);
          id(out_temp) = temp;

          // ===== 4. Odoslanie do Deye (Pylon, little-endian) =====
          auto le16 = [](std::vector<uint8_t> &d, int v) { d.push_back(v & 0xFF); d.push_back((v >> 8) & 0xFF); };
          int cvl = (int) lroundf(id(charge_voltage).state * 10);   // 0,1 V
          int ccl = (int) lroundf(id(out_ccl) * 10);                // 0,1 A
          int dcl = (int) lroundf(id(out_dcl) * 10);
          std::vector<uint8_t> d351; le16(d351, cvl); le16(d351, ccl); le16(d351, dcl); le16(d351, 470);
          id(deye_can)->send_data(0x351, false, d351);

          int soc = std::max(0, std::min(100, (int) lroundf(id(shunt_soc).state)));
          std::vector<uint8_t> d355; le16(d355, soc); le16(d355, 100); le16(d355, 0); le16(d355, 0);
          id(deye_can)->send_data(0x355, false, d355);

          std::vector<uint8_t> d356;
          le16(d356, (int) lroundf(id(shunt_voltage).state * 100));   // 0,01 V
          le16(d356, (int) lroundf(id(shunt_current).state * 10));    // 0,1 A
          le16(d356, (int) lroundf(temp * 10));                       // 0,1 °C
          le16(d356, 0);
          id(deye_can)->send_data(0x356, false, d356);

          uint8_t flags = 0;
          if (ccl > 0) flags |= 0x80;   // nabíjanie povolené
          if (dcl > 0) flags |= 0x40;   // vybíjanie povolené
          std::vector<uint8_t> d35c = {flags, 0};
          id(deye_can)->send_data(0x35C, false, d35c);```

Prvýkrát nahraj firmvér cez USB-C, ďalšie zmeny už idú cez Wi-Fi.

### Čo uvidíš v Home Assistante

ESP pošle do HA senzory všetkých troch BMS, SmartShuntu aj to, čo práve posiela do Deye: posielaný nabíjací a vybíjací prúd, **režim** („BMS (3/3 batérie)“, „Záloha…“), **čo obmedzuje nabíjanie** („vysoký článok 3,597 V – klesá“, „pauza po 3,60 V – ešte 298 s“, „chlad 4,2 °C“) a počet packov s údajmi.

Ovládať môžeš:

- **Strop nabíjacieho / vybíjacieho prúdu** – Deye nikdy nedostane viac,
- **Záložný prúd pri výpadku BMS** – 0 až 100 A,
- **Deye nabíjacie napätie** – 52 až 58 V (k tomu senzor napätia na článok),
- prepínač **Riadenie limitov podľa BMS** – keď ho vypneš, posielajú sa len stropy. Po reštarte ESP sa sám zapne.

Na prehľad používam svoju kartu **igy-battery-card** z balíka [igy-cards](https://github.com/Igypop78/igy-cards) (od verzie 1.8.0) – ukazuje SmartShunt, čo ide do meniča a tabuľku BMS s najvyšším a najnižším článkom. Mám aj automatizáciu, ktorá mi pošle notifikáciu, keď ESP začne Deye obmedzovať.

## Nastavenie Deye

V nastaveniach batérie na meniči prepni:

- **typ batérie: Lithium**,
- **protokol: 00** (Pylontech CAN).

Do minúty by sa na displeji mal objaviť SOC a údaje o batérii („LiBms: PYLON“). Ak nie, skontroluj prehodené H a L, jumper 120 Ω a log v ESPHome.

:::tip Nastav si rozumné hodnoty aj priamo v Deye
Pri chybe komunikácie (W31) ide Deye podľa vlastných nastavení batérie. Nemaj ich preto na maxime – sú tvoja záloha, keď ESP alebo SmartShunt vypadne.
:::

## Obmedzenia

Férovo, čo toto riešenie nie je:

- **Bluetooth** s JK BMS (údaje raz za 10 s) je pomalší a menej spoľahlivý než kábel (RS485). Rýchlu ochranu preto robia vždy BMS.
- **Prahy** sú ladené na LFP 16S a moje batérie.
- Kód zatiaľ **nemá ukončenie nabíjania podľa koncového prúdu** ani príznak „nevyvážená batéria“ – to je ďalší krok.
- Alarmy BMS sa do Deye zatiaľ neposielajú (`0x359`) – Deye vidí len limity a povolenia.
- Testované na jednom dome. **Nie je to náhrada ochrán BMS** – je to vrstva navyše.

## Výsledok

Deye má **presné SOC zo SmartShuntu** (alebo z vybraného BMS) a nabíjací prúd sa riadi podľa skutočného stavu všetkých 48 článkov. Keď článok uletí, prúd plynulo klesne skôr, než BMS tvrdo odpojí – a keď niečo vypadne, ESP prejde na opatrný režim alebo prestane posielať úplne. Celé to stojí dosku za 24 € a niekoľko večerov ladenia.

Ďalšie projekty na ESP32 nájdeš v článku [ESP32 – čip za pár eur, ktorý mi v dome vyriešil najviac](/diy/esp32-moje-projekty/). Ak ti niečo nefunguje, [napíš mi](/o-mne/).
