// Malý Markdown → HTML prevodník bez závislostí.
// Podporuje: nadpisy (## s id), odseky, zoznamy (aj vnorené o 2 medzery), číslované zoznamy,
// bloky kódu ```jazyk názov.súboru, citácie, tabuľky, obrázky, odkazy, **tučné**, *kurzíva*, `kód`,
// vodorovnú čiaru a rámčeky:
//   :::tip Ako to mám ja      (typy: tip, info, warn, me)
//   text…
//   :::

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function slugify(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function inline(src) {
  const codes = [];
  let s = src.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_, alt, url, title) =>
    `<img src="${url}" alt="${alt}" loading="lazy"${title ? ` title="${title}"` : ''}>`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, url) => {
    const ext = /^https?:\/\//.test(url) && !url.startsWith('https://tinkermyhome.com');
    return `<a href="${url}"${ext ? ' rel="noopener" target="_blank"' : ''}>${txt}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
  return s;
}

const CALLOUTS = { tip: 'tip', info: 'info', warn: 'warn', me: 'me' };

export function markdown(src, opts = {}) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  const toc = [];
  const usedIds = new Set();
  let i = 0;

  const isBlockStart = (l) => /^(#{1,6}\s|```|>\s?|:::|\s*[-*]\s|\s*\d+\.\s|\|)/.test(l) || /^---+\s*$/.test(l);

  function headingId(text) {
    let id = slugify(text) || 'sekcia';
    let n = 2; const base = id;
    while (usedIds.has(id)) id = `${base}-${n++}`;
    usedIds.add(id);
    return id;
  }

  function parseList(start) {
    const ordered = /^\s*\d+\.\s/.test(lines[start]);
    const indent = lines[start].match(/^\s*/)[0].length;
    const items = [];
    let j = start;
    while (j < lines.length) {
      const l = lines[j];
      const m = l.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (m && m[1].length === indent && (/\d/.test(m[2]) === ordered)) {
        items.push({ text: m[3], children: [] });
        j++;
        continue;
      }
      if (m && m[1].length > indent && items.length) {
        const { html, end } = parseList(j);
        items[items.length - 1].children.push(html);
        j = end;
        continue;
      }
      if (l.trim() && !m && /^\s+/.test(l) && items.length) {
        items[items.length - 1].text += ' ' + l.trim();
        j++;
        continue;
      }
      break;
    }
    const tag = ordered ? 'ol' : 'ul';
    const html = `<${tag}>` + items.map((it) => `<li>${inline(it.text)}${it.children.join('')}</li>`).join('') + `</${tag}>`;
    return { html, end: j };
  }

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // blok kódu
    const fence = line.match(/^```\s*([\w+-]*)\s*(\S*)\s*$/);
    if (fence) {
      const lang = fence[1] || '';
      const file = fence[2] || '';
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      const label = file || lang;
      out.push(`<figure class="code">` +
        `<figcaption><span>${esc(label)}</span><button type="button" class="copy" data-copy>${esc(opts.copyLabel || 'Copy')}</button></figcaption>` +
        `<pre><code${lang ? ` class="language-${esc(lang)}"` : ''}>${esc(buf.join('\n'))}</code></pre></figure>`);
      continue;
    }

    // video z YouTube: ::youtube ID Popisok
    const yt = line.match(/^::youtube\s+([\w-]{6,20})\s*(.*)$/);
    if (yt) {
      const id = esc(yt[1]); const cap = yt[2] ? inline(yt[2]) : '';
      out.push(`<figure class="yt"><a class="yt-play" href="https://www.youtube.com/watch?v=${id}" data-yt="${id}" rel="noopener" target="_blank">` +
        `<img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" alt="" loading="lazy"><span class="yt-btn" aria-hidden="true"></span>` +
        `<span class="sr-only">YouTube</span></a>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`);
      i++;
      continue;
    }

    // rámček
    const call = line.match(/^:::\s*(\w+)\s*(.*)$/);
    if (call && CALLOUTS[call[1]]) {
      const buf = [];
      i++;
      while (i < lines.length && !/^:::\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      const inner = markdown(buf.join('\n'), { ...opts, nested: true }).html;
      const title = call[2] ? `<p class="callout-title">${call[1] === 'me' && opts.avatar ? opts.avatar : ''}<span>${inline(call[2])}</span></p>` : '';
      out.push(`<aside class="callout callout-${call[1]}">${title}${inner}</aside>`);
      continue;
    }

    // nadpis
    const h = line.match(/^(#{2,4})\s+(.*?)\s*(?:\{#([\w-]+)\})?\s*$/);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      const id = h[3] || headingId(text);
      if (h[3]) usedIds.add(id);
      if (level === 2 && !opts.nested) toc.push({ id, text: inline(text).replace(/<[^>]+>/g, '') });
      out.push(`<h${level} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inline(text)}</h${level}>`);
      i++;
      continue;
    }

    if (/^---+\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    // citácia
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(`<blockquote>${markdown(buf.join('\n'), { ...opts, nested: true }).html}</blockquote>`);
      continue;
    }

    // tabuľka
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const row = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = row(line);
      const aligns = row(lines[i + 1]).map((c) => c.endsWith(':') ? (c.startsWith(':') ? 'center' : 'right') : '');
      i += 2;
      const body = [];
      while (i < lines.length && /^\|/.test(lines[i])) { body.push(row(lines[i])); i++; }
      const td = (tag, c, k) => `<${tag}${aligns[k] ? ` style="text-align:${aligns[k]}"` : ''}>${inline(c)}</${tag}>`;
      out.push(`<div class="table"><table><thead><tr>${head.map((c, k) => td('th', c, k)).join('')}</tr></thead><tbody>` +
        body.map((r) => `<tr>${r.map((c, k) => td('td', c, k)).join('')}</tr>`).join('') + `</tbody></table></div>`);
      continue;
    }

    // zoznam
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const { html, end } = parseList(i);
      out.push(html);
      i = end;
      continue;
    }

    // odsek
    const buf = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) { buf.push(lines[i].trim()); i++; }
    const text = buf.join(' ');
    if (/^!\[[^\]]*\]\([^)]+\)$/.test(text)) out.push(`<figure class="img">${inline(text)}</figure>`);
    else out.push(`<p>${inline(text)}</p>`);
  }

  return { html: out.join('\n'), toc };
}

// Front matter: jednoduchý YAML (kľúč: hodnota, zoznamy [a, b], viacriadkové hodnoty cez |).
export function frontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: src };
  const data = {};
  const lines = m[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    let [, k, v] = kv;
    if (v === '|' || v === '>') {
      const buf = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) { buf.push(lines[++i].trim()); }
      data[k] = buf.join(v === '|' ? '\n' : ' ');
      continue;
    }
    v = v.trim();
    if (/^\[.*\]$/.test(v)) data[k] = v.slice(1, -1).split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    else if (/^-?\d+(\.\d+)?$/.test(v)) data[k] = Number(v);
    else if (v === 'true' || v === 'false') data[k] = v === 'true';
    else data[k] = v.replace(/^["']|["']$/g, '');
  }
  return { data, body: src.slice(m[0].length) };
}
