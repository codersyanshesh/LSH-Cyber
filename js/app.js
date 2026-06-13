/* ============================================================
   LESLIE S. HULAR PORTFOLIO — Main Application Logic
   ============================================================ */

'use strict';

/* ─── EMAILJS CREDENTIALS ─────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = 'HUJnMa-0MjLP3ol0E'; // ✅ Set
const EMAILJS_SERVICE_ID  = 'service_z3zd81q';    // ✅ Set
const EMAILJS_TEMPLATE_ID = 'template_2iml64d';   // ✅ Set
const PORTFOLIO_EMAIL     = 'sayson.hular@gmail.com';

// Initialize EmailJS once the script is ready
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

/* ─── TYPEWRITER ──────────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'SOC Analyst | Blue Team',
    'GRC & Compliance Practitioner',
    'WAF & EAS Defender',
    'Threat Intelligence Operator',
    'Future Accenture Innovator'
  ];
  let pi = 0, ci = 0, deleting = false;
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 2200); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 42 : 68);
  }
  tick();
})();

/* ─── NAVBAR SCROLL ───────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active link highlighting
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  // Mobile toggle
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

/* ─── SMOOTH SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ─── REVEAL ON SCROLL ────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => obs.observe(el));
})();

/* ─── SKILL BARS ──────────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        const w    = fill.dataset.width || '0%';
        // Slight delay so transition fires after paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { fill.style.width = w; });
        });
        obs.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
})();

/* ─── COUNTER ANIMATION ───────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      const start  = performance.now();
      function step(now) {
        const p  = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (Number.isInteger(target)
          ? Math.round(target * ease)
          : (target * ease).toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => obs.observe(c));
})();

/* ─── TTO SIMULATOR ───────────────────────────────────────── */
(function initTTO() {
  const MAX_TIME  = 59; // seconds (TTO requirement < 1 min)
  const KILL_CHAINS = [
    'Initial Access', 'Persistence', 'Exploration', 'Propagation', 'Exfiltration'
  ];

  const alerts = [
    {
      stage: 0, severity: 'CRITICAL',
      headline: 'Suspicious Phishing Email Detected',
      detail: 'Multiple users received a spoofed email mimicking internal IT helpdesk. Malicious attachment detected (macro-enabled .xlsm). Source IP: 185.220.101.x',
      meta: { src: '185.220.101.42', dst: 'user@domain.com', protocol: 'SMTP', port: '25' },
      options: [
        { text: '🛡 Quarantine email & block sender IP in WAF', correct: true },
        { text: '📝 Log and monitor — may be false positive', correct: false },
        { text: '🔄 Forward to user for verification', correct: false },
        { text: '📧 Reply to sender requesting clarification', correct: false },
      ]
    },
    {
      stage: 1, severity: 'HIGH',
      headline: 'Scheduled Task Persistence Mechanism Found',
      detail: 'Anomalous scheduled task "WindowsUpdate_Helper.exe" created by a standard user account. Task set to execute at every logon from non-standard path: C:\\Users\\Public\\...',
      meta: { host: 'WORKSTATION-17', user: 'jsmith', task: 'WindowsUpdate_Helper', path: 'C:\\Users\\Public' },
      options: [
        { text: '⚡ Isolate host, remove task, reset credentials', correct: true },
        { text: '👀 Monitor the task for 24 hours first', correct: false },
        { text: '🔔 Notify user to verify if they created it', correct: false },
        { text: '📋 Document and review in next EOM report', correct: false },
      ]
    },
    {
      stage: 2, severity: 'HIGH',
      headline: 'Lateral Movement — Port Scan Detected',
      detail: 'Host WORKSTATION-17 initiated an aggressive internal port scan across subnet 10.0.0.0/24 on ports 22, 445, 3389. Behavior consistent with network reconnaissance tools.',
      meta: { src: '10.0.0.17', target: '10.0.0.0/24', ports: '22,445,3389', duration: '3m 20s' },
      options: [
        { text: '🔒 Block outbound from host via WAF, alert IR team', correct: true },
        { text: '📊 Run a full vulnerability scan on all hosts', correct: false },
        { text: '🔄 Reboot affected workstation', correct: false },
        { text: '📞 Call user and ask about activity', correct: false },
      ]
    },
    {
      stage: 3, severity: 'CRITICAL',
      headline: 'Credential Dumping — LSASS Access Attempt',
      detail: 'Process "svchost32.exe" (PID 4821) attempted to access LSASS memory via OpenProcess API. Mimikatz behavioral signature matched. Source: WORKSTATION-17.',
      meta: { process: 'svchost32.exe', pid: '4821', target: 'LSASS', signature: 'Mimikatz_v2x' },
      options: [
        { text: '🚨 Kill process, isolate host, escalate to Tier 2', correct: true },
        { text: '⏱ Wait for AV to auto-quarantine', correct: false },
        { text: '🔁 Restart the LSASS service', correct: false },
        { text: '📝 Create ticket for next-day review', correct: false },
      ]
    },
    {
      stage: 4, severity: 'CRITICAL',
      headline: 'Data Exfiltration — Abnormal Outbound Traffic',
      detail: 'SIEM flagged 4.7GB of outbound encrypted traffic to known C2 IP 203.0.113.99 (geolocation: RU). Transfer occurred via HTTPS on non-standard port 8443.',
      meta: { src: '10.0.0.17', dst: '203.0.113.99', volume: '4.7 GB', port: '8443' },
      options: [
        { text: '🔴 Block C2 IP on perimeter firewall, preserve forensics', correct: true },
        { text: '🔍 Investigate traffic source only after business hours', correct: false },
        { text: '📶 Throttle bandwidth for that host', correct: false },
        { text: '🗑 Delete outbound rule and monitor', correct: false },
      ]
    },
  ];

  let currentAlertIdx = 0;
  let timerInterval   = null;
  let secondsLeft     = MAX_TIME;
  let score           = 0;
  let running         = false;
  let currentStage    = 0;

  const startBtn      = document.getElementById('tto-start-btn');
  const alertBox      = document.getElementById('tto-alert-box');
  const alertSev      = document.getElementById('tto-alert-sev');
  const alertHeadline = document.getElementById('tto-alert-headline');
  const alertDetail   = document.getElementById('tto-alert-detail');
  const alertMeta     = document.getElementById('tto-alert-meta');
  const respBtns      = document.querySelectorAll('.tto-resp-btn');
  const ringFill      = document.getElementById('tto-ring-fill');
  const ringTime      = document.getElementById('tto-ring-time');
  const scoreEl       = document.getElementById('tto-score');
  const logEl         = document.getElementById('tto-log');
  const stageEls      = document.querySelectorAll('.kc-stage');

  const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54

  function formatTime(s) {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  }

  function addLog(msg, type = '') {
    if (!logEl) return;
    const now    = new Date();
    const ts     = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    const entry  = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-ts">[${ts}]</span> <span class="${type}">${msg}</span>`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function loadAlert(idx) {
    const a = alerts[idx];
    if (!a) return;
    alertSev.style.cssText = ''; // Clear inline styles from endGame override
    alertBox.className = 'tto-alert-box threat';
    setTimeout(() => alertBox.classList.remove('threat'), 600);

    const sevClass = a.severity === 'CRITICAL' ? 'sev-critical' : 'sev-high';
    alertSev.className  = `alert-severity ${sevClass}`;
    alertSev.textContent = a.severity;
    alertHeadline.textContent = a.headline;
    alertDetail.textContent   = a.detail;

    // Build meta
    alertMeta.innerHTML = Object.entries(a.meta)
      .map(([k,v]) => `<span>${k.toUpperCase()}: <b>${v}</b></span>`)
      .join('');

    // Load options
    respBtns.forEach((btn, i) => {
      btn.textContent = a.options[i] ? a.options[i].text : '';
      btn.className   = 'tto-resp-btn';
      btn.dataset.idx = i;
      btn.disabled    = false;
    });

    // Highlight kill chain stage
    stageEls.forEach((el, i) => {
      el.className = 'kc-stage';
      if (i < idx) el.classList.add('completed-stage');
      else if (i === idx) el.classList.add('active-stage');
    });

    addLog(`[ALERT] ${a.headline}`, 'log-warn');
    secondsLeft = MAX_TIME;
    updateClock();
    startTimer();
  }

  function updateClock() {
    if (!ringFill || !ringTime) return;
    const ratio  = secondsLeft / MAX_TIME;
    const offset = CIRCUMFERENCE * (1 - ratio);
    ringFill.style.strokeDashoffset = offset;
    ringTime.textContent = formatTime(secondsLeft);

    // Color states
    if (secondsLeft > 30) {
      ringFill.style.stroke = '#00ff88';
    } else if (secondsLeft > 15) {
      ringFill.style.stroke = '#ffd700';
    } else {
      ringFill.style.stroke = '#ff3355';
    }
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsLeft--;
      updateClock();
      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        addLog('[TIMEOUT] TTO exceeded! Threat escalated.', 'log-err');
        respBtns.forEach(b => b.disabled = true);
        setTimeout(nextAlert, 1800);
      }
    }, 1000);
  }

  function nextAlert() {
    currentAlertIdx++;
    if (currentAlertIdx >= alerts.length) {
      endGame();
      return;
    }
    loadAlert(currentAlertIdx);
  }

  function endGame() {
    clearInterval(timerInterval);
    alertBox.className = 'tto-alert-box contained';
    alertSev.className  = 'alert-severity';
    alertSev.style.cssText = 'color:#00ff88;background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.3)';
    alertSev.textContent   = 'EXERCISE COMPLETE';
    alertHeadline.textContent = '🏆 All 5 Kill Chains Neutralized';
    alertDetail.textContent   = `You scored ${score} out of 500 points. This simulation reflects Leslie's real-world TTO discipline: respond, contain, and report — all under 60 seconds.`;
    alertMeta.innerHTML = `<span>FINAL SCORE: <b>${score} pts</b></span><span>RATING: <b>${score >= 400 ? 'ELITE' : score >= 300 ? 'PROFICIENT' : 'TRAINEE'}</b></span>`;
    respBtns.forEach(b => b.disabled = true);
    startBtn.textContent = '↺ RESTART SIMULATION';
    startBtn.disabled    = false;
    running = false;
    addLog(`[SIM END] Score: ${score}/500`, 'log-ok');
  }

  // Handle responses
  respBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!running) return;
      const idx = parseInt(btn.dataset.idx);
      const a   = alerts[currentAlertIdx];
      clearInterval(timerInterval);

      respBtns.forEach(b => b.disabled = true);

      if (a.options[idx] && a.options[idx].correct) {
        btn.classList.add('correct');
        const pts = Math.max(10, Math.round((secondsLeft / MAX_TIME) * 100));
        score += pts;
        if (scoreEl) scoreEl.textContent = score;
        addLog(`[CORRECT] +${pts} pts — "${a.options[idx].text.slice(2)}"`, 'log-ok');
      } else {
        btn.classList.add('wrong');
        // Highlight correct answer
        respBtns.forEach((b, i) => {
          if (a.options[i] && a.options[i].correct) b.classList.add('correct');
        });
        addLog(`[INCORRECT] Wrong response — threat escalated`, 'log-err');
      }

      setTimeout(nextAlert, 1600);
    });
  });

  // Start / Restart
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (running) return;
      running         = true;
      currentAlertIdx = 0;
      score           = 0;
      if (scoreEl) scoreEl.textContent = '0';
      if (logEl)   logEl.innerHTML     = '';
      startBtn.disabled = true;
      startBtn.textContent = 'SIMULATION ACTIVE...';
      stageEls.forEach(el => el.className = 'kc-stage');
      addLog('[SIM START] TTO Triage Exercise initiated — GOOD LUCK.', 'log-ok');
      setTimeout(() => loadAlert(0), 500);
    });
  }

  // Init ring display
  if (ringFill) {
    ringFill.style.strokeDasharray  = CIRCUMFERENCE;
    ringFill.style.strokeDashoffset = 0;
  }
})();

/* ─── CERTIFICATE MODAL ───────────────────────────────────── */
(function initCertModal() {
  const modal    = document.getElementById('cert-modal');
  const backdrop = document.getElementById('cert-modal-backdrop');
  const img      = document.getElementById('cert-modal-img');
  const name     = document.getElementById('cert-modal-name');
  const meta     = document.getElementById('cert-modal-meta');
  const closeBtn = document.getElementById('cert-modal-close');

  function openModal(card) {
    img.src          = card.dataset.img;
    img.alt          = card.dataset.name;
    name.textContent = card.dataset.name;
    meta.textContent = card.dataset.meta;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  document.querySelectorAll('.cert-card[role="button"]').forEach(card => {
    card.addEventListener('click', () => openModal(card));
    // Keyboard: Enter or Space activates the card
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ─── CONTACT FORM (EmailJS) ───────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const btn = form.querySelector('.btn');
    if (btn.disabled) return;

    // ── Build parameters matching your EmailJS template variables ──
    const templateParams = {
      name    : form.querySelector('#contact-name').value.trim(),
      email   : form.querySelector('#contact-email').value.trim(),
      title   : form.querySelector('#contact-subject').value.trim() || 'Portfolio Inquiry',
      message : form.querySelector('#contact-message').value.trim(),
    };

    // ── Sending state ──
    btn.disabled = true;
    btn.textContent = '📡 TRANSMITTING...';
    btn.style.background = 'linear-gradient(135deg,#005588,#00c8ff)';
    if (statusEl) statusEl.textContent = '';

    // ── EmailJS configured? Send via API; otherwise show fallback ──
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        btn.textContent = '✅ TRANSMISSION COMPLETE';
        btn.style.background = 'linear-gradient(135deg,#00a854,#00ff88)';
        btn.style.color = '#020810';
        if (statusEl) { statusEl.textContent = `Message sent to ${PORTFOLIO_EMAIL} — you will receive a reply soon.`; statusEl.className = 'form-status ok'; }
        setTimeout(() => {
          btn.textContent = '📡 TRANSMIT MESSAGE';
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
          form.reset();
          if (statusEl) statusEl.textContent = '';
        }, 4000);
      } catch (err) {
        const errMsg = err?.text || err?.message || JSON.stringify(err) || 'Unknown error';
        console.error('EmailJS error:', errMsg, err);
        btn.textContent = '⚠ TRANSMISSION FAILED — RETRY';
        btn.style.background = 'linear-gradient(135deg,#880022,#ff3355)';
        btn.style.color = '#fff';
        btn.disabled = false;
        if (statusEl) { statusEl.textContent = 'Send failed (' + errMsg + '). Email directly: ' + PORTFOLIO_EMAIL; statusEl.className = 'form-status err'; }
        setTimeout(() => { btn.textContent = '📡 TRANSMIT MESSAGE'; btn.style.background = ''; btn.style.color = ''; if(statusEl) statusEl.textContent=''; }, 6000);
      }
    } else {
      // ── Fallback: open default mail client if EmailJS not configured ──
      const mailtoLink = `mailto:${PORTFOLIO_EMAIL}?subject=${encodeURIComponent(templateParams.title)}&body=${encodeURIComponent('From: ' + templateParams.name + ' <' + templateParams.email + '>\n\n' + templateParams.message)}`;
      window.location.href = mailtoLink;
      btn.textContent = '📧 OPENING MAIL CLIENT...';
      btn.style.background = 'linear-gradient(135deg,#b8960a,#ffd700)';
      setTimeout(() => { btn.textContent = '📡 TRANSMIT MESSAGE'; btn.style.background = ''; btn.disabled = false; form.reset(); }, 3000);
    }
  });
})();

/* ─── 3D CARD TILT ────────────────────────────────────────── */
(function initCardTilt() {
  document.querySelectorAll('.project-card, .intel-panel').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
