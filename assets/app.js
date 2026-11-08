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
    eur: function (v) { return f2.format(v) + nb + '€'; },
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
        if (typeof v === 'number' && fmt[el.dataset.fmt]) el.textContent = fmt[el.dataset.fmt](v);
      });
      if (!line) return;
      var min = Math.round((Date.now() - new Date(d.updated).getTime()) / 60000);
      var ago = min < 1 ? (sk ? 'práve teraz' : 'just now')
        : min < 120 ? (sk ? 'pred ' + min + nb + 'min' : min + nb + 'min ago')
        : (sk ? 'pred ' + Math.round(min / 60) + nb + 'h' : Math.round(min / 60) + nb + 'h ago');
      line.classList.toggle('stale', min > 30);
      line.querySelector('[data-live-text]').textContent = (min > 30 ? (sk ? 'Naposledy z HA · ' : 'Last update from HA · ') : (sk ? 'Naživo z HA · ' : 'Live from HA · ')) + ago;
      line.hidden = false;
    })
    .catch(function () {});
})();
