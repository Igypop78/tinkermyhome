// Prepínač témy (vypínač v logu) a kopírovanie kódu.
(function () {
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function current() { return root.dataset.theme || (media.matches ? 'dark' : 'light'); }
  function setMeta(theme) {
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', theme === 'dark' ? '#000000' : '#F2F2F7'); });
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
    b.setAttribute('aria-pressed', current() === 'dark' ? 'true' : 'false');
    b.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      setMeta(next);
      b.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    });
  });
  if (root.dataset.theme) setMeta(root.dataset.theme);

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.textContent;
    var done = document.documentElement.lang === 'sk' ? 'Skopírované' : 'Copied';
    btn.addEventListener('click', function () {
      var code = btn.closest('.code').querySelector('code').innerText;
      navigator.clipboard.writeText(code).then(function () {
        btn.textContent = done;
        setTimeout(function () { btn.textContent = label; }, 1600);
      });
    });
  });
})();

// Živé čísla z Home Assistanta (/api/live) v karte „Ako funguje môj dom“.
(function () {
  var els = document.querySelectorAll('[data-v]');
  var line = document.querySelector('.live-now');
  if (!els.length || !window.fetch) return;
  var sk = document.documentElement.lang === 'sk';
  var loc = sk ? 'sk-SK' : 'en-GB';
  var f1 = new Intl.NumberFormat(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var f2 = new Intl.NumberFormat(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var f0 = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 });
  var nb = '\u00a0';
  var fmt = {
    eur: function (v) { return (v < 0 ? '−' : '') + f2.format(Math.abs(v)) + nb + '€'; },
    eurs: function (v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + f2.format(Math.abs(v)) + nb + '€'; },
    kwh: function (v) { return (v >= 100 ? f0.format(v) : f1.format(v)) + nb + 'kWh'; },
    pct: function (v) { return f0.format(v) + nb + '%'; },
    kw: function (v) { return f1.format(v / 1000) + nb + 'kW'; }
  };
  function pick(d, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, d); }
  fetch('/api/live', { headers: { accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.updated) return;
      els.forEach(function (el) {
        var v = pick(d, el.dataset.v);
        if (typeof v === 'number' && fmt[el.dataset.fmt]) {
          el.textContent = fmt[el.dataset.fmt](v);
          if (el.dataset.fmt === 'eurs') el.classList.toggle('neg', v < 0), el.classList.toggle('pos', v > 0);
        }
      });
      if (!line) return;
      var min = Math.round((Date.now() - new Date(d.updated).getTime()) / 60000);
      var ago = min < 1 ? (sk ? 'práve teraz' : 'just now')
        : min < 120 ? (sk ? 'pred ' + min + nb + 'min' : min + nb + 'min ago')
        : (sk ? 'pred ' + Math.round(min / 60) + nb + 'h' : Math.round(min / 60) + nb + 'h ago');
      line.classList.toggle('stale', min > 30);
      var now = [];
      if (d.now && typeof d.now.pv_w === 'number') now.push((sk ? 'FVE ' : 'Solar ') + fmt.kw(d.now.pv_w));
      if (d.now && typeof d.now.battery_soc === 'number') now.push((sk ? 'batéria ' : 'battery ') + fmt.pct(d.now.battery_soc));
      line.querySelector('[data-live-text]').textContent = (min > 30 ? (sk ? 'Naposledy z HA' : 'Last update from HA') : (sk ? 'Naživo z HA' : 'Live from HA'))
        + (now.length && min <= 30 ? ' · ' + now.join(' · ') : '') + ' · ' + ago;
      line.hidden = false;
    })
    .catch(function () {});
})();

// Video z YouTube sa načíta až po kliknutí (rýchlejšia stránka, žiadne cookies vopred).
(function () {
  document.querySelectorAll('a[data-yt]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + a.dataset.yt + '?autoplay=1&rel=0';
      f.title = 'YouTube'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
      a.replaceWith(f);
    });
  });
})();
