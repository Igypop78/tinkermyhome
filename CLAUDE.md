# TinkerMyHome – pokyny pre AI

Web **tinkermyhome.com** stavia a píše AI pre Igyho (GitHub Igypop78). Igy schvaľuje dizajn a každý článok **pred** pushom na `main` – push na `main` = nasadenie naostro (Cloudflare Workers).

## Stavba
- `node build.mjs` → `dist/` (bez závislostí, Node ≥ 18). `--check` len kontrola (aj nefunkčných interných odkazov), `--drafts` zahrnie koncepty.
- Cloudflare Workers (statické súbory, `wrangler.jsonc`): build `node build.mjs`, deploy `npx wrangler deploy`, napojené na GitHub – push na `main` = nasadenie.
- `site.config.mjs` – sekcie, pripravované témy (`planned`), projekty, fakty o dome, texty rozhrania SK/EN.
- `lib/markdown.mjs` – vlastný Markdown, `assets/` – CSS (iOS štýl), JS, favicon. `static/` sa kopíruje do koreňa (`_headers`).
- Fotka autora: ak existuje `assets/igy.jpg` (štvorec, min. 200 px), použije sa namiesto krúžku „Ig“.

## Jazyky a adresy
- SK je hlavný jazyk v koreni (`/zacni-tu/<slug>/`), EN pod `/en/` (`/en/start-here/<slug>/`).
- Každý článok má SK aj EN verziu s rovnakým `id` – tak sa prepojí prepínač jazyka. Slug sa prekladá.

## Nový článok
Súbor `content/<sk|en>/<sekcia>/<slug>.md`:
```
---
id: deye-soc            # rovnaké v SK aj EN; ak je v planned, nahradí „Pripravujem“
title: …
description: …          # 1 veta pre Google a sociálne siete
section: energy         # start | energy | home | diy | ai | reviews | projects
level: 3                # 1 Začiatočník, 2 Pokročilý, 3 Expert
step: 2                 # len pre sekciu start (poradie v ceste Začni tu)
date: 2026-11-08
updated: 2026-11-20     # voliteľné
slug: ako-dostat-soc-do-deye
tldr: Krátke zhrnutie v 2–3 vetách, **tučné** povolené.
draft: true             # voliteľné – nezverejní sa
---
```
Markdown: `##` nadpisy (tvoria obsah), tabuľky, ```` ```yaml nazov.yaml ```` (blok s tlačidlom Kopírovať), rámčeky `:::me Ako to mám ja` / `:::tip` / `:::info` / `:::warn` … `:::`.

## Štýl písania
- Tykanie, priateľsky, konkrétne. Krátke odseky, žiadna vata.
- Vždy z reálneho Igyho domu (rámček „Ako to mám ja“). Nevymýšľať čísla, ceny ani skúsenosti – čo nevieš, nechaj ako `[DOPLNIŤ]` a spýtaj sa.
- Začiatočníkom vysvetliť pojmy, pokročilým dať YAML na kopírovanie.
- HA YAML v aktuálnej syntaxi (`triggers:` / `trigger:`, `actions:` / `action:`).
- Nezverejňovať IP adresy, heslá, presnú adresu domu ani mená susedov.
- Po napísaní: `node build.mjs`, pozrieť stránku, ukázať Igymu, až po schválení push.
