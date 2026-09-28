/* =========================================
   EduAI – AI Tutor Chat Page
   ========================================= */
import { store } from '../js/store.js';
import { getAIResponse, getSuggestedQuestions } from '../js/ai-engine.js';
import { generateId, formatTime, renderMarkdown, showToast, escapeHtml } from '../js/utils.js';

export function renderAiTutor(container) {
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science', 'Geography', 'Physics', 'Chemistry'];
  const chatHistory = store.get('chat_history', []);
  let currentSubject = 'Mathematics';
  let currentMode = 'normal';
  let isTyping = false;

  container.innerHTML = `
    <div class="tutor-layout">
      <!-- SIDEBAR -->
      <aside class="tutor-sidebar">
        <div class="tutor-sidebar-section">
          <div class="tutor-sidebar-label">Subject</div>
          <select class="form-select" id="subjectPicker">
            ${subjects.map(s => `<option value="${s}" ${s === currentSubject ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>

        <div class="tutor-sidebar-section">
          <div class="tutor-sidebar-label">Response Style</div>
          <div class="mode-btns">
            <button class="mode-btn active" data-mode="normal" id="modeNormal">
              <i class="fas fa-comment"></i> Normal
            </button>
            <button class="mode-btn" data-mode="simple" id="modeSimple">
              <i class="fas fa-child"></i> Simple
            </button>
            <button class="mode-btn" data-mode="example" id="modeExample">
              <i class="fas fa-lightbulb"></i> Example
            </button>
            <button class="mode-btn" data-mode="quiz" id="modeQuiz">
              <i class="fas fa-question-circle"></i> Quiz Me
            </button>
          </div>
        </div>

        <div class="tutor-sidebar-section">
          <div class="tutor-sidebar-label">Suggested Questions</div>
          <div class="suggested-list" id="suggestedList"></div>
        </div>

        <div class="tutor-sidebar-section tutor-sidebar-footer-btns">
          <button class="btn btn-ghost btn-sm" id="clearChat" style="width:100%">
            <i class="fas fa-trash-alt"></i> Clear Chat
          </button>
        </div>
      </aside>

      <!-- CHAT AREA -->
      <div class="tutor-chat-area">
        <!-- Header -->
        <div class="tutor-chat-header">
          <div class="tutor-avatar"><i class="fas fa-robot"></i></div>
          <div>
            <div class="tutor-name">EduAI Tutor</div>
            <div class="tutor-status"><span class="status-dot"></span>Online · Demo Mode</div>
          </div>
          <div class="tutor-header-right">
            <span class="badge badge-primary"><i class="fas fa-bolt"></i> AI Powered</span>
          </div>
        </div>

        <!-- Messages -->
        <div class="chat-container" id="chatMessages">
          ${chatHistory.length === 0 ? renderWelcomeMessage() : chatHistory.map(renderMessage).join('')}
        </div>

        <!-- Typing indicator (hidden) -->
        <div class="typing-wrapper" id="typingWrapper" style="display:none">
          <div class="chat-avatar ai"><i class="fas fa-robot"></i></div>
          <div class="chat-bubble ai-typing">
            <div class="typing-indicator">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="chat-input-area">
          <div class="chat-input-wrapper">
            <textarea
              class="chat-input"
              id="chatInput"
              placeholder="Ask me anything about ${currentSubject}... 🎓"
              rows="1"
              maxlength="1000"
            ></textarea>
            <div class="chat-input-actions">
              <div class="char-count" id="charCount">0/1000</div>
              <button class="btn btn-primary btn-icon" id="sendBtn" title="Send (Enter)">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
          <div class="chat-tips">
            <span><kbd>Enter</kbd> to send</span>
            <span><kbd>Shift+Enter</kbd> for new line</span>
          </div>
        </div>
      </div>
    </div>
  `;

  injectTutorCSS();
  updateSuggested(currentSubject);

  const chatMessages = document.getElementById('chatMessages');
  const chatInput    = document.getElementById('chatInput');
  const sendBtn      = document.getElementById('sendBtn');
  const typingWrapper = document.getElementById('typingWrapper');

  // Subject change
  document.getElementById('subjectPicker').addEventListener('change', (e) => {
    currentSubject = e.target.value;
    updateSuggested(currentSubject);
    chatInput.placeholder = `Ask me anything about ${currentSubject}... 🎓`;
  });

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      if (currentMode === 'quiz') {
        chatInput.value = `Give me a quiz question on ${currentSubject}`;
      }
    });
  });

  // Auto-resize textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    document.getElementById('charCount').textContent = `${chatInput.value.length}/1000`;
  });

  // Send on Enter (not Shift+Enter)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  sendBtn.addEventListener('click', sendMessage);

  // Clear chat
  document.getElementById('clearChat').addEventListener('click', () => {
    store.set('chat_history', []);
    chatMessages.innerHTML = renderWelcomeMessage();
    showToast('Chat cleared', 'info');
  });

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isTyping) return;

    const userMsg = { id: generateId(), role: 'user', content: text, time: new Date().toISOString() };

    // Add user message
    appendMessage(userMsg, 'user');
    const history = store.get('chat_history', []);
    history.push(userMsg);
    store.set('chat_history', history);

    chatInput.value = '';
    chatInput.style.height = 'auto';
    document.getElementById('charCount').textContent = '0/1000';

    // Show typing
    isTyping = true;
    sendBtn.disabled = true;
    typingWrapper.style.display = 'flex';
    scrollToBottom();

    try {
      const response = await getAIResponse({
        message: text,
        subject: currentSubject,
        mode: currentMode,
        chatHistory: history
      });

      typingWrapper.style.display = 'none';
      const aiMsg = { id: generateId(), role: 'ai', content: response, time: new Date().toISOString() };
      appendMessage(aiMsg, 'ai');
      const updatedHistory = store.get('chat_history', []);
      updatedHistory.push(aiMsg);
      store.set('chat_history', updatedHistory);
    } catch {
      typingWrapper.style.display = 'none';
      showToast('Failed to get AI response', 'error');
    }

    isTyping = false;
    sendBtn.disabled = false;
    scrollToBottom();

    // Reset mode to normal after quiz
    if (currentMode === 'quiz') {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('modeNormal').classList.add('active');
      currentMode = 'normal';
    }
  }

  function appendMessage(msg, role) {
    const div = document.createElement('div');
    div.innerHTML = renderMessage(msg, role);
    chatMessages.appendChild(div.firstElementChild);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function updateSuggested(subject) {
    const list = document.getElementById('suggestedList');
    if (!list) return;
    const questions = getSuggestedQuestions(subject);
    list.innerHTML = questions.map(q => `
      <button class="suggested-q" onclick="document.getElementById('chatInput').value=\`${q.replace(/`/g, "'")}\`">
        <i class="fas fa-lightbulb"></i> ${q}
      </button>
    `).join('');
  }

  // Scroll to bottom initially
  setTimeout(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }, 100);
}

function renderMessage(msg, role) {
  const r = role || msg.role;
  const isAI = r === 'ai';
  return `
    <div class="chat-message ${isAI ? 'ai' : 'user'}">
      <div class="chat-avatar ${isAI ? 'ai' : 'user'}">
        ${isAI ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
      </div>
      <div class="chat-bubble">
        <div class="bubble-content">${isAI ? renderMarkdown(msg.content) : escapeHtml(msg.content)}</div>
        <div class="bubble-time">${formatTime(msg.time)}</div>
        ${isAI ? `<button class="copy-btn" onclick="navigator.clipboard.writeText(\`${msg.content.replace(/`/g,"'")}\`);window.__showToast&&window.__showToast('Copied!','success')" title="Copy"><i class="fas fa-copy"></i></button>` : ''}
      </div>
    </div>
  `;
}

function renderWelcomeMessage() {
  return `
    <div class="chat-message ai">
      <div class="chat-avatar ai"><i class="fas fa-robot"></i></div>
      <div class="chat-bubble">
        <div class="bubble-content">
          <strong>Hello! I'm your EduAI Tutor</strong> 🎓<br><br>
          I'm here to help you learn and understand any subject. Here's what I can do:<br><br>
          📖 <strong>Explain concepts</strong> clearly with step-by-step breakdowns<br>
          💡 <strong>Give examples</strong> to make things easier to understand<br>
          🎯 <strong>Quiz you</strong> to test your knowledge<br>
          📝 <strong>Simplify</strong> complex topics into easy language<br><br>
          <em>Select a subject and ask me anything. I'm ready to help!</em>
        </div>
        <div class="bubble-time">Now</div>
      </div>
    </div>
  `;
}

function injectTutorCSS() {
  if (document.getElementById('tutor-css')) return;
  const s = document.createElement('style'); s.id = 'tutor-css';
  s.textContent = `
    .tutor-layout { display:grid;grid-template-columns:280px 1fr;gap:0;height:calc(100vh - var(--topbar-height) - 64px);border:1px solid var(--border);border-radius:var(--radius-xl);overflow:hidden; }
    .tutor-sidebar { background:var(--bg-surface);border-right:1px solid var(--border);padding:20px;display:flex;flex-direction:column;gap:4px;overflow-y:auto; }
    .tutor-sidebar-label { font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;margin-top:4px; }
    .tutor-sidebar-section { margin-bottom:20px; }
    .tutor-sidebar-footer-btns { margin-top:auto; }

    .mode-btns { display:flex;flex-direction:column;gap:6px; }
    .mode-btn { display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:var(--radius-md);font-size:var(--text-xs);font-weight:600;color:var(--text-secondary);background:var(--bg-card);border:1px solid var(--border);cursor:pointer;transition:var(--transition-fast); }
    .mode-btn:hover { color:var(--text-primary);border-color:var(--border-active); }
    .mode-btn.active { background:var(--primary);color:#fff;border-color:var(--primary);box-shadow:var(--shadow-primary); }

    .suggested-list { display:flex;flex-direction:column;gap:6px; }
    .suggested-q { text-align:left;padding:9px 12px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);font-size:11px;color:var(--text-secondary);cursor:pointer;transition:var(--transition-fast);display:flex;align-items:flex-start;gap:8px;line-height:1.4; }
    .suggested-q i { color:var(--primary);flex-shrink:0;margin-top:1px; }
    .suggested-q:hover { color:var(--text-primary);border-color:var(--border-active);background:var(--bg-card-hover); }

    .tutor-chat-area { display:flex;flex-direction:column;overflow:hidden; }
    .tutor-chat-header { display:flex;align-items:center;gap:12px;padding:16px 24px;border-bottom:1px solid var(--border);background:var(--bg-elevated);flex-shrink:0; }
    .tutor-avatar { width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#fff;box-shadow:var(--shadow-primary); }
    .tutor-name { font-weight:700;font-size:var(--text-sm); }
    .tutor-status { font-size:10px;color:var(--success);display:flex;align-items:center;gap:5px;margin-top:2px; }
    .status-dot { width:6px;height:6px;border-radius:50%;background:var(--success);animation:pulse 2s infinite; }
    .tutor-header-right { margin-left:auto; }

    .chat-container { flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px; }
    .chat-message { display:flex;gap:10px;align-items:flex-start;animation:slideUp 0.3s ease; }
    .chat-message.user { flex-direction:row-reverse; }
    .chat-avatar { width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:700;flex-shrink:0; }
    .chat-avatar.ai { background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff; }
    .chat-avatar.user { background:linear-gradient(135deg,var(--accent),var(--warning));color:#fff; }
    .chat-bubble { max-width:78%;padding:14px 18px;border-radius:18px;font-size:var(--text-sm);line-height:1.7;position:relative; }
    .chat-message.ai .chat-bubble { background:var(--bg-card);border:1px solid var(--border);border-bottom-left-radius:4px; }
    .chat-message.user .chat-bubble { background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;border-bottom-right-radius:4px; }
    .bubble-content code { background:rgba(0,0,0,0.2);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:0.85em; }
    .bubble-time { font-size:10px;opacity:0.5;margin-top:6px; }
    .chat-message.user .bubble-time { text-align:right; }
    .copy-btn { position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:11px;opacity:0;transition:var(--transition-fast); }
    .chat-bubble:hover .copy-btn { opacity:1; }
    .copy-btn:hover { color:var(--primary); }
    .ai-typing { padding:12px 18px; }
    .typing-wrapper { display:flex;gap:10px;align-items:center;padding:0 20px 8px; }
    .typing-dot { width:7px;height:7px;border-radius:50%;background:var(--text-muted);animation:typingDots 1.2s ease infinite; }
    .typing-dot:nth-child(2){animation-delay:0.2s}
    .typing-dot:nth-child(3){animation-delay:0.4s}

    .chat-input-area { padding:16px 20px;border-top:1px solid var(--border);background:var(--bg-surface);flex-shrink:0; }
    .chat-input-wrapper { display:flex;gap:10px;align-items:flex-end;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-xl);padding:10px 12px;transition:var(--transition-base); }
    .chat-input-wrapper:focus-within { border-color:var(--primary);box-shadow:0 0 0 3px rgba(108,99,255,0.12); }
    .chat-input { flex:1;background:transparent;border:none;color:var(--text-primary);font-size:var(--text-sm);resize:none;max-height:120px;line-height:1.5; }
    .chat-input::placeholder { color:var(--text-muted); }
    .chat-input-actions { display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0; }
    .char-count { font-size:10px;color:var(--text-muted); }
    .chat-tips { display:flex;gap:16px;margin-top:8px;font-size:10px;color:var(--text-muted); }
    .chat-tips kbd { background:var(--bg-elevated);border:1px solid var(--border);border-radius:4px;padding:1px 5px;font-size:9px; }

    @media(max-width:768px){ .tutor-layout{grid-template-columns:1fr;grid-template-rows:auto 1fr}.tutor-sidebar{border-right:none;border-bottom:1px solid var(--border);padding:12px;flex-direction:row;overflow-x:auto;gap:16px}.tutor-sidebar-section{flex-shrink:0;min-width:180px} }
  `;
  document.head.appendChild(s);
  window.__showToast = showToast;
}
