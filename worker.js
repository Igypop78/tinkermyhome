// TinkerMyHome Worker: statické súbory + /api/live (živé čísla z Home Assistanta).
// HA posiela dnešné počítadlá sám (POST s tokenom každých 5 min), do HA sa odtiaľto nikto nepripája.
// Durable Object LiveStore si drží každý deň zvlášť, z nich počíta mesiac.
// Rovnaké vzorce ako igy-energy-story-card:
//   prínos FVE a batérie = Σ Δspotreba × cena − Σ Δnákup × cena + predaj
//   bilancia domu        = predaj − nákup elektriny − plyn − voda   (kladná = dom zarobil)
// Náklady si Worker počíta sám z prírastkov (každých 5 min) × aktuálna cena – nezávisle od cost senzorov HA.
//   autonómia = 1 − (zo siete do domu) / spotreba domu; nabíjanie batérie zo siete (arbitráž) sa nepočíta

const FIELDS = {
  // denné počítadlá (o polnoci sa nulujú)
  pv_today: [0, 1000],       // kWh výroba FVE
  load_today: [0, 1000],     // kWh spotreba domu
  import_today: [0, 1000],   // kWh nákup zo siete
  export_today: [0, 1000],   // kWh predaj do siete
  charge_today: [0, 1000],   // kWh nabitie batérie
  export_comp: [-1000, 1000],// € za predaj dnes (pri zápornej cene môže byť záporné)
  // celkové počítadlá (stále rastú)
  gas_total: [0, 1e8],       // kWh plyn
  water_total: [0, 1e8],     // m³ voda
  // ceny
  buy_price: [-5, 5],        // €/kWh aktuálna nákupná cena elektriny
  gas_price: [0, 5],         // €/kWh
  water_price: [0, 50],      // €/m³
  // teraz
  pv_w: [0, 100000],         // W výkon FVE
  battery_soc: [0, 100],     // % batéria
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
    const rec = day || { base: 0, cin: 0, g2h: 0, cgas: 0, cwat: 0, last: {} };
    const L = rec.last;
    const price = v.buy_price;
    const has = (k) => v[k] !== null;
    const d = (k) => (has(k) && typeof L[k] === 'number' ? Math.max(0, v[k] - L[k]) : null);

    if (!day) {
      // prvý záznam dňa: doterajšie hodnoty dňa sa odhadnú naraz
      if (has('load_today') && price !== null) rec.base = v.load_today * price;
      if (has('import_today') && price !== null) rec.cin = v.import_today * price;
      if (has('import_today')) rec.g2h = Math.max(0, v.import_today - Math.max(0, (v.charge_today || 0) - (v.pv_today || 0)));
      const prev = (await this.storage.get(`day:${new Date(Date.parse(date + 'T12:00:00Z') - 864e5).toISOString().slice(0, 10)}`)) || null;
      if (prev && prev.last) {
        if (has('gas_total') && v.gas_price !== null && typeof prev.last.gas_total === 'number') rec.cgas = Math.max(0, v.gas_total - prev.last.gas_total) * v.gas_price;
        if (has('water_total') && v.water_price !== null && typeof prev.last.water_total === 'number') rec.cwat = Math.max(0, v.water_total - prev.last.water_total) * v.water_price;
      }
    } else {
      // ďalšie záznamy: prírastky za posledných ~5 min
      const dl = d('load_today'), di = d('import_today'), dc = d('charge_today'), dp = d('pv_today');
      if (dl !== null && price !== null) rec.base += dl * price;
      if (di !== null && price !== null) rec.cin += di * price;
      // zo siete do domu = nákup mínus to, čo išlo do batérie a nepokrylo slnko
      if (di !== null) rec.g2h += Math.max(0, di - Math.max(0, (dc || 0) - (dp || 0)));
      const dg = d('gas_total'), dw = d('water_total');
      if (dg !== null && v.gas_price !== null) rec.cgas += dg * v.gas_price;
      if (dw !== null && v.water_price !== null) rec.cwat += dw * v.water_price;
    }
    for (const k of ['pv_today', 'load_today', 'import_today', 'export_today', 'charge_today', 'export_comp', 'gas_total', 'water_total']) {
      if (has(k)) L[k] = v[k];
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
    const dayStats = (d) => {
      const L = d.last || {};
      const comp = L.export_comp || 0;
      const ok = typeof L.load_today === 'number';
      return {
        benefit: ok ? d.base - d.cin + comp : null,
        balance: ok ? comp - d.cin - (d.cgas || 0) - (d.cwat || 0) : null,
        pv: L.pv_today, load: L.load_today, g2h: d.g2h,
      };
    };
    const t = dayStats((await this.storage.get(`day:${nowRec.date}`)) || {});
    const month = await this.storage.list({ prefix: `day:${nowRec.date.slice(0, 7)}` });
    const m = { pv: 0, load: 0, g2h: 0, benefit: null, balance: null, days: 0 };
    for (const d of month.values()) {
      const x = dayStats(d);
      m.pv += x.pv || 0; m.load += x.load || 0; m.g2h += x.g2h || 0; m.days++;
      if (x.benefit !== null) m.benefit = (m.benefit || 0) + x.benefit;
      if (x.balance !== null) m.balance = (m.balance || 0) + x.balance;
    }
    return {
      updated: nowRec.updated,
      now: { pv_w: r(nowRec.pv_w, 0), battery_soc: r(nowRec.battery_soc, 0) },
      today: { date: nowRec.date, pv_kwh: r(t.pv, 1), benefit_eur: r(t.benefit, 2), balance_eur: r(t.balance, 2), autonomy: pct(t.load, t.g2h ?? null) },
      month: { days: m.days, pv_kwh: r(m.pv, 1), benefit_eur: r(m.benefit, 2), balance_eur: r(m.balance, 2), autonomy: pct(m.load, m.g2h) },
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
