const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Content starts visible. Animate once on entry, never hide résumé content while
// waiting for JavaScript, an observer, or an animation to finish.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.job, .education-item').forEach(item => observer.observe(item));
}

const links = [...document.querySelectorAll<HTMLAnchorElement>('.site-header nav a')];
const sections = ['experience', 'skills', 'education', 'projects', 'about', 'contact']
  .map(id => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);
function activate(id?: string) {
  for (const link of links) {
    if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
let queued = false;
function updateNavigation() {
  queued = false;
  const boundary = Math.min(window.innerHeight * 0.3, 240);
  const passed = sections.map(section => ({ id: section.id, top: section.getBoundingClientRect().top }))
    .filter(section => section.top <= boundary).sort((a, b) => b.top - a.top);
  const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
  activate(atBottom ? 'contact' : passed[0]?.id);
}
function scheduleUpdate() {
  if (!queued) { queued = true; window.requestAnimationFrame(updateNavigation); }
}
window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
links.forEach(link => link.addEventListener('click', () => activate(link.hash.slice(1))));
updateNavigation();
