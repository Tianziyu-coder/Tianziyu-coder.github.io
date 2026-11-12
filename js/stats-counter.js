/* 侧边栏数字滚动卡片：文章 / 分类 / 标签 */
(function () {
  function animate(root) {
    var els = root.querySelectorAll('b[data-n]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.textContent = el.getAttribute('data-n'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var target = +e.target.getAttribute('data-n');
        var start = performance.now(), dur = 1200;
        function step(t) {
          var p = Math.min(1, (t - start) / dur);
          e.target.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.3 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* 页面里的 <b class="js-stat" data-stat="posts"> 占位符也填上真实数字 */
  function fillInlineStats() {
    var s = window.__SITE_STATS__ || {};
    document.querySelectorAll('b[data-stat]').forEach(function (el) {
      var k = el.getAttribute('data-stat');
      if (s[k] != null) el.textContent = s[k];
    });
  }

  function build() {
    fillInlineStats();
    var aside = document.getElementById('aside-content');
    if (!aside) return;
    var old = document.querySelector('.tech-stats');
    if (old) old.remove();
    var s = window.__SITE_STATS__ || { posts: 0, categories: 0, tags: 0 };
    var wrap = document.createElement('div');
    wrap.className = 'card-widget tech-stats';
    wrap.innerHTML =
      '<div class="card-content"><div class="stats-row">' +
      '<div class="stat"><b data-n="' + s.posts + '">0</b><span>文章</span></div>' +
      '<div class="stat"><b data-n="' + s.categories + '">0</b><span>分类</span></div>' +
      '<div class="stat"><b data-n="' + s.tags + '">0</b><span>标签</span></div>' +
      '</div></div>';
    aside.insertBefore(wrap, aside.firstChild);
    animate(wrap);
  }

  build();
  document.addEventListener('pjax:complete', function () { setTimeout(build, 300); });
})();
