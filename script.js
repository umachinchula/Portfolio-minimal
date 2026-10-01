window.lucide?.createIcons();

const sections = [...document.querySelectorAll('main > section, main > footer')];
const navLinks = [...document.querySelectorAll('[data-nav]')];
const counters = new Map([...document.querySelectorAll('[data-count-for]')].map(el => [el.dataset.countFor, el]));

function updateNavigation() {
  const marker = window.scrollY + window.innerHeight * 0.46;
  let current = sections[0];
  for (const section of sections) {
    if (section.offsetTop <= marker) current = section;
  }
  navLinks.forEach(link => {
    const active = link.dataset.nav === current.id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  for (const [name, counter] of counters) {
    const cards = [...document.querySelectorAll(`[data-stack="${name}"]`)];
    let index = 0;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].getBoundingClientRect().top <= window.innerHeight * 0.4) index = i;
    }
    counter.textContent = `${index + 1} of ${cards.length}`;
  }
}

let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => { updateNavigation(); scrollFrame = 0; });
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();

const menuButtons = [...document.querySelectorAll('[data-menu]')];
function closeMenus() {
  for (const button of menuButtons) {
    button.setAttribute('aria-expanded', 'false');
    document.getElementById(`${button.dataset.menu}-menu`).hidden = true;
  }
}
for (const button of menuButtons) {
  button.addEventListener('click', event => {
    event.stopPropagation();
    const menu = document.getElementById(`${button.dataset.menu}-menu`);
    const shouldOpen = menu.hidden;
    closeMenus();
    menu.hidden = !shouldOpen;
    button.setAttribute('aria-expanded', String(shouldOpen));
  });
}
document.addEventListener('click', event => { if (!event.target.closest('.dock-menu')) closeMenus(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenus(); });
document.querySelectorAll('.dock-menu a').forEach(link => link.addEventListener('click', closeMenus));
