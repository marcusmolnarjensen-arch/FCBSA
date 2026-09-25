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
  if (window.location.hash === '#devis') {
    var kicker = document.getElementById('contact-kicker');
    if (kicker) kicker.textContent = 'Demande de devis';
    var form = document.getElementById('devis');
    if (form) {
      var y = form.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: 'instant' });
      var first = form.querySelector('input');
      if (first) first.focus({ preventScroll: true });
    }
  }
  var form = document.getElementById('devis');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var body = 'Nom : ' + (f.get('nom') || '') + '\nSoci\u00e9t\u00e9 : ' + (f.get('societe') || '') +
        '\nT\u00e9l\u00e9phone : ' + (f.get('tel') || '') + '\n\n' + (f.get('message') || '');
      window.location.href = 'mailto:info@fcbsa.ch?subject=' + encodeURIComponent('Demande de devis — ' + (f.get('nom') || '')) + '&body=' + encodeURIComponent(body);
    });
  }
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
