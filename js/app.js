/* =========================================
   EduAI – Main Application Entry Point
   ========================================= */

import { initStore, store } from './store.js';
import { initRouter, navigateTo } from './router.js';
import { showToast, getInitials } from './utils.js';

// Expose navigation & toast globally for inline event handlers
window.navigateTo = navigateTo;
window.showToast = showToast;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize reactive data store
  initStore();

  // 2. Setup sidebar navigation clicks
  setupSidebarNavigation();

  // 3. Setup mobile menu drawer & overlay
  setupMobileDrawer();

  // 4. Setup topbar search and quick buttons
  setupTopbarInteractions();

  // 5. Sync profile info in sidebar
  syncProfileUI();

  // 6. Initialize the SPA hash router
  initRouter();
});

function setupSidebarNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = item.dataset.route;
      if (route !== undefined) {
        navigateTo(route);
      }
    });
  });

  // Sidebar logo click
  document.querySelector('.sidebar-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });

  // Sidebar user card click
  document.querySelector('.sidebar-user')?.addEventListener('click', () => {
    navigateTo('dashboard');
  });
}

function setupMobileDrawer() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  hamburger?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('show');
  });

  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('show');
  });
}

function setupTopbarInteractions() {
  // Global search input
  const searchInput = document.getElementById('globalSearchInput');
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) return;

      if (q.includes('quiz') || q.includes('test') || q.includes('mcq')) {
        navigateTo('quiz');
        showToast('Navigated to Quiz Generator', 'info');
      } else if (q.includes('note') || q.includes('summar')) {
        navigateTo('notes-summarizer');
        showToast('Navigated to Notes Summarizer', 'info');
      } else if (q.includes('plan') || q.includes('sched') || q.includes('calendar')) {
        navigateTo('study-planner');
        showToast('Navigated to Study Planner', 'info');
      } else if (q.includes('prog') || q.includes('stat') || q.includes('chart') || q.includes('score')) {
        navigateTo('progress');
        showToast('Navigated to Progress Tracker', 'info');
      } else if (q.includes('tutor') || q.includes('ask') || q.includes('ai') || q.includes('math') || q.includes('science')) {
        navigateTo('ai-tutor');
        showToast('Ask your question to AI Tutor!', 'info');
      } else {
        navigateTo('dashboard');
      }
      searchInput.value = '';
    }
  });

  // Notification button
  const notifBtn = document.getElementById('btn-notif');
  notifBtn?.addEventListener('click', () => {
    const tips = [
      '💡 Study Tip: 25 minutes of focused study + 5 min break (Pomodoro) maximizes memory retention!',
      '🔥 Great job! You are currently on a 7-day study streak. Keep the momentum going!',
      '🎯 Quiz Tip: Revise Chapter 5 Algebra today to boost your Math mastery score.',
      '📝 Note Tip: You can paste textbook excerpts into Notes Summarizer for key takeaways.'
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    showToast(randomTip, 'info', 5000);
  });

  // Streak button
  const streakBtn = document.getElementById('btn-streak');
  streakBtn?.addEventListener('click', () => {
    const profile = store.get('profile');
    showToast(`🔥 ${profile?.studyStreak || 7}-Day Streak active! Studied daily this week.`, 'warning');
  });
}

function syncProfileUI() {
  const profile = store.get('profile');
  if (!profile) return;

  const avatarEl = document.querySelector('.sidebar-avatar');
  const nameEl = document.querySelector('.sidebar-user-info .user-name');
  const roleEl = document.querySelector('.sidebar-user-info .user-role');

  if (avatarEl) avatarEl.textContent = getInitials(profile.name);
  if (nameEl) nameEl.textContent = profile.name;
  if (roleEl) roleEl.textContent = `${profile.class} · ${profile.board}`;
}
