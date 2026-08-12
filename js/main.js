// Menyala Indonesia — Kompas.com kanal
// Horizontal-scroll carousel behaviour for "Rolls" and "Video" rows:
// prev/next buttons page the track, and auto-hide at either end.

document.addEventListener('DOMContentLoaded', () => {
  const tracks = new Set();
  document.querySelectorAll('.carousel-nav').forEach((btn) => {
    const id = btn.getAttribute('data-target');
    if (id) tracks.add(id);
  });

  tracks.forEach((id) => {
    const track = document.getElementById(id);
    if (!track) return;

    const prevBtn = document.querySelector(`.carousel-nav--prev[data-target="${id}"]`);
    const nextBtn = document.querySelector(`.carousel-nav--next[data-target="${id}"]`);

    const pageDistance = () => {
      // Scroll by roughly one "page" of cards, based on the visible width.
      return track.clientWidth * 0.9;
    };

    const updateButtons = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft >= maxScroll - 2;

      if (prevBtn) prevBtn.classList.toggle('is-disabled', atStart);
      if (nextBtn) nextBtn.classList.toggle('is-disabled', atEnd || maxScroll <= 0);
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -pageDistance(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: pageDistance(), behavior: 'smooth' });
      });
    }

    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateButtons();
        ticking = false;
      });
    });
    window.addEventListener('resize', updateButtons);

    updateButtons();
  });

  // ---- Navbar auto-hide on scroll ----
  // Slides up out of view when scrolling down, slides back in when
  // scrolling up. Stays visible near the very top so it doesn't hide
  // itself before the user has scrolled meaningfully.
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScrollY = window.scrollY;
    const showThreshold = navbar.offsetHeight; // don't hide until past the navbar's own height
    let navTicking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const scrolledDown = currentScrollY > lastScrollY;

      if (currentScrollY <= showThreshold) {
        navbar.classList.remove('navbar--hidden');
      } else if (scrolledDown) {
        navbar.classList.add('navbar--hidden');
      } else {
        navbar.classList.remove('navbar--hidden');
      }

      lastScrollY = currentScrollY;
      navTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (navTicking) return;
      navTicking = true;
      requestAnimationFrame(updateNavbar);
    });
  }

  // ---- Mobile combo menu+search button ----
  // Toggles the same search form and nav-link list the desktop layout
  // uses (just re-styled as a dropdown by CSS) — no separate mobile menu
  // content to keep in sync.
  const menuSearchBtn = document.querySelector('.navbar__menu-search');
  if (navbar && menuSearchBtn) {
    const closeMobileMenu = () => {
      navbar.classList.remove('navbar--mobile-menu-open');
      menuSearchBtn.setAttribute('aria-expanded', 'false');
    };

    menuSearchBtn.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('navbar--mobile-menu-open');
      menuSearchBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.navbar__menu-list a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (event) => {
      if (!navbar.contains(event.target)) closeMobileMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    });
  }

  // ---- Floating bottom ad(s) ----
  // Each close button dismisses its own banner for the rest of the page
  // view. Generic over every .floating-ads block (desktop + mobile
  // variants) so adding another one later needs no JS changes.
  document.querySelectorAll('.floating-ads').forEach((floatingAds) => {
    const closeBtn = floatingAds.querySelector('.floating-ads__close');
    if (!closeBtn) return;
    closeBtn.addEventListener('click', () => {
      floatingAds.classList.add('is-dismissed');
    });
  });
});
