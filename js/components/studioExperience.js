// js/components/studioExperience.js
// Services Room (Room 02: The Studio)
// Matches itomdev.com/studio (media_1789629752272.png & media_1789629752335.png)
// Features: 3D floating monitors vortex, infinite vertical scroll,
// click-to-zoom with spotlight glow, and authentic torn-paper service detail card.

import { soundEngine } from './audioManager.js';

export class StudioExperience {
  constructor(containerId, servicesData) {
    this.container = document.getElementById(containerId);
    this.services = servicesData || [];
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.isDragging = false;
    this.startY = 0;
    this.startScrollY = 0;
    this.activeService = null;
    this.isZoomed = false;
    this.animationFrameId = null;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.container.innerHTML = `
      <div class="studio-exp-scene" id="studioExpScene">
        <!-- Ambient floating code/sketch doodles (media_1789629752272.png) -->
        <div class="studio-ambient-doodles">
          <span class="doodle-symbol" style="top: 15%; left: 8%;">0101</span>
          <span class="doodle-symbol" style="top: 25%; left: 22%;">{ }</span>
          <span class="doodle-symbol" style="top: 48%; left: 12%;">??</span>
          <span class="doodle-symbol" style="top: 68%; left: 5%;">10</span>
          <span class="doodle-symbol" style="top: 18%; right: 14%;">0101</span>
          <span class="doodle-symbol" style="top: 35%; right: 8%;">↑</span>
          <span class="doodle-symbol" style="top: 55%; right: 20%;">%</span>
          <span class="doodle-symbol" style="top: 72%; right: 10%;">10</span>
        </div>

        <!-- 3D Monitors Cylinder Stage -->
        <div class="studio-viewport" id="studioViewport">
          <div class="studio-cylinder-track" id="studioCylinderTrack">
            <!-- 3D Monitor items generated here -->
          </div>
        </div>

        <!-- Spotlight Backdrop (Visible during zoom inspect - media_1789629752335.png) -->
        <div class="studio-spotlight-backdrop" id="studioSpotlight"></div>

        <div class="studio-selected-monitor" id="studioSelectedMonitor" aria-hidden="true"></div>
        <!-- Bottom Explorer Banner -->
        <div class="studio-bottom-banner" id="studioBottomBanner">
          <div class="studio-banner-box">
            <span class="studio-banner-checkbox">▢</span>
            <div class="studio-banner-text">
              <strong>STUDIO VORTEX</strong>
              <span>Scroll up/down to explore • Click screen to inspect ↕</span>
            </div>
          </div>
        </div>

        <!-- Service Detail Modal (Torn Paper Card - media_1789629752335.png) -->
        <div class="studio-inspect-card" id="studioInspectCard">
          <button class="studio-card-close-btn" id="studioCardCloseBtn">✕</button>
          <div class="studio-card-badge" id="studioBadge">SERVICE</div>
          <h2 class="studio-card-title" id="studioTitle">სერვისის სახელი</h2>
          <div class="studio-card-tagline" id="studioTagline">სერვისის მოკლე აღწერა</div>
          
          <div class="studio-card-divider"></div>

          <p class="studio-card-desc" id="studioDesc">სრული ინფორმაცია სერვისის შესახებ...</p>

          <div class="studio-card-deliverables">
            <h4>რას მიიღებთ:</h4>
            <ul id="studioDeliverablesList"></ul>
          </div>

          <div class="studio-card-actions">
            <button class="btn-studio-order" id="studioOrderBtn">
              <span>OPEN LINK</span>
              <span style="font-size: 1.2rem;">↗</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.renderMonitors();
    this.setupInteractions();
    this.startRenderLoop();
  }

  renderMonitors() {
    const track = document.getElementById('studioCylinderTrack');
    if (!track) return;

    // We repeat services to create an infinite vertical loop
    const repeatCount = 5;
    const items = [];
    for (let r = 0; r < repeatCount; r++) {
      this.services.forEach((s, idx) => {
        items.push({
          ...s,
          globalIndex: r * this.services.length + idx
        });
      });
    }

    this.totalItems = items.length;
    this.itemHeight = 145;
    this.cylinderRadius = 260;

    track.innerHTML = items.map((item, i) => {
      // Cylindrical coordinates: angles spiral down
      const angle = (i * 60) * (Math.PI / 180);
      const x = Math.sin(angle) * this.cylinderRadius;
      const z = Math.cos(angle) * this.cylinderRadius - this.cylinderRadius;
      const rotY = (angle * 180 / Math.PI);

      // Monitor types: CRT, TV, flat monitor, mobile phone
      const monitorTypes = ['crt', 'flat', 'tv', 'phone', 'flat'];
      const mType = monitorTypes[i % monitorTypes.length];

      return `
        <button type="button" aria-label="${item.title}" class="studio-monitor-item type-${mType}"
             data-index="${i}" 
             data-service-id="${item.id}"
             style="transform: translate3d(${x}px, ${i * this.itemHeight}px, ${z}px) rotateY(${rotY}deg);">
          
          <div class="monitor-casing">
            <div class="monitor-face monitor-front"></div>
            <div class="monitor-face monitor-back"></div>
            <div class="monitor-face monitor-side monitor-side-left"></div>
            <div class="monitor-face monitor-side monitor-side-right"></div>
            <div class="monitor-bezel">
              <div class="monitor-screen-content">
                <div class="monitor-number">${item.number}</div>
                <div class="monitor-title">${item.title}</div>
                <div class="monitor-pill">${item.badge}</div>
              </div>
            </div>
          </div>
        </button>
      `;
    }).join('');

    this.trackEl = track;
  }

  setupInteractions() {
    const scene = document.getElementById('studioExpScene');
    if (!scene) return;

    // Wheel Scroll (Infinite vertical spiral)
    scene.addEventListener('wheel', (e) => {
      if (this.isZoomed) return;
      e.preventDefault();
      this.targetScrollY += e.deltaY * 0.9;
      soundEngine.playPencilScratch();
    }, { passive: false });

    // Drag / Touch vertical scroll
    scene.addEventListener('mousedown', (e) => {
      if (this.isZoomed || e.target.closest('#studioInspectCard')) return;
      this.isDragging = true;
      this.startY = e.clientY;
      this.startScrollY = this.targetScrollY;
      scene.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || this.isZoomed) return;
      const delta = e.clientY - this.startY;
      this.targetScrollY = this.startScrollY - delta * 1.5;
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        scene.style.cursor = 'grab';
      }
    });

    // Touch support
    scene.addEventListener('touchstart', (e) => {
      if (this.isZoomed || e.target.closest('#studioInspectCard')) return;
      this.isDragging = true;
      this.startY = e.touches[0].clientY;
      this.startScrollY = this.targetScrollY;
    }, { passive: true });

    scene.addEventListener('touchmove', (e) => {
      if (!this.isDragging || this.isZoomed) return;
      const delta = e.touches[0].clientY - this.startY;
      this.targetScrollY = this.startScrollY - delta * 1.8;
    }, { passive: true });

    scene.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Click on monitor -> zoom inspect modal
    this.trackEl.addEventListener('click', (e) => {
      if (this.isZoomed) return;
      const monitorEl = e.target.closest('.studio-monitor-item');
      if (!monitorEl) return;
      if (Math.abs(this.targetScrollY - this.startScrollY) > 8 && e.detail !== 0) return;

      const serviceId = monitorEl.getAttribute('data-service-id');
      const service = this.services.find(s => s.id === serviceId);
      if (service) {
        this.zoomToService(service, monitorEl);
      }
    });
    document.getElementById('studioSpotlight').addEventListener('click', () => this.closeInspect());
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isZoomed) this.closeInspect();
    });

    // Close button on torn-paper inspect card
    const closeBtn = document.getElementById('studioCardCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeInspect();
      });
    }

    // Order button in inspect card -> trigger contact form
    const orderBtn = document.getElementById('studioOrderBtn');
    if (orderBtn) {
      orderBtn.addEventListener('click', () => {
        soundEngine.playClick();
        if (window.corridorInstance && this.activeService) {
          const serviceId = this.activeService.id;
          this.closeInspect();
          window.corridorInstance.teleportToRoom('contact');
          setTimeout(() => {
            if (window.selectServiceInQuote) window.selectServiceInQuote(serviceId);
          }, 850);
        }
      });
    }
  }

  zoomToService(service, monitorEl) {
    this.isZoomed = true;
    this.activeService = service;
    soundEngine.playDoorCreak();

    // Populate modal card (media_1789629752335.png)
    document.getElementById('studioBadge').textContent = service.badge || 'SERVICE';
    document.getElementById('studioTitle').textContent = service.title;
    document.getElementById('studioTagline').textContent = service.tagline || '2026 • Creative Production';
    document.getElementById('studioDesc').textContent = service.fullDesc || service.tagline;

    const delivList = document.getElementById('studioDeliverablesList');
    if (delivList) {
      delivList.innerHTML = (service.deliverables || []).map(d => `<li>✓ ${d}</li>`).join('');
    }

    // Spotlight backdrop & card reveal
    const spotlight = document.getElementById('studioSpotlight');
    const inspectCard = document.getElementById('studioInspectCard');
    const bottomBanner = document.getElementById('studioBottomBanner');

    if (spotlight) spotlight.classList.add('active');
    if (inspectCard) inspectCard.classList.add('active');
    if (bottomBanner) bottomBanner.style.opacity = '0';

    // Highlight clicked monitor
    monitorEl.classList.add('zoomed-target');
    const selected = document.getElementById('studioSelectedMonitor');
    selected.className = `studio-selected-monitor active ${Array.from(monitorEl.classList).find(name => name.startsWith('type-'))}`;
    selected.innerHTML = monitorEl.innerHTML;
  }

  closeInspect() {
    this.isZoomed = false;
    this.activeService = null;
    soundEngine.playPaperRustle();

    const spotlight = document.getElementById('studioSpotlight');
    const inspectCard = document.getElementById('studioInspectCard');
    const bottomBanner = document.getElementById('studioBottomBanner');

    if (spotlight) spotlight.classList.remove('active');
    if (inspectCard) inspectCard.classList.remove('active');
    if (bottomBanner) bottomBanner.style.opacity = '1';
    document.getElementById('studioSelectedMonitor')?.classList.remove('active');

    const allZoomed = document.querySelectorAll('.studio-monitor-item.zoomed-target');
    allZoomed.forEach(el => el.classList.remove('zoomed-target'));
  }

  startRenderLoop() {
    const loop = () => {
      if (!this.container.classList.contains('active')) {
        this.animationFrameId = requestAnimationFrame(loop);
        return;
      }
      // Smooth lerp scrolling
      this.scrollY += (this.targetScrollY - this.scrollY) * 0.1;

      // Wrap around for seamless infinite vertical scroll
      const loopHeight = this.services.length * this.itemHeight;
      if (this.scrollY > loopHeight * 2) {
        this.scrollY -= loopHeight;
        this.targetScrollY -= loopHeight;
      } else if (this.scrollY < loopHeight) {
        this.scrollY += loopHeight;
        this.targetScrollY += loopHeight;
      }

      if (this.trackEl) {
        this.trackEl.style.transform = `translate3d(0, ${-this.scrollY}px, 0) rotateY(${this.scrollY * 0.08}deg) scale(0.55)`;
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
