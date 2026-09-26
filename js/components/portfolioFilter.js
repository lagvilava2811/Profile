// js/components/portfolioFilter.js
// პორტფოლიოს პროექტების ფილტრაცია და Case Study მოდალური ფანჯარა

import { soundEngine } from './audioManager.js';

export function initPortfolioFilter(projects) {
  const filterBtns = document.querySelectorAll('.filter-pill');
  const grid = document.querySelector('.portfolio-grid');
  if (!grid || !projects) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundEngine.playClick();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');
      const cards = grid.querySelectorAll('.project-card');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Case Study Modal Listener
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) return;

    const projId = card.getAttribute('data-project-id');
    const project = projects.find(p => p.id === projId);
    if (project) {
      soundEngine.playPencilScratch();
      openCaseStudyModal(project);
    }
  });
}

function openCaseStudyModal(project) {
  let modal = document.getElementById('caseStudyModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'caseStudyModal';
    modal.className = 'map-modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="map-panel-card" style="max-width: 760px; max-height: 90vh; overflow-y: auto;">
      <div class="map-header">
        <div class="map-title-group">
          <span class="section-tag">${project.categoryName} • ${project.year}</span>
          <h3>${project.title}</h3>
          <p>კლიენტი: <strong>${project.client}</strong></p>
        </div>
        <button class="modal-close-btn" id="closeCaseStudyBtn" aria-label="დახურვა">✕</button>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 20px; padding: 10px 0;">
        <div style="background: #18181b; color: #fff; padding: 24px; border-radius: 8px; border: 2px solid var(--border-ink);">
          <div style="font-family: var(--font-hand); color: var(--accent); font-size: 1.15rem; margin-bottom: 4px;">პროექტის მიმოხილვა</div>
          <p style="font-size: 1.1rem; line-height: 1.6;">${project.summary}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
          ${project.metrics.map(m => `
            <div style="background: #ffffff; border: 2px solid var(--border-ink); border-radius: var(--radius-sketch-btn); padding: 14px; text-align: center; box-shadow: 3px 3px 0px var(--border-ink);">
              <div style="font-family: var(--font-display); font-size: 1.8rem; color: var(--text-ink);">${m.value}</div>
              <div style="font-family: var(--font-hand); font-size: 0.95rem; color: var(--text-muted);">${m.label}</div>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="background: #fef2f2; border: 1.5px dashed #ef4444; border-radius: 8px; padding: 16px;">
            <strong style="font-family: var(--font-display); color: #b91c1c; font-size: 1.25rem;">⚠️ გამოწვევა / პრობლემა:</strong>
            <p style="margin-top: 6px; color: #7f1d1d;">${project.challenge}</p>
          </div>

          <div style="background: #f0fdf4; border: 1.5px dashed #10b981; border-radius: 8px; padding: 16px;">
            <strong style="font-family: var(--font-display); color: #047857; font-size: 1.25rem;">💡 ჩვენი გადაწყვეტა:</strong>
            <p style="margin-top: 6px; color: #065f46;">${project.solution}</p>
          </div>

          <div style="background: #eff6ff; border: 1.5px dashed #3b82f6; border-radius: 8px; padding: 16px;">
            <strong style="font-family: var(--font-display); color: #1d4ed8; font-size: 1.25rem;">🏆 გაზომვადი შედეგი:</strong>
            <p style="margin-top: 6px; color: #1e40af;">${project.result}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px dashed #cbd5e1; padding-top: 18px; margin-top: 10px;">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${project.tech.map(t => `<span style="background: #f4f4f5; border: 1px solid #18181b; border-radius: 4px; padding: 2px 8px; font-size: 0.82rem;">${t}</span>`).join('')}
          </div>
          <a href="contact.html?service=${project.category}" class="btn btn-primary btn-sm">მსგავსი პროექტის დაწყება →</a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.getElementById('closeCaseStudyBtn').addEventListener('click', () => {
    modal.classList.remove('open');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}
