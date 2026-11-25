/* Grisaille — interactions. Plain JS, no libraries. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* ---------- preloader (first visit of the session) ---------- */
  function runPreloader() {
    var pre = $('.preloader');
    if (!root.classList.contains('is-preloading') || !pre) return;
    try { sessionStorage.setItem('grisaille-seen', '1'); } catch (e) {}
    window.setTimeout(function () {
      pre.classList.add('is-leaving');
      root.classList.add('is-entering');
      root.classList.remove('is-preloading');
      window.setTimeout(function () {
        pre.remove();
        root.classList.remove('is-entering');
      }, 900);
    }, 950);
  }
  runPreloader();

  /* ---------- menu ---------- */
  var burger = $('.burger');
  var menu = $('#menu');
  var scrim = $('.menu-scrim');
  var lastFocus = null;
  function setInert(on) {
    $$('main, .site-footer, .skip-link').forEach(function (el) {
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }
  function openMenu() {
    lastFocus = doc.activeElement;
    menu.classList.add('is-open');
    menu.removeAttribute('aria-hidden');
    root.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    setInert(true);
    var first = $('a', menu);
    window.setTimeout(function () { if (first) first.focus(); }, 60);
  }
  function closeMenu(restore) {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    root.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    setInert(false);
    if (restore !== false) burger.focus();
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      if (burger.getAttribute('aria-expanded') === 'true') closeMenu(); else openMenu();
    });
    if (scrim) scrim.addEventListener('click', function () { closeMenu(); });
    doc.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
      if (e.key === 'Tab') {
        var items = [burger].concat($$('a, button', menu));
        var i = items.indexOf(doc.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
  }

  /* ---------- accordions (services: several open; faq: several open) ---------- */
  $$('[data-accordion]').forEach(function (btn) {
    var item = btn.closest('[data-item]');
    var name = btn.getAttribute('data-name');
    function sync(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      item.classList.toggle('is-open', open);
      if (name) btn.setAttribute('aria-label', (open ? 'Close ' : 'Open ') + name);
    }
    sync(item.classList.contains('is-open'));
    btn.addEventListener('click', function () { sync(btn.getAttribute('aria-expanded') !== 'true'); });
  });

  /* ---------- pricing: segmented plans + add-on switch ---------- */
  var plans = [
    { name: 'Identity', price: 'From €7,500', time: '4–6 weeks',
      line: 'For a studio, label or venue that needs a mark and the rules behind it.',
      items: ['Logo and monogram', 'Type and colour system', 'Guidelines, 20 pages', 'Files for print and screen'] },
    { name: 'Identity and web', price: 'From €16,000', time: '10–12 weeks',
      line: 'The full set: a brand and a site that carries it.',
      items: ['Everything in Identity', 'Website up to 8 pages', 'Content structure and copy edit', 'Handover and training'] },
    { name: 'Studio retainer', price: 'From €2,400 a month', time: 'Three-month minimum',
      line: 'For clients who publish all year: campaigns, updates and new pages.',
      items: ['Fixed monthly hours', 'Art direction for new work', 'Site updates', 'One call a week'] }
  ];
  var seg = $('.seg');
  var plan = $('.plan');
  function moveThumb() {
    if (!seg) return;
    var on = $('button[aria-pressed="true"]', seg);
    var thumb = $('.seg__thumb', seg);
    if (!on || !thumb) return;
    thumb.style.width = on.offsetWidth + 'px';
    thumb.style.transform = 'translateX(' + on.offsetLeft + 'px)';
  }
  function renderPlan(i) {
    var p = plans[i];
    $('[data-plan="name"]', plan).textContent = p.name;
    $('[data-plan="price"]', plan).textContent = p.price;
    $('[data-plan="line"]', plan).textContent = p.line;
    $('[data-plan="time"]', plan).textContent = p.time;
    var list = $('[data-plan="items"]', plan);
    list.innerHTML = '';
    p.items.forEach(function (t) {
      var li = doc.createElement('li');
      li.innerHTML = '<i class="ico-plus" aria-hidden="true"></i>';
      li.appendChild(doc.createTextNode(t));
      list.appendChild(li);
    });
  }
  if (seg && plan) {
    $$('button', seg).forEach(function (b, i) {
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-pressed') === 'true') return;
        $$('button', seg).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        moveThumb();
        if (reduce.matches) { renderPlan(i); return; }
        plan.classList.add('is-swapping');
        window.setTimeout(function () { renderPlan(i); plan.classList.remove('is-swapping'); }, 220);
      });
    });
    moveThumb();
    window.addEventListener('resize', moveThumb);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(moveThumb);
  }
  $$('.switch').forEach(function (sw) {
    sw.addEventListener('click', function () {
      var on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      var card = sw.closest('.addon');
      if (card) card.classList.toggle('is-on', on);
    });
  });

  /* ---------- showreel dialog ---------- */
  var reelBtn = $('[data-open-reel]');
  var reel = $('#reel');
  if (reelBtn && reel && typeof reel.showModal === 'function') {
    reelBtn.addEventListener('click', function () { reel.showModal(); });
    $('.lightbox__close', reel).addEventListener('click', function () { reel.close(); });
    reel.addEventListener('click', function (e) { if (e.target === reel) reel.close(); });
    reel.addEventListener('close', function () { reelBtn.focus(); });
  } else if (reelBtn) {
    reelBtn.setAttribute('hidden', '');
  }

  /* ---------- hero video: play only on screen, never with reduced motion, pausable ---------- */
  var pauseBtn = $('.hero__pause');
  var still = function () { return reduce.matches || root.classList.contains('is-still'); };
  function playVideo(v) { if (still()) return; var q = v.play(); if (q && q.catch) q.catch(function () {}); }
  $$('video[data-smoke]').forEach(function (v) {
    var onScreen = true;
    playVideo(v);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          onScreen = en.isIntersecting;
          if (onScreen) playVideo(v); else v.pause();
        });
      }).observe(v);
    }
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        var on = pauseBtn.getAttribute('aria-pressed') !== 'true';
        pauseBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
        pauseBtn.textContent = on ? 'Play motion' : 'Pause motion';
        root.classList.toggle('is-still', on);
        if (on) v.pause(); else if (onScreen) playVideo(v);
      });
    }
  });

  /* ---------- word fill tied to scroll (one per page) ---------- */
  var fills = $$('.wordfill');
  if (fills.length && !reduce.matches) {
    fills.forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    });
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      fills.forEach(function (el) {
        var r = el.getBoundingClientRect();
        // 0 when the block's top reaches 85% of the screen, 1 when its bottom passes 45%
        var start = vh * 0.85, end = vh * 0.45;
        var p = (start - r.top) / ((start - end) + r.height);
        p = Math.max(0, Math.min(1, p));
        var ws = el.querySelectorAll('.w');
        var n = ws.length;
        for (var i = 0; i < n; i++) {
          var o = Math.max(0.22, Math.min(1, p * n - i + 1));
          ws[i].style.setProperty('--o', o.toFixed(3));
        }
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- projects filter ---------- */
  var filter = $('[data-filter]');
  if (filter) {
    var cards = $$('[data-tags]');
    var count = $('[data-count]');
    var empty = $('[data-empty]');
    var chips = $$('.fchip', filter);
    function apply(tag) {
      var n = 0;
      cards.forEach(function (c) {
        var show = tag === 'All' || c.getAttribute('data-tags').split('|').indexOf(tag) > -1;
        c.hidden = !show;
        if (show) n++;
      });
      chips.forEach(function (ch) { ch.setAttribute('aria-pressed', ch.getAttribute('data-tag') === tag ? 'true' : 'false'); });
      count.textContent = n === 1 ? '1 project' : n + ' projects';
      empty.hidden = n !== 0;
    }
    chips.forEach(function (ch) { ch.addEventListener('click', function () { apply(ch.getAttribute('data-tag')); }); });
    var reset = $('[data-reset]');
    if (reset) reset.addEventListener('click', function () { apply('All'); chips[0].focus(); });
  }

  /* ---------- forms (local only: nothing is sent anywhere) ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var MSG = {
    name: 'Enter your name.',
    email: 'Enter your email address.',
    emailBad: 'That email address looks incomplete. It should look like name@company.com.',
    need: 'Choose what you need. Pick “Not sure yet” if you are unsure.',
    message: 'Write a few lines about the project.',
    messageShort: 'Add a little more. Two or three sentences help us reply properly.',
    form: 'Check the fields marked in red and send again.'
  };
  function setErr(field, text) {
    var input = field.querySelector('input, textarea, select');
    var err = field.querySelector('.field__err');
    if (text) { input.setAttribute('aria-invalid', 'true'); } else { input.removeAttribute('aria-invalid'); }
    if (err) err.textContent = text || '';
  }
  function check(field) {
    var input = field.querySelector('input, textarea, select');
    var v = (input.value || '').trim();
    var kind = field.getAttribute('data-check');
    var text = '';
    if (kind === 'name' && !v) text = MSG.name;
    if (kind === 'email') text = !v ? MSG.email : (EMAIL.test(v) ? '' : MSG.emailBad);
    if (kind === 'need' && !v) text = MSG.need;
    if (kind === 'message') text = !v ? MSG.message : (v.length < 20 ? MSG.messageShort : '');
    setErr(field, text);
    return !text;
  }
  function forceError() {
    try { return new URLSearchParams(window.location.search).get('state') === 'error'; } catch (e) { return false; }
  }

  $$('form[data-brief]').forEach(function (form) {
    var fields = $$('[data-check]', form);
    var formErr = $('.form-error', form);
    var btn = $('button[type="submit"]', form);
    var live = $('[data-live]', form.parentNode);
    var label = btn ? btn.innerHTML : '';
    fields.forEach(function (f) {
      var input = f.querySelector('input, textarea, select');
      input.addEventListener('blur', function () { if (input.value.trim()) check(f); });
      input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') check(f); });
      input.addEventListener('change', function () { if (input.getAttribute('aria-invalid') === 'true') check(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      fields.forEach(function (f) { if (!check(f)) { ok = false; if (!firstBad) firstBad = f.querySelector('input, textarea, select'); } });
      formErr.textContent = ok ? '' : MSG.form;
      if (!ok) { firstBad.focus(); return; }
      var fail = $('.form-fail', form.parentNode);
      if (fail) fail.remove();
      btn.disabled = true;
      btn.innerHTML = '<span>Sending the brief…</span>';
      if (live) live.textContent = 'Sending your message.';
      var msgField = form.querySelector('textarea');
      var willFail = forceError() || (msgField && /error-test/i.test(msgField.value));
      window.setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = label;
        if (willFail) {
          var box = doc.createElement('div');
          box.className = 'form-fail';
          box.setAttribute('role', 'alert');
          box.innerHTML = '<h3>The brief did not send.</h3>' +
            '<p>Your message was not delivered. Check your connection and try again, or write to hello@grisaille.example.</p>' +
            '<div class="row"><button type="submit" class="pill pill--s">Send the brief again</button>' +
            '<a href="mailto:hello@grisaille.example">Write by email</a></div>';
          form.appendChild(box);
          if (live) live.textContent = '';
          $('button', box).focus();
          return;
        }
        var done = $('.form-done', form.parentNode);
        form.hidden = true;
        done.hidden = false;
        if (live) live.textContent = 'Your message was sent.';
        var h = $('h2, h3', done);
        if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
      }, 1200);
    });
  });

  $$('form[data-news]').forEach(function (form) {
    var input = $('input', form);
    var err = $('.field__err', form);
    var ok = $('.news-form__ok', form.parentNode);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      var text = !v ? 'Enter your email address.' : (EMAIL.test(v) ? '' : 'That email address looks incomplete. Check it and try again.');
      err.textContent = text;
      if (text) { input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
      input.removeAttribute('aria-invalid');
      form.hidden = true;
      ok.hidden = false;
      ok.textContent = 'Subscribed. The next note arrives in spring.';
    });
    input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') { input.removeAttribute('aria-invalid'); err.textContent = ''; } });
  });
})();
