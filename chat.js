// chat.js — Lumière Immobilier Chatbot
// Appelle /api/chat (Vercel Function) → Anthropic Claude

let conversationHistory = [];

const STARTER_CHIPS = [
  "Voir les biens disponibles",
  "Estimer mon bien gratuitement",
  "Prendre rendez-vous",
  "Conseils pour acheter"
];

const PROPERTY_DATA = [
  { ref:'LI-2401', title:'Appartement Haussmannien 4P', loc:'Paris 8e', price:'1 290 000 €', type:'vente', surface:'120m²', rooms:4, bedrooms:3, img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80', tag:'Coup de cœur' },
  { ref:'LI-2402', title:'Loft contemporain 3P', loc:'Neuilly-sur-Seine', price:'3 200 €/mois', type:'location', surface:'85m²', rooms:3, bedrooms:2, img:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80', tag:'Location' },
  { ref:'LI-2403', title:'Duplex lumineux 3P', loc:'Boulogne-Billancourt', price:'680 000 €', type:'vente', surface:'75m²', rooms:3, bedrooms:2, img:'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=80', tag:'Nouveau' },
  { ref:'LI-2404', title:'Studio optimisé', loc:'Paris 15e', price:'1 400 €/mois', type:'location', surface:'32m²', rooms:1, bedrooms:0, img:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&q=80', tag:'Location' },
  { ref:'LI-2405', title:'Maison familiale 6P', loc:'Saint-Cloud', price:'1 850 000 €', type:'vente', surface:'180m²', rooms:6, bedrooms:4, img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=80', tag:'Exclusivité' },
];

// ── UTILS ──────────────────────────────────────────────────────
function getTime() {
  const d = new Date();
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2,'0')}`;
}

function chatBody() { return document.getElementById('chat-body'); }

// ── RENDERING ─────────────────────────────────────────────────
function addBubble(html, role, chips = []) {
  const body = chatBody();

  // Remove old inline chips
  body.querySelectorAll('.chips-inline').forEach(el => el.remove());

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

  if (chips.length) {
    const cw = document.createElement('div');
    cw.className = 'chips chips-inline bubble-wrap bot';
    chips.forEach(c => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.textContent = c;
      b.onclick = () => handleChip(c);
      cw.appendChild(b);
    });
    body.appendChild(cw);
  }

  body.scrollTop = body.scrollHeight;
}

function showTyping() {
  const body = chatBody();
  const w = document.createElement('div');
  w.className = 'typing-wrap bubble-wrap bot';
  w.id = 'typing-indicator';
  w.innerHTML = '<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  body.appendChild(w);
  body.scrollTop = body.scrollHeight;
}
function removeTyping() { document.getElementById('typing-indicator')?.remove(); }

function renderStarterChips() {
  const row = document.getElementById('chat-chips-row');
  if (!row) return;
  row.innerHTML = '';
  STARTER_CHIPS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = c;
    b.onclick = () => handleChip(c);
    row.appendChild(b);
  });
}
function clearStarterChips() {
  const row = document.getElementById('chat-chips-row');
  if (row) row.innerHTML = '';
}

// ── PROPERTY CARDS ────────────────────────────────────────────
function detectAndShowProperties(userMsg, botReply) {
  const t = (userMsg + ' ' + botReply).toLowerCase();

  // Only show cards if conversation is about properties
  const isAboutProperties = /(bien|appart|maison|loft|duplex|studio|disponible|sélection|voir les biens|li-24\d\d)/i.test(t);
  if (!isAboutProperties) return;

  let props = [...PROPERTY_DATA];

  // Filter by transaction type
  if (/(louer|location|locataire|à louer)/i.test(t)) props = props.filter(p => p.type === 'location');
  else if (/(acheter|achat|à vendre|acquisition)/i.test(t)) props = props.filter(p => p.type === 'vente');

  // Filter by zone
  if (/neuilly/i.test(t)) props = props.filter(p => /neuilly/i.test(p.loc));
  else if (/boulogne/i.test(t)) props = props.filter(p => /boulogne/i.test(p.loc));
  else if (/saint.cloud/i.test(t)) props = props.filter(p => /saint.cloud/i.test(p.loc));
  else if (/paris\s*15|15[eè]/i.test(t)) props = props.filter(p => /paris 15/i.test(p.loc));
  else if (/paris\s*8|8[eè]/i.test(t)) props = props.filter(p => /paris 8/i.test(p.loc));

  // Filter by rough budget (vente)
  const budgetM = t.match(/(\d[\d\s]*)\s*(million|md|m€)/i);
  const budgetK = t.match(/(\d[\d\s]*)\s*(000\s*€|k€|000€)/i);
  let budget = null;
  if (budgetM) budget = parseFloat(budgetM[1].replace(/\s/g,'')) * 1000000;
  else if (budgetK) budget = parseFloat(budgetK[1].replace(/\s/g,'')) * 1000;
  if (budget) {
    props = props.filter(p => {
      const n = parseInt(p.price.replace(/[^\d]/g,''));
      return n <= budget * 1.2;
    });
  }

  if (props.length === 0 || props.length > 4) {
    // Show all if no filter matched but user asked to see biens
    props = PROPERTY_DATA.slice(0,3);
  }

  setTimeout(() => appendPropertyCards(props), 350);
}

function appendPropertyCards(props) {
  if (!props?.length) return;
  const body = chatBody();
  // Don't double-add
  if (body.querySelector('.chat-rich-block')) {
    body.querySelector('.chat-rich-block')?.closest('.bubble-wrap')?.remove();
  }
  const wrap = document.createElement('div');
  wrap.className = 'bubble-wrap bot chat-extra-wrap';
  wrap.innerHTML = `
    <div class="chat-rich-block">
      <div class="chat-rich-title">✦ Sélection du moment</div>
      <div class="chat-property-grid">
        ${props.map(p => `
          <div class="chat-property-card">
            <div class="chat-property-image" style="background-image:url('${p.img}')">
              <div class="chat-prop-tag">${p.tag}</div>
            </div>
            <div class="chat-property-body">
              <div class="chat-property-name">${p.title}</div>
              <div class="chat-property-location">📍 ${p.loc}</div>
              <div class="chat-property-price">${p.price}</div>
              <div class="chat-property-specs">${p.surface} · ${p.rooms}P${p.bedrooms > 0 ? ` · ${p.bedrooms}ch` : ''}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;
}

// ── SMART FOLLOW-UP CHIPS ──────────────────────────────────────
function getFollowUpChips(userMsg, botReply) {
  const t = (userMsg + ' ' + botReply).toLowerCase();
  if (/(visite|organiser|disponib)/i.test(t)) return ["Choisir mes disponibilités", "Voir d'autres biens", "Poser une question sur le bien"];
  if (/(estimation|estimer|vendre|valeur)/i.test(t)) return ["Programmer l'estimation", "Comment se passe l'estimation ?", "Nos honoraires de vente"];
  if (/(financ|prêt|crédit|budget|emprunt|capacité)/i.test(t)) return ["Calculer mon budget", "Voir les biens", "Parler à un conseiller"];
  if (/(location|louer|locataire)/i.test(t)) return ["Voir les biens en location", "Organiser une visite", "Questions sur le dossier"];
  if (/(invest|rendement|locatif|rentab)/i.test(t)) return ["Biens à fort rendement", "Parler à un expert", "Fiscalité investissement"];
  if (/(honoraire|commission|frais|notaire)/i.test(t)) return ["Estimation gratuite", "Voir nos biens", "Prendre RDV"];
  if (/(quartier|arrondissement|zone|secteur)/i.test(t)) return ["Voir les biens par secteur", "Conseils d'achat", "Prendre RDV"];
  if (/(dpe|diagnostic|énergie|travaux)/i.test(t)) return ["Voir nos biens", "Parler à un conseiller", "Estimation gratuite"];
  return ["Voir les biens disponibles", "Estimation gratuite", "Prendre rendez-vous"];
}

// ── API CALL ──────────────────────────────────────────────────
async function askBot(userMessage) {
  conversationHistory.push({ role: 'user', content: userMessage });

  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 12000);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory }),
      signal: ctrl.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'HTTP ' + res.status);
    }

    const data = await res.json();
    const reply = data.reply;

    if (!reply) throw new Error('Empty reply');

    conversationHistory.push({ role: 'assistant', content: reply });
    if (conversationHistory.length > 30) conversationHistory = conversationHistory.slice(-28);

    return reply;

  } catch (err) {
    console.error('[Chatbot] Error:', err.message);
    // Contextual fallback
    const t = userMessage.toLowerCase();
    if (/(horaire|ouvert|fermé|heure)/i.test(t)) {
      return `Nous sommes ouverts <strong>lun–ven 9h–19h</strong> et le <strong>sam 10h–17h</strong>.<br>📞 <strong>01 42 00 00 00</strong> · ✉️ contact@lumiere-immo.fr`;
    }
    if (/(estimation|estimer|vendre)/i.test(t)) {
      return `Nous proposons une <strong>estimation gratuite sous 48h</strong> par un expert local.<br>Appelez le <strong>01 42 00 00 00</strong> ou remplissez notre formulaire de contact.`;
    }
    return `Je rencontre un souci technique passager. Contactez-nous directement :<br>📞 <strong>01 42 00 00 00</strong> · lun–ven 9h–19h<br>✉️ contact@lumiere-immo.fr`;
  }
}

// ── CORE FLOW ─────────────────────────────────────────────────
async function processMessage(msg) {
  if (!msg.trim()) return;

  const input = document.getElementById('chat-in');
  const sendBtn = document.getElementById('chat-send-btn');

  clearStarterChips();
  chatBody().querySelectorAll('.chips-inline').forEach(el => el.remove());

  addBubble(msg, 'user');
  input.disabled = true;
  sendBtn.disabled = true;
  showTyping();

  const reply = await askBot(msg);
  removeTyping();

  const chips = getFollowUpChips(msg, reply);
  addBubble(reply, 'bot', chips);

  detectAndShowProperties(msg, reply);

  input.disabled = false;
  sendBtn.disabled = false;
  input.focus();
}

async function sendMsg() {
  const input = document.getElementById('chat-in');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  await processMessage(msg);
}

async function handleChip(text) {
  await processMessage(text);
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chat-in');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
    });
  }
  document.getElementById('chat-send-btn')?.addEventListener('click', sendMsg);
  setTimeout(renderStarterChips, 150);
});
