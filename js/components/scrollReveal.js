// js/components/scrollReveal.js
// Scroll-Triggered Reveal ანიმაციები IntersectionObserver-ით

export function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-scale-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  });

  elements.forEach(el => observer.observe(el));
}
