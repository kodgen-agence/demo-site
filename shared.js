const NAV_HTML = `
<nav id="main-nav">
  <a href="index.html" class="nav-logo">
    <span class="nav-logo-emblem">L</span>
    Lumière <span style="color:var(--gold)">Immobilier</span>
  </a>
  <ul class="nav-links">
    <li><a href="index.html" id="nav-accueil">Accueil</a></li>
    <li><a href="biens.html" id="nav-biens">Nos Biens</a></li>
    <li><a href="agence.html" id="nav-agence">L'Agence</a></li>
    <li><a href="contact.html" id="nav-contact" class="nav-cta">Contact</a></li>
  </ul>
  <button class="nav-hamburger" id="hamburger"><span></span><span></span><span></span></button>
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
      <p class="footer-desc">Agence immobilière premium à Paris et en Île-de-France. Expertise, discrétion et excellence depuis 2008.</p>
    </div>
    <div>
      <div class="footer-col-title">Navigation</div>
      <ul class="footer-links">
        <li><a href="index.html">Accueil</a></li>
        <li><a href="biens.html">Nos Biens</a></li>
        <li><a href="agence.html">L'Agence</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">Services</div>
      <ul class="footer-links">
        <li><a href="biens.html">Achat & Vente</a></li>
        <li><a href="biens.html">Location</a></li>
        <li><a href="contact.html">Estimation gratuite</a></li>
        <li><a href="agence.html">Gestion locative</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">Contact</div>
      <ul class="footer-links">
        <li><a href="tel:0142000000">01 42 00 00 00</a></li>
        <li><a href="mailto:contact@lumiere-immo.fr">contact@lumiere-immo.fr</a></li>
        <li><a>42 Av. des Champs-Élysées, Paris 8e</a></li>
        <li><a>Lun–Ven 9h–19h · Sam 10h–17h</a></li>
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
    <div class="chat-head-avatar">L</div>
    <div class="chat-head-copy">
      <div class="chat-head-name">Lumière Assistant</div>
      <div class="chat-head-status"><span class="dot-live"></span> En ligne · Répond instantanément</div>
    </div>
    <button class="chat-head-close" id="chat-close-btn">×</button>
  </div>
  <div class="chat-body" id="chat-body">
    <div class="chat-date-sep">Aujourd'hui</div>
    <div class="bubble-wrap bot">
      <div class="bubble">Bonjour et bienvenue chez <strong>Lumière Immobilier</strong> ✨<br><br>Je suis votre assistant personnel, disponible 24h/24. Comment puis-je vous aider aujourd'hui ?</div>
      <div class="bubble-time">À l'instant</div>
    </div>
  </div>
  <div class="chat-chips-row" id="chat-chips-row"></div>
  <div class="chat-foot">
    <input type="text" id="chat-in" placeholder="Votre message…" autocomplete="off">
    <button id="chat-send-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    </button>
  </div>
</div>
<a href="https://kodgen.vercel.app" target="_blank" class="kodgen-badge">✦ Réalisé par Kodgen</a>
<button id="btt">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
</button>`;

function initPreloader() {
  const el = document.createElement('div');
  el.id = 'preloader';
  el.innerHTML = `<div class="preloader-logo">L</div><div class="preloader-bar"><div class="preloader-bar-inner" id="pbar"></div></div><div class="preloader-text">Chargement en cours</div>`;
  document.body.prepend(el);
  const bar = document.getElementById('pbar');
  let p = 0;
  const tick = () => { p = Math.min(p + Math.random()*25+10, 90); bar.style.width = p+'%'; };
  tick(); setTimeout(tick,200); setTimeout(tick,500);
  window.addEventListener('load', () => {
    bar.style.width = '100%';
    setTimeout(() => { el.classList.add('done'); setTimeout(() => el.remove(), 700); }, 400);
  });
  setTimeout(() => { if(!el.classList.contains('done')) { bar.style.width='100%'; setTimeout(()=>{el.classList.add('done');setTimeout(()=>el.remove(),700);},300); } }, 4000);
}

function initScrollProgress() {
  const bar = document.createElement('div'); bar.id='scroll-progress'; document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, {passive:true});
}

function initNav() {
  const nav = document.getElementById('main-nav');
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), {passive:true});
  if (ham && menu) {
    ham.addEventListener('click', () => { const o = menu.classList.toggle('open'); ham.classList.toggle('active',o); document.body.style.overflow = o?'hidden':''; });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); ham.classList.remove('active'); document.body.style.overflow=''; }));
  }
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const map = {'index.html':'nav-accueil','biens.html':'nav-biens','agence.html':'nav-agence','contact.html':'nav-contact'};
  const id = map[page]; if(id) { const el=document.getElementById(id); if(el) el.classList.add('active'); }
}

function initBTT() {
  const btn = document.getElementById('btt'); if(!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500), {passive:true});
  btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
}

function initFade() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} });
  }, {threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.fade,.fade-left,.fade-right').forEach(el => obs.observe(el));
}

function initChat() {
  const trigger = document.getElementById('chat-trigger');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close-btn');
  if (!trigger||!panel) return;
  const toggle = () => { panel.classList.toggle('open'); const notif=document.querySelector('.chat-notif'); if(notif)notif.style.display='none'; if(panel.classList.contains('open'))document.getElementById('chat-in').focus(); };
  trigger.addEventListener('click', toggle);
  if(closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('open'));
  document.addEventListener('keydown', e => { if(e.key==='Escape'&&panel.classList.contains('open')) panel.classList.remove('open'); });
}

function injectShell() {
  const n=document.getElementById('nav-placeholder'); if(n) n.outerHTML=NAV_HTML;
  const f=document.getElementById('footer-placeholder'); if(f) f.outerHTML=FOOTER_HTML;
  const c=document.getElementById('chat-placeholder'); if(c) c.outerHTML=CHATBOT_HTML;
  
  // Inject demo banner
  const banner = document.createElement('div');
  banner.id = 'demo-banner';
  banner.innerHTML = `
    <div class="demo-banner-text">
      ✦ Ceci est un <strong>site de démonstration</strong> réalisé par Kodgen — le chatbot est alimenté par IA
    </div>
    <a href="https://kodgen.vercel.app" target="_blank" class="demo-banner-link">Voir nos offres →</a>
  `;
  document.body.prepend(banner);
  document.body.classList.add('has-demo-banner');
}

document.addEventListener('DOMContentLoaded', () => {
  injectShell();
  initPreloader();
  initScrollProgress();
  initNav();
  initBTT();
  initFade();
  initChat();
});
