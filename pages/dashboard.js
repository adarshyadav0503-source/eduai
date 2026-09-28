/* =========================================
   EduAI – Student Dashboard Page
   ========================================= */
import { store } from '../js/store.js';
import { navigateTo } from '../js/router.js';
import { getGreeting, formatDate, animateCounter, showToast, subjectColor, getInitials, formatDuration } from '../js/utils.js';

export function renderDashboard(container) {
  const profile  = store.get('profile');
  const progress = store.get('progress');
  const tasks    = store.get('tasks', []);
  const plan     = store.get('study_plan', []);

  const todayPlan = plan.filter(p => p.date === new Date().toISOString().split('T')[0]);
  const completedTasks = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;
  const quizHistory = store.get('quiz_history', []);
  const avgScore = quizHistory.length ? Math.round(quizHistory.reduce((a, q) => a + q.score, 0) / quizHistory.length) : 0;

  const subjectList = Object.entries(progress.subjects);

  container.innerHTML = `
    <!-- WELCOME BANNER -->
    <div class="dashboard-welcome">
      <div class="welcome-left">
        <div class="welcome-avatar">${getInitials(profile.name)}</div>
        <div>
          <div class="welcome-greeting">${getGreeting()}, <span class="gradient-text">${profile.name.split(' ')[0]}!</span> 👋</div>
          <div class="welcome-date">${formatDate()} · ${profile.class} · ${profile.board}</div>
        </div>
      </div>
      <div class="welcome-right">
        <div class="streak-pill"><i class="fas fa-fire"></i> ${profile.studyStreak}-Day Streak</div>
      </div>
    </div>

    <!-- QUICK STATS -->
    <div class="grid-4" style="margin-bottom:var(--space-8)">
      <div class="stat-card">
        <div class="stat-icon primary"><i class="fas fa-fire"></i></div>
        <div class="stat-info">
          <div class="stat-value" id="sc-streak">0</div>
          <div class="stat-label">Study Streak</div>
          <div class="stat-change up"><i class="fas fa-arrow-up"></i> Active daily</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon secondary"><i class="fas fa-book-open"></i></div>
        <div class="stat-info">
          <div class="stat-value" id="sc-lessons">0</div>
          <div class="stat-label">Lessons Done</div>
          <div class="stat-change up"><i class="fas fa-arrow-up"></i> ${progress.completedLessons}/${progress.totalLessons}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon accent"><i class="fas fa-star"></i></div>
        <div class="stat-info">
          <div class="stat-value" id="sc-quiz">0</div>
          <div class="stat-label">Quiz Average</div>
          <div class="stat-change ${avgScore >= 70 ? 'up' : 'down'}">${avgScore >= 70 ? '↑' : '↓'} ${quizHistory.length} quizzes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning"><i class="fas fa-clock"></i></div>
        <div class="stat-info">
          <div class="stat-value" id="sc-hours">0</div>
          <div class="stat-label">Study Hours</div>
          <div class="stat-change up"><i class="fas fa-arrow-up"></i> This week</div>
        </div>
      </div>
    </div>

    <!-- MAIN GRID -->
    <div class="dash-main-grid">
      <!-- LEFT COLUMN -->
      <div class="dash-left">
        <!-- Today's Tasks -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title"><i class="fas fa-tasks" style="color:var(--primary)"></i> Today's Tasks</div>
              <div class="card-subtitle">${completedTasks}/${totalTasks} completed</div>
            </div>
            <div class="task-progress-ring">
              ${renderMiniRing(totalTasks ? Math.round(completedTasks/totalTasks*100) : 0)}
            </div>
          </div>
          <div class="tasks-list" id="tasksList">
            ${tasks.map(t => `
              <div class="task-item ${t.done ? 'done' : ''}" data-id="${t.id}">
                <div class="task-check ${t.done ? 'checked' : ''}" onclick="window.toggleTask('${t.id}')">
                  ${t.done ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-body">
                  <div class="task-text">${t.text}</div>
                  <div class="task-meta">
                    <span class="badge badge-ghost" style="font-size:10px">${t.subject}</span>
                    <span class="priority-badge priority-${t.priority}">${t.priority}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:16px" onclick="navigateTo('study-planner')">
            <i class="fas fa-plus"></i> Generate Study Plan
          </button>
        </div>

        <!-- Quick Actions -->
        <div class="card" style="margin-top:var(--space-6)">
          <div class="card-title" style="margin-bottom:16px"><i class="fas fa-bolt" style="color:var(--warning)"></i> Quick Actions</div>
          <div class="quick-actions-grid">
            ${[
              { icon:'fa-robot', label:'Ask AI Tutor', color:'var(--primary)', route:'ai-tutor' },
              { icon:'fa-question-circle', label:'Take Quiz', color:'var(--warning)', route:'quiz' },
              { icon:'fa-file-alt', label:'Summarize Notes', color:'var(--accent)', route:'notes-summarizer' },
              { icon:'fa-calendar-alt', label:'Study Planner', color:'var(--secondary)', route:'study-planner' },
              { icon:'fa-chart-bar', label:'My Progress', color:'var(--info)', route:'progress' },
              { icon:'fa-graduation-cap', label:'Recommended', color:'var(--success)', route:'ai-tutor' },
            ].map(a => `
              <button class="quick-action-btn" onclick="navigateTo('${a.route}')" style="--qa-color:${a.color}">
                <i class="fas ${a.icon}" style="color:${a.color}"></i>
                <span>${a.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="dash-right">
        <!-- Subjects Progress -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-book" style="color:var(--secondary)"></i> Subjects</div>
            <button class="btn btn-ghost btn-sm" onclick="navigateTo('progress')">View All</button>
          </div>
          ${subjectList.map(([name, data]) => `
            <div class="subject-row">
              <div class="subject-row-left">
                <div class="subject-dot" style="background:${subjectColor(name)}"></div>
                <span class="subject-row-name">${name}</span>
              </div>
              <div class="subject-row-bar">
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width:${data.progress}%;background:${subjectColor(name)}"></div>
                </div>
              </div>
              <div class="subject-row-pct">${data.progress}%</div>
            </div>
          `).join('')}
        </div>

        <!-- Today's Study Plan -->
        <div class="card" style="margin-top:var(--space-6)">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-calendar-day" style="color:var(--warning)"></i> Today's Plan</div>
            <button class="btn btn-ghost btn-sm" onclick="navigateTo('study-planner')">Edit</button>
          </div>
          ${todayPlan.length ? todayPlan.map(p => `
            <div class="plan-item ${p.completed ? 'plan-done' : ''}">
              <div class="plan-subject-dot" style="background:${subjectColor(p.subject)}"></div>
              <div class="plan-info">
                <div class="plan-subject">${p.subject}</div>
                <div class="plan-topic">${p.topic}</div>
              </div>
              <div class="plan-meta">
                <span class="badge badge-${p.priority === 'high' ? 'accent' : p.priority === 'medium' ? 'warning' : 'success'}">${p.priority}</span>
                <span class="plan-duration">${formatDuration(p.duration)}</span>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state" style="padding:32px 0">
              <div class="empty-icon">📅</div>
              <h3>No plan for today</h3>
              <p>Generate your personalized study plan</p>
              <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="navigateTo('study-planner')">Create Plan</button>
            </div>
          `}
        </div>

        <!-- Recommended Topics -->
        <div class="card" style="margin-top:var(--space-6)">
          <div class="card-title" style="margin-bottom:16px"><i class="fas fa-lightbulb" style="color:var(--warning)"></i> AI Recommendations</div>
          <div class="recommendations">
            ${[
              { subject: 'History', topic: 'World War II Timeline', reason: 'Low progress area', icon: '📚' },
              { subject: 'Mathematics', topic: 'Quadratic Equations', reason: 'Upcoming topic', icon: '📐' },
              { subject: 'Science', topic: 'Cell Structure', reason: 'Quiz weakness detected', icon: '🔬' },
            ].map(r => `
              <div class="rec-item" onclick="navigateTo('ai-tutor')">
                <div class="rec-icon">${r.icon}</div>
                <div class="rec-info">
                  <div class="rec-topic">${r.topic}</div>
                  <div class="rec-meta"><span class="badge badge-ghost">${r.subject}</span> · ${r.reason}</div>
                </div>
                <i class="fas fa-chevron-right" style="color:var(--text-muted)"></i>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  injectDashCSS();

  // Animate counters
  setTimeout(() => {
    animateCounter(document.getElementById('sc-streak'), profile.studyStreak, 1200, ' days');
    animateCounter(document.getElementById('sc-lessons'), progress.completedLessons, 1200);
    animateCounter(document.getElementById('sc-quiz'), avgScore || 78, 1200, '%');
    animateCounter(document.getElementById('sc-hours'), profile.totalHours, 1200, 'h');
  }, 100);

  // Task toggle
  window.toggleTask = (id) => {
    const tasks = store.get('tasks', []);
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    store.set('tasks', updated);
    renderDashboard(container);
    showToast('Task updated!', 'success');
  };
  window.navigateTo = navigateTo;
}

function renderMiniRing(pct) {
  const r = 22, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return `<svg width="54" height="54" style="transform:rotate(-90deg)">
    <circle cx="27" cy="27" r="${r}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="4"/>
    <circle cx="27" cy="27" r="${r}" fill="none" stroke="url(#dg)" stroke-width="4"
      stroke-dasharray="${dash} ${c}" stroke-linecap="round"/>
    <defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6C63FF"/><stop offset="100%" stop-color="#00D9C0"/>
    </linearGradient></defs>
  </svg>
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(90deg);font-size:11px;font-weight:700;color:var(--text-primary)">${pct}%</div>`;
}

function injectDashCSS() {
  if (document.getElementById('dash-css')) return;
  const s = document.createElement('style'); s.id = 'dash-css';
  s.textContent = `
    .dashboard-welcome { display:flex;align-items:center;justify-content:space-between;padding:28px 32px;background:linear-gradient(135deg,rgba(108,99,255,0.12),rgba(0,217,192,0.08));border:1px solid var(--border-glow);border-radius:var(--radius-xl);margin-bottom:32px; }
    .welcome-left { display:flex;align-items:center;gap:16px; }
    .welcome-avatar { width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:#fff; }
    .welcome-greeting { font-size:var(--text-2xl);font-weight:700;font-family:var(--font-heading); }
    .welcome-date { font-size:var(--text-sm);color:var(--text-muted);margin-top:4px; }
    .streak-pill { display:inline-flex;align-items:center;gap:8px;background:rgba(255,107,107,0.15);border:1px solid rgba(255,107,107,0.3);border-radius:var(--radius-full);padding:8px 20px;font-weight:700;color:var(--accent);font-size:var(--text-sm); }
    .streak-pill i { color:var(--accent); }

    .dash-main-grid { display:grid;grid-template-columns:1fr 1.1fr;gap:24px; }
    @media(max-width:900px){ .dash-main-grid{grid-template-columns:1fr} }

    .tasks-list { display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto; }
    .task-item { display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:var(--radius-md);background:var(--bg-glass);border:1px solid var(--border);transition:var(--transition-fast); }
    .task-item.done .task-text { text-decoration:line-through;opacity:0.5; }
    .task-check { width:20px;height:20px;border-radius:4px;border:2px solid var(--border);cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;transition:var(--transition-fast); }
    .task-check.checked { background:var(--primary);border-color:var(--primary);color:#fff; }
    .task-body { flex:1;min-width:0; }
    .task-text { font-size:var(--text-sm);font-weight:500;margin-bottom:6px; }
    .task-meta { display:flex;gap:8px;align-items:center; }
    .priority-badge { font-size:10px;font-weight:600;padding:2px 8px;border-radius:var(--radius-full); }
    .priority-high   .priority-badge, .priority-badge.priority-high   { background:rgba(255,107,107,0.15);color:var(--accent); }
    .priority-medium .priority-badge, .priority-badge.priority-medium { background:rgba(255,179,71,0.15);color:var(--warning); }
    .priority-low    .priority-badge, .priority-badge.priority-low    { background:rgba(76,175,130,0.15);color:var(--success); }

    .quick-actions-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:10px; }
    .quick-action-btn { display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 8px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-lg);cursor:pointer;transition:var(--transition-base);font-size:10px;font-weight:600;color:var(--text-secondary); }
    .quick-action-btn:hover { background:rgba(108,99,255,0.08);border-color:var(--border-active);color:var(--text-primary);transform:translateY(-2px); }
    .quick-action-btn i { font-size:1.3rem; }

    .subject-row { display:flex;align-items:center;gap:12px;margin-bottom:14px; }
    .subject-dot { width:10px;height:10px;border-radius:50%;flex-shrink:0; }
    .subject-row-name { font-size:var(--text-xs);font-weight:600;min-width:110px; }
    .subject-row-bar { flex:1; }
    .subject-row-pct { font-size:var(--text-xs);font-weight:700;min-width:32px;text-align:right;color:var(--text-secondary); }

    .plan-item { display:flex;align-items:center;gap:12px;padding:12px;border-radius:var(--radius-md);background:var(--bg-glass);border:1px solid var(--border);margin-bottom:8px;transition:var(--transition-fast); }
    .plan-item:hover { border-color:var(--border-glow); }
    .plan-item.plan-done { opacity:0.5; }
    .plan-subject-dot { width:10px;height:10px;border-radius:50%;flex-shrink:0; }
    .plan-info { flex:1;min-width:0; }
    .plan-subject { font-size:var(--text-xs);font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em; }
    .plan-topic { font-size:var(--text-sm);font-weight:600;margin-top:2px; }
    .plan-meta { display:flex;flex-direction:column;align-items:flex-end;gap:4px; }
    .plan-duration { font-size:10px;color:var(--text-muted);font-weight:600; }

    .task-progress-ring { position:relative;width:54px;height:54px;flex-shrink:0; }

    .recommendations { display:flex;flex-direction:column;gap:10px; }
    .rec-item { display:flex;align-items:center;gap:12px;padding:12px;border-radius:var(--radius-md);background:var(--bg-glass);border:1px solid var(--border);cursor:pointer;transition:var(--transition-fast); }
    .rec-item:hover { border-color:var(--border-glow);background:rgba(108,99,255,0.05); }
    .rec-icon { font-size:1.5rem;flex-shrink:0; }
    .rec-info { flex:1;min-width:0; }
    .rec-topic { font-size:var(--text-sm);font-weight:600;margin-bottom:4px; }
    .rec-meta { font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:6px; }
  `;
  document.head.appendChild(s);
}
