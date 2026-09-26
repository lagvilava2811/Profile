// js/components/magneticButton.js
// მაგნიტური მიზიდვის ფიზიკა ღილაკებზე (Magnetic Buttons)

export function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const buttons = document.querySelectorAll('.btn, .hud-btn, .brand-badge');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic pull (max 10px translate)
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px) scale(1.03)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
