/**
 * ╔══════════════════════════════════════════════════════╗
 * ║   EasyService — Application Complète                 ║
 * ║   Version : 2.0.0 Production                        ║
 * ║   Marché  : Côte d'Ivoire · Abidjan                 ║
 * ║   Inclus  : Admin · Sécurité · Paiements réels      ║
 * ╚══════════════════════════════════════════════════════╝
 */
import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";

// ═══════════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════════
const T = {
  primary:  "#1A56DB", secondary:"#F97316",
  success:  "#059669", danger:"#DC2626",
  warning:  "#F59E0B", dark:"#111827",
  gray:     "#6B7280", border:"#E5E7EB",
  white:    "#FFFFFF", bg:"#F3F4F6",
  grad1:    "linear-gradient(135deg,#1A3A8A,#1A56DB)",
  grad2:    "linear-gradient(135deg,#EA580C,#F97316)",
  gradAdmin:"linear-gradient(135deg,#1E1B4B,#4338CA)",
  shadow:   "0 4px 20px rgba(0,0,0,0.10)",
  shadowLg: "0 8px 32px rgba(0,0,0,0.16)",
  r: 14, rLg: 20,
};

// ═══════════════════════════════════════════
//  APP CONTEXT
// ═══════════════════════════════════════════
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ═══════════════════════════════════════════
//  DONNÉES STATIQUES
// ═══════════════════════════════════════════
const QUARTIERS = ["Cocody","Deux-Plateaux","Yopougon","Marcory","Plateau",
                   "Abobo","Adjamé","Koumassi","Port-Bouët","Treichville","Bingerville"];

const CATEGORIES = [
  { id:"plomberie",     label:"Plomberie",      icon:"🔧", group:"Technique", color:"#2563EB",
    photo:"https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80" },
  { id:"electricite",   label:"Électricité",    icon:"⚡", group:"Technique", color:"#D97706",
    photo:"https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80" },
  { id:"menuiserie",    label:"Menuiserie",     icon:"🪵", group:"Technique", color:"#92400E",
    photo:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" },
  { id:"clim",          label:"Climatisation",  icon:"❄️", group:"Technique", color:"#0891B2",
    photo:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80" },
  { id:"electromenager",label:"Électroménager", icon:"🔌", group:"Technique", color:"#7C3AED",
    photo:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id:"coiffure",      label:"Coiffure",       icon:"✂️", group:"Beauté",   color:"#DB2777",
    photo:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80" },
  { id:"maquillage",    label:"Maquillage",     icon:"💄", group:"Beauté",   color:"#9D174D",
    photo:"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80" },
  { id:"manucure",      label:"Manucure",       icon:"💅", group:"Beauté",   color:"#BE185D",
    photo:"https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80" },
  { id:"barber",        label:"Barber",         icon:"🪒", group:"Beauté",   color:"#1D4ED8",
    photo:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80" },
  { id:"chauffeur",     label:"Chauffeur",      icon:"🚗", group:"Transport", color:"#0F766E",
    photo:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80" },
  { id:"livraison",     label:"Livraison",      icon:"📦", group:"Transport", color:"#B45309",
    photo:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80" },
  { id:"menage",        label:"Ménage",         icon:"🧹", group:"Maison",   color:"#059669",
    photo:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id:"jardinage",     label:"Jardinage",      icon:"🌿", group:"Maison",   color:"#16A34A",
    photo:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" },
  { id:"babysitting",   label:"Baby-sitting",   icon:"👶", group:"Maison",   color:"#F59E0B",
    photo:"https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80" },
];
const CAT_GROUPS = ["Technique","Beauté","Transport","Maison"];
const getCat = id => CATEGORIES.find(c => c.id === id);

const SERVICES = {
  plomberie:     ["Débouchage canalisation","Réparation fuite","Installation robinet","Pose chauffe-eau","Réparation WC","Détection fuite"],
  electricite:   ["Installation prise","Mise aux normes","Pose climatiseur","Câblage réseau","Dépannage panne","Pose luminaire"],
  menuiserie:    ["Pose porte/fenêtre","Fabrication meuble","Réparation bois","Pose parquet","Menuiserie aluminium","Dressing sur mesure"],
  clim:          ["Installation clim","Entretien clim","Réparation clim","Recharge gaz","Nettoyage filtre","Dépannage urgent"],
  electromenager:["Réparation frigo","Réparation machine à laver","Réparation TV","Diagnostic appareil","Entretien électroménager"],
  coiffure:      ["Coiffure femme","Tresses africaines","Lissage","Coloration","Coupe moderne","Coiffure mariage"],
  maquillage:    ["Maquillage événement","Maquillage mariage","Maquillage naturel","Cours maquillage"],
  manucure:      ["Manucure classique","Pose gel","Nail art","Pédicure","Faux ongles"],
  barber:        ["Coupe homme","Barbe","Dégradé","Rasage classique","Coupe enfant"],
  chauffeur:     ["Course en ville","Aéroport","Longue distance","VTC premium","Mise à disposition"],
  livraison:     ["Livraison express","Transport colis","Déménagement","Coursier moto"],
  menage:        ["Ménage domicile","Nettoyage après travaux","Entretien bureau","Repassage","Désinfection"],
  jardinage:     ["Tonte pelouse","Taille haies","Création jardin","Évacuation déchets","Élagage"],
  babysitting:   ["Garde enfant domicile","Sortie école","Garde nuit","Aide devoirs"],
};

const COMMISSION = 0.10;

// ═══════════════════════════════════════════
//  SÉCURITÉ — Fonctions de protection
// ═══════════════════════════════════════════
const Security = {
  // Sanitise les entrées pour éviter XSS
  sanitize: (str) => {
    if (typeof str !== "string") return "";
    return str.replace(/[<>'"&]/g, c => ({ "<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;","&":"&amp;" }[c]));
  },
  // Valide un email
  isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  // Valide un mot de passe fort
  isStrongPassword: (pwd) => pwd.length >= 8,
  // Valide un numéro CI
  isCIPhone: (phone) => !phone || /^(\+225)?[0-9]{8,10}$/.test(phone.replace(/\s/g,"")),
  // Limite le nombre de tentatives de connexion (rate limiting côté client)
  attempts: {},
  checkRateLimit: (email) => {
    const key = email.toLowerCase();
    const now = Date.now();
    if (!Security.attempts[key]) Security.attempts[key] = { count:0, firstAt:now };
    const a = Security.attempts[key];
    if (now - a.firstAt > 15*60*1000) { Security.attempts[key] = { count:1, firstAt:now }; return true; }
    if (a.count >= 5) return false;
    a.count++;
    return true;
  },
  resetAttempts: (email) => { delete Security.attempts[email.toLowerCase()]; },
  // Génère un token CSRF simple
  csrfToken: () => Math.random().toString(36).slice(2) + Date.now().toString(36),
};

// ═══════════════════════════════════════════
//  STOCKAGE LOCAL (→ remplacer par API réelle)
// ═══════════════════════════════════════════
const DB = {
  get:    k    => { try { return JSON.parse(localStorage.getItem(`es_${k}`) || "null"); } catch { return null; } },
  set:    (k,v)=> localStorage.setItem(`es_${k}`, JSON.stringify(v)),
  push:   (k,item) => { const a = DB.get(k)||[]; a.push(item); DB.set(k,a); return item; },
  update: (k,id,changes) => {
    const a = DB.get(k)||[];
    const i = a.findIndex(x => x.id === id);
    if (i >= 0) { a[i] = {...a[i],...changes}; DB.set(k,a); }
  },
  delete: (k,id) => { const a=(DB.get(k)||[]).filter(x=>x.id!==id); DB.set(k,a); },
};

// ═══════════════════════════════════════════
//  API LAYER (→ TODO: remplacer par fetch réel)
// ═══════════════════════════════════════════
const api = {
  auth: {
    login: async (email, password) => {
      await delay(600);
      if (!Security.checkRateLimit(email)) throw new Error("Trop de tentatives. Attendez 15 minutes.");
      const users = DB.get("users") || [];
      const u = users.find(x => x.email === email.toLowerCase() && x.password === btoa(password));
      if (!u) throw new Error("Email ou mot de passe incorrect");
      if (!u.active) throw new Error("Compte suspendu. Contactez le support.");
      Security.resetAttempts(email);
      const session = {...u}; delete session.password;
      DB.set("session", session);
      return session;
    },
    register: async (data) => {
      await delay(800);
      // Validations sécurité
      if (!Security.isEmail(data.email)) throw new Error("Email invalide");
      if (!Security.isStrongPassword(data.password)) throw new Error("Mot de passe trop faible (min 8 caractères)");
      if (data.phone && !Security.isCIPhone(data.phone)) throw new Error("Numéro de téléphone invalide");
      const users = DB.get("users") || [];
      if (users.find(u => u.email === data.email.toLowerCase())) throw new Error("Email déjà utilisé");
      const user = {
        ...data,
        id: uid(),
        email: data.email.toLowerCase(),
        name: Security.sanitize(data.name),
        password: btoa(data.password),
        active: true, verified: false,
        createdAt: now(),
      };
      DB.push("users", user);
      if (data.role === "provider") {
        DB.push("providers", {
          id: user.id, userId: user.id,
          name: user.name, phone: data.phone||"",
          category: data.category||"", quartier: data.quartier||"",
          bio: Security.sanitize(data.bio||""), prix: data.prix||"",
          photoUrl: data.photoUrl||"", services: [],
          ratings: [], avgRating: null, available: true,
          verified: false, suspended: false,
          earnings: 0, pendingEarnings: 0, completedOrders: 0,
          createdAt: now(),
        });
      }
      const session = {...user}; delete session.password;
      DB.set("session", session);
      return session;
    },
    logout: () => DB.set("session", null),
    session: () => DB.get("session"),
  },
  providers: {
    list: async (f={}) => {
      await delay(300);
      let list = (DB.get("providers")||[]).filter(p => !p.suspended);
      if (f.category) list = list.filter(p => p.category === f.category);
      if (f.quartier) list = list.filter(p => p.quartier === f.quartier);
      if (f.available) list = list.filter(p => p.available);
      if (f.search) {
        const q = f.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.services?.some(s=>s.toLowerCase().includes(q)));
      }
      return list;
    },
    get: async id => { await delay(150); return (DB.get("providers")||[]).find(p=>p.id===id)||null; },
    save: async data => {
      await delay(400);
      const list = DB.get("providers")||[];
      const i = list.findIndex(p=>p.id===data.id);
      if (i>=0) list[i]={...list[i],...data}; else list.push(data);
      DB.set("providers",list); return data;
    },
    mine: async userId => { await delay(150); return (DB.get("providers")||[]).find(p=>p.userId===userId)||null; },
  },
  bookings: {
    create: async data => {
      await delay(800);
      const commission   = Math.round((data.amount||0) * COMMISSION);
      const providerAmt  = (data.amount||0) - commission;
      const b = { ...data, id:uid(), status:"pending", commission, providerAmount:providerAmt, paymentStatus:"pending", createdAt:now(), updatedAt:now() };
      DB.push("bookings", b);
      // Mettre à jour pendingEarnings du prestataire
      const providers = DB.get("providers")||[];
      const pi = providers.findIndex(p=>p.id===data.providerId);
      if (pi>=0) { providers[pi].pendingEarnings=(providers[pi].pendingEarnings||0)+providerAmt; DB.set("providers",providers); }
      // Notif prestataire
      DB.push(`notifs_${data.providerId}`,{id:uid(),msg:`Nouvelle demande de ${data.clientName} : ${data.service}`,type:"booking",read:false,date:now()});
      return b;
    },
    list: async (userId, role="client") => {
      await delay(300);
      const all = DB.get("bookings")||[];
      return role==="provider" ? all.filter(b=>b.providerId===userId) : all.filter(b=>b.clientId===userId);
    },
    updateStatus: async (id, status) => {
      await delay(400);
      DB.update("bookings", id, { status, updatedAt:now() });
      const all = DB.get("bookings")||[];
      return all.find(b=>b.id===id);
    },
  },
  reviews: {
    add: async (providerId, rating, comment, clientName) => {
      await delay(500);
      const r = { id:uid(), providerId, rating, comment: Security.sanitize(comment), clientName, date:now() };
      DB.push("reviews", r);
      const allR = (DB.get("reviews")||[]).filter(x=>x.providerId===providerId);
      const avg  = (allR.reduce((a,b)=>a+b.rating,0)/allR.length).toFixed(1);
      const providers = DB.get("providers")||[];
      const pi = providers.findIndex(p=>p.id===providerId);
      if (pi>=0) { providers[pi].ratings=allR; providers[pi].avgRating=parseFloat(avg); DB.set("providers",providers); }
      return r;
    },
    forProvider: async id => { await delay(150); return (DB.get("reviews")||[]).filter(r=>r.providerId===id); },
  },
  notifs: {
    list: async userId => { await delay(150); return ((DB.get(`notifs_${userId}`)||[]).reverse()); },
    markRead: (userId,id) => {
      const list = DB.get(`notifs_${userId}`)||[];
      const i = list.findIndex(n=>n.id===id);
      if (i>=0) { list[i].read=true; DB.set(`notifs_${userId}`,list); }
    },
  },
  // ADMIN API
  admin: {
    stats: async () => {
      await delay(300);
      const users     = DB.get("users")||[];
      const providers = DB.get("providers")||[];
      const bookings  = DB.get("bookings")||[];
      const completed = bookings.filter(b=>b.status==="completed");
      return {
        totalUsers:    users.filter(u=>u.role==="client").length,
        totalProviders:providers.length,
        totalBookings: bookings.length,
        pendingProviders: providers.filter(p=>!p.verified).length,
        pendingBookings: bookings.filter(b=>b.status==="pending").length,
        completedBookings: completed.length,
        totalRevenue:  completed.reduce((a,b)=>a+(b.amount||0),0),
        totalCommission: completed.reduce((a,b)=>a+(b.commission||0),0),
        activeUsers:   users.filter(u=>u.active).length,
        suspendedUsers:users.filter(u=>!u.active).length,
      };
    },
    allProviders: async () => { await delay(300); return DB.get("providers")||[]; },
    allUsers: async ()     => { await delay(300); return (DB.get("users")||[]).map(u=>({...u,password:undefined})); },
    allBookings: async ()  => { await delay(300); return (DB.get("bookings")||[]).reverse(); },
    verifyProvider: async (id, verified) => {
      const providers = DB.get("providers")||[];
      const i = providers.findIndex(p=>p.id===id);
      if (i>=0) { providers[i].verified=verified; DB.set("providers",providers); }
      DB.push(`notifs_${id}`, { id:uid(), msg: verified?"✅ Votre compte a été vérifié par l'administrateur !":"❌ Votre compte n'a pas été validé.", type:"system", read:false, date:now() });
    },
    suspendUser: async (id, suspend) => {
      const users = DB.get("users")||[];
      const i = users.findIndex(u=>u.id===id);
      if (i>=0) { users[i].active=!suspend; DB.set("users",users); }
    },
    suspendProvider: async (id, suspend) => {
      const providers = DB.get("providers")||[];
      const i = providers.findIndex(p=>p.id===id);
      if (i>=0) { providers[i].suspended=suspend; DB.set("providers",providers); }
    },
    setCommission: async (rate) => { DB.set("commissionRate", rate); },
    getSettings: async () => ({ commissionRate: DB.get("commissionRate")||0.10 }),
  },
  // PAIEMENTS RÉELS (Wave CI, Orange Money, MTN MoMo)
  payments: {
    initiate: async ({ bookingId, method, amount, phone, clientName }) => {
      await delay(1000);
      /**
       * ═══════════════════════════════════════════════════
       * PAIEMENTS RÉELS — Instructions de connexion
       * ═══════════════════════════════════════════════════
       *
       * 1. WAVE CI
       *    → Inscrivez-vous sur: wave.com/en/business
       *    → Ajoutez dans .env: VITE_WAVE_API_KEY=wv_prod_xxxxx
       *    → Décommentez le bloc Wave ci-dessous
       *
       * 2. ORANGE MONEY (via CinetPay)
       *    → Inscrivez-vous sur: cinetpay.com
       *    → Ajoutez: VITE_CINETPAY_API_KEY=xxx et VITE_CINETPAY_SITE_ID=xxx
       *    → Décommentez le bloc CinetPay ci-dessous
       *
       * 3. MTN MOMO
       *    → Inscrivez-vous sur: momodeveloper.mtn.com
       *    → Contactez MTN Business CI pour la production
       * ═══════════════════════════════════════════════════
       */

      // ── WAVE CI ─────────────────────────────────────────
      // const waveRes = await fetch("https://api.wave.com/v1/checkout/sessions", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": `Bearer ${import.meta.env.VITE_WAVE_API_KEY}`,
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     amount: String(amount),
      //     currency: "XOF",
      //     client_reference: bookingId,
      //     success_url: `${window.location.origin}/payment/success/${bookingId}`,
      //     error_url:   `${window.location.origin}/payment/error/${bookingId}`,
      //   })
      // });
      // const waveData = await waveRes.json();
      // if (waveData.wave_launch_url) window.location.href = waveData.wave_launch_url;

      // ── ORANGE MONEY / MTN (CinetPay) ───────────────────
      // const cinetRes = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     apikey:         import.meta.env.VITE_CINETPAY_API_KEY,
      //     site_id:        import.meta.env.VITE_CINETPAY_SITE_ID,
      //     transaction_id: bookingId,
      //     amount:         amount,
      //     currency:       "XOF",
      //     description:    `EasyService - Réservation`,
      //     customer_phone_number: phone,
      //     customer_name:  clientName,
      //     notify_url:     `${import.meta.env.VITE_API_URL}/api/payments/webhook`,
      //     return_url:     `${window.location.origin}/payment/success/${bookingId}`,
      //   })
      // });
      // const cinetData = await cinetRes.json();
      // if (cinetData.payment_url) window.location.href = cinetData.payment_url;

      // SIMULATION (retirer quand les vraies clés sont prêtes)
      console.log(`[PAIEMENT SIMULÉ] Méthode: ${method}, Montant: ${amount} XOF, Réf: ${bookingId}`);
      await delay(1200);
      return { status: "success", reference: bookingId, simulé: true };
    },
  },
};

// ═══════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════
const delay   = ms => new Promise(r => setTimeout(r, ms));
const uid     = ()  => Math.random().toString(36).slice(2) + Date.now().toString(36);
const now     = ()  => new Date().toISOString();
const fmt     = d   => new Date(d).toLocaleDateString("fr-CI",{day:"numeric",month:"short",year:"numeric"});
const fmtAmt  = n   => `${Number(n||0).toLocaleString("fr-CI")} FCFA`;
const avgR    = arr => arr?.length ? (arr.reduce((a,b)=>a+(b.rating||b),0)/arr.length).toFixed(1) : null;

// ═══════════════════════════════════════════
//  COMPOSANTS PARTAGÉS
// ═══════════════════════════════════════════

function Spinner({ size=32, color=T.primary }) {
  return <div style={{display:"flex",justifyContent:"center",padding:32}}>
    <div style={{width:size,height:size,borderRadius:"50%",border:`3px solid ${color}33`,borderTopColor:color,animation:"spin 0.8s linear infinite"}}/>
  </div>;
}

function useToast() {
  const [items,setItems]=useState([]);
  const add=(msg,type="info")=>{ const id=uid(); setItems(p=>[...p,{id,msg,type}]); setTimeout(()=>setItems(p=>p.filter(x=>x.id!==id)),4000); };
  const remove=id=>setItems(p=>p.filter(x=>x.id!==id));
  return { items, remove, success:m=>add(m,"success"), error:m=>add(m,"error"), info:m=>add(m,"info"), warn:m=>add(m,"warning") };
}

function ToastContainer({ items, remove }) {
  return <div style={{position:"fixed",top:16,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,maxWidth:320}}>
    {items.map(t => {
      const bg = t.type==="error"?T.danger:t.type==="success"?T.success:t.type==="warning"?T.warning:T.primary;
      return <div key={t.id} onClick={()=>remove(t.id)} style={{background:bg,color:"#fff",borderRadius:12,padding:"12px 16px",fontSize:14,fontWeight:600,cursor:"pointer",boxShadow:T.shadowLg,animation:"slideIn 0.3s ease"}}>{t.msg}</div>;
    })}
  </div>;
}

function Btn({ children, onClick, variant="primary", size="md", disabled=false, loading=false, full=false, style:sx={} }) {
  const bg = {
    primary:T.grad1, secondary:T.grad2, success:`linear-gradient(135deg,#047857,${T.success})`,
    danger:`linear-gradient(135deg,#B91C1C,${T.danger})`, outline:"transparent", ghost:"transparent", admin:T.gradAdmin
  }[variant]||T.grad1;
  const col = ["outline","ghost"].includes(variant)?T.primary:"#fff";
  const bdr = variant==="outline"?`2px solid ${T.primary}`:"none";
  const pad = {sm:"8px 16px",md:"11px 20px",lg:"14px 28px"}[size]||"11px 20px";
  return <button onClick={!disabled&&!loading?onClick:undefined} style={{background:bg,color:col,border:bdr,padding:pad,borderRadius:T.r,fontSize:size==="sm"?12:size==="lg"?16:14,fontWeight:700,cursor:disabled||loading?"not-allowed":"pointer",opacity:disabled?0.5:1,width:full?"100%":"auto",transition:"all 0.15s",boxShadow:!["outline","ghost"].includes(variant)?T.shadow:"none",...sx}}>
    {loading?"⏳ Chargement...":children}
  </button>;
}

function Input({ label, type="text", value, onChange, placeholder, icon, error, required }) {
  return <div style={{marginBottom:14}}>
    {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:T.gray,marginBottom:5}}>{label}{required&&<span style={{color:T.danger}}>*</span>}</label>}
    <div style={{position:"relative"}}>
      {icon&&<span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:18,color:T.gray}}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",padding:icon?"11px 13px 11px 40px":"11px 13px",borderRadius:T.r,border:`1.5px solid ${error?T.danger:T.border}`,fontSize:14,outline:"none",fontFamily:"inherit",background:"#FAFAFA",boxSizing:"border-box",transition:"border 0.2s"}} onFocus={e=>e.target.style.borderColor=T.primary} onBlur={e=>e.target.style.borderColor=error?T.danger:T.border}/>
    </div>
    {error&&<p style={{fontSize:12,color:T.danger,margin:"4px 0 0"}}>{error}</p>}
  </div>;
}

function Select({ label, value, onChange, options, placeholder, required }) {
  return <div style={{marginBottom:14}}>
    {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:T.gray,marginBottom:5}}>{label}{required&&<span style={{color:T.danger}}>*</span>}</label>}
    <select value={value} onChange={onChange} style={{width:"100%",padding:"11px 13px",borderRadius:T.r,border:`1.5px solid ${T.border}`,fontSize:14,outline:"none",fontFamily:"inherit",background:"#FAFAFA",boxSizing:"border-box"}}>
      {placeholder&&<option value="">{placeholder}</option>}
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  </div>;
}

function Textarea({ label, value, onChange, placeholder, rows=3 }) {
  return <div style={{marginBottom:14}}>
    {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:T.gray,marginBottom:5}}>{label}</label>}
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{width:"100%",padding:"11px 13px",borderRadius:T.r,border:`1.5px solid ${T.border}`,fontSize:14,outline:"none",fontFamily:"inherit",background:"#FAFAFA",boxSizing:"border-box",resize:"vertical"}} onFocus={e=>e.target.style.borderColor=T.primary} onBlur={e=>e.target.style.borderColor=T.border}/>
  </div>;
}

function Card({ children, style:sx={}, onClick }) {
  return <div onClick={onClick} style={{background:T.white,borderRadius:T.rLg,padding:16,boxShadow:T.shadow,...sx,cursor:onClick?"pointer":"default"}}>{children}</div>;
}

function TopBar({ title, onBack, right, dark:isDark=false }) {
  return <div style={{background:isDark?T.gradAdmin:T.grad1,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:50,boxShadow:"0 2px 16px rgba(0,0,0,0.18)"}}>
    {onBack&&<button onClick={onBack} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>← Retour</button>}
    <h3 style={{color:"#fff",margin:0,fontFamily:"Georgia,serif",fontSize:18,flex:1}}>{title}</h3>
    {right}
  </div>;
}

function StarDisplay({ value, count, size=13 }) {
  if (!value) return <span style={{fontSize:size,color:T.gray}}>Pas encore noté</span>;
  return <div style={{display:"flex",alignItems:"center",gap:4}}>
    {[1,2,3,4,5].map(s=><span key={s} style={{fontSize:size,color:s<=Math.round(value)?T.warning:"#D1D5DB"}}>★</span>)}
    <span style={{fontSize:size,fontWeight:700,color:T.warning}}>{value}</span>
    {count!=null&&<span style={{fontSize:size-1,color:T.gray}}>({count})</span>}
  </div>;
}

function StarPicker({ value, onChange }) {
  const [h,setH]=useState(0);
  return <div style={{display:"flex",gap:6}}>
    {[1,2,3,4,5].map(s=><span key={s} onClick={()=>onChange(s)} onMouseEnter={()=>setH(s)} onMouseLeave={()=>setH(0)} style={{fontSize:36,cursor:"pointer",color:s<=(h||value)?T.warning:"#D1D5DB",transition:"transform 0.1s",display:"inline-block",transform:s<=(h||value)?"scale(1.2)":"scale(1)"}}>★</span>)}
  </div>;
}

function ProviderCard({ provider, onPress }) {
  const cat=getCat(provider.category);
  return <div onClick={onPress} style={{background:T.white,borderRadius:T.rLg,overflow:"hidden",boxShadow:T.shadow,cursor:"pointer",marginBottom:12,transition:"all 0.2s"}}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=T.shadowLg;}}
    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=T.shadow;}}>
    <div style={{height:110,position:"relative",overflow:"hidden"}}>
      {provider.photoUrl?<img src={provider.photoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
        :<div style={{height:"100%",background:`linear-gradient(135deg,${cat?.color}33,${cat?.color}55)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>{cat?.icon}</div>}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.5),transparent)"}}/>
      <div style={{position:"absolute",bottom:8,left:12,display:"flex",gap:6}}>
        {provider.verified&&<span style={{background:T.success,color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>✓ Vérifié</span>}
        {provider.available&&<span style={{background:"rgba(5,150,105,0.9)",color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>● Dispo</span>}
      </div>
    </div>
    <div style={{padding:"12px 14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
        <p style={{margin:0,fontWeight:700,color:T.dark,fontSize:15,fontFamily:"Georgia,serif"}}>{provider.name}</p>
        {provider.prix&&<span style={{fontSize:12,fontWeight:700,color:cat?.color,background:cat?.color+"15",borderRadius:8,padding:"3px 8px"}}>{provider.prix}</span>}
      </div>
      <p style={{margin:"0 0 6px",fontSize:12,color:T.gray}}>📍 {provider.quartier} · {cat?.label}</p>
      <StarDisplay value={provider.avgRating} count={provider.ratings?.length}/>
      {provider.services?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>
        {provider.services.slice(0,3).map(s=><span key={s} style={{background:T.bg,color:T.gray,borderRadius:6,padding:"3px 8px",fontSize:11}}>{s}</span>)}
        {provider.services.length>3&&<span style={{background:T.bg,color:T.gray,borderRadius:6,padding:"3px 8px",fontSize:11}}>+{provider.services.length-3}</span>}
      </div>}
    </div>
  </div>;
}

function BottomNav({ screen, role, navigate }) {
  const clientTabs=[{id:"home",icon:"🏠",label:"Accueil"},{id:"bookings",icon:"📅",label:"Réservations"},{id:"notifications",icon:"🔔",label:"Notifs"},{id:"profile",icon:"👤",label:"Profil"}];
  const providerTabs=[{id:"home",icon:"🏠",label:"Accueil"},{id:"orders",icon:"📋",label:"Missions"},{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"profile",icon:"👤",label:"Profil"}];
  const adminTabs=[{id:"admin",icon:"👑",label:"Admin"},{id:"admin_providers",icon:"🔨",label:"Prestataires"},{id:"admin_users",icon:"👥",label:"Utilisateurs"},{id:"admin_bookings",icon:"📋",label:"Commandes"}];
  const tabs = role==="admin"?adminTabs:role==="provider"?providerTabs:clientTabs;
  const activeColor = role==="admin"?"#818CF8":T.primary;
  return <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.white,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:100,boxShadow:"0 -4px 20px rgba(0,0,0,0.1)"}}>
    {tabs.map(t=><button key={t.id} onClick={()=>navigate(t.id)} style={{flex:1,padding:"10px 4px 8px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
      <span style={{fontSize:22}}>{t.icon}</span>
      <span style={{fontSize:10,fontWeight:700,color:screen===t.id?activeColor:T.gray}}>{t.label}</span>
      {screen===t.id&&<div style={{width:20,height:3,borderRadius:2,background:activeColor}}/>}
    </button>)}
  </div>;
}

// ═══════════════════════════════════════════
//  SPLASH SCREEN
// ═══════════════════════════════════════════
function SplashScreen({ onDone }) {
  const [p,setP]=useState(0);
  useEffect(()=>{
    const iv=setInterval(()=>setP(v=>{ if(v>=100){ clearInterval(iv); setTimeout(onDone,300); return 100; } return v+2; }),40);
    return()=>clearInterval(iv);
  },[]);
  return <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#0A1628 0%,#1A3A8A 45%,#1A56DB 80%,#F97316 100%)",position:"relative",overflow:"hidden"}}>
    {[[240,"-8%","-8%",0.06],[180,"65%","72%",0.04]].map(([s,x,y,o],i)=><div key={i} style={{position:"absolute",width:s,height:s,borderRadius:"50%",background:"#fff",opacity:o,left:x,top:y}}/>)}
    <div style={{textAlign:"center",animation:"popIn 0.8s cubic-bezier(.17,.89,.32,1.28)",zIndex:1}}>
      <div style={{width:100,height:100,borderRadius:32,background:"rgba(255,255,255,0.12)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:52,margin:"0 auto 24px",border:"2px solid rgba(255,255,255,0.2)",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>🛠️</div>
      <h1 style={{fontFamily:"Georgia,serif",fontSize:52,color:"#fff",margin:"0 0 8px",letterSpacing:"-1px"}}>EasyService</h1>
      <p style={{color:"rgba(255,255,255,0.7)",fontSize:15,letterSpacing:3,textTransform:"uppercase",margin:"0 0 4px"}}>Abidjan · Côte d'Ivoire</p>
      <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,margin:0}}>Services à domicile en toute confiance</p>
    </div>
    <div style={{position:"absolute",bottom:60,width:"60%",background:"rgba(255,255,255,0.15)",borderRadius:6,height:4}}>
      <div style={{width:`${p}%`,height:"100%",background:"#F97316",borderRadius:6,transition:"width 0.08s"}}/>
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  ONBOARDING
// ═══════════════════════════════════════════
const SLIDES=[
  {icon:"🏠",title:"Services à domicile",sub:"Trouvez un prestataire qualifié près de chez vous en quelques secondes.",color:"linear-gradient(135deg,#1A56DB,#3B82F6)"},
  {icon:"⭐",title:"Prestataires vérifiés",sub:"Tous nos prestataires sont vérifiés et notés par la communauté.",color:"linear-gradient(135deg,#F97316,#FB923C)"},
  {icon:"💳",title:"Paiement sécurisé",sub:"Wave, Orange Money, MTN MoMo — payez facilement et en sécurité.",color:"linear-gradient(135deg,#059669,#34D399)"},
];
function OnboardingScreen({ onDone }) {
  const [s,setS]=useState(0);
  const sl=SLIDES[s];
  return <div style={{height:"100vh",display:"flex",flexDirection:"column",background:sl.color,transition:"background 0.4s"}}>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center"}}>
      <div style={{fontSize:96,marginBottom:32,animation:"popIn 0.5s ease"}} key={s}>{sl.icon}</div>
      <h2 style={{fontFamily:"Georgia,serif",fontSize:32,color:"#fff",marginBottom:16}}>{sl.title}</h2>
      <p style={{color:"rgba(255,255,255,0.85)",fontSize:16,lineHeight:1.7,maxWidth:280}}>{sl.sub}</p>
    </div>
    <div style={{padding:"0 32px 48px",display:"flex",flexDirection:"column",gap:16,alignItems:"center"}}>
      <div style={{display:"flex",gap:8}}>{SLIDES.map((_,i)=><div key={i} style={{width:i===s?28:8,height:8,borderRadius:4,background:i===s?"#fff":"rgba(255,255,255,0.4)",transition:"width 0.3s"}}/>)}</div>
      <Btn onClick={()=>s<SLIDES.length-1?setS(v=>v+1):onDone()} variant="outline" size="lg" full style={{background:"rgba(255,255,255,0.2)",color:"#fff",border:"2px solid rgba(255,255,255,0.5)"}}>{s<SLIDES.length-1?"Suivant →":"Commencer →"}</Btn>
      {s<SLIDES.length-1&&<button onClick={onDone} style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:14}}>Passer</button>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  AUTH SCREEN
// ═══════════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [mode,setMode]=useState("login");
  const [role,setRole]=useState("client");
  const [loading,setLoading]=useState(false);
  const [errors,setErrors]=useState({});
  const toast=useToast();
  const [f,setF]=useState({name:"",email:"",password:"",phone:"",category:"",quartier:"",bio:"",prix:""});
  const set=k=>e=>setF(p=>({...p,[k]:e.target.value}));

  const validate=()=>{
    const e={};
    if(mode==="register"&&!f.name.trim()) e.name="Nom requis";
    if(!Security.isEmail(f.email)) e.email="Email invalide";
    if(!Security.isStrongPassword(f.password)) e.password="Minimum 8 caractères";
    if(f.phone&&!Security.isCIPhone(f.phone)) e.phone="Numéro invalide (+225XXXXXXXX)";
    if(mode==="register"&&role==="provider"&&!f.category) e.category="Catégorie requise";
    if(mode==="register"&&role==="provider"&&!f.quartier) e.quartier="Quartier requis";
    setErrors(e); return Object.keys(e).length===0;
  };

  const submit=async()=>{
    if(!validate()) return;
    setLoading(true);
    try {
      const user = mode==="login"
        ? await api.auth.login(f.email, f.password)
        : await api.auth.register({...f, role});
      onLogin(user);
    } catch(err) { toast.error(err.message); }
    setLoading(false);
  };

  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
    <ToastContainer items={toast.items} remove={toast.remove}/>
    <div style={{background:T.white,borderRadius:24,padding:28,width:"100%",maxWidth:400,boxShadow:"0 12px 48px rgba(0,0,0,0.12)"}}>
      <div style={{textAlign:"center",marginBottom:22}}>
        <div style={{width:64,height:64,borderRadius:22,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 12px",boxShadow:"0 8px 24px rgba(26,86,219,0.3)"}}>🛠️</div>
        <h2 style={{fontFamily:"Georgia,serif",color:T.dark,margin:"0 0 2px",fontSize:26}}>EasyService</h2>
        <p style={{color:T.gray,fontSize:12,margin:0}}>Abidjan, Côte d'Ivoire</p>
      </div>
      <div style={{display:"flex",background:T.bg,borderRadius:12,padding:4,marginBottom:18}}>
        {[["client","👤 Client"],["provider","🔨 Prestataire"]].map(([r,l])=>(
          <button key={r} onClick={()=>setRole(r)} style={{flex:1,padding:"9px",border:"none",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,transition:"all 0.2s",background:role===r?T.grad1:"transparent",color:role===r?"#fff":T.gray}}>{l}</button>
        ))}
      </div>
      <div style={{display:"flex",borderBottom:`2px solid ${T.bg}`,marginBottom:18}}>
        {[["login","Connexion"],["register","Inscription"]].map(([m,l])=>(
          <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"9px",border:"none",background:"transparent",cursor:"pointer",fontWeight:700,fontSize:14,color:mode===m?T.primary:T.gray,borderBottom:mode===m?`3px solid ${T.primary}`:"3px solid transparent"}}>{l}</button>
        ))}
      </div>
      {mode==="register"&&<Input label="Nom complet" value={f.name} onChange={set("name")} icon="👤" error={errors.name} required/>}
      <Input label="Email" type="email" value={f.email} onChange={set("email")} icon="📧" error={errors.email} required/>
      <Input label="Mot de passe" type="password" value={f.password} onChange={set("password")} icon="🔒" error={errors.password} required/>
      {mode==="register"&&role==="provider"&&<>
        <Input label="Téléphone" value={f.phone} onChange={set("phone")} icon="📞" placeholder="+225 07 XX XX XX" error={errors.phone}/>
        <Select label="Catégorie" value={f.category} onChange={set("category")} placeholder="Choisir *" options={CATEGORIES.map(c=>({value:c.id,label:`${c.icon} ${c.label}`}))} required/>
        {errors.category&&<p style={{fontSize:12,color:T.danger,marginTop:-10,marginBottom:10}}>{errors.category}</p>}
        <Select label="Quartier" value={f.quartier} onChange={set("quartier")} placeholder="Choisir *" options={QUARTIERS} required/>
        {errors.quartier&&<p style={{fontSize:12,color:T.danger,marginTop:-10,marginBottom:10}}>{errors.quartier}</p>}
        <Input label="Tarif indicatif" value={f.prix} onChange={set("prix")} icon="💰" placeholder="ex: 5 000 – 20 000 FCFA"/>
        <Textarea label="Bio / Présentation" value={f.bio} onChange={set("bio")} placeholder="Décrivez votre expérience..."/>
      </>}
      <Btn onClick={submit} loading={loading} full size="lg" style={{marginTop:4}}>{mode==="login"?"Se connecter →":"Créer mon compte →"}</Btn>
      <p style={{textAlign:"center",fontSize:12,color:T.gray,marginTop:12,lineHeight:1.6}}>En continuant, vous acceptez nos <span style={{color:T.primary,cursor:"pointer"}}>CGU</span></p>
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  HOME SCREEN
// ═══════════════════════════════════════════
function HomeScreen({ navigate }) {
  const { user }=useApp();
  const [search,setSearch]=useState("");
  const [quartier,setQuartier]=useState("");
  const [providers,setProviders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [urgent,setUrgent]=useState(false);

  useEffect(()=>{ api.providers.list({available:true}).then(d=>{ setProviders(d); setLoading(false); }); },[]);

  const topRated=[...providers].sort((a,b)=>(b.avgRating||0)-(a.avgRating||0)).slice(0,4);
  const catCounts=CATEGORIES.map(c=>({...c,count:providers.filter(p=>p.category===c.id).length}));

  return <div style={{minHeight:"100vh",background:T.bg,paddingBottom:80}}>
    <div style={{background:T.grad1,padding:"20px 16px 44px",position:"relative",overflow:"hidden"}}>
      {[[200,"-10%","-15%",0.06],[140,"70%","65%",0.05]].map(([s,x,y,o],i)=><div key={i} style={{position:"absolute",width:s,height:s,borderRadius:"50%",background:"#fff",opacity:o,left:x,top:y}}/>)}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,position:"relative"}}>
        <div>
          <p style={{margin:0,color:"rgba(255,255,255,0.7)",fontSize:13}}>Bienvenue 👋</p>
          <h2 style={{margin:0,color:"#fff",fontFamily:"Georgia,serif",fontSize:24}}>{user?.name}</h2>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>navigate("notifications")} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,width:40,height:40,cursor:"pointer",fontSize:18}}>🔔</button>
          <button onClick={()=>navigate("profile")} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,width:40,height:40,cursor:"pointer",fontSize:18}}>👤</button>
        </div>
      </div>
      <div style={{background:"#fff",borderRadius:14,padding:"0 14px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
        <span style={{fontSize:18,color:T.gray}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Service, prestataire, quartier..." style={{flex:1,border:"none",outline:"none",fontSize:14,padding:"13px 0",background:"transparent",fontFamily:"inherit",color:T.dark}}/>
        {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.gray}}>✕</button>}
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginTop:12,scrollbarWidth:"none"}}>
        {["Tous",...QUARTIERS].map(q=>(
          <button key={q} onClick={()=>setQuartier(q==="Tous"?"":q)} style={{flexShrink:0,padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:600,fontSize:12,background:quartier===(q==="Tous"?"":q)?T.white:"rgba(255,255,255,0.15)",color:quartier===(q==="Tous"?"":q)?T.primary:"#fff"}}>
            {q}
          </button>
        ))}
      </div>
    </div>
    <div style={{padding:"16px 14px",marginTop:-16}}>
      {/* Urgence */}
      <div onClick={()=>setUrgent(u=>!u)} style={{background:urgent?T.grad2:T.white,borderRadius:T.rLg,padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:14,boxShadow:T.shadow,cursor:"pointer",border:urgent?"none":`2px solid ${T.secondary}`,transition:"all 0.2s"}}>
        <div style={{width:44,height:44,borderRadius:14,background:urgent?"rgba(255,255,255,0.2)":T.secondary+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🚨</div>
        <div style={{flex:1}}>
          <p style={{margin:0,fontWeight:700,color:urgent?"#fff":T.dark,fontSize:15}}>Mode Urgence</p>
          <p style={{margin:0,fontSize:12,color:urgent?"rgba(255,255,255,0.8)":T.gray}}>Prestataire disponible immédiatement</p>
        </div>
        <div style={{width:24,height:24,borderRadius:"50%",background:urgent?"rgba(255,255,255,0.3)":"#F3F4F6",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:12,color:urgent?"#fff":T.gray}}>{urgent?"✓":"○"}</span>
        </div>
      </div>
      {/* Stats */}
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {[{n:providers.length,l:"Prestataires",i:"🔨"},{n:CATEGORIES.length,l:"Services",i:"📋"},{n:"11",l:"Quartiers",i:"📍"}].map(s=>(
          <div key={s.l} style={{flex:1,background:T.white,borderRadius:14,padding:"12px 8px",textAlign:"center",boxShadow:T.shadow}}>
            <p style={{margin:0,fontSize:20}}>{s.i}</p>
            <p style={{margin:"3px 0 0",fontWeight:800,fontSize:16,color:T.primary}}>{s.n}</p>
            <p style={{margin:0,fontSize:10,color:T.gray}}>{s.l}</p>
          </div>
        ))}
      </div>
      {/* Search results */}
      {search&&<div style={{marginBottom:20}}>
        <h4 style={{color:T.dark,margin:"0 0 12px",fontFamily:"Georgia,serif",fontSize:18}}>Résultats pour « {search} »</h4>
        {providers.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.services?.some(s=>s.toLowerCase().includes(search.toLowerCase()))).map(p=>(
          <ProviderCard key={p.id} provider={p} onPress={()=>navigate("detail",{provider:p})}/>
        ))}
      </div>}
      {!search&&<>
        {CAT_GROUPS.map(group=>{
          const cats=catCounts.filter(c=>c.group===group);
          return <div key={group} style={{marginBottom:20}}>
            <h4 style={{color:T.dark,margin:"0 0 12px",fontFamily:"Georgia,serif",fontSize:17}}>{group}</h4>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {cats.map(c=><div key={c.id} onClick={()=>navigate("category",{category:c.id,quartier})} style={{background:T.white,borderRadius:T.r,padding:"12px 6px",textAlign:"center",boxShadow:T.shadow,cursor:"pointer"}}>
                <div style={{fontSize:26}}>{c.icon}</div>
                <p style={{margin:"5px 0 0",fontSize:11,fontWeight:600,color:T.dark,lineHeight:1.2}}>{c.label}</p>
                {c.count>0&&<p style={{margin:"2px 0 0",fontSize:10,color:T.gray}}>{c.count}</p>}
              </div>)}
            </div>
          </div>;
        })}
        {topRated.length>0&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h4 style={{color:T.dark,margin:0,fontFamily:"Georgia,serif",fontSize:18}}>⭐ Mieux notés</h4>
            <span onClick={()=>navigate("allproviders")} style={{color:T.primary,fontSize:13,fontWeight:700,cursor:"pointer"}}>Voir tout →</span>
          </div>
          {topRated.map(p=><ProviderCard key={p.id} provider={p} onPress={()=>navigate("detail",{provider:p})}/>)}
        </>}
        {providers.length===0&&!loading&&<div style={{textAlign:"center",padding:"48px 20px"}}>
          <div style={{fontSize:56}}>🔍</div>
          <p style={{color:T.gray,marginTop:12,lineHeight:1.7}}>Aucun prestataire inscrit.<br/><strong style={{color:T.primary}}>Soyez le premier !</strong></p>
        </div>}
        {loading&&<Spinner/>}
      </>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  CATEGORY SCREEN
// ═══════════════════════════════════════════
function CategoryScreen({ category, initQuartier, navigate }) {
  const cat=getCat(category);
  const [providers,setProviders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [svc,setSvc]=useState(null);
  const [q,setQ]=useState(initQuartier||"");
  useEffect(()=>{ api.providers.list({category,quartier:q}).then(d=>{ setProviders(d); setLoading(false); }); },[category,q]);
  const filtered=svc?providers.filter(p=>p.services?.includes(svc)):providers;
  return <div style={{minHeight:"100vh",background:T.bg,paddingBottom:80}}>
    <div style={{height:180,position:"relative",overflow:"hidden"}}>
      <img src={cat?.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.75),rgba(0,0,0,0.15))"}}/>
      <button onClick={()=>navigate("home")} style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,0.2)",backdropFilter:"blur(6px)",border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontWeight:700,cursor:"pointer"}}>← Retour</button>
      <div style={{position:"absolute",bottom:16,left:16}}>
        <h2 style={{color:"#fff",margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:28}}>{cat?.icon} {cat?.label}</h2>
        <p style={{color:"rgba(255,255,255,0.75)",margin:0,fontSize:13}}>{cat?.group}</p>
      </div>
    </div>
    <div style={{padding:"14px 14px 0"}}>
      <Select value={q} onChange={e=>setQ(e.target.value)} placeholder="📍 Tous les quartiers" options={QUARTIERS}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
        <span onClick={()=>setSvc(null)} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:!svc?T.primary:T.white,color:!svc?"#fff":T.gray,boxShadow:T.shadow}}>Tous</span>
        {(SERVICES[category]||[]).map(s=><span key={s} onClick={()=>setSvc(s===svc?null:s)} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:svc===s?T.primary:T.white,color:svc===s?"#fff":T.gray,boxShadow:T.shadow}}>{s}</span>)}
      </div>
      <p style={{fontSize:12,color:T.gray,fontWeight:600,margin:"0 0 12px"}}>{filtered.length} PRESTATAIRE(S)</p>
      {loading?<Spinner/>:filtered.length===0?<div style={{textAlign:"center",padding:"32px 0"}}><p style={{color:T.gray}}>Aucun prestataire disponible.</p></div>:filtered.map(p=><ProviderCard key={p.id} provider={p} onPress={()=>navigate("detail",{provider:p,from:"category",fromData:{category,initQuartier:q}})}/>)}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  DETAIL SCREEN
// ═══════════════════════════════════════════
function DetailScreen({ providerInit, from, fromData, navigate }) {
  const { user }=useApp();
  const toast=useToast();
  const [provider,setProvider]=useState(providerInit);
  const [tab,setTab]=useState("info");
  const [reviews,setReviews]=useState([]);
  const cat=getCat(provider.category);

  useEffect(()=>{ api.reviews.forProvider(provider.id).then(setReviews); },[provider.id]);
  const goBack=()=>from?navigate(from,fromData):navigate("home");

  return <div style={{minHeight:"100vh",background:T.bg,paddingBottom:80}}>
    <ToastContainer items={toast.items} remove={toast.remove}/>
    <div style={{height:220,position:"relative",overflow:"hidden"}}>
      {provider.photoUrl?<img src={provider.photoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{height:"100%",background:`linear-gradient(135deg,${cat?.color}44,${cat?.color}77)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:72}}>{cat?.icon}</div>}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.75),rgba(0,0,0,0.1))"}}/>
      <button onClick={goBack} style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,0.2)",backdropFilter:"blur(6px)",border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontWeight:700,cursor:"pointer"}}>← Retour</button>
      {provider.verified&&<span style={{position:"absolute",top:14,right:14,background:T.success,color:"#fff",borderRadius:8,padding:"4px 12px",fontSize:12,fontWeight:700}}>✓ Vérifié</span>}
      <div style={{position:"absolute",bottom:16,left:16}}>
        <h2 style={{color:"#fff",margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:24}}>{provider.name}</h2>
        <p style={{color:"rgba(255,255,255,0.8)",margin:0,fontSize:13}}>📍 {provider.quartier} · {cat?.label}</p>
      </div>
    </div>
    <div style={{display:"flex",background:T.white,borderBottom:`1px solid ${T.bg}`}}>
      {[{v:provider.avgRating||"–",l:"Note"},{v:reviews.length,l:"Avis"},{v:provider.available?"✓":"✗",l:"Dispo"},{v:provider.completedOrders||0,l:"Missions"}].map(s=>(
        <div key={s.l} style={{flex:1,padding:"12px 8px",textAlign:"center",borderRight:`1px solid ${T.bg}`}}>
          <p style={{margin:0,fontSize:18,fontWeight:800,color:T.primary}}>{s.v}</p>
          <p style={{margin:0,fontSize:11,color:T.gray}}>{s.l}</p>
        </div>
      ))}
    </div>
    <div style={{display:"flex",background:T.white,borderBottom:`2px solid ${T.bg}`,position:"sticky",top:0,zIndex:10}}>
      {[["info","📋 Info"],["book","📅 Réserver"],["avis","⭐ Avis"]].map(([t,l])=>(
        <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"12px",border:"none",background:"transparent",cursor:"pointer",fontWeight:700,fontSize:13,color:tab===t?T.primary:T.gray,borderBottom:tab===t?`3px solid ${T.primary}`:"3px solid transparent"}}>{l}</button>
      ))}
    </div>
    <div style={{padding:16}}>
      {tab==="info"&&<>
        {provider.bio&&<Card style={{marginBottom:14}}><h4 style={{margin:"0 0 8px",color:T.primary}}>À propos</h4><p style={{margin:0,color:T.gray,lineHeight:1.75,fontSize:14}}>{provider.bio}</p></Card>}
        <Card style={{marginBottom:14}}>
          <h4 style={{margin:"0 0 12px",color:T.primary}}>Informations</h4>
          {[["📞","Téléphone",provider.phone||"Non renseigné"],["💰","Tarif",provider.prix||"Sur devis"],["📍","Zone",provider.quartier],["🗓️","Membre depuis",fmt(provider.createdAt)]].map(([ic,k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.bg}`}}>
              <span style={{fontSize:14,color:T.gray}}>{ic} {k}</span>
              <span style={{fontSize:14,fontWeight:600,color:T.dark}}>{v}</span>
            </div>
          ))}
        </Card>
        {provider.services?.length>0&&<Card><h4 style={{margin:"0 0 12px",color:T.primary}}>Services proposés</h4><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{provider.services.map(s=><span key={s} style={{background:cat?.color+"22",color:cat?.color,borderRadius:8,padding:"6px 12px",fontSize:13,fontWeight:600}}>{s}</span>)}</div></Card>}
      </>}
      {tab==="book"&&<BookingForm provider={provider} navigate={navigate} toast={toast}/>}
      {tab==="avis"&&<ReviewsTab provider={provider} reviews={reviews} setReviews={setReviews} setProvider={setProvider} toast={toast}/>}
    </div>
  </div>;
}

function BookingForm({ provider, navigate, toast }) {
  const { user }=useApp();
  const [svc,setSvc]=useState(""); const [date,setDate]=useState(""); const [time,setTime]=useState("");
  const [note,setNote]=useState(""); const [pay,setPay]=useState(""); const [amount,setAmount]=useState("");
  const [done,setDone]=useState(false); const [loading,setLoading]=useState(false);
  const PAYS=[
    {id:"wave",  name:"Wave CI",       icon:"🌊",color:"#0A3EAD",desc:"Paiement instantané"},
    {id:"orange",name:"Orange Money",  icon:"🟠",color:"#FF6600",desc:"Mobile Money Orange"},
    {id:"mtn",   name:"MTN MoMo",      icon:"💛",color:"#FFCC00",desc:"Mobile Money MTN"},
    {id:"card",  name:"Carte bancaire",icon:"💳",color:"#1A56DB",desc:"Visa / Mastercard"},
    {id:"cash",  name:"Payer après",   icon:"💵",color:"#059669",desc:"Payez après le service"},
  ];
  const submit=async()=>{
    if(!svc||!date||!pay){ toast.error("Remplissez tous les champs obligatoires"); return; }
    setLoading(true);
    try {
      const booking = await api.bookings.create({ clientId:user.id, clientName:user.name, providerId:provider.id, providerName:provider.name, service:svc, date, time, note:Security.sanitize(note), payMethod:pay, amount:parseInt(amount)||0 });
      // Initier le paiement réel
      if(pay!=="cash") {
        await api.payments.initiate({ bookingId:booking.id, method:pay, amount:parseInt(amount)||0, phone:user.phone, clientName:user.name });
      }
      setDone(true); toast.success("Réservation confirmée ! 🎉");
    } catch(e){ toast.error(e.message); }
    setLoading(false);
  };
  if(done) return <Card style={{textAlign:"center",padding:"32px 16px"}}>
    <div style={{fontSize:64}}>🎉</div>
    <h3 style={{color:T.success,fontFamily:"Georgia,serif",margin:"12px 0 6px"}}>Réservation confirmée !</h3>
    <p style={{color:T.gray,fontSize:14,marginBottom:16}}>{provider.name} sera notifié et vous contactera rapidement.</p>
    <Btn onClick={()=>navigate("bookings")} variant="secondary">Voir mes réservations</Btn>
  </Card>;
  return <Card>
    <h4 style={{margin:"0 0 16px",color:T.primary}}>Détails de la réservation</h4>
    <Select label="Service *" value={svc} onChange={e=>setSvc(e.target.value)} placeholder="Choisir un service" options={provider.services?.length?provider.services:(SERVICES[provider.category]||[])} required/>
    <Input label="Date *" type="date" value={date} onChange={e=>setDate(e.target.value)} required/>
    <Input label="Heure préférée" type="time" value={time} onChange={e=>setTime(e.target.value)}/>
    <Input label="Montant estimé (FCFA)" type="number" value={amount} onChange={e=>setAmount(e.target.value)} icon="💰" placeholder="ex: 15000"/>
    <Textarea label="Note pour le prestataire" value={note} onChange={e=>setNote(e.target.value)} placeholder="Décrivez votre besoin..."/>
    <h4 style={{margin:"0 0 12px",color:T.primary}}>Mode de paiement *</h4>
    <div style={{background:"#FFFBEB",border:`1px solid ${T.warning}`,borderRadius:10,padding:"9px 12px",fontSize:13,color:"#92400E",marginBottom:12}}>
      💡 Pour activer les paiements réels : ajoutez vos clés Wave/CinetPay dans le fichier .env
    </div>
    {PAYS.map(m=><div key={m.id} onClick={()=>setPay(m.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",borderRadius:T.r,border:`2px solid ${pay===m.id?m.color:T.border}`,marginBottom:10,cursor:"pointer",background:pay===m.id?m.color+"11":T.white,transition:"all 0.15s"}}>
      <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${pay===m.id?m.color:"#D1D5DB"}`,background:pay===m.id?m.color:T.white,transition:"all 0.2s"}}/>
      <span style={{fontSize:22}}>{m.icon}</span>
      <div style={{flex:1}}><p style={{margin:0,fontWeight:700,color:T.dark,fontSize:14}}>{m.name}</p><p style={{margin:0,fontSize:11,color:T.gray}}>{m.desc}</p></div>
      {amount&&pay===m.id&&<div style={{textAlign:"right"}}><p style={{margin:0,fontSize:13,fontWeight:700,color:m.color}}>{fmtAmt(amount)}</p><p style={{margin:0,fontSize:10,color:T.gray}}>Com: {fmtAmt(Math.round(amount*COMMISSION))}</p></div>}
    </div>)}
    <Btn onClick={submit} loading={loading} full size="lg" variant="secondary" style={{marginTop:8}}>Confirmer la réservation →</Btn>
  </Card>;
}

function ReviewsTab({ provider, reviews, setReviews, setProvider, toast }) {
  const { user }=useApp();
  const [rating,setRating]=useState(0); const [comment,setComment]=useState(""); const [rated,setRated]=useState(false);
  const handleReview=async()=>{
    if(!rating){ toast.error("Choisissez une note"); return; }
    await api.reviews.add(provider.id, rating, comment, user?.name||"Anonyme");
    const r=await api.reviews.forProvider(provider.id); setReviews(r);
    const p=await api.providers.get(provider.id); if(p) setProvider(p);
    setRated(true); toast.success("Avis enregistré !");
  };
  return <>{reviews.length>0&&<Card style={{marginBottom:14}}>
    <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
      <div style={{textAlign:"center"}}>
        <p style={{margin:0,fontSize:40,fontWeight:800,color:T.warning,fontFamily:"Georgia,serif"}}>{provider.avgRating||"–"}</p>
        <StarDisplay value={provider.avgRating} size={16}/>
        <p style={{margin:"4px 0 0",fontSize:12,color:T.gray}}>{reviews.length} avis</p>
      </div>
      <div style={{flex:1}}>
        {[5,4,3,2,1].map(s=>{ const cnt=reviews.filter(r=>r.rating===s).length; const pct=reviews.length?(cnt/reviews.length)*100:0;
          return <div key={s} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
            <span style={{fontSize:11,color:T.gray,width:8}}>{s}</span>
            <div style={{flex:1,height:6,background:"#E5E7EB",borderRadius:3}}><div style={{width:`${pct}%`,height:"100%",background:T.warning,borderRadius:3}}/></div>
            <span style={{fontSize:11,color:T.gray,width:16}}>{cnt}</span>
          </div>;})}
      </div>
    </div>
    {[...reviews].reverse().map((r,i)=><div key={r.id} style={{padding:"12px 0",borderBottom:i<reviews.length-1?`1px solid ${T.bg}`:"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
        <div style={{width:36,height:36,borderRadius:10,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>👤</div>
        <div><p style={{margin:0,fontWeight:600,fontSize:14,color:T.dark}}>{r.clientName}</p><p style={{margin:0,fontSize:11,color:T.gray}}>{fmt(r.date)}</p></div>
        <div style={{marginLeft:"auto"}}><StarDisplay value={r.rating} size={13}/></div>
      </div>
      {r.comment&&<p style={{margin:"0 0 0 46px",fontSize:13,color:T.gray,fontStyle:"italic"}}>"{r.comment}"</p>}
    </div>)}
  </Card>}
  <Card>
    <h4 style={{margin:"0 0 14px",color:T.primary}}>Laisser un avis</h4>
    {rated?<p style={{color:T.success,fontWeight:700}}>✅ Merci pour votre avis !</p>:<>
      <StarPicker value={rating} onChange={setRating}/>
      <Textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Partagez votre expérience..." style={{marginTop:12}}/>
      <Btn onClick={handleReview} disabled={!rating}>Soumettre l'avis</Btn>
    </>}
  </Card></>;
}

// ═══════════════════════════════════════════
//  BOOKINGS SCREEN (client)
// ═══════════════════════════════════════════
const SC={pending:T.warning,confirmed:T.success,completed:T.primary,cancelled:T.danger,rejected:"#9CA3AF"};
const SL={pending:"En attente",confirmed:"Confirmé",completed:"Terminé",cancelled:"Annulé",rejected:"Refusé"};

function BookingsScreen({ navigate }) {
  const { user }=useApp();
  const [bookings,setBookings]=useState([]); const [loading,setLoading]=useState(true); const [filter,setFilter]=useState("all");
  useEffect(()=>{ api.bookings.list(user.id,"client").then(d=>{ setBookings(d.reverse()); setLoading(false); }); },[]);
  const filtered=filter==="all"?bookings:bookings.filter(b=>b.status===filter);
  return <div style={{minHeight:"100vh",background:T.bg,paddingBottom:80}}>
    <TopBar title="Mes réservations"/>
    <div style={{padding:"12px 14px"}}>
      <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:16,scrollbarWidth:"none"}}>
        {[["all","Toutes"],["pending","En attente"],["confirmed","Confirmées"],["completed","Terminées"],["cancelled","Annulées"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{flexShrink:0,padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:600,fontSize:12,background:filter===v?T.primary:T.white,color:filter===v?"#fff":T.gray,boxShadow:T.shadow}}>{l}</button>
        ))}
      </div>
      {loading?<Spinner/>:filtered.length===0?<div style={{textAlign:"center",padding:"48px 16px"}}><div style={{fontSize:52}}>📅</div><p style={{color:T.gray,marginTop:12}}>Aucune réservation.</p><Btn onClick={()=>navigate("home")} style={{marginTop:16}}>Trouver un prestataire</Btn></div>:
      filtered.map(b=><Card key={b.id} style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div><p style={{margin:"0 0 3px",fontWeight:700,color:T.dark,fontSize:15}}>{b.service}</p><p style={{margin:0,fontSize:13,color:T.gray}}>👤 {b.providerName}</p></div>
          <span style={{background:SC[b.status]+"22",color:SC[b.status],borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700}}>{SL[b.status]||b.status}</span>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
          <span style={{fontSize:12,color:T.gray}}>📅 {fmt(b.date)}</span>
          {b.time&&<span style={{fontSize:12,color:T.gray}}>🕐 {b.time}</span>}
          {b.amount>0&&<span style={{fontSize:12,color:T.gray}}>💰 {fmtAmt(b.amount)}</span>}
        </div>
        {b.note&&<p style={{margin:"8px 0 0",fontSize:12,color:T.gray,fontStyle:"italic",borderTop:`1px solid ${T.bg}`,paddingTop:8}}>{b.note}</p>}
      </Card>)}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  PROVIDER DASHBOARD
// ═══════════════════════════════════════════
function DashboardScreen({ navigate }) {
  const { user }=useApp();
  const toast=useToast();
  const [profile,setProfile]=useState(null);
  const [bookings,setBookings]=useState([]);
  const [tab,setTab]=useState("stats");
  const [editSvcs,setEditSvcs]=useState([]);
  const [editBio,setEditBio]=useState("");
  const [editPrix,setEditPrix]=useState("");
  const [editPhone,setEditPhone]=useState("");
  const [editAvail,setEditAvail]=useState(true);
  const [saved,setSaved]=useState(false);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ Promise.all([api.providers.mine(user.id),api.bookings.list(user.id,"provider")]).then(([p,b])=>{
    if(p){ setProfile(p); setEditSvcs(p.services||[]); setEditBio(p.bio||""); setEditPrix(p.prix||""); setEditPhone(p.phone||""); setEditAvail(p.available!==false); }
    setBookings(b.reverse()); setLoading(false);
  }); },[]);

  const save=async()=>{
    if(!profile) return;
    const u={...profile,services:editSvcs,bio:Security.sanitize(editBio),prix:editPrix,phone:editPhone,available:editAvail};
    await api.providers.save(u); setProfile(u);
    setSaved(true); setTimeout(()=>setSaved(false),2500); toast.success("Profil mis à jour !");
  };

  const updateStatus=async(id,status)=>{
    await api.bookings.updateStatus(id,status);
    setBookings(prev=>prev.map(b=>b.id===id?{...b,status,updatedAt:now()}:b));
    if(status==="confirmed") toast.success("Mission acceptée !");
    if(status==="rejected") toast.info("Mission refusée.");
    if(status==="completed") { toast.success("Mission terminée !"); }
  };

  if(loading) return <Spinner/>;
  const pending=bookings.filter(b=>b.status==="pending");
  const completed=bookings.filter(b=>b.status==="completed");
  const totalEarnings=completed.reduce((a,b)=>a+(b.providerAmount||0),0);

  return <div style={{minHeight:"100vh",background:T.bg,paddingBottom:80}}>
    <ToastContainer items={toast.items} remove={toast.remove}/>
    <TopBar title="Mon Dashboard" right={profile&&<div onClick={()=>{ setEditAvail(!editAvail); setTimeout(save,100); }} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
      <span style={{fontSize:12,color:"rgba(255,255,255,0.8)"}}>{editAvail?"Disponible":"Indisponible"}</span>
      <div style={{width:44,height:24,borderRadius:12,background:editAvail?T.success:"#D1D5DB",position:"relative",transition:"background 0.2s"}}>
        <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:editAvail?23:3,transition:"left 0.2s",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}/>
      </div>
    </div>}/>
    <div style={{display:"flex",background:T.white,borderBottom:`2px solid ${T.bg}`}}>
      {[["stats","📊 Stats"],["orders","📋 Missions"],["services","⚙️ Services"],["earnings","💰 Revenus"]].map(([t,l])=>(
        <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"11px 4px",border:"none",background:"transparent",cursor:"pointer",fontWeight:700,fontSize:11,color:tab===t?T.primary:T.gray,borderBottom:tab===t?`3px solid ${T.primary}`:"3px solid transparent"}}>{l}</button>
      ))}
    </div>
    <div style={{padding:14}}>
      {tab==="stats"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[{v:bookings.length,l:"Total missions",i:"📋",c:T.primary},{v:pending.length,l:"En attente",i:"⏳",c:T.warning},{v:completed.length,l:"Terminées",i:"✅",c:T.success},{v:profile?.avgRating||"–",l:"Note",i:"⭐",c:T.warning}].map(s=>(
            <Card key={s.l} style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:44,height:44,borderRadius:14,background:s.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{s.i}</div>
              <div><p style={{margin:0,fontWeight:800,fontSize:16,color:s.c}}>{s.v}</p><p style={{margin:0,fontSize:11,color:T.gray}}>{s.l}</p></div>
            </Card>
          ))}
        </div>
        <Card>
          <h4 style={{margin:"0 0 14px",color:T.primary}}>Modifier mon profil</h4>
          <Input label="Téléphone" value={editPhone} onChange={e=>setEditPhone(e.target.value)} icon="📞"/>
          <Input label="Tarif indicatif" value={editPrix} onChange={e=>setEditPrix(e.target.value)} icon="💰" placeholder="ex: 5 000 – 20 000 FCFA"/>
          <Textarea label="Bio" value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Décrivez votre expérience..."/>
          <Btn onClick={save} full style={{background:saved?T.success:undefined}}>{saved?"✅ Profil mis à jour !":"Sauvegarder"}</Btn>
        </Card>
      </>}
      {tab==="orders"&&<>
        {pending.length>0&&<>
          <h4 style={{color:T.dark,margin:"0 0 10px",fontFamily:"Georgia,serif"}}>⏳ Nouvelles demandes ({pending.length})</h4>
          {pending.map(b=><Card key={b.id} style={{marginBottom:12,border:`2px solid ${T.warning}`}}>
            <p style={{margin:"0 0 4px",fontWeight:700,color:T.dark,fontSize:15}}>{b.service}</p>
            <p style={{margin:"0 0 8px",fontSize:13,color:T.gray}}>👤 {b.clientName} · 📅 {fmt(b.date)}</p>
            {b.amount>0&&<p style={{margin:"0 0 10px",fontSize:13,color:T.gray}}>💰 {fmtAmt(b.amount)} (net: {fmtAmt(b.providerAmount||0)})</p>}
            {b.note&&<p style={{margin:"0 0 10px",fontSize:12,color:T.gray,fontStyle:"italic"}}>{b.note}</p>}
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>updateStatus(b.id,"confirmed")} full>✅ Accepter</Btn>
              <Btn onClick={()=>updateStatus(b.id,"rejected")} variant="outline" full style={{color:T.danger,borderColor:T.danger}}>❌ Refuser</Btn>
            </div>
          </Card>)}
        </>}
        {bookings.filter(b=>b.status!=="pending").map(b=><Card key={b.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div><p style={{margin:"0 0 2px",fontWeight:700,color:T.dark,fontSize:14}}>{b.service}</p><p style={{margin:0,fontSize:12,color:T.gray}}>👤 {b.clientName} · {fmt(b.date)}</p></div>
            <span style={{background:SC[b.status]+"22",color:SC[b.status],borderRadius:8,padding:"3px 9px",fontSize:11,fontWeight:700}}>{SL[b.status]}</span>
          </div>
          {b.status==="confirmed"&&<Btn onClick={()=>updateStatus(b.id,"completed")} size="sm" style={{marginTop:10,background:T.success}}>Marquer terminé</Btn>}
        </Card>)}
        {bookings.length===0&&<div style={{textAlign:"center",padding:"32px 0"}}><div style={{fontSize:48}}>📋</div><p style={{color:T.gray,marginTop:10}}>Aucune mission reçue.</p></div>}
      </>}
      {tab==="services"&&profile&&<Card>
        <h4 style={{margin:"0 0 6px",color:T.primary}}>Mes services</h4>
        <p style={{fontSize:13,color:T.gray,margin:"0 0 14px"}}>Sélectionnez vos services :</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {(SERVICES[profile.category]||[]).map(s=>{ const active=editSvcs.includes(s);
            return <div key={s} onClick={()=>{ setEditSvcs(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]); setSaved(false); }} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:T.r,border:`2px solid ${active?T.primary:T.border}`,cursor:"pointer",background:active?T.primary+"11":T.white,transition:"all 0.15s"}}>
              <div style={{width:22,height:22,borderRadius:7,background:active?T.primary:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{active&&<span style={{color:"#fff",fontSize:13,fontWeight:800}}>✓</span>}</div>
              <span style={{fontSize:14,fontWeight:600,color:active?T.primary:T.gray}}>{s}</span>
            </div>;})}
        </div>
        <Btn onClick={save} full style={{marginTop:16,background:saved?T.success:undefined}}>{saved?"✅ Sauvegardé !":"Enregistrer"}</Btn>
      </Card>}
      {tab==="earnings"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[{v:fmtAmt(totalEarnings),l:"Revenus nets",i:"💰",c:T.success},{v:fmtAmt(profile?.pendingEarnings||0),l:"En attente",i:"⏳",c:T.warning}].map(s=>(
            <Card key={s.l} style={{textAlign:"center",background:`linear-gradient(135deg,${s.c}11,${s.c}22)`}}>
              <p style={{margin:0,fontSize:30}}>{s.i}</p>
              <p style={{margin:"6px 0 2px",fontWeight:800,fontSize:15,color:s.c}}>{s.v}</p>
              <p style={{margin:0,fontSize:11,color:T.gray}}>{s.l}</p>
            </Card>
          ))}
        </div>
        <Card><h4 style={{margin:"0 0 12px",color:T.primary}}>💸 Retrait des fonds</h4><p style={{fontSize:13,color:T.gray,marginBottom:14}}>Disponible bientôt. Vous pourrez retirer via Wave, Orange Money ou MTN MoMo.</p><Btn full disabled>Retrait (bientôt)</Btn></Card>
      </>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  NOTIFICATIONS
// ═══════════════════════════════════════════
function NotificationsScreen({ navigate }) {
  const { user }=useApp();
  const [notifs,setNotifs]=useState([]);
  useEffect(()=>{ api.notifs.list(user.id).then(setNotifs); },[]);
  return <div style={{minHeight:"100vh",background:T.bg,paddingBottom:80}}>
    <TopBar title="Notifications" onBack={()=>navigate("home")}/>
    <div style={{padding:"12px 14px"}}>
      {notifs.length===0?<div style={{textAlign:"center",padding:"48px 16px"}}><div style={{fontSize:52}}>🔔</div><p style={{color:T.gray,marginTop:12}}>Aucune notification.</p></div>:
      notifs.map(n=><Card key={n.id} onClick={()=>{ api.notifs.markRead(user.id,n.id); setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x)); }} style={{marginBottom:10,opacity:n.read?0.6:1,cursor:"pointer"}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:22}}>{n.type==="booking"?"📅":n.type==="system"?"⚙️":"🔔"}</span>
          <div style={{flex:1}}>
            <p style={{margin:"0 0 4px",fontSize:14,color:T.dark,fontWeight:n.read?400:600}}>{n.msg}</p>
            <p style={{margin:0,fontSize:11,color:T.gray}}>{fmt(n.date)}</p>
          </div>
          {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:T.primary,flexShrink:0,marginTop:6}}/>}
        </div>
      </Card>)}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  PROFILE SCREEN
// ═══════════════════════════════════════════
function ProfileScreen({ navigate }) {
  const { user, logout }=useApp();
  const menu=[
    ...(user?.role==="provider"?[{icon:"📊",label:"Mon dashboard",action:()=>navigate("dashboard")}]:[]),
    ...(user?.role==="admin"?[{icon:"👑",label:"Administration",action:()=>navigate("admin")}]:[]),
    {icon:"📅",label:"Mes réservations",action:()=>navigate("bookings")},
    {icon:"🔔",label:"Notifications",action:()=>navigate("notifications")},
    {icon:"❓",label:"Aide & Support",action:()=>navigate("support")},
    {icon:"📜",label:"Conditions d'utilisation",action:()=>{}},
    {icon:"📣",label:"Parrainer un ami",action:()=>{}},
  ];
  return <div style={{minHeight:"100vh",background:T.bg,paddingBottom:80}}>
    <div style={{background:T.grad1,padding:"32px 16px 48px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"radial-gradient(circle at 2px 2px,#fff 1px,transparent 0)",backgroundSize:"24px 24px"}}/>
      <div style={{width:80,height:80,borderRadius:26,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 14px",border:"3px solid rgba(255,255,255,0.3)"}}>{user?.role==="admin"?"👑":user?.role==="provider"?"🔨":"👤"}</div>
      <h3 style={{color:"#fff",margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:24}}>{user?.name}</h3>
      <p style={{color:"rgba(255,255,255,0.7)",margin:"0 0 10px",fontSize:14}}>{user?.email}</p>
      <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",borderRadius:8,padding:"4px 12px",fontSize:12,fontWeight:700}}>{user?.role==="admin"?"👑 Administrateur":user?.role==="provider"?"🔨 Prestataire":"👤 Client"}</span>
    </div>
    <div style={{padding:16,marginTop:-20}}>
      <Card style={{marginBottom:16}}>
        {menu.map((item,i)=><div key={item.label} onClick={item.action} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:i<menu.length-1?`1px solid ${T.bg}`:"none",cursor:"pointer"}}>
          <span style={{fontSize:22}}>{item.icon}</span>
          <span style={{flex:1,fontWeight:600,color:T.dark,fontSize:15}}>{item.label}</span>
          <span style={{color:"#D1D5DB",fontSize:20}}>›</span>
        </div>)}
      </Card>
      <Btn onClick={logout} full style={{background:"#FEF2F2",color:T.danger,border:`2px solid #FECACA`}}>🚪 Se déconnecter</Btn>
      <p style={{textAlign:"center",color:"#D1D5DB",fontSize:11,marginTop:20}}>EasyService v2.0.0 · Abidjan, Côte d'Ivoire</p>
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  ADMIN DASHBOARD ← NOUVEAU
// ═══════════════════════════════════════════
function AdminDashboard({ navigate }) {
  const { user }=useApp();
  const toast=useToast();
  const [stats,setStats]=useState(null);
  const [tab,setTab]=useState("overview");
  const [providers,setProviders]=useState([]);
  const [users,setUsers]=useState([]);
  const [bookings,setBookings]=useState([]);
  const [loading,setLoading]=useState(true);
  const [commRate,setCommRate]=useState(0.10);

  useEffect(()=>{
    Promise.all([api.admin.stats(),api.admin.allProviders(),api.admin.allUsers(),api.admin.allBookings(),api.admin.getSettings()])
      .then(([s,p,u,b,settings])=>{ setStats(s); setProviders(p); setUsers(u); setBookings(b); setCommRate(settings.commissionRate||0.10); setLoading(false); });
  },[]);

  if(user?.role!=="admin") return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <Card style={{textAlign:"center",padding:"48px 24px"}}>
      <div style={{fontSize:56}}>🚫</div>
      <h3 style={{color:T.danger,fontFamily:"Georgia,serif"}}>Accès refusé</h3>
      <p style={{color:T.gray}}>Vous n'avez pas les droits administrateur.</p>
      <Btn onClick={()=>navigate("home")} style={{marginTop:16}}>Retour à l'accueil</Btn>
    </Card>
  </div>;

  const verifyProvider=async(id,v)=>{
    await api.admin.verifyProvider(id,v);
    setProviders(prev=>prev.map(p=>p.id===id?{...p,verified:v}:p));
    toast.success(v?"Prestataire vérifié !":"Vérification retirée.");
  };
  const suspendProvider=async(id,s)=>{
    await api.admin.suspendProvider(id,s);
    setProviders(prev=>prev.map(p=>p.id===id?{...p,suspended:s}:p));
    toast.success(s?"Prestataire suspendu.":"Prestataire réactivé.");
  };
  const suspendUser=async(id,s)=>{
    await api.admin.suspendUser(id,s);
    setUsers(prev=>prev.map(u=>u.id===id?{...u,active:!s}:u));
    toast.success(s?"Compte suspendu.":"Compte réactivé.");
  };
  const saveCommission=async()=>{
    await api.admin.setCommission(commRate);
    toast.success(`Commission mise à jour : ${Math.round(commRate*100)}%`);
  };

  return <div style={{minHeight:"100vh",background:T.bg,paddingBottom:80}}>
    <ToastContainer items={toast.items} remove={toast.remove}/>
    <div style={{background:T.gradAdmin,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:50,boxShadow:T.shadowLg}}>
      <span style={{fontSize:24}}>👑</span>
      <h3 style={{color:"#fff",margin:0,fontFamily:"Georgia,serif",fontSize:18,flex:1}}>Administration EasyService</h3>
      <span style={{background:"rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700}}>Admin</span>
    </div>
    {/* Tabs */}
    <div style={{display:"flex",background:T.white,borderBottom:`2px solid ${T.bg}`,overflowX:"auto"}}>
      {[["overview","📊 Vue d'ensemble"],["providers","🔨 Prestataires"],["users","👥 Utilisateurs"],["bookings","📋 Commandes"],["settings","⚙️ Paramètres"]].map(([t,l])=>(
        <button key={t} onClick={()=>setTab(t)} style={{flexShrink:0,padding:"11px 14px",border:"none",background:"transparent",cursor:"pointer",fontWeight:700,fontSize:12,color:tab===t?"#4338CA":T.gray,borderBottom:tab===t?"3px solid #4338CA":"3px solid transparent"}}>{l}</button>
      ))}
    </div>
    <div style={{padding:14}}>
      {loading&&<Spinner color="#4338CA"/>}
      {/* ── OVERVIEW ── */}
      {!loading&&tab==="overview"&&stats&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[
            {v:stats.totalUsers,      l:"Clients",           i:"👤",c:"#2563EB"},
            {v:stats.totalProviders,  l:"Prestataires",      i:"🔨",c:"#7C3AED"},
            {v:stats.totalBookings,   l:"Commandes total",   i:"📋",c:"#0891B2"},
            {v:stats.pendingProviders,l:"En attente valid.",  i:"⏳",c:T.warning},
            {v:stats.completedBookings,l:"Terminées",         i:"✅",c:T.success},
            {v:fmtAmt(stats.totalRevenue),l:"Chiffre d'affaires",i:"💰",c:T.success},
            {v:fmtAmt(stats.totalCommission),l:"Commissions CI",i:"📈",c:"#7C3AED"},
            {v:stats.suspendedUsers,  l:"Comptes suspendus", i:"🚫",c:T.danger},
          ].map(s=><Card key={s.l} style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:44,height:44,borderRadius:14,background:s.c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{s.i}</div>
            <div><p style={{margin:0,fontWeight:800,fontSize:15,color:s.c}}>{s.v}</p><p style={{margin:0,fontSize:11,color:T.gray}}>{s.l}</p></div>
          </Card>)}
        </div>
        {/* Prestataires en attente de validation */}
        {providers.filter(p=>!p.verified&&!p.suspended).length>0&&<Card style={{border:`2px solid ${T.warning}`}}>
          <h4 style={{margin:"0 0 12px",color:T.warning}}>⏳ Prestataires à valider</h4>
          {providers.filter(p=>!p.verified&&!p.suspended).map(p=>{
            const cat=getCat(p.category);
            return <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.bg}`}}>
              <div style={{width:40,height:40,borderRadius:12,background:cat?.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{cat?.icon}</div>
              <div style={{flex:1}}>
                <p style={{margin:0,fontWeight:700,color:T.dark,fontSize:14}}>{p.name}</p>
                <p style={{margin:0,fontSize:12,color:T.gray}}>📍 {p.quartier} · {cat?.label}</p>
              </div>
              <div style={{display:"flex",gap:6}}>
                <Btn onClick={()=>verifyProvider(p.id,true)} size="sm" variant="success" style={{background:T.success,color:"#fff"}}>✓ Valider</Btn>
                <Btn onClick={()=>verifyProvider(p.id,false)} size="sm" style={{background:T.danger,color:"#fff"}}>✗ Refuser</Btn>
              </div>
            </div>;})}
        </Card>}
      </>}
      {/* ── PROVIDERS ── */}
      {!loading&&tab==="providers"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h4 style={{margin:0,color:T.dark,fontFamily:"Georgia,serif"}}>Tous les prestataires ({providers.length})</h4>
        </div>
        {providers.map(p=>{
          const cat=getCat(p.category);
          return <Card key={p.id} style={{marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:44,height:44,borderRadius:12,background:cat?.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{cat?.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <p style={{margin:"0 0 2px",fontWeight:700,color:T.dark}}>{p.name}</p>
                  {p.verified&&<span style={{background:T.success+"22",color:T.success,borderRadius:6,padding:"1px 7px",fontSize:11,fontWeight:700}}>✓ Vérifié</span>}
                  {p.suspended&&<span style={{background:T.danger+"22",color:T.danger,borderRadius:6,padding:"1px 7px",fontSize:11,fontWeight:700}}>🚫 Suspendu</span>}
                </div>
                <p style={{margin:0,fontSize:12,color:T.gray}}>📍 {p.quartier} · {cat?.label} · {fmt(p.createdAt)}</p>
                <StarDisplay value={p.avgRating} count={p.ratings?.length} size={12}/>
              </div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {!p.verified&&<Btn onClick={()=>verifyProvider(p.id,true)} size="sm" style={{background:T.success,color:"#fff"}}>✓ Vérifier</Btn>}
              {p.verified&&<Btn onClick={()=>verifyProvider(p.id,false)} size="sm" variant="outline" style={{borderColor:T.warning,color:T.warning}}>Retirer vérif.</Btn>}
              {!p.suspended&&<Btn onClick={()=>suspendProvider(p.id,true)} size="sm" style={{background:T.danger,color:"#fff"}}>🚫 Suspendre</Btn>}
              {p.suspended&&<Btn onClick={()=>suspendProvider(p.id,false)} size="sm" style={{background:T.success,color:"#fff"}}>♻️ Réactiver</Btn>}
            </div>
          </Card>;})}
      </>}
      {/* ── USERS ── */}
      {!loading&&tab==="users"&&<>
        <h4 style={{margin:"0 0 12px",color:T.dark,fontFamily:"Georgia,serif"}}>Tous les utilisateurs ({users.length})</h4>
        {users.filter(u=>u.role!=="admin").map(u=><Card key={u.id} style={{marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:T.grad1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{u.role==="provider"?"🔨":"👤"}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <p style={{margin:"0 0 2px",fontWeight:700,color:T.dark}}>{u.name}</p>
                {!u.active&&<span style={{background:T.danger+"22",color:T.danger,borderRadius:6,padding:"1px 7px",fontSize:11,fontWeight:700}}>Suspendu</span>}
              </div>
              <p style={{margin:0,fontSize:12,color:T.gray}}>{u.email} · {u.role==="provider"?"Prestataire":"Client"} · {fmt(u.createdAt)}</p>
            </div>
            {u.active
              ?<Btn onClick={()=>suspendUser(u.id,true)} size="sm" style={{background:T.danger,color:"#fff"}}>🚫 Suspendre</Btn>
              :<Btn onClick={()=>suspendUser(u.id,false)} size="sm" style={{background:T.success,color:"#fff"}}>♻️ Réactiver</Btn>
            }
          </div>
        </Card>)}
      </>}
      {/* ── BOOKINGS ── */}
      {!loading&&tab==="bookings"&&<>
        <h4 style={{margin:"0 0 12px",color:T.dark,fontFamily:"Georgia,serif"}}>Toutes les commandes ({bookings.length})</h4>
        {bookings.map(b=><Card key={b.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <div><p style={{margin:"0 0 2px",fontWeight:700,color:T.dark,fontSize:14}}>{b.service}</p><p style={{margin:0,fontSize:12,color:T.gray}}>👤 {b.clientName} → 🔨 {b.providerName}</p></div>
            <span style={{background:SC[b.status]+"22",color:SC[b.status],borderRadius:8,padding:"3px 9px",fontSize:11,fontWeight:700}}>{SL[b.status]}</span>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:T.gray}}>📅 {fmt(b.date)}</span>
            {b.amount>0&&<><span style={{fontSize:12,color:T.gray}}>💰 {fmtAmt(b.amount)}</span><span style={{fontSize:12,color:"#7C3AED"}}>Commission: {fmtAmt(b.commission||0)}</span></>}
          </div>
        </Card>)}
      </>}
      {/* ── SETTINGS ── */}
      {!loading&&tab==="settings"&&<>
        <Card style={{marginBottom:14}}>
          <h4 style={{margin:"0 0 14px",color:T.primary}}>💰 Taux de commission</h4>
          <p style={{fontSize:13,color:T.gray,marginBottom:12}}>Taux prélevé sur chaque transaction. Actuellement : <strong>{Math.round(commRate*100)}%</strong></p>
          <input type="range" min="5" max="30" value={Math.round(commRate*100)} onChange={e=>setCommRate(e.target.value/100)} style={{width:"100%",marginBottom:12}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:13,color:T.gray}}>5%</span>
            <span style={{fontSize:16,fontWeight:800,color:T.primary}}>{Math.round(commRate*100)}%</span>
            <span style={{fontSize:13,color:T.gray}}>30%</span>
          </div>
          <Btn onClick={saveCommission} full>Sauvegarder la commission</Btn>
        </Card>
        <Card style={{background:"#F0F0FF"}}>
          <h4 style={{margin:"0 0 12px",color:"#4338CA"}}>👑 Comment devient-on admin ?</h4>
          <p style={{fontSize:13,color:"#4338CA",lineHeight:1.7,margin:0}}>
            Pour donner le rôle admin à un compte :<br/>
            <strong>1.</strong> Allez sur Railway → votre projet PostgreSQL → Data<br/>
            <strong>2.</strong> Exécutez cette commande SQL :<br/>
          </p>
          <div style={{background:"#1E1B4B",borderRadius:10,padding:"10px 14px",marginTop:10,fontSize:12,color:"#A5B4FC",fontFamily:"monospace"}}>
            UPDATE "User" SET role = 'admin'<br/>
            WHERE email = 'votre@email.com';
          </div>
        </Card>
      </>}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  SUPPORT
// ═══════════════════════════════════════════
function SupportScreen({ navigate }) {
  const [msg,setMsg]=useState(""); const [sent,setSent]=useState(false);
  return <div style={{minHeight:"100vh",background:T.bg,paddingBottom:80}}>
    <TopBar title="Aide & Support" onBack={()=>navigate("profile")}/>
    <div style={{padding:16}}>
      <Card style={{marginBottom:14}}>
        <h4 style={{margin:"0 0 14px",color:T.primary}}>📞 Nous contacter</h4>
        {[{i:"📱",l:"WhatsApp Support",v:"+225 07 00 00 00"},{i:"📧",l:"Email",v:"support@easyservice.ci"},{i:"⏰",l:"Horaires",v:"Lun–Sam 8h–20h"}].map(r=>(
          <div key={r.l} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.bg}`}}>
            <span style={{fontSize:22}}>{r.i}</span>
            <div><p style={{margin:0,fontSize:12,color:T.gray}}>{r.l}</p><p style={{margin:0,fontWeight:600,color:T.dark}}>{r.v}</p></div>
          </div>
        ))}
      </Card>
      <Card>
        <h4 style={{margin:"0 0 12px",color:T.primary}}>💬 Envoyer un message</h4>
        <Textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Décrivez votre problème..." rows={4}/>
        {sent?<p style={{color:T.success,fontWeight:600}}>✅ Message envoyé ! Réponse sous 24h.</p>:<Btn onClick={()=>msg.trim()&&setSent(true)} disabled={!msg.trim()} full>Envoyer →</Btn>}
      </Card>
      <Card style={{marginTop:14}}>
        <h4 style={{margin:"0 0 12px",color:T.primary}}>❓ FAQ</h4>
        {[["Comment réserver ?","Trouvez un prestataire, cliquez sur son profil, puis sur 'Réserver'."],["Comment payer ?","Wave, Orange Money, MTN MoMo ou carte bancaire."],["Comment laisser un avis ?","Allez sur le profil du prestataire → onglet Avis."],["Comment devenir prestataire ?","Inscrivez-vous en choisissant 'Prestataire'."]].map(([q,a],i,arr)=>(
          <div key={q} style={{padding:"12px 0",borderBottom:i<arr.length-1?`1px solid ${T.bg}`:"none"}}>
            <p style={{margin:"0 0 4px",fontWeight:700,color:T.dark,fontSize:14}}>{q}</p>
            <p style={{margin:0,fontSize:13,color:T.gray,lineHeight:1.6}}>{a}</p>
          </div>
        ))}
      </Card>
    </div>
  </div>;
}

// ═══════════════════════════════════════════
//  CSS GLOBAL
// ═══════════════════════════════════════════
const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:#F3F4F6;}
  input,select,textarea,button{font-family:'DM Sans',sans-serif;}
  select option{color:#111;background:#fff;}
  @keyframes popIn{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
  ::-webkit-scrollbar{width:3px;height:3px}
  ::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px}
  input:focus,select:focus,textarea:focus{border-color:#1A56DB!important;box-shadow:0 0 0 3px rgba(26,86,219,0.1)!important}
`;

const FIRST_VISIT="es_fv";

// ═══════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════
export default function App() {
  const [screen,setScreen]=useState("splash");
  const [sData, setSData] =useState({});
  const [user,  setUser]  =useState(()=>api.auth.session());
  const toast=useToast();

  const navigate=useCallback((to,data={})=>{ setScreen(to); setSData(data); window.scrollTo(0,0); },[]);
  const login  =u=>{ setUser(u); navigate("home"); };
  const logout =()=>{ api.auth.logout(); setUser(null); navigate("auth"); };

  const ctx={user,login,logout,navigate,toast};
  const showNav=!["splash","onboarding","auth"].includes(screen)&&user;
  const sp=showNav?72:0;

  return <AppCtx.Provider value={ctx}>
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",position:"relative",background:T.bg,boxShadow:"0 0 80px rgba(0,0,0,0.12)"}}>
      <style>{CSS}</style>
      <ToastContainer items={toast.items} remove={toast.remove}/>
      <div style={{paddingBottom:sp}}>
        {screen==="splash"        &&<SplashScreen onDone={()=>{ const fv=!localStorage.getItem(FIRST_VISIT); if(fv){ localStorage.setItem(FIRST_VISIT,"1"); navigate("onboarding"); } else navigate(user?"home":"auth"); }}/>}
        {screen==="onboarding"    &&<OnboardingScreen onDone={()=>navigate(user?"home":"auth")}/>}
        {screen==="auth"          &&!user&&<AuthScreen onLogin={login}/>}
        {screen==="home"          &&user&&<HomeScreen navigate={navigate}/>}
        {screen==="category"      &&<CategoryScreen category={sData.category} initQuartier={sData.quartier} navigate={navigate}/>}
        {screen==="allproviders"  &&<CategoryScreen category="" initQuartier="" navigate={navigate}/>}
        {screen==="detail"        &&sData.provider&&<DetailScreen providerInit={sData.provider} from={sData.from} fromData={sData.fromData} navigate={navigate}/>}
        {screen==="bookings"      &&user&&<BookingsScreen navigate={navigate}/>}
        {screen==="orders"        &&user&&<DashboardScreen navigate={navigate}/>}
        {screen==="notifications" &&user&&<NotificationsScreen navigate={navigate}/>}
        {screen==="profile"       &&user&&<ProfileScreen navigate={navigate}/>}
        {screen==="dashboard"     &&user&&<DashboardScreen navigate={navigate}/>}
        {screen==="admin"         &&user&&<AdminDashboard navigate={navigate}/>}
        {screen==="admin_providers"&&user&&<AdminDashboard navigate={navigate}/>}
        {screen==="admin_users"   &&user&&<AdminDashboard navigate={navigate}/>}
        {screen==="admin_bookings"&&user&&<AdminDashboard navigate={navigate}/>}
        {screen==="support"       &&<SupportScreen navigate={navigate}/>}
      </div>
      {showNav&&<BottomNav screen={screen} role={user?.role} navigate={navigate}/>}
    </div>
  </AppCtx.Provider>;
}
