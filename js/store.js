/* =========================================
   EduAI – LocalStorage State Store
   ========================================= */

const PREFIX = 'eduai_';

export const store = {
  /** Read from LocalStorage */
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },

  /** Write to LocalStorage */
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch {}
  },

  /** Update (merge) an object in LocalStorage */
  update(key, fn, fallback = {}) {
    const current = this.get(key, fallback);
    const next = fn(current);
    this.set(key, next);
    return next;
  },

  /** Remove a key */
  remove(key) { localStorage.removeItem(PREFIX + key); },

  /** Clear all EduAI data */
  clear() {
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
  }
};

/* ---- Default user profile ---- */
const DEFAULT_PROFILE = {
  name: 'Alex Student',
  class: 'Grade 10',
  board: 'CBSE',
  avatar: 'AS',
  studyStreak: 7,
  totalHours: 42,
  joinDate: new Date().toISOString(),
};

/* ---- Initialise store if empty ---- */
export function initStore() {
  if (!store.get('profile')) {
    store.set('profile', DEFAULT_PROFILE);
  }
  if (!store.get('progress')) {
    store.set('progress', {
      subjects: {
        Mathematics: { progress: 72, sessions: 14, quizAvg: 78, hoursSpent: 18 },
        Science:     { progress: 58, sessions: 10, quizAvg: 65, hoursSpent: 12 },
        English:     { progress: 85, sessions: 18, quizAvg: 88, hoursSpent: 15 },
        History:     { progress: 40, sessions: 6,  quizAvg: 52, hoursSpent: 7  },
        'Computer Science': { progress: 91, sessions: 20, quizAvg: 94, hoursSpent: 22 },
        Geography:   { progress: 63, sessions: 9,  quizAvg: 70, hoursSpent: 10 },
      },
      totalLessons: 48,
      completedLessons: 31,
      quizzesTaken: 12,
      studyDays: buildStudyDays(),
    });
  }
  if (!store.get('chat_history')) { store.set('chat_history', []); }
  if (!store.get('study_plan'))   { store.set('study_plan', []); }
  if (!store.get('quiz_history')) { store.set('quiz_history', []); }
  if (!store.get('tasks')) {
    store.set('tasks', [
      { id: 't1', text: 'Complete Chapter 5 – Algebra', subject: 'Mathematics', done: false, priority: 'high' },
      { id: 't2', text: 'Read Newton\'s Laws notes', subject: 'Science', done: true, priority: 'medium' },
      { id: 't3', text: 'Practice Essay Writing', subject: 'English', done: false, priority: 'low' },
      { id: 't4', text: 'Revise World War II timeline', subject: 'History', done: false, priority: 'high' },
      { id: 't5', text: 'Solve 10 Python problems', subject: 'Computer Science', done: false, priority: 'medium' },
    ]);
  }
  if (!store.get('achievements')) {
    store.set('achievements', [
      { id: 'a1', title: 'First Steps', icon: '🎯', desc: 'Completed your first lesson', earned: true },
      { id: 'a2', title: 'Quiz Master', icon: '🏆', desc: 'Scored 90%+ on a quiz', earned: true },
      { id: 'a3', title: '7-Day Streak', icon: '🔥', desc: 'Studied 7 days in a row', earned: true },
      { id: 'a4', title: 'Note Taker', icon: '📝', desc: 'Used Notes Summarizer 5 times', earned: false },
      { id: 'a5', title: 'Perfect Score', icon: '⭐', desc: 'Got 100% on any quiz', earned: false },
      { id: 'a6', title: 'Speed Learner', icon: '⚡', desc: 'Completed 10 lessons in a day', earned: false },
    ]);
  }
}

function buildStudyDays() {
  const days = {};
  for (let i = 90; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const rand = Math.random();
    days[key] = rand > 0.4 ? (rand > 0.7 ? (rand > 0.85 ? 4 : 3) : 2) : (rand > 0.2 ? 1 : 0);
  }
  return days;
}
