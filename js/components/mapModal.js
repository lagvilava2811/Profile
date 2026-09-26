// js/components/mapModal.js
// ინტერაქტიული სართულის რუკა (Floor Plan), აუდიო პანელი და ჩანიშვნები

import { soundEngine } from './audioManager.js';

export function initHUDModals() {
  // 1. Map Modal
  const mapBtn = document.getElementById('mapBtn');
  const mapModal = document.getElementById('mapModal');
  const mapCloseBtn = document.getElementById('mapCloseBtn');
  const mapExitToCorridorBtn = document.getElementById('mapExitToCorridorBtn');

  if (mapBtn && mapModal) {
    mapBtn.addEventListener('click', () => {
      soundEngine.playPaperRustle();
      mapModal.classList.toggle('open');
    });

    if (mapCloseBtn) {
      mapCloseBtn.addEventListener('click', () => {
        soundEngine.playClick();
        mapModal.classList.remove('open');
      });
    }

    if (mapExitToCorridorBtn) {
      mapExitToCorridorBtn.addEventListener('click', () => {
        soundEngine.playClick();
        mapModal.classList.remove('open');
        if (window.closeCurrentRoom) {
          window.closeCurrentRoom();
        }
      });
    }

    mapModal.addEventListener('click', (e) => {
      if (e.target === mapModal) mapModal.classList.remove('open');
    });

    // Floor room hitboxes
    const hitboxes = mapModal.querySelectorAll('.map-room-hitbox');
    hitboxes.forEach(hitbox => {
      hitbox.addEventListener('click', () => {
        soundEngine.playDoorCreak();
        const targetRoom = hitbox.getAttribute('data-target-room');
        mapModal.classList.remove('open');

        if (window.corridorInstance && targetRoom) {
          window.corridorInstance.teleportToRoom(targetRoom);
        }
      });
    });
  }

  // 2. Audio Panel
  const audioBtn = document.getElementById('audioBtn');
  const audioPanel = document.getElementById('audioPanel');
  const volumeSlider = document.getElementById('volumeSlider');
  const muteCheckbox = document.getElementById('muteCheckbox');

  if (audioBtn && audioPanel) {
    audioBtn.addEventListener('click', () => {
      soundEngine.playClick();
      audioPanel.classList.toggle('open');
    });

    if (volumeSlider) {
      volumeSlider.value = soundEngine.volume;
      volumeSlider.addEventListener('input', (e) => {
        soundEngine.setVolume(e.target.value);
        soundEngine.playPencilScratch();
      });
    }

    if (muteCheckbox) {
      muteCheckbox.checked = soundEngine.isMuted;
      muteCheckbox.addEventListener('change', () => {
        const isMuted = soundEngine.toggleMute();
        muteCheckbox.checked = isMuted;
        audioBtn.style.opacity = isMuted ? '0.5' : '1';
      });
    }

    document.addEventListener('click', (e) => {
      if (!audioPanel.contains(e.target) && !audioBtn.contains(e.target)) {
        audioPanel.classList.remove('open');
      }
    });
  }

  // 3. Notes / Achievements Panel
  const notesBtn = document.getElementById('notesBtn');
  const notesPanel = document.getElementById('notesPanel');
  const notesCloseBtn = document.getElementById('notesCloseBtn');

  if (notesBtn && notesPanel) {
    notesBtn.addEventListener('click', () => {
      soundEngine.playPencilScratch();
      notesPanel.classList.toggle('open');
    });

    if (notesCloseBtn) {
      notesCloseBtn.addEventListener('click', () => {
        notesPanel.classList.remove('open');
      });
    }

    document.addEventListener('click', (e) => {
      if (!notesPanel.contains(e.target) && !notesBtn.contains(e.target)) {
        notesPanel.classList.remove('open');
      }
    });
  }
}
