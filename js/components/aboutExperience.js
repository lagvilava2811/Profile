// js/components/aboutExperience.js
// About Room (Room 01: Sky Walker)
// Matches itomdev.com/about (media_1789629766643.png)
// Features: Avatar on cloud (awatarnachmurce.webp), floating paper airplane,
// parallax clouds, tech hot-air balloons, and infinite story flight scroll.

import { soundEngine } from './audioManager.js';

export class AboutExperience {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.isDragging = false;
    this.startY = 0;
    this.startScrollY = 0;
    this.animationFrameId = null;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.container.innerHTML = `
      <div class="about-exp-scene" id="aboutExpScene">
        <!-- Floating background clouds -->
        <div class="about-clouds-layer">
          <div class="sky-cloud sc-1"></div>
          <div class="sky-cloud sc-2"></div>
          <div class="sky-cloud sc-3"></div>
          <div class="sky-cloud sc-4"></div>
          <div class="sky-cloud sc-5"></div>
        </div>

        <!-- Central Hero: Avatar on Cloud (media_1789629766643.png) -->
        <div class="about-hero-center" id="aboutHeroCenter">
          <h1 class="about-hero-name">VAKO LAGVILAVA</h1>
          <div class="about-hero-subtitle">[DIGITAL AGENCY]</div>

          <div class="about-cloud-avatar-box">
            <img src="assets/textures/about/awatarnachmurce.webp" alt="Vako Lagvilava" class="avatar-cloud-img">
            <div class="about-quote-tag">"Crafting digital experiences that push creative boundaries"</div>
          </div>

          <!-- Paper Airplane Flying Below Cloud -->
          <div class="about-paper-plane-box" id="aboutPaperPlane">
            <svg class="paper-stealth-plane-svg" viewBox="0 0 200 80" width="180">
              <polygon points="100,10 190,65 100,45 10,65" fill="#f4f4f5" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round" />
              <polygon points="100,10 100,45 190,65" fill="#e4e4e7" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round" />
              <line x1="100" y1="10" x2="100" y2="45" stroke="#18181b" stroke-width="2.5" />
            </svg>
          </div>
        </div>

        <!-- Story Milestones Track (Infinite Flight Scroll) -->
        <div class="about-flight-track" id="aboutFlightTrack">
          <!-- Story milestones cards rendered here -->
        </div>

        <!-- Floating Hot-Air Balloons -->
        <div class="about-balloons-layer" id="aboutBalloonsLayer">
          <!-- Tech balloons -->
        </div>

        <!-- Bottom Explorer Banner (media_1789629766643.png) -->
        <div class="about-bottom-banner">
          <div class="about-banner-box">
            <span class="about-banner-checkbox">▢</span>
            <div class="about-banner-text">
              <strong>SKY WALKER</strong>
              <span>Scroll to fly through our story ↕</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderStoryAndBalloons();
    this.setupInteractions();
    this.startRenderLoop();
  }

  renderStoryAndBalloons() {
    const track = document.getElementById('aboutFlightTrack');
    const balloonsLayer = document.getElementById('aboutBalloonsLayer');
    if (!track) return;

    const milestones = [
      {
        year: "2020",
        title: "სააგენტოს დასაბამი",
        desc: "დავიწყეთ როგორც შემოქმედებითი სტუდია, რომელიც აერთიანებს ხელოვნებას, თანამედროვე ვებ-ტექნოლოგიებსა და უმაღლესი დონის შესრულებას.",
        badge: "ORIGIN"
      },
      {
        year: "2022",
        title: "3D & ინტერაქტიული გამოცდილება",
        desc: "დავნერგეთ Three.js, WebGL და GSAP ანიმაციები, რითაც ვებ-სივრცე გადავაქციეთ ინტერაქტიულ, ხელშესახებ ციფრულ თავგადასავლად.",
        badge: "INNOVATION"
      },
      {
        year: "2024",
        title: "AI Lab & ავტონომიური აგენტები",
        desc: "გავხსენით AI ავტომატიზაციის ლაბორატორია. ბიზნეს-პროცესების ავტომატიზაცია უახლესი LLM და Vision ტექნოლოგიებით.",
        badge: "AI LAB"
      },
      {
        year: "2026",
        title: "100% No-Template სტანდარტი",
        desc: "ყოველი პროექტი იქმნება ნულიდან, ინდივიდუალური ესთეტიკითა და პრემიუმ არქიტექტურით itomdev.com-ის დონეზე.",
        badge: "PERFECTION"
      }
    ];

    // Repeat milestones for infinite scroll
    const repeat = 4;
    let html = '';
    for (let r = 0; r < repeat; r++) {
      milestones.forEach((m, i) => {
        const side = (i % 2 === 0) ? 'left' : 'right';
        html += `
          <div class="story-milestone-card side-${side}">
            <div class="milestone-badge">${m.badge} • ${m.year}</div>
            <h3 class="milestone-title">${m.title}</h3>
            <p class="milestone-desc">${m.desc}</p>
          </div>
        `;
      });
    }
    track.innerHTML = html;

    // Hot Air Balloons
    if (balloonsLayer) {
      const balloonImages = [
        'reactduzybalon.webp',
        'threejsduzybalon.webp',
        'GSAPduzybalon.webp',
        'nextjssrednibalon.webp'
      ];

      let bHtml = '';
      for (let i = 0; i < 8; i++) {
        const imgName = balloonImages[i % balloonImages.length];
        const left = 10 + (i * 22) % 80;
        const top = 300 + i * 450;
        bHtml += `
          <div class="sky-balloon-item" style="left: ${left}%; top: ${top}px;">
            <img src="assets/textures/about/${imgName}" alt="tech balloon" class="sky-balloon-img" onerror="this.style.display='none'">
          </div>
        `;
      }
      balloonsLayer.innerHTML = bHtml;
    }
  }

  setupInteractions() {
    const scene = document.getElementById('aboutExpScene');
    if (!scene) return;

    // Wheel Scroll
    scene.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.targetScrollY += e.deltaY * 0.85;
      soundEngine.playPencilScratch();
    }, { passive: false });

    // Drag / Touch scroll
    scene.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startY = e.clientY;
      this.startScrollY = this.targetScrollY;
      scene.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const delta = e.clientY - this.startY;
      this.targetScrollY = this.startScrollY - delta * 1.5;
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        scene.style.cursor = 'grab';
      }
    });

    scene.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      this.startY = e.touches[0].clientY;
      this.startScrollY = this.targetScrollY;
    }, { passive: true });

    scene.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      const delta = e.touches[0].clientY - this.startY;
      this.targetScrollY = this.startScrollY - delta * 1.8;
    }, { passive: true });

    scene.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  startRenderLoop() {
    const plane = document.getElementById('aboutPaperPlane');
    const track = document.getElementById('aboutFlightTrack');
    const hero = document.getElementById('aboutHeroCenter');
    const balloons = document.getElementById('aboutBalloonsLayer');

    const loop = (now) => {
      this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;

      // Infinite loop wrap
      const loopHeight = 2400;
      if (this.scrollY > loopHeight) {
        this.scrollY -= loopHeight;
        this.targetScrollY -= loopHeight;
      } else if (this.scrollY < 0) {
        this.scrollY += loopHeight;
        this.targetScrollY += loopHeight;
      }

      // Airplane bobbing & banking
      if (plane) {
        const bankAngle = Math.sin(now * 0.002) * 5;
        const bobY = Math.sin(now * 0.003) * 8;
        plane.style.transform = `translateY(${bobY}px) rotate(${bankAngle}deg)`;
      }

      // Parallax layers
      if (track) {
        track.style.transform = `translateY(${-this.scrollY}px)`;
      }
      if (balloons) {
        balloons.style.transform = `translateY(${-this.scrollY * 0.6}px)`;
      }
      if (hero) {
        // Fade hero out slightly as we scroll deeper into flight
        const fade = Math.max(0, 1 - this.scrollY * 0.002);
        hero.style.opacity = Math.max(0.2, fade);
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
