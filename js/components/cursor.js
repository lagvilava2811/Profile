// js/components/cursor.js
// Custom Ink Cursor - გლუვი მაგნიტური მიდევნება და კონტექსტური წარწერები

import { soundEngine } from './audioManager.js';

export function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';

  const circle = document.createElement('div');
  circle.className = 'custom-cursor-circle';

  const badge = document.createElement('div');
  badge.className = 'custom-cursor-badge';

  document.body.appendChild(dot);
  document.body.appendChild(circle);
  document.body.appendChild(badge);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let circleX = mouseX;
  let circleY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // 60FPS Lerp Animation
  function renderCursor() {
    circleX += (mouseX - circleX) * 0.18;
    circleY += (mouseY - circleY) * 0.18;

    circle.style.transform = `translate(${circleX}px, ${circleY}px) translate(-50%, -50%)`;
    badge.style.left = `${circleX}px`;
    badge.style.top = `${circleY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // კონტექსტური ჰოვერები
  const hoverSelectors = 'a, button, input, textarea, select, .project-card, .service-card, .floor-room, .preset-btn, .filter-pill, .ba-handle-btn';

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverSelectors);
    if (target) {
      document.body.classList.add('cursor-hover');
      soundEngine.playPencilScratch();

      const contextText = target.getAttribute('data-cursor-text');
      if (contextText) {
        badge.textContent = contextText;
        badge.classList.add('visible');
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverSelectors);
    if (target) {
      document.body.classList.remove('cursor-hover');
      badge.classList.remove('visible');
    }
  });

  document.addEventListener('mousedown', () => {
    circle.style.transform += ' scale(0.85)';
    soundEngine.playClick();
  });
}
