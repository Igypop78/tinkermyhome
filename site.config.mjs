// Nastavenia webu TinkerMyHome. Texty rozhrania, sekcie a pripravované témy.
// SK je hlavný jazyk (koreň webu), EN beží pod /en/.

export const site = {
  url: 'https://tinkermyhome.com',
  name: 'TinkerMyHome',
  author: 'Igy',
  github: 'https://github.com/Igypop78',
  youtube: 'https://www.youtube.com/@TinkerMyHome',
  // najnovšie video na úvode (sekcia Videá)
  // DOČASNE SKRYTÉ (12. 11. 2026) – na obnovenie zmeň `latestVideo: null` späť na tento objekt:
  // latestVideo: { id: 'BzZWU2o-ohQ', sk: 'Predaj elektriny na spote: moja cesta a AI Energy', en: 'Selling electricity at spot prices: my journey and AI Energy', len: '8:45' },
  latestVideo: null,
  defaultLang: 'sk',
  langs: ['sk', 'en'],
  year: 2026,
};

// Sekcie hlavného menu. `key` je spoločný pre oba jazyky (front matter `section`).
export const sections = [
  { key: 'start', color: '#34C759', icon: 'book',
    sk: { slug: 'zacni-tu', name: 'Začni tu', desc: 'Home Assistant od nuly – čítaj v poradí.' },
    en: { slug: 'start-here', name: 'Start here', desc: 'Home Assistant from zero – read in order.' } },
  { key: 'energy', color: '#FF9500', icon: 'bolt',
    sk: { slug: 'energia', name: 'Energia & FVE', desc: 'Batéria, spotové ceny, meranie, kratšia návratnosť.' },
    en: { slug: 'energy', name: 'Energy & solar', desc: 'Batteries, spot prices, metering, faster payback.' } },
  { key: 'home', color: '#5856D6', icon: 'home',
    sk: { slug: 'moj-dom', name: 'Môj dom', desc: 'Prehliadka, homelab, kamery, dashboardy a tablet.' },
    en: { slug: 'my-home', name: 'My home', desc: 'House tour, homelab, cameras, dashboards, wall tablet.' } },
  { key: 'diy', color: '#30B0C7', icon: 'chip',
    sk: { slug: 'diy', name: 'DIY & ESP32', desc: 'Vlastné senzory a ovládanie za pár eur.' },
    en: { slug: 'diy', name: 'DIY & ESP32', desc: 'Your own sensors and controls for a few euros.' } },
  { key: 'ai', color: '#AF52DE', icon: 'spark',
    sk: { slug: 'ai', name: 'AI', desc: 'Čo AI doma naozaj zvládne a čo je len hype.' },
    en: { slug: 'ai', name: 'AI', desc: 'What AI can really do at home and what is hype.' } },
  { key: 'reviews', color: '#FF3B30', icon: 'star',
    sk: { slug: 'recenzie', name: 'Recenzie', desc: 'Zariadenia, ktoré som kúpil a používam.' },
    en: { slug: 'reviews', name: 'Reviews', desc: 'Devices I bought and actually use.' } },
  { key: 'projects', color: '#8E8E93', icon: 'server',
    sk: { slug: 'projekty', name: 'Projekty', desc: 'Moje open-source veci pre Home Assistant.' },
    en: { slug: 'projects', name: 'Projects', desc: 'My open-source things for Home Assistant.' } },
];

// Pripravované témy – zobrazia sa v sekcii ako „Pripravujem“, kým nevyjde článok s rovnakým `id`.
export const planned = [
  { id: 'ha-basics', section: 'start', level: 1, step: 1,
    sk: 'Home Assistant pre začiatočníkov: entity, zariadenia, automatizácie a celý ten zvyšok',
    en: 'Home Assistant explained: devices, entities, automations and the rest' },
  { id: 'ha-install', section: 'start', level: 1, step: 2,
    sk: 'Inštalácia Home Assistanta – všetky spôsoby a čo je podľa mňa najlepšie',
    en: 'Installing Home Assistant – every option and the one I recommend' },
  { id: 'protocols', section: 'start', level: 1, step: 3,
    sk: 'Zigbee, WiFi, Z-Wave alebo Matter – ktorou cestou ísť',
    en: 'Zigbee, WiFi, Z-Wave or Matter – which way to go' },
  { id: 'start-avoid', section: 'start', level: 1, step: 4,
    sk: 'Čím doma začať a čomu sa vyhnúť',
    en: 'Where to start at home and what to avoid' },
  { id: 'fve-payback', section: 'energy', level: 2,
    sk: 'FVE: ako dramaticky skrátiť návratnosť',
    en: 'Solar: how to cut the payback time dramatically' },
  { id: 'metering', section: 'energy', level: 2,
    sk: 'Meranie vody, plynu a elektriny v kombinácii s FVE',
    en: 'Metering water, gas and electricity together with solar' },
  { id: 'deye-soc', section: 'energy', level: 3,
    sk: 'Ako dostať SOC z batérií do Deye – porovnanie spôsobov',
    en: 'Getting battery SOC into a Deye inverter – the options compared' },
  { id: 'autonomy', section: 'energy', level: 3,
    sk: 'Na koľko % je váš dom autonómny – AI pipeline',
    en: 'How self-sufficient is your house – an AI pipeline' },
  { id: 'house-tour', section: 'home', level: 1,
    sk: 'Ako funguje môj dom – čo všetko tam mám a ako',
    en: 'How my house works – everything I have and how' },
  { id: 'best-automations', section: 'home', level: 1,
    sk: 'Moje najlepšie automatizácie',
    en: 'My best automations' },
  { id: 'homelab', section: 'home', level: 2,
    sk: 'Môj homelab – z čoho sa skladá a prečo',
    en: 'My homelab – what it is made of and why' },
  { id: 'cameras', section: 'home', level: 2,
    sk: 'Kamery a nahrávanie',
    en: 'Cameras and recording' },
  { id: 'dashboards', section: 'home', level: 2,
    sk: 'Dashboardy v HA a nástenný tablet s AI',
    en: 'HA dashboards and a wall tablet with AI' },
  { id: 'esp32', section: 'diy', level: 2,
    sk: 'ESP32 – ako na to a moje top use-casy',
    en: 'ESP32 – how to start and my top use cases' },
  { id: 'ai-ha', section: 'ai', level: 2,
    sk: 'AI a Home Assistant – čo funguje dnes',
    en: 'AI and Home Assistant – what works today' },
  { id: 'reviews', section: 'reviews', level: 1,
    sk: 'Recenzie smart zariadení',
    en: 'Smart device reviews' },
];

// Open-source projekty (sekcia Projekty a úvodná stránka).
export const projects = [
  { name: 'AI Energy', url: 'https://github.com/Igypop78/ai-energy', tag: 'HACS', color: '#FF9500', icon: 'bolt',
    sk: 'Batéria a nabíjanie auta podľa spotových cien OKTE.', en: 'Battery and EV charging driven by OKTE spot prices.' },
  { name: 'Igy Cards', url: 'https://github.com/Igypop78/igy-cards', tag: 'HACS', color: '#007AFF', icon: 'grid',
    sk: 'Karty pre dashboardy: energia, počasie, miestnosti, kamery.', en: 'Dashboard cards: energy, weather, rooms, cameras.' },
  { name: 'Pattern Pilot', url: 'https://github.com/Igypop78/pattern-pilot', tag: 'HACS', color: '#AF52DE', icon: 'spark',
    sk: 'Učí sa návyky v dome a navrhne automatizácie. Lokálne.', en: 'Learns your home routines and suggests automations. Local.' },
  { name: 'Energetický archív', nameEn: 'Energy archive', url: 'https://github.com/Igypop78/energy-archiv', tag: 'GitHub', color: '#8E8E93', icon: 'server',
    sk: 'Záloha a doplnenie histórie Energy panela z faktúr a cloudu.', en: 'Backs up and back-fills Energy dashboard history.' },
];

// Živé dlaždice v karte „Ako funguje môj dom“ (dáta z /api/live, posiela ich HA).
// v / sv = cesta v JSON, fmt = eur | kwh | pct | kw.
export const liveTiles = {
  sk: [
    { v: 'today.balance_eur', fmt: 'eurs', label: 'bilancia domu dnes', sub: 'tento mesiac', sv: 'month.balance_eur', title: 'Predaj elektriny mínus nákup elektriny, plyn a voda' },
    { v: 'today.benefit_eur', fmt: 'eur', label: 'prínos FVE a batérie dnes', sub: 'tento mesiac', sv: 'month.benefit_eur', title: 'Koľko by stála spotreba domu bez FVE a batérie mínus skutočný nákup plus predaj' },
    { v: 'today.pv_kwh', fmt: 'kwh', label: 'FVE dnes', sub: 'tento mesiac', sv: 'month.pv_kwh' },
    { v: 'today.autonomy', fmt: 'pct', label: 'dnes dom išiel sám', sub: 'tento mesiac', sv: 'month.autonomy' },
  ],
  en: [
    { v: 'today.balance_eur', fmt: 'eurs', label: 'home balance today', sub: 'this month', sv: 'month.balance_eur', title: 'Export income minus electricity, gas and water costs' },
    { v: 'today.benefit_eur', fmt: 'eur', label: 'solar & battery benefit today', sub: 'this month', sv: 'month.benefit_eur', title: 'What the home would pay without solar and battery, minus real grid cost, plus export' },
    { v: 'today.pv_kwh', fmt: 'kwh', label: 'solar today', sub: 'this month', sv: 'month.pv_kwh' },
    { v: 'today.autonomy', fmt: 'pct', label: 'self-sufficient today', sub: 'this month', sv: 'month.autonomy' },
  ],
};

export const levels = {
  1: { sk: 'Začiatočník', en: 'Beginner', cls: 'l1' },
  2: { sk: 'Pokročilý', en: 'Intermediate', cls: 'l2' },
  3: { sk: 'Expert', en: 'Expert', cls: 'l3' },
};

// Texty rozhrania.
export const t = {
  sk: {
    htmlLang: 'sk', locale: 'sk_SK', home: '/', menu: 'Hlavné menu', theme: 'Prepnúť svetlý a tmavý režim', language: 'Jazyk',
    tagline: 'Smart dom bežnej rodiny',
    siteDesc: 'Fotovoltika, batéria, elektromobil a Home Assistant v dome bežnej rodiny. Reálne čísla, skúsenosti aj chyby – pre nováčikov aj pokročilých.',
    hello: 'Ahoj, som Igy', helloSub: 'kutím na dome, v ktorom žijeme štyria a pes',
    heroTitle: 'Bežná rodina, smart dom a reálne čísla. Aj s chybami.',
    heroText: 'Fotovoltika s batériou, elektromobil a Home Assistant v dome, kde žije štvorčlenná rodina so psom. Ukazujeme, koľko to naozaj stojí, čo sa oplatí a čo by sme dnes urobili inak. Žiadna reklama v prestrojení.',
    ctaStart: 'Začni tu', ctaTour: 'Prehliadka domu',
    factsTitle: 'Môj dom v číslach',
    groupNew: 'Ešte nemám Home Assistant', groupPro: 'HA mi už beží',
    latest: 'Najnovšie', all: 'Zobraziť všetko', tourEyebrow: 'Prehliadka', tourTitle: 'Ako funguje náš dom',
    tourText: 'Miestnosť po miestnosti: čo kde máme, prečo práve to a čo by sme dnes spravili inak.', tourCta: 'Spustiť prehliadku',
    liveEyebrow: 'Naživo z Home Assistanta', liveText: 'Výroba, batéria a bilancia nášho domu – čísla sa sem posielajú priamo z Home Assistanta každých 5 minút.',
    projects: 'Moje projekty', projectsSub: 'Čo beží u nás doma, môžeš mať aj ty – zadarmo.',
    ytTitle: 'Videá', ytSub: 'Prvé video je vonku. Odober si kanál, nech ti nič neujde.', ytRow: 'TinkerMyHome na YouTube', ytRowSub: 'Videá zo života nášho domu', youtube: 'YouTube',
    planned: 'Pripravujem', startMore: 'Ďalšie články nielen pre začiatočníkov', soon: 'čoskoro', articles: 'Články',
    toc: 'Na tejto stránke', updated: 'Aktualizované', published: 'Publikované', readOther: 'Read in English',
    pathOf: (n, m) => `časť ${n} z ${m}`, next: 'Ďalej', prev: 'Späť', copy: 'Kopírovať', copied: 'Skopírované',
    about: 'O nás', contact: 'Kontakt', rss: 'RSS', notFound: 'Stránka sa nenašla', notFoundText: 'Tento odkaz nikam nevedie. Skús úvodnú stránku.',
    backHome: 'Na úvod', minRead: (n) => `${n} min čítania`, tldr: 'V skratke',
  },
  en: {
    htmlLang: 'en', locale: 'en_US', home: '/en/', menu: 'Main menu', theme: 'Switch light and dark theme', language: 'Language',
    tagline: 'The smart home of an ordinary family',
    siteDesc: 'Solar, a home battery, an EV and Home Assistant in an ordinary family home. Real numbers, lessons and mistakes – for beginners and tinkerers alike.',
    hello: "Hi, I'm Igy", helloSub: 'tinkering with the house we share – four of us and a dog',
    heroTitle: 'An ordinary family, a smart home and real numbers. Mistakes included.',
    heroText: 'Solar with a battery, an electric car and Home Assistant in a house in Slovakia where a family of four and a dog live. We show what it really costs, what pays off and what we would do differently today. No ads in disguise.',
    ctaStart: 'Start here', ctaTour: 'House tour',
    factsTitle: 'My house in numbers',
    groupNew: "I don't have Home Assistant yet", groupPro: 'HA is already running',
    latest: 'Latest', all: 'See all', tourEyebrow: 'House tour', tourTitle: 'How our house works',
    tourText: 'Room by room: what we have, why we chose it and what we would do differently today.', tourCta: 'Start the tour',
    liveEyebrow: 'Live from Home Assistant', liveText: 'Solar, battery and the balance of our house – the numbers come straight from our Home Assistant every 5 minutes.',
    projects: 'My projects', projectsSub: 'What runs in our house can run in yours – for free.',
    ytTitle: 'Videos', ytSub: 'The first video is out (in Slovak). Subscribe so you don\'t miss the next ones.', ytRow: 'TinkerMyHome on YouTube', ytRowSub: 'Videos from life in our house', youtube: 'YouTube',
    planned: 'Coming up', startMore: 'More articles, not just for beginners', soon: 'soon', articles: 'Articles',
    toc: 'On this page', updated: 'Updated', published: 'Published', readOther: 'Čítať po slovensky',
    pathOf: (n, m) => `part ${n} of ${m}`, next: 'Next', prev: 'Back', copy: 'Copy', copied: 'Copied',
    about: 'About us', contact: 'Contact', rss: 'RSS', notFound: 'Page not found', notFoundText: 'This link leads nowhere. Try the home page.',
    backHome: 'Home', minRead: (n) => `${n} min read`, tldr: 'TL;DR',
  },
};
