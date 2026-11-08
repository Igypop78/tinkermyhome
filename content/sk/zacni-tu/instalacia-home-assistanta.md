---
id: ha-install
title: Inštalácia Home Assistanta – všetky spôsoby a čo je podľa mňa najlepšie
description: Home Assistant OS alebo Container, Raspberry Pi, mini PC, Home Assistant Green alebo Proxmox – na čom spustiť Home Assistant a čo si na začiatku pripraviť.
section: start
level: 1
step: 2
date: 2026-11-08
time: '19:55'
slug: instalacia-home-assistanta
tldr: Dnes sú oficiálne len dve cesty – **Home Assistant OS** a **Container**. Začiatočníkovi odporúčam HA OS na samostatnom zariadení, ktoré beží 24/7 – hotový **Home Assistant Green**, **mini PC** alebo **Raspberry Pi**. Výkon nie je dôležitý, spotreba áno. Proxmox a virtuálne stroje nechaj na neskôr.
---

Home Assistant sa dá rozbehať takmer na čomkoľvek. Práve preto je na začiatku ťažké vybrať. V tejto časti ti ukážem, aké cesty existujú, čo si pripraviť a čo by som na začiatku zvolil ja. Nebude to návod klik po kliku – tých je internet plný. Skôr upozorním, na čo si dať pozor, aby si sa vyhol chybám, ktoré som spravil ja.

Najprv však to najdôležitejšie: **čas a chuť**. Na začiatku to chce chuť vyskúšať a naučiť sa niečo nové. Ak ti to chýba, kúp si radšej hotový systém (napríklad IKEA, Aqara, Google Home) a zmier sa s jeho obmedzeniami.

## Dve oficiálne cesty

Kedysi existovali štyri spôsoby inštalácie. Od verzie 2025.12 sú oficiálne podporované už len dva – spôsoby Core a Supervised Home Assistant [ukončil](https://www.home-assistant.io/blog/2025/05/22/deprecating-core-and-supervised-installation-methods-and-32-bit-systems/). Ak natrafíš na starší návod, ktorý ich odporúča, preskoč ho.

| | Home Assistant OS | Home Assistant Container |
|---|---|---|
| Čo to je | Celý operačný systém pripravený len pre HA | HA ako Docker kontajner na tvojom systéme |
| Aplikácie (doplnky) | áno, inštaluješ jedným klikom | nie, všetko si riešiš sám |
| Zálohy a aktualizácie | z rozhrania HA | ručne |
| Pre koho | **pre väčšinu ľudí** | pre tých, čo už Docker poznajú |

Aplikácie sú napríklad Zigbee2MQTT, Mosquitto alebo zálohovanie – bez nich prídeš o veľkú časť pohodlia. Preto pre začiatok jednoznačne **Home Assistant OS**.

## Na čom ho spustiť

Odporúčam samostatné zariadenie, ktoré môže bežať 24/7. Výkon tu nie je až taký podstatný, Home Assistant nie je náročný. Dôležitá je **spotreba** – zariadenie pobeží celý rok bez prestávky.

| Zariadenie | Výhody | Na čo si dať pozor |
|---|---|---|
| Home Assistant Green | Hotová krabička od tvorcov HA, HA OS je už nainštalovaný – zapojíš kábel a ideš | Nemá Zigbee ani Z-Wave, adaptér treba dokúpiť |
| Raspberry Pi | Lacné, malé, nízka spotreba | Kvalitná SD karta je nutnosť – lacná ti skôr či neskôr odíde aj s dátami |
| Mini PC | Výkon do budúcna, často lacno ako repasovaný kus | Mal by mať LAN port, ideálne aj Bluetooth a aspoň 2 USB porty; pozor na spotrebu |
| Virtuálny stroj (Proxmox) | Jeden počítač zvládne HA aj ďalšie veci | Ďalšia vrstva, ktorej treba rozumieť – na začiatok zbytočne zložité |

Ak natrafíš na Home Assistant Yellow, vedz, že ho už nevyrábajú ([oznámenie z októbra 2025](https://www.home-assistant.io/blog/2025/10/15/yellow-end-of-life/)). Ak ho už máš, funguje a dostáva aktualizácie ďalej.

## Čo budeš potrebovať okrem počítača

- **Sieťový kábel.** Home Assistant patrí na kábel, nie na WiFi.
- **Adaptér pre tvoj štandard** – USB alebo sieťový adaptér pre Zigbee, Z-Wave alebo Thread. Ktorý potrebuješ, záleží od toho, akú cestu si zvolíš – o tom je [ďalšia časť](/zacni-tu/zigbee-wifi-zwave-matter/). Ak budeš mať len WiFi zariadenia (napr. Shelly), zatiaľ ho nepotrebuješ.
- **Miesto na zálohy** mimo zariadenia – NAS, iný počítač alebo cloud. Prečo, vysvetľujem v [6 zásadách](/moj-dom/zasady-smart-domu/).

## Moje odporúčanie

Nekomplikuj si to. Začni so **samostatným zariadením s Home Assistant OS** – Home Assistant Green, ak chceš pokoj, alebo mini PC či Raspberry Pi, ak chceš ušetriť a nebojíš sa trochu kutiť.

Na virtuálne stroje a Proxmox príde čas, keď budeš chcieť na jednom počítači rozbehať aj ďalšie veci. Presun je jednoduchý: záloha zo starého zariadenia a obnova na novom.

:::me Ako to mám ja
Začínal som s Raspberry Pi, ktoré som raz odložil do šuplíka (viac v [mojej ceste](/moj-dom/moja-cesta-smart-domacnostou/)). Dnes mi Home Assistant beží ako virtuálny stroj na HP mini PC s Proxmoxom. Ten istý počítač zvláda aj kamery (Frigate), NAS a ďalšie kontajnery. Zálohy ukladám na druhé mini PC s Proxmox Backup Serverom a oba sú zálohované batériou. Zigbee a Z-Wave mi obsluhuje multi-radio adaptér SLZB-MRW10U.
:::

## Po inštalácii

- **Do Home Assistanta nechodíš priamo na tom počítači.** Otvoríš ho z mobilu alebo notebooku v prehliadači, zvyčajne na adrese `http://homeassistant.local:8123`. Ak to nefunguje, nájdi IP adresu zariadenia v routeri a pridaj `:8123`.
- **Preklikaj si celé prostredie.** Na začiatku pôsobí neohrabane, ale všetko má svoj účel, ktorý oceníš neskôr.
- **Pridaj, čo HA sám našiel.** Ak máš doma zariadenia v rovnakej sieti, HA ich často nájde sám. Pokojne ich pridaj a sleduj, ako sa správajú ich entity. Čo je entita a zariadenie, vysvetľuje [prvá časť](/zacni-tu/home-assistant-pre-zaciatocnikov/).
- **Hneď nastav zálohy.** V nastaveniach HA zapni automatické zálohy a ulož ich mimo zariadenie. Neskôr na to zabudneš.
- **Premysli názvy a miestnosti** skôr, než pridáš desiatky zariadení. Ušetríš si dni upratovania.

V ďalšej časti: **Zigbee, WiFi, Z-Wave alebo Matter – ktorou cestou ísť**.
