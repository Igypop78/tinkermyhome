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
  var tiles = document.querySelectorAll('[data-live]');
  var line = document.querySelector('.live-now');
  if (!tiles.length || !window.fetch) return;
  var sk = document.documentElement.lang === 'sk';
  var nf = new Intl.NumberFormat(sk ? 'sk-SK' : 'en-GB', { maximumFractionDigits: 1 });
  fetch('/api/live', { headers: { accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.updated) return;
      var age = Math.round((Date.now() - new Date(d.updated).getTime()) / 60000);
      if (!(age < 60)) return;
      tiles.forEach(function (t) {
        var v = d[t.dataset.live];
        if (typeof v === 'number') t.querySelector('b').textContent = nf.format(Math.round(v)) + (t.dataset.unit || '');
      });
      if (!line) return;
      var parts = [];
      if (typeof d.pv_w === 'number') parts.push((sk ? 'FVE ' : 'Solar ') + '<b>' + nf.format(d.pv_w / 1000) + ' kW</b>');
      if (typeof d.battery_soc === 'number') parts.push((sk ? 'batéria ' : 'battery ') + '<b>' + nf.format(Math.round(d.battery_soc)) + ' %</b>');
      var when = age < 1 ? (sk ? 'práve teraz' : 'just now') : (sk ? 'pred ' + age + '\u00a0min' : age + '\u00a0min ago');
      line.querySelector('[data-live-text]').innerHTML = (sk ? 'Naživo z HA: ' : 'Live from HA: ') + parts.join(' · ') + (parts.length ? ' · ' : '') + when;
      line.hidden = false;
    })
    .catch(function () {});
})();
