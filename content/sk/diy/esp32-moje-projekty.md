---
id: esp32
cover: /img/clanky/titulky/esp32.jpg
title: ESP32 – čip za pár eur, ktorý mi v dome vyriešil najviac
description: Ako som pred dvoma rokmi objavil ESP32, čo všetko mi na ňom dnes doma beží (od Tesly po digestor) a prečo je to prvá vec, na ktorú myslím pri každom novom projekte.
section: diy
level: 1
date: 2026-11-15
time: '20:00'
slug: esp32-moje-projekty
tldr: '**ESP32** je malá doska s WiFi a Bluetooth za pár eur. S **ESPHome** ju nahráš bez programovania a v Home Assistante sa objaví sama. Mne dnes doma beží na **viac ako desiatke projektov** – od lokálneho ovládania Tesly cez batérie a kotol po digestor, ktorý sa zapína z varnej dosky. Na konci si **zahlasuj**, ku ktorému projektu napíšem návod ako prvý.'
---

Dlho som ESP32 obchádzal. Myslel som si, že je to vec pre ľudí, ktorí vedia programovať, majú doma osciloskop a rozumejú registrom procesora. Ja som chcel smart dom, nie druhú prácu.

Potom som pred zhruba dvoma rokmi potreboval dostať menič **Deye** do Home Assistanta. Paradoxne to bol riadne zložitý prvý projekt – komunikácia cez **UART**, teda sériovú linku priamo s meničom. A zistil som, že s pomocou internetu (a neskôr AI) to **nie je raketová veda**.

Odvtedy, keď rozmýšľam nad novým projektom, prvá otázka znie: **viem na to použiť ESP?**

## Čo je ESP32

ESP32 je malý čip (a doska okolo neho) od čínskej firmy Espressif. Má v sebe:

- **WiFi a Bluetooth** – do siete sa pripojí sám, bez centrály a bez cloudu,
- **vstupy a výstupy (GPIO)** – naň pripojíš senzory, relé, LED pásy, tlačidlá,
- **sériové linky (UART, I2C, SPI)** – vie sa „rozprávať“ s meničom, BMS, klimatizáciou alebo displejom.

Doska stojí **pár eur** a zmestí sa do krabice pod vypínač.

![ESP32 vo verzii DevKit – klasická doska s USB a dvoma radmi pinov (ilustračné foto)](/img/clanky/esp32-devkit.jpg)

:::info Bez programovania: ESPHome
Najdôležitejší objav pre mňa bol **ESPHome**. Do jednoduchého YAML súboru napíšeš, čo je na ktorom pine pripojené („tu je teplomer, tu relé“), ESPHome z toho poskladá firmvér a nahrá ho do ESP. Zariadenie sa potom **samo objaví v Home Assistante** so všetkými senzormi a prepínačmi. Na väčšinu bežných vecí (senzory, relé, LED, Bluetooth) už existuje hotový komponent – len ho nastavíš.
:::

Prvé nahratie ide cez **USB kábel** z prehliadača alebo z doplnku ESPHome v HA. Každá ďalšia zmena už letí **vzduchom cez WiFi (OTA)** – ESP môže byť zabudované v stene a nemusíš ho vyberať.

## Ktoré ESP si kúpiť

Variantov je veľa a na začiatku to mätie. Na domáce projekty stačí poznať tieto:

| Čip | Čím sa líši | Na čo sa hodí |
|---|---|---|
| **ESP32** (klasika, DevKit) | 2 jadrá, WiFi + Bluetooth, veľa pinov | univerzálna voľba, Bluetooth proxy, viac senzorov naraz |
| **ESP32-C3** | 1 jadro, malé, lacné, USB-C | jednoduché senzory a relé, keď je málo miesta |
| **ESP32-S3** | viac pamäte a výkonu, USB | displeje, kamery, náročnejšie projekty |
| **ESP32-C6** | WiFi 6, vie aj **Zigbee a Thread** | keď chceš, aby zariadenie bolo v Zigbee sieti |

![ESP32-C3 Zero – doska veľkosti známky s USB-C (ilustračné foto)](/img/clanky/esp32-c3-zero.jpg)

:::tip Môj tip na začiatok
Kúp si rovno **dve-tri dosky** a pár lacných senzorov. Prvú pravdepodobne niečím „zabiješ“ alebo zabudneš v šuplíku napoly hotovú. A keď ti prvý projekt začne fungovať, druhý príde skôr, než čakáš.
:::

## Čo mi dnes doma beží na ESP

Toto je zoznam vecí, ktoré mi bežia teraz – každý deň, bez zásahu:

- **Tesla v Home Assistante lokálne** – ovládanie auta cez Bluetooth priamo z domu, bez cloudu Tesly.
- **Relé v záhrade** – dosky so 4 a 8 kanálmi na všetko, čo sa v záhrade zapína a vypína.
- **Kotol** – ovládanie plynového kotla a meranie teplôt v bojleri a na potrubiach z kotla.
- **Teploty v izbách cez LAN káble** – teplotné senzory **DS18B20** (zbernica 1-Wire) v izbách pripojené k ESP cez sieťové (LAN) káble.
- **Podsvietenie nástenného tabletu** – adresovateľný LED pás okolo displeja, ktorý farbou ukazuje stavy domu, vidno to aj z druhého konca miestnosti.
- **Klimatizácia Samsung** – staršia jednotka, ktorú výrobca prestal podporovať. S ESP je normálne v HA.
- **3 × JK BMS cez Bluetooth** – zber dát zo všetkých troch BMS mojich batérií.
- **Tri BMS a SmartShunt do meniča Deye** – ESP sa meniču tvári ako jedna batéria, posiela mu presný stav nabitia zo SmartShuntu a cez Bluetooth číta tri JK BMS, podľa ktorých plynulo znižuje nabíjací prúd. [Návod so zapojením a kódom](/energia/soc-zo-smartshunt-do-deye/).
- **„Hlúpy“ digestor ovládaný z varnej dosky (Hob2Hood)** – varná doska vysiela infračervený signál pre digestor, ESP ho zachytí a zapne digestor cez relé.
- **Meranie spotreby vody a plynu** – na **ESP32-C6**, ktoré je priamo v Zigbee sieti. [Návod so zapojením a kódom](/diy/meranie-vody-a-plynu-esp32/) (vyhral anketu nižšie).
- **Polievanie a filtrácia bazéna.**

A projekty, ktoré mi na ESP bežali v minulosti:

- meranie hladiny vody v sude na dažďovú vodu,
- ovládanie televízora cez HDMI (HDMI-CEC),
- samostatná Bluetooth proxy pre Home Assistant,
- a kopec ďalších pokusov.

:::me Ako to mám ja
Najväčšiu radosť mám z vecí, ktoré by inak stáli **veľa peňazí alebo by sa nedali kúpiť vôbec**. Digestor, ktorý reaguje na varnú dosku, by znamenal nový digestor. Presné SOC v meniči Deye by znamenalo inú batériu s „kompatibilnou“ BMS. Starú klimatizáciu by som musel vymeniť len preto, že stratila podporu. S ESP som to vyriešil za pár eur.
:::

## Čo som sa musel naučiť

Začiatky boli ťažšie. Nie preto, že by to bolo zložité, ale preto, že som nevedel, čo nepoznám. Tieto veci by som chcel vedieť hneď na začiatku:

- **Ako sa ESP správa po výpadku prúdu.** Po reštarte ESP naštartuje do stavu, ktorý mu nastavíš (`restore_mode`). Pri relé na kotle alebo polievaní je to dôležité – nechceš, aby po výpadku zostalo niečo zapnuté.
- **Čo všetko naň naraz zmestíš.** WiFi a Bluetooth zdieľajú jedno rádio a pamäť nie je nekonečná. Bluetooth proxy, niekoľko BMS a k tomu displej na jednej malej doske – to už je na hrane.
- **Ako sa správa, keď vypadne WiFi alebo Home Assistant.** Dôležitú logiku (napríklad bezpečnostné vypnutie) je lepšie mať priamo v ESP, nie v automatizácii v HA. ESP potom funguje aj vtedy, keď HA reštartuješ.
- **Napájanie.** Väčšina „záhadných“ reštartov a výpadkov je zlý zdroj alebo dlhý tenký kábel, nie chyba v kóde.

:::warn Pozor na 230 V
ESP samo pracuje s bezpečnými 3,3 V a 5 V. Akonáhle ním ale spínaš kotol, digestor alebo čerpadlo, pracuješ so sieťovým napätím. Používaj hotové reléové moduly s oddelením, všetko daj do krabice a ak si nie si istý, nech zapojenie na 230 V skontroluje elektrikár.
:::

Treba vedieť prepájať káble, trochu spájkovať a rozumieť základom elektriny. Ale je to **remeslo, ktoré sa dá naučiť** – a dnes ti s každým krokom pomôže komunita aj AI.

## Ktorý návod chceš ako prvý?

Postupne sem pridám návody na moje projekty – s presným zapojením, YAML pre ESPHome a tým, čo sa mi pri tom pokazilo. Neskôr k nim pribudne aj video. **Zahlasuj, ktorý ťa zaujíma najviac** – ten vyberiem ako prvý.

:::poll esp-navody Ktorý ESP projekt chceš ako prvý návod?
- tesla: Tesla v Home Assistante lokálne cez Bluetooth
- smartshunt-deye: SOC z Victron SmartShunt do meniča Deye
- jk-bms: 3 × JK BMS cez Bluetooth
- hob2hood: Digestor ovládaný z varnej dosky (Hob2Hood)
- klima-samsung: Stará klimatizácia Samsung v HA
- kotol: Ovládanie kotla a teploty bojlera
- teploty-lan: Teploty v izbách cez LAN káble
- zahrada-rele: Relé v záhrade (4 a 8 kanálov)
- polievanie-bazen: Polievanie a filtrácia bazéna
- led-tablet: LED podsvietenie nástenného tabletu
- voda-plyn: Meranie vody a plynu
:::

:::info Prvý návod je vonku
Anketu vyhralo **meranie vody a plynu** – návod so zapojením, schémami a kódom nájdeš tu: [Meranie vody a plynu cez ESP32](/diy/meranie-vody-a-plynu-esp32/). Hlasovať môžeš ďalej, rozhodne o ďalšom návode.
:::

Ak máš nápad na niečo, čo by sa dalo s ESP vyriešiť, alebo chceš, aby som sa pozrel na tvoj projekt, [napíš mi](/o-mne/).
