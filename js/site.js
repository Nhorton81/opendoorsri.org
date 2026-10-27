// Header: keep the page clear of the fixed header, and hide it while scrolling down
var header = document.querySelector('.site-header');
function setHeaderHeight() {
  document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
}
setHeaderHeight();
window.addEventListener('resize', setHeaderHeight);
var lastY = window.scrollY;
window.addEventListener('scroll', function () {
  var y = window.scrollY;
  header.classList.toggle('hide', y > lastY && y > header.offsetHeight && !header.classList.contains('menu-open'));
  lastY = y;
}, { passive: true });

// Mobile menu, and folder menus (tap to open on phones)
var toggle = document.querySelector('.menu-toggle');
var nav = document.getElementById('site-nav');
toggle.addEventListener('click', function () {
  var open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  header.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.site-nav .folder > button').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var li = btn.parentElement;
    var open = !li.classList.contains('open');
    document.querySelectorAll('.site-nav .folder.open').forEach(function (f) {
      f.classList.remove('open');
      f.firstElementChild.setAttribute('aria-expanded', 'false');
    });
    li.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });
});
document.addEventListener('click', function (e) {
  if (!e.target.closest('.site-nav')) {
    document.querySelectorAll('.site-nav .folder.open').forEach(function (f) { f.classList.remove('open'); });
  }
});

// Headings in a .fit box grow or shrink to fill the box
function fitText() {
  document.querySelectorAll('.fit').forEach(function (box) {
    var block = box.parentElement;
    var lo = 4, hi = 400;
    box.style.fontSize = hi + 'px';
    for (var i = 0; i < 12; i++) {
      var mid = (lo + hi) / 2;
      box.style.fontSize = mid + 'px';
      var w = 0, h = 0;
      Array.prototype.forEach.call(box.children, function (c) {
        w = Math.max(w, c.scrollWidth);
        h += c.offsetHeight;
      });
      if (w <= block.clientWidth && h <= block.clientHeight) lo = mid; else hi = mid;
    }
    box.style.fontSize = lo + 'px';
  });
}
fitText();
window.addEventListener('resize', fitText);
if (document.fonts) document.fonts.ready.then(fitText);

// Background videos play at the speed set on the old site. Like the old site,
// phones get the plain background colour instead of the video.
document.querySelectorAll('.sec-bg video[data-src]').forEach(function (v) {
  if (window.matchMedia('(max-width: 767px)').matches) {
    v.remove();
    return;
  }
  v.src = v.dataset.src;
  v.playbackRate = parseFloat(v.dataset.speed) || 1;
  v.addEventListener('play', function () { v.playbackRate = parseFloat(v.dataset.speed) || 1; });
});

// Carousel arrows
document.querySelectorAll('.carousel').forEach(function (c) {
  var track = c.querySelector('.track');
  function step(dir) {
    var item = track.querySelector('.item');
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    var w = item ? item.offsetWidth + gap : track.clientWidth;
    var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    if (dir > 0 && atEnd) track.scrollLeft = 0;
    else if (dir < 0 && track.scrollLeft <= 2) track.scrollLeft = track.scrollWidth;
    else track.scrollBy({ left: dir * w });
  }
  c.querySelector('.prev').addEventListener('click', function () { step(-1); });
  c.querySelector('.next').addEventListener('click', function () { step(1); });
});

// Forms: FormSubmit (formsubmit.co) emails each submission to the address in data-endpoint
document.querySelectorAll('form.site-form').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var endpoint = form.dataset.endpoint;
    var thanks = form.querySelector('.thanks');
    var button = form.querySelector('button[type=submit]');
    if (!endpoint) {
      alert('This form is not connected yet.');
      return;
    }
    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = value; });
    data._subject = form.dataset.subject + ' (website form)';
    data._template = 'table';
    data._captcha = 'false';
    button.disabled = true;
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      return res.json().then(function (d) {
        if (!res.ok || String(d.success) !== 'true') throw new Error(d.message);
      });
    }).then(function () {
      Array.prototype.forEach.call(form.children, function (el) { if (el !== thanks) el.hidden = true; });
      thanks.hidden = false;
    }).catch(function () {
      button.disabled = false;
      alert('Sorry, that did not go through. Please try again later.');
    });
  });
});
