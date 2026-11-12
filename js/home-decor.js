/* 首页欢迎横幅 + 专题入口（只在首页首屏插入，兼容 pjax） */
(function () {
  var HERO_ID = 'my-home-hero';
  var TOPIC_ID = 'my-home-topics';

  function isHomeFirstPage() {
    var p = window.location.pathname.replace(/index\.html$/, '');
    return p === '/' || p === '';
  }

  function stat(name, fallback) {
    var s = window.__SITE_STATS__ || {};
    return s[name] != null ? s[name] : fallback;
  }

  function wordLabel(n) {
    return n >= 10000 ? (n / 10000).toFixed(1) + ' 万' : String(n);
  }

  function makeHero() {
    var s = window.__SITE_STATS__ || {};
    var bc = s.byCategory || {};
    var el = document.createElement('section');
    el.id = HERO_ID;
    el.className = 'my-hero';
    el.innerHTML =
      '<div class="my-hero__main">' +
        '<span class="my-hero__eyebrow">JAVA BACKEND · LEARNING NOTES</span>' +
        '<h1>把 Java 后端，一篇一篇写清楚</h1>' +
        '<p>从字符串常量池、集合与异常，到并发、JVM 类加载，再到 Spring Boot 自动配置与微服务部署。每篇按「原理 → 代码 → 面试怎么答 → 踩坑」整理，按路线读比较不容易乱。</p>' +
        '<div class="my-hero__actions">' +
          '<a class="btn-primary" href="/notes/">按路线开始读 <span aria-hidden="true">→</span></a>' +
          '<a class="btn-ghost" href="/categories/">全部分类</a>' +
          '<a class="btn-ghost" href="https://github.com/Tianziyu-coder" target="_blank" rel="noopener">GitHub</a>' +
        '</div>' +
      '</div>' +
      '<div class="my-hero__side">' +
        '<div class="my-hero__stat"><b data-stat="posts">' + stat('posts', 0) + '</b><span>篇笔记</span></div>' +
        '<div class="my-hero__stat"><b>' + (bc['Java基础'] || 0) + '</b><span>篇 Java 基础</span></div>' +
        '<div class="my-hero__stat"><b>' + wordLabel(stat('words', 0)) + '</b><span>字积累</span></div>' +
      '</div>';
    return el;
  }

  function makeTopics() {
    var s = window.__SITE_STATS__ || {};
    var bc = s.byCategory || {};
    var bt = s.byTag || {};
    var items = [
      { cls: 't1', icon: 'J', title: 'Java 基础', desc: '字符串 · 集合 · 异常 · Stream', url: '/categories/Java基础/', n: bc['Java基础'] },
      { cls: 't2', icon: '⚙', title: '并发与 JVM', desc: '线程池 · JMM · GC · 类加载', url: '/tags/并发/', n: bt['并发'] },
      { cls: 't3', icon: 'S', title: '框架与中间件', desc: 'Spring · MySQL · Redis · MQ', url: '/categories/框架与中间件/', n: bc['框架与中间件'] },
      { cls: 't4', icon: 'P', title: '动手实践', desc: '接口设计 · 网关 · 部署', url: '/categories/动手实践/', n: bc['动手实践'] }
    ];
    var cards = items.map(function (it) {
      return '<a class="topic-card ' + it.cls + '" href="' + it.url + '">' +
        '<span class="tc-icon">' + it.icon + '</span>' +
        '<b>' + it.title + (it.n ? ' <span style="font-size:12px;font-weight:500;color:var(--ink-3)">· ' + it.n + ' 篇</span>' : '') + '</b>' +
        '<small>' + it.desc + '</small><em>→</em></a>';
    }).join('');
    var el = document.createElement('section');
    el.id = TOPIC_ID;
    el.className = 'my-topics';
    el.innerHTML =
      '<div class="my-topics__head"><h2>按专题逛</h2><a href="/notes/">查看完整学习路线 →</a></div>' +
      '<div class="my-topics__grid">' + cards + '</div>';
    return el;
  }

  function build() {
    var oldHero = document.getElementById(HERO_ID);
    var oldTopics = document.getElementById(TOPIC_ID);
    if (oldHero) oldHero.remove();
    if (oldTopics) oldTopics.remove();
    if (!isHomeFirstPage()) return;

    /* #recent-posts 在宽屏下是 flex-wrap 容器。
       之前误插到它的子元素 #categoryBar（横向 flex 的分类栏）里，
       被挤成窄竖条、文字一字一行。这里改为插到第一篇卡片之前，
       作为 #recent-posts 的直接子元素，配合 CSS 的 100% 宽各占整行。 */
    var posts = document.getElementById('recent-posts');
    if (!posts) return;

    var ref = null;
    var kids = posts.children;
    for (var i = 0; i < kids.length; i++) {
      if (kids[i].classList && kids[i].classList.contains('recent-post-item')) {
        ref = kids[i];
        break;
      }
    }

    var hero = makeHero();
    var topics = makeTopics();
    if (ref) {
      posts.insertBefore(hero, ref);
      posts.insertBefore(topics, ref);
    } else {
      posts.appendChild(hero);
      posts.appendChild(topics);
    }
  }

  build();
  document.addEventListener('pjax:complete', function () { setTimeout(build, 260); });
})();
