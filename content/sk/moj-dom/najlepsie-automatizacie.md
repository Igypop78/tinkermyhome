---
id: best-automations
cover: /img/clanky/titulky/automatizacie.jpg
title: 7 automatizácií, ktoré u nás naozaj fungujú – a prečo medzi nimi nie sú svetlá
description: Moje najlepšie automatizácie v Home Assistante po 13 rokoch smart domácnosti – príchod a odchod, chladnička, voda, kúrenie, výpadok elektriny, zvonček s kamerou, digestor a brána. Čo robia, ako ich mám zapojené a prečo medzi nimi nie sú svetlá.
section: home
level: 1
date: 2026-11-19
time: '21:00'
slug: najlepsie-automatizacie
tldr: Najlepšie automatizácie u nás **strážia, upozornia a ušetria starosti** – príchod a odchod, otvorená mraznička, tečúca voda, kúrenie izba po izbe, **výpadok elektriny**, zvonček s fotkou na mobil, digestor, ktorý sa zapne sám, a brána, ktorá sa otvorí pri zaradení D. **Svetlá medzi nimi nie sú** – tam je pre mňa hlavný prínos ovládanie z lepšieho miesta, nie automatika.
---

Keď sa ľudia pýtajú na smart dom, väčšinou čakajú svetlá, ktoré sa samy zapínajú. U nás je to inak. Najlepšie automatizácie sú tie, **ktoré si skoro nevšimneš** – kým raz nezachránia potraviny, neupozornia na tečúcu vodu alebo ti nepovedia, že doma vypadol prúd.

Toto je sedem automatizácií, ktoré mi za tie roky dokázali, že majú zmysel. Všetky bežia v Home Assistante a každú opíšem tak, ako ju mám doma.

## 1. Príchod a odchod – kto je doma

Home Assistant vie, kto je doma, vďaka **aplikácii Home Assistant v mobile** – podľa polohy a toho, že sa mobil po príchode **pripojí na domácu WiFi**. Na prítomnosť je naviazané aj **zabezpečenie domu**.

:::tip Čo to znamená
Každý člen domácnosti má v Home Assistante svoju osobu (`person`). Keď sú všetci preč, dom vie, že je prázdny – a môže sa podľa toho správať.
:::

Prítomnosť je základ, na ktorom stoja ďalšie automatizácie – napríklad brána v bode 7.

## 2. Upozornenia, ktoré zachránia potraviny aj podlahu

Toto je kategória, ktorá sa mi vrátila najviac.

- **Otvorená chladnička alebo mraznička.** Na dvierkach mám senzory – keď ostanú otvorené, príde upozornenie. **Neraz to zachránilo potraviny.**
- **Dlho tečúca voda.** Vodu meriam priebežne, takže vidím okamžitý prietok. Keď voda tečie podozrivo dlho, príde správa – napríklad pri zaseknutom splachovači, ktorý by za deň vedel pustiť až 10 000 litrov. Viac v článku [Začni meraním spotreby](/energia/zacni-meranim-spotreby/).
- **Voda na podlahe.** V kuchyni a kúpeľniach sú senzory zatopenia.

## 3. Kúrenie, ktoré naozaj funguje

V každej izbe je presne taká teplota, aká má byť. Znie to banálne, ale s jedným termostatom pre celý dom to nikdy nefungovalo.

Každá izba má vlastný **virtuálny termostat** a panel **Aqara W100**, na ktorom sa nastaví teplota. Ventily na radiátoroch spínajú relé a **kotol sa zapne, len keď kúri aspoň jedna izba**. Keď niekto otvorí okno na dlhšie ako 2 minúty, kúrenie v tej izbe sa vypne. Celý postup aj s YAML je v článku [Smart kúrenie](/moj-dom/smart-kurenie/).

## 4. Výpadok elektriny – správa hneď, aj keď nie som doma

Jedna z najužitočnejších vecí v celom dome. Keď vypadne prúd, hneď o tom viem.

Často mi vyhadzovalo **istič na ulici**. Vďaka upozorneniu som mohol konať hneď, aj na diaľku, keď nikto nebol doma – stačilo poprosiť suseda, aby ho nahodil. Inak by mraznička a všetko ostatné čakali, kým prídeme domov.

:::me Ako to mám ja
Na ESP mám jedno voľné relé, ktoré je stále zopnuté (**always ON**). Keď vypadne prúd, relé sa rozopne. Na jeho kontakty je prispájkovaný **dverový senzor Aqara** – a ten sa „otvorí“ ako dvere. Home Assistant potom pošle notifikáciu cez **Pushover**.
:::

:::warn Bez záložného napájania to nepôjde
Aby ti Home Assistant mohol poslať správu, keď v dome nie je prúd, musí bežať ďalej – a s ním aj sieť a internet. Celý môj homelab je preto na **záložnej batérii**. Bez nej sa o výpadku dozvieš, až keď sa prúd vráti.
:::

## 5. Zvonček s kamerou – viem, kto zvoní, aj keď nie som doma

Keď niekto stlačí zvonček, príde mi na mobil správa **„Niekto zvoní“ aj s fotkou z kamery**. Takže viem, kto stojí pred bránou, aj keď nie som doma. 🙂 Zároveň doma zo **Sonosu** zaznie vlastné „dong dong“.

:::me Ako to mám ja
Tlačidlo zvončeka je od **IKEA**, kamera **Aqara G5** a zvuk ide cez reproduktory **Sonos**.
:::

## 6. Digestor, ktorý sa zapne sám

Často sa stalo, že niekto z rodiny zabudol pri varení zapnúť odsávanie – a celý dom potom voňal varením. Dnes sa digestor zapne sám, keď sa zapne varná doska.

:::me Ako to mám ja
Varná doska vysiela infračervený signál pre digestor (**Hob2Hood**). Náš digestor ho nevie prijať, tak ho zachytí **ESP32** a digestor zapne cez relé. Nový digestor netreba. Viac v článku [ESP32 – moje projekty](/diy/esp32-moje-projekty/).
:::

## 7. Brána sa otvorí sama – pri príchode aj pri zaradení D

Diaľkové ovládanie brány do ruky už nechytám.

- **Príchod:** keď sa blížim domov a auto ešte nie je doma, brána sa otvorí sama. Home Assistant to pozná podľa **polohy z aplikácie v mobile**.
- **Odchod:** ráno stačí na Tesle **zaradiť D** a brána sa otvorí.

:::me Ako to mám ja
Bránu spína **Shelly**. Teslu mám v Home Assistante lokálne cez **ESP a Bluetooth** – a keďže ESP má dosah len doma, platí to dvojako: keď auto nie je pripojené, nie je doma (príchod), a keď zaradím D, auto určite stojí na dvore (odchod).
:::

## A čo svetlá?

Všimol si si, že medzi nimi nie sú svetlá? Nie je to náhoda.

Automatické svetlá považujem za **základ tam, kde to naozaj dáva zmysel**. Väčšinu svetiel ale zapíname vypínačom alebo ovládačom – naše potreby sa menia z večera na večer a automatika by viac obťažovala, ako pomáhala.

Hlavnú výhodu smart svetiel vidím inde: **môžem ich ovládať z miesta, ktoré je vhodnejšie ako pôvodný vypínač**. Napríklad v spálni od postele, bez nutnosti vstávať. Ako na to, aby smart svetlo fungovalo aj s vypínačom, je v článku [Smart žiarovka a vypínač](/zacni-tu/smart-ziarovka-a-vypinac/).

## Čo majú spoločné

1. **Riešia skutočný problém** – pokazené potraviny, vodu na podlahe, studenú izbu, vypnutý istič.
2. **Nikoho neobmedzujú** – ručné ovládanie ostáva.
3. **Väčšinou len upozornia** – rozhodnutie nechávajú na človeku.
4. **Bežia lokálne** – aj Tesla a digestor idú cez ESP, nie cez cloud.

Tieto princípy podrobnejšie rozoberám v článku [6 zásad, podľa ktorých staviam smart dom](/moj-dom/zasady-smart-domu/).

## Chceš YAML?

Ku ktorej automatizácii chceš podrobný návod aj s YAML na skopírovanie? **Zahlasuj** – tú, ktorá vyhrá, spíšem ako prvú.

:::poll automatizacie-yaml Ku ktorej automatizácii chceš návod s YAML?
- pritomnost: Príchod a odchod
- chladnicka-voda: Chladnička, mraznička a voda
- vypadok: Výpadok elektriny cez relé a Aqara senzor
- zvoncek: Zvonček s fotkou a Sonosom
- digestor: Digestor z varnej dosky
- brana: Brána podľa polohy a zaradenia D
:::

Ak máš otázku k niektorej z nich alebo vlastný nápad, [napíš mi](/o-mne/).
