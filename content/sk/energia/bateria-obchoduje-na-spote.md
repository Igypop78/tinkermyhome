---
id: fve-payback
title: Batéria, ktorá obchoduje – riadenie FVE podľa spotových cien s AI Energy
description: Ako moja batéria nakupuje elektrinu v nízkej tarife a predáva ju za spotové ceny. Reálny deň v grafe, logika AI Energy, ovládanie Deye z Home Assistanta a čísla za prvé dva mesiace.
section: energy
level: 3
date: 2026-11-08
time: '22:30'
slug: bateria-obchoduje-na-spote
tldr: Od septembra predávam elektrinu za **spotové ceny** a nakupujem stále za **pevnú dvojtarifu**. Batériu v nízkej tarife nabijem za 0,12 €/kWh a predám ju v drahých 15-minútových úsekoch – ráno aj večer. Plánuje to moja integrácia **AI Energy**, menič Deye prepína automatizácia v Home Assistante. Elektrina mi za september a október zarobila **352 €**, v júli a auguste s virtuálnou batériou a o 65 % väčšou výrobou FVE len **95 €**.
---

Často počúvam, že batéria k fotovoltike sa síce hodí, ale nikdy sa nezaplatí. Moja batéria dnes obchoduje s elektrinou dvakrát denne a v októbri – s polovicou slnka oproti júlu – zarobila trikrát viac ako v lete. V tomto článku ukážem, ako to funguje, čo k tomu treba a aké sú reálne čísla.

:::warn Pre pokročilých
Článok predpokladá, že máš FVE s batériou, menič ovládateľný z Home Assistanta a vieš, čo je HACS. Ak nie, začni sériou [Začni tu](/zacni-tu/home-assistant-pre-zaciatocnikov/).
:::

## Čo tomu predchádzalo

Na spot som pokukoval dlhšie. S batériou 34 kWh mám reálnu možnosť posielať do siete veľa energie naraz. Virtuálna batéria od ZSE však za výkup ponúkala len zlomok toho, za čo sa elektrina na spote obchodovala.

Kým som bol na virtuálnej batérii, snažil som sa prebytky spotrebovať doma. Von som tlačil len to, čo som už nevedel spáliť – za pár centov.

Zlom prišiel, keď som sa od komunity dozvedel dve veci: aj **fyzická osoba môže predávať za spotové ceny** a zároveň môžem **nakupovať ďalej za pevnú cenu**. Od 1. 9. 2026 som na spote. Najprv som batériu riadil len hrubo, ručnými pravidlami. Potom vznikla integrácia AI Energy – naostro som ju pustil hneď na druhý deň po vytvorení a bolo vidno, že to funguje.

Skúšal som aj hotový [Predbat](https://github.com/springfall2008/batpred), ale bol mi príliš zložitý. Chcel som vlastnú, priehľadnú logiku. Chcem vedieť, čo sa v dome deje a prečo.

## Ako to funguje v skratke

Celý trik je v tom, že **nakupujem a predávam za iné ceny**:

| | Za koľko | Ako to mám ja |
|---|---|---|
| **Nákup** | pevná dvojtarifa | ZSE, sadzba DD3: nízka tarifa (NT) ~0,12 €/kWh, vysoká (VT) ~0,21 €/kWh vrátane distribúcie |
| **Predaj** | spotová cena mínus poplatok | V-elektra: spot OKTE − 15 €/MWh |

Spotová cena sa mení každých 15 minút a ceny na nasledujúci deň sú známe deň vopred. Ráno a hlavne večer bývajú vysoko, cez deň a v noci nižšie.

Batéria teda v NT nakúpi za pevných 120 €/MWh a predá v najdrahších 15-minútových úsekoch. Keďže nákup je pevný, je mi jedno, aký je spot v čase nabíjania.

:::info Jednotky
Spotové ceny sa uvádzajú v €/MWh. 120 €/MWh = 0,12 €/kWh, 600 €/MWh = 0,60 €/kWh.
:::

## Jeden reálny deň

Takto vyzerá plán AI Energy na pondelok 9. novembra 2026. Modrá čiara je spotová cena, prerušovaná čiara predajná hranica, farby ukazujú, čo robí batéria, a dole je stav nabitia batérie.

![Spotové ceny a plán batérie na 9. 11. 2026](/img/clanky/spot-2026-11-09-sk.svg)

1. **00:00 – 02:45 – nabíjanie v NT.** Batéria sa nabije na 100 % za pevných 0,12 €/kWh.
2. **02:45 – 06:00 – dom zo siete.** Stále je NT, dom ide zo siete a batéria čaká na rannú špičku.
3. **06:00 – 09:00 – predaj ráno.** Spot vystúpi na 356 až 438 €/MWh, nad rannú predajnú hranicu 350 €/MWh. Batéria predá všetko až na 13 %.
4. **09:00 – 13:45 – slnko.** Najprv sa predáva len to, čo vyrobí FVE, potom FVE nabíja batériu.
5. **13:45 – 15:30 – poobedná NT.** Batéria sa dobije na 100 %. Spot je vtedy už 566 €/MWh, ale ja kupujem za pevných 120.
6. **15:45 – 18:00 – predaj večer.** Najdrahšie úseky dňa, až 637 €/MWh. Predáva sa nad večernou hranicou 585 €/MWh.
7. **Večer** ide dom z batérie, o 23:45 začína ďalšia NT.

Podľa plánu batéria za tento deň **predá 56 kWh za 26,45 €** a **nakúpi 51 kWh za 6,11 €**.

## Ako AI Energy rozhoduje

[AI Energy](https://github.com/Igypop78/ai-energy) je moja integrácia do Home Assistanta. Plánuje batériu po 15 minútach a vždy napíše, čo robí a prečo – napríklad *„Predaj 287 € ≥ hranica 281 €“*.

- **Okná podľa NT.** Deň sa delí na okná medzi nízkymi tarifami. V každom okne sa batéria predá v **najdrahších úsekoch** – toľkých, koľko energie bude k dispozícii. Cena najlacnejšieho z nich je predajná hranica.
- **V NT nabije len toľko, koľko treba** na predaje v ďalšom okne a na spotrebu domu do ďalšej NT (mínus slnko podľa predpovede Solcast). Spotreba domu sa oplatí z batérie vtedy, keď je NT so stratami a opotrebením lacnejšia ako VT: 120 / 0,9 + 45 = 178 €/MWh < 210 €/MWh.
- **Opotrebenie batérie** počítam 45 €/MWh. Každá kWh, ktorá prejde batériou, ju trochu opotrebuje a aj to musí predaj zaplatiť.
- **Minimálna predajná cena** je poplatok za predaj + NT so stratami + opotrebenie + zisk: 15 + 133 + 45 + 40 = **233 €/MWh**. Pod ňou sa nepredáva vôbec. Ja mám nastavených 300 €/MWh.
- **Min SOC je cieľ, nie stena.** Predaj skončí tak, aby po spotrebe domu do ďalšej NT ostala batéria na minime. Tvrdú spodnú hranicu drží menič.

Všetko vidíš na kartách, ktoré sa inštalujú spolu s integráciou. Igy Price Action Card ukazuje ceny, predajnú hranicu a plán ako časovú os, Igy Battery Action Card zas režim, dôvod a nastavenia.

## Čo budeš potrebovať

- **Batériu a menič ovládateľný z Home Assistanta.** Ja mám Deye SUN-10K-SG04LP3-EU pripojený lokálne cez integráciu Solarman.
- **Spoľahlivý stav nabitia (SOC).** Plán stojí na tom, koľko energie v batérii naozaj je. Moju banku meria Victron SmartShunt – je to zdroj pravdy, údaje o batérii z Deye nepoužívam.
- **Spotové ceny v Home Assistante** – senzor s cenami OKTE na dnes a zajtra.
- **Predpoveď výroby FVE** – ja používam Solcast. Reálna výroba je u mňa zhruba 80 % predpovede, preto má AI Energy aj korekciu.
- **Zmluvu na predaj za spot.** Ja predávam cez V-elektru a nakupujem ďalej od ZSE.
- **Dvojtarifu.** Bez lacnej NT nemáš lacno za čo nabíjať. Bez nej sa dá predávať len to, čo vyrobí slnko.
- **HACS** a integráciu [AI Energy](https://github.com/Igypop78/ai-energy).

## Ako Home Assistant prepína Deye

AI Energy rozhodne, **čo** sa má robiť – napríklad *predaj z batérie* alebo *nabíjanie zo siete*. Do meniča to posiela cez výber režimu `input_select.deye_operation_mode`. Ako sa daný režim premietne do nastavení Deye, rieši moja automatizácia.

Toto bola najväčšia tortúra celého projektu. Nájsť správnu kombináciu nastavení Deye pre každý režim mi trvalo dlho. Výsledok:

| Režim | Pracovný režim | Čas použitia (TOU) | Nabíjanie batérie | Vybíjanie batérie | Predaj prebytku | Nabíjanie zo siete |
|---|---|---|---|---|---|---|
| Normal | Zero Export To CT | zap. | 200 A | 200 A | áno | nie |
| Export Now | Zero Export To CT | zap. | 0 A | 200 A | áno | nie |
| Export from Battery | Export First | zap. | 0 A | 200 A | áno | nie |
| Zero Export | Zero Export To CT | zap. | 200 A | 200 A | nie | nie |
| Charge from Grid | Zero Export To CT | vyp. | 200 A | 200 A | – | áno |
| Grid Only | Zero Export To CT | zap. | 200 A | 0 A | áno | nie |

Pri písaní automatizácie mi pomohli tri zásady:

- **Zapisuj len to, čo nesedí, a každú hodnotu zvlášť.** Chyba jedného zápisu nezastaví ostatné.
- **Over a skús znova.** Po zápise automatizácia skontroluje menič a čo nesedí, skúsi ešte raz – najviac 3×. Ak menič ani potom nesedí, príde upozornenie.
- **Kontroluj pravidelne.** Každých 5 minút a vždy, keď sa Solarman po výpadku vráti – aby sa nastavenie opravilo aj po výpadku komunikácie.

```yaml automations.yaml
alias: Menič – aplikovanie stavu
description: >-
  Nastavuje Deye podľa input_select.deye_operation_mode. Pre každý režim je
  jedna tabuľka požadovaných hodnôt; zapisuje sa len to, čo na meniči nesedí,
  každý zápis zvlášť (chyba jedného nezastaví ostatné), potom sa overí a
  nesediace sa skúsi znova (max 3×). Kontrola všetkých nastavení každých 5 min a
  po návrate Solarmanu. Ak menič ani po 3 pokusoch nesedí, príde upozornenie.
triggers:
  - trigger: state
    entity_id: input_select.deye_operation_mode
    id: zmena
  - trigger: state
    entity_id:
      - select.menic_pracovny_rezim
      - select.menic_cas_pouzitia
      - number.menic_bateria_max_nabijanie_prud
      - number.menic_bateria_max_vybijanie_prud
      - switch.menic_dodavka_prebytok
      - switch.menic_bateria_siet_nabijanie
    from:
      - unavailable
      - unknown
    for:
      seconds: 30
    id: obnova
  - trigger: time_pattern
    minutes: /5
    id: kontrola
  - trigger: homeassistant
    event: start
    id: obnova
conditions: []
actions:
  - variables:
      rezim: '{{ states(''input_select.deye_operation_mode'') }}'
      ciel: |-
        {% set t = {
          'Normal':              {'wm': 'Zero Export To CT', 'tou': 'Enabled',  'chg': 200, 'dis': 200, 'exp': 'on',  'grid': 'off'},
          'Export Now':          {'wm': 'Zero Export To CT', 'tou': 'Enabled',  'chg': 0,   'dis': 200, 'exp': 'on',  'grid': 'off'},
          'Export from Battery': {'wm': 'Export First',      'tou': 'Enabled',  'chg': 0,   'dis': 200, 'exp': 'on',  'grid': 'off'},
          'Zero Export':         {'wm': 'Zero Export To CT', 'tou': 'Enabled',  'chg': 200, 'dis': 200, 'exp': 'off', 'grid': 'off'},
          'Charge from Grid':    {'wm': 'Zero Export To CT', 'tou': 'Disabled', 'chg': 200, 'dis': 200, 'exp': none,  'grid': 'on'},
          'Grid Only':           {'wm': 'Zero Export To CT', 'tou': 'Enabled',  'chg': 200, 'dis': 0,   'exp': 'on',  'grid': 'off'},
        } %}{{ t.get(rezim, {}) }}
      ent:
        wm: select.menic_pracovny_rezim
        tou: select.menic_cas_pouzitia
        chg: number.menic_bateria_max_nabijanie_prud
        dis: number.menic_bateria_max_vybijanie_prud
        exp: switch.menic_dodavka_prebytok
        grid: switch.menic_bateria_siet_nabijanie
  - condition: template
    value_template: '{{ ciel | count > 0 }}'
  - wait_template: >-
      {{ ent.values() | map('states') | select('in', ['unavailable', 'unknown'])
      | list | count == 0 }}
    timeout: '00:02:00'
    continue_on_timeout: false
  - repeat:
      sequence:
        - variables:
            zle: >-
              {% set ns = namespace(z=[]) %} {% for k, v in ciel.items() if v is
              not none %}
                {% set s = states(ent[k]) %}
                {% if k in ['chg', 'dis'] %}{% set ok = s | float(-1) == v | float %}{% else %}{% set ok = s == v %}{% endif %}
                {% if not ok %}{% set ns.z = ns.z + [k] %}{% endif %}
              {% endfor %}{{ ns.z }}
        - if:
            - condition: template
              value_template: '{{ zle | count == 0 }}'
          then:
            - action: persistent_notification.dismiss
              data:
                notification_id: deye_nesedi
            - stop: Menič sedí
        - if:
            - condition: template
              value_template: '{{ ''wm'' in zle }}'
          then:
            - action: select.select_option
              target:
                entity_id: select.menic_pracovny_rezim
              data:
                option: '{{ ciel.wm }}'
              continue_on_error: true
            - delay: 2
        - if:
            - condition: template
              value_template: '{{ ''tou'' in zle }}'
          then:
            - action: select.select_option
              target:
                entity_id: select.menic_cas_pouzitia
              data:
                option: '{{ ciel.tou }}'
              continue_on_error: true
            - delay: 2
        - if:
            - condition: template
              value_template: '{{ ''chg'' in zle }}'
          then:
            - action: number.set_value
              target:
                entity_id: number.menic_bateria_max_nabijanie_prud
              data:
                value: '{{ ciel.chg }}'
              continue_on_error: true
            - delay: 2
        - if:
            - condition: template
              value_template: '{{ ''dis'' in zle }}'
          then:
            - action: number.set_value
              target:
                entity_id: number.menic_bateria_max_vybijanie_prud
              data:
                value: '{{ ciel.dis }}'
              continue_on_error: true
            - delay: 2
        - if:
            - condition: template
              value_template: '{{ ''exp'' in zle }}'
          then:
            - action: switch.turn_{{ ciel.exp }}
              target:
                entity_id: switch.menic_dodavka_prebytok
              continue_on_error: true
            - delay: 2
        - if:
            - condition: template
              value_template: '{{ ''grid'' in zle }}'
          then:
            - action: switch.turn_{{ ciel.grid }}
              target:
                entity_id: switch.menic_bateria_siet_nabijanie
              continue_on_error: true
            - delay: 2
        - action: logbook.log
          data:
            name: Deye
            message: >-
              {{ rezim }}: zapisujem {{ zle | join(', ') }} (pokus {{
              repeat.index }}, {{ {'zmena': 'zmena režimu', 'obnova': 'po
              výpadku / štarte', 'kontrola': 'kontrola – menič
              nesedel'}.get(trigger.id, trigger.id) }})
        - delay: 30
      until:
        - condition: template
          value_template: '{{ repeat.index >= 3 }}'
  - variables:
      zle: >-
        {% set ns = namespace(z=[]) %} {% for k, v in ciel.items() if v is not
        none %}
          {% set s = states(ent[k]) %}
          {% if k in ['chg', 'dis'] %}{% set ok = s | float(-1) == v | float %}{% else %}{% set ok = s == v %}{% endif %}
          {% if not ok %}{% set ns.z = ns.z + [k ~ '=' ~ s ~ ' (chcem ' ~ v ~ ')'] %}{% endif %}
        {% endfor %}{{ ns.z }}
  - if:
      - condition: template
        value_template: '{{ zle | count > 0 }}'
    then:
      - action: persistent_notification.create
        data:
          notification_id: deye_nesedi
          title: Deye nesedí s režimom {{ rezim }}
          message: 'Ani po 3 pokusoch: {{ zle | join('', '') }}'
    else:
      - action: persistent_notification.dismiss
        data:
          notification_id: deye_nesedi
mode: restart
```

Entity `select.menic_…`, `number.menic_…` a `switch.menic_…` sú z integrácie Solarman, len premenované po slovensky podľa mojej [schémy názvov](/moj-dom/zasady-smart-domu/#6-bud-strukturovany). U teba sa budú volať inak.

## Na čo si dať pozor

:::warn Hlavný istič
Raz sa naraz spustilo nabíjanie auta aj nabíjanie batérie zo siete. Bol som na hranici hlavného ističa (3 × 25 A). Našťastie som si to hneď všimol. Menič a wallbox mám navyše na jednom kábli, takže odber musí ostať pod 12 kW. AI Energy dnes pozná istič aj spoločný limit a batéria má pri nabíjaní prednosť pred autom.
:::

Ďalšie veci, ktoré som musel opraviť, sú v [zozname zmien AI Energy](https://github.com/Igypop78/ai-energy/blob/main/CHANGELOG.md). Dve najpoučnejšie:

- **Predaj počas vlastnej NT.** Keď boli ceny v poobednej NT vyššie ako večer, plán vybral na predaj práve tieto úseky. Lenže vtedy sa batéria nabíja, takže sa takmer nič nepredalo a večer išiel len dom z batérie.
- **Nevyužitá batéria.** Keď batériu pred NT dobilo slnko, plán s touto energiou nerátal. Večer tak batéria skončila na 30 % pri minime 10 % a vysokých cenách.

## Čísla: virtuálna batéria vs. spot

Len elektrina – bez plynu a vody. „Spolu“ je predaj mínus nákup zo siete. Spotreba domu je 1 200 až 1 350 kWh mesačne vrátane nabíjania auta.

| Mesiac | Režim | Výroba FVE | Predaj do siete | Nákup zo siete | Spolu |
|---|---|---|---|---|---|
| júl 2026 | virtuálna batéria | 2 281 kWh | 1 046 kWh / 53,42 € | 5 kWh / 1,03 € | **+52,39 €** |
| august 2026 | virtuálna batéria | 2 037 kWh | 819 kWh / 44,29 € | 8 kWh / 1,64 € | **+42,65 €** |
| september 2026 | spot | 1 512 kWh | 1 051 kWh / 225,87 € | 408 kWh / 50,87 € | **+175,00 €** |
| október 2026 | spot | 1 099 kWh | 1 251 kWh / 342,26 € | 1 292 kWh / 164,91 € | **+177,35 €** |

Za kWh predanú do siete som v lete dostal priemerne **5 centov**, v októbri **27 centov**. V októbri som síce zo siete nakúpil viac ako trikrát toľko ako v septembri, ale priemerne za 0,13 €/kWh – teda takmer všetko v lacnej NT – a predal som to drahšie.

Úprimne aj to, čo v tabuľke nie je: v októbri prešlo batériou ~1,4 MWh, čo pri 45 €/MWh znamená **asi 64 € opotrebenia**. Aj po jeho odpočítaní mi október zarobil viac ako júl a august spolu. A porovnávam leto s jeseňou – v zime bude slnka ešte menej, čísla budem priebežne zverejňovať.

## Oplatí sa batéria?

Celá FVE s batériou ma stála okolo 8 000 €, z toho batéria ~3 500 €. Kým som bol na virtuálnej batérii, batéria hlavne pokrývala noc – v lete som zo siete nekupoval takmer nič. Na spote zarába dvakrát denne – ráno aj večer – a najviac práve vtedy, keď slnko nesvieti.

Ak máš batériu a dvojtarifu a si zatiaľ na virtuálnej batérii alebo pevnom výkupe, oplatí sa spočítať, čo by ti dal spot. A ak batériu ešte nemáš, pretože si počul, že sa nezaplatí – tieto čísla stoja za zamyslenie.

## Ako začať s AI Energy

1. V HACS pridaj vlastný repozitár `https://github.com/Igypop78/ai-energy` (kategória Integration), stiahni **AI Energy** a reštartuj Home Assistant.
2. **Nastavenia → Zariadenia a služby → Pridať integráciu → AI Energy.** Sprievodca ťa prevedie krok po kroku: ceny, tarifa, predaj, batéria, FVE, menič, nabíjačka auta a istič.
3. Na začiatku nechaj **Batéria – riadenie vypnuté**. Integrácia vtedy len odporúča, nič neprepína, a vidíš, čo by robila a prečo.

:::tip Vyskúšaj aj bez batérie
Vytvor si pomocníka typu Číslo s názvom *Sim SOC* (0–100 %) a v sprievodcovi ho vyber ako SOC batérie. Posúvaním hodnoty uvidíš, ako sa mení plán a odporúčaný režim.
:::

AI Energy je stále vo vývoji. Ak ju vyskúšaš, daj mi vedieť na [ahoj@tinkermyhome.com](mailto:ahoj@tinkermyhome.com) alebo na [GitHube](https://github.com/Igypop78/ai-energy) – ako ti funguje a čo by si potreboval.
