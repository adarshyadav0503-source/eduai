/* =========================================
   EduAI – AI Study Planner Page
   ========================================= */
import { store } from '../js/store.js';
import { generateStudyPlan } from '../js/ai-engine.js';
import { showToast, formatDate, formatDateShort, subjectColor, formatDuration } from '../js/utils.js';

export function renderStudyPlanner(container) {
  const existingPlan = store.get('study_plan', []);
  let step = 1;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">📅 AI Study Planner</h1>
        <p class="page-subtitle">Generate a personalized study schedule based on your goals and weak areas.</p>
      </div>
      ${existingPlan.length ? `<button class="btn btn-danger btn-sm" id="clearPlan"><i class="fas fa-trash"></i> Clear Plan</button>` : ''}
    </div>

    <div class="planner-layout">
      <!-- GENERATOR FORM -->
      <div class="planner-form-panel" id="plannerFormPanel">
        <div class="step-indicator">
          ${[1,2,3].map(n => `<div class="step-dot ${n <= step ? 'active' : ''}" id="step-dot-${n}"><span>${n}</span></div>`).join('<div class="step-line"></div>')}
        </div>

        <!-- Step 1 -->
        <div class="planner-step" id="planStep1">
          <h3 class="planner-step-title"><i class="fas fa-user-graduate"></i> Your Profile</h3>
          <div class="form-group">
            <label class="form-label">Your Name</label>
            <input type="text" class="form-input" id="studentName" value="${store.get('profile')?.name || ''}" placeholder="Enter your name">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Class / Grade</label>
              <select class="form-select" id="studentClass">
                ${['Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','Undergraduate'].map(g => `<option>${g}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Board / System</label>
              <select class="form-select" id="studentBoard">
                ${['CBSE','ICSE','State Board','IB','Cambridge','Others'].map(b => `<option>${b}</option>`).join('')}
              </select>
            </div>
          </div>
          <button class="btn btn-primary" id="nextStep1">Next <i class="fas fa-arrow-right"></i></button>
        </div>

        <!-- Step 2 -->
        <div class="planner-step" id="planStep2" style="display:none">
          <h3 class="planner-step-title"><i class="fas fa-book"></i> Subjects & Exam</h3>
          <div class="form-group">
            <label class="form-label">Select Your Subjects</label>
            <div class="subject-check-grid" id="subjectCheckGrid">
              ${['Mathematics','Science','English','History','Computer Science','Geography','Physics','Chemistry'].map(s => `
                <label class="subject-check-item" data-subject="${s}">
                  <input type="checkbox" class="subject-checkbox" value="${s}" ${['Mathematics','Science','English'].includes(s) ? 'checked' : ''}>
                  <span>${s}</span>
                </label>
              `).join('')}
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Exam / Test Date</label>
            <input type="date" class="form-input" id="examDate" min="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="form-row">
            <button class="btn btn-ghost" id="backStep2"><i class="fas fa-arrow-left"></i> Back</button>
            <button class="btn btn-primary" id="nextStep2">Next <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="planner-step" id="planStep3" style="display:none">
          <h3 class="planner-step-title"><i class="fas fa-sliders-h"></i> Study Preferences</h3>
          <div class="form-group">
            <label class="form-label">Available Study Hours Per Day: <strong id="hoursDisplay">3h</strong></label>
            <input type="range" class="form-range" id="hoursPerDay" min="1" max="10" value="3" step="0.5">
          </div>
          <div class="form-group">
            <label class="form-label">Weak Subjects (select all that apply)</label>
            <div class="weak-strong-grid" id="weakGrid"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Strong Subjects (select all that apply)</label>
            <div class="weak-strong-grid" id="strongGrid"></div>
          </div>
          <div class="form-row">
            <button class="btn btn-ghost" id="backStep3"><i class="fas fa-arrow-left"></i> Back</button>
            <button class="btn btn-secondary" id="generatePlan">
              <i class="fas fa-magic"></i> Generate My Plan
            </button>
          </div>
        </div>
      </div>

      <!-- PLAN DISPLAY -->
      <div class="plan-display" id="planDisplay">
        ${existingPlan.length ? renderPlanView(existingPlan) : `
          <div class="empty-state">
            <div class="empty-icon">📅</div>
            <h3>No Study Plan Yet</h3>
            <p>Fill in the form to generate your personalized AI study plan</p>
          </div>
        `}
      </div>
    </div>
  `;

  injectPlannerCSS();
  setupPlannerListeners(container);

  function setupPlannerListeners(container) {
    // Set default exam date (30 days from now)
    const examInput = document.getElementById('examDate');
    if (examInput) {
      const d = new Date(); d.setDate(d.getDate() + 30);
      examInput.value = d.toISOString().split('T')[0];
    }

    // Hours slider
    document.getElementById('hoursPerDay')?.addEventListener('input', (e) => {
      document.getElementById('hoursDisplay').textContent = e.target.value + 'h';
    });

    // Step navigation
    document.getElementById('nextStep1')?.addEventListener('click', () => goToStep(2));
    document.getElementById('backStep2')?.addEventListener('click', () => goToStep(1));
    document.getElementById('nextStep2')?.addEventListener('click', () => {
      const checked = document.querySelectorAll('.subject-checkbox:checked');
      if (!checked.length) { showToast('Please select at least one subject', 'warning'); return; }
      goToStep(3);
      // Populate weak/strong grids
      const subjects = [...checked].map(c => c.value);
      populateWeakStrongGrids(subjects);
    });
    document.getElementById('backStep3')?.addEventListener('click', () => goToStep(2));
    document.getElementById('generatePlan')?.addEventListener('click', doGeneratePlan);

    document.getElementById('clearPlan')?.addEventListener('click', () => {
      store.set('study_plan', []);
      document.getElementById('planDisplay').innerHTML = `
        <div class="empty-state"><div class="empty-icon">📅</div><h3>Plan cleared</h3><p>Generate a new plan using the form</p></div>
      `;
      showToast('Study plan cleared', 'info');
    });
  }

  function goToStep(n) {
    step = n;
    [1,2,3].forEach(i => {
      document.getElementById(`planStep${i}`).style.display = i === n ? 'block' : 'none';
      document.getElementById(`step-dot-${i}`)?.classList.toggle('active', i <= n);
    });
  }

  function populateWeakStrongGrids(subjects) {
    const weakGrid   = document.getElementById('weakGrid');
    const strongGrid = document.getElementById('strongGrid');
    if (!weakGrid || !strongGrid) return;
    const html = subjects.map(s => `
      <label class="ws-chip" data-subject="${s}">
        <input type="checkbox" class="ws-check" value="${s}"> ${s}
      </label>
    `).join('');
    weakGrid.innerHTML = html;
    strongGrid.innerHTML = html.replace(/ws-check/g, 'ws-check2');
  }

  function doGeneratePlan() {
    const subjects    = [...document.querySelectorAll('.subject-checkbox:checked')].map(c => c.value);
    const examDate    = document.getElementById('examDate').value;
    const hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value);
    const weakSubjects   = [...document.querySelectorAll('.ws-check:checked')].map(c => c.value);
    const strongSubjects = [...document.querySelectorAll('.ws-check2:checked')].map(c => c.value);
    const name = document.getElementById('studentName').value || 'Student';

    if (!examDate) { showToast('Please set an exam date', 'warning'); return; }

    // Update profile
    store.update('profile', p => ({ ...p, name }));

    // Show loading
    const btn = document.getElementById('generatePlan');
    btn.innerHTML = '<span class="spinner"></span> Generating...';
    btn.disabled = true;

    setTimeout(() => {
      const plan = generateStudyPlan({ subjects, examDate, hoursPerDay, weakSubjects, strongSubjects });
      store.set('study_plan', plan);
      document.getElementById('planDisplay').innerHTML = renderPlanView(plan);
      bindPlanCheckboxes();
      btn.innerHTML = '<i class="fas fa-magic"></i> Generate My Plan';
      btn.disabled = false;
      showToast('Study plan generated! 🎉', 'success');
    }, 800);
  }
}

function renderPlanView(plan) {
  if (!plan.length) return '<div class="empty-state"><div class="empty-icon">📅</div><h3>No plan yet</h3></div>';

  // Group by date
  const grouped = {};
  plan.forEach(item => { if (!grouped[item.date]) grouped[item.date] = []; grouped[item.date].push(item); });

  const completedTotal = plan.filter(p => p.completed).length;
  const pct = Math.round(completedTotal / plan.length * 100);

  return `
    <div class="plan-header-bar">
      <div>
        <div class="plan-header-title">Your Study Plan</div>
        <div class="plan-header-sub">${plan.length} sessions · ${Object.keys(grouped).length} days</div>
      </div>
      <div style="text-align:right">
        <div class="plan-pct">${pct}% Complete</div>
        <div class="progress-bar" style="width:120px;margin-top:4px">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>
    </div>
    <div class="plan-list">
      ${Object.entries(grouped).map(([date, items]) => `
        <div class="plan-day-group">
          <div class="plan-day-header">${formatDateShort(date)} ${date === new Date().toISOString().split('T')[0] ? '<span class="badge badge-primary" style="font-size:10px">Today</span>' : ''}</div>
          ${items.map(item => `
            <div class="plan-row ${item.completed ? 'completed' : ''}" data-plan-id="${item.id}">
              <div class="plan-row-check ${item.completed ? 'checked' : ''}" onclick="window.togglePlan('${item.id}')">
                ${item.completed ? '<i class="fas fa-check"></i>' : ''}
              </div>
              <div class="plan-row-subject-dot" style="background:${subjectColor(item.subject)}"></div>
              <div class="plan-row-body">
                <div class="plan-row-subject">${item.subject}</div>
                <div class="plan-row-topic">${item.topic}</div>
              </div>
              <div class="plan-row-meta">
                <span class="badge badge-${item.priority === 'high' ? 'accent' : item.priority === 'medium' ? 'warning' : 'success'}">${item.priority}</span>
                <span class="plan-row-time"><i class="fas fa-clock"></i> ${formatDuration(item.duration)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

function bindPlanCheckboxes() {
  window.togglePlan = (id) => {
    store.update('study_plan', plan => plan.map(p => p.id === id ? { ...p, completed: !p.completed } : p));
    const plan = store.get('study_plan', []);
    document.getElementById('planDisplay').innerHTML = renderPlanView(plan);
    bindPlanCheckboxes();
    showToast('Progress saved!', 'success');
  };
}
// Call on initial load
setTimeout(() => bindPlanCheckboxes(), 100);

function injectPlannerCSS() {
  if (document.getElementById('planner-css')) return;
  const s = document.createElement('style'); s.id = 'planner-css';
  s.textContent = `
    .planner-layout { display:grid;grid-template-columns:360px 1fr;gap:24px;align-items:start; }
    @media(max-width:900px){ .planner-layout{grid-template-columns:1fr} }

    .planner-form-panel { background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-xl);padding:28px; }
    .planner-step-title { font-size:var(--text-lg);font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:10px; }

    .step-indicator { display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:28px; }
    .step-dot { width:32px;height:32px;border-radius:50%;background:var(--bg-elevated);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:var(--text-xs);color:var(--text-muted);transition:var(--transition-base); }
    .step-dot.active { background:var(--primary);border-color:var(--primary);color:#fff;box-shadow:var(--shadow-primary); }
    .step-line { flex:1;height:2px;background:var(--border);max-width:40px; }

    .subject-check-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px; }
    .subject-check-item { display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer;font-size:var(--text-xs);font-weight:600;transition:var(--transition-fast); }
    .subject-check-item:has(input:checked) { background:rgba(108,99,255,0.1);border-color:var(--primary);color:var(--primary-light); }
    .subject-check-item input { display:none; }

    .weak-strong-grid { display:flex;flex-wrap:wrap;gap:8px; }
    .ws-chip { display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-full);cursor:pointer;font-size:var(--text-xs);font-weight:600;transition:var(--transition-fast); }
    .ws-chip:has(input:checked) { background:rgba(255,107,107,0.15);border-color:var(--accent);color:var(--accent); }
    .ws-chip input { display:none; }

    .plan-display { background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-xl);padding:0;max-height:75vh;overflow-y:auto; }
    .plan-header-bar { display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--bg-elevated);z-index:2;border-radius:var(--radius-xl) var(--radius-xl) 0 0; }
    .plan-header-title { font-weight:700;font-size:var(--text-lg); }
    .plan-header-sub { font-size:var(--text-xs);color:var(--text-muted); }
    .plan-pct { font-size:var(--text-sm);font-weight:700;color:var(--primary); }

    .plan-list { padding:16px 24px; }
    .plan-day-group { margin-bottom:20px; }
    .plan-day-header { font-weight:700;font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:8px;display:flex;align-items:center;gap:8px; }
    .plan-row { display:flex;align-items:center;gap:12px;padding:12px;border-radius:var(--radius-lg);background:var(--bg-glass);border:1px solid var(--border);margin-bottom:6px;transition:var(--transition-fast); }
    .plan-row:hover { border-color:var(--border-glow); }
    .plan-row.completed { opacity:0.5; }
    .plan-row-check { width:20px;height:20px;border-radius:4px;border:2px solid var(--border);cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;transition:var(--transition-fast); }
    .plan-row-check.checked { background:var(--primary);border-color:var(--primary);color:#fff; }
    .plan-row-subject-dot { width:10px;height:10px;border-radius:50%;flex-shrink:0; }
    .plan-row-body { flex:1;min-width:0; }
    .plan-row-subject { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted); }
    .plan-row-topic { font-size:var(--text-sm);font-weight:600;margin-top:2px; }
    .plan-row-meta { display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0; }
    .plan-row-time { font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px; }
  `;
  document.head.appendChild(s);
  window.togglePlan = () => {};
}
