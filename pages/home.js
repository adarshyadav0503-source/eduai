/* =========================================
   EduAI – Home / Landing Page
   ========================================= */
import { navigateTo } from '../js/router.js';
import { store } from '../js/store.js';
import { animateCounter, observeAndAnimate } from '../js/utils.js';

export function renderHome(container) {
  container.innerHTML = `
    <!-- HERO -->
    <section class="hero-section" id="hero">
      <canvas id="particles-canvas"></canvas>
      <div class="hero-content">
        <div class="hero-badge">
          <i class="fas fa-bolt"></i>
          <span>AI-Powered Learning Platform · Hackathon 2026</span>
        </div>
        <h1 class="hero-title">
          Learn Smarter with<br>
          <span class="gradient-text">Your AI Tutor</span>
        </h1>
        <p class="hero-subtitle">
          Personalized study plans, instant AI tutoring, smart quizzes, and note summaries — everything you need to ace your exams, powered by artificial intelligence.
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-xl" id="btn-start">
            <i class="fas fa-rocket"></i> Start Learning Free
          </button>
          <button class="btn btn-ghost btn-xl" id="btn-tutor">
            <i class="fas fa-robot"></i> Meet AI Tutor
          </button>
        </div>
        <div class="hero-chips">
          <span class="hero-chip"><i class="fas fa-check"></i> No credit card</span>
          <span class="hero-chip"><i class="fas fa-check"></i> Works offline</span>
          <span class="hero-chip"><i class="fas fa-check"></i> 7 Powerful tools</span>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-card-stack">
          <div class="floating-card fc1">
            <div class="fc-icon" style="background:linear-gradient(135deg,#6C63FF,#9C95FF)"><i class="fas fa-brain"></i></div>
            <div><div class="fc-title">AI Tutor</div><div class="fc-sub">Ask anything</div></div>
          </div>
          <div class="floating-card fc2">
            <div class="fc-icon" style="background:linear-gradient(135deg,#00D9C0,#4DFFE8)"><i class="fas fa-chart-line"></i></div>
            <div><div class="fc-title">Progress</div><div class="fc-sub">72% complete</div></div>
          </div>
          <div class="floating-card fc3">
            <div class="fc-icon" style="background:linear-gradient(135deg,#FF6B6B,#FF9999)"><i class="fas fa-fire"></i></div>
            <div><div class="fc-title">7-Day Streak</div><div class="fc-sub">Keep it up! 🔥</div></div>
          </div>
          <div class="hero-main-card">
            <div class="hmc-header">
              <div class="hmc-avatar"><i class="fas fa-robot"></i></div>
              <div><div class="hmc-name">EduAI Tutor</div><div class="hmc-status"><span class="status-dot"></span>Online</div></div>
            </div>
            <div class="hmc-msg">Hello! I'm your personal AI tutor. What would you like to learn today? 🎓</div>
            <div class="hmc-input-row">
              <div class="hmc-input-fake">Ask me anything...</div>
              <button class="hmc-send"><i class="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats-section" id="stats">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-num" data-target="50000">0</div>
          <div class="stat-lbl">Active Students</div>
        </div>
        <div class="stat-item">
          <div class="stat-num" data-target="1200000">0</div>
          <div class="stat-lbl">Questions Answered</div>
        </div>
        <div class="stat-item">
          <div class="stat-num" data-target="95">0</div>
          <div class="stat-lbl">% Pass Rate</div>
        </div>
        <div class="stat-item">
          <div class="stat-num" data-target="200">0</div>
          <div class="stat-lbl">Subjects Covered</div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="features-section" id="features">
      <div class="section-label">What EduAI Offers</div>
      <h2 class="section-title-lg">Everything You Need to <span class="gradient-text">Excel</span></h2>
      <p class="section-desc">Six powerful AI tools built specifically for students — all in one place.</p>
      <div class="features-grid">
        ${[
          { icon: 'fa-robot', color: '#6C63FF', title: 'AI Tutor', desc: 'Ask any question and get clear, step-by-step explanations from your personal AI teacher — available 24/7.', route: 'ai-tutor' },
          { icon: 'fa-calendar-alt', color: '#00D9C0', title: 'Study Planner', desc: 'Enter your subjects and exam dates. Get a personalized daily study schedule optimized for your weak areas.', route: 'study-planner' },
          { icon: 'fa-question-circle', color: '#FFB347', title: 'Quiz Generator', desc: 'Generate custom MCQ quizzes for any subject and difficulty level. Get instant feedback and explanations.', route: 'quiz' },
          { icon: 'fa-file-alt', color: '#FF6B6B', title: 'Notes Summarizer', desc: 'Paste your notes and instantly get a summary, key points, keywords, and practice questions.', route: 'notes-summarizer' },
          { icon: 'fa-chart-bar', color: '#4FC3F7', title: 'Progress Tracker', desc: 'Visualize your learning journey with detailed charts, subject-wise progress, and achievement badges.', route: 'progress' },
          { icon: 'fa-tachometer-alt', color: '#4CAF82', title: 'Smart Dashboard', desc: 'Your learning HQ — see today\'s tasks, streaks, upcoming tests, and AI-recommended topics at a glance.', route: 'dashboard' },
        ].map(f => `
          <div class="feature-card anim-slide-up" data-route="${f.route}" style="cursor:pointer">
            <div class="feature-icon" style="background:${f.color}22;color:${f.color}">
              <i class="fas ${f.icon}"></i>
            </div>
            <h3 class="feature-title">${f.title}</h3>
            <p class="feature-desc">${f.desc}</p>
            <div class="feature-link" style="color:${f.color}">Try it now <i class="fas fa-arrow-right"></i></div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how-section" id="how">
      <div class="section-label">Simple Process</div>
      <h2 class="section-title-lg">How It <span class="gradient-text">Works</span></h2>
      <div class="how-steps">
        ${[
          { num:'01', icon:'fa-user-graduate', title:'Create Your Profile', desc:'Tell us your class, subjects, exam dates, and study goals. Takes less than 2 minutes.' },
          { num:'02', icon:'fa-brain', title:'AI Builds Your Plan', desc:'Our AI analyzes your inputs and creates a personalized study schedule tailored to your needs.' },
          { num:'03', icon:'fa-trophy', title:'Learn & Track Progress', desc:'Study with your AI tutor, take quizzes, summarize notes, and watch your scores improve daily.' },
        ].map((s, i) => `
          <div class="how-step anim-slide-up">
            <div class="how-step-num">${s.num}</div>
            <div class="how-step-icon"><i class="fas ${s.icon}"></i></div>
            <h3>${s.title}</h3>
            <p>${s.desc}</p>
            ${i < 2 ? '<div class="how-connector"><i class="fas fa-arrow-right"></i></div>' : ''}
          </div>
        `).join('')}
      </div>
    </section>

    <!-- SUBJECTS -->
    <section class="subjects-section" id="subjects">
      <div class="section-label">Coverage</div>
      <h2 class="section-title-lg">All Your <span class="gradient-text">Subjects</span> Covered</h2>
      <div class="subjects-grid">
        ${[
          { icon:'fa-calculator', name:'Mathematics', color:'var(--subject-math)', topics:'Algebra, Geometry, Calculus' },
          { icon:'fa-flask', name:'Science', color:'var(--subject-science)', topics:'Physics, Chemistry, Biology' },
          { icon:'fa-book', name:'English', color:'var(--subject-english)', topics:'Grammar, Literature, Writing' },
          { icon:'fa-landmark', name:'History', color:'var(--subject-history)', topics:'Ancient, Modern, World Wars' },
          { icon:'fa-laptop-code', name:'Computer Science', color:'var(--subject-cs)', topics:'Programming, Algorithms, AI' },
          { icon:'fa-globe', name:'Geography', color:'var(--subject-geo)', topics:'Maps, Climate, Resources' },
          { icon:'fa-atom', name:'Physics', color:'var(--subject-physics)', topics:'Mechanics, Waves, Optics' },
          { icon:'fa-vial', name:'Chemistry', color:'var(--subject-chemistry)', topics:'Organic, Inorganic, Physical' },
        ].map(s => `
          <div class="subject-card anim-slide-up">
            <div class="subject-icon" style="color:${s.color};background:${s.color}22">
              <i class="fas ${s.icon}"></i>
            </div>
            <div class="subject-name">${s.name}</div>
            <div class="subject-topics">${s.topics}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testimonials-section" id="testimonials">
      <div class="section-label">Student Reviews</div>
      <h2 class="section-title-lg">What Students <span class="gradient-text">Say</span></h2>
      <div class="testimonials-track" id="tTrack">
        ${[
          { name:'Priya Sharma', class:'Grade 12, CBSE', avatar:'PS', rating:5, text:'EduAI helped me score 95% in my board exams! The AI tutor explains concepts so clearly, even better than some of my teachers.' },
          { name:'Rohan Mehta', class:'Grade 10, ICSE', avatar:'RM', rating:5, text:'The study planner is genius. It automatically figured out I was weak in Trigonometry and gave me extra practice. My grades improved in just 3 weeks!' },
          { name:'Ananya Joshi', class:'Grade 11, State Board', avatar:'AJ', rating:5, text:'Notes summarizer is a lifesaver before exams! I just paste my textbook notes and get a perfect summary in seconds. Saved me hours of work.' },
          { name:'Karan Patel', class:'Grade 9, CBSE', avatar:'KP', rating:5, text:'The quiz generator is so fun! I practice every day and my quiz scores went from 60% to 88% in Mathematics. This app is amazing!' },
          { name:'Sneha Reddy', class:'Grade 12, AP Board', avatar:'SR', rating:5, text:'I was really stressed about my exams but EduAI\'s personalized plan gave me a clear roadmap. I feel so much more confident now!' },
          { name:'Dev Singh', class:'Grade 11, ICSE', avatar:'DS', rating:5, text:'The progress tracker keeps me motivated. Seeing my streak counter and subject improvements every day pushes me to study consistently.' },
        ].map(t => `
          <div class="testimonial-card">
            <div class="test-stars">${'⭐'.repeat(t.rating)}</div>
            <p class="test-text">"${t.text}"</p>
            <div class="test-author">
              <div class="test-avatar">${t.avatar}</div>
              <div>
                <div class="test-name">${t.name}</div>
                <div class="test-class">${t.class}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="test-controls">
        <button class="btn btn-ghost btn-icon" id="testPrev"><i class="fas fa-chevron-left"></i></button>
        <button class="btn btn-ghost btn-icon" id="testNext"><i class="fas fa-chevron-right"></i></button>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="cta-section">
      <div class="cta-glow"></div>
      <div class="cta-content">
        <h2>Ready to Transform Your Learning?</h2>
        <p>Join thousands of students already using EduAI to study smarter and score higher.</p>
        <button class="btn btn-primary btn-xl" id="btn-cta">
          <i class="fas fa-graduation-cap"></i> Start Learning Now — It's Free
        </button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-logo"><i class="fas fa-graduation-cap"></i> EduAI</div>
          <p>Smart AI-powered learning for every student.</p>
          <div class="footer-socials">
            <a href="#" class="social-btn"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-github"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-linkedin"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <div class="footer-col-title">Features</div>
            <a href="#/ai-tutor">AI Tutor</a>
            <a href="#/study-planner">Study Planner</a>
            <a href="#/quiz">Quiz Generator</a>
            <a href="#/notes-summarizer">Notes Summarizer</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Learn</div>
            <a href="#/dashboard">Dashboard</a>
            <a href="#/progress">Progress</a>
            <a href="#/quiz">Practice</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Project</div>
            <a href="#">About EduAI</a>
            <a href="#">Hackathon 2026</a>
            <a href="#">Open Source</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 EduAI Hackathon Project. Built with ❤️ for students everywhere.</span>
      </div>
    </footer>
  `;

  // Inject home-specific CSS
  injectHomeCSS();

  // Particles
  initParticles();

  // Animate counters
  const statsSection = document.getElementById('stats');
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = target >= 1000000 ? 'M+' : target >= 1000 ? 'K+' : target === 95 ? '%' : '+';
        const displayTarget = target >= 1000000 ? target / 1000000 : target >= 1000 ? target / 1000 : target;
        animateCounter(el, displayTarget, 1800, suffix);
      });
      statsObserver.disconnect();
    }
  }, { threshold: 0.3 });
  if (statsSection) statsObserver.observe(statsSection);

  // Navigation
  document.getElementById('btn-start')?.addEventListener('click', () => navigateTo('dashboard'));
  document.getElementById('btn-tutor')?.addEventListener('click', () => navigateTo('ai-tutor'));
  document.getElementById('btn-cta')?.addEventListener('click', () => navigateTo('dashboard'));

  // Feature cards click
  document.querySelectorAll('.feature-card[data-route]').forEach(card => {
    card.addEventListener('click', () => navigateTo(card.dataset.route));
  });

  // Testimonial slider
  let tIdx = 0;
  const track = document.getElementById('tTrack');
  const cards = track?.querySelectorAll('.testimonial-card');
  const perView = () => window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;
  const scrollTo = (i) => {
    if (!track) return;
    const cardW = track.querySelector('.testimonial-card')?.offsetWidth + 24 || 320;
    track.scrollTo({ left: i * cardW, behavior: 'smooth' });
  };
  document.getElementById('testPrev')?.addEventListener('click', () => { tIdx = Math.max(0, tIdx - 1); scrollTo(tIdx); });
  document.getElementById('testNext')?.addEventListener('click', () => { tIdx = Math.min((cards?.length || 1) - 1, tIdx + 1); scrollTo(tIdx); });

  // Auto-scroll testimonials
  const autoT = setInterval(() => {
    if (!document.getElementById('tTrack')) { clearInterval(autoT); return; }
    tIdx = (tIdx + 1) % (cards?.length || 1);
    scrollTo(tIdx);
  }, 4000);

  // Animate elements on scroll
  setTimeout(() => observeAndAnimate('.anim-slide-up', 'visible'), 100);
}

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      a: Math.random() * 0.6 + 0.1,
    }));
  };
  resize();
  window.addEventListener('resize', resize);

  let raf;
  const draw = () => {
    if (!document.getElementById('particles-canvas')) { cancelAnimationFrame(raf); return; }
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${p.a})`; ctx.fill();
    });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${0.15 * (1 - dist/120)})`;
          ctx.lineWidth = 0.8; ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  };
  draw();
}

function injectHomeCSS() {
  if (document.getElementById('home-css')) return;
  const style = document.createElement('style');
  style.id = 'home-css';
  style.textContent = `
    /* HERO */
    .hero-section {
      position: relative; min-height: calc(100vh - var(--topbar-height));
      display: flex; align-items: center; justify-content: space-between;
      gap: 48px; padding: 80px 0 60px;
      overflow: hidden;
    }
    .hero-section::before {
      content:'';position:absolute;top:-30%;right:-10%;
      width:700px;height:700px;border-radius:50%;
      background:radial-gradient(circle,rgba(108,99,255,0.15),transparent 70%);
      pointer-events:none;
    }
    .hero-content { flex: 1; position: relative; z-index: 2; max-width: 560px; }
    .hero-badge {
      display:inline-flex;align-items:center;gap:8px;
      background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3);
      border-radius:var(--radius-full);padding:6px 16px;
      font-size:var(--text-xs);font-weight:600;color:var(--primary-light);
      margin-bottom:24px;animation:slideDown 0.6s ease;
    }
    .hero-title { font-size:clamp(2.2rem,5vw,3.8rem); line-height:1.1; margin-bottom:20px; animation:slideUp 0.7s ease; }
    .hero-subtitle { font-size:var(--text-lg); color:var(--text-secondary); margin-bottom:36px; line-height:1.7; animation:slideUp 0.8s ease; }
    .hero-actions { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:24px; animation:slideUp 0.9s ease; }
    .hero-chips { display:flex; gap:16px; flex-wrap:wrap; animation:fadeIn 1.1s ease; }
    .hero-chip { display:inline-flex; align-items:center; gap:6px; font-size:var(--text-xs); color:var(--text-muted); }
    .hero-chip i { color:var(--success); }
    .hero-visual { flex: 1; max-width: 500px; position: relative; z-index: 2; display:flex; align-items:center; justify-content:center; }
    .hero-card-stack { position: relative; width: 420px; height: 400px; }
    .hero-main-card {
      position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:300px; background:var(--bg-elevated); border:1px solid var(--border);
      border-radius:var(--radius-xl); padding:20px;
      box-shadow:var(--shadow-glow); animation:float 4s ease-in-out infinite;
    }
    .hmc-header { display:flex;align-items:center;gap:12px;margin-bottom:16px; }
    .hmc-avatar { width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#fff; }
    .hmc-name { font-weight:700;font-size:var(--text-sm); }
    .hmc-status { display:flex;align-items:center;gap:5px;font-size:10px;color:var(--success); }
    .status-dot { width:6px;height:6px;border-radius:50%;background:var(--success);animation:pulse 2s infinite; }
    .hmc-msg { background:var(--bg-glass);border:1px solid var(--border-glow);border-radius:var(--radius-lg);padding:12px;font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:12px;line-height:1.5; }
    .hmc-input-row { display:flex;gap:8px;align-items:center; }
    .hmc-input-fake { flex:1;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-full);padding:8px 14px;font-size:var(--text-xs);color:var(--text-muted); }
    .hmc-send { width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0; }
    .floating-card {
      position:absolute;display:flex;align-items:center;gap:10px;
      background:var(--bg-elevated);border:1px solid var(--border);
      border-radius:var(--radius-lg);padding:12px 16px;
      box-shadow:var(--shadow-md);font-size:var(--text-xs);
    }
    .fc-icon { width:36px;height:36px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1rem;flex-shrink:0; }
    .fc-title { font-weight:700;font-size:var(--text-sm); }
    .fc-sub { color:var(--text-muted);font-size:10px; }
    .fc1 { top:10px;left:-10px; animation:float 3.5s ease-in-out infinite; }
    .fc2 { bottom:60px;left:-20px; animation:float 4.5s ease-in-out infinite 1s; }
    .fc3 { top:30px;right:-20px; animation:float 3.8s ease-in-out infinite 0.5s; }

    /* STATS */
    .stats-section { background:linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,217,192,0.08)); border:1px solid var(--border); border-radius:var(--radius-xl); padding:48px; margin:48px 0; }
    .stats-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center; }
    .stat-num { font-size:var(--text-4xl);font-weight:800;font-family:var(--font-heading);background:linear-gradient(135deg,var(--primary-light),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
    .stat-lbl { font-size:var(--text-sm);color:var(--text-secondary);margin-top:4px; }

    /* FEATURES */
    .features-section, .how-section, .subjects-section, .testimonials-section { margin:80px 0; }
    .section-label { font-size:var(--text-xs);font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--primary);margin-bottom:12px; }
    .section-title-lg { font-size:clamp(1.8rem,3vw,2.6rem);margin-bottom:16px; }
    .section-desc { color:var(--text-secondary);font-size:var(--text-lg);margin-bottom:48px;max-width:600px; }
    .features-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:24px; }
    .feature-card { background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-xl);padding:28px;transition:var(--transition-base);opacity:0;transform:translateY(20px); }
    .feature-card.visible { opacity:1;transform:translateY(0); }
    .feature-card:hover { border-color:var(--border-glow);transform:translateY(-4px);box-shadow:var(--shadow-glow); }
    .feature-icon { width:52px;height:52px;border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin-bottom:16px; }
    .feature-title { font-size:var(--text-lg);font-weight:700;margin-bottom:10px; }
    .feature-desc { font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7;margin-bottom:16px; }
    .feature-link { font-size:var(--text-sm);font-weight:600;display:flex;align-items:center;gap:6px; }

    /* HOW IT WORKS */
    .how-steps { display:flex;align-items:flex-start;gap:24px;position:relative; }
    .how-step { flex:1;text-align:center;padding:32px 24px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-xl);position:relative;opacity:0;transform:translateY(20px);transition:all 0.5s ease; }
    .how-step.visible { opacity:1;transform:translateY(0); }
    .how-step-num { font-size:3rem;font-weight:900;font-family:var(--font-heading);color:rgba(108,99,255,0.15);line-height:1;margin-bottom:12px; }
    .how-step-icon { width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:#fff;margin:0 auto 16px; }
    .how-step h3 { font-size:var(--text-lg);margin-bottom:8px; }
    .how-step p { font-size:var(--text-sm);color:var(--text-secondary);line-height:1.6; }
    .how-connector { position:absolute;right:-36px;top:50%;transform:translateY(-50%);color:var(--primary);font-size:1.5rem;z-index:2; }

    /* SUBJECTS */
    .subjects-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:20px; }
    .subject-card { background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-xl);padding:24px;text-align:center;cursor:pointer;transition:var(--transition-base);opacity:0;transform:translateY(20px); }
    .subject-card.visible { opacity:1;transform:translateY(0); }
    .subject-card:hover { transform:translateY(-4px);box-shadow:var(--shadow-md);border-color:var(--border-glow); }
    .subject-icon { width:52px;height:52px;border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;font-size:1.3rem;margin:0 auto 12px; }
    .subject-name { font-weight:700;font-size:var(--text-sm);margin-bottom:6px; }
    .subject-topics { font-size:10px;color:var(--text-muted); }

    /* TESTIMONIALS */
    .testimonials-track { display:flex;gap:24px;overflow-x:hidden;scroll-behavior:smooth;padding-bottom:8px; }
    .testimonial-card { min-width:320px;flex-shrink:0;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-xl);padding:28px; }
    .test-stars { font-size:1rem;margin-bottom:12px; }
    .test-text { font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7;margin-bottom:20px;font-style:italic; }
    .test-author { display:flex;align-items:center;gap:12px; }
    .test-avatar { width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:var(--text-xs);color:#fff; }
    .test-name { font-weight:700;font-size:var(--text-sm); }
    .test-class { font-size:10px;color:var(--text-muted); }
    .test-controls { display:flex;gap:12px;justify-content:center;margin-top:24px; }

    /* CTA */
    .cta-section { position:relative;background:linear-gradient(135deg,rgba(108,99,255,0.15),rgba(0,217,192,0.1));border:1px solid var(--border-glow);border-radius:var(--radius-xl);padding:64px;text-align:center;overflow:hidden;margin:60px 0; }
    .cta-glow { position:absolute;top:-50%;left:50%;transform:translateX(-50%);width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(108,99,255,0.25),transparent 70%);pointer-events:none; }
    .cta-content { position:relative;z-index:2; }
    .cta-content h2 { font-size:clamp(1.6rem,3vw,2.4rem);margin-bottom:16px; }
    .cta-content p { font-size:var(--text-lg);color:var(--text-secondary);margin-bottom:32px; }

    /* FOOTER */
    .site-footer { border-top:1px solid var(--border);padding:48px 0 24px;margin-top:60px; }
    .footer-inner { display:flex;gap:48px;justify-content:space-between;flex-wrap:wrap;margin-bottom:32px; }
    .footer-brand { flex:1;min-width:200px; }
    .footer-logo { font-size:var(--text-xl);font-weight:800;font-family:var(--font-heading);color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:8px; }
    .footer-logo i { color:var(--primary); }
    .footer-brand p { font-size:var(--text-sm);color:var(--text-muted);margin-bottom:20px; }
    .footer-socials { display:flex;gap:12px; }
    .social-btn { width:36px;height:36px;border-radius:50%;background:var(--bg-card);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:var(--text-sm);transition:var(--transition-fast); }
    .social-btn:hover { color:var(--primary);border-color:var(--primary);background:var(--bg-glass); }
    .footer-links { display:flex;gap:40px;flex-wrap:wrap; }
    .footer-col { display:flex;flex-direction:column;gap:10px; }
    .footer-col-title { font-weight:700;font-size:var(--text-sm);color:var(--text-primary);margin-bottom:4px; }
    .footer-col a { font-size:var(--text-sm);color:var(--text-muted);transition:var(--transition-fast); }
    .footer-col a:hover { color:var(--primary); }
    .footer-bottom { text-align:center;font-size:var(--text-xs);color:var(--text-muted);border-top:1px solid var(--border);padding-top:24px; }

    @media(max-width:900px){
      .hero-section{flex-direction:column;min-height:auto;padding:48px 0}
      .hero-visual{display:none}
      .features-grid{grid-template-columns:repeat(2,1fr)}
      .stats-grid{grid-template-columns:repeat(2,1fr)}
      .subjects-grid{grid-template-columns:repeat(2,1fr)}
      .how-steps{flex-direction:column}
      .how-connector{display:none}
    }
    @media(max-width:600px){
      .features-grid,.subjects-grid{grid-template-columns:1fr}
      .stats-grid{grid-template-columns:repeat(2,1fr)}
    }
  `;
  document.head.appendChild(style);
}
