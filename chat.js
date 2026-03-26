// ── LUMIÈRE IMMOBILIER — CHATBOT IA (Groq / Llama) ──

// Historique de la conversation pour le contexte
let conversationHistory = [];

// Chips de démarrage rapide
const STARTER_CHIPS = ["Voir les biens", "Estimer mon bien", "Prendre RDV", "Vos horaires"];

function getTime() {
  const d = new Date();
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2,'0')}`;
}

// ── BULLES ──
function addBubble(html, role, chips = []) {
  const body = document.getElementById('chat-body');

  const wrap = document.createElement('div');
  wrap.className = `bubble-wrap ${role}`;

  const bub = document.createElement('div');
  bub.className = 'bubble';
  bub.innerHTML = html;

  const time = document.createElement('div');
  time.className = 'bubble-time';
  time.textContent = getTime();

  wrap.appendChild(bub);
  wrap.appendChild(time);
  body.appendChild(wrap);

  if (chips.length > 0) {
    const chipsWrap = document.createElement('div');
    chipsWrap.className = 'chips bubble-wrap bot';
    chips.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = c;
      btn.onclick = () => handleChip(c, chipsWrap);
      chipsWrap.appendChild(btn);
    });
    body.appendChild(chipsWrap);
  }

  body.scrollTop = body.scrollHeight;
}

function showTyping() {
  const body = document.getElementById('chat-body');
  const wrap = document.createElement('div');
  wrap.className = 'typing-wrap bubble-wrap bot';
  wrap.id = 'typing-indicator';
  wrap.innerHTML = `<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

function renderChips(chips) {
  const row = document.getElementById('chat-chips-row');
  row.innerHTML = '';
  chips.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = c;
    btn.onclick = () => handleChip(c, null);
    row.appendChild(btn);
  });
}

function clearChipsRow() {
  document.getElementById('chat-chips-row').innerHTML = '';
}

// ── APPEL API GROQ via Vercel Function ──
async function askGroq(userMessage) {
  // Ajoute le message au contexte
  conversationHistory.push({ role: 'user', content: userMessage });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory }),
    });

    if (!response.ok) throw new Error('Erreur réseau');

    const data = await response.json();
    const reply = data.reply || "Je n'ai pas pu générer une réponse, veuillez réessayer.";

    // Ajoute la réponse au contexte (pour la mémoire)
    conversationHistory.push({ role: 'assistant', content: reply });

    // Garde l'historique raisonnable (max 20 messages)
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    return reply;

  } catch (err) {
    console.error('Groq error:', err);
    return `Je rencontre une difficulté technique. 😕<br>Contactez-nous directement au <strong>01 42 00 00 00</strong> ou à <strong>contact@lumiere-immo.fr</strong> — nous répondons en moins de 24h.`;
  }
}

// ── ENVOI MESSAGE ──
async function sendMsg() {
  const input = document.getElementById('chat-in');
  const msg = input.value.trim();
  if (!msg) return;

  clearChipsRow();
  addBubble(msg, 'user');
  input.value = '';
  input.disabled = true;
  document.getElementById('chat-send-btn').disabled = true;

  showTyping();

  const reply = await askGroq(msg);

  removeTyping();
  addBubble(reply, 'bot');

  input.disabled = false;
  document.getElementById('chat-send-btn').disabled = false;
  input.focus();
}

// ── CHIP CLICK ──
async function handleChip(text, chipWrap) {
  if (chipWrap) chipWrap.remove();
  clearChipsRow();
  addBubble(text, 'user');

  const input = document.getElementById('chat-in');
  input.disabled = true;
  document.getElementById('chat-send-btn').disabled = true;

  showTyping();

  const reply = await askGroq(text);

  removeTyping();
  addBubble(reply, 'bot');

  input.disabled = false;
  document.getElementById('chat-send-btn').disabled = false;
}

// ── INIT CHAT ──
let chatIsOpen = false;

function initChat() {
  document.getElementById('chat-trigger').addEventListener('click', togglePanel);
  document.getElementById('chat-close-btn').addEventListener('click', togglePanel);
  document.getElementById('chat-send-btn').addEventListener('click', sendMsg);
  document.getElementById('chat-in').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) sendMsg();
  });

  renderChips(STARTER_CHIPS);
}

function togglePanel() {
  chatIsOpen = !chatIsOpen;
  document.getElementById('chat-panel').classList.toggle('open', chatIsOpen);
  const notif = document.querySelector('.chat-notif');
  if (notif) notif.style.display = 'none';
  if (chatIsOpen) document.getElementById('chat-in').focus();
}

// ── NAV SCROLL ──
function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (ham && menu) {
    ham.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }
}

// ── BACK TO TOP ──
function initBTT() {
  const btn = document.getElementById('btt');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── FADE IN ──
function initFade() {
  const els = document.querySelectorAll('.fade');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ── DÉMARRAGE ──
document.addEventListener('DOMContentLoaded', () => {
  initChat();
  initNav();
  initBTT();
  initFade();
});
