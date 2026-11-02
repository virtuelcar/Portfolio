(function () {
  var dlg = document.getElementById('lightbox');
  var img = document.getElementById('lb-img');
  var cap = document.getElementById('lb-cap');
  document.querySelectorAll('.strip button').forEach(function (b) {
    b.addEventListener('click', function () {
      var src = b.querySelector('img');
      img.src = src.src; img.alt = src.alt; cap.textContent = b.dataset.cap || '';
      if (dlg.showModal) dlg.showModal();
    });
  });
  document.getElementById('lb-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  var copy = document.getElementById('copy');
  if (copy) {
    var idle = copy.textContent;
    copy.addEventListener('click', function () {
      var el = document.getElementById('mail');
      var done = function () { copy.textContent = copy.dataset.done; setTimeout(function () { copy.textContent = idle; }, 2200); };
      var fallback = function () {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        copy.textContent = copy.dataset.selected;
      };
      try { navigator.clipboard.writeText(el.textContent).then(done, fallback); } catch (e) { fallback(); }
    });
  }

  var vids = document.querySelectorAll('video');
  vids.forEach(function (v) { v.addEventListener('play', function () { vids.forEach(function (o) { if (o !== v) o.pause(); }); }); });

  var ids = ['expertise', 'raconter', 'vendre', 'automatiser', 'suite'];
  var secs = ids.map(function (id) { return document.getElementById(id); });
  var links = document.querySelectorAll('[data-k]');
  var fill = document.querySelector('.rail .fill');
  var ticking = false;
  function update() {
    ticking = false;
    var mid = window.innerHeight * 0.4, current = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= mid) current = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids.length - 1;
    links.forEach(function (a) {
      var i = ids.indexOf(a.dataset.k);
      a.setAttribute('aria-current', i === current ? 'true' : 'false');
      a.classList.toggle('passed', current >= 0 && i < current);
    });
    if (fill) fill.style.setProperty('--p', Math.max(current, 0) / (ids.length - 1));
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
