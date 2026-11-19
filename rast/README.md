# Rast webu a YouTube – plán

Východisko (19. 11. 2026): YouTube **1 600 zhliadnutí, 62 odberateľov**, 1 video. Web: 21 článkov SK + EN.
Kapacita: **2 videá a 10 článkov mesačne**. Cieľ: YouTube aj web, SK aj EN publikum.

Súbory v tomto priečinku (na web sa nenasadzujú):
- `temy-seo.md` – témy s najväčším vyhľadávacím potenciálom + kalendár na 2 mesiace
- `scenare-videi.md` – 4 scenáre videí k existujúcim článkom + nápady na Shorts

## Hlavná myšlienka: zotrvačník web ↔ YouTube

Každá téma vyjde **dvakrát**: ako článok (Google, SK + EN) a ako video (YouTube, SK s EN titulkami).
Video je vložené v článku, článok je v popise videa. Každé video = 3–4 Shorts. Shorts privádzajú odberateľov,
dlhé videá a články budujú dôveru a vyhľadávanie.

## Čo je hotové na webe (v tejto vetve, čaká na schválenie)

| Zmena | Čo prinesie |
|---|---|
| Blok **„Páčil sa ti článok?“** na konci každého článku: tlačidlo *Odoberať na YouTube* (otvára rovno potvrdenie odberu) + najnovšie video, ak článok nemá vlastné | Konverzia čitateľov na odberateľov |
| Malá **YouTube karta v bočnom paneli** článku | Viditeľnosť kanála počas čítania |
| **Zdieľanie**: Facebook, WhatsApp, X, Reddit, LinkedIn, Kopírovať odkaz, na mobile natívne „Zdieľať“ – bez skriptov tretích strán | Jednoduchšie šírenie |
| **Mohlo by ťa zaujímať** – 3 súvisiace články pod článkom | Viac stránok na návštevu |
| Štruktúrované dáta: **Article** (s obrázkom), **BreadcrumbList**, **VideoObject** (pri článkoch s videom), autor so `sameAs` YouTube + GitHub | Video a drobčeky vo výsledkoch Google, silnejší autor (E-E-A-T) |
| Nový blok **`:::faq`** v Markdowne → rozbaľovacie otázky + **FAQPage** | Odpovede pre Google a AI vyhľadávače (ChatGPT, Perplexity, Google AI) |
| **Sitemap s `lastmod`** | Google rýchlejšie zistí nové a upravené články |
| Pripravené **Cloudflare Web Analytics** a **Google Search Console** (stačí doplniť token v `site.config.mjs`) | Konečne čísla |

FAQ blok v článku:
```
:::faq Časté otázky
? Koľko stojí FVE 10 kWp?
Odpoveď…
:::
```
Pozn.: Google od 2023 zobrazuje rozbalené FAQ vo výsledkoch už len pri úradných a zdravotníckych weboch.
Prínos je hlavne v AI vyhľadávačoch a v tom, že otázky zodpovedajú presne tomu, čo ľudia hľadajú.
FAQ do existujúcich článkov doplním, keď schváliš – otázky a odpovede len z faktov v článkoch.

## Čo musíš spraviť ty (15–30 min, jednorazovo)

### 1. Analytika (bez nej nevieme, čo funguje)
1. **Cloudflare** → Analytics & Logs → **Web Analytics** → Add a site → `tinkermyhome.com`.
   Buď zapni automatické vkladanie (bez zmeny kódu), alebo mi pošli **token** a vložím ho do `cfAnalyticsToken`.
   Bez cookies → netreba cookie lištu.
2. **Google Search Console** → pridať doménu `tinkermyhome.com` → overenie cez **DNS záznam v Cloudflare**
   (najjednoduchšie, Cloudflare to vie spraviť jedným klikom). Potom **Sitemaps → `sitemap.xml`**.
3. **Bing Webmaster Tools** → „Import from Google Search Console“ (2 min, Bing živí aj ChatGPT search a Copilot).

### 2. YouTube kanál
- **Popis kanála** s kľúčovými slovami: *Home Assistant, fotovoltika, batéria, Deye, elektromobil, smart home – po slovensky*. Odkaz na web.
- **Odkazy na kanáli**: tinkermyhome.com, GitHub (AI Energy).
- **Trailer kanála** pre neodberateľov – stačí 60 s zostrih z prehliadky domu (scenár 3).
- **Playlisty**: *Fotovoltika a batéria*, *Home Assistant od nuly*, *Elektromobil*, *Shorts*.
- **Predvolené nastavenia nahrávania** (Nastavenia → Predvolené hodnoty): do popisu šablóna nižšie.
- **Koncové obrazovky** (posledných 20 s): odber + „najlepšie video pre diváka“.
- **Titulky EN** ku každému videu – YouTube ich vygeneruje zo SK, stačí skontrolovať, alebo mi pošli prepis a preložím.
  Preložený **názov a popis** (Preklady v YouTube Studio) – videá sa potom ukazujú aj v anglickom vyhľadávaní.

Šablóna popisu videa:
```
[1–2 vety o čom je video, s kľúčovým slovom na začiatku]

📖 Celý článok s nastaveniami a YAML: https://tinkermyhome.com/…
🇬🇧 English article: https://tinkermyhome.com/en/…
⚡ AI Energy (zadarmo, HACS): https://github.com/Igypop78/ai-energy

Kapitoly:
0:00 …

#homeassistant #fotovoltika #smarthome
```

## Mesačný rytmus (2 videá + 10 článkov)

| Týždeň | Článok (SK + EN) | Video | Shorts | Distribúcia |
|---|---|---|---|---|
| 1 | 3 články | **Video A** (k existujúcemu článku) | 2 Shorts z A | článok + video do 1–2 skupín |
| 2 | 2 články | – | 2 Shorts z A | odpovedať v komunitách s odkazom |
| 3 | 3 články | **Video B** | 2 Shorts z B | článok + video do 1–2 skupín |
| 4 | 2 články | – | 2 Shorts z B | EN článok na Reddit / HA fórum |

Pravidlá:
- **Video vždy ku článku**, ktorý už existuje → do článku doplniť `::youtube`, video má článok v popise.
- **Shorts** = 30–50 s, jedna myšlienka, číslo alebo „wow“ záber; na konci „celé video na kanáli“. Natáčať naraz s dlhým videom (na výšku druhým telefónom).
- **Názvy videí**: konkrétny prínos + číslo, nie názov produktu. Napr. „60 000 km v elektromobile: 5 vecí, ktoré by som chcel vedieť skôr“ namiesto „Tesla Model Y skúsenosti“.
- **Miniatúra**: tvoja tvár + 2–3 slová + jedno číslo. Vždy rovnaký štýl (oranžová ako web).

## Distribúcia – kde a ako

Zlaté pravidlo: **v komunitách najprv pomáhať, odkaz až ako doplnok.** Nikdy nie len holý odkaz.

| Kde | Čo tam dávať |
|---|---|
| FB skupiny o FVE, batériách, Deye, elektromobiloch (SK/CZ) | odpoveď na otázku + „podrobne som to spísal tu“ |
| FB/Discord skupiny Home Assistant SK/CZ | návody zo sekcie Začni tu, YAML |
| **r/homeassistant**, **r/solar**, **r/diySolar**, **r/TeslaModelY** | EN verzie – DIY návody (Deye + SmartShunt, Tesla BLE, AI Energy). Reddit miluje „I built…“ s fotkou a číslami |
| **community.home-assistant.io** (Share your Projects) | AI Energy, Pattern Pilot, Igy Cards – každý projekt má vlastné vlákno |
| GitHub README projektov | odkaz na článok + video (už čiastočne je) |
| diskusie pod videami väčších SK/CZ kanálov o FVE/HA | hodnotný komentár, nie reklama |

## Čo merať (raz mesačne, 10 minút)

| Metrika | Kde | Cieľ o 3 mesiace* |
|---|---|---|
| Odberatelia | YouTube Studio | 62 → 250 |
| Zhliadnutia / mesiac | YouTube Studio | 1 600 celkovo → 3 000 / mesiac |
| CTR miniatúr | YouTube Studio | > 5 % |
| Návštevy webu / mesiac | Cloudflare Web Analytics | [DOPLNIŤ po 1. mesiaci merania] |
| Kliky z Google | Search Console | rastúci trend, top 10 dopytov |
| Odkazy web → YouTube | Cloudflare (odchody na youtube.com) | – |

\* Cieľ je odhad na nastavenie smeru, nie sľub. Po prvom mesiaci ho upravíme podľa reálnych čísel.
