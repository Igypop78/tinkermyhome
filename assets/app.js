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
