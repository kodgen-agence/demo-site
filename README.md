# Lumière Immobilier — Déploiement

## ⚙️ Configuration de la clé Groq (gratuit)

### 1. Obtenir la clé API Groq
1. Va sur **console.groq.com**
2. Crée un compte (gratuit, pas de CB)
3. Menu gauche → **"API Keys"** → **"Create API Key"**
4. Copie la clé (commence par `gsk_...`)

### 2. Configurer sur Vercel
1. **Dashboard Vercel → ton projet → Settings → Environment Variables**
2. Ajouter :
   - Name  : `GROQ_API_KEY`
   - Value : ta clé `gsk_...`
   - Coche : Production + Preview + Development
3. **Redéployer** (Deployments → Redeploy)

C'est tout — le chatbot IA sera actif. ✅

---

## Structure du projet

```
lumiere-v3/
├── api/
│   └── chat.js     ← Vercel Function (proxy Groq sécurisé)
├── index.html
├── biens.html
├── agence.html
├── contact.html
├── style.css
├── shared.js       ← Nav, footer, chatbot HTML + bandeau démo Kodgen
├── chat.js         ← Logique chatbot côté client
└── vercel.json
```

## Modèle utilisé
**llama-3.3-70b-versatile** via Groq — gratuit, rapide, très bon niveau.
