---
id: pattern-pilot
cover: /img/clanky/titulky/pattern-pilot.jpg
title: Pattern Pilot – Home Assistant, ktorý sa učí, čo robíš ručne, a navrhne automatizácie
description: Moja HACS integrácia Pattern Pilot sleduje, čo doma robíme ručne, hľadá súvislosti medzi vodou, elektrinou, pohybom a svetlami a navrhne automatizácie s dôkazom z histórie. Všetko lokálne, bez cloudu a bez AI.
section: projects
level: 2
date: 2026-11-15
time: '18:00'
slug: pattern-pilot
tldr: Smart dom je smart vtedy, keď veci robí za teba. **Pattern Pilot** je moja integrácia pre Home Assistant, ktorá sleduje, čo doma robíš **ručne**, učí sa súvislosti (voda, elektrina, pohyb, typ dňa) a po pár týždňoch navrhne automatizácie – každú s **dôkazom z vlastnej histórie**. Sama nič nespustí, beží len lokálne. Je zatiaľ **vo vývoji** (verzia 0.2.0), zber dát u mňa beží od 4. novembra.
---

Smart dom je naozaj smart až vtedy, keď veci robí za teba. Väčšina z nás si ani neuvedomuje, koľko drobných rutinných vecí cez deň robí ručne – a koľko z nich by sa dalo zautomatizovať. Alebo si myslíme, že naše návyky sú také nepravidelné, že ich automatizovať nejde.

Lenže veľa vecí doma spolu súvisí. Keď ráno skočí odber vody, niekto je hore a sprchuje sa. Je teda dosť pravdepodobné, že ranná automatizácia by sa mala spustiť. A naopak: keď je sviatok alebo ležíme doma chorí, voda netečie, kanvica nevrie – a ranná rutina sa nespustí. Rovnako to funguje s odberom elektriny, pohybom v miestnostiach či svetlami.

Presne tieto súvislosti sleduje **Pattern Pilot**. V tomto článku ukážem, prečo vznikol, ako funguje, čo všetko ma naučil môj vlastný dom počas prvých 12 dní a ako si ho môžeš vyskúšať aj ty.

:::warn Vo vývoji
Pattern Pilot je čerstvý projekt – verzia **0.2.0**, prvé verzie vznikli za 12 dní (4.–15. 11. 2026). U mňa zbiera dáta od 4. novembra. Návrhy sú zatiaľ predbežné, plné budú po 21 dňoch, teda okolo 25. novembra. Článok potom doplním o skutočné návrhy z nášho domu.
:::

## Ako to začalo: auto o 7:20

Mám automatizáciu, ktorá každé ráno o 7:20 predhrieva auto. Funguje spoľahlivo – až na dni, keď do práce nejdem. Vtedy sa auto vyhreje úplne zbytočne.

Pritom v dni, keď do práce idem, sa doma deje niekoľko vecí, ktoré to jasne prezrádzajú. Okolo 6:40 vstávanie, svetlá, sprcha, odber vody, káva, pohyb vo viacerých miestnostiach. Dom to „vie“ skôr ako ktorýkoľvek kalendár.

Z toho vznikla otázka: **nemohol by Home Assistant sám zistiť, čo robím ručne a opakovane, a navrhnúť mi automatizáciu?**

Nehľadal som „AI, ktorá vymyslí automatizácie“. Chcel som nástroj, ktorý:

- **pozerá na skutočné správanie** v dome, nie na zoznam zariadení,
- každý návrh vie **vysvetliť a overiť na histórii**,
- **sám nič nespúšťa** – posledné slovo mám ja.

## Čo je Pattern Pilot

Pattern Pilot je integrácia pre Home Assistant, ktorú nainštaluješ cez HACS. Sleduje, čo ľudia doma robia ručne, učí sa rutiny a navrhuje automatizácie. Pri každom návrhu ukáže dôkaz z tvojej vlastnej histórie, napríklad „9 z 9 pracovných dní, v spätnom teste 0 zbytočných spustení“. Automatizácia vznikne až po kliknutí na **Prijať**.

Všetko ostáva doma: žiadny cloud, žiadne veľké jazykové modely (LLM). A nič netreba nastavovať ručne – senzory, počítadlá z Energy panela, sviatky aj počasie si nájde sama.

Takto vyzerá záložka **Návrhy** v karte, ktorá je súčasťou integrácie:

![Karta Pattern Pilot – záložka Návrhy (ilustračný náhľad na ukážkových dátach)](/img/clanky/pattern-pilot-navrhy-ilustracia.png)

*Ilustračný náhľad karty vo verzii 0.2.0 na ukážkových dátach. Skutočné návrhy z nášho domu doplním po 25. 11.*

## Ako to funguje

Zjednodušene v šiestich krokoch:

![Schéma: zber, udalosti, súvislosti, nočná analýza, spätný test, tvoje rozhodnutie](/img/clanky/pattern-pilot-schema-sk.svg)

1. **Zber – a kto to urobil.** Integrácia počúva zmeny v dome a pri každej zisťuje, kto ju spôsobil: ty v aplikácii alebo hlasom, vypínač či ovládač na stene (zmena „mimo HA“), automatizácia, iná integrácia, alebo samotné zariadenie – napríklad termostat podľa vlastného programu. Toto rozlíšenie je kľúčové. Návrhy dávajú zmysel len z toho, čo robíš **ty**.
2. **Udalosti namiesto čísel.** Zo senzorov si neukladá surové hodnoty, len to podstatné: „vlhkosť v kúpeľni prudko stúpla“ (sprcha), „odber skočil“ (kanvica), „začala tiecť voda“.
3. **Súvislosti.** Pri každej ručnej akcii si zapamätá typ dňa (pracovný, víkend, sviatok), či je tma, výšku slnka, vonkajšiu teplotu a koľko ľudí je doma.
4. **Vlastná história.** Má vlastnú databázu na 120 dní, nezávislú od recordera. Bežný recorder v Home Assistante drží 10 dní – na hľadanie návykov to nestačí.
5. **Analýza každú noc.** Hľadá vzory a každý overí spätným testom: „prehrá“ ho na histórii a spočíta, koľkokrát by sa strefil a koľkokrát by sa spustil zbytočne.
6. **Rozhodnutie je na tebe.** Prijať, Upraviť, Teraz nie, alebo Nikdy.

:::info Čo je recorder
Recorder je časť Home Assistanta, ktorá ukladá históriu stavov do databázy. Predvolene drží 10 dní. Dá sa predĺžiť, ale databáza potom rýchlo rastie – preto má Pattern Pilot vlastnú, oveľa menšiu.
:::

## Aké návrhy dáva

Verzia 0.2.0 pozná tri druhy návrhov:

| Druh | Čo znamená | Príklad |
|---|---|---|
| **Časový návyk** | rovnakú vec robíš ručne v podobnom čase | „Obývačka – zapnúť hlavné svetlo okolo 16:50 v pracovné dni, keď je tma“ |
| **Po A nasleduje B** | po pohybe, otvorení dverí, tlačidle alebo príchode domov urobíš do 90 sekúnd to isté | „Kúpeľňa hore – zapnúť zrkadlo pri pohybe 6:10–8:00“ |
| **Vylepšenie automatizácie** | existujúcu automatizáciu opakovane hneď vrátiš späť | „Spálňa – synchronizácia svetiel: často ju rušíš“ |

Ten tretí druh ma osobne baví najviac. Automatizácia, ktorú stále ručne opravuješ, nie je pomocník, ale otravník – a ty si to často ani nevšimneš.

Aby návrhy neboli náhodné, majú prísne prahy:

- **Časový návyk:** aspoň 5 dní a 60 % vhodných dní. V spätnom teste by sa zbytočne spustil najviac 2× týždenne. Nenavrhne nič, čo už robí iná automatizácia.
- **Po A nasleduje B:** aspoň 5×, vysvetľuje aspoň polovicu ručných akcií a nasleduje aspoň po 40 % spúšťačov v danom čase. Opakovaný pohyb do 10 minút sa ráta ako jedna udalosť.
- **Vylepšenie:** aspoň 3 zrušenia za 14 dní.

:::warn Bezpečnosť
Pattern Pilot nikdy nenavrhne zámky, alarm, ventily ani otváranie garáže, brány či dverí. A nikdy nenavrhne entity, ktoré si vylúčil.
:::

Keď návrh prijmeš, vznikne normálna automatizácia v Home Assistante s menom „Miestnosť – čo robí“ a s dôkazom v popise. Spustí sa len vtedy, keď zariadenie ešte nie je v cieľovom stave – nezapína svetlo, ktoré už svieti.

## Karta: čo sa v dome naozaj deje

Okrem návrhov má karta záložku **Prehľad**. Ukazuje priebeh učenia („Deň 12 z 21“), rytmus dňa (ručné akcie po hodinách, dnes oproti priemeru), kto ovláda dom a čo robíš ručne najčastejšie. Kartu netreba nič kopírovať ani pridávať ako zdroj – je súčasťou integrácie.

![Karta Pattern Pilot – záložka Prehľad v našom dome na 12. deň](/img/clanky/pattern-pilot-prehlad-den-12.png)

*Skutočný Prehľad z nášho domu na 12. deň (anglické rozhranie). Všimni si zrkadlo v kúpeľni dvakrát – presne tú chybu opisujem nižšie.*

Úprimne, už len ten Prehľad mi otvoril oči. Nikdy predtým som nevidel, kto vlastne môj dom ovláda.

:::me Ako to mám ja – kto ovláda môj dom (deň 12)
- automatizácie **62 %**,
- mimo HA – vypínače a ovládače **24 %**,
- ja a rodina v aplikácii alebo hlasom **6 %**,
- iné integrácie **5 %**,
- programy zariadení **3 %**.

Najväčší kus „ručnej práce“ teda nie je v aplikácii, ale na stenách – vypínače. A práve tam je najviac kandidátov na automatizáciu.
:::

## Vývoj na skutočnom dome: čísla a chyby

Pattern Pilot som vyvíjal priamo na našom dome. Verzie 0.1.0 až 0.2.0 vyšli za 12 dní. A realita ma veľmi rýchlo vytrestala.

### Prvý deň: väčšina „ručných“ akcií bola falošná

Za prvý deň integrácia zaznamenala **4 760 udalostí, z toho 263 „ručných“**. Väčšina z nich ručná nebola. Na vrchole rebríčka:

- **brána** – máme spoločnú bránu, ktorú otvárajú aj susedia vlastnou aplikáciou priamo na zariadení, takže to vyzeralo ako ručná akcia mimo HA,
- **dve žiarovky v záhrade**,
- **termostat**, ktorý mení teplotu podľa vlastného programu.

Ani jedno z toho nie je „moja rutina“. Musel som riešiť štyri veci.

### Problém 1: Zigbee odpovedá neskoro

Zariadenia cez Zigbee2MQTT a MQTT potvrdia nový stav o chvíľu neskôr a bez pôvodnej stopy, kto príkaz poslal. Pre Home Assistant to potom vyzerá, akoby niekto stlačil vypínač na stene.

**Riešenie:** integrácia si pamätá príkazy z Home Assistanta. Stav, ktorý príde do 10 sekúnd, pripíše tomu, kto príkaz poslal.

### Problém 2: skupiny

Skupina „Svetlá hore“ sa zmení zakaždým, keď sa zmení ktorékoľvek svetlo v nej. V „ručných“ akciách bola **133×**. Súhrnné senzory, napríklad pohyb v celom dome, zase zdvojovali udalosti.

**Riešenie:** skupiny sa nezaznamenávajú, zaznamenávajú sa ich členovia. Príkaz na skupinu sa pripíše jej členom.

Pri skupinách zo Zigbee2MQTT to však nefungovalo dve verzie po sebe. Párovanie padalo na zariadení inej integrácie, ktoré má neštandardný identifikátor. Až diagnostika ukázala „5 skupín nájdených, 0 spárovaných“ – a potom to bola oprava na pár riadkov.

### Problém 3: jedno zrkadlo, dve entity

Spínač zrkadla v kúpeľni mám cez pomocníka „Zmeniť typ spínača“ prerobený na svetlo. Home Assistant tak má dve entity pre to isté zariadenie – a Pattern Pilot rátal zrkadlo dvakrát: **133× a 125×**. Na screenshote vyššie to ešte vidno.

**Riešenie:** skryté entity sa ignorujú, okrem členov skupín.

### Problém 4: šum

| | Deň 7 | Deň 12 |
|---|---|---|
| Udalostí za deň | ~17 000 | ~8 000 |

Na 7. deň robili najviac hluku:

- **kamera s detekciou pohybu** – 1 343 pohybov za deň, stromy vo vetre,
- **automatizácia upozornenia na pohyb** – 900 behov za deň,
- **výkony batérie a FVE**, ktoré sa menia podľa slnka.

**Riešenie:**

- blikajúci pohyb sa zlučuje – vypne a do minúty zapne = jedna aktivita,
- beh tej istej automatizácie sa zapíše najviac raz za 10 minút,
- z Energy panela sa berie len spotreba, nie výroba ani batéria.

### Databáza

Kompaktný formát ušetril asi **57 % miesta** (v teste 16 MB → 6,8 MB za 7 dní). U nás teraz databáza rastie o ~0,7 MB za deň, za 120 dní je to teda ~85 MB.

### Čo ma to naučilo

Najťažšia časť nebolo hľadanie vzorov, ale **univerzálnosť**. Každý dom je iný. Pôvodne sprievodca nastavením chcel, aby si vybral vlhkomer v kúpeľni, výkon a vodomer – lenže to bol len môj dom. Dnes integrácia nič z toho nevyžaduje. Každý senzor sa naučí sám.

## Pre pokročilých: ako to funguje pod kapotou

:::tip Technické detaily
- **Kto to urobil:** podľa `context` udalosti. `user_id` = človek, kontext behu automatizácie alebo skriptu (z `automation_triggered` / `script_started`) = automatizácia, bez kontextu = „mimo HA“.
- **Párovanie príkazov:** `call_service` s cieľom na entitu, zariadenie alebo miestnosť a na členov skupín – aj skupiny Zigbee2MQTT cez `bridge/groups` a `unique_id` MQTT entít.
- **Univerzálny detektor zmien:** každý senzor sa 24 hodín učí svoje bežné kolísanie (medián 10-minútových rozsahov), potom hlási len výrazné nárasty a poklesy. Minimálne prahy podľa typu (vlhkosť 4 %, teplota 1 °C, výkon 300 W…), citlivosť nízka / stredná / vysoká. Naučené profily prežijú reštart.
- **Počítadlá z Energy panela** sa prevádzajú na rýchlosť spotreby – „spotreba začala / skončila“.
- **Sviatky** podľa krajiny nastavenej v HA, knižnica `holidays` (rovnaká ako integrácia Workday).
- **Spätný test:** návrh sa prehrá na histórii a ukáže zásahy aj zbytočné spustenia.
- **Kvalita:** testy bežia v skutočnom Home Assistante v GitHub Actions (`pytest-homeassistant-custom-component`), plus hassfest a HACS validácia. Release sa vytvorí automaticky.
:::

## Súkromie

- Všetko ostáva v priečinku `/config` tvojho Home Assistanta – vlastná SQLite databáza, nič neodchádza von.
- Neukladajú sa surové hodnoty senzorov, len udalosti.
- Diagnostika neobsahuje ID používateľov.

## Porovnanie s inými projektmi

Pattern Pilot nie je prvý nápad tohto druhu. Férovo, stav k novembru 2026:

| Projekt | Ako funguje | Rozdiel oproti Pattern Pilot |
|---|---|---|
| [AI Automation Suggester](https://github.com/ITSpecialist111/ai_automation_suggester) | pošle prehľad zariadení, miestností a automatizácií do jazykového modelu (cloud alebo lokálny), ten vymyslí návrhy | nesleduje správanie, potrebuje AI poskytovateľa |
| [Automation Suggestions](https://github.com/Danm72/home-assistant-automation-suggestions) (Danm72) | z logbooku hľadá ručné akcie opakované v podobnom čase, upozorní aj na nepoužívané automatizácie | len čas jednej entity, bez súvislostí medzi zariadeniami |
| [Automation Miner](https://github.com/nutstownwarrior/automation_miner) | add-on, hľadá pravidlá a postupnosti v recorderi, rozlišuje kto čo urobil, robí spätný test | koncepčne najbližší a rýchlo sa vyvíja; je to add-on (nie integrácia) a závisí od dĺžky histórie v recorderi |
| [TaraHome](https://github.com/TaraHome/taraassistant-public) | samostatný „sidecar“, ktorý sleduje akcie v Home Assistante a hľadá návyky | beží mimo HA, nie cez HACS |

Čím je Pattern Pilot iný: je to bežná integrácia cez HACS, má vlastnú dlhú históriu, presne rozlišuje „kto to urobil“ (aj pri oneskorenom Zigbee), funguje bez nastavovania, je v slovenčine aj angličtine a má vlastnú kartu.

## Inštalácia krok za krokom

Potrebuješ Home Assistant **2025.6** alebo novší (ikona integrácie sa zobrazuje od 2026.3) a nainštalovaný HACS.

1. **HACS → ⋮ → Custom repositories** → vlož `https://github.com/Igypop78/pattern-pilot`, typ **Integration**.
2. Nainštaluj **Pattern Pilot** a reštartuj Home Assistant.
3. **Nastavenia → Zariadenia a služby → Pridať integráciu → Pattern Pilot**.
4. Sprievodca má dva kroky:
   - **Vitaj:** dĺžka histórie (predvolene 120 dní), čas nočnej analýzy, citlivosť.
   - **Čo sledovať:** predvolene celý dom. Voliteľne vylúč entity a „používateľov“, ktorí nie sú ľudia – napríklad Node-RED.
5. Na dashboard pridaj kartu **Igy Pattern Pilot Card**.
6. Nechaj ju zbierať dáta. Prvé predbežné návrhy sa objavia po pár dňoch, spoľahlivé po ~3 týždňoch.

:::me Ako to mám ja
Hneď na začiatku som vylúčil spoločnú bránu, ktorú používa 10 domov. Tip pre teba: vylúč všetko, čo ovládajú iní ľudia mimo tvojej rutiny – inak ti budú strašiť v rebríčku „ručných“ akcií.
:::

## Čo príde ďalej

- **Rutiny.** Integrácia rozpozná napríklad „rannú rutinu pracovného dňa“ a použije ju ako spúšťač. Tým sa konečne vyrieši aj moje auto: predhrievať ho len vtedy, keď ráno naozaj začala rutina.
- **Zabudnuté veci** – svetlo svieti v prázdnej miestnosti.
- **Podmienky aj pre „po A nasleduje B“** – len keď je tma, len cez týždeň.
- **Notifikácia s tlačidlami** Prijať / Nikdy, aby si nemusel chodiť do karty.

## Vyskúšaj a daj vedieť

Pattern Pilot je open source pod licenciou MIT: [github.com/Igypop78/pattern-pilot](https://github.com/Igypop78/pattern-pilot).

Nainštaluj ho, nechaj ho bežať tri týždne a pošli mi screenshot návrhov – na [ahoj@tinkermyhome.com](mailto:ahoj@tinkermyhome.com). Ak niečo nefunguje alebo ti integrácia navrhne nezmysel, založ issue na GitHube. Každý dom je iný, a práve na tých iných domoch sa Pattern Pilot naučí najviac.
