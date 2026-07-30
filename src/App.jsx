import React, { useState, useEffect, useRef } from "react";
import {
  MapPin, Clock, CreditCard, Car, CheckCircle2, ChevronLeft,
  Calendar, Star, Navigation, Loader2, History, Settings, X, Plus
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ---------------------------------------------------------------------------
// Firebase (vraie base de données partagée entre tous les appareils)
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBjq3roSL4_qDwJS76C-nLEuoVMNomtFns",
  authDomain: "mba-premium-vtc.firebaseapp.com",
  projectId: "mba-premium-vtc",
  storageBucket: "mba-premium-vtc.firebasestorage.app",
  messagingSenderId: "947559121129",
  appId: "1:947559121129:web:317a81f3732018e3afb078",
  measurementId: "G-4PS617KS0G",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function dbGet(key) {
  const snap = await getDoc(doc(db, "app", key));
  return snap.exists() ? snap.data() : null;
}

async function dbSet(key, data) {
  await setDoc(doc(db, "app", key), data);
}

const LOGO_SRC = "data:image/png;base64,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";

// ---------------------------------------------------------------------------
// EmailJS (envoi réel d'email, sans backend)
// ---------------------------------------------------------------------------
const EMAILJS_SERVICE_ID = "servicevtc";
const EMAILJS_TEMPLATE_ID = "template_testvtc";
const EMAILJS_PUBLIC_KEY = "Z7JdFoaXftq1oU7kf";

let emailjsReadyPromise = null;
function loadEmailJS() {
  if (emailjsReadyPromise) return emailjsReadyPromise;
  emailjsReadyPromise = new Promise((resolve, reject) => {
    if (window.emailjs) {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      resolve(window.emailjs);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.async = true;
    script.onload = () => {
      try {
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        resolve(window.emailjs);
      } catch (e) {
        reject(e);
      }
    };
    script.onerror = () => reject(new Error("Impossible de charger EmailJS"));
    document.head.appendChild(script);
  });
  return emailjsReadyPromise;
}

// ---------------------------------------------------------------------------
// jsPDF (génération de PDF côté navigateur)
// ---------------------------------------------------------------------------
let jsPDFReadyPromise = null;
function loadJsPDF() {
  if (jsPDFReadyPromise) return jsPDFReadyPromise;
  jsPDFReadyPromise = new Promise((resolve, reject) => {
    if (window.jspdf && window.jspdf.jsPDF) {
      resolve(window.jspdf.jsPDF);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
    script.async = true;
    script.onload = () => {
      if (window.jspdf && window.jspdf.jsPDF) resolve(window.jspdf.jsPDF);
      else reject(new Error("jsPDF introuvable après chargement"));
    };
    script.onerror = () => reject(new Error("Impossible de charger jsPDF"));
    document.head.appendChild(script);
  });
  return jsPDFReadyPromise;
}

async function generateOrderPDFBlob({ courseNumber, clientName, clientPhone, clientEmail, pickup, dropoff, modeLabel, distanceKm, durationMin, priceHT, tva, price, driverKbis, reservedAt }) {
  const JsPDFClass = await loadJsPDF();
  const doc = new JsPDFClass();

  doc.setFontSize(18);
  doc.text("MBA Premium", 20, 20);
  doc.setFontSize(11);
  doc.text("Mindful.Business.Assurance", 20, 27);

  doc.setFontSize(16);
  doc.text("Bon de commande", 20, 45);
  doc.setFontSize(11);
  doc.text(`N° ${courseNumber}`, 20, 53);
  doc.text(`Réservation effectuée le ${reservedAt.toLocaleDateString("fr-FR")} à ${reservedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`, 20, 60);

  let y = 75;
  const line = (txt) => { doc.text(txt, 20, y); y += 8; };
  line(`Société : MBA Premium`);
  if (driverKbis) line(`Kbis n° ${driverKbis}`);
  line(`Client : ${clientName || "(non renseigné)"}`);
  if (clientPhone) line(`Téléphone : ${clientPhone}`);
  line(`Email du client : ${clientEmail}`);
  y += 4;
  line(`Départ : ${pickup}`);
  line(`Arrivée : ${dropoff}`);
  line(modeLabel);
  line(`Distance : ${distanceKm} km`);
  y += 4;
  doc.setFontSize(11);
  line(`Total HT (${distanceKm} km × 2,00 €) : ${formatEUR(priceHT)}`);
  line(`TVA (10%) : ${formatEUR(tva)}`);
  doc.setFontSize(13);
  line(`Total TTC : ${formatEUR(price)}`);
  doc.setFontSize(11);
  line("Paiement par carte bancaire");
  doc.setFontSize(9);
  y += 6;
  line("Ce document est une estimation et ne constitue pas une facture.");

  return doc.output("blob");
}

async function generateInvoicePDFBlob({ courseNumber, clientName, clientPhone, clientEmail, pickup, dropoff, distanceKm, durationMin, priceHT, tva, price, paymentMethod, paymentStatus, driverName, driverSiret, driverKbis, driverAddress, reservedAt }) {
  const JsPDFClass = await loadJsPDF();
  const doc = new JsPDFClass();

  doc.setFontSize(18);
  doc.text("MBA Premium", 20, 20);
  doc.setFontSize(11);
  doc.text("Mindful.Business.Assurance", 20, 27);

  doc.setFontSize(16);
  doc.text("Facture", 20, 45);
  doc.setFontSize(11);
  doc.text(`N° ${courseNumber}`, 20, 53);
  doc.text(`Réservation effectuée le ${reservedAt.toLocaleDateString("fr-FR")} à ${reservedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`, 20, 60);

  let y = 75;
  const line = (txt) => { doc.text(txt, 20, y); y += 8; };
  line(`Société : MBA Premium`);
  line(`Prestataire : ${driverName || "MBA Premium"}`);
  if (driverAddress) line(driverAddress);
  if (driverSiret) line(`SIRET : ${driverSiret}`);
  if (driverKbis) line(`Kbis n° ${driverKbis}`);
  y += 4;
  line(`Client : ${clientName || "(non renseigné)"}`);
  if (clientPhone) line(`Téléphone : ${clientPhone}`);
  line(`Email du client : ${clientEmail || "(non renseigné)"}`);
  y += 4;
  line(`Départ : ${pickup}`);
  line(`Arrivée : ${dropoff}`);
  line(`Distance : ${distanceKm} km`);
  y += 4;
  doc.setFontSize(11);
  line(`Total HT (${distanceKm} km × 2,00 €) : ${formatEUR(priceHT)}`);
  line(`TVA (10%) : ${formatEUR(tva)}`);
  doc.setFontSize(13);
  line(`Total TTC : ${formatEUR(price)}`);
  doc.setFontSize(11);
  line(`Moyen de paiement : ${paymentMethod}`);
  line(`Statut : ${paymentStatus}`);

  return doc.output("blob");
}

async function sendRealEmail(subject, message, toEmail) {
  const ejs = await loadEmailJS();
  return ejs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { subject, message, to_email: toEmail });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function priceFromDistance(distanceKm, durationMin) {
  const roundedDistanceKm = Math.round(distanceKm * 10) / 10;
  const priceHT = roundedDistanceKm * 2;
  const tva = priceHT * 0.10;
  const price = priceHT + tva;
  return {
    distanceKm: roundedDistanceKm,
    durationMin: Math.round(durationMin),
    priceHT: Math.round(priceHT * 100) / 100,
    tva: Math.round(tva * 100) / 100,
    price: Math.round(price * 100) / 100,
  };
}

function simulatedEstimate(pickup, dropoff) {
  const seed = hashString((pickup + "|" + dropoff).toLowerCase());
  const distanceKm = 2.5 + (seed % 180) / 10; // 2.5 - 20.5 km
  const durationMin = distanceKm * 2.1 + 4;
  return priceFromDistance(distanceKm, durationMin);
}

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=fr&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || !data.length) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

async function fetchDrivingRoute(origin, destination) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.routes || !data.routes.length) return null;
  return { distanceMeters: data.routes[0].distance, durationSeconds: data.routes[0].duration };
}

// Calcule un trajet réel (géocodage + itinéraire routier). Se rabat sur une estimation
// simulée si les adresses ne sont pas reconnues ou si le service est indisponible.
async function estimateTrip(pickup, dropoff) {
  try {
    const [origin, destination] = await Promise.all([geocodeAddress(pickup), geocodeAddress(dropoff)]);
    if (origin && destination) {
      const route = await fetchDrivingRoute(origin, destination);
      if (route) {
        return {
          ...priceFromDistance(route.distanceMeters / 1000, route.durationSeconds / 60),
          simulated: false,
        };
      }
    }
  } catch (e) {
    console.error("Itinéraire réel indisponible, estimation utilisée à la place :", e);
  }
  return { ...simulatedEstimate(pickup, dropoff), simulated: true };
}

function formatEUR(n) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Rend la recherche par numéro de course tolérante aux préfixes ("N°", "#"...), espaces et casse
function normalizeCourseNumber(s) {
  return (s || "")
    .trim()
    .toUpperCase()
    .replace(/^N[°ºO]?\.?\s*/, "")
    .replace(/^#\s*/, "")
    .replace(/\s+/g, "");
}

const DRIVER_PASSWORD = "Mahdi1234!";

export default function App() {
  const [view, setView] = useState("home"); // home | booking | payment | history | driverspace | track
  const [driver, setDriver] = useState({ name: "Votre chauffeur", vehicle: "Peugeot 508", plate: "AB-123-CD", rating: 4.9, siret: "", kbis: "", address: "", email: "mbapremiumfr@gmail.com" });
  const [trip, setTrip] = useState({ pickup: "", dropoff: "", mode: "later", date: "", time: "", clientName: "", clientPhone: "" });
  const [estimate, setEstimate] = useState(null);
  const [courseNumber, setCourseNumber] = useState("");
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [docTarget, setDocTarget] = useState(null); // { type: 'order'|'invoice', booking }

  // Définit l'icône de l'onglet du navigateur avec le logo MBA Premium
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/png";
    link.href = LOGO_SRC;
  }, []);

  // Load persisted data (partagé entre tous les utilisateurs de l'app, via Firestore)
  useEffect(() => {
    (async () => {
      try {
        const d = await dbGet("driver-profile");
        if (d) setDriver(d);
      } catch (e) {
        console.error("Chargement du profil chauffeur impossible :", e);
      }
      try {
        const b = await dbGet("bookings");
        if (b && Array.isArray(b.list)) setBookings(b.list);
      } catch (e) {
        console.error("Chargement des réservations impossible :", e);
      }
      setLoaded(true);
    })();
  }, []);

  async function persistDriver(next) {
    setDriver(next);
    try { await dbSet("driver-profile", next); } catch (e) { console.error("Enregistrement du profil impossible :", e); }
  }

  async function persistBookings(next) {
    setBookings(next);
    try { await dbSet("bookings", { list: next }); } catch (e) { console.error("Enregistrement des réservations impossible :", e); }
    return next;
  }

  function goBooking() {
    setEstimate(null);
    setView("booking");
  }

  async function nextCourseNumber() {
    let n = 1;
    try {
      const r = await dbGet("course-seq");
      if (r && r.n) n = r.n + 1;
    } catch (e) {
      console.error("Lecture du compteur de course impossible :", e);
    }
    try {
      await dbSet("course-seq", { n });
    } catch (e) {
      console.error("Écriture du compteur de course impossible :", e);
    }
    const year = new Date().getFullYear();
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `COURSE-${year}-${String(n).padStart(4, "0")}-${suffix}`;
  }

  // Génère le numéro de course et crée le bon de commande (persisté dès cette étape)
  async function goToPayment() {
    const est = await estimateTrip(trip.pickup, trip.dropoff);
    const number = await nextCourseNumber();
    const record = {
      id: uid(),
      courseNumber: number,
      pickup: trip.pickup,
      dropoff: trip.dropoff,
      mode: trip.mode,
      date: trip.date,
      time: trip.time,
      clientName: trip.clientName,
      clientPhone: trip.clientPhone,
      clientEmail: "",
      ...est,
      paymentMethod: "",
      paymentStatus: "Bon de commande émis",
      createdAt: new Date().toISOString(),
    };
    const next = [record, ...bookings].slice(0, 60);
    await persistBookings(next);
    setEstimate(est);
    setCourseNumber(number);
    setCurrentRecordId(record.id);
    setView("payment");
  }

  // Enregistre l'email du client saisi une fois le bon de commande envoyé
  async function attachClientEmail(clientEmail) {
    const next = bookings.map((b) => (b.id === currentRecordId ? { ...b, clientEmail } : b));
    await persistBookings(next);
  }

  // Appelé depuis l'espace chauffeur (protégé par mot de passe) pour confirmer un paiement
  async function confirmCoursePayment(number) {
    const idx = bookings.findIndex((b) => (b.courseNumber || "").toLowerCase() === number.trim().toLowerCase());
    if (idx === -1) return false;
    const updated = {
      ...bookings[idx],
      paymentStatus: "Course confirmée",
      paymentMethod: bookings[idx].paymentMethod || "Carte bancaire (SumUp)",
    };
    const next = [...bookings];
    next[idx] = updated;
    await persistBookings(next);

    try {
      if (updated.clientEmail) {
        const subject = `Course confirmée — ${updated.courseNumber}`;
        const rdv = updated.mode === "later" && updated.date
          ? `le ${new Date(updated.date).toLocaleDateString("fr-FR")} à ${updated.time}`
          : "à l'heure prévue";
        const message =
          `Bonjour,\n\n` +
          `Merci pour votre confiance ! Votre course a été confirmée par le chauffeur.\n\n` +
          `Le chauffeur va vous rejoindre ${rdv}, au ${updated.pickup}.\n\n` +
          `Numéro de course : ${updated.courseNumber}\n` +
          `Départ : ${updated.pickup}\n` +
          `Arrivée : ${updated.dropoff}\n` +
          `Montant : ${formatEUR(updated.price)}\n\n` +
          `Merci pour votre confiance.\nMBA Premium`;
        await sendRealEmail(subject, message, updated.clientEmail);
      }
    } catch (e) {
      // L'échec de l'envoi ne doit pas bloquer la confirmation.
    }

    return true;
  }

  return (
    <div className="vtc-root">
      <Style />
      <TopBar view={view} setView={setView} onDriverSpace={() => setView("driverspace")} driver={driver} />

      <main className="vtc-main">
        {view === "home" && <Home driver={driver} onBook={goBooking} onTrack={() => setView("track")} bookings={bookings} />}
        {view === "booking" && (
          <Booking trip={trip} setTrip={setTrip} onBack={() => setView("home")} onNext={goToPayment} />
        )}
        {view === "payment" && estimate && (
          <Payment
            trip={trip}
            estimate={estimate}
            courseNumber={courseNumber}
            driverEmail={driver.email}
            onBack={() => setView("booking")}
            onEmailAttached={attachClientEmail}
            onViewOrder={() => setDocTarget({ type: "order", booking: bookings.find((b) => b.id === currentRecordId) })}
          />
        )}
        {view === "history" && (
          <HistoryView
            bookings={bookings}
            onHome={() => setView("home")}
            onViewInvoice={(b) => setDocTarget({ type: "invoice", booking: b })}
          />
        )}
        {view === "track" && <TrackStatus bookings={bookings} onHome={() => setView("home")} />}
        {view === "driverspace" && (
          <DriverSpace
            bookings={bookings}
            onHome={() => setView("home")}
            onViewOrder={(b) => setDocTarget({ type: "order", booking: b })}
            onViewInvoice={(b) => setDocTarget({ type: "invoice", booking: b })}
            onConfirmPayment={confirmCoursePayment}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
      </main>

      {docTarget && (
        <div className="vtc-doc-overlay">
          <Document type={docTarget.type} booking={docTarget.booking} driver={driver} onClose={() => setDocTarget(null)} />
        </div>
      )}

      {showSettings && (
        <SettingsModal driver={driver} onSave={(d) => { persistDriver(d); setShowSettings(false); }} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top bar
// ---------------------------------------------------------------------------
function TopBar({ view, setView, onDriverSpace, driver }) {
  return (
    <header className="vtc-topbar">
      <div className="vtc-brand" onClick={() => setView("home")}>
        <img src={LOGO_SRC} alt="MBA Premium" className="vtc-brand-mark" />
        <div className="vtc-brand-text">
          <span>MBA <em>Premium</em></span>
          <small>Mindful.Business.Assurance</small>
        </div>
      </div>
      <button className="vtc-wheel-btn" onClick={onDriverSpace} title="Espace chauffeur">
        <SteeringWheelIcon size={22} />
      </button>
    </header>
  );
}

function SteeringWheelIcon({ size = 20, color = "#0B2A6B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.4" fill={color} stroke="none" />
      <line x1="12" y1="3" x2="12" y2="9.6" />
      <line x1="5.6" y1="16" x2="10.2" y2="13.2" />
      <line x1="18.4" y1="16" x2="13.8" y2="13.2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Home / hero with signature route animation
// ---------------------------------------------------------------------------
function Home({ driver, onBook, onTrack, bookings }) {
  return (
    <div className="vtc-home">
      <section className="vtc-hero">
        <div className="vtc-hero-copy">
          <img src={LOGO_SRC} alt="MBA Premium" className="vtc-hero-logo" />
          <span className="vtc-eyebrow">Réservation en direct</span>
          <h1>À l'heure, en toute <br />sécurité. Toujours.</h1>
          <p className="vtc-sub">
            Réservez votre chauffeur à l'avance, en toute tranquillité.
            Prix annoncé avant la course, paiement sécurisé par carte.
          </p>
          <button className="vtc-cta vtc-cta-gold" onClick={onBook}>
            Réserver une course <Navigation size={16} />
          </button>

          <div className="vtc-rating-badge">
            <span className="vtc-rating-value">{driver.rating.toFixed(1)}</span>
            <span className="vtc-rating-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="vtc-star-gold" />
              ))}
            </span>
          </div>
        </div>

        <MapCard />
      </section>

      {bookings.length > 0 && (
        <section className="vtc-recent">
          <h3>Dernières courses</h3>
          <div className="vtc-recent-list">
            {bookings.slice(0, 3).map((b) => (
              <div className="vtc-recent-item" key={b.id}>
                <MapPin size={14} />
                <div className="vtc-recent-text">
                  <span>{b.pickup || "Départ"}</span>
                  <span className="vtc-recent-arrow">→</span>
                  <span>{b.dropoff || "Arrivée"}</span>
                </div>
                <span className="vtc-recent-price">{formatEUR(b.price)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Animated "map" signature element — stylized map with a car driving along a route
function MapCard() {
  const pathRef = useRef(null);
  const [point, setPoint] = useState(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const duration = 5000;
    let start = null;
    let raf = null;
    function step(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) % duration;
      const progress = elapsed / duration;
      const p = path.getPointAtLength(len * progress);
      setPoint({ x: p.x, y: p.y });
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="vtc-map-card">
      <svg viewBox="0 0 320 220" className="vtc-map-svg">
        <rect x="0" y="0" width="320" height="220" fill="#EAEAE4" />
        <path d="M 260 -10 C 305 5, 325 45, 300 75 C 278 52, 258 25, 260 -10 Z" fill="#BEE3F8" />

        <g stroke="#FFFFFF" strokeWidth="11">
          <line x1="0" y1="60" x2="320" y2="60" />
          <line x1="0" y1="130" x2="320" y2="130" />
          <line x1="0" y1="190" x2="320" y2="190" />
          <line x1="60" y1="0" x2="60" y2="220" />
          <line x1="150" y1="0" x2="150" y2="220" />
          <line x1="230" y1="0" x2="230" y2="220" />
        </g>
        <g stroke="#DAD9D3" strokeWidth="1">
          <line x1="0" y1="60" x2="320" y2="60" />
          <line x1="0" y1="130" x2="320" y2="130" />
          <line x1="0" y1="190" x2="320" y2="190" />
          <line x1="60" y1="0" x2="60" y2="220" />
          <line x1="150" y1="0" x2="150" y2="220" />
          <line x1="230" y1="0" x2="230" y2="220" />
        </g>

        <rect x="78" y="78" width="42" height="32" fill="#DFDFD8" rx="3" />
        <rect x="168" y="16" width="38" height="26" fill="#DFDFD8" rx="3" />
        <rect x="16" y="98" width="26" height="22" fill="#DFDFD8" rx="3" />
        <rect x="250" y="150" width="32" height="26" fill="#DFDFD8" rx="3" />
        <rect x="168" y="150" width="26" height="30" fill="#DFDFD8" rx="3" />

        {/* Tour Eiffel */}
        <g transform="translate(48,4)" stroke="#5B6B7A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M10,0 L7,12 L4,24 L0,34 M10,0 L13,12 L16,24 L20,34 M7,12 L13,12 M4,24 L16,24 M0,34 L20,34" />
        </g>

        {/* Disneyland */}
        <g transform="translate(213,178)" stroke="#5B6B7A" strokeWidth="1.2" strokeLinejoin="round">
          <rect x="0" y="14" width="8" height="16" fill="#F2F1EC" />
          <path d="M0,14 L4,4 L8,14 Z" fill="#B9B9B2" />
          <rect x="24" y="14" width="8" height="16" fill="#F2F1EC" />
          <path d="M24,14 L28,4 L32,14 Z" fill="#B9B9B2" />
          <rect x="11" y="6" width="10" height="24" fill="#F2F1EC" />
          <path d="M11,6 L16,-6 L21,6 Z" fill="#B9B9B2" />
          <line x1="16" y1="-6" x2="16" y2="-11" strokeWidth="1" />
          <path d="M16,-11 L20,-9 L16,-7 Z" fill="#5B6B7A" stroke="none" />
        </g>

        {/* Arc de Triomphe */}
        <g transform="translate(210,92)">
          <path
            d="M0,0 H26 V20 H0 Z M8,20 V12 A5,5 0 0 1 18,12 V20 Z"
            fillRule="evenodd"
            fill="#C7C6C0"
            stroke="#5B6B7A"
            strokeWidth="1.2"
          />
        </g>

        {/* Aéroport */}
        <g transform="translate(80,178)" fill="#5B6B7A">
          <path d="M13,0 L15,10 L26,15 L26,17 L15,14 L15,21 L19,24 L19,26 L13,24 L7,26 L7,24 L11,21 L11,14 L0,17 L0,15 L11,10 Z" />
        </g>

        <path
          ref={pathRef}
          d="M 40 190 L 40 130 L 150 130 L 150 60 L 280 60"
          fill="none"
          stroke="var(--vtc-accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="40" cy="190" r="7" fill="var(--vtc-text)" />
        <circle cx="40" cy="190" r="3" fill="#FFFFFF" />

        <g transform="translate(280,60)">
          <path d="M0,-15 C7,-15 13,-9 13,-2 C13,8 0,18 0,18 C0,18 -13,8 -13,-2 C-13,-9 -7,-15 0,-15 Z" fill="var(--vtc-accent-2)" />
          <circle cx="0" cy="-2" r="4.5" fill="#FFFFFF" />
        </g>

        {point && (
          <g transform={`translate(${point.x},${point.y})`}>
            <circle r="10" fill="var(--vtc-accent-2)" stroke="#FFFFFF" strokeWidth="2.5" />
            <g transform="translate(-5,-5)">
              <Car size={10} color="#FFFFFF" />
            </g>
          </g>
        )}

        <g transform="translate(284,146)">
          <rect width="24" height="48" rx="7" fill="#FFFFFF" stroke="#E2E2DD" />
          <line x1="6" y1="12" x2="18" y2="12" stroke="#8A8A85" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="6" x2="12" y2="18" stroke="#8A8A85" strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="36" x2="18" y2="36" stroke="#8A8A85" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Booking form
// ---------------------------------------------------------------------------
function Booking({ trip, setTrip, onBack, onNext }) {
  const [calculating, setCalculating] = useState(false);
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const minLead = new Date(now.getTime() + 60 * 60 * 1000); // maintenant + 1h
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const minLeadDateStr = `${minLead.getFullYear()}-${pad(minLead.getMonth() + 1)}-${pad(minLead.getDate())}`;
  const minLeadTimeStr = `${pad(minLead.getHours())}:${pad(minLead.getMinutes())}`;
  const minTimeForSelectedDate = trip.date === minLeadDateStr ? minLeadTimeStr : undefined;

  const chosenDateTime = trip.date && trip.time ? new Date(`${trip.date}T${trip.time}`) : null;
  const isTimingValid = !!chosenDateTime && chosenDateTime.getTime() >= minLead.getTime();

  const canNext = trip.pickup.trim() && trip.dropoff.trim() && trip.date && trip.time && isTimingValid;

  return (
    <div className="vtc-panel">
      <PanelHeader title="Détails de la course" onBack={onBack} />

      <div className="vtc-field">
        <label>Nom du client (pour la facture)</label>
        <input
          type="text"
          placeholder="Jean Dupont"
          value={trip.clientName}
          onChange={(e) => setTrip({ ...trip, clientName: e.target.value })}
        />
      </div>

      <div className="vtc-field">
        <label>Numéro de téléphone</label>
        <input
          type="tel"
          placeholder="06 12 34 56 78"
          value={trip.clientPhone}
          onChange={(e) => setTrip({ ...trip, clientPhone: e.target.value })}
        />
      </div>

      <div className="vtc-field">
        <label><MapPin size={14} /> Adresse de départ</label>
        <input
          type="text"
          placeholder="Ex. 12 rue de Paris, Saint-Quentin-en-Yvelines"
          value={trip.pickup}
          onChange={(e) => setTrip({ ...trip, pickup: e.target.value })}
        />
      </div>

      <div className="vtc-field">
        <label><Navigation size={14} /> Adresse d'arrivée</label>
        <input
          type="text"
          placeholder="Ex. Aéroport d'Orly, Terminal 1"
          value={trip.dropoff}
          onChange={(e) => setTrip({ ...trip, dropoff: e.target.value })}
        />
      </div>

      <div className="vtc-field">
        <label><Clock size={14} /> Prise en charge souhaitée</label>
      </div>
      <div className="vtc-field-row">
        <div className="vtc-field">
          <label><Calendar size={14} /> Date</label>
          <input
            type="date"
            min={todayStr}
            value={trip.date}
            onChange={(e) => setTrip({ ...trip, date: e.target.value })}
          />
        </div>
        <div className="vtc-field">
          <label><Clock size={14} /> Heure</label>
          <input
            type="time"
            min={minTimeForSelectedDate}
            value={trip.time}
            onChange={(e) => setTrip({ ...trip, time: e.target.value })}
          />
        </div>
      </div>

      {trip.date && trip.time && !isTimingValid && (
        <p className="vtc-fineprint" style={{ color: "#c0392b", textAlign: "left", marginTop: -8, marginBottom: 14 }}>
          La réservation doit être faite au moins 1 heure avant la prise en charge.
        </p>
      )}
      <p className="vtc-fineprint" style={{ textAlign: "left", marginTop: -8, marginBottom: 14 }}>
        Les courses se réservent uniquement à l'avance, au moins 1 heure avant l'heure de prise en charge.
      </p>

      <button
        className="vtc-cta vtc-cta-block"
        disabled={!canNext || calculating}
        onClick={async () => { setCalculating(true); await onNext(); }}
      >
        {calculating ? (<><Loader2 size={16} className="vtc-spin" /> Calcul de l'itinéraire…</>) : "Voir le tarif estimé"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment (simulated card capture — see chat notes on real Stripe wiring)
// ---------------------------------------------------------------------------
function Payment({ trip, estimate, courseNumber, driverEmail, onBack, onEmailAttached, onViewOrder }) {
  const [clientEmail, setClientEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function sendOrderEmail() {
    setSending(true);
    setError("");
    const reservedAt = new Date();
    const subject = `Bon de commande ${courseNumber} — ${formatEUR(estimate.price)}`;
    const message =
      `Nouvelle demande de course à facturer :\n\n` +
      `Numéro de course : ${courseNumber}\n` +
      `Société : MBA Premium\n` +
      `Réservation effectuée le ${reservedAt.toLocaleDateString("fr-FR")} à ${reservedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}\n` +
      `Client : ${trip.clientName || "(non renseigné)"}\n` +
      `Email du client : ${clientEmail}\n\n` +
      `Départ : ${trip.pickup}\n` +
      `Arrivée : ${trip.dropoff}\n` +
      `${trip.mode === "now" ? "Départ immédiat" : `Planifiée le ${trip.date} à ${trip.time}`}\n` +
      `Distance : ${estimate.distanceKm} km\n\n` +
      `Total HT (${estimate.distanceKm} km × 2,00 €) : ${formatEUR(estimate.priceHT)}\n` +
      `TVA (10%) : ${formatEUR(estimate.tva)}\n` +
      `MONTANT TTC EXACT À DEMANDER : ${formatEUR(estimate.price)}\n\n` +
      `→ Envoyez le lien de paiement SumUp (carte bancaire) de ce montant exact à ${clientEmail}.`;

    try {
      await sendRealEmail(subject, message, driverEmail);
      await onEmailAttached(clientEmail);
      setSent(true);
    } catch (e) {
      const detail = (e && (e.text || e.message)) ? ` (${e.text || e.message})` : "";
      setError("Échec de l'envoi" + detail + ".");
      console.error("EmailJS error:", e);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="vtc-panel">
      <PanelHeader title="Paiement" onBack={onBack} />

      <div className="vtc-summary">
        <div className="vtc-summary-row">
          <span>{trip.pickup}</span>
          <span className="vtc-recent-arrow">→</span>
          <span>{trip.dropoff}</span>
        </div>
        <div className="vtc-summary-meta">
          {trip.mode === "now" ? "Départ immédiat" : `Planifiée · ${trip.date} à ${trip.time}`} · {estimate.distanceKm} km · ~{estimate.durationMin} min
        </div>
        <div className="vtc-summary-price">{formatEUR(estimate.price)}</div>
        {estimate.simulated && (
          <div className="vtc-summary-meta" style={{ marginTop: 6, color: "#B8860B" }}>
            Adresse non reconnue par le service cartographique — distance estimée approximativement.
          </div>
        )}
      </div>

      <button className="vtc-link-btn" onClick={onViewOrder}>Voir le bon de commande</button>

      <div className="vtc-field">
        <label>Votre adresse email</label>
        <input
          type="email"
          placeholder="vous@exemple.com"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          disabled={sent || sending}
        />
      </div>

      {error && <p className="vtc-fineprint" style={{ color: "#c0392b" }}>{error}</p>}

      {!sent ? (
        <button
          className="vtc-cta vtc-cta-block vtc-cta-sumup"
          disabled={!clientEmail.includes("@") || sending}
          onClick={sendOrderEmail}
        >
          {sending ? (<><Loader2 size={16} className="vtc-spin" /> Envoi en cours…</>) : "Envoyer le bon de commande au chauffeur"}
        </button>
      ) : (
        <div className="vtc-check-mail">
          <span className="vtc-check-mail-title">Vérifiez votre adresse mail</span>
          <span className="vtc-check-mail-sub">
            La réservation est envoyée à notre service de paiement. Vous allez recevoir un lien de paiement de {formatEUR(estimate.price)} à l'adresse {clientEmail}.
          </span>
        </div>
      )}

      <p className="vtc-fineprint">
        Le chauffeur reçoit le bon de commande par email et vous envoie ensuite le lien de paiement sur votre adresse mail saisie.
      </p>
    </div>
  );
}



// ---------------------------------------------------------------------------
// Live tracking (simulated driver position)
// ---------------------------------------------------------------------------
function Tracking({ booking, driver, onArrived }) {
  const pathRef = useRef(null);
  const [dash, setDash] = useState(1000);
  const [progress, setProgress] = useState(0); // 0 to 1
  const TOTAL_MS = 16000; // durée simulée du trajet à l'écran

  useEffect(() => {
    if (pathRef.current) setDash(pathRef.current.getTotalLength());
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / TOTAL_MS);
      setProgress(p);
      if (p >= 1) clearInterval(t);
    }, 120);
    return () => clearInterval(t);
  }, []);

  const remainingMin = Math.max(0, Math.round(booking.durationMin * (1 - progress)));
  const arrived = progress >= 1;
  const point = getPointOnPath(pathRef.current, progress);

  const statusLabel = arrived
    ? "Le chauffeur est arrivé"
    : progress > 0.85
    ? "Arrivée imminente"
    : booking.mode === "now"
    ? "Le chauffeur est en route"
    : "Le chauffeur rejoint le point de départ";

  return (
    <div className="vtc-panel">
      <PanelHeader title="Suivi en direct" onBack={onArrived} />

      <div className="vtc-track-card">
        <div className="vtc-track-status">
          <span className={"vtc-pulse" + (arrived ? " is-done" : "")} />
          <div>
            <div className="vtc-track-status-label">{statusLabel}</div>
            <div className="vtc-track-status-sub">
              {driver.name} · {driver.vehicle} · {driver.plate}
            </div>
          </div>
          {!arrived && (
            <div className="vtc-track-eta">
              <span>{remainingMin}</span>
              <small>min</small>
            </div>
          )}
        </div>

        <svg viewBox="0 0 320 220" className="vtc-route-svg">
          <path
            ref={pathRef}
            d="M 20 60 C 70 60, 40 160, 110 160 S 200 190, 190 120 S 250 60, 300 100"
            fill="none"
            stroke="var(--vtc-border)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 20 60 C 70 60, 40 160, 110 160 S 200 190, 190 120 S 250 60, 300 100"
            fill="none"
            stroke="var(--vtc-accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={dash}
            strokeDashoffset={dash - dash * progress}
          />
          <circle cx="20" cy="60" r="6" fill="var(--vtc-text)" />
          <circle cx="300" cy="100" r="7" fill="var(--vtc-accent-2)" />
          {point && (
            <g transform={`translate(${point.x},${point.y})`}>
              <circle r="11" fill="var(--vtc-accent)" className={arrived ? "" : "vtc-track-car-pulse"} />
              <g transform="translate(-5,-5)">
                <Car size={10} color="#FFFFFF" />
              </g>
            </g>
          )}
        </svg>

        <div className="vtc-track-addr">
          <MapPin size={13} />
          <span>{booking.pickup}</span>
          <span className="vtc-recent-arrow">→</span>
          <span>{booking.dropoff}</span>
        </div>
      </div>

      <button className="vtc-cta vtc-cta-block" disabled={!arrived} onClick={onArrived}>
        {arrived ? "Voir le récapitulatif" : "Suivi en cours…"}
      </button>
    </div>
  );
}

function getPointOnPath(pathEl, progress) {
  if (!pathEl) return null;
  const len = pathEl.getTotalLength();
  const p = pathEl.getPointAtLength(len * progress);
  return { x: p.x, y: p.y };
}

// ---------------------------------------------------------------------------
// Confirmation
// ---------------------------------------------------------------------------
function Confirm({ booking, driver, onHome, onViewInvoice }) {
  return (
    <div className="vtc-panel vtc-confirm">
      <div className="vtc-confirm-icon"><CheckCircle2 size={40} /></div>
      <h2>Course confirmée</h2>
      <p className="vtc-sub">
        {driver.name} arrive {booking.mode === "now" ? "dans quelques minutes" : `le ${booking.date} à ${booking.time}`}.
      </p>

      <div className="vtc-summary">
        <div className="vtc-summary-row">
          <span>{booking.pickup}</span>
          <span className="vtc-recent-arrow">→</span>
          <span>{booking.dropoff}</span>
        </div>
        <div className="vtc-summary-meta">{booking.distanceKm} km · ~{booking.durationMin} min · {booking.paymentMethod} · {booking.paymentStatus}</div>
        <div className="vtc-summary-price">{formatEUR(booking.price)}</div>
      </div>

      <button className="vtc-cta vtc-cta-block" onClick={onHome}>Retour à l'accueil</button>
      <button className="vtc-link-btn" onClick={onViewInvoice}>Voir la facture · {booking.courseNumber}</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------
function HistoryView({ bookings, onHome, onViewInvoice }) {
  return (
    <div className="vtc-panel">
      <PanelHeader title="Historique des courses" onBack={onHome} />
      {bookings.length === 0 && <p className="vtc-sub">Aucune course pour le moment.</p>}
      <div className="vtc-history-list">
        {bookings.map((b) => (
          <div className="vtc-history-item" key={b.id}>
            <div>
              <div className="vtc-summary-row" style={{ marginBottom: 4 }}>
                <span>{b.pickup}</span>
                <span className="vtc-recent-arrow">→</span>
                <span>{b.dropoff}</span>
              </div>
              <div className="vtc-summary-meta">
                {new Date(b.createdAt).toLocaleDateString("fr-FR")} · {b.distanceKm} km
              </div>
              {b.courseNumber && (
                <button className="vtc-link-btn" style={{ margin: "4px 0 0", textAlign: "left" }} onClick={() => onViewInvoice(b)}>
                  N° {b.courseNumber}
                </button>
              )}
            </div>
            <span className="vtc-recent-price">{formatEUR(b.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Document (bon de commande / facture)
// ---------------------------------------------------------------------------
function Document({ type, booking, driver, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const isInvoice = type === "invoice";

  if (!booking) {
    return (
      <div className="vtc-doc-wrap">
        <div className="vtc-doc-bar vtc-no-print">
          <button className="vtc-icon-btn" onClick={onClose}><ChevronLeft size={18} /></button>
          <span>Document introuvable</span>
        </div>
      </div>
    );
  }

  const docNumber = booking.courseNumber;
  const docDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
  const docTime = docDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  async function downloadPDF() {
    setDownloading(true);
    try {
      const modeLabel = booking.mode === "now" ? "Départ immédiat" : `Planifiée le ${booking.date} à ${booking.time}`;
      const blob = isInvoice
        ? await generateInvoicePDFBlob({
            courseNumber: docNumber,
            clientName: booking.clientName,
            clientPhone: booking.clientPhone,
            clientEmail: booking.clientEmail,
            pickup: booking.pickup,
            dropoff: booking.dropoff,
            distanceKm: booking.distanceKm,
            durationMin: booking.durationMin,
            priceHT: booking.priceHT,
            tva: booking.tva,
            price: booking.price,
            paymentMethod: booking.paymentMethod,
            paymentStatus: booking.paymentStatus,
            driverName: driver.name,
            driverSiret: driver.siret,
            driverKbis: driver.kbis,
            driverAddress: driver.address,
            reservedAt: docDate,
          })
        : await generateOrderPDFBlob({
            courseNumber: docNumber,
            clientName: booking.clientName,
            clientPhone: booking.clientPhone,
            clientEmail: booking.clientEmail,
            pickup: booking.pickup,
            dropoff: booking.dropoff,
            modeLabel,
            distanceKm: booking.distanceKm,
            durationMin: booking.durationMin,
            priceHT: booking.priceHT,
            tva: booking.tva,
            price: booking.price,
            driverKbis: driver.kbis,
            reservedAt: docDate,
          });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${isInvoice ? "facture" : "bon-de-commande"}-${docNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Erreur génération PDF :", e);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="vtc-doc-wrap">
      <div className="vtc-doc-bar vtc-no-print">
        <button className="vtc-icon-btn" onClick={onClose}><ChevronLeft size={18} /></button>
        <span>{isInvoice ? "Facture" : "Bon de commande"}</span>
        <button className="vtc-cta vtc-cta-sm" disabled={downloading} onClick={downloadPDF}>
          {downloading ? "Génération…" : "Télécharger le PDF"}
        </button>
      </div>

      <div className="vtc-doc-page">
        <div className="vtc-doc-head">
          <img src={LOGO_SRC} alt="MBA Premium" className="vtc-doc-logo" />
          <div className="vtc-doc-head-right">
            <h2>{isInvoice ? "Facture" : "Bon de commande"}</h2>
            <div>N° {docNumber}</div>
            <div>Réservation effectuée le {docDate.toLocaleDateString("fr-FR")} à {docTime}</div>
          </div>
        </div>

        <div className="vtc-doc-parties">
          <div>
            <span className="vtc-doc-label">Société</span>
            <p>MBA Premium</p>
            <p>Prestataire : {driver.name}</p>
            {driver.address && <p>{driver.address}</p>}
            {driver.siret && <p>SIRET : {driver.siret}</p>}
            {driver.kbis && <p>Kbis n° {driver.kbis}</p>}
            <p>{driver.vehicle} · {driver.plate}</p>
          </div>
          <div>
            <span className="vtc-doc-label">Client</span>
            <p>{booking.clientName || "Client MBA Premium"}</p>
            {booking.clientPhone && <p>{booking.clientPhone}</p>}
            {booking.clientEmail && <p>{booking.clientEmail}</p>}
          </div>
        </div>

        <table className="vtc-doc-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Détails</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Course VTC</td>
              <td>
                {booking.pickup} → {booking.dropoff}
                <br />
                {booking.distanceKm} km × 2,00 €
                {booking.mode === "later" && booking.date ? ` · ${booking.date} ${booking.time}` : ""}
              </td>
              <td>{formatEUR(booking.priceHT)}</td>
            </tr>
            <tr>
              <td colSpan={2}>TVA (10%)</td>
              <td>{formatEUR(booking.tva)}</td>
            </tr>
          </tbody>
        </table>

        <div className="vtc-doc-total">
          <span>Total {isInvoice ? "TTC" : "estimé TTC"}</span>
          <strong>{formatEUR(booking.price)}</strong>
        </div>

        {isInvoice && (
          <div className="vtc-doc-foot">
            <p>Paiement par carte bancaire — Moyen : {booking.paymentMethod} — Statut : {booking.paymentStatus}</p>
          </div>
        )}
        {!isInvoice && (
          <div className="vtc-doc-foot">
            <p>Paiement par carte bancaire. Ce document est une estimation et ne constitue pas une facture. La facture définitive sera émise après la course.</p>
          </div>
        )}
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// Espace chauffeur — protégé par mot de passe
// ---------------------------------------------------------------------------
function DriverSpace({ bookings, onHome, onViewOrder, onViewInvoice, onConfirmPayment, onOpenSettings }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [section, setSection] = useState("menu"); // menu | documents | confirm

  function tryLogin() {
    if (password === DRIVER_PASSWORD) {
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Mot de passe incorrect.");
    }
  }

  if (!authenticated) {
    return (
      <div className="vtc-panel">
        <PanelHeader title="Espace chauffeur" onBack={onHome} />
        <div className="vtc-field">
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setAuthError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") tryLogin(); }}
          />
        </div>
        {authError && <p className="vtc-fineprint" style={{ color: "#c0392b" }}>{authError}</p>}
        <button className="vtc-cta vtc-cta-block" onClick={tryLogin}>Entrer</button>
      </div>
    );
  }

  if (section === "documents") {
    return (
      <Lookup
        bookings={bookings}
        onHome={() => setSection("menu")}
        onViewOrder={onViewOrder}
        onViewInvoice={onViewInvoice}
      />
    );
  }

  if (section === "confirm") {
    return <ConfirmPaymentTool bookings={bookings} onHome={() => setSection("menu")} onConfirm={onConfirmPayment} />;
  }

  return (
    <div className="vtc-panel">
      <PanelHeader title="Espace chauffeur" onBack={onHome} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="vtc-cta vtc-cta-block" onClick={() => setSection("documents")}>
          Bon de commande &amp; facture
        </button>
        <button className="vtc-cta vtc-cta-block" onClick={() => setSection("confirm")}>
          Confirmer un paiement
        </button>
        <button className="vtc-cta vtc-cta-block" onClick={onOpenSettings}>
          Profil chauffeur
        </button>
      </div>
    </div>
  );
}

function ConfirmPaymentTool({ bookings, onHome, onConfirm }) {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState(null);
  const [status, setStatus] = useState(null); // null | 'not_found' | 'confirming' | 'success' | 'error'

  function locate() {
    const q = normalizeCourseNumber(query);
    const b = bookings.find((x) => normalizeCourseNumber(x.courseNumber) === q);
    setFound(b || null);
    setStatus(b ? null : "not_found");
  }

  async function confirm() {
    if (!found) return;
    setStatus("confirming");
    const ok = await onConfirm(found.courseNumber);
    setStatus(ok ? "success" : "error");
  }

  return (
    <div className="vtc-panel">
      <PanelHeader title="Confirmer un paiement" onBack={onHome} />

      <div className="vtc-field">
        <label>Numéro de course</label>
        <input
          type="text"
          placeholder="Ex. COURSE-2026-0001"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setFound(null); setStatus(null); }}
          onKeyDown={(e) => { if (e.key === "Enter") locate(); }}
        />
      </div>

      <button className="vtc-cta vtc-cta-block" disabled={!query.trim()} onClick={locate}>
        Rechercher
      </button>

      {status === "not_found" && (
        <p className="vtc-fineprint" style={{ marginTop: 16 }}>Aucune course trouvée avec ce numéro.</p>
      )}

      {found && status !== "success" && (
        <div className="vtc-summary" style={{ marginTop: 18 }}>
          <div className="vtc-summary-row">
            <span>{found.pickup}</span>
            <span className="vtc-recent-arrow">→</span>
            <span>{found.dropoff}</span>
          </div>
          <div className="vtc-summary-meta">
            Client : {found.clientName || "(non renseigné)"} · {found.clientEmail || "email non renseigné"}
          </div>
          <div className="vtc-summary-meta">Statut actuel : {found.paymentStatus}</div>
          <div className="vtc-summary-price">{formatEUR(found.price)}</div>

          <button
            className="vtc-cta vtc-cta-block"
            style={{ marginTop: 12 }}
            disabled={status === "confirming"}
            onClick={confirm}
          >
            {status === "confirming" ? "Confirmation en cours…" : "Confirmer le paiement"}
          </button>
          {status === "error" && (
            <p className="vtc-fineprint" style={{ color: "#c0392b", marginTop: 8 }}>Une erreur est survenue, réessayez.</p>
          )}
        </div>
      )}

      {status === "success" && (
        <div className="vtc-check-mail" style={{ marginTop: 18 }}>
          <span className="vtc-check-mail-title">Course confirmée ✅</span>
          <span className="vtc-check-mail-sub">Le client a été prévenu par email.</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TrackStatus — le client suit sa réservation avec son numéro de course
// ---------------------------------------------------------------------------
function TrackStatus({ bookings, onHome }) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);

  function search() {
    const q = normalizeCourseNumber(query);
    setResult(bookings.find((b) => normalizeCourseNumber(b.courseNumber) === q) || null);
    setSearched(true);
  }

  const isConfirmed = result && result.paymentStatus === "Course confirmée";

  return (
    <div className="vtc-panel">
      <PanelHeader title="Suivre ma réservation" onBack={onHome} />

      <div className="vtc-field">
        <label>Numéro de course</label>
        <input
          type="text"
          placeholder="Ex. COURSE-2026-0001"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") search(); }}
        />
      </div>

      <button className="vtc-cta vtc-cta-block" disabled={!query.trim()} onClick={search}>
        Rechercher
      </button>

      {searched && !result && (
        <p className="vtc-fineprint" style={{ marginTop: 16 }}>Aucune réservation trouvée avec ce numéro.</p>
      )}

      {result && (
        <div className="vtc-summary" style={{ marginTop: 18 }}>
          <div className="vtc-summary-row">
            <span>{result.pickup}</span>
            <span className="vtc-recent-arrow">→</span>
            <span>{result.dropoff}</span>
          </div>
          <div className="vtc-summary-meta">
            {result.mode === "later" && result.date ? `Prise en charge : ${result.date} à ${result.time}` : ""}
          </div>
          <div className="vtc-summary-price">{formatEUR(result.price)}</div>
          {!isConfirmed && (
            <div className="vtc-summary-meta" style={{ marginTop: 6 }}>Statut actuel : {result.paymentStatus}</div>
          )}
        </div>
      )}

      {isConfirmed && (
        <div className="vtc-check-mail" style={{ marginTop: 14 }}>
          <span className="vtc-check-mail-title">Réservation confirmée ✅</span>
          <span className="vtc-check-mail-sub">
            Le chauffeur va vous rejoindre {result.mode === "later" && result.date ? `le ${new Date(result.date).toLocaleDateString("fr-FR")} à ${result.time}` : "à l'heure prévue"}, au {result.pickup}.
            Merci pour votre confiance.
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lookup — retrouver un bon de commande / une facture par numéro de course
// ---------------------------------------------------------------------------
function Lookup({ bookings, onHome, onViewOrder, onViewInvoice }) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);

  function search() {
    const q = normalizeCourseNumber(query);
    const found = bookings.find((b) => normalizeCourseNumber(b.courseNumber) === q);
    setResult(found || null);
    setSearched(true);
  }

  const isPaid = result && result.paymentStatus && result.paymentStatus !== "Bon de commande émis";

  return (
    <div className="vtc-panel">
      <PanelHeader title="Retrouver une course" onBack={onHome} />

      <div className="vtc-field">
        <label>Numéro de course</label>
        <input
          type="text"
          placeholder="Ex. COURSE-2026-0001"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") search(); }}
        />
      </div>

      <button className="vtc-cta vtc-cta-block" disabled={!query.trim()} onClick={search}>
        Rechercher
      </button>

      {searched && !result && (
        <p className="vtc-fineprint" style={{ marginTop: 16 }}>
          Aucune course trouvée avec ce numéro. Vérifiez qu'il est bien complet.
        </p>
      )}

      {result && (
        <div className="vtc-summary" style={{ marginTop: 18 }}>
          <div className="vtc-summary-row">
            <span>{result.pickup}</span>
            <span className="vtc-recent-arrow">→</span>
            <span>{result.dropoff}</span>
          </div>
          <div className="vtc-summary-meta">
            N° {result.courseNumber} · {new Date(result.createdAt).toLocaleDateString("fr-FR")} · {result.distanceKm} km
          </div>
          <div className="vtc-summary-price">{formatEUR(result.price)}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            <button className="vtc-cta vtc-cta-block" onClick={() => onViewOrder(result)}>
              Télécharger le bon de commande (PDF)
            </button>
            <button className="vtc-cta vtc-cta-block" disabled={!isPaid} onClick={() => onViewInvoice(result)}>
              Télécharger la facture (PDF)
            </button>
            {!isPaid && (
              <p className="vtc-fineprint">La facture sera disponible une fois le paiement confirmé.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsModal({ driver, onSave, onClose }) {
  const [form, setForm] = useState({ siret: "", kbis: "", address: "", email: "", ...driver });
  return (
    <div className="vtc-modal-backdrop" onClick={onClose}>
      <div className="vtc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="vtc-modal-head">
          <h3>Profil chauffeur</h3>
          <button className="vtc-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="vtc-field">
          <label>Nom</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="vtc-field">
          <label>Email (réception des bons de commande)</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="vtc-field">
          <label>Véhicule</label>
          <input value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} />
        </div>
        <div className="vtc-field">
          <label>Plaque</label>
          <input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
        </div>
        <div className="vtc-field">
          <label>SIRET (pour la facturation)</label>
          <input placeholder="123 456 789 00012" value={form.siret} onChange={(e) => setForm({ ...form, siret: e.target.value })} />
        </div>
        <div className="vtc-field">
          <label>Numéro de Kbis</label>
          <input placeholder="Ex. 123 456 789 RCS Paris" value={form.kbis} onChange={(e) => setForm({ ...form, kbis: e.target.value })} />
        </div>
        <div className="vtc-field">
          <label>Adresse professionnelle</label>
          <input placeholder="12 rue de Paris, 78180 Montigny" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <button className="vtc-cta vtc-cta-block" onClick={() => onSave(form)}>Enregistrer</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------
function PanelHeader({ title, onBack }) {
  return (
    <div className="vtc-panel-head">
      <button className="vtc-icon-btn" onClick={onBack}><ChevronLeft size={18} /></button>
      <h2>{title}</h2>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

      .vtc-root {
        --vtc-bg: #FFFFFF;
        --vtc-surface: #F2F9FF;
        --vtc-surface-alt: #E3F2FE;
        --vtc-border: #BFE3FB;
        --vtc-text: #0B2A4A;
        --vtc-text-muted: #5E7A93;
        --vtc-accent: #2FA8F0;
        --vtc-accent-2: #0B5FA5;
        background: var(--vtc-bg);
        color: var(--vtc-text);
        font-family: 'Inter', sans-serif;
        min-height: 100%;
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .vtc-root * { box-sizing: border-box; }
      .vtc-root h1, .vtc-root h2, .vtc-root h3 { font-family: 'Space Grotesk', sans-serif; margin: 0; }

      .vtc-topbar {
        display: flex; align-items: center; justify-content: space-between;
        padding: 18px 24px; border-bottom: 1px solid var(--vtc-border);
      }
      .vtc-brand { display: flex; align-items: center; gap: 10px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; cursor: pointer; }
      .vtc-brand em { font-style: normal; color: var(--vtc-accent); }
      .vtc-brand-mark { width: 34px; height: 34px; object-fit: contain; }
      .vtc-brand-text { display: flex; flex-direction: column; line-height: 1.2; }
      .vtc-brand-text small { font-family: 'Inter', sans-serif; font-weight: 500; font-size: 10px; color: var(--vtc-text-muted); letter-spacing: .02em; }
      .vtc-wheel-btn { width: 40px; height: 40px; border-radius: 50%; background: #0B2A6B; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform .15s; }
      .vtc-wheel-btn svg { stroke: #FFFFFF; }
      .vtc-wheel-btn svg circle:last-of-type { fill: #FFFFFF; }
      .vtc-wheel-btn:hover { transform: scale(1.06); }
      .vtc-hero-logo { width: 46px; height: 46px; object-fit: contain; margin-bottom: 12px; }
      .vtc-nav { display: flex; gap: 8px; }
      .vtc-navbtn {
        display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--vtc-border);
        color: var(--vtc-text-muted); padding: 8px 12px; border-radius: 8px; font-size: 13px; cursor: pointer;
        font-family: 'Inter', sans-serif; transition: all .15s;
      }
      .vtc-navbtn:hover, .vtc-navbtn.is-active { color: var(--vtc-text); border-color: var(--vtc-accent); }

      .vtc-main { padding: 28px 24px 36px; flex: 1; }

      .vtc-hero { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 28px; align-items: center; }
      @media (max-width: 720px) { .vtc-hero { grid-template-columns: 1fr; } }

      .vtc-eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: 11px; color: var(--vtc-accent); font-weight: 600; }
      .vtc-hero h1 { font-size: 40px; line-height: 1.08; margin: 10px 0 14px; font-weight: 700; }
      .vtc-sub { color: var(--vtc-text-muted); font-size: 14.5px; line-height: 1.55; margin: 0 0 20px; }

      .vtc-cta {
        display: inline-flex; align-items: center; gap: 8px; background: var(--vtc-accent); color: #FFFFFF;
        border: none; padding: 13px 20px; border-radius: 10px; font-weight: 600; font-size: 14.5px; cursor: pointer;
        font-family: 'Inter', sans-serif; transition: transform .15s, opacity .15s;
      }
      .vtc-cta:hover { transform: translateY(-1px); }
      .vtc-cta:disabled { opacity: .4; cursor: not-allowed; transform: none; }
      .vtc-cta-block { display: flex; width: 100%; justify-content: center; margin-top: 8px; }
      .vtc-cta-gold { background: linear-gradient(135deg, #E7C158, #C9982E); color: #14100A; box-shadow: 0 6px 18px rgba(201,152,46,0.35); }
      .vtc-cta-gold:hover { background: linear-gradient(135deg, #EFCB68, #D4A63A); }

      .vtc-rating-badge { display: flex; align-items: center; gap: 10px; margin-top: 26px; }
      .vtc-rating-value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22px; color: #B8860B; }
      .vtc-rating-stars { display: flex; gap: 2px; }
      .vtc-star-gold { color: #D4AF37; fill: #D4AF37; }

      .vtc-map-card { border: 1px solid var(--vtc-border); border-radius: 16px; overflow: hidden; position: relative; box-shadow: 0 8px 24px rgba(11,42,74,0.08); }
      .vtc-map-svg { width: 100%; height: auto; display: block; }
      .vtc-route-svg { width: 100%; height: auto; }

      .vtc-track-card { background: var(--vtc-surface); border: 1px solid var(--vtc-border); border-radius: 16px; padding: 18px; margin-bottom: 16px; }
      .vtc-track-status { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
      .vtc-pulse { width: 10px; height: 10px; border-radius: 50%; background: var(--vtc-accent); flex-shrink: 0; box-shadow: 0 0 0 0 rgba(47,168,240,0.5); animation: vtc-pulse-anim 1.6s infinite; }
      .vtc-pulse.is-done { background: var(--vtc-accent-2); animation: none; }
      @keyframes vtc-pulse-anim {
        0% { box-shadow: 0 0 0 0 rgba(47,168,240,0.5); }
        70% { box-shadow: 0 0 0 10px rgba(47,168,240,0); }
        100% { box-shadow: 0 0 0 0 rgba(47,168,240,0); }
      }
      .vtc-track-status-label { font-weight: 600; font-size: 14.5px; }
      .vtc-track-status-sub { color: var(--vtc-text-muted); font-size: 12px; margin-top: 2px; }
      .vtc-track-eta { margin-left: auto; text-align: center; background: var(--vtc-surface-alt); border-radius: 10px; padding: 6px 12px; }
      .vtc-track-eta span { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 18px; color: var(--vtc-accent); font-weight: 600; }
      .vtc-track-eta small { font-size: 10px; color: var(--vtc-text-muted); }
      .vtc-track-car-pulse { animation: vtc-car-pulse 1.2s ease-in-out infinite; }
      @keyframes vtc-car-pulse { 0%, 100% { r: 11; } 50% { r: 13; } }
      .vtc-track-addr { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--vtc-text-muted); margin-top: 10px; padding-top: 12px; border-top: 1px dashed var(--vtc-border); flex-wrap: wrap; }
      .vtc-track-addr span:not(.vtc-recent-arrow) { color: var(--vtc-text); }

      .vtc-recent { margin-top: 40px; }
      .vtc-recent h3 { font-size: 15px; margin-bottom: 12px; color: var(--vtc-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
      .vtc-recent-list { display: flex; flex-direction: column; gap: 8px; }
      .vtc-recent-item { display: flex; align-items: center; gap: 10px; background: var(--vtc-surface); border: 1px solid var(--vtc-border); padding: 12px 14px; border-radius: 10px; color: var(--vtc-text-muted); }
      .vtc-recent-text { display: flex; gap: 8px; font-size: 13.5px; color: var(--vtc-text); flex: 1; }
      .vtc-recent-arrow { color: var(--vtc-text-muted); }
      .vtc-recent-price { font-family: 'IBM Plex Mono', monospace; color: var(--vtc-accent-2); font-size: 13.5px; }

      .vtc-panel { max-width: 480px; margin: 0 auto; }
      .vtc-panel-head { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
      .vtc-icon-btn { background: var(--vtc-surface); border: 1px solid var(--vtc-border); color: var(--vtc-text); width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

      .vtc-field { margin-bottom: 16px; }
      .vtc-field label { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--vtc-text-muted); margin-bottom: 6px; font-weight: 500; }
      .vtc-field input {
        width: 100%; background: var(--vtc-surface); border: 1px solid var(--vtc-border); color: var(--vtc-text);
        padding: 12px 14px; border-radius: 10px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none;
      }
      .vtc-field input:focus { border-color: var(--vtc-accent); }
      .vtc-field-row { display: flex; gap: 12px; }
      .vtc-field-row .vtc-field { flex: 1; }

      .vtc-toggle { display: flex; background: var(--vtc-surface); border: 1px solid var(--vtc-border); border-radius: 10px; padding: 4px; }
      .vtc-toggle button { flex: 1; background: transparent; border: none; color: var(--vtc-text-muted); padding: 9px; border-radius: 7px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13.5px; }
      .vtc-toggle button.is-active { background: var(--vtc-accent); color: #FFFFFF; font-weight: 600; }

      .vtc-summary { background: var(--vtc-surface); border: 1px solid var(--vtc-border); border-radius: 12px; padding: 16px; margin-bottom: 20px; }
      .vtc-summary-row { display: flex; gap: 8px; font-size: 13.5px; align-items: center; flex-wrap: wrap; }
      .vtc-summary-meta { color: var(--vtc-text-muted); font-size: 12px; margin-top: 6px; }
      .vtc-summary-price { font-family: 'IBM Plex Mono', monospace; font-size: 24px; color: var(--vtc-accent-2); margin-top: 10px; }

      .vtc-fineprint { color: var(--vtc-text-muted); font-size: 11.5px; text-align: center; margin-top: 10px; }
      .vtc-spin { animation: vtc-spin 1s linear infinite; }
      @keyframes vtc-spin { to { transform: rotate(360deg); } }

      .vtc-cta-sumup { background: #0BC5B1; color: #0B2A4A; }
      .vtc-cta-sumup:hover { background: #14d6c1; }
      .vtc-paypal-wait { display: flex; align-items: center; gap: 10px; background: var(--vtc-surface); border: 1px solid var(--vtc-border); border-radius: 10px; padding: 12px 14px; font-size: 13px; color: var(--vtc-text-muted); margin-bottom: 12px; }
      .vtc-check-mail { background: #0B2A6B; border-radius: 12px; padding: 18px 16px; margin-bottom: 12px; text-align: center; }
      .vtc-check-mail-title { display: block; color: #FFFFFF; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; margin-bottom: 8px; }
      .vtc-check-mail-sub { display: block; color: #FFFFFF; opacity: 0.9; font-size: 13px; line-height: 1.5; }

      .vtc-confirm { text-align: center; }
      .vtc-confirm-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(11,95,165,0.1); color: var(--vtc-accent-2); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
      .vtc-confirm h2 { font-size: 24px; margin-bottom: 8px; }

      .vtc-history-list { display: flex; flex-direction: column; gap: 10px; }
      .vtc-history-item { display: flex; justify-content: space-between; align-items: flex-start; background: var(--vtc-surface); border: 1px solid var(--vtc-border); padding: 14px; border-radius: 10px; }

      .vtc-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 50; }
      .vtc-modal { background: var(--vtc-surface); border: 1px solid var(--vtc-border); border-radius: 14px; padding: 22px; width: 340px; max-width: 90vw; font-family: 'Inter', sans-serif; color: var(--vtc-text); }
      .vtc-modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }

      .vtc-link-btn { display: block; margin: 10px auto 0; background: transparent; border: none; color: var(--vtc-accent); font-size: 13px; cursor: pointer; text-decoration: underline; font-family: 'Inter', sans-serif; }
      .vtc-cta-sm { padding: 8px 14px; font-size: 12.5px; }

      .vtc-doc-overlay { position: fixed; inset: 0; background: var(--vtc-bg); z-index: 60; overflow-y: auto; }
      .vtc-doc-bar { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--vtc-border); position: sticky; top: 0; background: var(--vtc-bg); }
      .vtc-doc-bar span { flex: 1; font-family: 'Space Grotesk', sans-serif; font-weight: 600; }
      .vtc-doc-page { max-width: 620px; margin: 24px auto 60px; background: var(--vtc-surface); border: 1px solid var(--vtc-border); border-radius: 14px; padding: 32px; color: var(--vtc-text); }
      .vtc-doc-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--vtc-border); padding-bottom: 16px; margin-bottom: 20px; }
      .vtc-doc-logo { width: 52px; height: 52px; object-fit: contain; }
      .vtc-doc-head-right { text-align: right; font-size: 13px; color: var(--vtc-text-muted); }
      .vtc-doc-head-right h2 { font-size: 20px; color: var(--vtc-text); margin-bottom: 4px; }
      .vtc-doc-parties { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 24px; font-size: 13.5px; }
      .vtc-doc-parties p { margin: 2px 0; }
      .vtc-doc-label { display: block; text-transform: uppercase; font-size: 11px; letter-spacing: .05em; color: var(--vtc-text-muted); margin-bottom: 6px; font-weight: 600; }
      .vtc-doc-table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 13.5px; }
      .vtc-doc-table th { text-align: left; border-bottom: 1px solid var(--vtc-border); padding: 8px 6px; color: var(--vtc-text-muted); font-weight: 600; font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; }
      .vtc-doc-table td { padding: 10px 6px; border-bottom: 1px solid var(--vtc-border); vertical-align: top; }
      .vtc-doc-total { display: flex; justify-content: flex-end; gap: 12px; align-items: baseline; padding: 10px 6px; font-size: 15px; }
      .vtc-doc-total strong { font-family: 'IBM Plex Mono', monospace; font-size: 20px; color: var(--vtc-accent-2); }
      .vtc-doc-foot { margin-top: 24px; padding-top: 14px; border-top: 1px dashed var(--vtc-border); font-size: 11.5px; color: var(--vtc-text-muted); }
      .vtc-doc-foot p { margin: 3px 0; }

      @media print {
        .vtc-no-print { display: none !important; }
        .vtc-doc-overlay { position: static; overflow: visible; }
        .vtc-doc-page { border: none; box-shadow: none; margin: 0; max-width: 100%; }
        .vtc-root { border-radius: 0; }
      }
    `}</style>
  );
}
