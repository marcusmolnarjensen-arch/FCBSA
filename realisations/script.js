/* Comportements communs : menu mobile, header au scroll, révélation au scroll, compteurs. */
(function () {
  var header = document.querySelector('.hd');
  function onScroll() { if (header) header.classList.toggle('solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var trigger = document.querySelector('.menu-trigger');
  var menu = document.querySelector('.site-menu');
  var menuClose = document.querySelector('.site-menu-close');
  function openMenu() {
    if (!menu) return;
    menu.classList.add('open'); menu.setAttribute('aria-hidden', 'false');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open'); menu.setAttribute('aria-hidden', 'true');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (trigger) trigger.addEventListener('click', function () {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menu) {
    menu.querySelectorAll('.site-menu-nav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  function rvCheck() {
    var vh = window.innerHeight || 800;
    document.querySelectorAll('[data-rv]:not(.rv-in)').forEach(function (t) {
      var r = t.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) t.classList.add('rv-in');
    });
    document.querySelectorAll('[data-count]:not(.count-done)').forEach(function (t) {
      var r = t.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        t.classList.add('count-done');
        var to = parseInt(t.getAttribute('data-to'), 10) || 0;
        var suffix = t.getAttribute('data-suffix') || '';
        var duration = parseInt(t.getAttribute('data-duration'), 10) || 1400;
        var t0 = performance.now();
        (function tick() {
          var p = Math.min(1, (performance.now() - t0) / duration);
          var eased = 1 - Math.pow(1 - p, 3);
          t.textContent = Math.round(to * eased) + suffix;
          if (p < 1) setTimeout(tick, 24);
        })();
      }
    });
  }
  var tick = false;
  function schedule() { if (tick) return; tick = true; setTimeout(function () { tick = false; rvCheck(); }, 16); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  setInterval(rvCheck, 700);
  document.addEventListener('DOMContentLoaded', rvCheck);
})();

(function () {
  var chips = document.querySelectorAll('#canton-filter .chip');
  var cards = document.querySelectorAll('#proj-grid .proj-card');
  var empty = document.getElementById('empty-msg');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('on'); });
      chip.classList.add('on');
      var canton = chip.getAttribute('data-canton');
      var visible = 0;
      cards.forEach(function (card) {
        var show = !canton || card.getAttribute('data-canton') === canton;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      empty.style.display = visible === 0 ? '' : 'none';
    });
  });
})();

/* ---- boutons "magnétiques" : légère attraction vers le curseur ---- */
document.querySelectorAll('.btn').forEach(function (btn) {
  btn.addEventListener('mousemove', function (e) {
    var r = btn.getBoundingClientRect();
    var x = (e.clientX - r.left - r.width / 2) * 0.18;
    var y = (e.clientY - r.top - r.height / 2) * 0.28;
    btn.style.transform = 'translate(' + x + 'px,' + (y - 2) + 'px)';
  });
  btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
});

/* ============================================================
   BANNIÈRE COOKIES — consentement nLPD (Suisse) / RGPD
   Stocke le choix dans localStorage, ne redemande pas ensuite.
   ============================================================ */
(function () {
  var KEY = 'fcb-cookie-consent';
  var bar = document.getElementById('cookie-bar');
  var panel = document.getElementById('cookie-panel');
  if (!bar) return;

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function setConsent(analytics) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ necessary: true, analytics: !!analytics, date: new Date().toISOString() }));
    } catch (e) {}
  }
  function hideBar() { bar.classList.remove('show'); }
  function hidePanel() { panel.classList.remove('show'); }

  if (!getConsent()) { setTimeout(function () { bar.classList.add('show'); }, 900); }

  var accept = document.getElementById('cookie-accept');
  var refuse = document.getElementById('cookie-refuse');
  var customize = document.getElementById('cookie-customize');
  var save = document.getElementById('cookie-save');
  var close = document.getElementById('cookie-close');
  var analyticsBox = document.getElementById('cookie-analytics');

  if (accept) accept.addEventListener('click', function () { setConsent(true); hideBar(); });
  if (refuse) refuse.addEventListener('click', function () { setConsent(false); hideBar(); });
  if (customize) customize.addEventListener('click', function () {
    var c = getConsent();
    if (analyticsBox) analyticsBox.checked = c ? c.analytics : false;
    panel.classList.add('show');
  });
  if (save) save.addEventListener('click', function () {
    setConsent(analyticsBox && analyticsBox.checked);
    hidePanel(); hideBar();
  });
  if (close) close.addEventListener('click', hidePanel);
})();


/* ---- carte de Suisse interactive : données géographiques réelles ---- */
(function () {
  var CH_DATA = {"names": {"ZH": "Zurich", "BE": "Berne", "LU": "Lucerne", "UR": "Uri", "SZ": "Schwytz", "OW": "Obwald", "NW": "Nidwald", "GL": "Glaris", "ZG": "Zoug", "FR": "Fribourg", "SO": "Soleure", "BS": "Bâle-Ville", "BL": "Bâle-Campagne", "SH": "Schaffhouse", "AR": "Appenzell Rh.-Ext.", "AI": "Appenzell Rh.-Int.", "SG": "Saint-Gall", "GR": "Grisons", "AG": "Argovie", "TG": "Thurgovie", "TI": "Tessin", "VD": "Vaud", "VS": "Valais", "NE": "Neuchâtel", "GE": "Genève", "JU": "Jura"}, "projects": {"GE": [{"slug": "conservatoire-geneve", "t": "Conservatoire de musique de Genève", "y": "2021"}, {"slug": "villa-versoix", "t": "Villa au bord du lac, Versoix", "y": "2017"}], "VD": [{"slug": "villa-arc-lemanique", "t": "Villa privée, arc lémanique", "y": "2023"}, {"slug": "corcelles-le-jorat", "t": "Hameau de Corcelles-le-Jorat", "y": "2022"}, {"slug": "pra-roman", "t": "Quartier de Pra Roman", "y": "2024"}, {"slug": "maison-romainmotier", "t": "Maison privée, Romainmôtier", "y": "2020"}, {"slug": "eysins", "t": "Quartier des Bois d'Eysins", "y": "2017"}, {"slug": "gland-eglise", "t": "Église catholique de Gland", "y": "2022"}], "BE": [{"slug": "victoria-jungfrau", "t": "Grand Hôtel Victoria-Jungfrau", "y": "2020"}], "FR": [{"slug": "estavayer-sport", "t": "Salle de sport triple", "y": "2023"}], "NE": [{"slug": "casino-neuchatel", "t": "Casino de Neuchâtel", "y": "2018"}], "VS": [{"slug": "verbier-restaurant", "t": "Restaurant alpin", "y": "2022"}]}};
  var panel = document.getElementById('ch-map-panel');
  var cantonPaths = document.querySelectorAll('.ch-canton');
  var chips = document.querySelectorAll('#canton-filter .chip');
  var cards = document.querySelectorAll('#proj-grid .proj-card');
  var empty = document.getElementById('empty-msg');
  if (!panel) return;

  function filterBy(canton) {
    chips.forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-canton') === canton); });
    var visible = 0;
    cards.forEach(function (card) {
      var show = !canton || card.getAttribute('data-canton') === canton;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (empty) empty.style.display = visible === 0 ? '' : 'none';
  }

  function renderPanel(abbr) {
    var name = CH_DATA.names[abbr] || abbr;
    var projects = CH_DATA.projects[abbr] || [];
    if (!projects.length) {
      panel.innerHTML = '<span class="mono-s" style="color:var(--mut2)">' + name + '</span>' +
        '<h3 class="h-3" style="margin-top:8px">Pas encore de chantier ici</h3>' +
        '<p class="body-s" style="margin-top:10px">Le v&#244;tre pourrait &#234;tre le premier.</p>';
      return;
    }
    var rows = projects.map(function (p) {
      return '<a href="' + p.slug + '/index.html" class="ch-panel-row"><span>' + p.t + '</span><span class="mono-s" style="color:var(--mut2)">' + p.y + '</span></a>';
    }).join('');
    panel.innerHTML = '<span class="mono-s" style="color:var(--mut2)">' + name + '</span>' +
      '<h3 class="h-3" style="margin-top:8px">' + projects.length + ' r&#233;alisation' + (projects.length > 1 ? 's' : '') + '</h3>' +
      '<div class="ch-panel-list">' + rows + '</div>';
  }
  function resetPanel() {
    var total = Object.keys(CH_DATA.projects).reduce(function (n, k) { return n + CH_DATA.projects[k].length; }, 0);
    panel.innerHTML = '<span class="mono-s" style="color:var(--mut2)">Suisse romande</span>' +
      '<h3 class="h-3" style="margin-top:8px">' + total + ' r&#233;alisations, six cantons</h3>' +
      '<p class="body-s" style="margin-top:10px">Survolez un canton pour voir les chantiers qui s\'y trouvent &mdash; ou touchez-le sur mobile.</p>';
  }
  cantonPaths.forEach(function (path) {
    var abbr = path.getAttribute('data-abbr');
    path.addEventListener('mouseenter', function () { renderPanel(abbr); });
    path.addEventListener('focus', function () { renderPanel(abbr); });
    path.addEventListener('mouseleave', function () {
      if (document.activeElement !== path) resetPanel();
    });
    path.addEventListener('click', function () {
      if (CH_DATA.projects[abbr]) {
        filterBy(abbr);
        document.getElementById('canton-filter').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    path.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); path.click(); }
    });
  });
})();
