(() => {
  const dock = document.querySelector('.dock-wrap');
  if (!dock) return;

  const control = document.createElement('div');
  control.className = 'v2-mode-control';
  control.setAttribute('role', 'group');
  control.setAttribute('aria-label', 'Portfolio mode');
  control.innerHTML = `
    <button type="button" data-mode="full" aria-label="Full portfolio" title="Full portfolio" aria-pressed="true"><img src="quick-mode/assets/e1470.svg" alt=""></button>
    <button type="button" data-mode="quick" aria-label="Quick mode" title="Quick mode" aria-pressed="false"><img src="quick-mode/assets/9f16e.svg" alt=""></button>
  `;
  dock.prepend(control);

  const buttons = control.querySelectorAll('button');
  for (const button of buttons) {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;

      document.documentElement.dataset.portfolioMode = button.dataset.mode;
      for (const option of buttons) {
        option.setAttribute('aria-pressed', String(option === button));
      }
      window.dispatchEvent(new Event('portfolio-mode-change'));
    });
  }
})();
