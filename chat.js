// chat.js — Lumière Immobilier Chatbot (Groq via Vercel Function)

let conversationHistory = [];
const STARTER_CHIPS = ["Nos biens disponibles", "Estimation gratuite", "Prendre RDV", "Horaires & contact"];

const PROPERTY_CARDS = [
  {title:'Appartement Haussmannien',loc:'Paris 8e',price:'1 290 000 €',img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80',tag:'Vente'},
  {title:'Loft contemporain',loc:'Neuilly-sur-Seine',price:'3 200 €/mois',img:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80',tag:'Location'},
  {title:'Maison avec jardin',loc:'Saint-Cloud',price:'1 850 000 €',img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=80',tag:'Exclusivité'},
];

function getTime(){const d=new Date();return `${d.getHours()}h${String(d.getMinutes()).padStart(2,'0')}`;}

function addBubble(html, role, chips=[]) {
  const body = document.getElementById('chat-body');
  const wrap = document.createElement('div'); wrap.className=`bubble-wrap ${role}`;
  const bub = document.createElement('div'); bub.className='bubble'; bub.innerHTML=html;
  const time = document.createElement('div'); time.className='bubble-time'; time.textContent=getTime();
  wrap.appendChild(bub); wrap.appendChild(time); body.appendChild(wrap);
  if(chips.length>0){
    const cw=document.createElement('div'); cw.className='chips bubble-wrap bot';
    chips.forEach(c=>{const b=document.createElement('button');b.className='chip';b.textContent=c;b.onclick=()=>handleChip(c,cw);cw.appendChild(b);});
    body.appendChild(cw);
  }
  body.scrollTop=body.scrollHeight;
}

function showTyping(){
  const body=document.getElementById('chat-body');
  const w=document.createElement('div');w.className='typing-wrap bubble-wrap bot';w.id='typing-indicator';
  w.innerHTML='<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  body.appendChild(w);body.scrollTop=body.scrollHeight;
}
function removeTyping(){const t=document.getElementById('typing-indicator');if(t)t.remove();}

function renderChips(chips){
  const row=document.getElementById('chat-chips-row');row.innerHTML='';
  chips.forEach(c=>{const b=document.createElement('button');b.className='chip';b.textContent=c;b.onclick=()=>handleChip(c,null);row.appendChild(b);});
}
function clearChips(){document.getElementById('chat-chips-row').innerHTML='';}

function appendPropertyCards(query){
  const body=document.getElementById('chat-body');
  if(body.querySelector('.chat-property-grid'))return;
  const t=query.toLowerCase();
  if(!/(bien|appart|maison|loft|duplex|voir|disponible)/.test(t))return;
  const wrap=document.createElement('div');wrap.className='bubble-wrap bot chat-extra-wrap';
  wrap.innerHTML=`<div class="chat-rich-block"><div class="chat-rich-title">Sélection du moment</div><div class="chat-property-grid">${PROPERTY_CARDS.map(p=>`<div class="chat-property-card"><div class="chat-property-image" style="background-image:url('${p.img}')"></div><div class="chat-property-body"><div class="chat-property-tag">${p.tag}</div><div class="chat-property-name">${p.title}</div><div class="chat-property-location">📍 ${p.loc}</div><div class="chat-property-price">${p.price}</div></div></div>`).join('')}</div></div>`;
  body.appendChild(wrap);body.scrollTop=body.scrollHeight;
}

function getFollowUpChips(msg){
  const t=msg.toLowerCase();
  if(/(horaire|ouvert|heure)/.test(t))return["Prendre RDV","Voir les biens","Estimation gratuite"];
  if(/(estimation|estimer|vendre|valeur)/.test(t))return["Prendre RDV","Voir les biens","Nos honoraires"];
  if(/(rdv|visite|rendez)/.test(t))return["Nos horaires","Voir les biens","Estimation gratuite"];
  if(/(bien|appart|maison|loft)/.test(t))return["Organiser une visite","Estimation gratuite","Prendre RDV"];
  if(/(financ|prêt|crédit|budget)/.test(t))return["Prendre RDV","Estimation gratuite","Nos services"];
  return["Voir les biens","Estimation gratuite","Prendre RDV"];
}

function getLocalFallback(msg){
  const t=msg.toLowerCase();
  if(/(bonjour|salut|hello)/.test(t))return`Bonjour ! Ravi de vous accueillir chez <strong>Lumière Immobilier</strong>. Comment puis-je vous aider ?`;
  if(/(horaire|ouvert)/.test(t))return`Nous sommes ouverts <strong>du lundi au vendredi de 9h à 19h</strong> et le <strong>samedi de 10h à 17h</strong>. Fermé le dimanche.`;
  if(/(estimation|estimer|vendre)/.test(t))return`Nous proposons une <strong>estimation gratuite sous 48h</strong>, réalisée par un expert local. Remplissez le formulaire sur notre page Contact ou appelez le <strong>01 42 00 00 00</strong>.`;
  if(/(rdv|visite|rendez)/.test(t))return`Pour organiser une visite ou prendre RDV, appelez le <strong>01 42 00 00 00</strong> ou écrivez à <strong>contact@lumiere-immo.fr</strong>. Nous répondons sous 2h en semaine.`;
  if(/(bien|appart|maison|loft|duplex)/.test(t))return`Nous avons actuellement <strong>5 biens disponibles</strong> : appartement Haussmannien (Paris 8e, 1 290 000€), loft (Neuilly, 3 200€/mois), duplex (Boulogne, 680 000€), studio (Paris 15e, 1 400€/mois) et maison (Saint-Cloud, 1 850 000€).`;
  if(/(honoraire|commission|frais)/.test(t))return`Nos honoraires sont transparents : <strong>3% à 5% TTC</strong> pour une vente (inclus dans le prix affiché). Conformes à la loi ALUR. Aucun frais caché.`;
  return`Je peux vous aider sur les biens disponibles, les estimations, les visites ou les horaires. N'hésitez pas à être précis dans votre demande, ou appelez-nous au <strong>01 42 00 00 00</strong>.`;
}

async function askGroq(msg){
  conversationHistory.push({role:'user',content:msg.replace(/<[^>]*>/g,'')});
  try{
    const ctrl=new AbortController();
    const timeout=setTimeout(()=>ctrl.abort(),8000);
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:conversationHistory}),signal:ctrl.signal});
    clearTimeout(timeout);
    if(!res.ok)throw new Error('API error');
    const data=await res.json();
    const reply=data.reply||getLocalFallback(msg);
    conversationHistory.push({role:'assistant',content:reply.replace(/<[^>]*>/g,'')});
    if(conversationHistory.length>20)conversationHistory=conversationHistory.slice(-20);
    return reply;
  }catch(e){
    const fallback=getLocalFallback(msg);
    conversationHistory.push({role:'assistant',content:fallback.replace(/<[^>]*>/g,'')});
    return fallback;
  }
}

async function sendMsg(){
  const input=document.getElementById('chat-in');
  const msg=input.value.trim();if(!msg)return;
  clearChips();addBubble(msg,'user');input.value='';
  input.disabled=true;document.getElementById('chat-send-btn').disabled=true;
  showTyping();
  const reply=await askGroq(msg);
  removeTyping();addBubble(reply,'bot',getFollowUpChips(msg));
  appendPropertyCards(msg);
  input.disabled=false;document.getElementById('chat-send-btn').disabled=false;input.focus();
}

async function handleChip(text,chipWrap){
  if(chipWrap)chipWrap.remove();clearChips();addBubble(text,'user');
  const input=document.getElementById('chat-in');
  input.disabled=true;document.getElementById('chat-send-btn').disabled=true;
  showTyping();
  const reply=await askGroq(text);
  removeTyping();addBubble(reply,'bot',getFollowUpChips(text));
  appendPropertyCards(text);
  input.disabled=false;document.getElementById('chat-send-btn').disabled=false;
}

document.addEventListener('DOMContentLoaded',()=>{
  const input=document.getElementById('chat-in');
  if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey)sendMsg();});
  const sendBtn=document.getElementById('chat-send-btn');
  if(sendBtn)sendBtn.addEventListener('click',sendMsg);
  renderChips(STARTER_CHIPS);
});
