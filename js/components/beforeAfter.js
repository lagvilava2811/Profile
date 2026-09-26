// js/components/beforeAfter.js
// Before / After ინტერაქტიული შედარების სლაიდერი

import { soundEngine } from './audioManager.js';

export function initBeforeAfter() {
  const containers = document.querySelectorAll('.before-after-container');

  containers.forEach(container => {
    const handle = container.querySelector('.ba-handle');
    const afterLayer = container.querySelector('.ba-after');
    if (!handle || !afterLayer) return;

    let isDragging = false;

    function setPosition(xPos) {
      const rect = container.getBoundingClientRect();
      let offsetX = xPos - rect.left;
      let pct = (offsetX / rect.width) * 100;

      pct = Math.max(5, Math.min(95, pct));

      handle.style.left = `${pct}%`;
      afterLayer.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
    }

    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      soundEngine.playPencilScratch();
      e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    // Touch Support
    handle.addEventListener('touchstart', () => {
      isDragging = true;
      soundEngine.playPencilScratch();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches.length) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    // Click anywhere on container to move handle
    container.addEventListener('click', (e) => {
      if (e.target !== handle && !handle.contains(e.target)) {
        setPosition(e.clientX);
        soundEngine.playClick();
      }
    });
  });
}
