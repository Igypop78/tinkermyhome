// Generátor webu TinkerMyHome. Bez závislostí: `node build.mjs` → priečinok dist/.
// Obsah: content/<jazyk>/**/*.md (front matter – pozri CLAUDE.md).

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { markdown, frontMatter, esc, inline } from './lib/markdown.mjs';
import { site, sections, planned, projects, liveTiles, levels, t as T } from './site.config.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
const CHECK = process.argv.includes('--check');
const DRAFTS = process.argv.includes('--drafts');

// ---------- pomocné ----------
const read = (p) => fs.readFileSync(p, 'utf8');
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith('.md') ? [path.join(dir, d.name)] : []);
}
function write(rel, content) {
  const p = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const d of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, d.name), t = path.join(dst, d.name);
    d.isDirectory() ? copyDir(s, t) : fs.copyFileSync(s, t);
  }
}
const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);
const fmtDate = (d, lang) => new Date(d + 'T12:00:00Z').toLocaleDateString(lang === 'sk' ? 'sk-SK' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const prefix = (lang) => (lang === site.defaultLang ? '' : `/${lang}`);
const sec = (key) => sections.find((s) => s.key === key);
const secUrl = (key, lang) => `${prefix(lang)}/${sec(key)[lang].slug}/`;

const ICONS = {
  book: 'M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2zM8 7h8M8 11h6',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  home: 'M3 11 12 3l9 8M5 9.5V21h14V9.5M10 21v-6h4v6',
  chip: 'M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  wifi: 'M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  play: 'M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9l5 3-5 3z',
  rss: 'M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8M6 18h.01',
  github: 'M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.9-2.3c3-.3 6-1.5 6-6.6a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6 1.1 4.9 1.4 4.9 1.4a4.8 4.8 0 0 0-.1 3.6A5.2 5.2 0 0 0 3.4 8.6c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.3V21',
};
const icon = (name, size = 19, stroke = 2) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[name] || ICONS.book}"/></svg>`;
const chevron = '<svg class="chev" width="9" height="15" viewBox="0 0 9 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 1.5 7.5 7.5 1.5 13.5"/></svg>';
const PHOTO = fs.existsSync(path.join(ROOT, 'assets/igy.jpg')) ? '/assets/igy.jpg' : null;
const avatar = (size) => PHOTO
  ? `<img class="avatar" src="${PHOTO}" alt="" width="${size}" height="${size}" style="width:${size}px;height:${size}px">`
  : `<span class="avatar" aria-hidden="true" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.38)}px">Ig</span>`;
const levelChip = (lvl, lang) => levels[lvl] ? `<span class="lvl ${levels[lvl].cls}">${levels[lvl][lang]}</span>` : '';

// ---------- obsah ----------
const docs = [];
for (const lang of site.langs) {
  for (const file of walk(path.join(ROOT, 'content', lang))) {
    const { data, body } = frontMatter(read(file));
    if (data.draft && !DRAFTS) continue;
    const rel = path.relative(ROOT, file);
    for (const k of ['title', 'slug']) if (!data[k]) throw new Error(`${rel}: chýba "${k}"`);
    const type = data.type || 'article';
    if (type === 'article') {
      for (const k of ['id', 'section', 'date', 'description']) if (!data[k]) throw new Error(`${rel}: chýba "${k}"`);
      if (!sec(data.section)) throw new Error(`${rel}: neznáma sekcia "${data.section}"`);
    }
    const md = markdown(body, { copyLabel: T[lang].copy, avatar: avatar(28) });
    const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
    const url = type === 'page' ? `${prefix(lang)}/${data.slug}/` : `${secUrl(data.section, lang)}${data.slug}/`;
    docs.push({ ...data, type, lang, url, html: md.html, toc: md.toc, minutes: Math.max(1, Math.round(words / 200)), file: rel });
  }
}
const articles = (lang) => docs.filter((d) => d.type === 'article' && d.lang === lang).sort((a, b) => `${b.date} ${b.time || ''}`.localeCompare(`${a.date} ${a.time || ''}`));
const findById = (id, lang) => docs.find((d) => d.id === id && d.lang === lang);
const translationOf = (d) => {
  const other = site.langs.find((l) => l !== d.lang);
  if (d.id) { const x = findById(d.id, other); if (x) return x.url; }
  if (d.type === 'page' && d.pair) { const x = docs.find((p) => p.lang === other && p.slug === d.pair); if (x) return x.url; }
  return null;
};

// cesta „Začni tu“ – plánované kroky + vydané články
function startPath(lang) {
  return planned.filter((p) => p.section === 'start').sort((a, b) => a.step - b.step).map((p) => {
    const d = findById(p.id, lang);
    return { step: p.step, title: d ? d.title : p[lang], url: d ? d.url : null, level: p.level };
  });
}
const plannedFor = (key, lang) => planned.filter((p) => p.section === key && !findById(p.id, lang));

// ---------- šablóny ----------
const CSS = read(path.join(ROOT, 'assets/style.css'));
const JS = read(path.join(ROOT, 'assets/app.js'));
const V = hash(CSS + JS);

function layout({ lang, title, description, url, alt, active, body, ogType = 'website', jsonld }) {
  const L = T[lang];
  const full = title ? `${title} · ${site.name}` : `${site.name} – ${L.tagline}`;
  const other = site.langs.find((l) => l !== lang);
  const altUrl = alt || T[other].home;
  const nav = sections.map((s) =>
    `<a href="${secUrl(s.key, lang)}"${active === s.key ? ' class="on" aria-current="page"' : ''}>${esc(s[lang].name)}</a>`).join('');
  return `<!doctype html>
<html lang="${L.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description || L.siteDesc)}">
<link rel="canonical" href="${site.url}${url}">
<link rel="alternate" hreflang="${lang}" href="${site.url}${url}">
${alt ? `<link rel="alternate" hreflang="${other}" href="${site.url}${alt}">` : ''}
<link rel="alternate" type="application/rss+xml" title="${site.name}" href="${prefix(lang)}/feed.xml">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title || site.name)}">
<meta property="og:description" content="${esc(description || L.siteDesc)}">
<meta property="og:url" content="${site.url}${url}">
<meta property="og:locale" content="${L.locale}">
<meta name="theme-color" content="#F2F2F7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&amp;text=tinkermyhome&amp;display=swap">
<link rel="stylesheet" href="/assets/style.css?v=${V}">
<script>(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}})();</script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">${lang === 'sk' ? 'Preskočiť na obsah' : 'Skip to content'}</a>
<header class="top wrap">
<div class="bar">
<div class="brand">
<button class="switch" type="button" data-theme-toggle aria-label="${esc(L.theme)}">
<svg width="38" height="38" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M8 30 L32 10 L56 30" stroke="currentColor" stroke-width="4.5"/><path d="M15 25 V54 H49 V25" stroke="currentColor" stroke-width="4.5"/>
<rect x="21" y="34" width="22" height="12" rx="6" stroke="currentColor" stroke-width="3"/><circle class="knob" cx="37" cy="40" r="4" fill="#EA580C"/></svg>
</button>
<a class="wordmark" href="${L.home}">tinker<span>my</span>home</a>
</div>
<div class="seg" role="group" aria-label="${esc(L.language)}">
${site.langs.map((l) => l === lang
    ? `<span aria-current="true">${l.toUpperCase()}</span>`
    : `<a href="${altUrl}" hreflang="${l}" lang="${l}">${l.toUpperCase()}</a>`).join('')}
</div>
</div>
<nav class="pills" aria-label="${esc(L.menu)}">${nav}</nav>
</header>
<main id="main">
${body}
</main>
<footer class="foot wrap">
<span>${site.url.replace('https://', '')} · ${site.author} · © ${site.year}</span>
<span class="links">
<a href="${lang === 'sk' ? '/o-mne/' : '/en/about/'}">${L.about}</a>
<a href="${site.youtube}" rel="noopener">${L.youtube}</a>
<a href="${site.github}" rel="noopener">GitHub</a>
<a href="${prefix(lang)}/feed.xml">${L.rss}</a>
</span>
</footer>
<script src="/assets/app.js?v=${V}" defer></script>
</body>
</html>
`;
}

function articleCard(d, lang) {
  const s = sec(d.section);
  return `<a class="card post" href="${d.url}">
<span class="cover" style="background:${s.color}">${icon(s.icon, 60, 1.4)}</span>
<span class="body"><span class="meta"><span>${esc(s[lang].name)}</span>${levelChip(d.level, lang)}</span>
<span class="title">${esc(d.title)}</span></span></a>`;
}
function plannedCard(p, lang) {
  const s = sec(p.section);
  return `<div class="card post planned">
<span class="cover" style="background:${s.color}">${icon(s.icon, 60, 1.4)}</span>
<span class="body"><span class="meta"><span>${esc(s[lang].name)} · ${T[lang].soon}</span>${levelChip(p.level, lang)}</span>
<span class="title">${esc(p[lang])}</span></span></div>`;
}
function row({ href, title, sub, color, iconName, badge }) {
  const inner = `<span class="ico" style="background:${color}">${icon(iconName)}</span>
<span class="txt"><span class="t">${esc(title)}</span>${sub ? `<span class="s">${esc(sub)}</span>` : ''}</span>
${badge ? `<span class="badge">${esc(badge)}</span>` : ''}${href ? chevron : ''}`;
  return href ? `<a class="row" href="${href}">${inner}</a>` : `<div class="row dim">${inner}</div>`;
}
function projectRows(lang) {
  return projects.map((p) => `<div class="row">
<span class="ico big" style="background:${p.color}">${icon(p.icon, 28, 1.8)}</span>
<span class="txt"><span class="t">${esc(lang === 'en' && p.nameEn ? p.nameEn : p.name)}</span><span class="s">${esc(p[lang])}</span></span>
<a class="get" href="${p.url}" rel="noopener">${p.tag}</a></div>`).join('');
}

// ---------- stránky ----------
function homePage(lang) {
  const L = T[lang];
  const list = articles(lang);
  const sp = startPath(lang);
  const latest = list.slice(1, 7).map((d) => articleCard(d, lang));
  const fill = planned.filter((p) => p.section !== 'start' && !findById(p.id, lang)).slice(0, Math.max(0, 3 - latest.length)).map((p) => plannedCard(p, lang));
  const proRows = ['energy', 'diy', 'ai', 'home'].map((k) => { const s = sec(k); return row({ href: secUrl(k, lang), title: s[lang].name, sub: s[lang].desc, color: s.color, iconName: s.icon }); });
  const body = `
<section class="hero wrap">
<div class="hero-text">
<div class="hello">${avatar(52)}<span><b>${L.hello}</b><span>${L.helloSub}</span></span></div>
<h1>${L.heroTitle}</h1>
<p class="lead">${L.heroText}</p>
<div class="ctas"><a class="btn" href="${secUrl('start', lang)}">${L.ctaStart}</a><a class="btn soft" href="${secUrl('home', lang)}">${L.ctaTour}</a></div>
</div>
${list[0] ? `<aside class="featured" aria-label="${esc(L.latest)}"><h2 class="ghead">${L.latest}</h2>${articleCard(list[0], lang)}</aside>` : ''}
</section>
<section class="wrap">
<div class="shead"><h2>${L.ytTitle}</h2><p>${L.ytSub}</p></div>
<div class="list">${row({ href: site.youtube, title: L.ytRow, sub: L.ytRowSub, color: '#FF0000', iconName: 'play' })}</div>
</section>
<section class="wrap groups">
<div><h2 class="ghead">${L.groupNew}</h2><div class="list">${sp.map((p) => row({ href: p.url, title: p.title, sub: L.pathOf(p.step, sp.length), color: '#34C759', iconName: 'book', badge: p.url ? '' : L.soon })).join('')}</div></div>
<div><h2 class="ghead">${L.groupPro}</h2><div class="list">${proRows.join('')}</div></div>
</section>
<section class="wrap">
<div class="shead"><h2>${latest.length ? L.latest : L.planned}</h2></div>
<div class="posts">${latest.join('')}${fill.join('')}</div>
</section>
<section class="wrap"><div class="band">
<div><span class="eyebrow">${L.tourEyebrow}</span><h2>${L.tourTitle}</h2><p>${L.tourText}</p><a class="btn alt" href="${secUrl('home', lang)}">${L.tourCta}</a></div>
<div class="live-wrap"><div class="tiles">${liveTiles[lang].map((f) => `<div class="tile"${f.title ? ` title="${esc(f.title)}"` : ''}><b data-v="${f.v}" data-fmt="${f.fmt}">–</b><span>${esc(f.label)}</span><small>${esc(f.sub)} <b data-v="${f.sv}" data-fmt="${f.sfmt || f.fmt}">–</b></small></div>`).join('')}</div>
<p class="live-now" hidden><span class="dot" aria-hidden="true"></span><span data-live-text></span></p></div>
</div></section>
<section class="wrap">
<div class="shead"><h2>${L.projects}</h2><p>${L.projectsSub}</p></div>
<div class="list projects">${projectRows(lang)}</div>
</section>`;
  const jsonld = { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url + T[lang].home, inLanguage: lang, author: { '@type': 'Person', name: site.author } };
  return layout({ lang, url: T[lang].home, alt: T[site.langs.find((l) => l !== lang)].home, body, jsonld });
}

function sectionPage(s, lang) {
  const L = T[lang];
  const list = articles(lang).filter((d) => d.section === s.key);
  let content;
  if (s.key === 'start') {
    const sp = startPath(lang);
    content = `<ol class="list path">${sp.map((p) => `<li>${row({ href: p.url, title: p.title, sub: L.pathOf(p.step, sp.length), color: '#34C759', iconName: 'book', badge: p.url ? '' : L.soon })}</li>`).join('')}</ol>`;
    const extra = list.filter((d) => !sp.some((p) => p.url === d.url)).reverse();
    if (extra.length) content += `<h2 class="ghead">${L.startMore}</h2><div class="posts">${extra.map((d) => articleCard(d, lang)).join('')}</div>`;
  } else {
    const plan = plannedFor(s.key, lang);
    content = (list.length ? `<div class="posts">${list.map((d) => articleCard(d, lang)).join('')}</div>` : '') +
      (s.key === 'projects' ? `<div class="list projects">${projectRows(lang)}</div>` : '') +
      (plan.length ? `<h2 class="ghead">${L.planned}</h2><div class="list">${plan.map((p) => row({ title: p[lang], sub: levels[p.level][lang], color: s.color, iconName: s.icon, badge: L.soon })).join('')}</div>` : '');
  }
  const other = site.langs.find((l) => l !== lang);
  const body = `<section class="wrap page-head"><span class="ico xl" style="background:${s.color}">${icon(s.icon, 30, 1.8)}</span><h1>${esc(s[lang].name)}</h1><p class="lead">${esc(s[lang].desc)}</p></section>
<section class="wrap section">${content}</section>`;
  return layout({ lang, title: s[lang].name, description: s[lang].desc, url: secUrl(s.key, lang), alt: secUrl(s.key, other), active: s.key, body });
}

function articlePage(d) {
  const L = T[d.lang];
  const s = sec(d.section);
  const alt = translationOf(d);
  const sp = d.section === 'start' ? startPath(d.lang) : null;
  const idx = sp ? sp.findIndex((p) => p.url === d.url) : -1;
  const pathBox = sp && idx >= 0 ? `<div class="side-box"><span class="cap">${esc(s[d.lang].name)} · ${idx + 1} / ${sp.length}</span>
<div class="progress"><span style="width:${Math.round(((idx + 1) / sp.length) * 100)}%"></span></div>
<ol class="steps">${sp.map((p, k) => `<li class="${k === idx ? 'on' : k < idx ? 'done' : ''}"><span class="n">${k + 1}</span>${p.url && k !== idx ? `<a href="${p.url}">${esc(p.title)}</a>` : `<span>${esc(p.title)}${p.url ? '' : ` <em>· ${L.soon}</em>`}</span>`}</li>`).join('')}</ol></div>` : '';
  const prevNext = sp && idx >= 0 ? (() => {
    const prev = sp[idx - 1], next = sp[idx + 1];
    const cell = (p, dir) => p ? (p.url
      ? `<a class="pn ${dir}" href="${p.url}"><span>${dir === 'next' ? L.next + ' →' : '← ' + L.prev}</span><b>${esc(p.title)}</b></a>`
      : `<div class="pn ${dir} dim"><span>${dir === 'next' ? L.next : L.prev} · ${L.soon}</span><b>${esc(p.title)}</b></div>`) : '<span></span>';
    return `<nav class="prevnext" aria-label="${esc(s[d.lang].name)}">${cell(prev, 'prev')}${cell(next, 'next')}</nav>`;
  })() : '';
  const dateLine = d.updated && d.updated !== d.date ? `${L.updated} ${fmtDate(d.updated, d.lang)}` : fmtDate(d.date, d.lang);
  const body = `<article class="wrap article">
<header class="art-head">
<a class="crumb" href="${secUrl(d.section, d.lang)}">${esc(s[d.lang].name)}</a>
<h1>${esc(d.title)}</h1>
<div class="byline">${avatar(40)}<span class="who"><b>${site.author}</b><span>${dateLine} · ${L.minRead(d.minutes)}</span></span>
<span class="lvlline">${levelChip(d.level, d.lang)}${sp && idx >= 0 ? ` <span class="part">${L.pathOf(idx + 1, sp.length)}</span>` : ''}</span>
${alt ? `<a class="other" href="${alt}" hreflang="${d.lang === 'sk' ? 'en' : 'sk'}">${L.readOther}</a>` : ''}</div>
</header>
<div class="art-grid">
<div class="prose">
${d.tldr ? `<div class="tldr"><span class="cap">${L.tldr}</span><p>${inline(d.tldr)}</p></div>` : ''}
${d.html}
${prevNext}
</div>
<aside class="side">
${d.toc.length > 1 ? `<nav class="side-box toc" aria-label="${esc(L.toc)}"><span class="cap">${L.toc}</span>${d.toc.map((h) => `<a href="#${h.id}">${esc(h.text)}</a>`).join('')}</nav>` : ''}
${pathBox}
</aside>
</div>
</article>`;
  const jsonld = { '@context': 'https://schema.org', '@type': 'Article', headline: d.title, description: d.description, datePublished: d.date, dateModified: d.updated || d.date, inLanguage: d.lang, author: { '@type': 'Person', name: site.author }, url: site.url + d.url };
  return layout({ lang: d.lang, title: d.title, description: d.description, url: d.url, alt, active: d.section, body, ogType: 'article', jsonld });
}

function plainPage(d) {
  const body = `<article class="wrap article"><header class="art-head"><h1>${esc(d.title)}</h1></header><div class="art-grid"><div class="prose">${d.html}</div></div></article>`;
  return layout({ lang: d.lang, title: d.title, description: d.description, url: d.url, alt: translationOf(d), body });
}

function notFound() {
  const L = T.sk, E = T.en;
  const body = `<section class="wrap page-head"><h1>404</h1><p class="lead">${L.notFoundText}<br><span lang="en">${E.notFoundText}</span></p>
<div class="ctas"><a class="btn" href="/">${L.backHome}</a><a class="btn soft" href="/en/" lang="en">${E.backHome}</a></div></section>`;
  return layout({ lang: 'sk', title: L.notFound, url: '/404', body });
}

function feed(lang) {
  const L = T[lang];
  const items = articles(lang).slice(0, 30).map((d) => `<item><title>${esc(d.title)}</title><link>${site.url}${d.url}</link><guid>${site.url}${d.url}</guid><pubDate>${new Date(d.date + 'T08:00:00Z').toUTCString()}</pubDate><description>${esc(d.description)}</description></item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>${site.name}</title><link>${site.url}${L.home}</link><description>${esc(L.siteDesc)}</description><language>${lang}</language>
${items}
</channel></rss>
`;
}

// ---------- zostavenie ----------
const pages = new Map();
for (const lang of site.langs) {
  pages.set(`${prefix(lang)}/index.html`, homePage(lang));
  for (const s of sections) pages.set(`${prefix(lang)}/${s[lang].slug}/index.html`, sectionPage(s, lang));
  pages.set(`${prefix(lang)}/feed.xml`, feed(lang));
}
for (const d of docs) {
  const key = `${d.url}index.html`;
  if (pages.has(key)) throw new Error(`Duplicitná adresa ${d.url} (${d.file})`);
  pages.set(key, d.type === 'page' ? plainPage(d) : articlePage(d));
}
pages.set('/404.html', notFound());

const urls = [...pages.keys()].filter((k) => k.endsWith('index.html')).map((k) => k.replace(/index\.html$/, ''));
pages.set('/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${site.url}${u}</loc></url>`).join('\n')}
</urlset>
`);
pages.set('/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

// kontrola interných odkazov
const known = new Set([...urls, ...[...pages.keys()]]);
const broken = [];
for (const [k, html] of pages) {
  if (!k.endsWith('.html')) continue;
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const u = m[1];
    if (u.startsWith('/assets/')) continue;
    if (!known.has(u) && !known.has(u + 'index.html')) broken.push(`${k} → ${u}`);
  }
}
if (broken.length) { console.error('Nefunkčné odkazy:\n' + broken.join('\n')); process.exit(1); }

if (!CHECK) {
  fs.rmSync(DIST, { recursive: true, force: true });
  for (const [k, v] of pages) write(k, v);
  copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
  if (fs.existsSync(path.join(ROOT, 'static'))) copyDir(path.join(ROOT, 'static'), DIST);
}
console.log(`${CHECK ? 'Kontrola OK' : 'Hotovo'}: ${docs.length} dokumentov, ${pages.size} súborov${CHECK ? '' : ' → dist/'}`);
