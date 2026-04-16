// Landing page interactions: CTA dropdown + encouragement buttons.
(function () {
  const cta = document.getElementById('ctaStart');
  const menu = document.getElementById('ctaMenu');
  if (cta && menu) {
    const close = () => {
      cta.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    };
    const open = () => {
      cta.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
    };
    cta.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menu.hidden) open(); else close();
    });
    document.addEventListener('click', (e) => {
      if (!menu.hidden && !menu.contains(e.target) && e.target !== cta) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  const status = document.getElementById('encourageStatus');
  const NUDGE_MESSAGES = [
    'Nudge sent to Alex P. — "You got this!"',
    'Nudge sent to Jordan — "One check-in at a time."',
    'Nudge sent to Sam — "Don\u2019t break the streak!"',
  ];
  const CELEBRATE_MESSAGES = [
    'Cheers sent to Alex P. — 5 days strong! \u{1F44F}',
    'Cheers sent to Jordan — Week complete! \u{1F38A}',
    'Cheers sent to Sam — Personal best! \u{1F31F}',
  ];
  let nudgeIdx = 0, celebrateIdx = 0;
  document.querySelectorAll('.pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const pool = action === 'nudge' ? NUDGE_MESSAGES : CELEBRATE_MESSAGES;
      const idx = action === 'nudge' ? nudgeIdx++ % pool.length : celebrateIdx++ % pool.length;
      if (status) status.textContent = pool[idx];
    });
  });
})();
