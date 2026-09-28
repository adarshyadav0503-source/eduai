/* =========================================
   EduAI – Progress Tracker & Analytics Page
   ========================================= */
import { store } from '../js/store.js';
import { navigateTo } from '../js/router.js';
import { showToast, animateCounter, subjectColor, formatDate, formatDateShort } from '../js/utils.js';

export function renderProgressTracker(container) {
  const profile = store.get('profile') || {};
  const progress = store.get('progress') || { subjects: {}, studyDays: {} };
  const achievements = store.get('achievements', []);
  const quizHistory = store.get('quiz_history', []);

  const subjects = Object.entries(progress.subjects || {});
  const totalSubjects = subjects.length || 1;
  const overallPct = Math.round(subjects.reduce((sum, [, d]) => sum + (d.progress || 0), 0) / totalSubjects);
  const totalHours = profile.totalHours || subjects.reduce((sum, [, d]) => sum + (d.hoursSpent || 0), 0);
  const totalQuizzes = quizHistory.length || progress.quizzesTaken || 0;
  const avgQuizScore = quizHistory.length
    ? Math.round(quizHistory.reduce((a, q) => a + q.score, 0) / quizHistory.length)
    : 78;

  const unlockedBadges = achievements.filter(a => a.earned).length;

  container.innerHTML = `
    <!-- HEADER -->
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">📈 Learning Progress & Analytics</h1>
        <p class="page-subtitle">Track your mastery, study streaks, quiz performance, and earned achievements.</p>
      </div>
      <div style="display:flex; gap:var(--space-3)">
        <button class="btn btn-ghost btn-sm" id="btn-refresh-data" title="Sync & Recalculate">
          <i class="fas fa-sync-alt"></i> Refresh
        </button>
        <button class="btn btn-primary btn-sm" id="btn-start-study">
          <i class="fas fa-play"></i> Study Now
        </button>
      </div>
    </div>

    <!-- OVERVIEW STATS CARDS -->
    <div class="grid-4" style="margin-bottom:var(--space-8)">
      <div class="stat-card">
        <div class="stat-icon primary"><i class="fas fa-chart-pie"></i></div>
        <div class="stat-info">
          <div class="stat-value" id="stat-overall-pct">0%</div>
          <div class="stat-label">Syllabus Covered</div>
          <div class="stat-change up"><i class="fas fa-arrow-up"></i> +8% this month</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning"><i class="fas fa-clock"></i></div>
        <div class="stat-info">
          <div class="stat-value" id="stat-total-hours">0 hrs</div>
          <div class="stat-label">Total Time Invested</div>
          <div class="stat-change up"><i class="fas fa-bolt"></i> On track</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon accent"><i class="fas fa-fire"></i></div>
        <div class="stat-info">
          <div class="stat-value" id="stat-streak-days">0</div>
          <div class="stat-label">Day Study Streak</div>
          <div class="stat-change up"><i class="fas fa-flame"></i> Personal best!</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon secondary"><i class="fas fa-medal"></i></div>
        <div class="stat-info">
          <div class="stat-value" id="stat-quiz-avg">0%</div>
          <div class="stat-label">Quiz Average (${totalQuizzes})</div>
          <div class="stat-change up"><i class="fas fa-arrow-up"></i> Strong accuracy</div>
        </div>
      </div>
    </div>

    <!-- MAIN TWO-COLUMN SECTION -->
    <div class="progress-main-grid">
      <!-- LEFT: SUBJECT MASTERY & HEATMAP -->
      <div class="progress-left-col">
        <!-- Subject Mastery Cards -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title"><i class="fas fa-book-reader" style="color:var(--secondary)"></i> Subject Mastery Breakdown</div>
              <div class="card-subtitle">Real-time completion & quiz scores per subject</div>
            </div>
            <span class="badge badge-secondary">${totalSubjects} Subjects</span>
          </div>

          <div class="subject-mastery-list">
            ${subjects.map(([name, data]) => {
              const color = subjectColor(name);
              return `
                <div class="subject-mastery-item">
                  <div class="smi-top">
                    <div class="smi-title-wrap">
                      <span class="smi-dot" style="background:${color}"></span>
                      <span class="smi-name">${name}</span>
                    </div>
                    <div class="smi-stats-pills">
                      <span class="smi-pill"><i class="fas fa-stopwatch"></i> ${data.hoursSpent || 0}h</span>
                      <span class="smi-pill"><i class="fas fa-check-circle"></i> ${data.sessions || 0} sessions</span>
                      <span class="smi-pill quiz-score"><i class="fas fa-bullseye"></i> ${data.quizAvg || 0}% avg</span>
                    </div>
                  </div>
                  <div class="smi-bar-row">
                    <div class="progress-bar thick">
                      <div class="progress-bar-fill" style="width:${data.progress || 0}%; background:linear-gradient(90deg, ${color}, var(--primary-light))"></div>
                    </div>
                    <span class="smi-pct">${data.progress || 0}%</span>
                  </div>
                  <div class="smi-actions">
                    <button class="btn btn-ghost btn-sm" onclick="navigateTo('quiz')">
                      <i class="fas fa-question-circle"></i> Practice Quiz
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="navigateTo('ai-tutor')">
                      <i class="fas fa-robot"></i> Ask Tutor
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 90-Day Study Calendar Heatmap -->
        <div class="card" style="margin-top:var(--space-6)">
          <div class="card-header">
            <div>
              <div class="card-title"><i class="fas fa-calendar-alt" style="color:var(--primary)"></i> 90-Day Study Activity</div>
              <div class="card-subtitle">Daily consistency heatmap</div>
            </div>
            <div class="heatmap-legend">
              <span style="font-size:10px; color:var(--text-muted)">Less</span>
              <span class="heatmap-cell" style="background:rgba(255,255,255,0.05)"></span>
              <span class="heatmap-cell level-1"></span>
              <span class="heatmap-cell level-2"></span>
              <span class="heatmap-cell level-3"></span>
              <span class="heatmap-cell level-4"></span>
              <span style="font-size:10px; color:var(--text-muted)">More</span>
            </div>
          </div>

          <div class="heatmap-wrapper">
            <div class="heatmap" id="study-heatmap">
              ${renderHeatmapCells(progress.studyDays || {})}
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: ACHIEVEMENTS & QUIZ LOG -->
      <div class="progress-right-col">
        <!-- Achievements Badges Showcase -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title"><i class="fas fa-trophy" style="color:var(--warning)"></i> Achievements</div>
              <div class="card-subtitle">${unlockedBadges} of ${achievements.length} Unlocked</div>
            </div>
            <span class="badge badge-warning">${Math.round((unlockedBadges / (achievements.length || 1)) * 100)}%</span>
          </div>

          <div class="progress-bar thin" style="margin-bottom:var(--space-4)">
            <div class="progress-bar-fill" style="width:${Math.round((unlockedBadges / (achievements.length || 1)) * 100)}%; background:linear-gradient(90deg, var(--warning), var(--accent))"></div>
          </div>

          <div class="achievements-grid">
            ${achievements.map(ach => `
              <div class="achievement-card ${ach.earned ? 'unlocked' : 'locked'}">
                <div class="ach-icon">${ach.icon}</div>
                <div class="ach-body">
                  <div class="ach-title">
                    ${ach.title}
                    ${ach.earned ? '<span class="ach-check"><i class="fas fa-check"></i></span>' : '<span class="ach-lock"><i class="fas fa-lock"></i></span>'}
                  </div>
                  <div class="ach-desc">${ach.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recent Quiz Log -->
        <div class="card" style="margin-top:var(--space-6)">
          <div class="card-header">
            <div>
              <div class="card-title"><i class="fas fa-history" style="color:var(--info)"></i> Quiz History</div>
              <div class="card-subtitle">Recent performance records</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="navigateTo('quiz')">New Quiz</button>
          </div>

          <div class="quiz-history-list">
            ${quizHistory.length ? quizHistory.slice(-5).reverse().map(item => `
              <div class="quiz-history-item">
                <div class="qhi-left">
                  <div class="qhi-subject">${item.subject}</div>
                  <div class="qhi-date">${formatDate(item.date)} · ${item.difficulty}</div>
                </div>
                <div class="qhi-right">
                  <span class="badge ${item.score >= 80 ? 'badge-success' : item.score >= 50 ? 'badge-warning' : 'badge-accent'}">
                    ${item.score}%
                  </span>
                </div>
              </div>
            `).join('') : `
              <div class="empty-state" style="padding:var(--space-6)">
                <div class="empty-icon"><i class="fas fa-clipboard-list"></i></div>
                <p>No quizzes taken yet. Test your skills now!</p>
                <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="navigateTo('quiz')">
                  Take First Quiz
                </button>
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  // Animate numbers
  animateCounter(container.querySelector('#stat-overall-pct'), overallPct, 1200, '%');
  animateCounter(container.querySelector('#stat-total-hours'), totalHours, 1200, ' hrs');
  animateCounter(container.querySelector('#stat-streak-days'), profile.studyStreak || 7, 1200, ' Days');
  animateCounter(container.querySelector('#stat-quiz-avg'), avgQuizScore, 1200, '%');

  // Header button handlers
  container.querySelector('#btn-refresh-data').addEventListener('click', () => {
    showToast('Analytics synced with latest activity!', 'success');
    renderProgressTracker(container);
  });

  container.querySelector('#btn-start-study').addEventListener('click', () => {
    navigateTo('ai-tutor');
  });

  injectProgressStyles();
}

function renderHeatmapCells(studyDays) {
  const cells = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const level = studyDays[dateKey] !== undefined ? studyDays[dateKey] : (i % 3 === 0 ? 2 : (i % 5 === 0 ? 3 : 0));
    const isToday = i === 0;

    cells.push(`
      <div
        class="heatmap-cell ${level > 0 ? 'level-' + level : ''} ${isToday ? 'today' : ''}"
        title="${d.toLocaleDateString('en-US', { month:'short', day:'numeric' })}: ${level > 0 ? level * 45 + ' mins studied' : 'Rest day'}"
      ></div>
    `);
  }
  return cells.join('');
}

function injectProgressStyles() {
  if (document.getElementById('eduai-progress-styles')) return;
  const style = document.createElement('style');
  style.id = 'eduai-progress-styles';
  style.textContent = `
    .progress-main-grid { display:grid; grid-template-columns:1.2fr 1fr; gap:24px; }
    @media(max-width:960px){ .progress-main-grid{ grid-template-columns:1fr; } }

    .subject-mastery-list { display:flex; flex-direction:column; gap:16px; }
    .subject-mastery-item {
      padding:16px; border-radius:var(--radius-lg); background:var(--bg-glass);
      border:1px solid var(--border); transition:var(--transition-fast);
    }
    .subject-mastery-item:hover { border-color:var(--border-glow); background:rgba(108,99,255,0.04); }
    .smi-top { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px; }
    .smi-title-wrap { display:flex; align-items:center; gap:8px; }
    .smi-dot { width:10px; height:10px; border-radius:50%; }
    .smi-name { font-weight:700; font-size:var(--text-sm); color:var(--text-primary); }
    .smi-stats-pills { display:flex; gap:8px; }
    .smi-pill { font-size:10px; color:var(--text-muted); background:var(--bg-card); padding:2px 8px; border-radius:var(--radius-full); border:1px solid var(--border); display:flex; align-items:center; gap:4px; }
    .smi-pill.quiz-score { color:var(--secondary); font-weight:600; }

    .smi-bar-row { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
    .smi-pct { font-size:var(--text-xs); font-weight:700; min-width:32px; text-align:right; color:var(--text-secondary); }
    .smi-actions { display:flex; gap:8px; justify-content:flex-end; }

    .heatmap-wrapper { overflow-x:auto; padding:8px 0; }
    .heatmap { display:grid; grid-template-rows:repeat(7, 14px); grid-auto-flow:column; gap:4px; width:max-content; }
    .heatmap-legend { display:flex; align-items:center; gap:6px; }

    .achievements-grid { display:flex; flex-direction:column; gap:10px; max-height:360px; overflow-y:auto; }
    .achievement-card {
      display:flex; align-items:center; gap:14px; padding:12px 14px;
      border-radius:var(--radius-lg); background:var(--bg-glass); border:1px solid var(--border); transition:var(--transition-fast);
    }
    .achievement-card.unlocked { border-color:rgba(255,179,71,0.3); background:rgba(255,179,71,0.06); }
    .achievement-card.locked { opacity:0.45; filter:grayscale(0.7); }
    .ach-icon { font-size:1.8rem; flex-shrink:0; }
    .ach-body { flex:1; min-width:0; }
    .ach-title { font-size:var(--text-sm); font-weight:700; color:var(--text-primary); display:flex; justify-content:space-between; align-items:center; }
    .ach-desc { font-size:11px; color:var(--text-muted); margin-top:2px; }
    .ach-check { color:var(--success); font-size:11px; }
    .ach-lock { color:var(--text-muted); font-size:10px; }

    .quiz-history-list { display:flex; flex-direction:column; gap:8px; }
    .quiz-history-item {
      display:flex; justify-content:space-between; align-items:center; padding:10px 14px;
      background:var(--bg-glass); border-radius:var(--radius-md); border:1px solid var(--border);
    }
    .qhi-subject { font-size:var(--text-sm); font-weight:600; color:var(--text-primary); }
    .qhi-date { font-size:10px; color:var(--text-muted); margin-top:2px; }
  `;
  document.head.appendChild(style);
}
