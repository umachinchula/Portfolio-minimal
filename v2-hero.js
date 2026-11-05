// Preview interaction extracted from Quick Mode.
const intro = document.querySelector('.v2-hero');
const content = intro?.querySelector('.content');
const preview = intro?.querySelector('#hero-preview');

// Stop decoding the sky video while the hero is outside the viewport.
const skyVideo = intro?.querySelector('.intro-sky');
if (skyVideo) {
  let skyVisible = true;
  const updateSky = () => {
    if (skyVisible && !document.hidden) skyVideo.play().catch(() => {});
    else skyVideo.pause();
  };
  new IntersectionObserver(entries => {
    skyVisible = entries[0].isIntersecting;
    updateSky();
  }).observe(intro);
  document.addEventListener('visibilitychange', updateSky);
}

if (content && preview) {
  const targets = intro.querySelectorAll('.hero-focus');
  const cards = [...preview.querySelectorAll('[data-preview-card]')];
  let activeVideo;

  function hidePreview() {
    intro.classList.remove('is-spotlighting');
    targets.forEach(target => target.classList.remove('is-active'));
    cards.forEach(card => card.classList.remove('is-active'));
    preview.classList.remove('is-visible');
    preview.setAttribute('aria-hidden', 'true');
    activeVideo?.pause();
    activeVideo = null;
  }

  function showPreview(target) {
    const card = cards.find(item => item.dataset.previewCard === target.dataset.preview);
    if (!card) return;

    const media = card.querySelector('[data-src]');
    if (media) {
      media.src = media.dataset.src;
      delete media.dataset.src;
    }

    intro.classList.add('is-spotlighting');
    targets.forEach(item => item.classList.toggle('is-active', item === target));
    cards.forEach(item => item.classList.toggle('is-active', item === card));

    const contentRect = content.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const halfWidth = card.offsetWidth / 2;
    const center = targetRect.left + targetRect.width / 2 - contentRect.left;
    const left = Math.max(halfWidth, Math.min(contentRect.width - halfWidth, center));
    const top = targetRect.top - contentRect.top - card.offsetHeight - 14;
    preview.style.left = `${left}px`;
    preview.style.top = `${top}px`;
    preview.classList.add('is-visible');
    preview.setAttribute('aria-hidden', 'false');

    activeVideo?.pause();
    activeVideo = card.querySelector('video');
    if (activeVideo) {
      activeVideo.muted = true;
      activeVideo.play().catch(() => {});
    }
  }

  targets.forEach(target => {
    target.addEventListener('pointerenter', () => showPreview(target));
    target.addEventListener('focus', () => showPreview(target));
    target.addEventListener('pointerleave', hidePreview);
    target.addEventListener('blur', hidePreview);
  });

  intro.querySelectorAll('.intro-social a[href="#"]').forEach(link => {
    link.addEventListener('click', event => event.preventDefault());
  });
  intro.addEventListener('pointerleave', hidePreview);
}
