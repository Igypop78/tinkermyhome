# Témy s vyhľadávacím potenciálom

**Dôležité:** Nemám prístup k nástrojom na hľadanosť kľúčových slov, preto sú hodnoty odhad podľa typu dopytu
a konkurencie v SK/CZ. Po mesiaci ich overíme v **Search Console** (Výkon → Dopyty) a v **YouTube Studio**
(Výskum → čo hľadajú diváci). Rýchla kontrola zadarmo: našepkávač Google a YouTube, Google Trends (krajina Slovensko).

Legenda: **Hľadanosť** ●●● vysoká / ●● stredná / ● nízka (ale presná). **Konkurencia** SK obsahu: N nízka / S stredná / V vysoká.

## Kde máš najväčšiu šancu

1. **Slovenské FVE + batéria + spot**: veľa ľudí to rieši, slovenského obsahu z reálneho domu s číslami je málo.
   Tvoje silné stránky sú vlastné čísla, Deye a AI Energy.
2. **Home Assistant po slovensky**: v SK skoro nikto nepíše návody od nuly. Sekcia Začni tu môže byť „referencia“.
3. **Anglické DIY niky**: celosvetová, no úzka téma (Deye + SmartShunt, Tesla BLE + ESP32, SmartEVSE + HA).
   Málo konkurencie, ľudia hľadajú presné riešenie a články zdieľajú na Reddite a fórach.

## Kľúčové slová a témy

### Energia & FVE
| Téma / dopyt | Hľadanosť | Konk. | Existuje? | Čo spraviť |
|---|---|---|---|---|
| fotovoltika návratnosť / oplatí sa FVE 2026 | ●●● | V | čiastočne (Moja FVE) | nový článok `fve-payback` s tvojimi číslami (plánovaný) |
| fotovoltika s batériou cena / koľko stojí FVE 10 kW | ●●● | V | Moja FVE (8 200 €) | do titulku „koľko stála“ |
| spotové ceny elektriny / OKTE / predaj elektriny na spot | ●● | N | áno | video už je, Shorts |
| virtuálna batéria – oplatí sa? | ●● | S | spomenuté vo videu | samostatný článok: virtuálna vs. fyzická batéria |
| Deye nastavenie / Deye Home Assistant | ●● | N | áno (spot, SOC) | samostatný návod „Deye do Home Assistanta“ (SK+EN) |
| LiFePO4 batéria svojpomocne / 280 Ah skriňa | ●● | S | spomenuté v FVE ceste | článok „Batéria 34 kWh svojpomocne“ |
| MRK, pripojenie FVE ZSD postup | ●● | N | spomenuté | praktický postup „Ako som pripájal FVE – papiere“ |
| koľko vyrobí FVE v zime | ●● | S | – | článok z tvojich dát (mesačná výroba) |
| autonómia domu / sebestačnosť | ● | N | plánované `autonomy` | z živých dát webu |
| **EN:** Deye Victron SmartShunt CAN ESPHome | ● | N | áno | Reddit r/diySolar, HA fórum (keď bude bezpečná verzia s BMS) |

### Home Assistant (Začni tu)
| Téma / dopyt | Hľadanosť | Konk. | Existuje? | Čo spraviť |
|---|---|---|---|---|
| Home Assistant návod slovensky / čo je Home Assistant | ●● | N | áno | video „HA za 10 minút“ |
| Home Assistant inštalácia / Raspberry Pi / Green | ●● | S | áno | video |
| Zigbee vs WiFi vs Matter | ●● | S | áno | Shorts |
| smart žiarovka a vypínač | ●● | N | áno | **video – evergreen**, schémy sa dobre ukazujú |
| najlepšie automatizácie Home Assistant | ●●● | V (EN) / N (SK) | plánované | článok + video „10 automatizácií, ktoré používame každý deň“ |
| čím začať smart home / čomu sa vyhnúť | ●● | N | plánované `start-avoid` | dokončiť cestu Začni tu (krok 4) |
| HACS čo to je, ako nainštalovať | ●● | N | – | krátky návod |
| Home Assistant záloha | ● | N | – | návod (máš 2. mini PC) |

### Môj dom / Elektromobil / DIY
| Téma / dopyt | Hľadanosť | Konk. | Existuje? | Čo spraviť |
|---|---|---|---|---|
| Tesla Model Y skúsenosti / elektromobil skúsenosti | ●●● | V | áno (60 000 km) | **video** |
| nabíjanie elektromobilu doma / wallbox | ●●● | S | čiastočne | článok „Wallbox SmartEVSE + FVE + HA“ |
| elektromobil v zime dojazd | ●● | S | áno (sekcia) | Shorts |
| Tesla Home Assistant ESP32 Bluetooth | ● | N | spomenuté | návod SK + **EN** |
| smart kúrenie / termostatické hlavice | ●● | S | áno | video neskôr |
| Aqara W100 Home Assistant | ● | N | spomenuté | krátky návod SK+EN |
| ESPHome / ESP32 návod | ●● | S | áno | video projektov |
| Hob2Hood digestor ESP32 | ● | N | spomenuté | malý návod SK+EN (aj Shorts) |
| Frigate kamery | ●● | S (EN) | plánované `cameras` | článok |
| homelab Proxmox Home Assistant | ●● | S | plánované `homelab` | článok + rack v Shorts |
| dashboard tablet na stene | ●● | S | plánované `dashboards` | článok + video (vizuálne silné) |

## Kalendár článkov na 2 mesiace (10 / mesiac)

Poradie podľa potenciálu a toho, čo už máš v hlave. Každý článok SK + EN. Kurzívou = ide k nemu video.

### December 2026
1. *Čím začať smart dom a čomu sa vyhnúť* (`start-avoid`, dokončí cestu Začni tu)
2. *Moje najlepšie automatizácie – 10, ktoré používame každý deň* (`best-automations`)
3. Oplatí sa FVE? Návratnosť z mojich čísel (`fve-payback` – reálne čísla od teba)
4. Virtuálna batéria vs. fyzická – moja skúsenosť
5. Wallbox SmartEVSE: nabíjanie auta z FVE v Home Assistante
6. Deye v Home Assistante – ako ho pripojiť a čo ovládať
7. Koľko vyrobí FVE v zime – moje mesačné čísla
8. HACS – čo to je a ako ho nainštalovať
9. Tesla v Home Assistante cez ESP32 a Bluetooth (EN verzia na Reddit)
10. Môj homelab – rack v komore (`homelab`)

### Január 2027
1. *Dashboardy a nástenný tablet* (`dashboards`)
2. Batéria 34 kWh svojpomocne – články, skriňa, BMS
3. Ako som pripájal FVE – papiere, MRK, ZSD (postup)
4. Kamery a Frigate (`cameras`)
5. Záloha Home Assistanta – ako to mám ja
6. AI a Home Assistant – čo funguje dnes (`ai-ha`)
7. Hob2Hood – digestor ovládaný varnou doskou cez ESP32
8. Aqara W100 – izbový panel pre kúrenie v HA
9. Autonómia domu za rok 2026 (`autonomy`, z živých dát)
10. Recenzia: [DOPLNIŤ – zariadenie, ktoré odporúčaš najviac]

Ak nový článok odpovedá na otázku, ktorú ľudia často kladú v skupinách, doplním ju na stránku Časté otázky.

## Tipy na SEO pri písaní (zapracujem automaticky)
- Kľúčové slovo v `title`, v prvej vete a v jednom `##` nadpise. Titulok do ~60 znakov, `description` do ~155.
- Interné odkazy: každý nový článok odkazuje na 2–3 staršie a jeden starší naň (aktualizujem).
- Pri aktualizácii vždy `updated:` – sitemap to pošle Google.
