/* =========================================
   EduAI – SPA Hash Router
   ========================================= */

import { renderHome }            from '../pages/home.js';
import { renderDashboard }       from '../pages/dashboard.js';
import { renderAiTutor }         from '../pages/ai-tutor.js';
import { renderStudyPlanner }    from '../pages/study-planner.js';
import { renderNotesSummarizer } from '../pages/notes-summarizer.js';
import { renderQuizGenerator }   from '../pages/quiz-generator.js';
import { renderProgressTracker } from '../pages/progress-tracker.js';

const routes = {
  '':                 renderHome,
  'home':             renderHome,
  'dashboard':        renderDashboard,
  'ai-tutor':         renderAiTutor,
  'study-planner':    renderStudyPlanner,
  'notes-summarizer': renderNotesSummarizer,
  'quiz':             renderQuizGenerator,
  'progress':         renderProgressTracker,
};

export function initRouter() {
  window.addEventListener('hashchange', navigate);
  navigate(); // render current route on load
}

export function navigate() {
  const hash = location.hash.replace('#/', '').split('?')[0] || '';
  const handler = routes[hash] || renderHome;
  const container = document.getElementById('page-container');
  if (!container) return;

  // Animate out
  container.style.opacity = '0';
  container.style.transform = 'translateY(12px)';
  container.style.transition = 'opacity 0.15s ease, transform 0.15s ease';

  setTimeout(() => {
    container.innerHTML = '';
    handler(container);
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
    updateActiveNav(hash || 'home');
    closeMobileSidebar();
  }, 150);
}

function updateActiveNav(hash) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.route === hash || (hash === '' && item.dataset.route === 'home')) {
      item.classList.add('active');
    }
  });

  // Update page title in topbar
  const titles = {
    '': 'Home', home: 'Home', dashboard: 'Dashboard', 'ai-tutor': 'AI Tutor',
    'study-planner': 'Study Planner', 'notes-summarizer': 'Notes Summarizer',
    quiz: 'Quiz Generator', progress: 'Progress Tracker'
  };
  const titleEl = document.getElementById('topbar-page-title');
  if (titleEl) titleEl.textContent = titles[hash] || 'EduAI';
}

function closeMobileSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('show');
}

export function navigateTo(route) {
  location.hash = '/' + route;
}
