// shared.js — injecte nav, footer, chatbot dans toutes les pages

const NAV_HTML = `
<nav id="main-nav">
  <a href="index.html" class="nav-logo">
    <span class="nav-logo-mark">L</span>
    Lumière <span style="color:var(--gold)">Immobilier</span>
  </a>
  <ul class="nav-links">
    <li><a href="index.html" id="nav-accueil">Accueil</a></li>
    <li><a href="biens.html" id="nav-biens">Nos Biens</a></li>
    <li><a href="agence.html" id="nav-agence">L'Agence</a></li>
    <li><a href="contact.html" id="nav-contact" class="nav-cta-link">Contact</a></li>
  </ul>
  <button class="nav-hamburger" id="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>
<nav class="mobile-menu" id="mobile-menu">
  <a href="index.html">Accueil</a>
  <a href="biens.html">Nos Biens</a>
  <a href="agence.html">L'Agence</a>
  <a href="contact.html">Contact</a>
</nav>`;

const FOOTER_HTML = `
<footer>
  <div class="footer-grid">
    <div>
      <div class="footer-logo">Lumière <span>Immobilier</span></div>
      <p class="footer-desc">Agence immobilière premium à Paris et en Île-de-France. Nous accompagnons particuliers et investisseurs depuis 2008.</p>
    </div>
    <div>
      <div class="footer-col-title">Navigation</div>
      <ul class="footer-links">
        <li><a href="index.html">→ Accueil</a></li>
        <li><a href="biens.html">→ Nos Biens</a></li>
        <li><a href="agence.html">→ L'Agence</a></li>
        <li><a href="contact.html">→ Contact</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">Nos services</div>
      <ul class="footer-links">
        <li><a href="biens.html">→ Achat</a></li>
        <li><a href="biens.html">→ Location</a></li>
        <li><a href="contact.html">→ Estimation gratuite</a></li>
        <li><a href="agence.html">→ Gestion locative</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">Contact</div>
      <ul class="footer-links">
        <li><a href="tel:0142000000">📞 01 42 00 00 00</a></li>
        <li><a href="mailto:contact@lumiere-immo.fr">✉️ contact@lumiere-immo.fr</a></li>
        <li><a href="#">📍 42 Av. des Champs-Élysées, Paris 8e</a></li>
        <li><a href="#">🕐 Lun–Ven 9h–19h · Sam 10h–17h</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copy">© 2025 Lumière Immobilier — Tous droits réservés</div>
    <div class="footer-kodgen">✦ Site réalisé par Kodgen — kodgen.vercel.app</div>
  </div>
</footer>`;

const CHATBOT_HTML = `
<button id="chat-trigger" aria-label="Ouvrir le chat">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
  <span class="chat-notif">1</span>
</button>
<div id="chat-panel">
  <div class="chat-head">
    <div class="chat-head-avatar">✨</div>
    <div>
      <div class="chat-head-name">Lumière Assistant</div>
      <div class="chat-head-status"><span class="dot-live"></span> En ligne · Répond en quelques secondes</div>
    </div>
    <button class="chat-head-close" id="chat-close-btn" aria-label="Fermer">×</button>
  </div>
  <div class="chat-body" id="chat-body">
    <div class="chat-date-sep">Aujourd'hui</div>
    <div class="bubble-wrap bot">
      <div class="bubble">Bonjour et bienvenue chez <strong>Lumière Immobilier</strong> ! 👋<br><br>Je suis votre assistant virtuel, disponible 24h/24. Je peux vous aider à trouver un bien, obtenir une estimation ou prendre rendez-vous.</div>
      <div class="bubble-time">À l'instant</div>
    </div>
  </div>
  <div class="chat-chips-row" id="chat-chips-row"></div>
  <div class="chat-foot">
    <input type="text" id="chat-in" placeholder="Votre message…" autocomplete="off">
    <button id="chat-send-btn" aria-label="Envoyer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    </button>
  </div>
</div>
<a href="https://kodgen.vercel.app" target="_blank" class="kodgen-badge">✦ Site réalisé par Kodgen</a>
<button id="btt" aria-label="Retour en haut">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
</button>`;

// ── FADE CSS ──
const FADE_CSS = `
.fade { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
.fade.visible { opacity: 1; transform: translateY(0); }
.fade-d1 { transition-delay: 0.1s; }
.fade-d2 { transition-delay: 0.2s; }
.fade-d3 { transition-delay: 0.3s; }
.fade-d4 { transition-delay: 0.4s; }
`;

document.addEventListener('DOMContentLoaded', () => {
  // Inject nav
  const navEl = document.getElementById('nav-placeholder');
  if (navEl) navEl.outerHTML = NAV_HTML;

  // Inject footer
  const footEl = document.getElementById('footer-placeholder');
  if (footEl) footEl.outerHTML = FOOTER_HTML;

  // Inject chatbot
  const chatEl = document.getElementById('chat-placeholder');
  if (chatEl) chatEl.outerHTML = CHATBOT_HTML;

  // Inject fade CSS
  const style = document.createElement('style');
  style.textContent = FADE_CSS;
  document.head.appendChild(style);

  // Active nav link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const map = { 'index.html': 'nav-accueil', 'biens.html': 'nav-biens', 'agence.html': 'nav-agence', 'contact.html': 'nav-contact' };
  const activeId = map[page];
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) el.classList.add('active');
  }
});
