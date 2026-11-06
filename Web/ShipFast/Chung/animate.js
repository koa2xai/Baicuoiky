// Gắn hiệu ứng animate.css cho toàn site. Tự bỏ qua nếu người dùng bật "giảm chuyển động".
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // [selector, hiệu ứng, delay gốc (ms), bước delay giữa các phần tử (ms)]
  var RULES = [
    ['.hero h1',                         'fadeInDown', 0,   0],
    ['.hero .lead',                      'fadeInUp',   150, 0],
    ['.hero .tag-input',                 'zoomIn',     300, 0],
    ['.hero .chip',                      'fadeIn',     450, 80],
    ['main > h1, main > p',              'fadeInDown', 0,   100],
    ['main > form.card',                 'fadeInUp',   100, 0],
    ['.adm main h2, .adm .main h2',      'fadeInLeft', 0,   0],
    ['.adm .nav-link',                   'fadeInLeft', 0,   60],
    ['#kpis > *',                        'zoomIn',     0,   90],
    ['#result > *',                      'fadeInUp',   0,   100],
    ['.row > [class*="col-"] > .card',   'fadeInUp',   150, 120],
    ['.accordion-item',                  'fadeInUp',   0,   80],
    ['#myTickets > *',                   'fadeInUp',   0,   80],
    ['.card > .table-responsive',        'fadeIn',     150, 0],
    ['tbody tr',                         'fadeInUp',   0,   35],
    ['footer',                           'fadeIn',     300, 0]
  ];
  var MAX_DELAY = 800;

  function play(el, name, delay) {
    if (el.__sfAnimated || el.hidden) return;
    el.__sfAnimated = true;
    var cls = ['animate__animated', 'animate__' + name];
    el.style.setProperty('--animate-delay', Math.min(delay, MAX_DELAY) + 'ms');
    el.classList.add.apply(el.classList, cls);
    // dọn class sau khi chạy xong để không để lại transform (ảnh hưởng modal/bản đồ)
    el.addEventListener('animationend', function done(e) {
      if (e.target !== el) return;
      el.classList.remove.apply(el.classList, cls);
      el.style.removeProperty('--animate-delay');
      el.removeEventListener('animationend', done);
    });
  }

  function run(root) {
    RULES.forEach(function (r) {
      var list = (root.matches && root.matches(r[0]) ? [root] : []).concat([].slice.call(root.querySelectorAll(r[0])));
      list.forEach(function (el, i) { play(el, r[1], r[2] + i * r[3]); });
    });
  }

  function init() {
    run(document.body);
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        [].forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) run(n); });
      });
    }).observe(document.body, { childList: true, subtree: true });

    // Hiệu ứng nhấn cho nút và rung form khi báo lỗi
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.btn');
      if (!b) return;
      b.classList.remove('animate__animated', 'animate__pulse');
      void b.offsetWidth;
      b.classList.add('animate__animated', 'animate__pulse');
      b.addEventListener('animationend', function () { b.classList.remove('animate__animated', 'animate__pulse'); }, { once: true });
    });
    document.querySelectorAll('#error').forEach(function (err) {
      new MutationObserver(function () {
        if (!err.textContent.trim()) return;
        var card = err.closest('.card');
        if (!card) return;
        card.classList.remove('animate__animated', 'animate__headShake');
        void card.offsetWidth;
        card.classList.add('animate__animated', 'animate__headShake');
        card.addEventListener('animationend', function () { card.classList.remove('animate__animated', 'animate__headShake'); }, { once: true });
      }).observe(err, { childList: true, characterData: true, subtree: true });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
