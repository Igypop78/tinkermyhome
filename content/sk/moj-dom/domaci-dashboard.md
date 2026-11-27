---
id: dashboards
cover: /img/clanky/titulky/dashboard.jpg
title: Domáci dashboard na stene – prečo ho mám, aj keď sa smart dom má riadiť sám
description: Nástenný dashboard pre Home Assistant – na čo slúži, kto ho u nás používa, tablet či displej, ako skryť káble, uchytenie na magnety, LED rám z adresovateľného pásu cez ESP32 a dizajn s pomocou AI. Aj s kódom pre ESPHome.
section: home
also: diy
level: 2
date: 2026-11-27
slug: domaci-dashboard
tldr: Domáci dashboard nie je ovládač na všetko, ale **okno do domu** – vidím na ňom, čo robí fotovoltika, batéria, kúrenie aj obchod na spote. Mám **10" dotykový displej Waveshare za ~80 €**, kiosk na Proxmoxe, uchytenie **na magnety** a okolo **LED rám z adresovateľného pásu cez ESP32**, ktorý stav domu ukazuje aj z druhého konca miestnosti. Kód pre ESPHome je na konci.
---

Domáci dashboard v smart dome je vraj zbytočný. Dobrý smart dom sa má riadiť sám a človek by doň nemal zasahovať – ak musíš niečo ťukať na tablete, automatizácia zlyhala. Aspoň tak to tvrdia niektorí ľudia.

Čiastočne s tým súhlasím. Kúrenie, upozornenia či brána sa majú zariadiť samy a väčšina vecí u nás tak aj funguje (písal som o tom v článku [7 automatizácií, ktoré u nás naozaj fungujú](/moj-dom/najlepsie-automatizacie/)).

Ja to však vidím inak: **rád viem, čo a kedy sa v dome deje.** Automatizácia zariadi, aby sa veci diali. Dashboard mi ukáže, že sa naozaj dejú. A keď sa niečo pokazí, zistím to pohľadom na stenu, nie až keď je v dome zima.

![Nástenný dashboard s LED rámom večer](/img/clanky/dashboard-stena-vecer.jpg)

## Na čo je domáci dashboard dobrý

- **Informácie** – na prvý pohľad vidím výrobu FVE, spotrebu domu, sieť, batériu, plyn, vodu, teplú vodu a teploty v izbách.
- **Ovládanie** – len to, čo automatizácia nevie odhadnúť: ráno žalúzie, teplota v izbe, svetlo, keď ho niekto potrebuje hneď.
- **Bezpečnosť** – stráženie prístrešku, kamera pri vchode jedným ťuknutím, poplach pri dyme alebo vode.
- **Radosť** – áno, aj to. Je fajn pozrieť sa na stenu a vidieť, že fotovoltika ide naplno, kúrenie stojí, alebo že niekto práve klikol na odber na YouTube. 🙂

## Kto ho u nás používa

**Ja** hlavne na prehľad – najviac ma zaujíma energia. Ako ide FVE, či batéria práve predáva do siete, ako prebieha [obchod na spote](/energia/bateria-obchoduje-na-spote/), či beží kúrenie. Hlavná obrazovka ukazuje toky energie, podrobnosti (aj spotové ceny) sú na druhej obrazovke po ťuknutí na energiu. A či práve exportujem alebo importujem, mi jasne ukáže už LED rám.

**Katka** ho používa úplne inak. Nastavuje cez neho [teplotu v izbách](/moj-dom/smart-kurenie/) a zapína či vypína svetlá v izbách chalanov, keď ich volá na večeru.

Ten istý dashboard teda musí vyhovovať technikovi aj bežnému používateľovi. Preto sú na mojom displeji veľké dlaždice, málo textu a ovládanie len pre pár vecí.

## Na čom ho zobraziť

| Zariadenie | Výhody | Na čo si dať pozor |
|---|---|---|
| **Tablet** | lacný, dotykový, všetko v jednom | batéria pri nonstop napájaní, výkon |
| **Dotykový displej + počítač** | žiadna batéria, displej môže byť tenký | treba niečo, čo stránku zobrazí (mini PC, Raspberry Pi) |
| **Televízor** | veľká plocha, vidno z diaľky | ovládanie len diaľkovým ovládačom, skôr na občasný pohľad |

### Tablet – na čo si dať pozor

- **Batéria a nonstop napájanie.** Tablet, ktorý je roky na nabíjačke, si skôr či neskôr zničí batériu – môže sa aj nafúknuť. Pomáha nabíjanie cez smart zásuvku alebo relé (napr. len medzi 20 a 80 %). Niektoré tablety vedia obmedziť nabíjanie aj samy.
- **Výkon.** Dashboard je webová stránka a pri mnohých kartách, animáciách a kamerách je náročná. Starý lacný tablet bude sekať a meškať. Radšej menej kariet, ale plynulých.
- **Zapnutá obrazovka.** Na stálu prevádzku treba kiosk aplikáciu (napr. Fully Kiosk Browser) alebo aspoň vypnúť uspávanie.

## Môj nástenný displej

:::me Ako to mám ja
- **Displej:** 10,1" dotykový displej Waveshare (1280 × 800, IPS, HDMI) za ~80 €. Žiadny tablet.
- **Počítač:** displej je cez stenu pripojený káblom **HDMI** (obraz) a **USB** (dotyk a napájanie) k mini PC s Proxmoxom. Na ňom beží Home Assistant a vedľa neho **kiosk VM** s prehliadačom Chromium – jej jediná úloha je zobraziť dashboard na celú obrazovku.
- **Rámik:** z čiernej hliníkovej LED lišty, rohy spojené hliníkovými uholníkmi. V lište je adresovateľný LED pás (42 LED), ktorý svieti do steny. Ovláda ho **ESP32-C6** za stenou.
- **Uchytenie:** v stene sú priskrutkované neodýmové magnety, na zadnej strane displeja je nalepený kovový pásik. Displej do rámika len priložím.
:::

Výhoda: žiadna batéria, ktorá sa nafúkne, a výkon mini PC stačí aj na náročnú stránku. Nevýhoda: potrebuješ počítač (ja ho mám aj tak) a káble cez stenu.

![Aktuálna verzia môjho dashboardu](/img/clanky/dashboard-obrazovka.png)

## Ako skryť napájanie a káble

Kábel visiaci zo steny pokazí aj najkrajší dashboard. Možnosti:

1. **Pri vypínači.** Ideálne miesto – v krabici za vypínačom je 230 V, takže sa tam zmestí malý zdroj a kábel vyjde rovno za displejom.
2. **Cez stenu.** Ak máš za stenou miesto na techniku (ako ja), stačí prevŕtať otvor a káble vedú priamo dozadu.
3. **Obetovať nevyužívaný vypínač.** Vypínač, ktorý nič nerobí, vymeň za záslepku a krabicu za ním použi na zdroj a káble.
4. **Nechať kábel.** Ak ti neprekáža, displej môže stáť aj na skrinke. Tu je to na tvojej kreativite.

:::warn Pozor na 230 V
Práca v krabici s 230 V patrí elektrikárovi. Zdroj musí byť určený do krabice (alebo aspoň dobre izolovaný) a nesmie sa prehrievať.
:::

![Rámik bez displeja – magnety, HDMI a USB cez stenu, konektor LED pásu](/img/clanky/dashboard-ramik-zozadu.jpg)

## Ako ho upevniť na stenu

- **Kúpený držiak** – na tablety existujú nástenné držiaky aj rámy.
- **3D tlač** – na väčšinu tabletov a displejov nájdeš hotový model držiaka.
- **Magnety** – moje riešenie. V stene sú štyri neodýmové magnety v kovovom puzdre, priskrutkované do hmoždiniek. Na zadnú stranu displeja som nalepil kúsky kovového magnetického pásika oproti magnetom. Displej sa dá jedným pohybom zložiť (napr. kvôli káblom) a nikde nevidno skrutky. Čierny rámik len zakrýva hrany a drží LED pás.

![Neodýmový magnet v rohu rámika](/img/clanky/dashboard-magnet.jpg)

![Zadná strana displeja Waveshare s kúskami kovového pásika](/img/clanky/dashboard-displej-zozadu.jpg)

:::warn Neodýmové magnety sú silné
Magnety displej pritiahnu prudko – priblíž ho pomaly, aby si nepoškodil sklo ani prsty. A drž ich ďalej od detí.
:::

## Ako spraviť podsvietenie z adresovateľného LED pásu

Toto robí z obyčajného displeja niečo navyše. V adresovateľnom LED páse môže každá LED svietiť inou farbou. Rám tak ukazuje stav domu aj vtedy, keď na displej nevidíš – z kuchyne alebo z gauča.

Môj rám má 42 LED rozdelených na úseky:

| LED | Miesto | Čo ukazuje |
|---|---|---|
| 0–4 | spodok vpravo | **Sieť** – červená odber, zelená pretok; „kométa“ ukazuje smer toku (pod 200 W nesvieti) |
| 5–13 | pravá strana | **Batéria** – výška = stav nabitia, zelená nabíja (nahor), červená vybíja (nadol), modrá stojí |
| 14–27 | vrch | **Výroba FVE** – žltá od stredu do strán podľa výkonu |
| 28–36 | ľavá strana | **Plyn** – blikajúci plameň, výška = výkon kotla |
| 37–41 | spodok vľavo | **Zabezpečenie prístrešku** – zelená stráži, červená nestráži |

Navyše:

- **Pohyb pri vchode** – biele svetlo obehne celý rám.
- **Poplach** (dym, voda, siréna) prebije všetko – celý rám bliká načerveno.
- **V noci** rám svieti ďalej, len slabšie (jas sa mení podľa výšky slnka).
- **Nový odberateľ na YouTube** – červeno-biela vlna s iskrami na 8 sekúnd.

Na úvodnej fotke je vidno: vľavo horí plyn (oranžová), vpravo sa vybíja batéria (červená), dole vpravo ide pretok do siete a dole vľavo prístrešok stráži (obe zelené).

:::tip Rozblikaj nám stenu
Kto si teraz dá [odber na YouTube](https://www.youtube.com/@TinkerMyHome?sub_confirmation=1), u nás doma sa rozbliká LED rám. Fakt. Skús to. 🎉
:::

## Ako spraviť vlastný dizajn dashboardu

Dizajn už dnes nie je limit. Máš dve cesty:

1. **Klasicky v Home Assistante** – karty, sekcie, prípadne vlastné karty z HACS (napr. moje [Igy Cards](https://github.com/Igypop78/igy-cards)). Dá sa s tým spraviť pekný dashboard, ale je to pracné – hlavne doladenie na jednu pevnú obrazovku bez posúvania.
2. **S pomocou AI** – vlastná webová stránka, ktorá berie údaje z Home Assistanta. Popíšeš, čo chceš vidieť a ako to má vyzerať, AI napíše stránku a ty ju dolaďuješ. Môj aktuálny dashboard vznikol takto – celý postup ukážem vo videu.

Moja rada: najprv si na papier napíš, **čo chceš vidieť bez ťukania** a **čo potrebuje ovládať zvyšok rodiny**. Až potom rieš farby a ikony.

## Kód pre LED rám (ESPHome)

Rám beží na ESP32-C6 v [ESPHome](https://esphome.io) (čo je ESP32 a ESPHome, vysvetľujem v článku [ESP32 – čip za pár eur](/diy/esp32-moje-projekty/)). Pozor, nie je to projekt WLED – efekt je napísaný priamo v ESPHome ako `addressable_lambda`, ktorá každých 33 ms vypočíta farbu všetkých 42 LED. Údaje (výroba, sieť, batéria, plyn, alarmy) berie priamo z Home Assistanta.

V Home Assistante sa objavia:

- prepínač **LED rám logika** – vypnutý = rám nesvieti vôbec (ani pri poplachu),
- prepínač **LED rám simulácia** – vymyslené hodnoty, všetky úseky sa pomaly menia (na ladenie a natáčanie),
- posuvníky **LED jas deň** a **LED jas noc**,
- tlačidlá **LED test pohyb**, **LED test poplach**, **LED oslava odberateľa**,
- akcie `esphome.led_ram_led_oslava`, `esphome.led_ram_led_pohyb` a `esphome.led_ram_led_poplach_test` pre automatizácie.

Entity v sekciách `sensor:` a `binary_sensor:` si prepíš na svoje.

```yaml led-ram.yaml
substitutions:
  name: led-ram
  friendly_name: LED rám

# ---------------------------------------------------------------------------
# LED rám okolo displeja – 42 LED, index 0–41 proti smeru hodinových ručičiek:
#   0–4   spodok vpravo (0 pri strede, 4 v rohu)   → SIEŤ (odber beží k batérii, pretok od nej; vypnuté medzi −200 a +200 W)
#   5–13  pravá strana  (5 dole, 13 hore)          → BATÉRIA (výška = SOC, 1 LED ≈ 11 %)
#   14–27 vrch          (14 vpravo, 27 vľavo)      → VÝROBA FVE (od stredu do strán)
#   28–36 ľavá strana   (28 hore, 36 dole)         → PLYN (plameň, výška = výkon)
#   37–41 spodok vľavo  (37 v rohu, 41 pri strede) → ZABEZPEČENIE PRÍSTREŠKU
#   (prístrešok: zelená = stráži, červená = nestráži)
# Udalosti: pohyb pri vchode = biele svetlo obehne rám, oslava = červeno-biela vlna (8 s)
# Poplach (dym, voda, siréna) prebije všetko: celý rám bliká načerveno.
# V noci rám svieti ďalej, len slabšie (podľa výšky slnka).
# ---------------------------------------------------------------------------

esphome:
  name: ${name}
  friendly_name: ${friendly_name}
  comment: LED rám okolo nástenného displeja (ESP32-C6)
  min_version: 2024.8.0
  on_boot:
    priority: -100
    then:
      - light.turn_on:
          id: led_ram
          effect: "Panel"

esp32:
  board: esp32-c6-devkitc-1
  variant: esp32c6
  framework:
    type: esp-idf

logger:

api:
  # Volanie z HA: akcia „ESPHome: led_ram_led_oslava“ (napr. pri novom odberateľovi)
  actions:
    - action: led_oslava
      then:
        - lambda: 'id(ev_type) = 2; id(ev_start) = millis();'
    - action: led_pohyb
      then:
        - lambda: 'id(ev_type) = 1; id(ev_start) = millis();'
    - action: led_poplach_test
      then:
        - lambda: 'id(test_alarm_until) = millis() + 5000;'

ota:
  - platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  power_save_mode: none

globals:
  # udalosť na LED ráme: 0 = žiadna, 1 = pohyb, 2 = oslava
  - id: ev_type
    type: int
    restore_value: no
    initial_value: '0'
  - id: ev_start
    type: uint32_t
    restore_value: no
    initial_value: '0'
  # testovací poplach beží do tohto času (millis)
  - id: test_alarm_until
    type: uint32_t
    restore_value: no
    initial_value: '0'

light:
  - platform: esp32_rmt_led_strip
    chipset: WS2812
    rgb_order: GRB
    pin: GPIO3
    num_leds: 42
    name: "LED rám"
    id: led_ram
    restore_mode: ALWAYS_ON
    default_transition_length: 0s
    effects:
      - addressable_lambda:
          name: "Panel"
          update_interval: 33ms
          lambda: |-
            const int N = 42;
            const uint32_t now = millis();
            const float t = now / 1000.0f;
            auto c01 = [](float x) { return x < 0.0f ? 0.0f : (x > 1.0f ? 1.0f : x); };
            auto val = [](float v) { return isnan(v) ? 0.0f : v; };

            static float R[N], G[N], B[N];
            for (int i = 0; i < N; i++) { R[i] = 0; G[i] = 0; B[i] = 0; }
            auto add = [&](int i, float r, float g, float b, float a) {
              if (i < 0 || i >= N || a <= 0) return;
              R[i] += r * a; G[i] += g * a; B[i] += b * a;
            };

            // ---------- hlavný vypínač z HA: „LED rám logika“ ----------
            if (!id(led_logic).state) {
              for (int i = 0; i < N; i++) it[i] = Color(0, 0, 0);
              return;
            }

            // ---------- jas: medzi „LED jas noc“ a „LED jas deň“ podľa výšky slnka ----------
            float jd = c01(val(id(led_jas_den).state) / 100.0f), jn = c01(val(id(led_jas_noc).state) / 100.0f);
            float el = id(ha_sun_el).state;
            float master = isnan(el) ? jd : jn + (jd - jn) * c01((el + 6.0f) / 10.0f);

            // ---------- vstupy: z HA, alebo vymyslené pri „LED rám simulácia“ ----------
            bool sim = id(led_sim).state;
            float in_grid = sim ? 6000.0f * sinf(t * 0.21f) : val(id(ha_grid).state);
            float in_bat  = sim ? 5000.0f * sinf(t * 0.13f + 1.0f) : val(id(ha_bat).state);
            float in_soc  = sim ? 50.0f + 48.0f * sinf(t * 0.05f) : val(id(ha_soc).state);
            float in_pv   = sim ? 5000.0f + 5000.0f * sinf(t * 0.09f) : val(id(ha_pv).state);
            float in_gas  = sim ? fmaxf(0.0f, 28.0f * sinf(t * 0.11f + 2.0f)) : val(id(ha_gas).state);
            bool  in_sec  = sim ? (fmodf(t, 20.0f) < 10.0f) : id(ha_security).state;

            // ---------- poplach: dym, voda, siréna (alebo test) → celý rám bliká načerveno ----------
            bool alarm = id(ha_dym).state || id(ha_voda_kuchyna).state || id(ha_voda_kupelna).state || id(ha_sirena).state
                         || (int32_t)(id(test_alarm_until) - now) > 0;
            if (alarm) {
              float a = ((now / 250) % 2) ? 1.0f : 0.08f;
              for (int i = 0; i < N; i++) it[i] = Color((uint8_t)(255 * a * fmaxf(jd, 0.3f)), 0, 0);
              return;
            }

            // kométa: ostrá hlava + chvost za ňou, potom pauza → smer je jednoznačný
            // vracia jas pre pozíciu x (0 = začiatok dráhy) na dráhe dĺžky n
            const float CSPEED = 4.5f;                       // LED za sekundu
            auto comet = [&](float x, int n) {
              float run = (n + 2.5f) / CSPEED, period = run / 0.75f;   // 25 % periódy pauza
              float tt = fmodf(t, period);
              if (tt > run) return 0.0f;
              float pos = tt / run * (n + 2.5f) - 0.5f;
              float d = pos - x;                             // > 0 = LED je za hlavou (chvost)
              if (d < -0.6f) return 0.0f;
              if (d < 0) return 1.0f + d / 0.6f;
              return expf(-d / 1.1f);
            };

            float gp = in_grid, bp = in_bat;
            float soc = c01(in_soc / 100.0f);
            int nb = (int) ceilf(soc * 9.0f - 0.01f);      // každá LED ≈ 11 %, 20 % = 2 LED
            if (nb < 1) nb = 1;
            bool gImp = gp > 200.0f, gExp = gp < -200.0f, bChg = bp > 50, bDis = bp < -50;
            float cg[5] = {0, 0, 0, 0, 0}, cb[9] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
            // spoločná dráha batéria ↔ sieť:
            //   vybíja do siete:  batéria zhora nadol (13→5), potom sieť doľava (4→0)
            //   nabíja zo siete:  sieť doprava (0→4), potom batéria zdola nahor (5→13)
            bool chain = (bDis && gExp) || (bChg && gImp);
            if (chain) {
              int L = nb + 5;
              for (int k = 0; k < L; k++) {
                float c = comet(k, L);
                if (bDis) { if (k < nb) cb[nb - 1 - k] = c; else cg[4 - (k - nb)] = c; }
                else      { if (k < 5) cg[k] = c;           else cb[k - 5] = c; }
              }
            } else {
              for (int p = 0; p < 5; p++)  cg[p] = comet(gImp ? p : 4 - p, 5);          // odber doprava, pretok doľava
              for (int p = 0; p < nb; p++) cb[p] = comet(bChg ? p : nb - 1 - p, nb);    // nabíja nahor, vybíja nadol
            }

            // ---------- SIEŤ (0–4): červená odber (k batérii, doprava), zelená pretok (od batérie, doľava) ----------
            if (gImp || gExp) {
              float f = c01(fabsf(gp) / 10000.0f);
              float r = gImp ? 255 : 0, g = gImp ? 35 : 220, b = gImp ? 25 : 90;
              float base = 0.35f + 0.35f * f;               // väčší výkon = jasnejší pás
              for (int p = 0; p < 5; p++) add(p, r, g, b, base + 0.45f * cg[p]);
            }

            // ---------- BATÉRIA (5–13): výška = SOC; nabíja zelená (nahor), vybíja červená (nadol) ----------
            for (int p = 0; p < nb; p++) {
              if (bChg)      add(5 + p, 0, 220, 90, 0.5f + 0.45f * cb[p]);
              else if (bDis) add(5 + p, 255, 40, 30, 0.5f + 0.45f * cb[p]);
              else           add(5 + p, 80, 130, 255, 0.4f);   // batéria stojí: tlmená modrá
            }

            // ---------- VÝROBA FVE (14–27): žltá od stredu do strán ----------
            float pv = in_pv;
            if (pv > 50) {
              float half = c01(pv / 10000.0f) * 7.0f;
              if (half < 0.6f) half = 0.6f;
              for (int i = 14; i <= 27; i++) {
                float d = fabsf(i - 20.5f);
                float fill = c01(half - d + 0.5f);
                if (fill <= 0) continue;
                float a = 0.75f + 0.25f * sinf(t * 1.2f + d * 0.7f);
                add(i, 255, 170, 15, a * fill);
              }
            }

            // ---------- PLYN (28–36): plameň zdola, výška = výkon ----------
            static float fl[9];
            float gas = in_gas;
            float gh = gas > 0.05f ? c01(gas / 28.0f) * 9.0f : 0.0f;
            if (gas > 0.05f && gh < 1.0f) gh = 1.0f;
            for (int p = 0; p < 9; p++) {
              float fill = c01(gh - p);
              if (fill <= 0) { fl[p] = 0; continue; }
              float target = 0.5f + 0.5f * random_float();
              fl[p] += (target - fl[p]) * 0.25f;
              float k = p / 8.0f;                          // 0 = spodok (žltooranžová), 1 = vrch (červenooranžová)
              add(36 - p, 255, 150 - 110 * k, 10, fl[p] * fill);
            }

            // ---------- ZABEZPEČENIE PRÍSTREŠKU (37–41) ----------
            for (int i = 37; i <= 41; i++) {
              if (in_sec) add(i, 0, 200, 70, 0.55f);        // stráži: zelená
              else        add(i, 255, 30, 20, 0.5f);        // nestráži: červená
            }

            // ---------- UDALOSTI ----------
            uint32_t ev = now - id(ev_start);
            if (id(ev_type) == 1) {                          // pohyb: biele svetlo obehne rám (1,5 s)
              if (ev > 1500) id(ev_type) = 0;
              else {
                float head = ev / 1500.0f * (N + 6);
                for (int i = 0; i < N; i++) {
                  float d = head - i;
                  if (d >= 0 && d < 6) add(i, 255, 255, 255, 1.0f - d / 6.0f);
                }
              }
            } else if (id(ev_type) == 2) {                   // oslava: červeno-biela vlna + iskry (8 s)
              if (ev > 8000) id(ev_type) = 0;
              else {
                float e = ev / 1000.0f;
                float env = c01(e / 0.3f) * c01((8.0f - e) / 1.0f);
                for (int i = 0; i < N; i++) {
                  float ph = i / (float) N * 4.0f - e * 1.2f;
                  bool white = fmodf(ph + 100.0f, 1.0f) < 0.35f;
                  float r = 255, g = white ? 255 : 0, b = white ? 255 : 0;
                  if (random_float() < 0.05f) { r = 255; g = 255; b = 255; }
                  R[i] = R[i] * (1 - env) + r * env;
                  G[i] = G[i] * (1 - env) + g * env;
                  B[i] = B[i] * (1 - env) + b * env;
                }
              }
            }

            // ---------- výstup ----------
            for (int i = 0; i < N; i++) {
              float m = (id(ev_type) != 0) ? fmaxf(master, 0.6f * jd) : master;   // udalosti vidno aj v noci
              it[i] = Color((uint8_t) fminf(255.0f, R[i] * m), (uint8_t) fminf(255.0f, G[i] * m), (uint8_t) fminf(255.0f, B[i] * m));
            }

# ---------------- Údaje z Home Assistantu pre LED rám ----------------
sensor:
  - platform: homeassistant
    id: ha_pv
    entity_id: sensor.pv_power_inverter_keep          # W
    internal: true
  - platform: homeassistant
    id: ha_grid
    entity_id: sensor.em_main_power_keep              # W, + odber, − pretok
    internal: true
  - platform: homeassistant
    id: ha_bat
    entity_id: sensor.smartshunt_vykon_bateria_smartshunt_pristresok   # W, + nabíja, − vybíja
    internal: true
  - platform: homeassistant
    id: ha_soc
    entity_id: sensor.smartshunt_soc_bateria_smartshunt_pristresok     # %
    internal: true
  - platform: homeassistant
    id: ha_gas
    entity_id: sensor.gas_power_keep                  # kW
    internal: true
  - platform: homeassistant
    id: ha_sun_el
    entity_id: sun.sun
    attribute: elevation
    internal: true

binary_sensor:
  - platform: homeassistant
    id: ha_security
    entity_id: input_boolean.zabezpecenie
    internal: true
  - platform: homeassistant
    id: ha_motion
    entity_id: binary_sensor.zahrada_vchod_pohyb
    internal: true
    on_press:
      - lambda: |-
          if (id(ev_type) == 0) { id(ev_type) = 1; id(ev_start) = millis(); }
  - platform: homeassistant
    id: ha_dym
    entity_id: binary_sensor.kuchyna_dym
    internal: true
  - platform: homeassistant
    id: ha_voda_kuchyna
    entity_id: binary_sensor.kuchyna_zaplava
    internal: true
  - platform: homeassistant
    id: ha_voda_kupelna
    entity_id: binary_sensor.kupelna_hore_zaplava
    internal: true
  - platform: homeassistant
    id: ha_sirena
    entity_id: siren.pristresok_sirena_alarm
    internal: true

# ---------------- Ovládanie LED rámu z HA ----------------
switch:
  - platform: template
    name: "LED rám logika"            # vypnuté = rám nesvieti vôbec (ani poplach)
    id: led_logic
    icon: mdi:led-strip-variant
    optimistic: true
    restore_mode: RESTORE_DEFAULT_ON
  - platform: template
    name: "LED rám simulácia"         # zapnuté = vymyslené hodnoty, všetky úseky sa pomaly menia
    id: led_sim
    icon: mdi:play-circle-outline
    optimistic: true
    restore_mode: ALWAYS_OFF

number:
  - platform: template
    name: "LED jas deň"
    id: led_jas_den
    icon: mdi:brightness-7
    optimistic: true
    restore_value: true
    initial_value: 100
    min_value: 0
    max_value: 100
    step: 5
    unit_of_measurement: "%"
    mode: slider
  - platform: template
    name: "LED jas noc"
    id: led_jas_noc
    icon: mdi:brightness-3
    optimistic: true
    restore_value: true
    initial_value: 25
    min_value: 0
    max_value: 100
    step: 5
    unit_of_measurement: "%"
    mode: slider

# Tlačidlá v HA na vyskúšanie efektov
button:
  - platform: template
    name: "LED test pohyb"
    icon: mdi:motion-sensor
    on_press:
      - lambda: 'id(ev_type) = 1; id(ev_start) = millis();'
  - platform: template
    name: "LED test poplach"
    icon: mdi:alarm-light
    on_press:
      - lambda: 'id(test_alarm_until) = millis() + 5000;'
  - platform: template
    name: "LED oslava odberateľa"
    icon: mdi:party-popper
    on_press:
      - lambda: 'id(ev_type) = 2; id(ev_start) = millis();'
```

:::info Čo som v kóde zmenil oproti svojej verzii
Odstránil som meranie teplôt v izbách (to isté ESP mi meria aj teploty cez 1-Wire, do tohto návodu však nepatrí), nepoužívané premenné a zvyšky z ESPHome Web. Svetlo sa namiesto „WLED“ volá „LED rám“, aby si ho nikto nemýlil s projektom WLED. `min_version` je 2024.8.0, lebo `api: actions:` funguje až od tejto verzie.
:::

### Oslava nového odberateľa – automatizácia v HA

ESP len čaká na akciu `led_oslava`. Kedy ju spustiť, rozhoduje Home Assistant. Ja mám v HA integráciu **YouTube**, ktorá dáva senzor s počtom odberateľov kanála. Keď číslo stúpne, LED rám spustí oslavu a mne príde notifikácia cez Pushover:

```yaml automatizacia-oslava.yaml
alias: LED rám – oslava nového odberateľa YouTube
description: >-
  Keď pribudne odberateľ na kanáli TinkerMyHome, LED rám spustí oslavu a príde
  Pushover notifikácia.
triggers:
  - trigger: state
    entity_id: sensor.subscribers_tinkermyhome
    not_from:
      - unavailable
      - unknown
    not_to:
      - unavailable
      - unknown
conditions:
  - condition: template
    value_template: >
      {{ trigger.from_state.state | is_number and trigger.to_state.state |
      is_number
         and trigger.to_state.state | float > trigger.from_state.state | float }}
actions:
  - action: esphome.led_ram_led_oslava
  - action: notify.pushover
    data:
      title: 🎉 Nový odberateľ na YouTube
      message: >-
        TinkerMyHome má {{ trigger.to_state.state | int }} odberateľov (+{{
        (trigger.to_state.state | int) - (trigger.from_state.state | int) }}).
mode: single
```

`not_from` / `not_to` a podmienka s `is_number` zabezpečia, že oslava nezačne po reštarte HA alebo výpadku integrácie, keď senzor na chvíľu nemá hodnotu. Názov akcie `esphome.led_ram_led_oslava` vzniká z mena zariadenia (`led-ram`) a názvu akcie v ESP – ak máš zariadenie pomenované inak, zmení sa aj on.

## Na čo si dať pozor

- **Menej je viac.** Dashboard, na ktorom je všetko, nie je prehľadný. Daj tam len to, na čo sa naozaj pozeráš.
- **Mysli na ostatných.** Ak ho má používať aj rodina, musí byť jasný bez vysvetľovania.
- **Jas v noci.** Svietiaci displej aj LED rám v tmavej miestnosti oslepujú – nastav nočný jas.
- **Batéria tabletu.** Nonstop nabíjanie skracuje život batérie, v horšom prípade sa nafúkne.
- **Poplach musí prebiť všetko.** Ak LED rám ukazuje alarmy, nesmie ich prekryť žiadna iná animácia.

## Zhrnutie

1. Smart dom sa má riadiť sám, ale dashboard ti ukáže, či to naozaj robí.
2. Každý v rodine ho používa inak – navrhni ho pre všetkých.
3. Tablet je najlacnejší, displej + počítač je spoľahlivejší, TV je na občasný pohľad.
4. Káble skry pri vypínači alebo cez stenu, displej uchyť držiakom alebo na magnety.
5. Adresovateľný LED rám rozšíri dashboard tak, že stav domu vidíš aj z druhého konca miestnosti.
6. Dizajn už nie je limit – s AI si spravíš dashboard presne podľa seba.
