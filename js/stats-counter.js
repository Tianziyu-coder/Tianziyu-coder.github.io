/* 侧边栏数字滚动卡片：文章 / 分类 / 标签 */
(function () {
  /* 静态数据直接显示终值：不滚动计数，避免慢设备/截图里出现中间值 */
  function animate(root) {
    root.querySelectorAll('b[data-n]').forEach(function (el) {
      el.textContent = el.getAttribute('data-n');
    });
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
