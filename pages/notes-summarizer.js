/* =========================================
   EduAI – Notes Summarizer Page
   ========================================= */
import { summarizeNotes } from '../js/ai-engine.js';
import { showToast } from '../js/utils.js';

export function renderNotesSummarizer(container) {
  let notesText = '';
  let results = null;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">📝 AI Notes Summarizer</h1>
        <p class="page-subtitle">Paste your notes and get instant summaries, key points, keywords, and practice questions.</p>
      </div>
    </div>

    <div class="summarizer-layout">
      <!-- INPUT PANEL -->
      <div class="summarizer-input-panel">
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-pencil-alt" style="color:var(--primary)"></i> Your Notes</div>
            <div class="input-header-actions">
              <button class="btn btn-ghost btn-sm" id="sampleBtn"><i class="fas fa-flask"></i> Load Sample</button>
              <button class="btn btn-ghost btn-sm" id="clearNotes"><i class="fas fa-times"></i> Clear</button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="summarizer-tabs">
            <button class="sum-tab active" data-tab="paste"><i class="fas fa-paste"></i> Paste Text</button>
            <button class="sum-tab" data-tab="upload"><i class="fas fa-upload"></i> Upload File</button>
          </div>

          <!-- Paste Tab -->
          <div class="sum-tab-content active" id="tab-paste">
            <textarea
              class="form-textarea"
              id="notesInput"
              placeholder="Paste your notes, textbook content, or any text here...

Example:
Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar. This occurs in the chloroplast..."
              style="min-height:260px;font-size:var(--text-sm)"
            ></textarea>
            <div class="notes-input-footer">
              <span class="char-count" id="notesCharCount">0 characters</span>
              <span class="word-count" id="notesWordCount">0 words</span>
            </div>
          </div>

          <!-- Upload Tab -->
          <div class="sum-tab-content" id="tab-upload">
            <div class="file-drop-zone" id="dropZone">
              <div class="drop-icon"><i class="fas fa-file-text"></i></div>
              <div style="font-weight:600;margin-bottom:8px">Drop a .txt file here</div>
              <div style="font-size:var(--text-xs)">or</div>
              <button class="btn btn-outline btn-sm" style="margin-top:12px" onclick="document.getElementById('fileInput').click()">
                <i class="fas fa-folder-open"></i> Browse Files
              </button>
              <input type="file" id="fileInput" accept=".txt,.md" style="display:none">
              <div style="font-size:10px;color:var(--text-muted);margin-top:12px">Supported: .txt, .md files</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="summarizer-actions" style="margin-top:20px">
            <button class="btn btn-primary" id="btnSummarize"><i class="fas fa-compress-alt"></i> Summarize</button>
            <button class="btn btn-ghost" id="btnKeyPoints"><i class="fas fa-list-ul"></i> Key Points</button>
            <button class="btn btn-ghost" id="btnKeywords"><i class="fas fa-tags"></i> Keywords</button>
            <button class="btn btn-ghost" id="btnQuestions"><i class="fas fa-question-circle"></i> Questions</button>
            <button class="btn btn-secondary" id="btnAll"><i class="fas fa-magic"></i> All at Once</button>
          </div>
        </div>
      </div>

      <!-- OUTPUT PANEL -->
      <div class="summarizer-output" id="summarizerOutput">
        <div class="empty-state" id="outputEmpty">
          <div class="empty-icon">✨</div>
          <h3>Your results will appear here</h3>
          <p>Paste your notes and click one of the action buttons above</p>
        </div>
      </div>
    </div>
  `;

  injectSummarizerCSS();

  const notesInput = document.getElementById('notesInput');
  const output     = document.getElementById('summarizerOutput');

  // Char/word count
  notesInput.addEventListener('input', () => {
    const text = notesInput.value;
    document.getElementById('notesCharCount').textContent = `${text.length} characters`;
    document.getElementById('notesWordCount').textContent = `${text.trim() ? text.trim().split(/\s+/).length : 0} words`;
    notesText = text;
  });

  // Tabs
  document.querySelectorAll('.sum-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sum-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.sum-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // File upload
  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      notesText = e.target.result;
      notesInput.value = notesText;
      document.querySelector('.sum-tab[data-tab="paste"]').click();
      showToast(`Loaded: ${file.name}`, 'success');
    };
    reader.readAsText(file);
  });

  // Drag and drop
  const dropZone = document.getElementById('dropZone');
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = (ev) => { notesText = ev.target.result; notesInput.value = notesText; document.querySelector('.sum-tab[data-tab="paste"]').click(); showToast('File loaded!', 'success'); };
      reader.readAsText(file);
    }
  });

  // Clear
  document.getElementById('clearNotes').addEventListener('click', () => {
    notesInput.value = ''; notesText = ''; results = null;
    document.getElementById('notesCharCount').textContent = '0 characters';
    document.getElementById('notesWordCount').textContent = '0 words';
    output.innerHTML = `<div class="empty-state" id="outputEmpty"><div class="empty-icon">✨</div><h3>Your results will appear here</h3><p>Paste your notes and click one of the action buttons above</p></div>`;
    showToast('Cleared', 'info');
  });

  // Sample
  document.getElementById('sampleBtn').addEventListener('click', () => {
    const sample = `Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a by-product.

The overall chemical equation for photosynthesis is:
6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2

This process occurs in two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). The light-dependent reactions take place in the thylakoid membranes and require direct light energy. They produce ATP and NADPH, which are then used in the Calvin cycle. The Calvin cycle occurs in the stroma of the chloroplast and does not require direct light. It uses the ATP and NADPH produced in the light reactions to fix carbon dioxide into glucose.

Chlorophyll is the primary pigment responsible for absorbing light energy. It absorbs light most efficiently in the red and blue portions of the electromagnetic spectrum. The green wavelengths are reflected, which is why plants appear green.

Factors that affect the rate of photosynthesis include light intensity, carbon dioxide concentration, temperature, and water availability. At higher light intensities, the rate of photosynthesis increases up to a saturation point. Beyond this point, other factors become limiting.`;
    notesInput.value = sample; notesText = sample;
    notesInput.dispatchEvent(new Event('input'));
    showToast('Sample notes loaded!', 'info');
  });

  // Action buttons
  document.getElementById('btnSummarize').addEventListener('click', () => processNotes('summary'));
  document.getElementById('btnKeyPoints').addEventListener('click', () => processNotes('keyPoints'));
  document.getElementById('btnKeywords').addEventListener('click', () => processNotes('keywords'));
  document.getElementById('btnQuestions').addEventListener('click', () => processNotes('questions'));
  document.getElementById('btnAll').addEventListener('click', () => processNotes('all'));

  function processNotes(type) {
    const text = notesInput.value.trim();
    if (!text || text.length < 30) { showToast('Please enter at least a few sentences of notes', 'warning'); return; }

    // Loading state
    output.innerHTML = `<div class="loading-overlay"><div class="spinner spinner-lg"></div><p>AI is analyzing your notes...</p></div>`;

    setTimeout(() => {
      results = summarizeNotes(text);
      renderResults(type);
    }, 600);
  }

  function renderResults(type) {
    let html = '<div class="results-grid">';

    if ((type === 'summary' || type === 'all') && results.summary) {
      html += `
        <div class="result-card card card-glass anim-result">
          <div class="result-card-header">
            <div class="result-icon" style="background:rgba(108,99,255,0.15);color:var(--primary)"><i class="fas fa-compress-alt"></i></div>
            <div>
              <div class="result-title">Summary</div>
              <div class="result-sub">${Math.ceil(results.summary.split(' ').length / 200)} min read</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="navigator.clipboard.writeText(\`${results.summary.replace(/`/g,"'")}\`)"><i class="fas fa-copy"></i></button>
          </div>
          <div class="result-body">${results.summary}</div>
        </div>
      `;
    }

    if ((type === 'keyPoints' || type === 'all') && results.keyPoints?.length) {
      html += `
        <div class="result-card card card-glass anim-result">
          <div class="result-card-header">
            <div class="result-icon" style="background:rgba(0,217,192,0.15);color:var(--secondary)"><i class="fas fa-star"></i></div>
            <div><div class="result-title">Key Points</div><div class="result-sub">${results.keyPoints.length} points identified</div></div>
          </div>
          <div class="result-body">
            <ul class="key-points-list">
              ${results.keyPoints.map(p => `<li><span class="kp-dot"></span>${p}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    if ((type === 'keywords' || type === 'all') && results.keywords?.length) {
      html += `
        <div class="result-card card card-glass anim-result">
          <div class="result-card-header">
            <div class="result-icon" style="background:rgba(255,179,71,0.15);color:var(--warning)"><i class="fas fa-tags"></i></div>
            <div><div class="result-title">Keywords</div><div class="result-sub">${results.keywords.length} terms extracted</div></div>
          </div>
          <div class="result-body">
            <div class="keywords-cloud">
              ${results.keywords.map((kw, i) => `<span class="tag" style="font-size:${14 - i * 0.4}px;opacity:${1 - i * 0.04}">${kw}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    }

    if ((type === 'questions' || type === 'all') && results.questions?.length) {
      html += `
        <div class="result-card card card-glass anim-result">
          <div class="result-card-header">
            <div class="result-icon" style="background:rgba(255,107,107,0.15);color:var(--accent)"><i class="fas fa-question-circle"></i></div>
            <div><div class="result-title">Practice Questions</div><div class="result-sub">${results.questions.length} questions generated</div></div>
          </div>
          <div class="result-body">
            <ol class="questions-list">
              ${results.questions.map(q => `<li>${q}</li>`).join('')}
            </ol>
          </div>
        </div>
      `;
    }

    html += '</div>';
    output.innerHTML = html;
    showToast('Analysis complete! ✨', 'success');
  }
}

function injectSummarizerCSS() {
  if (document.getElementById('sum-css')) return;
  const s = document.createElement('style'); s.id = 'sum-css';
  s.textContent = `
    .summarizer-layout { display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start; }
    @media(max-width:900px){ .summarizer-layout{grid-template-columns:1fr} }

    .input-header-actions { display:flex;gap:8px; }
    .summarizer-tabs { display:flex;gap:4px;background:var(--bg-elevated);border-radius:var(--radius-md);padding:4px;margin-bottom:16px; }
    .sum-tab { flex:1;padding:7px;border-radius:var(--radius-sm);font-size:var(--text-xs);font-weight:600;color:var(--text-secondary);cursor:pointer;transition:var(--transition-fast);display:flex;align-items:center;justify-content:center;gap:6px; }
    .sum-tab.active { background:var(--primary);color:#fff; }
    .sum-tab:hover:not(.active) { color:var(--text-primary); }
    .sum-tab-content { display:none; }
    .sum-tab-content.active { display:block; }

    .notes-input-footer { display:flex;gap:16px;margin-top:8px;font-size:10px;color:var(--text-muted); }
    .summarizer-actions { display:flex;flex-wrap:wrap;gap:8px; }

    .results-grid { display:flex;flex-direction:column;gap:16px; }
    .result-card { animation:slideUp 0.4s ease; }
    .result-card-header { display:flex;align-items:center;gap:12px;margin-bottom:16px; }
    .result-icon { width:40px;height:40px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0; }
    .result-title { font-weight:700;font-size:var(--text-base); }
    .result-sub { font-size:10px;color:var(--text-muted); }
    .result-card-header .btn { margin-left:auto; }
    .result-body { font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7; }

    .key-points-list { list-style:none;display:flex;flex-direction:column;gap:10px; }
    .key-points-list li { display:flex;align-items:flex-start;gap:10px; }
    .kp-dot { width:8px;height:8px;border-radius:50%;background:var(--secondary);flex-shrink:0;margin-top:6px; }

    .keywords-cloud { display:flex;flex-wrap:wrap;gap:8px; }
    .keywords-cloud .tag { cursor:default; }

    .questions-list { padding-left:20px;display:flex;flex-direction:column;gap:12px; }
    .questions-list li { padding:10px 12px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);list-style-position:inside;padding-left:12px; }
  `;
  document.head.appendChild(s);
}
