---
id: metering
cover: /img/clanky/titulky/meranie-sk.jpg
title: Čím začať smart dom? Meraním elektriny, vody a plynu
description: Prečo každému odporúčam začať smart domácnosť centrálnym meraním spotreby – od úspor cez bezpečnosť až po odhalenie zaseknutého splachovača na dovolenke.
section: energy
level: 1
date: 2026-11-16
slug: zacni-meranim-spotreby
tldr: 'Doma mám stovky smart zariadení a tisícky entít. Keby som však začínal odznova, prvé by bolo **centrálne meranie elektriny, vody a plynu**. Ukáže, kam energia ide, prezradí, čo práve beží (aj „hlúpe“ spotrebiče), postráži dom, keď nikto nie je doma, a nájde aj **únik vody**, ktorý inak nevidno. Na konci si **zahlasuj**, čo meriaš ty.'
---

Mám v dome tisícky entít a stovky smart zariadení. Často dostávam otázku: **ktoré z nich sú naozaj užitočné a čím by som začal, keby som to robil znova?**

Odpoveď samozrejme závisí od toho, čo od inteligentnej domácnosti čakáš práve ty. Jedno však odporúčam každému: **začni centrálnym meraním spotreby elektriny, vody a plynu** (ak ho máš). Prečo?

## 1. Uvidíš, či úspory naozaj fungujú

Čo nemeriaš, nemôžeš zlepšiť. Dlhodobé štatistiky ti ukážu, či nová chladnička, výmena žiaroviek alebo nižšia teplota v izbách naozaj niečo priniesli.

Úprimne – na toto by ti stačila aj **ročná vyúčtovacia faktúra**. Lenže tá ti povie len **koľko**, nie **kedy** a **čo**.

## 2. Uvidíš priebeh, nie len súčet

Z faktúry nevyčítaš, **čo tú spotrebu robí**. Priebežné meranie ti ukáže graf počas celého dňa – a z neho hneď vidno, kde sa oplatí hľadať úsporu.

Dobrým príkladom je **standby spotreba** – to, čo dom berie, aj keď „nič nebeží“: počítače, router, NAS, nabíjačky, televízor v pohotovosti. Každé zariadenie berie málo, ale beží **24 hodín denne, 365 dní v roku**.

:::info Koľko stojí 50 W, ktoré nevidíš
50 W × 24 h × 365 dní = **asi 440 kWh ročne**. Pri cene okolo 0,21 €/kWh je to **vyše 90 € na ročnom účte** – za veci, ktoré si často ani neuvedomuješ.
:::

## 3. Bezpečnosť: spotreba kopíruje tvoje správanie

S priebežným meraním máš **prehľad 24/7**, čo sa v dome deje. Spotreba totiž verne kopíruje, ako dom žije. Keď nikto nie je doma, vyzerá graf úplne inak, ako keď je doma celá rodina.

Takto napríklad vyzerá priebeh spotreby v **byte, kde nikto nie je**. Uhádneš, aký spotrebič tam beží zhruba každú hodinu s 15–20-minútovými prestávkami a občasnými špičkami?

![Spotreba prázdneho bytu počas jedného dňa – pravidelné „zuby“ sú chladnička](/img/clanky/meranie-byt-chladnicka.png)

Áno, je to **chladnička**. Stačí, aby sa v byte zapol akýkoľvek iný spotrebič, a na grafe je to okamžite vidieť – ako tá vyššia „lavica“ uprostred dňa.

## 4. Vzorce, ktoré pomôžu automatizáciám

Tieto opakujúce sa vzorce („patterny“) sa dajú neskôr použiť aj v automatizáciách – napríklad ako potvrdenie, že je naozaj ten správny deň, aby automatizácia bežala. Ak spotreba ráno vyzerá ako víkend, nemá zmysel spúšťať „pracovný“ scenár.

Presne tento problém riešim v projekte [Pattern Pilot](/projekty/pattern-pilot/) – integrácii, ktorá sa učí návyky v dome a sama navrhuje automatizácie.

## 5. Spoznáš aj „hlúpe“ spotrebiče

Ak meriaš energiu v rozumnej podrobnosti – **po okruhoch alebo skupinách ističov** – časom budeš vedieť **len zo samotnej spotreby** povedať, ktorý spotrebič beží. A rovnako ľahko zistíš, že **žehlička** stále hreje, hoci si práve odišiel z domu.

Skús to sám: ktorý spotrebič robí na tomto obrázku tú vysokú spotrebu?

![Spotreba domu po fázach a skupinách ističov – jeden okruh berie vyše 1,8 kW](/img/clanky/meranie-okruhy-podlahovka.png)

Áno, je to **elektrické podlahové kúrenie**. Zásuvka na terase, kde nič nie je zapojené, to asi nebude. 🙂

:::me Ako to mám ja
Rozvádzač mám rozdelený na **tri sekcie, každú s vlastným prúdovým chráničom**. Na každej sekcii sedí jedno **Shelly 3EM Gen3**, ktoré meria všetky tri fázy – spolu deväť meraní. Spotreba celého domu je ich súčet plus samostatné meranie v prístrešku, kde je wallbox. Ručne by som tie okruhy nikdy nesledoval, ale na karte v Home Assistante jedným pohľadom vidím, kde sa práve míňa.
:::

### Chladnička z grafu: príklad pre pokročilých

Keď poznáš „podpis“ spotrebiča, vieš mu jednoduchou šablónou (template) priradiť aj jeho spotrebu. Na grafe z bytu je základ okolo 15–20 W a pri behu chladničky stúpne celkový odber zhruba na 50 W. Z toho sa dá spraviť odhadovaný výkon chladničky:

```yaml configuration.yaml
template:
  - sensor:
      - name: "Byt chladnička výkon (odhad)"
        unique_id: byt_chladnicka_vykon_odhad
        unit_of_measurement: W
        device_class: power
        state_class: measurement
        # celkový odber bytu mínus standby; chladnička beží, keď je nad prahom
        state: >
          {% set p = states('sensor.byt_elektrina_vykon') | float(0) %}
          {{ (p - 17) | round(0) if 40 <= p <= 80 else 0 }}
```

Potom v **Nastavenia → Zariadenia a služby → Pomocníci → Vytvoriť pomocníka → Integrálny senzor** z neho spravíš kWh a pridáš ho do Energy panela ako samostatné zariadenie. Názov senzora a prahy si prispôsob svojmu grafu – toto je ilustračný príklad.

:::tip
Nečakaj presnosť elektromera. Cieľ je vidieť **trend** – či chladnička nezačína bežať častejšie (tesnenie, námraza) a koľko ťa ročne stojí.
:::

## 6. Únik vody a zaseknutý splachovač

Ak meriaš vodu priebežne, vidíš **okamžitý prietok**. Keď nikto nie je doma a litre aj tak pribúdajú, je to buď práčka, umývačka alebo polievanie záhrady. **Ak nič z toho, niekde ti asi tečie voda.**

Ak snímaš **fakturačný vodomer**, nájdeš takto aj únik, ktorý **nevidno** – v stene, v zemi, v potrubí do záhrady. Tam ti smart detektory zaplavenia pod práčkou alebo umývadlom nepomôžu.

:::warn Dovolenka a zaseknutý splachovač
Predstav si, že odchádzaš na dovolenku a zasekne sa splachovač. Môže pretiecť až **10 000 litrov za deň**. Pri dnešných cenách BVS (vodné + stočné asi 3,59 €/m³ s DPH) je to asi **36 € denne** – za 10 dní dovolenky pekných **360 €**. S meraním ti príde upozornenie ešte v ten istý deň.
:::

Ak polievaš záhradu z vodovodu, meranie ti pomôže dávkovať **presné množstvo vody** na zavlažovanú plochu. Ani liter navyše, ani menej. 🙂

## Koľko to stojí

Menej, než by si čakal.

- **Elektrina:** odporúčam **Shelly 3EM-63W Gen3**. Nasadí sa na ističe, vodiče prechádzajú cez otvory s meracími transformátormi, takže **v rozvádzači nezaberie ani jednu pozíciu**. Meria tri fázy (alebo tri samostatné okruhy) a v Home Assistante funguje lokálne a spoľahlivo.
- **Voda a plyn:** mňa stáli spolu zhruba **30 €**. Snímam priamo fakturačné meradlá: vodomer **indukčným snímačom**, plynomer **magnetickým snímačom** (takým, aký je v senzoroch na dvere). Obe bežia na **ESP32-C6**, ktoré je priamo v Zigbee sieti. Vyžaduje to však trochu zručnosti s ESP – celý postup so zapojením a kódom je v návode [Meranie vody a plynu cez ESP32](/diy/meranie-vody-a-plynu-esp32/).

![Shelly 3EM-63W Gen3 – trojfázový merač, ktorý sa nasadí priamo na ističe](/img/clanky/shelly-3em-63w-gen3.png)

:::warn Rozvádzač je práca pre elektrikára
Montáž merača do rozvádzača je práca s napätím, ktoré zabíja. Ak to nie je tvoja profesia, nechaj to elektrikárovi – zapojenie zvládne za pár minút.
:::

## Čo ďalej

Ak chceš merať vodu a plyn priamo z fakturačných meračov, celý postup je v návode [Meranie vody a plynu cez ESP32](/diy/meranie-vody-a-plynu-esp32/).

Takýchto možností ti priebežné meranie dá oveľa viac. Stačí ho chvíľu pozorovať – a dom ti začne sám rozprávať, čo sa v ňom deje.

:::poll meranie-doma Čo už dnes doma meriaš?
- nic: Zatiaľ nič, len faktúry
- elektrina: Elektrinu za celý dom
- okruhy: Elektrinu po okruhoch
- voda: Elektrinu aj vodu
- vsetko: Elektrinu, vodu aj plyn
:::

Na čo sa chystáš ty? Ak riešiš, ako to doma zapojiť, [napíš mi](/o-mne/).
