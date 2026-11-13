(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Skills (níveis de 1 a 10: ajuste aqui) ---------- */
  const SKILLS = [
    { n: 'Java', lvl: 8, img: 'java.png' },
    { n: 'Spring Boot', lvl: 8, img: 'spring.png' },
    { n: 'API REST', lvl: 8, glyph: 'API' },
    { n: 'Angular', lvl: 7, img: 'angular.svg' },
    { n: 'TypeScript', lvl: 7, img: 'ts.png' },
    { n: 'JavaScript', lvl: 7, img: 'js.png' },
    { n: 'HTML5', lvl: 8, img: 'html-5.png' },
    { n: 'CSS3', lvl: 7, img: 'css-3.png' },
    { n: 'Python', lvl: 5, img: 'python.png' },
    { n: 'MySQL', lvl: 6, img: 'mysql.png' },
    { n: 'PostgreSQL', lvl: 6, glyph: 'PG' },
    { n: 'Docker', lvl: 5, glyph: 'DK' },
    { n: 'Kafka', lvl: 4, img: 'kafka.png' },
    { n: 'Git / GitLab', lvl: 7, glyph: 'GIT' }
  ];
  $('#skill-grid').innerHTML = SKILLS.map(s => `
    <div class="skill reveal" data-lvl="${s.lvl}">
      ${s.img ? `<img src="assets/${s.img}" alt="" loading="lazy">` : `<div class="glyph">${s.glyph}</div>`}
      <div><h3>${s.n}</h3><span class="lvl">LVL ${s.lvl}</span></div>
      <div class="xp" role="img" aria-label="Nível ${s.lvl} de 10">${'<i></i>'.repeat(10)}</div>
    </div>`).join('');

  /* ---------- Reveal + barras de XP ---------- */
  const io = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      if (el.dataset.lvl) {
        $$('.xp i', el).forEach((b, i) => setTimeout(() => b.classList.toggle('on', i < +el.dataset.lvl), reduce ? 0 : i * 70));
      }
      io.unobserve(el);
    });
  }, { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Fada voadora: segue a rolagem ---------- */
  // Waypoints por seção: x/y em fração da viewport (centro da fada) e fala do balão.
  const WP = [
    { id: 'inicio',   x: .76, y: .56, say: 'Oi! Eu sou a Kauane. Role para eu te mostrar o site.' },
    { id: 'sobre',    x: .10, y: .30, say: 'Este é o meu perfil.' },
    { id: 'skills',   x: .90, y: .34, say: 'Minhas skills, com nível de XP.' },
    { id: 'quest',    x: .10, y: .48, say: 'Minha jornada até aqui.' },
    { id: 'projetos', x: .90, y: .30, say: 'Escolha uma carta: meus projetos.' },
    { id: 'contato',  x: .50, y: .22, say: 'Vamos conversar?' }
  ];
  const fairy = $('#fairy'), flip = $('#fairyFlip'), bubble = $('#bubble');
  const secs = WP.map(w => document.getElementById(w.id));
  const xpBar = $('#xp');
  let anchors = [], fw = 190, pos = { x: 0, y: 0 }, lastX = 0, face = 1, lastY = scrollY, vel = 0, said = -1;

  const measure = () => {
    const vh = innerHeight;
    fw = fairy.offsetWidth;
    // âncora = quando o topo da seção está no terço superior da tela; a fada chega antes
    anchors = secs.map((s, i) => i === 0 ? 0 : s.getBoundingClientRect().top + scrollY - vh * .55);
  };
  const ease = t => t * t * (3 - 2 * t);

  function target() {
    const y = scrollY, vw = innerWidth, vh = innerHeight;
    let i = 0;
    while (i < anchors.length - 1 && y >= anchors[i + 1]) i++;
    const last = i >= anchors.length - 1;
    const t = last ? 0 : ease(Math.min(1, Math.max(0, (y - anchors[i]) / (anchors[i + 1] - anchors[i]))));
    const a = WP[i], b = WP[last ? i : i + 1];
    const arc = Math.sin(t * Math.PI) * .12;      // voo em arco entre pontos
    const narrow = vw < 760;
    const cx = (a.x + (b.x - a.x) * t) * vw;
    const cy = (a.y + (b.y - a.y) * t - arc) * vh;
    // no celular, mantém a fada nas bordas para não cobrir o texto
    const px = narrow ? Math.min(vw - fw * .6, Math.max(fw * .6, cx)) : cx;
    return { x: px - fw / 2, y: cy - fw * .53, idx: t > .5 && !last ? i + 1 : i };
  }

  function say(idx) {
    if (idx === said) return;
    said = idx;
    bubble.classList.add('swap');
    setTimeout(() => { bubble.textContent = WP[idx].say; bubble.classList.remove('swap'); }, 220);
  }

  function loop() {
    const tg = target();
    // Suaviza o voo (inércia) e calcula velocidade para bater asas mais rápido
    pos.x += (tg.x - pos.x) * .09;
    pos.y += (tg.y - pos.y) * .09;
    const dy = scrollY - lastY; lastY = scrollY;
    vel += (Math.abs(dy) - vel) * .12;
    const dx = pos.x - lastX; lastX = pos.x;
    if (Math.abs(dx) > .6) face = dx > 0 ? 1 : -1;
    const tilt = Math.max(-14, Math.min(14, dx * 1.2));
    fairy.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
    flip.style.transform = `scaleX(${face}) rotate(${tilt * face}deg)`;
    fairy.style.setProperty('--flap', Math.max(.16, .9 - vel * .06).toFixed(2) + 's');
    say(tg.idx);
    const max = document.documentElement.scrollHeight - innerHeight;
    xpBar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    requestAnimationFrame(loop);
  }

  measure();
  addEventListener('resize', measure);
  addEventListener('load', measure);
  document.fonts && document.fonts.ready.then(measure);
  pos = target(); lastX = pos.x;
  bubble.textContent = WP[0].say; said = 0;
  if (reduce) {
    // sem movimento: fada parada no início e some ao rolar
    fairy.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
    addEventListener('scroll', () => { fairy.style.opacity = scrollY > innerHeight * .4 ? 0 : 1; xpBar.style.width = scrollY / (document.documentElement.scrollHeight - innerHeight) * 100 + '%'; }, { passive: true });
  } else {
    requestAnimationFrame(loop);
  }

  /* ---------- Partículas discretas ---------- */
  const cv = $('#sparks');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    const colors = ['#85C79A', '#4E8D9C', '#8BBB92'];
    let W, H, P = [];
    const size = () => {
      const d = devicePixelRatio || 1;
      W = cv.width = innerWidth * d; H = cv.height = innerHeight * d;
      P = Array.from({ length: innerWidth < 760 ? 22 : 44 }, () => ({
        x: Math.random() * W, y: Math.random() * H, s: (Math.random() * 2 + 1.5) * d,
        v: (Math.random() * .3 + .1) * d, c: colors[(Math.random() * colors.length) | 0], o: Math.random() * 6
      }));
    };
    size(); addEventListener('resize', size);
    (function draw(t) {
      ctx.clearRect(0, 0, W, H);
      P.forEach(p => {
        p.y -= p.v; if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        ctx.globalAlpha = .2 + .25 * Math.sin(t / 700 + p.o);
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      });
      requestAnimationFrame(draw);
    })(0);
  }
})();
