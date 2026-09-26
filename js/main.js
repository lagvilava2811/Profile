// js/main.js
// მთავარი აპლიკაციის ორკესტრატორი და ინიციალიზატორი (itomdev 3D გამოცდილება)

import { Corridor3D } from './corridor3D.js?v=20260917_11';
import { soundEngine } from './components/audioManager.js';
import { initCustomCursor } from './components/cursor.js';
import { initScrollReveal } from './components/scrollReveal.js';
import { initPortfolioFilter } from './components/portfolioFilter.js';
import { initMagneticButtons } from './components/magneticButton.js';
import { initCounterAnimations } from './components/counterAnimation.js';
import { initHUDModals } from './components/mapModal.js';
import { initBeforeAfter } from './components/beforeAfter.js';
import { initAIDemo } from './components/aiDemo.js';
import { servicesData } from './data/services.js';
import { projectsData } from './data/projects.js';
import { GalleryExperience } from './components/galleryExperience.js?v=20260917_11';
import { StudioExperience } from './components/studioExperience.js?v=20260917_11';
import { AboutExperience } from './components/aboutExperience.js?v=20260917_11';
import { ContactExperience } from './components/contactExperience.js?v=20260917_11';

let galleryExp = null;
let studioExp = null;
let aboutExp = null;
let contactExp = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Paper Tear Preloader
  initPaperTearPreloader();

  // 2. Render Services & Portfolio Content
  renderServices(servicesData);
  renderProjects(projectsData);

  // 3. Initialize 3D Walkable Corridor
  const corridor = new Corridor3D('canvasContainer', (roomId) => {
    openRoomOverlay(roomId);
  });
  window.corridorInstance = corridor;

  // 4. Room Overlay Setup
  setupRoomNavigation(corridor);

  // 5. Initialize Components
  initCustomCursor();
  initScrollReveal();
  initMagneticButtons();
  initCounterAnimations();
  initHUDModals();
  initBeforeAfter();
  initAIDemo();
  initPortfolioFilter(projectsData);
  initQuoteForm();
});

// Render Services in Room 02
function renderServices(services) {
  const container = document.getElementById('servicesContainer');
  if (!container) return;

  container.innerHTML = services.map(s => `
    <div class="service-card" data-service-id="${s.id}">
      <div class="service-header">
        <span class="service-number">${s.number}</span>
        <span class="service-badge">${s.badge}</span>
      </div>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-tagline">${s.tagline}</p>

      <div class="service-details-drawer">
        <div class="service-section-block">
          <h5>რას ვაკეთებთ:</h5>
          <p>${s.whatWeDo}</p>
        </div>
        <div class="service-section-block">
          <h5>ვის სჭირდება:</h5>
          <p>${s.whoNeedsIt}</p>
        </div>
        <div class="service-section-block">
          <h5>რატომ არის სასარგებლო:</h5>
          <p>${s.whyUseful}</p>
        </div>
        <div class="service-section-block">
          <h5>რას მიიღებთ (Deliverables):</h5>
          <div class="service-deliverables-list">
            ${s.deliverables.map(d => `
              <div class="service-deliverable-item">
                <span class="deliverable-check">✓</span>
                <span>${d}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="service-action">
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${s.techStack.map(t => `<span style="background: #f4f4f5; border: 1px solid #18181b; border-radius: 4px; padding: 2px 8px; font-size: 0.8rem;">${t}</span>`).join('')}
        </div>
        <button class="btn btn-primary btn-sm service-order-trigger" data-service-type="${s.id}">
          პროექტის დაწყება →
        </button>
      </div>
    </div>
  `).join('');

  // Handle service order trigger
  container.querySelectorAll('.service-order-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEngine.playClick();
      const sType = btn.getAttribute('data-service-type');
      if (window.corridorInstance) {
        window.corridorInstance.teleportToRoom('contact');
        setTimeout(() => {
          selectServiceInQuote(sType);
        }, 500);
      }
    });
  });
}

// Render Projects in Room 03
function renderProjects(projects) {
  const container = document.getElementById('portfolioGridContainer');
  if (!container) return;

  container.innerHTML = projects.map(p => `
    <div class="project-card" data-project-id="${p.id}" data-category="${p.category}">
      <div class="project-preview-box">
        <div class="project-preview-mockup">
          <div class="mockup-bar">
            <div class="mockup-dot"></div>
            <div class="mockup-dot"></div>
            <div class="mockup-dot"></div>
          </div>
          <div class="mockup-inner">
            <div class="mockup-title">${p.title}</div>
            <span class="mockup-metric-highlight">${p.metrics[0].label}: ${p.metrics[0].value}</span>
          </div>
        </div>
      </div>
      <div style="padding: 24px; display: flex; flex-direction: column; flex-grow: 1;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="section-tag">${p.categoryName}</span>
          <span style="font-family: var(--font-hand); font-size: 0.95rem; color: var(--text-muted);">${p.year}</span>
        </div>
        <h4 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 8px;">${p.title}</h4>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; flex-grow: 1;">${p.summary}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e4e4e7; padding-top: 12px;">
          <span style="font-family: var(--font-hand); color: var(--accent); font-weight: 700; font-size: 1.05rem;">Case Study-ს ნახვა →</span>
          <span style="font-size: 0.8rem; background: #f4f4f5; padding: 2px 8px; border-radius: 4px; border: 1px solid #18181b;">${p.tag}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Room Navigation Setup
function setupRoomNavigation(corridor) {
  const roomMap = {
    'about': document.getElementById('roomAbout'),
    'services': document.getElementById('roomServices'),
    'work': document.getElementById('roomWork'),
    'ai-lab': document.getElementById('roomAILab'),
    'contact': document.getElementById('roomContact')
  };

  const backBtn = document.getElementById('backToCorridorBtn');
  const hintBadge = document.getElementById('corridorHint');

  window.openRoomOverlay = function(roomId) {
    Object.values(roomMap).forEach(el => el && el.classList.remove('active'));
    const targetEl = roomMap[roomId];
    if (targetEl) {
      targetEl.classList.add('active');
      targetEl.scrollTop = 0;
      if (backBtn) backBtn.classList.add('visible');
      if (hintBadge) hintBadge.style.opacity = '0';
      soundEngine.playPaperRustle();

      // Mount authentic 3D and infinite-scroll room experiences matching itomdev reference photos
      if (roomId === 'work' && !galleryExp) {
        galleryExp = new GalleryExperience('roomWork', projectsData);
      } else if (roomId === 'services' && !studioExp) {
        studioExp = new StudioExperience('roomServices', servicesData);
      } else if (roomId === 'about' && !aboutExp) {
        aboutExp = new AboutExperience('roomAbout');
      } else if (roomId === 'contact' && !contactExp) {
        contactExp = new ContactExperience('roomContact');
      }
    }
  };

  window.closeCurrentRoom = function() {
    Object.values(roomMap).forEach(el => el && el.classList.remove('active'));
    if (backBtn) backBtn.classList.remove('visible');
    if (hintBadge) hintBadge.style.opacity = '1';
    if (corridor) {
      corridor.exitRoom();
    }
  };

  if (backBtn) {
    backBtn.addEventListener('click', window.closeCurrentRoom);
  }

  document.querySelectorAll('.room-exit-btn').forEach(btn => {
    btn.addEventListener('click', window.closeCurrentRoom);
  });

  // Top Nav Pills Click
  document.getElementById('navAboutBtn')?.addEventListener('click', () => corridor.teleportToRoom('about'));
  document.getElementById('navServicesBtn')?.addEventListener('click', () => corridor.teleportToRoom('services'));
  document.getElementById('navWorkBtn')?.addEventListener('click', () => corridor.teleportToRoom('work'));
  document.getElementById('navAILabBtn')?.addEventListener('click', () => corridor.teleportToRoom('ai-lab'));
  document.getElementById('navContactBtn')?.addEventListener('click', () => corridor.teleportToRoom('contact'));
}

// Select a service checkbox in quote form
function selectServiceInQuote(serviceType) {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  const pill = form.querySelector(`input[value="${serviceType}"]`)?.closest('.service-choice-pill');
  if (pill) {
    const cb = pill.querySelector('input[type="checkbox"]');
    if (cb) {
      cb.checked = true;
      pill.classList.add('checked');
    }
  }
}

// Paper Tear Preloader
function initPaperTearPreloader() {
  const preloader = document.getElementById('sitePreloader');
  const counterEl = document.getElementById('preloaderCounter');
  if (!preloader || !counterEl) return;

  let progress = 0;
  const duration = 1100;
  const startTime = performance.now();

  function updateProgress(currentTime) {
    const elapsed = currentTime - startTime;
    progress = Math.min(Math.floor((elapsed / duration) * 100), 100);
    counterEl.textContent = `${progress}%`;

    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    } else {
      setTimeout(() => {
        soundEngine.playPaperTear();
        preloader.classList.add('tearing');

        setTimeout(() => {
          preloader.classList.add('completed');
        }, 900);
      }, 150);
    }
  }

  requestAnimationFrame(updateProgress);
}

// Quote Form
function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  const pills = document.querySelectorAll('.service-choice-pill');
  const toast = document.getElementById('formToast');
  if (!form) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const checkbox = pill.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        pill.classList.toggle('checked', checkbox.checked);
        soundEngine.playClick();
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    soundEngine.playPencilScratch();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "იგზავნება...";
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "მოთხოვნა გაგზავნილია ✓";
      }

      if (toast) {
        toast.classList.add('show');
        soundEngine.playClick();
        setTimeout(() => {
          toast.classList.remove('show');
        }, 5000);
      }

      form.reset();
      pills.forEach(p => p.classList.remove('checked'));
    }, 800);
  });
}
