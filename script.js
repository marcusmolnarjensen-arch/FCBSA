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
  var ESSENCES = {"chene-eu": {"id": "chene-eu", "n": "Chêne européen", "c": "#C99E5E", "note": "noble · veines marquées", "latin": "Quercus robur", "dens": "≈ 720 kg/m³", "orig": "Forêts d'Europe — dont Tronçais (F)", "use": "Parquets, escaliers, listerie"}, "chene-us": {"id": "chene-us", "n": "Chêne US", "c": "#D5AB6E", "note": "rosé · grain régulier", "latin": "Quercus alba", "dens": "≈ 770 kg/m³", "orig": "Amérique du Nord", "use": "Parquets, panneaux"}, "cerisier": {"id": "cerisier", "n": "Cerisier", "c": "#9C5535", "note": "se patine avec le temps", "latin": "Prunus avium", "dens": "≈ 600 kg/m³", "orig": "Europe · Amérique du Nord", "use": "Parquets fins, marqueterie — Conservatoire de Genève"}, "frene": {"id": "frene", "n": "Frêne", "c": "#D8C49B", "note": "clair · élastique", "latin": "Fraxinus excelsior", "dens": "≈ 690 kg/m³", "orig": "Europe — dont arc jurassien", "use": "Escaliers, parquets sportifs"}, "erable": {"id": "erable", "n": "Érable", "c": "#E8DCC0", "note": "très clair · fin", "latin": "Acer pseudoplatanus", "dens": "≈ 620 kg/m³", "orig": "Europe", "use": "Lambris clairs, plans de travail"}, "noyer": {"id": "noyer", "n": "Noyer", "c": "#5A3A28", "note": "sombre · précieux", "latin": "Juglans regia", "dens": "≈ 640 kg/m³", "orig": "Europe · Asie mineure", "use": "Ébénisterie, escaliers, parquets de prestige"}, "hetre": {"id": "hetre", "n": "Hêtre étuvé", "c": "#C08A57", "note": "rose uniforme", "latin": "Fagus sylvatica", "dens": "≈ 710 kg/m³", "orig": "Europe — dont Jura", "use": "Escaliers, listerie — Jura Collection"}, "meleze": {"id": "meleze", "n": "Mélèze", "c": "#C89058", "note": "résineux durable", "latin": "Larix decidua", "dens": "≈ 590 kg/m³", "orig": "Alpes · Sibérie", "use": "Façades, terrasses"}, "sapin": {"id": "sapin", "n": "Sapin Dakota", "c": "#8A8270", "note": "prégrisaillé Sapinat", "latin": "Abies alba", "dens": "≈ 450 kg/m³", "orig": "Forêts du Jura · croissance lente", "use": "Façades Sapinat, VaudFaçaBois"}, "wenge": {"id": "wenge", "n": "Wengé", "c": "#3A2C20", "note": "presque noir", "latin": "Millettia laurentii", "dens": "≈ 870 kg/m³", "orig": "Afrique centrale", "use": "Parquets contrastés, incrustations"}, "balau": {"id": "balau", "n": "Yellow Balau", "c": "#8A5A30", "note": "terrasses · haute densité", "latin": "Shorea laevis", "dens": "≈ 980 kg/m³", "orig": "Asie du Sud-Est", "use": "Terrasses, decks"}, "douglas": {"id": "douglas", "n": "Pin Douglas", "c": "#C49A6C", "note": "façades économiques", "latin": "Pseudotsuga menziesii", "dens": "≈ 530 kg/m³", "orig": "Europe · Amérique du Nord", "use": "Façades, lambris"}};
  var slot = document.getElementById('ess-fiche-slot');
  document.querySelectorAll('.essg-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-id');
      var already = btn.classList.contains('sel');
      document.querySelectorAll('.essg-item').forEach(function (b) {
        b.classList.remove('sel'); b.querySelector('.essg-plus').textContent = '+';
      });
      if (already) { slot.innerHTML = ''; return; }
      btn.classList.add('sel'); btn.querySelector('.essg-plus').textContent = '\u2212';
      var e = ESSENCES[id];
      slot.innerHTML = '<div class="ess-fiche"><div class="ess-fiche__visual" style="background:' + e.c + '"></div>' +
        '<div class="ess-fiche__txt"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px">' +
        '<h3 class="h-2" style="font-style:italic">' + e.n + '</h3>' +
        '<button type="button" class="ess-fiche__close" aria-label="Fermer">&times;</button></div>' +
        '<p class="mono-s" style="color:var(--acc);margin:6px 0 0">' + e.latin + '</p>' +
        '<table class="spec-table" style="margin-top:18px"><tbody>' +
        '<tr><th>Densit&eacute;</th><td>' + e.dens + '</td></tr>' +
        '<tr><th>Provenance</th><td>' + e.orig + '</td></tr>' +
        '<tr><th>Chez FCB</th><td>' + e.use + '</td></tr>' +
        '<tr><th>Caract&egrave;re</th><td style="text-transform:capitalize">' + e.note + '</td></tr>' +
        '</tbody></table><p class="mono-s" style="color:var(--mut3);margin-top:16px">&eacute;chantillon r&eacute;el disponible &agrave; l\'atelier &mdash; envoy&eacute; sur demande</p></div></div>';
      slot.querySelector('.ess-fiche__close').addEventListener('click', function () {
        slot.innerHTML = '';
        btn.classList.remove('sel'); btn.querySelector('.essg-plus').textContent = '+';
      });
      slot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
