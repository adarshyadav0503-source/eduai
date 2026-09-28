/* =========================================
   EduAI – Utility Functions
   ========================================= */

/** Format a date as "Sep 17, 2026" */
export function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
}

/** Format a date as "Mon, Sep 17" */
export function formatDateShort(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(date));
}

/** Format time as "8:30 PM" */
export function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(date));
}

/** Get time-based greeting */
export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
}

/** Generate a unique ID */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/** Debounce a function */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Clamp a number between min and max */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/** Animate a counter from 0 to target */
export function animateCounter(el, target, duration = 1500, suffix = '') {
  if (!el) return;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    el.textContent = Math.round(target * ease).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/** Show a toast notification */
export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const id = generateId();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.id = `toast-${id}`;
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.info} toast-icon"></i>
    <span class="toast-text">${message}</span>
    <i class="fas fa-times toast-close" onclick="document.getElementById('toast-${id}').remove()"></i>
  `;
  container.appendChild(toast);

  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(40px)'; toast.style.transition = '0.3s ease'; setTimeout(() => toast.remove(), 300); }, duration);
}

/** Escape HTML to prevent XSS */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Simple markdown-to-HTML converter */
export function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(108,99,255,0.15);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 style="margin:12px 0 6px;font-size:1.05em">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="margin:14px 0 8px;font-size:1.15em">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="margin:16px 0 8px;font-size:1.3em">$1</h1>')
    .replace(/^\- (.+)$/gm, '<li style="margin:4px 0;padding-left:8px">• $1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li style="margin:4px 0;padding-left:8px">$1. $2</li>')
    .replace(/\n\n/g, '</p><p style="margin:8px 0">')
    .replace(/\n/g, '<br>');
}

/** Observe element entering viewport and trigger animation */
export function observeAndAnimate(selector, animClass = 'animate-in') {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add(animClass); observer.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
}

/** Get the user's initials from name */
export function getInitials(name = 'Student') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

/** Get subject color variable */
export function subjectColor(subject) {
  const map = { Math: 'subject-math', Mathematics: 'subject-math', Science: 'subject-science', Physics: 'subject-physics', Chemistry: 'subject-chemistry', English: 'subject-english', History: 'subject-history', 'Computer Science': 'subject-cs', CS: 'subject-cs', Geography: 'subject-geo', Biology: 'subject-science' };
  return `var(--${map[subject] || 'primary'})`;
}

/** Format minutes as "2h 30m" */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60 ? (minutes % 60) + 'm' : ''}`.trim();
}

/** Get day name */
export function getDayName(offset = 0) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

/** Add days to a date */
export function addDays(date, days) {
  const d = new Date(date); d.setDate(d.getDate() + days); return d;
}

/** Days between two dates */
export function daysBetween(a, b) {
  return Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));
}
