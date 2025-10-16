document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Improve focus visibility when navigating with keyboard
  body.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      body.classList.add('show-focus');
    }
  });

  // Update footer year(s)
  const yearTargets = document.querySelectorAll('#year');
  const currentYear = new Date().getFullYear();
  yearTargets.forEach((el) => {
    el.textContent = currentYear;
  });

  const nav = document.getElementById('site-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileQuery = window.matchMedia('(max-width: 880px)');

  const setNavOpen = (isOpen) => {
    if (!nav || !navToggle) return;
    if (isOpen) {
      nav.dataset.collapsed = 'true';
      nav.removeAttribute('hidden');
      navToggle.setAttribute('aria-expanded', 'true');
    } else {
      nav.dataset.collapsed = 'false';
      nav.setAttribute('hidden', '');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  };

  const syncNavWithViewport = (query) => {
    if (!nav || !navToggle) return;
    if (query.matches) {
      setNavOpen(false);
    } else {
      nav.dataset.collapsed = 'false';
      nav.removeAttribute('hidden');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (nav && navToggle) {
    syncNavWithViewport(mobileQuery);
    mobileQuery.addEventListener('change', syncNavWithViewport);

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setNavOpen(!isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileQuery.matches) {
          setNavOpen(false);
        }
      });
    });
  }

  // Highlight the active nav link
  if (nav) {
    const currentPath = window.location.pathname.endsWith('/')
      ? `${window.location.pathname}index.html`
      : window.location.pathname;

    nav.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const url = new URL(href, window.location.origin + window.location.pathname);
      const linkPath = url.pathname;
      const isIndex =
        (linkPath.endsWith('index.html') && currentPath.endsWith('index.html')) ||
        (linkPath.endsWith('/') && currentPath.endsWith('/'));

      if (isIndex || currentPath.endsWith(linkPath)) {
        link.classList.add('is-active');
      }
    });
  }

  // Tab interface for the resources page
  const tabs = document.querySelectorAll('.tabs .tab');
  const panels = document.querySelectorAll('.panel');

  const activateTab = (tab) => {
    const id = tab?.dataset.tab;
    if (!id) return;

    tabs.forEach((button) => {
      const isActive = button === tab;
      button.setAttribute('aria-selected', String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel.id !== `${id}-panel` && panel.id !== id;
    });

    const targetPanel = document.getElementById(`${id}-panel`) || document.getElementById(id);
    if (targetPanel) {
      targetPanel.hidden = false;
      targetPanel.setAttribute('tabindex', '-1');
      targetPanel.focus({ preventScroll: true });
    }
  };

  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', (event) => {
        const currentIndex = Array.prototype.indexOf.call(tabs, tab);
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          const next = tabs[(currentIndex + 1) % tabs.length];
          next.focus();
          activateTab(next);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
          prev.focus();
          activateTab(prev);
        }
      });
    });
    // Ensure the first selected tab is active on load
    const selected = Array.from(tabs).find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    activateTab(selected);
  }
});
