// TinkerMyHome Worker: statické súbory + /api/live (živé čísla z domu).
// Čísla počíta energetický archív (LXC, `energy-archiv live`) z hodinových štatistík Energy panela v HA –
// rovnako ako karta igy-energy-story-card – a každých 5 min ich sem pošle (POST s tokenom).
// Worker ich len overí, oreže na povolené polia a uloží do Durable Object. Do HA sa odtiaľto nikto nepripája.

const PERIOD = {
  pv_kwh: [0, 100000],
  benefit_eur: [-100000, 100000],
  balance_eur: [-100000, 100000],
  autonomy: [0, 100],
};
const NOW = { pv_w: [0, 1000000], battery_soc: [0, 100] };

function pick(obj, fields) {
  const out = {};
  for (const [k, [min, max]] of Object.entries(fields)) {
    const v = obj && obj[k];
    out[k] = v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Math.min(max, Math.max(min, Number(v)));
  }
  return out;
}

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
    if (request.method === 'PUT') {
      await this.storage.put('summary', await request.json());
      return new Response('ok');
    }
    return json((await this.storage.get('summary')) || null);
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
      if (Number(request.headers.get('content-length') || 0) > 8192) return json({ error: 'too-large' }, 413);
      let b;
      try { b = await request.json(); } catch { return json({ error: 'bad-json' }, 400); }
      if (!b || typeof b !== 'object' || !b.today || !b.month) return json({ error: 'bad-data' }, 400);
      const date = /^\d{4}-\d{2}-\d{2}$/.test(b.date) ? b.date : new Date().toISOString().slice(0, 10);
      const data = {
        updated: new Date().toISOString(),
        now: pick(b.now, NOW),
        today: { date, ...pick(b.today, PERIOD) },
        month: { ...pick(b.month, PERIOD), days: Number.isInteger(b.month.days) ? b.month.days : null },
      };
      await stub.fetch('https://live/', { method: 'PUT', body: JSON.stringify(data) });
      return json({ ok: true, stored: data });
    }
    return json({ error: 'method' }, 405, { allow: 'GET, POST' });
  },
};
