// js/components/contactExperience.js
// Contact Room (Room 04: The Seaside Pier)
// Matches itomdev.com/contact (media_1789629777879.png)
// Features: Seaside pier (molo.webp), animated ocean waves (faletopdown.webp),
// bobbing paper boat (statek.webp), lighthouse (latarnia.webp), and authentic torn-paper contact form.

import { soundEngine } from './audioManager.js';

export class ContactExperience {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.animationFrameId = null;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.container.innerHTML = `
      <div class="contact-exp-scene" id="contactExpScene">
        <!-- Ocean Waves Canvas / Animated Layer -->
        <div class="contact-ocean-layer">
          <div class="ocean-wave wave-1"></div>
          <div class="ocean-wave wave-2"></div>
        </div>

        <!-- Pier & Props (media_1789629777879.png) -->
        <div class="contact-pier-wood"></div>

        <!-- Bobbing Paper Boat -->
        <div class="contact-paper-boat" id="contactBoat">
          <img src="assets/textures/contact/statek.webp" alt="paper boat" class="contact-boat-img">
        </div>

        <!-- Distant Lighthouse -->
        <div class="contact-lighthouse">
          <img src="assets/textures/contact/latarnia.webp" alt="lighthouse" class="contact-lighthouse-img">
        </div>

        <!-- Wooden Barrel -->
        <div class="contact-barrel">
          <img src="assets/textures/contact/beczka.webp" alt="barrel" class="contact-barrel-img" onerror="this.style.display='none'">
        </div>

        <!-- Authentic Torn-Paper Contact Card (media_1789629777879.png) -->
        <div class="contact-paper-container">
          <div class="contact-paper-card">
            <div class="contact-card-badge">LET'S CONNECT</div>
            <h2 class="contact-card-title">დაიწყეთ თქვენი პროექტი</h2>
            <p class="contact-card-subtitle">გაგვიზიარეთ თქვენი იდეა და მიიღეთ დეტალური შეფასება 24 საათში.</p>

            <form class="contact-authentic-form" id="authenticContactForm">
              <div class="contact-form-row">
                <div class="contact-field-group">
                  <label>თქვენი სახელი / კომპანია</label>
                  <input type="text" id="pierName" class="contact-paper-input" placeholder="მაგ. გიორგი ბერიძე" required>
                </div>
                <div class="contact-field-group">
                  <label>ელექტრონული ფოსტა</label>
                  <input type="email" id="pierEmail" class="contact-paper-input" placeholder="name@company.ge" required>
                </div>
              </div>

              <div class="contact-field-group">
                <label>სასურველი მიმართულება</label>
                <div class="contact-service-tags" id="pierServiceTags">
                  <button type="button" class="service-chip active" data-val="web">Web & 3D Interactive</button>
                  <button type="button" class="service-chip" data-val="ai">AI აგენტები & ავტომატიზაცია</button>
                  <button type="button" class="service-chip" data-val="design">UI/UX & Branding</button>
                  <button type="button" class="service-chip" data-val="video">ვიდეო & Motion</button>
                </div>
              </div>

              <div class="contact-field-group">
                <label>პროექტის აღწერა / დეტალები</label>
                <textarea id="pierMessage" class="contact-paper-textarea" rows="4" placeholder="მოკლედ აღწერეთ პროექტის მიზანი, ვადები და მოლოდინები..." required></textarea>
              </div>

              <div class="contact-form-footer">
                <button type="submit" class="btn-contact-send" id="pierSendBtn">
                  <span>მოთხოვნის გაგზავნა</span>
                  <span style="font-size: 1.2rem;">⚡</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Bottom Explorer Banner -->
        <div class="contact-bottom-banner">
          <div class="contact-banner-box">
            <span class="contact-banner-checkbox">▢</span>
            <div class="contact-banner-text">
              <strong>SEASIDE PIER</strong>
              <span>Drop a message in our bottle • We respond promptly</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupInteractions();
    this.startRenderLoop();
  }

  setupInteractions() {
    // Service chips selection
    const chips = this.container.querySelectorAll('.service-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        soundEngine.playClick();
      });
    });

    // Form submission
    const form = document.getElementById('authenticContactForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        soundEngine.playSuccess();

        const toast = document.getElementById('formToast');
        if (toast) {
          toast.classList.add('active');
          setTimeout(() => toast.classList.remove('active'), 5000);
        }

        form.reset();
      });
    }
  }

  selectService(serviceId) {
    const chips = this.container.querySelectorAll('.service-chip');
    chips.forEach(chip => {
      if (chip.getAttribute('data-val') === serviceId) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  startRenderLoop() {
    const boat = document.getElementById('contactBoat');
    const loop = (now) => {
      if (boat) {
        // Boat bobbing on waves
        const bobY = Math.sin(now * 0.002) * 12;
        const tilt = Math.cos(now * 0.0025) * 6;
        boat.style.transform = `translateY(${bobY}px) rotate(${tilt}deg)`;
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
