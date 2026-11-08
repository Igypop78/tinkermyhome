// TinkerMyHome Worker: statické súbory + /api/live (živé čísla z Home Assistanta).
// HA posiela dnešné počítadlá sám (POST s tokenom každých 5 min), do HA sa odtiaľto nikto nepripája.
// Durable Object LiveStore si drží každý deň zvlášť, z nich počíta mesiac.
// „Ušetrené“ = koľko by stála spotreba domu bez FVE a batérie (Δspotreba × aktuálna nákupná cena)
//              − čo dom naozaj zaplatil za nákup zo siete + čo dostal za predaj.

const FIELDS = {
  pv_today: [0, 1000],       // kWh vyrobené FVE dnes
  load_today: [0, 1000],     // kWh spotreba domu dnes
  import_today: [0, 1000],   // kWh nákup zo siete dnes
  export_today: [0, 1000],   // kWh predaj do siete dnes
  import_cost: [0, 1000],    // € za nákup dnes
  export_comp: [-1000, 1000],// € za predaj dnes (pri zápornej cene môže byť záporné)
  buy_price: [-5, 5],        // €/kWh aktuálna nákupná cena
  pv_w: [0, 100000],         // W výkon FVE teraz
  battery_soc: [0, 100],     // % batéria teraz
};

function num(v, [min, max]) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
}
const r = (v, d) => (v === null || v === undefined ? null : Math.round(v * 10 ** d) / 10 ** d);
const pct = (load, imp) => (load > 0 && imp !== null ? Math.min(100, Math.max(0, Math.round(100 * (1 - imp / load)))) : null);

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'x-content-type-options': 'nosniff', ...extra },
  });
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

export class LiveStore {
  constructor(state) { this.storage = state.storage; }

  async fetch(request) {
    if (request.method === 'POST') return json(await this.ingest(await request.json()));
    return json(await this.summary());
  }

  async ingest(p) {
    const now = new Date().toISOString();
    const date = /^\d{4}-\d{2}-\d{2}$/.test(p.date) ? p.date : now.slice(0, 10);
    const v = {};
    for (const [k, range] of Object.entries(FIELDS)) v[k] = num(p[k], range);

    const key = `day:${date}`;
    const day = (await this.storage.get(key)) || null;
    const rec = day || { base: null, lastLoad: null };
    if (v.load_today !== null && v.buy_price !== null) {
      if (rec.base === null) rec.base = v.load_today * v.buy_price;           // prvý záznam dňa: odhad doterajšej spotreby
      else if (v.load_today >= rec.lastLoad) rec.base += (v.load_today - rec.lastLoad) * v.buy_price;
      rec.lastLoad = v.load_today;
    }
    for (const k of ['pv_today', 'load_today', 'import_today', 'export_today', 'import_cost', 'export_comp']) {
      if (v[k] !== null) rec[k] = v[k];
    }
    await this.storage.put(key, rec);
    await this.storage.put('now', { pv_w: v.pv_w, battery_soc: v.battery_soc, date, updated: now });

    // upratovanie: drží sa ~400 dní
    if (!day) {
      const old = await this.storage.list({ prefix: 'day:', end: `day:${new Date(Date.now() - 400 * 864e5).toISOString().slice(0, 10)}` });
      if (old.size) await this.storage.delete([...old.keys()]);
    }
    return this.summary();
  }

  async summary() {
    const nowRec = await this.storage.get('now');
    if (!nowRec) return null;
    const saved = (d) => (d && d.base !== null && d.base !== undefined ? d.base - (d.import_cost || 0) + (d.export_comp || 0) : null);
    const today = (await this.storage.get(`day:${nowRec.date}`)) || {};
    const month = await this.storage.list({ prefix: `day:${nowRec.date.slice(0, 7)}` });
    let pv = 0, load = 0, imp = 0, sv = 0, days = 0, hasSaved = false;
    for (const d of month.values()) {
      pv += d.pv_today || 0; load += d.load_today || 0; imp += d.import_today || 0;
      const s = saved(d); if (s !== null) { sv += s; hasSaved = true; }
      days++;
    }
    return {
      updated: nowRec.updated,
      now: { pv_w: r(nowRec.pv_w, 0), battery_soc: r(nowRec.battery_soc, 0) },
      today: { date: nowRec.date, pv_kwh: r(today.pv_today, 1), saved_eur: r(saved(today), 2), autonomy: pct(today.load_today, today.import_today ?? null) },
      month: { days, pv_kwh: r(pv, 1), saved_eur: hasSaved ? r(sv, 2) : null, autonomy: pct(load, imp) },
    };
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/live') return env.ASSETS.fetch(request);
    const stub = env.LIVE.get(env.LIVE.idFromName('home'));

    if (request.method === 'GET' || request.method === 'HEAD') {
      const data = await (await stub.fetch('https://live/')).json();
      return json(data || { error: 'no-data' }, data ? 200 : 404, { 'cache-control': 'public, max-age=60' });
    }
    if (request.method === 'POST') {
      const auth = request.headers.get('authorization') || '';
      if (!env.LIVE_TOKEN || !safeEqual(auth, `Bearer ${env.LIVE_TOKEN}`)) return json({ error: 'unauthorized' }, 401);
      if (Number(request.headers.get('content-length') || 0) > 4096) return json({ error: 'too-large' }, 413);
      let body;
      try { body = await request.json(); } catch { return json({ error: 'bad-json' }, 400); }
      if (!body || typeof body !== 'object') return json({ error: 'bad-json' }, 400);
      const res = await stub.fetch('https://live/', { method: 'POST', body: JSON.stringify(body) });
      return json({ ok: true, summary: await res.json() });
    }
    return json({ error: 'method' }, 405, { allow: 'GET, POST' });
  },
};
