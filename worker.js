// TinkerMyHome Worker: statické súbory + /api/live (živé čísla z Home Assistanta).
// HA posiela čísla sám (POST s tokenom), do HA sa odtiaľto nikto nepripája.
// Uložené v Durable Object (SQLite, free plán). Tajomstvo LIVE_TOKEN nastaviť v Cloudflare.

const FIELDS = {
  devices: [0, 100000],
  entities: [0, 1000000],
  automations: [0, 100000],
  autonomy_today: [0, 100],
  pv_w: [0, 1000000],
  battery_soc: [0, 100],
};

function clean(body) {
  const out = {};
  for (const [k, [min, max]] of Object.entries(FIELDS)) {
    const v = Number(body?.[k]);
    if (body?.[k] !== null && body?.[k] !== undefined && Number.isFinite(v)) out[k] = Math.min(max, Math.max(min, Math.round(v * 10) / 10));
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
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export class LiveStore {
  constructor(state) { this.state = state; }
  async fetch(request) {
    if (request.method === 'PUT') {
      await this.state.storage.put('live', await request.json());
      return new Response('ok');
    }
    return json((await this.state.storage.get('live')) || null);
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
      const data = { ...clean(body), updated: new Date().toISOString() };
      await stub.fetch('https://live/', { method: 'PUT', body: JSON.stringify(data) });
      return json({ ok: true, stored: data });
    }

    return json({ error: 'method' }, 405, { allow: 'GET, POST' });
  },
};
