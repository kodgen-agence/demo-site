// ── LUMIÈRE IMMOBILIER — CHATBOT IA ──
// Base de connaissances complète de l'agence

const AGENCE = {
  nom: "Lumière Immobilier",
  tel: "01 42 00 00 00",
  email: "contact@lumiere-immo.fr",
  adresse: "42 Avenue des Champs-Élysées, Paris 8e",
  horaires: "Lun–Ven 9h–19h · Sam 10h–17h",
  zones: ["Paris", "Neuilly-sur-Seine", "Boulogne-Billancourt", "Levallois-Perret", "Saint-Cloud", "Vincennes", "Île-de-France"],
};

// Catalogue de biens
const BIENS = [
  { id: 1, type: "Appartement Haussmannien", pieces: 4, surface: 120, prix: "1 290 000 €", lieu: "Paris 8e", statut: "Vente", chambres: 3, etage: "3e étage avec ascenseur", detail: "Bel appartement Haussmannien entièrement rénové, parquet ancien, moulures, double exposition." },
  { id: 2, type: "Loft moderne", pieces: 3, surface: 85, prix: "3 200 €/mois", lieu: "Neuilly-sur-Seine", statut: "Location", chambres: 2, etage: "2e étage", detail: "Loft moderne avec terrasse de 12m², cuisine ouverte, lumineux." },
  { id: 3, type: "Duplex", pieces: 3, surface: 75, prix: "680 000 €", lieu: "Boulogne-Billancourt", statut: "Vente", chambres: 2, etage: "Duplex 4e/5e", detail: "Duplex traversant, vue dégagée, parking inclus, proche métro." },
  { id: 4, type: "Studio", pieces: 1, surface: 32, prix: "1 400 €/mois", lieu: "Paris 15e", statut: "Location", chambres: 0, etage: "1er étage", detail: "Studio refait à neuf, calme, proche commodités." },
  { id: 5, type: "Maison", pieces: 6, surface: 180, prix: "1 850 000 €", lieu: "Saint-Cloud", statut: "Vente", chambres: 4, etage: "Plain-pied + étage", detail: "Belle maison avec jardin de 300m², garage double, quartier résidentiel calme." },
];

// ── MOTEUR DE RÉPONSES ──
const KB = [
  {
    tags: ["bonjour", "salut", "hello", "bonsoir", "coucou", "hey"],
    rep: () => `Bonjour ! 😊 Bienvenue chez <strong>Lumière Immobilier</strong>. Je suis votre assistant virtuel, disponible 24h/24.<br><br>Je peux vous aider à :<br>• Trouver un bien à acheter ou louer<br>• Estimer votre bien<br>• Prendre rendez-vous<br>• Répondre à vos questions<br><br>Par quoi souhaitez-vous commencer ?`,
    chips: ["Voir les biens", "Estimer mon bien", "Prendre RDV", "Vos horaires"]
  },
  {
    tags: ["biens", "annonces", "voir", "disponible", "catalogue", "liste", "quoi", "avez-vous", "avez vous"],
    rep: () => {
      const vente = BIENS.filter(b => b.statut === "Vente");
      const loc = BIENS.filter(b => b.statut === "Location");
      return `Nous avons actuellement <strong>${BIENS.length} biens disponibles</strong> :<br><br>🏠 <strong>À la vente (${vente.length} biens)</strong><br>${vente.map(b => `• ${b.type} ${b.surface}m² — ${b.lieu} — <strong>${b.prix}</strong>`).join('<br>')}<br><br>🔑 <strong>À la location (${loc.length} biens)</strong><br>${loc.map(b => `• ${b.type} ${b.surface}m² — ${b.lieu} — <strong>${b.prix}</strong>`).join('<br>')}<br><br>Souhaitez-vous plus de détails sur l'un d'eux ?`;
    },
    chips: ["Biens à vendre", "Biens à louer", "Paris uniquement", "Prendre RDV"]
  },
  {
    tags: ["vente", "acheter", "achat", "à vendre", "vendre"],
    rep: () => {
      const vente = BIENS.filter(b => b.statut === "Vente");
      return `Voici nos <strong>${vente.length} biens à la vente</strong> :<br><br>${vente.map(b => `🏠 <strong>${b.type} — ${b.lieu}</strong><br>&nbsp;&nbsp;${b.surface}m² · ${b.chambres > 0 ? b.chambres + ' ch.' : 'Studio'} · ${b.etage}<br>&nbsp;&nbsp;<em>${b.detail}</em><br>&nbsp;&nbsp;Prix : <strong>${b.prix}</strong>`).join('<br><br>')}<br><br>Vous souhaitez visiter l'un d'eux ?`;
    },
    chips: ["Organiser une visite", "Estimer mon budget", "Prendre RDV"]
  },
  {
    tags: ["location", "louer", "loyer", "à louer", "locataire"],
    rep: () => {
      const loc = BIENS.filter(b => b.statut === "Location");
      return `Voici nos <strong>${loc.length} biens à louer</strong> :<br><br>${loc.map(b => `🔑 <strong>${b.type} — ${b.lieu}</strong><br>&nbsp;&nbsp;${b.surface}m² · ${b.chambres > 0 ? b.chambres + ' ch.' : 'Studio'} · ${b.etage}<br>&nbsp;&nbsp;<em>${b.detail}</em><br>&nbsp;&nbsp;Loyer : <strong>${b.prix}</strong>`).join('<br><br>')}<br><br>Souhaitez-vous visiter ou déposer un dossier ?`;
    },
    chips: ["Organiser une visite", "Conditions dossier", "Prendre RDV"]
  },
  {
    tags: ["paris", "8e", "15e", "16e", "arrondissement"],
    rep: () => `Nous avons plusieurs biens sur Paris :<br><br>• <strong>Appartement Haussmannien 120m²</strong> — Paris 8e — 1 290 000 €<br>• <strong>Studio 32m²</strong> — Paris 15e — 1 400 €/mois<br><br>Nous intervenons sur l'ensemble des arrondissements parisiens. Quel est votre arrondissement de préférence ?`,
    chips: ["Voir tout Paris", "Banlieue proche", "Prendre RDV"]
  },
  {
    tags: ["neuilly", "boulogne", "saint-cloud", "levallois", "vincennes", "banlieue", "idf", "île-de-france"],
    rep: () => `Nous sommes très actifs sur la petite couronne :<br><br>• <strong>Loft 85m²</strong> — Neuilly-sur-Seine — 3 200 €/mois<br>• <strong>Duplex 75m²</strong> — Boulogne-Billancourt — 680 000 €<br>• <strong>Maison 180m²</strong> — Saint-Cloud — 1 850 000 €<br><br>Vous avez une zone de préférence ?`,
    chips: ["Voir tous les biens", "Prendre RDV", "Estimer mon bien"]
  },
  {
    tags: ["estimer", "estimation", "prix", "valeur", "combien", "vaut"],
    rep: () => `Nous proposons une <strong>estimation gratuite et sans engagement</strong> de votre bien, réalisée par nos experts sous <strong>48h</strong>.<br><br>Pour lancer l'estimation, nous aurons besoin de :<br>• L'adresse du bien<br>• La surface et le nombre de pièces<br>• L'état général<br>• Votre numéro de téléphone<br><br>Appelez-nous au <strong>${AGENCE.tel}</strong> ou remplissez le formulaire sur notre page Contact. Un expert vous rappelle sous 24h.`,
    chips: ["Aller sur Contact", "Appeler maintenant", "Comment ça marche ?"]
  },
  {
    tags: ["frais", "honoraires", "commission", "agence", "coût", "cout"],
    rep: () => `Nos honoraires sont conformes à la <strong>loi ALUR</strong> et sont affichés en toute transparence sur chaque annonce.<br><br>📋 <strong>Pour une vente</strong> : nos honoraires sont compris entre <strong>3% et 5% TTC</strong> du prix de vente (inclus dans le prix affiché).<br><br>🔑 <strong>Pour une location</strong> : les frais d'agence sont réglementés par la loi et partagés entre bailleur et locataire selon la zone.<br><br>Pas de frais cachés. Tout est indiqué clairement dès le départ.`,
    chips: ["Voir nos biens", "Estimer mon bien", "Prendre RDV"]
  },
  {
    tags: ["rdv", "rendez-vous", "rendezvous", "visite", "visiter", "rencontrer"],
    rep: () => `Pour organiser un <strong>rendez-vous ou une visite</strong>, c'est simple :<br><br>📞 <strong>Par téléphone</strong> : ${AGENCE.tel}<br>✉️ <strong>Par email</strong> : ${AGENCE.email}<br>🌐 <strong>Via le formulaire</strong> : page Contact de notre site<br><br>Nous confirmons dans les <strong>2h</strong> en semaine, et proposons des créneaux le soir jusqu'à 19h et le samedi.`,
    chips: ["Aller sur Contact", "Vos horaires ?", "Votre adresse ?"]
  },
  {
    tags: ["horaires", "ouvert", "disponible", "heure", "heures"],
    rep: () => `Nos horaires d'ouverture :<br><br>🗓️ <strong>Lundi au Vendredi</strong> : 9h00 – 19h00<br>🗓️ <strong>Samedi</strong> : 10h00 – 17h00<br>❌ <strong>Dimanche</strong> : Fermé<br><br>Vous pouvez aussi nous écrire à <strong>${AGENCE.email}</strong> à n'importe quelle heure — nous répondons le prochain jour ouvrable.`,
    chips: ["Prendre RDV", "Votre adresse ?", "Nous contacter"]
  },
  {
    tags: ["adresse", "où", "ou", "situé", "situation", "localisation", "trouver"],
    rep: () => `Notre agence est située au :<br><br>📍 <strong>${AGENCE.adresse}</strong><br><br>Nous sommes à 5 min à pied du métro George V (ligne 1). Parking payant disponible à proximité (Indigo Champs-Élysées).`,
    chips: ["Prendre RDV", "Nos horaires", "Nous contacter"]
  },
  {
    tags: ["contact", "téléphone", "tel", "appeler", "email", "mail", "joindre"],
    rep: () => `Vous pouvez nous joindre de plusieurs façons :<br><br>📞 <strong>Téléphone</strong> : ${AGENCE.tel}<br>✉️ <strong>Email</strong> : ${AGENCE.email}<br>📍 <strong>Agence</strong> : ${AGENCE.adresse}<br>🌐 <strong>Formulaire</strong> : page Contact du site<br><br>Réponse garantie sous <strong>24h</strong> en semaine.`,
    chips: ["Vos horaires ?", "Prendre RDV", "Estimer mon bien"]
  },
  {
    tags: ["dossier", "conditions", "garanties", "caution", "garant"],
    rep: () => `Pour une <strong>location</strong>, voici les pièces généralement demandées :<br><br>• Pièce d'identité<br>• 3 derniers bulletins de salaire<br>• Dernier avis d'imposition<br>• Justificatif de domicile actuel<br>• Contrat de travail ou Kbis<br><br>Les revenus nets du locataire doivent généralement représenter <strong>3x le loyer</strong>. Un garant peut être accepté si nécessaire.<br><br>Vous avez une question sur un bien en particulier ?`,
    chips: ["Voir nos locations", "Prendre RDV", "Nous contacter"]
  },
  {
    tags: ["maison", "villa", "pavillon", "jardin"],
    rep: () => `Nous avons une <strong>magnifique maison</strong> en ce moment :<br><br>🏡 <strong>Maison 6 pièces — Saint-Cloud</strong><br>&nbsp;&nbsp;180m² · 4 chambres · Jardin 300m² · Garage double<br>&nbsp;&nbsp;Quartier résidentiel calme, proche écoles et commerces.<br>&nbsp;&nbsp;Prix : <strong>1 850 000 €</strong><br><br>Souhaitez-vous organiser une visite ?`,
    chips: ["Organiser une visite", "Tous nos biens", "Prendre RDV"]
  },
  {
    tags: ["studio", "petit", "seul"],
    rep: () => `Nous avons un <strong>studio</strong> disponible :<br><br>🏠 <strong>Studio 32m² — Paris 15e</strong><br>&nbsp;&nbsp;1er étage · Refait à neuf · Calme<br>&nbsp;&nbsp;Proche commodités et transports<br>&nbsp;&nbsp;Loyer : <strong>1 400 €/mois</strong><br><br>Intéressé par une visite ?`,
    chips: ["Organiser une visite", "Voir toutes les locations", "Prendre RDV"]
  },
  {
    tags: ["budget", "financer", "financement", "prêt", "pret", "crédit", "credit", "banque"],
    rep: () => `Nous travaillons avec des <strong>partenaires courtiers</strong> qui peuvent vous aider à obtenir les meilleures conditions de financement.<br><br>💡 <strong>Quelques repères :</strong><br>• Apport recommandé : 10% minimum du prix d'achat<br>• Capacité d'emprunt : environ 35% max de vos revenus<br>• Frais de notaire : environ 7-8% dans l'ancien<br><br>Souhaitez-vous être mis en relation avec un de nos partenaires ?`,
    chips: ["Nous contacter", "Voir nos biens", "Estimer mon budget"]
  },
  {
    tags: ["investissement", "investir", "rentabilité", "rentable", "locatif"],
    rep: () => `L'investissement locatif en Île-de-France reste attractif. Voici quelques données :<br><br>📊 <strong>Rendements bruts moyens</strong> :<br>• Paris intramuros : 3% – 4%<br>• Petite couronne : 4% – 5.5%<br>• Grande couronne : 5% – 7%<br><br>Nous pouvons vous accompagner dans votre stratégie d'investissement et vous proposer des biens avec le meilleur potentiel locatif.`,
    chips: ["Voir biens à vendre", "Estimer la rentabilité", "Prendre RDV"]
  },
  {
    tags: ["merci", "parfait", "super", "excellent", "génial", "top", "nickel"],
    rep: () => `Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions. Toute l'équipe de <strong>Lumière Immobilier</strong> reste à votre disposition.<br><br>Pour aller plus loin, vous pouvez nous appeler au <strong>${AGENCE.tel}</strong> ou remplir notre formulaire de contact.`,
    chips: ["Voir nos biens", "Prendre RDV"]
  },
  {
    tags: ["au revoir", "aurevoir", "bye", "bonne journée", "bonne soirée", "ciao"],
    rep: () => `Au revoir et à très bientôt ! 👋<br><br>N'hésitez pas à revenir si vous avez des questions. Vous pouvez aussi nous appeler au <strong>${AGENCE.tel}</strong>.<br><br>Bonne journée de la part de toute l'équipe Lumière Immobilier ! ✨`,
    chips: []
  },
];

function getTime() {
  const d = new Date();
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2,'0')}`;
}

function findResponse(msg) {
  const lower = msg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const item of KB) {
    if (item.tags.some(tag => lower.includes(tag.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))) {
      return item;
    }
  }
  return null;
}

function defaultResponse() {
  return {
    rep: () => `Je n'ai pas tout à fait compris votre question. 😊<br><br>Voici ce que je peux faire pour vous :<br>• Vous présenter nos biens disponibles<br>• Vous renseigner sur une estimation<br>• Organiser une visite<br><br>Ou appelez-nous directement au <strong>${AGENCE.tel}</strong> — nous répondons du lundi au vendredi de 9h à 19h.`,
    chips: ["Voir les biens", "Estimer mon bien", "Prendre RDV", "Nous contacter"]
  };
}

// ── DOM ──
let chatIsOpen = false;

function initChat() {
  document.getElementById('chat-trigger').addEventListener('click', togglePanel);
  document.getElementById('chat-close-btn').addEventListener('click', togglePanel);
  document.getElementById('chat-send-btn').addEventListener('click', sendMsg);
  document.getElementById('chat-in').addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });

  // Initial chips
  renderChips(["Voir les biens", "Estimer mon bien", "Prendre RDV", "Vos horaires"]);
}

function togglePanel() {
  chatIsOpen = !chatIsOpen;
  document.getElementById('chat-panel').classList.toggle('open', chatIsOpen);
  const notif = document.querySelector('.chat-notif');
  if (notif) notif.style.display = 'none';
  if (chatIsOpen) document.getElementById('chat-in').focus();
}

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

function handleChip(text, chipWrap) {
  if (chipWrap) chipWrap.remove();
  clearChipsRow();
  addBubble(text, 'user');
  showTyping();
  setTimeout(() => {
    removeTyping();
    const found = findResponse(text) || defaultResponse();
    const chips = found.chips || [];
    addBubble(found.rep(), 'bot', chips);
  }, 700 + Math.random() * 500);
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

function sendMsg() {
  const input = document.getElementById('chat-in');
  const msg = input.value.trim();
  if (!msg) return;
  clearChipsRow();
  addBubble(msg, 'user');
  input.value = '';
  showTyping();
  const delay = 800 + Math.random() * 700;
  setTimeout(() => {
    removeTyping();
    const found = findResponse(msg) || defaultResponse();
    const chips = found.chips || [];
    addBubble(found.rep(), 'bot', chips);
  }, delay);
}

// ── NAV SCROLL ──
function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hamburger
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

// ── FADE IN OBSERVER ──
function initFade() {
  const els = document.querySelectorAll('.fade');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initChat();
  initNav();
  initBTT();
  initFade();
});
