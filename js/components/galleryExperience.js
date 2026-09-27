// js/components/galleryExperience.js
// Gallery Room (Room 03: The Gallery)
// Matches itomdev.com/gallery (media_1789629700506.png & media_1789629700577.png)
// Features: Balcony railing, wooden floor, rooftop city skyline, clothesline with hanging projects,
// infinite horizontal scroll, and torn-paper inspection modal.

import { soundEngine } from './audioManager.js';

export class GalleryExperience {
  constructor(containerId, projectsData) {
    this.container = document.getElementById(containerId);
    this.projects = projectsData || [];
    this.scrollX = 0;
    this.targetScrollX = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startScrollX = 0;
    this.activeModalProject = null;
    this.animationFrameId = null;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.container.innerHTML = `
      <div class="gallery-exp-scene" id="galleryExpScene">
        <!-- Parallax Background Clouds & Sky -->
        <div class="gallery-sky">
          <div class="gallery-cloud cloud-1"></div>
          <div class="gallery-cloud cloud-2"></div>
        </div>

        <!-- Distant City Skyline & Rooftops -->
        <div class="gallery-city-bg" id="galleryCityBg"></div>
        <div class="gallery-rooftops-bg" id="galleryRooftopsBg"></div>

        <!-- Bird perched on rooftop -->
        <div class="gallery-bird"></div>

        <!-- Overhead Clothesline Wire -->
        <svg class="gallery-clothesline-svg" preserveAspectRatio="none" viewBox="0 0 1000 100">
          <path id="clotheslineWire" d="M 0,25 Q 500,55 1000,25" fill="none" stroke="#18181b" stroke-width="2.5" />
        </svg>

        <!-- Hanging Projects Track (Infinite Loop) -->
        <div class="gallery-track-container" id="galleryTrackContainer">
          <div class="gallery-track" id="galleryTrack">
            <!-- Project cards rendered here -->
          </div>
        </div>

        <!-- Foreground Balcony Railing & Parquet Floor -->
        <div class="gallery-balcony-floor"></div>
        <div class="gallery-balcony-railing"></div>

        <!-- Bottom Explorer Banner (media_1789629700506.png) -->
        <div class="gallery-bottom-banner">
          <div class="gallery-banner-box">
            <span class="gallery-banner-checkbox">▢</span>
            <div class="gallery-banner-text">
              <strong>ART CRITIC</strong>
              <span>Click project to inspect • Drag or scroll to explore ↔</span>
            </div>
          </div>
        </div>

        <!-- Project Detail Modal (Torn Paper Card - media_1789629700577.png) -->
        <div class="gallery-inspect-modal" id="galleryInspectModal">
          <div class="gallery-modal-backdrop" id="galleryModalBackdrop"></div>
          <div class="gallery-paper-card" id="galleryPaperCard">
            <button class="gallery-modal-close-btn" id="galleryModalCloseBtn">✕</button>
            <div class="gallery-card-badge" id="modalCategory">CASE STUDY</div>
            <h2 class="gallery-card-title" id="modalTitle">პროექტის სახელი</h2>
            <div class="gallery-card-date" id="modalYear">2026 • Client Case</div>

            <div class="gallery-card-preview" id="modalPreviewBox">
              <!-- Visual Mockup -->
            </div>

            <p class="gallery-card-desc" id="modalDesc">პროექტის აღწერა და შესრულებული სამუშაო...</p>

            <div class="gallery-card-deliverables" id="modalDeliverables">
              <!-- Deliverables list -->
            </div>

            <div class="gallery-card-metrics" id="modalMetrics">
              <!-- Result numbers -->
            </div>

            <div class="gallery-card-actions">
              <a href="#" class="btn-gallery-open" id="modalLiveLink" target="_blank">
                <span>OPEN PROJECT</span>
                <img src="assets/textures/gallery/openliveproject.webp" alt="open" class="btn-open-icon">
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    this.track = document.getElementById('galleryTrack');
    this.cityBg = document.getElementById('galleryCityBg');
    this.rooftopsBg = document.getElementById('galleryRooftopsBg');
    this.modal = document.getElementById('galleryInspectModal');
    this.cardWidth = 190;
    this.gap = 65;
    this.totalItemWidth = this.cardWidth + this.gap;

    this.renderHangingCards();
    this.setupEvents();
    this.startLoop();
  }

  renderHangingCards() {
    // Duplicate projects array to allow infinite seamless looping
    const displayList = [...this.projects, ...this.projects, ...this.projects];
    this.trackLength = this.projects.length * this.totalItemWidth;

    this.track.innerHTML = displayList.map((p, idx) => `
      <button type="button" aria-label="${p.title}" class="gallery-hanging-item" data-project-index="${idx % this.projects.length}">
        <!-- Clothespin Peg -->
        <div class="gallery-clothespin"></div>
        <!-- Sketched Hanging Frame -->
        <div class="gallery-frame-card">
          <div class="gallery-frame-header">
            <span class="gallery-frame-title">${p.title}</span>
          </div>
          <div class="gallery-frame-inner">
            <div class="gallery-thumb-container">
              <div class="gallery-thumb-badge">${p.categoryName || 'Web & 3D'}</div>
              <div class="gallery-thumb-art">
                <div class="gallery-sketch-mockup">
                  <div class="sketch-wireframe-lines">
                    <span class="sk-line sk-h1"></span>
                    <span class="sk-line sk-p"></span>
                    <span class="sk-line sk-btn"></span>
                  </div>
                  <div class="sketch-highlight">${p.metrics ? p.metrics[0].value : '100%'}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="gallery-frame-footer">
            <span class="gallery-frame-year">${p.year || '2026'}</span>
            <span class="gallery-frame-cta">INSPECT ↗</span>
          </div>
        </div>
      </button>
    `).join('');

    // Attach click listeners to each hanging card
    this.track.querySelectorAll('.gallery-hanging-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (this.dragDistance > 8 && e.detail !== 0) return;
        const idx = parseInt(el.getAttribute('data-project-index'), 10);
        this.openProjectModal(this.projects[idx]);
      });
    });
  }

  setupEvents() {
    const container = document.getElementById('galleryExpScene');
    if (!container) return;

    // Mouse wheel horizontal scroll
    container.addEventListener('wheel', (e) => {
      if (this.modal.classList.contains('active')) return;
      e.preventDefault();
      const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
      this.targetScrollX += delta * 1.5;
    }, { passive: false });

    // Drag to scroll
    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('#galleryInspectModal') && this.modal.classList.contains('active')) return;
      this.isDragging = true;
      this.dragDistance = 0;
      this.startX = e.clientX;
      this.startScrollX = this.targetScrollX;
      container.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.startX;
      this.dragDistance = Math.abs(dx);
      this.targetScrollX = this.startScrollX - dx * 1.6;
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        container.classList.remove('is-dragging');
      }
    });

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
      if (this.modal.classList.contains('active')) return;
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.dragDistance = 0;
        this.startX = e.touches[0].clientX;
        this.startScrollX = this.targetScrollX;
      }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.startX;
      this.dragDistance = Math.abs(dx);
      this.targetScrollX = this.startScrollX - dx * 1.8;
    }, { passive: true });

    container.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Modal Close buttons
    const closeBtn = document.getElementById('galleryModalCloseBtn');
    const backdrop = document.getElementById('galleryModalBackdrop');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeProjectModal());
    if (backdrop) backdrop.addEventListener('click', () => this.closeProjectModal());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
        this.closeProjectModal();
      }
    });
  }

  openProjectModal(project) {
    if (!project) return;
    this.activeModalProject = project;
    soundEngine.playPaperRustle();

    document.getElementById('modalCategory').textContent = project.categoryName || 'CASE STUDY';
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalYear').textContent = `${project.year || '2026'} • ${project.client || 'Client Project'}`;
    document.getElementById('modalDesc').textContent = project.summary || project.details?.challenge || '';

    // Deliverables
    const delivEl = document.getElementById('modalDeliverables');
    if (project.deliverables && project.deliverables.length) {
      delivEl.innerHTML = `
        <h5 style="font-family: var(--font-display); font-size: 1.05rem; margin: 12px 0 6px 0;">შესრულებული სამუშაო:</h5>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${project.deliverables.map(d => `<span class="deliverable-tag">✓ ${d}</span>`).join('')}
        </div>
      `;
    } else {
      delivEl.innerHTML = '';
    }

    // Metrics
    const metricsEl = document.getElementById('modalMetrics');
    if (project.metrics && project.metrics.length) {
      metricsEl.innerHTML = `
        <div class="gallery-metrics-row">
          ${project.metrics.map(m => `
            <div class="metric-pill">
              <span class="m-val">${m.value}</span>
              <span class="m-lbl">${m.label}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      metricsEl.innerHTML = '';
    }

    // Live link
    const linkBtn = document.getElementById('modalLiveLink');
    if (project.link && project.link !== '#') {
      linkBtn.href = project.link;
      linkBtn.style.display = 'inline-flex';
    } else {
      linkBtn.href = '#';
      linkBtn.style.display = 'none';
    }

    this.modal.classList.add('active');
  }

  closeProjectModal() {
    if (this.modal) {
      this.modal.classList.remove('active');
      soundEngine.playPencilScratch();
    }
  }

  startLoop() {
    const loop = () => {
      if (!this.container.classList.contains('active')) {
        this.animationFrameId = requestAnimationFrame(loop);
        return;
      }
      // Smooth lerp scrolling
      this.scrollX += (this.targetScrollX - this.scrollX) * 0.12;

      // Wrap around infinitely
      if (this.trackLength > 0) {
        if (this.scrollX < 0) {
          this.scrollX += this.trackLength;
          this.targetScrollX += this.trackLength;
        } else if (this.scrollX >= this.trackLength) {
          this.scrollX -= this.trackLength;
          this.targetScrollX -= this.trackLength;
        }
      }

      if (this.track) {
        this.track.style.transform = `translateX(${-this.scrollX}px)`;
      }

      // Parallax background shift
      if (this.rooftopsBg) {
        this.rooftopsBg.style.transform = `translateX(${-this.scrollX * 0.3}px)`;
      }
      if (this.cityBg) {
        this.cityBg.style.transform = `translateX(${-this.scrollX * 0.12}px)`;
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
