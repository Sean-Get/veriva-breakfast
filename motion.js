(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const painting = document.querySelector('.painting');
  const control = document.querySelector('.motion-toggle');
  const header = document.querySelector('header');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  const progress = document.createElement('div');
  progress.className = 'scene-progress'; progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const dust = document.createElement('div');
  dust.className = 'scene-dust'; dust.setAttribute('aria-hidden', 'true');
  dust.innerHTML = '<i></i><i></i><i></i><i></i>'; hero.append(dust);
  let paused = false;
  try { paused = localStorage.getItem('veriva-nature-motion') === 'off'; } catch {}
  let off = false, frame = 0, pointerX = 0, pointerY = 0, scrolled = false;
  let bounds = { left: 0, top: 0, width: 1, height: 1 }, maxScroll = 1;
  let morningTop = 0, breakfastTop = 0;
  const nav = [...document.querySelectorAll('nav a[href^="#"]')];
  const seen = new WeakSet();
  const targets = [...document.querySelectorAll('.values article,.collection-heading,.recipe,.closing>*')];
  let observer;
  const animations = new Set();
  function play(element, frames, options) {
    if (off || !element.animate) return;
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.onfinish = animation.oncancel = () => animations.delete(animation);
    return animation;
  }
  function measure() {
    const rect = hero.getBoundingClientRect();
    bounds = { left: rect.left, top: rect.top + scrollY, width: rect.width, height: rect.height };
    maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    morningTop = document.querySelector('#morning').getBoundingClientRect().top + scrollY;
    breakfastTop = document.querySelector('#breakfast').getBoundingClientRect().top + scrollY;
    schedule();
  }
  function render() {
    frame = 0;
    const y = scrollY;
    const nextScrolled = y > 24;
    if (nextScrolled !== scrolled) { header.classList.toggle('is-scrolled', nextScrolled); scrolled = nextScrolled; }
    const section = y >= breakfastTop - 180 ? '#breakfast' : y >= morningTop - 180 ? '#morning' : '';
    for (const link of nav) {
      if (link.getAttribute('href') === section) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    if (off) return;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, y / maxScroll))})`;
    if (fine.matches && y < bounds.top + bounds.height && y + innerHeight > bounds.top) {
      const drift = Math.max(0, Math.min(1, (y - bounds.top) / bounds.height)) * 20;
      painting.style.transform = `translate3d(${pointerX}px,${pointerY + drift}px,0) scale(1.055)`;
    } else painting.style.transform = '';
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  hero.addEventListener('pointermove', (event) => {
    if (off || !fine.matches || event.pointerType === 'touch') return;
    pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * -12;
    pointerY = ((event.clientY - (bounds.top - scrollY)) / bounds.height - .5) * -8;
    schedule();
  });
  hero.addEventListener('pointerleave', () => { pointerX = pointerY = 0; schedule(); });
  function observeEntrances() {
    observer?.disconnect();
    for (const element of targets) element.classList.remove('motion-pending');
    if (off || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        element.classList.remove('motion-pending');
        if (!seen.has(element)) {
          seen.add(element);
          play(element, [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }], { duration: 620, easing: 'cubic-bezier(.23,1,.32,1)' });
        }
        observer.unobserve(element);
      }
    }, { threshold: .12, rootMargin: '0px 0px 25px 0px' });
    for (const element of targets) {
      if (seen.has(element) || element.getBoundingClientRect().top < innerHeight) { seen.add(element); continue; }
      element.classList.add('motion-pending'); observer.observe(element);
    }
  }
  function preference() {
    off = paused || reduce.matches;
    root.dataset.motion = off ? 'off' : 'on';
    control.disabled = reduce.matches;
    control.textContent = reduce.matches ? 'Motion reduced' : off ? 'Play gentle motion' : 'Pause gentle motion';
    control.setAttribute('aria-pressed', String(off));
    control.setAttribute('aria-label', reduce.matches ? 'Motion reduced by your system preference' : control.textContent);
    if (off) {
      for (const animation of [...animations]) animation.cancel();
      painting.style.transform = '';
      document.querySelectorAll('.recipe figure').forEach(figure => { figure.style.transform = ''; });
    }
    observeEntrances(); schedule();
  }
  control.onclick = () => { paused = !paused; try { localStorage.setItem('veriva-nature-motion', paused ? 'off' : 'on'); } catch {} preference(); };
  reduce.addEventListener('change', preference);
  fine.addEventListener('change', () => { pointerX = pointerY = 0; schedule(); });
  for (const [index, card] of [...document.querySelectorAll('.recipe')].entries()) {
    const figure = card.querySelector('figure');
    let cardFrame = 0, transform = '';
    card.addEventListener('pointermove', event => {
      if (off || !fine.matches || event.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) rotateZ(${[ -1.5, 0, 1.5 ][index]}deg) translateY(-5px)`;
      if (!cardFrame) cardFrame = requestAnimationFrame(() => { cardFrame = 0; if (!off && fine.matches) figure.style.transform = transform; });
    });
    card.addEventListener('pointerleave', () => { cancelAnimationFrame(cardFrame); cardFrame = 0; figure.style.transform = ''; });
  }
  document.querySelectorAll('.cta').forEach(button => button.addEventListener('pointerdown', event => {
    if (off) return;
    const rect = button.getBoundingClientRect();
    const glow = document.createElement('span'); glow.className = 'tap-glow'; glow.setAttribute('aria-hidden', 'true');
    glow.style.left = `${event.clientX - rect.left}px`; glow.style.top = `${event.clientY - rect.top}px`;
    button.append(glow);
    const animation = play(glow, [{ transform: 'translate(-50%,-50%) scale(.5)', opacity: .55 }, { transform: 'translate(-50%,-50%) scale(23)', opacity: 0 }], { duration: 600, easing: 'ease-out' });
    if (animation) animation.finished.catch(() => {}).finally(() => glow.remove()); else glow.remove();
  }));
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('pageshow', measure);
  document.fonts?.ready.then(measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  measure(); preference();
})();
