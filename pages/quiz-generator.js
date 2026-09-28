/* =========================================
   EduAI – Quiz Generator Page
   ========================================= */
import { store } from '../js/store.js';
import { QUIZ_BANK } from '../js/ai-engine.js';
import { navigateTo } from '../js/router.js';
import { showToast, animateCounter, subjectColor, formatDate } from '../js/utils.js';

export function renderQuizGenerator(container) {
  let state = {
    screen: 'config', // 'config' | 'playing' | 'result'
    subject: 'Mathematics',
    difficulty: 'easy',
    questionCount: 5,
    questions: [],
    currentIndex: 0,
    userAnswers: [], // { selectedIndex, isCorrect, question }
    timerSeconds: 0,
    timerInterval: null,
    selectedOption: null,
    hasAnswered: false,
  };

  function render() {
    if (state.screen === 'config') {
      renderConfig();
    } else if (state.screen === 'playing') {
      renderPlaying();
    } else if (state.screen === 'result') {
      renderResult();
    }
  }

  /* ----------------------------------------------------
     SCREEN 1: Configuration
     ---------------------------------------------------- */
  function renderConfig() {
    const quizHistory = store.get('quiz_history', []);
    const availableSubjects = Object.keys(QUIZ_BANK);

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-info">
          <h1 class="page-title">🎯 AI Quiz Generator</h1>
          <p class="page-subtitle">Test your knowledge with adaptive MCQs and instant explanations.</p>
        </div>
        ${quizHistory.length ? `
          <button class="btn btn-ghost btn-sm" id="btn-view-history">
            <i class="fas fa-history"></i> Past Quizzes (${quizHistory.length})
          </button>
        ` : ''}
      </div>

      <div class="quiz-config-grid">
        <!-- Main Quiz Setup Card -->
        <div class="card quiz-setup-card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-sliders-h" style="color:var(--primary)"></i> Configure Your Quiz</div>
            <span class="badge badge-primary">Instant Grading</span>
          </div>

          <!-- Subject Selection -->
          <div class="form-group">
            <label class="form-label">1. Choose Subject</label>
            <div class="subject-picker-grid">
              ${availableSubjects.map(sub => `
                <button type="button" class="subject-pick-card ${sub === state.subject ? 'selected' : ''}" data-subject="${sub}">
                  <div class="sub-pick-icon" style="color:${subjectColor(sub)}">
                    <i class="fas ${getSubjectIcon(sub)}"></i>
                  </div>
                  <div class="sub-pick-name">${sub}</div>
                  <div class="sub-pick-count">${(QUIZ_BANK[sub]?.easy?.length || 0) + (QUIZ_BANK[sub]?.medium?.length || 0) + (QUIZ_BANK[sub]?.hard?.length || 0)} Questions</div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Difficulty Selection -->
          <div class="form-group" style="margin-top:var(--space-6)">
            <label class="form-label">2. Select Difficulty</label>
            <div class="diff-picker-grid">
              ${[
                { key: 'easy', label: 'Easy', desc: 'Foundational concepts', icon: 'fa-feather', color: 'var(--success)' },
                { key: 'medium', label: 'Medium', desc: 'Application & reasoning', icon: 'fa-layer-group', color: 'var(--warning)' },
                { key: 'hard', label: 'Hard', desc: 'Advanced problem solving', icon: 'fa-fire', color: 'var(--accent)' }
              ].map(d => `
                <button type="button" class="diff-pick-card ${d.key === state.difficulty ? 'selected' : ''}" data-diff="${d.key}">
                  <i class="fas ${d.icon}" style="color:${d.color}"></i>
                  <div>
                    <div class="diff-name">${d.label}</div>
                    <div class="diff-desc">${d.desc}</div>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Question Count -->
          <div class="form-group" style="margin-top:var(--space-6)">
            <label class="form-label">3. Number of Questions</label>
            <div class="count-picker-group">
              ${[3, 5, 8, 10].map(count => `
                <button type="button" class="count-pill ${count === state.questionCount ? 'selected' : ''}" data-count="${count}">
                  ${count} Questions
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Action -->
          <div style="margin-top:var(--space-8); display:flex; gap:var(--space-4); align-items:center;">
            <button class="btn btn-primary btn-xl" id="btn-start-quiz" style="flex:1">
              <i class="fas fa-play"></i> Start Quiz
            </button>
            <button class="btn btn-ghost btn-xl" id="btn-ask-tutor" title="Study with AI Tutor instead">
              <i class="fas fa-robot"></i> Ask Tutor
            </button>
          </div>
        </div>

        <!-- Right Side: Insights & Quick Tips -->
        <div class="quiz-sidebar-col">
          <div class="card card-glass">
            <div class="card-title" style="margin-bottom:var(--space-4)">
              <i class="fas fa-lightbulb" style="color:var(--warning)"></i> How Quizzes Help
            </div>
            <ul class="quiz-tip-list">
              <li><i class="fas fa-check-circle" style="color:var(--success)"></i> <strong>Active Recall:</strong> Testing yourself is 2x more effective than passive reading.</li>
              <li><i class="fas fa-check-circle" style="color:var(--success)"></i> <strong>Instant Explanations:</strong> Learn the reasoning behind every question immediately.</li>
              <li><i class="fas fa-check-circle" style="color:var(--success)"></i> <strong>Progress Tracking:</strong> Scores automatically sync with your subject mastery and streak.</li>
            </ul>
          </div>

          ${quizHistory.length ? `
            <div class="card" style="margin-top:var(--space-6)">
              <div class="card-header" style="margin-bottom:var(--space-3)">
                <div class="card-title"><i class="fas fa-award" style="color:var(--accent)"></i> Recent Attempts</div>
              </div>
              <div class="recent-quiz-list">
                ${quizHistory.slice(-4).reverse().map(q => `
                  <div class="recent-quiz-item">
                    <div>
                      <div style="font-weight:600;font-size:var(--text-sm)">${q.subject}</div>
                      <div style="font-size:10px;color:var(--text-muted)">${formatDate(q.date)} · ${q.difficulty}</div>
                    </div>
                    <div class="badge ${q.score >= 80 ? 'badge-success' : q.score >= 50 ? 'badge-warning' : 'badge-accent'}">
                      ${q.score}%
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Bind Subject Picker
    container.querySelectorAll('.subject-pick-card').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.subject-pick-card').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.subject = btn.dataset.subject;
      });
    });

    // Bind Difficulty Picker
    container.querySelectorAll('.diff-pick-card').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.diff-pick-card').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.difficulty = btn.dataset.diff;
      });
    });

    // Bind Count Picker
    container.querySelectorAll('.count-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.count-pill').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.questionCount = parseInt(btn.dataset.count, 10);
      });
    });

    // Start Quiz
    container.querySelector('#btn-start-quiz').addEventListener('click', startQuiz);

    // Ask Tutor
    container.querySelector('#btn-ask-tutor')?.addEventListener('click', () => {
      navigateTo('ai-tutor');
    });

    // Past quizzes scroll/alert
    container.querySelector('#btn-view-history')?.addEventListener('click', () => {
      navigateTo('progress');
    });
  }

  function startQuiz() {
    const bank = QUIZ_BANK[state.subject] || QUIZ_BANK['Mathematics'];
    let pool = bank[state.difficulty] || bank['easy'] || [];
    
    // If difficulty pool is smaller than requested, fallback to mixing from other levels
    if (pool.length < state.questionCount) {
      const allLevels = [...(bank.easy || []), ...(bank.medium || []), ...(bank.hard || [])];
      pool = allLevels;
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    state.questions = shuffled.slice(0, Math.min(state.questionCount, shuffled.length));

    if (!state.questions.length) {
      showToast('No questions found for this configuration. Try another subject!', 'warning');
      return;
    }

    state.currentIndex = 0;
    state.userAnswers = [];
    state.timerSeconds = 0;
    state.selectedOption = null;
    state.hasAnswered = false;
    state.screen = 'playing';

    // Start timer
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      state.timerSeconds++;
      const timerEl = document.getElementById('quiz-timer');
      if (timerEl) {
        const m = Math.floor(state.timerSeconds / 60);
        const s = state.timerSeconds % 60;
        timerEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    }, 1000);

    render();
  }

  /* ----------------------------------------------------
     SCREEN 2: Taking Quiz
     ---------------------------------------------------- */
  function renderPlaying() {
    const q = state.questions[state.currentIndex];
    const total = state.questions.length;
    const progressPct = Math.round(((state.currentIndex) / total) * 100);
    const m = Math.floor(state.timerSeconds / 60);
    const s = state.timerSeconds % 60;
    const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    container.innerHTML = `
      <div class="quiz-playing-layout">
        <!-- Quiz Header Bar -->
        <div class="quiz-topbar-card">
          <div class="quiz-topbar-left">
            <button class="btn btn-ghost btn-sm" id="btn-quit-quiz">
              <i class="fas fa-times"></i> Quit
            </button>
            <div class="badge badge-primary">
              <i class="fas ${getSubjectIcon(state.subject)}"></i> ${state.subject}
            </div>
            <div class="badge badge-ghost" style="text-transform:capitalize">
              ${state.difficulty}
            </div>
          </div>
          <div class="quiz-topbar-right">
            <div class="quiz-timer-pill">
              <i class="fas fa-clock"></i> <span id="quiz-timer">${timeFormatted}</span>
            </div>
            <div class="quiz-count-badge">
              Question <strong>${state.currentIndex + 1}</strong> of ${total}
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-bar thick" style="margin:var(--space-4) 0 var(--space-6)">
          <div class="progress-bar-fill" style="width:${progressPct}%; transition:width 0.3s ease"></div>
        </div>

        <!-- Question Card -->
        <div class="card quiz-question-card">
          <div class="question-header">
            <span class="question-number">Q${state.currentIndex + 1}</span>
            <h2 class="question-text">${q.q}</h2>
          </div>

          <!-- Options Grid -->
          <div class="quiz-options-grid" id="quiz-options-container">
            ${q.opts.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`;
              return `
                <div class="quiz-option" data-index="${idx}">
                  <span class="option-letter">${letter}</span>
                  <span class="option-text">${opt}</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Explanation Box (reveals after answering) -->
          <div class="quiz-explanation-box" id="quiz-explanation" style="display:none">
            <div class="exp-title"><i class="fas fa-info-circle"></i> Explanation</div>
            <div class="exp-text">${q.exp || 'Good job!'}</div>
          </div>

          <!-- Bottom Actions -->
          <div class="quiz-bottom-actions">
            <div id="answer-status-msg" style="font-weight:600; font-size:var(--text-sm)"></div>
            <button class="btn btn-primary btn-lg" id="btn-next-question" disabled>
              ${state.currentIndex + 1 === total ? 'View Results <i class="fas fa-trophy"></i>' : 'Next Question <i class="fas fa-arrow-right"></i>'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Quit quiz handler
    container.querySelector('#btn-quit-quiz').addEventListener('click', () => {
      if (confirm('Are you sure you want to quit this quiz? Your progress will be lost.')) {
        if (state.timerInterval) clearInterval(state.timerInterval);
        state.screen = 'config';
        render();
      }
    });

    // Options click handler
    const optionCards = container.querySelectorAll('.quiz-option');
    const nextBtn = container.querySelector('#btn-next-question');
    const expBox = container.querySelector('#quiz-explanation');
    const statusMsg = container.querySelector('#answer-status-msg');

    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        if (state.hasAnswered) return; // Prevent changing after selection
        state.hasAnswered = true;
        const selectedIdx = parseInt(card.dataset.index, 10);
        state.selectedOption = selectedIdx;
        const isCorrect = selectedIdx === q.ans;

        state.userAnswers.push({
          question: q.q,
          opts: q.opts,
          selected: selectedIdx,
          correct: q.ans,
          isCorrect,
          exp: q.exp
        });

        // Highlight options
        optionCards.forEach((c, idx) => {
          if (idx === q.ans) {
            c.classList.add('correct');
          } else if (idx === selectedIdx && !isCorrect) {
            c.classList.add('wrong');
          }
        });

        // Show explanation
        expBox.style.display = 'block';
        expBox.style.animation = 'fadeIn 0.3s ease';

        if (isCorrect) {
          statusMsg.innerHTML = '<span style="color:var(--success)"><i class="fas fa-check-circle"></i> Correct answer! +10 pts</span>';
        } else {
          statusMsg.innerHTML = '<span style="color:var(--accent)"><i class="fas fa-times-circle"></i> Incorrect! Check the explanation below.</span>';
        }

        nextBtn.removeAttribute('disabled');
      });
    });

    // Next question click handler
    nextBtn.addEventListener('click', () => {
      if (!state.hasAnswered) return;
      if (state.currentIndex + 1 < total) {
        state.currentIndex++;
        state.hasAnswered = false;
        state.selectedOption = null;
        renderPlaying();
      } else {
        finishQuiz();
      }
    });
  }

  function finishQuiz() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.screen = 'result';

    const total = state.questions.length;
    const correctCount = state.userAnswers.filter(a => a.isCorrect).length;
    const scorePct = Math.round((correctCount / total) * 100);

    // Save to store quiz history
    const quizRecord = {
      id: 'quiz_' + Date.now(),
      date: new Date().toISOString(),
      subject: state.subject,
      difficulty: state.difficulty,
      total,
      correct: correctCount,
      score: scorePct,
      timeSpent: state.timerSeconds
    };

    const history = store.get('quiz_history', []);
    history.push(quizRecord);
    store.set('quiz_history', history);

    // Update store progress
    const progress = store.get('progress');
    if (progress) {
      progress.quizzesTaken = (progress.quizzesTaken || 0) + 1;
      if (progress.subjects && progress.subjects[state.subject]) {
        const subData = progress.subjects[state.subject];
        subData.quizAvg = Math.round((subData.quizAvg * 0.7) + (scorePct * 0.3));
        subData.progress = Math.min(100, (subData.progress || 50) + 3);
      }
      store.set('progress', progress);
    }

    // Check for achievements
    const achievements = store.get('achievements', []);
    let unlockedAny = false;

    achievements.forEach(ach => {
      if (ach.id === 'a2' && scorePct >= 90 && !ach.earned) {
        ach.earned = true;
        unlockedAny = true;
        showToast('🏆 Achievement Unlocked: Quiz Master!', 'success');
      }
      if (ach.id === 'a5' && scorePct === 100 && !ach.earned) {
        ach.earned = true;
        unlockedAny = true;
        showToast('⭐ Achievement Unlocked: Perfect Score!', 'success');
      }
    });

    if (unlockedAny) {
      store.set('achievements', achievements);
    }

    render();
  }

  /* ----------------------------------------------------
     SCREEN 3: Results & Review
     ---------------------------------------------------- */
  function renderResult() {
    const total = state.questions.length;
    const correctCount = state.userAnswers.filter(a => a.isCorrect).length;
    const scorePct = Math.round((correctCount / total) * 100);
    const m = Math.floor(state.timerSeconds / 60);
    const s = state.timerSeconds % 60;
    const timeFormatted = `${m}m ${s}s`;

    let gradeText = 'Keep Practicing!';
    let gradeColor = 'var(--accent)';
    let gradeIcon = 'fa-redo';

    if (scorePct === 100) {
      gradeText = 'Perfect Score! 🌟';
      gradeColor = 'var(--secondary)';
      gradeIcon = 'fa-crown';
    } else if (scorePct >= 80) {
      gradeText = 'Excellent Work! 🎉';
      gradeColor = 'var(--success)';
      gradeIcon = 'fa-award';
    } else if (scorePct >= 60) {
      gradeText = 'Good Effort! 👍';
      gradeColor = 'var(--warning)';
      gradeIcon = 'fa-thumbs-up';
    }

    container.innerHTML = `
      <div class="quiz-result-layout">
        <!-- Results Hero Card -->
        <div class="card quiz-result-card">
          <div class="result-badge-icon" style="background:${gradeColor}22; color:${gradeColor}">
            <i class="fas ${gradeIcon}"></i>
          </div>
          <h1 class="result-title">${gradeText}</h1>
          <p class="result-subtitle">You completed the <strong>${state.subject}</strong> (${state.difficulty}) quiz in <strong>${timeFormatted}</strong>.</p>

          <!-- Score Highlight -->
          <div class="result-score-circle">
            <div class="result-score-num" id="res-score-num">0%</div>
            <div class="result-score-label">${correctCount} of ${total} Correct</div>
          </div>

          <!-- Stats Grid -->
          <div class="result-stats-row">
            <div class="res-stat-col">
              <div class="res-stat-val" style="color:var(--success)">${correctCount}</div>
              <div class="res-stat-lbl">Correct</div>
            </div>
            <div class="res-stat-col">
              <div class="res-stat-val" style="color:var(--accent)">${total - correctCount}</div>
              <div class="res-stat-lbl">Incorrect</div>
            </div>
            <div class="res-stat-col">
              <div class="res-stat-val" style="color:var(--info)">${timeFormatted}</div>
              <div class="res-stat-lbl">Time Taken</div>
            </div>
            <div class="res-stat-col">
              <div class="res-stat-val" style="color:var(--primary-light)">+${correctCount * 10}</div>
              <div class="res-stat-lbl">XP Earned</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="result-actions">
            <button class="btn btn-primary btn-lg" id="btn-retake-quiz">
              <i class="fas fa-redo"></i> Retake Quiz
            </button>
            <button class="btn btn-secondary btn-lg" id="btn-tutor-clarify">
              <i class="fas fa-robot"></i> Review with AI Tutor
            </button>
            <button class="btn btn-ghost btn-lg" id="btn-dashboard">
              <i class="fas fa-th-large"></i> Dashboard
            </button>
          </div>
        </div>

        <!-- Detailed Question Review -->
        <div class="card" style="margin-top:var(--space-6)">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-list-check" style="color:var(--primary)"></i> Answer Review</div>
            <span class="badge badge-ghost">${state.userAnswers.length} Questions</span>
          </div>

          <div class="review-questions-list">
            ${state.userAnswers.map((ans, idx) => `
              <div class="review-item ${ans.isCorrect ? 'correct' : 'wrong'}">
                <div class="review-status-icon">
                  <i class="fas ${ans.isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                </div>
                <div class="review-body">
                  <div class="review-question"><strong>Q${idx + 1}.</strong> ${ans.question}</div>
                  <div class="review-answers-compare">
                    <div class="rev-ans-row">
                      <span class="rev-lbl">Your answer:</span>
                      <span class="${ans.isCorrect ? 'text-success' : 'text-danger'}">
                        ${ans.opts[ans.selected] !== undefined ? ans.opts[ans.selected] : 'Skipped'}
                      </span>
                    </div>
                    ${!ans.isCorrect ? `
                      <div class="rev-ans-row">
                        <span class="rev-lbl">Correct answer:</span>
                        <span class="text-success font-bold">${ans.opts[ans.correct]}</span>
                      </div>
                    ` : ''}
                  </div>
                  ${ans.exp ? `
                    <div class="review-exp">
                      <strong>Reason:</strong> ${ans.exp}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Animate score counter
    const scoreEl = container.querySelector('#res-score-num');
    animateCounter(scoreEl, scorePct, 1200, '%');

    // Retake button
    container.querySelector('#btn-retake-quiz').addEventListener('click', () => {
      startQuiz();
    });

    // Review with Tutor
    container.querySelector('#btn-tutor-clarify').addEventListener('click', () => {
      navigateTo('ai-tutor');
    });

    // Go to dashboard
    container.querySelector('#btn-dashboard').addEventListener('click', () => {
      navigateTo('dashboard');
    });
  }

  function getSubjectIcon(sub) {
    const map = {
      Mathematics: 'fa-square-root-alt',
      Science: 'fa-atom',
      English: 'fa-book',
      History: 'fa-landmark',
      'Computer Science': 'fa-laptop-code',
      Geography: 'fa-globe-americas',
      Physics: 'fa-bolt',
      Chemistry: 'fa-flask'
    };
    return map[sub] || 'fa-graduation-cap';
  }

  // Inject scoped styles
  injectQuizStyles();

  // Initial render
  render();
}

function injectQuizStyles() {
  if (document.getElementById('eduai-quiz-styles')) return;
  const style = document.createElement('style');
  style.id = 'eduai-quiz-styles';
  style.textContent = `
    .quiz-config-grid { display:grid; grid-template-columns:1fr 340px; gap:24px; }
    @media(max-width:960px){ .quiz-config-grid{ grid-template-columns:1fr; } }

    .subject-picker-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:12px; }
    .subject-pick-card {
      background:var(--bg-glass); border:1.5px solid var(--border); border-radius:var(--radius-lg);
      padding:16px 12px; text-align:center; cursor:pointer; transition:var(--transition-base);
    }
    .subject-pick-card:hover { border-color:var(--border-active); transform:translateY(-2px); background:rgba(108,99,255,0.06); }
    .subject-pick-card.selected { border-color:var(--primary); background:rgba(108,99,255,0.15); box-shadow:0 0 16px rgba(108,99,255,0.25); }
    .sub-pick-icon { font-size:1.8rem; margin-bottom:8px; }
    .sub-pick-name { font-size:var(--text-xs); font-weight:700; color:var(--text-primary); }
    .sub-pick-count { font-size:10px; color:var(--text-muted); margin-top:3px; }

    .diff-picker-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; }
    @media(max-width:600px){ .diff-picker-grid{ grid-template-columns:1fr; } }
    .diff-pick-card {
      background:var(--bg-glass); border:1.5px solid var(--border); border-radius:var(--radius-lg);
      padding:14px; text-align:left; display:flex; align-items:center; gap:12px; cursor:pointer; transition:var(--transition-base);
    }
    .diff-pick-card:hover { border-color:var(--border-active); }
    .diff-pick-card.selected { border-color:var(--primary); background:rgba(108,99,255,0.15); }
    .diff-name { font-size:var(--text-sm); font-weight:700; color:var(--text-primary); }
    .diff-desc { font-size:10px; color:var(--text-muted); }

    .count-picker-group { display:flex; gap:10px; flex-wrap:wrap; }
    .count-pill {
      padding:8px 18px; border-radius:var(--radius-full); background:var(--bg-glass);
      border:1px solid var(--border); font-size:var(--text-xs); font-weight:600; color:var(--text-secondary); cursor:pointer; transition:var(--transition-fast);
    }
    .count-pill:hover { color:var(--text-primary); border-color:var(--border-active); }
    .count-pill.selected { background:var(--primary); color:#fff; border-color:var(--primary); box-shadow:var(--shadow-primary); }

    .quiz-tip-list { list-style:none; padding:0; display:flex; flex-direction:column; gap:12px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6; }
    .quiz-tip-list li { display:flex; align-items:flex-start; gap:10px; }
    .quiz-tip-list li i { margin-top:2px; flex-shrink:0; }

    .recent-quiz-list { display:flex; flex-direction:column; gap:8px; }
    .recent-quiz-item { display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:var(--bg-glass); border-radius:var(--radius-md); border:1px solid var(--border); }

    /* PLAYING STATE */
    .quiz-playing-layout { max-width:800px; margin:0 auto; }
    .quiz-topbar-card {
      display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;
      padding:14px 20px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-xl);
    }
    .quiz-topbar-left, .quiz-topbar-right { display:flex; align-items:center; gap:10px; }
    .quiz-timer-pill {
      background:rgba(255,179,71,0.15); border:1px solid rgba(255,179,71,0.3); border-radius:var(--radius-full);
      padding:4px 14px; font-size:var(--text-xs); font-weight:700; color:var(--warning); display:flex; align-items:center; gap:6px;
    }
    .quiz-count-badge { font-size:var(--text-xs); color:var(--text-muted); }

    .quiz-question-card { padding:32px; }
    .question-header { display:flex; gap:14px; align-items:flex-start; margin-bottom:28px; }
    .question-number {
      background:linear-gradient(135deg, var(--primary), var(--secondary)); color:#fff;
      font-family:var(--font-heading); font-weight:800; font-size:var(--text-sm);
      padding:6px 12px; border-radius:var(--radius-md); flex-shrink:0;
    }
    .question-text { font-size:var(--text-xl); line-height:1.5; color:var(--text-primary); margin:0; }

    .quiz-options-grid { display:flex; flex-direction:column; gap:12px; margin-bottom:24px; }
    .quiz-option {
      padding:16px 20px; background:var(--bg-glass); border:1.5px solid var(--border);
      border-radius:var(--radius-lg); cursor:pointer; transition:var(--transition-base);
      display:flex; align-items:center; gap:16px; font-size:var(--text-base); font-weight:500;
    }
    .quiz-option:hover { border-color:var(--primary-light); background:rgba(108,99,255,0.06); }
    .quiz-option.correct { border-color:var(--success) !important; background:rgba(76,175,130,0.15) !important; color:var(--success); }
    .quiz-option.wrong   { border-color:var(--accent) !important; background:rgba(255,107,107,0.15) !important; color:var(--accent); }
    .option-letter {
      width:32px; height:32px; border-radius:50%; background:var(--bg-elevated);
      border:1px solid var(--border); display:flex; align-items:center; justify-content:center;
      font-weight:700; font-size:var(--text-xs); flex-shrink:0;
    }

    .quiz-explanation-box {
      background:rgba(108,99,255,0.08); border:1px solid rgba(108,99,255,0.25);
      border-radius:var(--radius-lg); padding:16px 20px; margin-bottom:24px;
    }
    .exp-title { font-weight:700; font-size:var(--text-sm); color:var(--primary-light); margin-bottom:4px; display:flex; align-items:center; gap:6px; }
    .exp-text { font-size:var(--text-sm); color:var(--text-secondary); line-height:1.6; }

    .quiz-bottom-actions { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; padding-top:16px; border-top:1px solid var(--border); }

    /* RESULT STATE */
    .quiz-result-layout { max-width:800px; margin:0 auto; }
    .quiz-result-card { text-align:center; padding:48px 32px; }
    .result-badge-icon {
      width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center;
      font-size:2.4rem; margin:0 auto 20px; box-shadow:0 8px 32px rgba(0,0,0,0.3);
    }
    .result-title { font-size:var(--text-3xl); margin-bottom:8px; }
    .result-subtitle { font-size:var(--text-base); color:var(--text-secondary); margin-bottom:32px; }

    .result-score-circle {
      width:150px; height:150px; border-radius:50%; margin:0 auto 32px;
      background:radial-gradient(circle at top, rgba(108,99,255,0.2), transparent 70%), var(--bg-elevated);
      border:2px solid var(--primary); display:flex; flex-direction:column; align-items:center; justify-content:center;
      box-shadow:var(--shadow-glow);
    }
    .result-score-num { font-size:var(--text-4xl); font-weight:900; font-family:var(--font-heading); color:#fff; }
    .result-score-label { font-size:10px; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.05em; }

    .result-stats-row {
      display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:36px;
      background:var(--bg-glass); border:1px solid var(--border); border-radius:var(--radius-xl); padding:20px;
    }
    @media(max-width:600px){ .result-stats-row{ grid-template-columns:repeat(2,1fr); } }
    .res-stat-val { font-size:var(--text-2xl); font-weight:800; font-family:var(--font-heading); }
    .res-stat-lbl { font-size:10px; color:var(--text-muted); font-weight:600; text-transform:uppercase; margin-top:2px; }

    .result-actions { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }

    .review-questions-list { display:flex; flex-direction:column; gap:14px; }
    .review-item {
      display:flex; gap:16px; align-items:flex-start; padding:16px; border-radius:var(--radius-lg);
      background:var(--bg-glass); border:1px solid var(--border);
    }
    .review-item.correct { border-left:4px solid var(--success); }
    .review-item.wrong   { border-left:4px solid var(--accent); }
    .review-status-icon { font-size:1.3rem; margin-top:2px; }
    .review-item.correct .review-status-icon { color:var(--success); }
    .review-item.wrong   .review-status-icon { color:var(--accent); }
    .review-body { flex:1; min-width:0; }
    .review-question { font-size:var(--text-sm); color:var(--text-primary); margin-bottom:8px; line-height:1.5; }
    .review-answers-compare { display:flex; flex-direction:column; gap:4px; font-size:var(--text-xs); margin-bottom:8px; }
    .rev-ans-row { display:flex; gap:8px; }
    .rev-lbl { color:var(--text-muted); min-width:90px; }
    .text-success { color:var(--success); }
    .text-danger  { color:var(--accent); }
    .font-bold { font-weight:700; }
    .review-exp { font-size:var(--text-xs); color:var(--text-muted); background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:var(--radius-md); border-left:2px solid var(--primary); }
  `;
  document.head.appendChild(style);
}
