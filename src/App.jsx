import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Unlock, Save, X, Edit3, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, 
  AlertTriangle, Building2, Box, Layers, Zap, Cpu, Network,
  Image as ImageIcon, Clock, Sparkles, ShieldCheck, Users,
  FileText, Printer, ArrowRight, Trash2
} from 'lucide-react';

const SECRET_PASSWORD = "472918";
const TOTAL_SLIDES = 9;
const DOCUMENT_LABELS = {
  onePager: "One Pager",
  teaserDeck: "Teaser Deck",
  pitchDeck: "Pitch Deck"
};
const DOCUMENT_CHAIN = ["pitchDeck", "teaserDeck", "onePager"];

const DEFAULT_SLIDE_ORDER = [
  "hero",
  "problem",
  "breakthrough",
  "market",
  "trust",
  "moat",
  "team",
  "ask",
  "closing"
];

const SLIDE_LABELS = {
  hero: "Hero",
  problem: "Problem",
  breakthrough: "Breakthrough",
  market: "Market",
  trust: "Trust",
  moat: "Moat",
  team: "Team",
  ask: "The Ask",
  closing: "Closing"
};

const CUSTOM_SLIDE_TEMPLATES = {
  narrative: {
    label: "Narrative",
    title: "New Strategic Slide",
    kicker: "New Slide",
    body: "Use this slide for a focused story, insight, or update.",
    quote: "A concise investor-ready takeaway.",
    metrics: []
  },
  metrics: {
    label: "Metrics",
    chartType: "metric-cards",
    title: "Key Traction Metrics",
    kicker: "Traction",
    body: "Summarize the signal investors should care about.",
    quote: "Momentum is easiest to understand when the proof is visible.",
    metrics: [
      { label: "Pipeline", value: "€0" },
      { label: "Pilots", value: "0" },
      { label: "Conversion", value: "0%" }
    ]
  },
  image: {
    label: "Image + Story",
    title: "Product Proof",
    kicker: "Product",
    body: "Pair a visual with a short explanation of why it matters.",
    quote: "Show the product reality, then explain the leverage.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400",
    metrics: []
  },
  comparison: {
    label: "Comparison",
    chartType: "comparison",
    title: "Before aiai3D / After aiai3D",
    kicker: "Comparison",
    body: "Use the two columns to show the shift in workflow, quality, cost, or trust.",
    quote: "The best comparison makes the new behavior obvious.",
    metrics: [
      { label: "Before", value: "Manual" },
      { label: "After", value: "Automated" }
    ]
  }
};

const CHART_TYPE_OPTIONS = [
  { value: "metric-cards", label: "Metric cards" },
  { value: "comparison", label: "Comparison blocks" },
  { value: "timeline", label: "Visual timeline" },
  { value: "bar", label: "Bar chart" },
  { value: "progress", label: "Progress rings" },
  { value: "funnel", label: "Funnel" },
  { value: "process", label: "Process diagram" },
  { value: "none", label: "No chart" }
];

const DEFAULT_CHART_METRICS = {
  timeline: [
    { label: "Now", value: "MVP" },
    { label: "Next", value: "Pilots" },
    { label: "Later", value: "Scale" }
  ],
  bar: [
    { label: "aiai3D", value: "14" },
    { label: "Comp X", value: "8" },
    { label: "Comp Y", value: "6" }
  ],
  progress: [
    { label: "Product", value: "80" },
    { label: "GTM", value: "55" },
    { label: "Funding", value: "35" }
  ],
  funnel: [
    { label: "Leads", value: "120" },
    { label: "Qualified", value: "42" },
    { label: "Pilots", value: "8" }
  ],
  process: [
    { label: "Input", value: "IFC/BIM" },
    { label: "Engine", value: "AI safe render" },
    { label: "Output", value: "Trusted visuals" }
  ],
  comparison: [
    { label: "Before", value: "Manual" },
    { label: "After", value: "Automated" }
  ],
  "metric-cards": [
    { label: "Metric", value: "0" },
    { label: "Signal", value: "0" },
    { label: "Target", value: "0" }
  ]
};

const getDefaultMetricsForChartType = (chartType) => DEFAULT_CHART_METRICS[chartType] || [];

// --- Brand & Constants ---
const BRAND = { sunsetOrange: '#FF8A3D', softCopper: '#C98C6C', amberGlow: '#FFB068' };
const LOGO_URL = "https://static.wixstatic.com/media/3069e0_a8673a14d1914bb995df7c95de94ca65~mv2.png/v1/fill/w_238,h_238,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/aiai3D-RGB.png";

// --- Initial Content Data ---
const defaultContent = {
  // Slide 1: Hero
  s1_head: "aiai3D",
  s1_sub: "The trusted infrastructure layer for\narchitectural AI.",
  s1_sec: "Secure AI generated visualizations directly from IFC/BIM data.",
  
  // Slide 2: Problem
  s2_head: "Architectural visualization is broken",
  s2_l_head: "Traditional Workflow",
  s2_l_body: "Manual rebuilding. Expensive revisions. Weeks of production. Fragmented workflows and severe bottlenecks.",
  s2_r_head: "Current AI Tools Fail",
  s2_r_body: "Hallucinated geometry. Broken layouts. Incorrect dimensions. Unreliable output that cannot be trusted commercially.",
  s2_quote: "“Beautiful images are useless if they are wrong.”",

  // Slide 3: Breakthrough
  s3_head: "aiai3D solves the hardest problem in the industry",
  s3_p1: "Geometry accuracy",
  s3_p2: "AI enhanced realism",
  s3_p3: "Scalable automation",
  s3_quote: "“We believe we are the first company capable of combining AI generation with BIM safe rendering.”",

  // Slide 4: Market
  s5_head: "A massive transformation of the built world is underway",
  s5_core_val: "€25B+ Core Market Opportunity",
  s5_core_sub: "BIM, AEC software and AI driven architectural visualization",
  s5_c1_t: "BIM Software",
  s5_c1_v: "€9B–15B market",
  s5_c2_t: "Construction & AEC Software",
  s5_c2_v: "€11B–18B market",
  s5_c3_t: "Architectural Visualization",
  s5_c3_v: "€4.8B market",
  s5_c4_t: "Digital Twin Infrastructure",
  s5_c4_v: "€65B–150B+ emerging market",
  s5_exp_val: "€150B+ Expansion Opportunity",
  s5_exp_sub: "Digital twins, AI infrastructure and intelligent building environments",
  s5_quote1: "“Every building project in the world will require AI generated visualization, simulation and digital representation.”",
  s5_quote2: "“aiai3D is positioned where BIM, AI and digital twins converge.”",

  // Slide 5: Why Others Fail
  s6_head_p1: "The industry problem is not\nrendering quality. ",
  s6_head_p2: "It is trust.",
  s6_l_head: "Traditional AI",
  s6_l_body: "Hallucinates geometry\nFake windows\nBroken layouts\nInconsistent output",
  s6_r_head: "aiai3D",
  s6_r_body: "IFC/BIM constrained\nGeometry aware\nCommercially reliable\nStructure preserving",
  s6_quote: "“Architectural AI only becomes useful when it becomes trustworthy.”",

  // Slide 6: Defensibility
  s7_head: "Why aiai3D wins",
  s7_p1: "IFC/BIM expertise",
  s7_p2: "Proprietary geometry safe rendering pipelines",
  s7_p3: "Founder market fit",
  s7_p4: "Infrastructure positioning",
  s7_quote: "“This is not an AI wrapper.\nThis is infrastructure for the future of architectural visualization.”",

  // Slide 7: Team
  s8_head: "Built by industry insiders",
  s8_n1: "Vegard Rossi Westergård",
  s8_r1: "Founder/CEO",
  s8_b1: "Background from several 3D visualization providers, as well as experience as a client working with marketing in one of the largest developers in the Nordics.",
  s8_n2: "Per Hjaldahl",
  s8_r2: "Founding CTO",
  s8_b2: "Tech enthusiast, serial entrepreneur, and former co-founder of a Swedish 3D visualization agency, with strong technical and visual expertise.",
  s8_quote: "“The team combines BIM expertise, visualization experience and AI product execution.”",
  
  // One Pager: Trusted By
  s8_backed_title: "Innovation Norway",
  s8_backed_desc: "Awarded commercialization funding and strategic backing.",

  // Slide 8: The Ask
  s9_head: "Scaling the infrastructure for architectural AI",
  s9_ticket_label: "Ticket Size",
  s9_ticket_val: "€1.5M",
  s9_val_label: "Current Valuation",
  s9_val_val: "€9M Pre-money",
  s9_rm_title: "Estimated Company Value Roadmap",
  s9_rm_y0_lbl: "Today",
  s9_rm_y0_val: "€9M",
  s9_rm_y1_lbl: "Year 1",
  s9_rm_y1_val: "€45M",
  s9_rm_y3_lbl: "Year 3",
  s9_rm_y3_val: "€200M+",
  s9_quote: "“We are raising capital to accelerate our proprietary geometry parser and scale GTM.”",
  s9_use_1: "Accelerate proprietary geometry parser",
  s9_use_2: "Scale GTM",
  s9_use_3: "Secure technical leadership",
  s9_use_4: "Build early customer pilots",

  // Slide 9: Closing
  s10_sub: "We are building the trust layer for architectural AI.",
  s10_contact_mail: "vw@aiai3d.io",
  s10_contact_phone: "+47 976 76 358",

  // Images
  img_hero_bg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400",
  img_market_bg: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2400",
  img_closing_bg: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=2400",
  img_vegard: "https://static.wixstatic.com/media/3069e0_85f4fad5791e402a926141f47bc57100~mv2.jpg/v1/fill/w_612,h_630,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7261_black_white_web.jpg",
  img_per: "https://static.wixstatic.com/media/3069e0_5c530b43ab27405abb751d90836eba2e~mv2.jpg/v1/crop/x_14,y_0,w_461,h_475/fill/w_553,h_569,al_c,lg_1,q_80,enc_avif,quality_auto/profilbild%20Per.jpg"
};

const TEXT_FIELD_IDS = Object.keys(defaultContent).filter((key) => !key.startsWith("img_"));
const IMAGE_FIELD_IDS = Object.keys(defaultContent).filter((key) => key.startsWith("img_"));

const createDefaultSuite = () => ({
  version: 1,
  documents: {
    onePager: {},
    teaserDeck: {},
    pitchDeck: {}
  },
  sources: {
    onePager: "teaserDeck",
    teaserDeck: "pitchDeck",
    pitchDeck: ""
  },
  slideOrder: {
    onePager: [...DEFAULT_SLIDE_ORDER],
    teaserDeck: [...DEFAULT_SLIDE_ORDER],
    pitchDeck: [...DEFAULT_SLIDE_ORDER]
  },
  settings: {
    adminPassword: SECRET_PASSWORD,
    pitchEmail: "investor@aiai3d.io",
    pitchPassword: "aiai3d",
    pitchAccess: [
      {
        email: "investor@aiai3d.io",
        password: "aiai3d",
        label: "Default Investor",
        active: true,
        createdAt: new Date().toISOString()
      }
    ]
  },
  customSlides: {
    onePager: [],
    teaserDeck: [],
    pitchDeck: []
  }
});

const createDefaultAnalytics = () => ({
  lastOpened: new Date().toISOString(),
  totalSeconds: 0,
  viewSeconds: {},
  slideSeconds: {},
  investorSeconds: {},
  investorSlideSeconds: {},
  investorLastSeen: {},
  investorLogins: {}
});

const normalizeSuite = (candidate = {}) => {
  const base = createDefaultSuite();
  const fallbackAccess = candidate.settings?.pitchEmail
    ? [{
        email: candidate.settings.pitchEmail,
        password: candidate.settings.pitchPassword || base.settings.pitchPassword,
        label: "Default Investor",
        active: true,
        createdAt: new Date().toISOString()
      }]
    : base.settings.pitchAccess;
  return {
    ...base,
    ...candidate,
    documents: {
      ...base.documents,
      ...(candidate.documents || {})
    },
    sources: {
      ...base.sources,
      ...(candidate.sources || {})
    },
    slideOrder: {
      ...base.slideOrder,
      ...(candidate.slideOrder || {})
    },
    settings: {
      ...base.settings,
      ...(candidate.settings || {}),
      pitchAccess: (candidate.settings?.pitchAccess || fallbackAccess).map((entry) => ({
        email: String(entry.email || "").trim(),
        password: String(entry.password || ""),
        label: String(entry.label || entry.email || "Investor"),
        active: entry.active !== false,
        createdAt: entry.createdAt || new Date().toISOString()
      }))
    },
    customSlides: {
      ...base.customSlides,
      ...(candidate.customSlides || {})
    }
  };
};

const resolveDocumentContent = (suite, documentKey, seen = new Set()) => {
  const normalized = normalizeSuite(suite);
  if (seen.has(documentKey)) return { ...defaultContent };
  seen.add(documentKey);

  const sourceKey = normalized.sources?.[documentKey];
  const sourceContent = sourceKey && sourceKey !== documentKey
    ? resolveDocumentContent(normalized, sourceKey, seen)
    : {};

  return {
    ...defaultContent,
    ...sourceContent,
    ...(normalized.documents?.[documentKey] || {})
  };
};

const formatDuration = (seconds = 0) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) return `${hours}h ${remainingMinutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
};

const formatDateTime = (value) => value ? new Date(value).toLocaleString() : "Never";

// --- Helper Components ---
const FadeIn = ({ children, delay = 0, className = "", direction = "up" }) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 }
  };
  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Dynamic Mesh Particle Engine ---
const MeshBackground = () => {
  const canvasRef = React.useRef(null);
  const mouseRef = React.useRef({ x: -1000, y: -1000 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let W, H;
    let particles = [];
    let animationFrameId;
    const RGB = '255, 138, 61'; 

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    const handleMouseMove = (e) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    const handleMouseLeave = () => { mouseRef.current.x = -1000; mouseRef.current.y = -1000; };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2 + 2.5;
        this.pulseOffset = Math.random();
        this.fillAlpha = 0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distM = Math.sqrt(dx * dx + dy * dy);
        
        const nudgeForce = 5.0;
        if (distM < 150 && nudgeForce > 0) {
          const force = (150 - distM) / 150;
          this.vx -= (dx / distM) * force * 0.03 * nudgeForce;
          this.vy -= (dy / distM) * force * 0.03 * nudgeForce;
        }
        
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 0.32) { this.vx = (this.vx / speed) * 0.32; this.vy = (this.vy / speed) * 0.32; }
        
        if (this.x < -20) this.x = W + 20;
        if (this.x > W + 20) this.x = -20;
        if (this.y < -20) this.y = H + 20;
        if (this.y > H + 20) this.y = -20;
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const targetParticles = 30;

      if (particles.length < targetParticles) particles.push(new Particle());
      else if (particles.length > targetParticles) particles.pop();

      particles.forEach(p => p.update());
      particles.forEach(p => { p.fillAlpha *= 0.94; });

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const maxD = 150;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < maxD) {
            const baseOp = 0.13;
            const distFactor = 1 - (dist / maxD);
            const activeLevel = Math.max(p1.fillAlpha, p2.fillAlpha);
            const lineAlpha = (baseOp * distFactor) + (activeLevel * distFactor * 0.5);
            
            if (lineAlpha > 0.01) {
              ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${RGB}, ${lineAlpha})`; ctx.lineWidth = 1 + (activeLevel * 1.5); ctx.stroke();
              
              if (lineAlpha > 0.1) {
                const pairSeed = i * 100 + j;
                const pSpeedMult = 0.7;
                const netPulseSpeed = 0.0008 * pSpeedMult;
                const t = ((Date.now() * netPulseSpeed) + pairSeed) % 3;
                if (t <= 1) {
                  const pulseWidth = 0.3;
                  const pStart = Math.max(0, t - pulseWidth / 2);
                  const pEnd = Math.min(1, t + pulseWidth / 2);
                  const pxStart = p1.x - dx * pStart; const pyStart = p1.y - dy * pStart;
                  const pxEnd = p1.x - dx * pEnd; const pyEnd = p1.y - dy * pEnd;
                  const grad = ctx.createLinearGradient(pxStart, pyStart, pxEnd, pyEnd);
                  grad.addColorStop(0, `rgba(${RGB}, 0)`); grad.addColorStop(0.5, `rgba(${RGB}, ${lineAlpha * 2.5})`); grad.addColorStop(1, `rgba(${RGB}, 0)`);
                  ctx.beginPath(); ctx.moveTo(pxStart, pyStart); ctx.lineTo(pxEnd, pyEnd);
                  ctx.strokeStyle = grad; ctx.lineWidth = 1.5 + (lineAlpha * 2.5); ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';
                }
              }
            }
          }
        }
      }

      particles.forEach(p => {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distM = Math.sqrt(dx*dx + dy*dy);
        const mRad = 360;
        
        if (distM < mRad) {
          const lineAlpha = (1 - distM / mRad) * 0.13;
          ctx.beginPath(); ctx.moveTo(mouseRef.current.x, mouseRef.current.y); ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${RGB}, ${lineAlpha})`; ctx.lineWidth = 1; ctx.stroke();
          
          const pSpeedMult = 0.7;
          const pulseSpeed = 0.0015 * pSpeedMult; 
          const pulseT = ((Date.now() * pulseSpeed) + p.pulseOffset) % 1;
          const pIntensity = 0;
          
          if (pIntensity > 0) {
            const pulseWidth = 0.25;
            const pStart = Math.max(0, pulseT - pulseWidth / 2);
            const pEnd = Math.min(1, pulseT + pulseWidth / 2);
            const pxStart = mouseRef.current.x + dx * pStart; const pyStart = mouseRef.current.y + dy * pStart;
            const pxEnd = mouseRef.current.x + dx * pEnd; const pyEnd = mouseRef.current.y + dy * pEnd;
            const pulseAlpha = Math.sin(pulseT * Math.PI) * pIntensity * 1.5;
            
            if (pulseAlpha > 0.01) {
              const grad = ctx.createLinearGradient(pxStart, pyStart, pxEnd, pyEnd);
              grad.addColorStop(0, `rgba(${RGB}, 0)`); grad.addColorStop(0.5, `rgba(255, 230, 200, ${pulseAlpha})`); grad.addColorStop(1, `rgba(${RGB}, 0)`);
              ctx.beginPath(); ctx.moveTo(pxStart, pyStart); ctx.lineTo(pxEnd, pyEnd);
              ctx.strokeStyle = grad; ctx.lineWidth = 3 + (pIntensity * 3); ctx.lineCap = 'round';
              ctx.shadowBlur = 12 * pIntensity; ctx.shadowColor = `rgba(${RGB}, 1)`; ctx.stroke(); ctx.lineCap = 'butt'; ctx.shadowBlur = 0;
            }
          }
          if (pulseT > 0.85 && pulseT < 0.95) p.fillAlpha = Math.min(1, p.fillAlpha + 0.2); 
        }
      });

      particles.forEach(p => {
        const baseOp = 0.13;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RGB}, ${baseOp * 2})`; ctx.lineWidth = 1.5; ctx.stroke();
        
        if (p.fillAlpha > 0.01) {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size - 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${RGB}, ${p.fillAlpha})`; ctx.shadowBlur = p.fillAlpha * 12;
          ctx.shadowColor = `rgba(${RGB}, 1)`; ctx.fill(); ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-100 mix-blend-screen" />;
};


// --- FULLSCREEN ONE PAGER MODAL ---
const DeckFooter = ({
  activeView,
  activeDocumentKey,
  currentSlide,
  totalSlides,
  onOpenDocument,
  onPrevious,
  onNext,
  disableSlideControls = false,
  showAdminLock = true,
  onAdminClick
}) => {
  const progress = disableSlideControls ? 100 : (currentSlide / Math.max(totalSlides, 1)) * 100;

  return (
    <div className="deck-footer fixed bottom-0 w-full z-50 pointer-events-none flex flex-col print:hidden">
      <div className="w-full h-[2px] bg-white/5">
         <div
           className="h-full bg-[#FF8A3D] transition-all duration-300 ease-out"
           style={{ width: `${progress}%` }}
         />
      </div>
      <div className="h-16 md:h-20 bg-[#050505]/70 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-4 md:px-8 pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <div className="w-1/3 flex justify-start gap-2 md:gap-4">
            {[
              { key: "onePager", label: "One Pager", icon: <FileText size={16} /> },
              { key: "teaserDeck", label: "Teaser Deck", icon: <Layers size={16} /> },
              { key: "pitchDeck", label: "Pitch Deck", icon: <ShieldCheck size={16} /> }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => onOpenDocument(item.key)}
                className={`flex items-center gap-2 transition-colors text-[10px] md:text-sm font-medium uppercase tracking-widest group ${activeView === item.key ? "text-white" : "text-white/45 hover:text-white"}`}
              >
                <span className={`${activeView === item.key ? "text-[#FF8A3D]" : "group-hover:text-[#FF8A3D]"} transition-colors`}>{item.icon}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
         </div>

         <div className="w-1/3 flex justify-center items-center gap-4 md:gap-8">
            <button
              disabled={disableSlideControls || currentSlide === 1}
              onClick={onPrevious}
              className="text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              title="Previous Slide"
            >
               <ChevronLeft size={20} />
            </button>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/50 uppercase whitespace-nowrap">
               {DOCUMENT_LABELS[activeDocumentKey]} {!disableSlideControls && <><span className="text-white">{currentSlide}</span> of {totalSlides}</>}
            </span>
            <button
              disabled={disableSlideControls || currentSlide === totalSlides}
              onClick={onNext}
              className="text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              title="Next Slide"
            >
               <ChevronRight size={20} />
            </button>
         </div>

         <div className="w-1/3 flex justify-end">
            {showAdminLock && (
              <button
                onClick={onAdminClick}
                className="p-2 rounded-full text-white/30 hover:text-[#FF8A3D] transition-colors"
                title="Admin Mode"
              >
                <Lock size={16} />
              </button>
            )}
         </div>
      </div>
    </div>
  );
};

const OnePager = ({ content, isEditMode, onFieldChange, onOpenAdmin, onOpenDocument, onAdminClick }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        @page { margin: 0; size: auto; }
        html, body, #root { height: auto !important; overflow: visible !important; background-color: #050505 !important; }
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        ::-webkit-scrollbar { display: none; }
        .one-pager-shell { position: static !important; overflow: visible !important; padding: 0 !important; }
        .one-pager-document { max-width: none !important; width: 100% !important; border: 0 !important; border-radius: 0 !important; }
        .one-pager-controls, .deck-footer { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Internal EditableText for the modal
  const ModalEditableText = ({ id, as: Tag = 'div', className = "", style = {} }) => {
    const handleBlur = (e) => {
      onFieldChange(id, e.target.innerText);
    };
    return (
      <Tag
        contentEditable={isEditMode}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        className={`${className} ${isEditMode ? 'outline-none ring-2 ring-dashed ring-white/30 bg-white/5 rounded px-2 hover:bg-white/10 transition-colors' : 'outline-none whitespace-pre-wrap'}`}
        style={{ cursor: isEditMode ? 'text' : 'inherit', ...style }}
      >
        {content[id]}
      </Tag>
    );
  };

  return (
    <div className="one-pager-shell fixed inset-0 z-[200] bg-[#050505] overflow-y-auto text-white p-4 md:p-12 pb-28 font-manrope selection:bg-[#FF8A3D] selection:text-black">
      <div className="one-pager-document max-w-5xl mx-auto bg-[#0a0a0a] rounded-[2rem] p-8 md:p-16 shadow-2xl print:p-8 print:shadow-none print:bg-[#0a0a0a] border border-white/5">
        
        {/* Controls (Hidden on Print) */}
        <div className="one-pager-controls flex justify-end items-center mb-16 print:hidden">
          <div className="flex items-center gap-3">
            {isEditMode && (
              <button onClick={onOpenAdmin} className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-full font-medium hover:bg-white/15 transition-colors">
                <ShieldCheck size={16} /> Admin
              </button>
            )}
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#FF8A3D] text-black px-6 py-2.5 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,138,61,0.3)]">
              <Printer size={16} /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* --- ONE PAGER CONTENT --- */}
        <div className="space-y-20">
          
          {/* Header */}
          <header className="pb-12 flex flex-col md:flex-row gap-8 justify-between items-center md:items-start border-b border-white/10">
            <div className="max-w-2xl flex flex-col items-start w-full">
              <img src={LOGO_URL} alt="aiai3D" className="w-56 h-56 md:w-72 md:h-72 object-contain object-left mb-8" />
              <h2 className="text-2xl font-medium mb-3 text-white/90 leading-tight whitespace-pre-wrap text-center md:text-left">{content.s1_sub}</h2>
              <p className="text-white/50 text-center md:text-left">{content.s1_sec}</p>
            </div>
            <div className="shrink-0 text-center md:text-right w-full md:w-auto mt-4 md:mt-0">
              <div className="text-xs font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-2">Investor Confidential</div>
              <p className="text-sm text-white/50">{new Date().getFullYear()} Executive Summary</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Left Column */}
            <div className="space-y-16">
              {/* Problem */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">The Problem</h3>
                <h4 className="text-xl font-medium tracking-tight mb-4">{content.s2_head}</h4>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed">
                  <p><strong className="text-white/90 font-medium">Traditional:</strong> {content.s2_l_body}</p>
                  <p><strong className="text-white/90 font-medium">Current AI:</strong> {content.s2_r_body}</p>
                </div>
              </section>

              {/* Breakthrough */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">The Breakthrough</h3>
                <p className="text-lg font-medium text-white/90 leading-snug mb-6">{content.s3_quote.replace(/[“”]/g, '')}</p>
                <ul className="space-y-2">
                  {[content.s3_p1, content.s3_p2, content.s3_p3].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/70 bg-white/[0.02] p-3 rounded-xl shadow-sm border border-white/5">
                      <CheckCircle2 size={16} className="text-[#FF8A3D] shrink-0 opacity-80" /> {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Defensibility / Moat */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">Why aiai3D Wins</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[content.s7_p1, content.s7_p2, content.s7_p3, content.s7_p4].map((item, i) => (
                    <div key={i} className="bg-[#0a0a0a] border border-white/10 shadow-[inset_0_0_15px_rgba(255,138,61,0.02)] p-4 rounded-xl flex flex-col justify-center text-center items-center">
                      <span className="text-xs font-medium text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-16">
              {/* Market */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">Market Opportunity</h3>
                <div className="mb-6">
                  <div className="text-3xl font-bold tracking-tight text-white mb-1">{content.s5_core_val.split(' ')[0]}</div>
                  <div className="text-sm font-medium text-[#FF8A3D] mb-1">Core Market</div>
                  <p className="text-xs text-white/50">{content.s5_core_sub}</p>
                </div>
                <div className="mb-8 bg-[#0a0a0a] border border-[#FF8A3D]/20 shadow-[inset_0_0_30px_rgba(255,138,61,0.05)] p-6 rounded-2xl relative overflow-hidden">
                  <div className="text-3xl font-bold tracking-tight text-[#FF8A3D] mb-1 relative z-10">{content.s5_exp_val.split(' ')[0]}</div>
                  <div className="text-sm font-medium text-white/90 mb-1 relative z-10">Expansion Opportunity</div>
                  <p className="text-xs text-[#FF8A3D]/70 relative z-10">{content.s5_exp_sub}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="text-xs"><span className="block text-white/90 font-medium">{content.s5_c1_t}</span><span className="text-white/50">{content.s5_c1_v}</span></div>
                   <div className="text-xs"><span className="block text-white/90 font-medium">{content.s5_c2_t}</span><span className="text-white/50">{content.s5_c2_v}</span></div>
                </div>
              </section>

              {/* Team */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">Founding Team</h3>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-5 items-center">
                    <img src={content.img_vegard} alt="Vegard" className="w-14 h-14 rounded-full object-cover grayscale opacity-90 shadow-lg border border-white/10 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-white/90">{content.s8_n1} <span className="font-normal text-[#FF8A3D] ml-1">{content.s8_r1}</span></div>
                      <div className="text-xs text-white/50">{content.s8_b1}</div>
                    </div>
                  </div>
                  <div className="flex gap-5 items-center">
                    <img src={content.img_per} alt="Per" className="w-14 h-14 rounded-full object-cover grayscale opacity-90 shadow-lg border border-white/10 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-white/90">{content.s8_n2} <span className="font-normal text-[#FF8A3D] ml-1">{content.s8_r2}</span></div>
                      <div className="text-xs text-white/50">{content.s8_b2}</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Backed By */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">Trusted & Funded By</h3>
                <div className="bg-[#0a0a0a] border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)] p-5 rounded-2xl flex items-center gap-5">
                   <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-md overflow-hidden p-1 shrink-0">
                     <div className="bg-white/10 text-white/90 font-extrabold text-xl px-2 py-1.5 leading-none rounded-sm tracking-tighter">.V</div>
                     <div className="text-[9px] text-white/70 font-bold text-left leading-tight ml-2 pr-2 uppercase tracking-wider">Innovation<br/>Norway</div>
                   </div>
                   <div>
                     <ModalEditableText id="s8_backed_title" className="text-sm font-medium text-white/90" />
                     <ModalEditableText id="s8_backed_desc" className="text-xs text-white/50 mt-0.5" />
                   </div>
                </div>
              </section>
            </div>
            
          </div>

          {/* Full Width Bottom: The Ask & Upside */}
          <section className="mt-16 pt-12 border-t border-white/5 bg-white/[0.01] p-8 md:p-12 rounded-[2rem]">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-10 text-center opacity-80">The Ask & Execution</h3>
            
            <div className="flex flex-col md:flex-row justify-center gap-12 items-center text-center mb-12">
               <div>
                 <div className="text-xs text-white/50 uppercase tracking-widest mb-1">{content.s9_ticket_label}</div>
                 <div className="text-4xl font-bold text-white tracking-tight">{content.s9_ticket_val}</div>
               </div>
               <div className="hidden md:block w-px h-12 bg-white/10"></div>
               <div>
                 <div className="text-xs text-[#FF8A3D]/70 uppercase tracking-widest mb-1">{content.s9_val_label}</div>
                 <div className="text-4xl font-bold text-[#FF8A3D] tracking-tight">{content.s9_val_val}</div>
               </div>
            </div>

            {/* Investor Upside */}
            <div className="max-w-3xl mx-auto mb-12">
              <h4 className="text-[10px] text-white/50 uppercase tracking-widest mb-4 text-center">Infrastructure Positioning Target</h4>
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 px-6 rounded-2xl shadow-sm mb-4">
                 <div className="text-center">
                    <div className="text-xs text-white/40 mb-1">{content.s9_rm_y0_lbl}</div>
                    <div className="text-xl font-medium">{content.s9_rm_y0_val}</div>
                 </div>
                 <div className="text-white/20"><ChevronRight size={16}/></div>
                 <div className="text-center">
                    <div className="text-xs text-white/40 mb-1">{content.s9_rm_y1_lbl}</div>
                    <div className="text-xl font-medium">{content.s9_rm_y1_val}</div>
                 </div>
                 <div className="text-white/20"><ChevronRight size={16}/></div>
                 <div className="text-center">
                    <div className="text-xs text-[#FF8A3D]/70 mb-1">{content.s9_rm_y3_lbl}</div>
                    <div className="text-2xl font-bold text-[#FF8A3D] drop-shadow-[0_0_10px_rgba(255,138,61,0.4)]">{content.s9_rm_y3_val}</div>
                 </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#FF8A3D]/90">Potential 12.5x strategic value creation scenario</p>
                <p className="text-[9px] text-white/30 mt-1 uppercase tracking-wider">Illustrative strategic positioning. Not financial guidance.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/5">
              {[content.s9_use_1, content.s9_use_2, content.s9_use_3, content.s9_use_4].map((text, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <CheckCircle2 size={14} className="text-[#FF8A3D] opacity-60" />
                  <span className="text-xs text-white/60">{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-white/10 flex justify-between items-center text-xs text-white/40">
            <div className="text-sm tracking-tight" style={{ fontFamily: "'Noto Serif', serif", fontWeight: 900, letterSpacing: "-0.02em", color: BRAND.sunsetOrange }}>aiai3D</div>
            <div className="flex gap-4">
              <span>{content.s10_contact_mail}</span>
              <span>{content.s10_contact_phone}</span>
            </div>
          </footer>

        </div>
      </div>
      <DeckFooter
        activeView="onePager"
        activeDocumentKey="onePager"
        currentSlide={1}
        totalSlides={1}
        onOpenDocument={onOpenDocument}
        disableSlideControls
        showAdminLock={!isEditMode}
        onAdminClick={onAdminClick}
      />
    </div>
  );
};

const parseMetricValue = (value) => {
  const numeric = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? Math.max(numeric, 0) : 0;
};

const CustomSlideChart = ({ metrics = [], chartType = "metric-cards", compact = false }) => {
  if (!metrics.length || chartType === "none") return null;
  const values = metrics.map(metric => parseMetricValue(metric.value));
  const maxValue = Math.max(...values, 1);

  if (chartType === "timeline") {
    return (
      <div className="relative mb-10 py-8">
        <div className="absolute left-6 right-6 top-1/2 h-px bg-gradient-to-r from-[#FF8A3D]/20 via-[#FF8A3D]/80 to-[#FF8A3D]/20 hidden md:block" />
        <div className="grid gap-5 md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
          {metrics.map((metric, index) => (
            <div key={index} className={`relative ${index % 2 ? "md:pt-24" : "md:pb-24"}`}>
              <div className="absolute left-6 top-0 bottom-0 w-px bg-[#FF8A3D]/25 md:hidden" />
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 shadow-[0_0_30px_rgba(255,138,61,0.04)]">
                <span className="absolute -left-1 top-5 h-4 w-4 rounded-full border-2 border-[#FF8A3D] bg-[#050505] shadow-[0_0_18px_rgba(255,138,61,0.55)] md:left-1/2 md:-translate-x-1/2 md:top-auto md:-bottom-10" />
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{metric.label}</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight text-[#FF8A3D]">{metric.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (chartType === "bar") {
    return (
      <div className="mb-10 max-w-5xl space-y-3">
        {metrics.map((metric, index) => {
          const width = Math.max(8, (values[index] / maxValue) * 100);
          return (
            <div key={index} className="grid grid-cols-[120px_1fr_72px] items-center gap-4 text-sm">
              <div className="truncate text-white/55 uppercase tracking-wider text-xs">{metric.label}</div>
              <div className="h-4 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#FFB068]" style={{ width: `${width}%` }} />
              </div>
              <div className="text-right text-[#FF8A3D] font-semibold">{metric.value}</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (chartType === "progress") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-5xl">
        {metrics.map((metric, index) => {
          const percent = Math.min(100, Math.round((values[index] / maxValue) * 100));
          return (
            <div key={index} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 flex items-center gap-5">
              <div className="relative h-24 w-24 shrink-0">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#FF8A3D" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${percent * 2.64} 264`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white">{percent}%</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-white/40">{metric.label}</div>
                <div className="mt-1 text-3xl font-semibold text-[#FF8A3D]">{metric.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (chartType === "funnel") {
    return (
      <div className="mb-10 max-w-4xl space-y-3">
        {metrics.map((metric, index) => {
          const width = Math.max(38, 100 - index * (54 / Math.max(metrics.length - 1, 1)));
          return (
            <div key={index} className="mx-auto rounded-2xl border border-[#FF8A3D]/20 bg-[#FF8A3D]/10 px-6 py-4 text-center" style={{ width: `${width}%` }}>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">{metric.label}</div>
              <div className="text-3xl font-semibold text-[#FF8A3D]">{metric.value}</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (chartType === "process") {
    return (
      <div className="mb-10 grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 max-w-5xl">
        {metrics.map((metric, index) => (
          <div key={index} className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            {index < metrics.length - 1 && <ArrowRight className="absolute -right-5 top-1/2 hidden -translate-y-1/2 text-[#FF8A3D]/50 md:block" size={22} />}
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#FF8A3D] text-sm font-bold text-black">{index + 1}</div>
            <div className="text-xs uppercase tracking-wider text-white/40">{metric.label}</div>
            <div className="mt-1 text-2xl font-semibold text-white">{metric.value}</div>
          </div>
        ))}
      </div>
    );
  }

  const gridClass = chartType === "comparison"
    ? "grid grid-cols-1 md:grid-cols-2"
    : "grid grid-cols-1 md:grid-cols-3";

  return (
    <div className={`${gridClass} gap-6 mb-10`}>
      {metrics.map((metric, index) => (
        <div key={index} className={`p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 shadow-sm ${compact ? "p-4" : ""}`}>
          <div className="text-xs text-white/45 uppercase tracking-wider mb-2">{metric.label}</div>
          <div className="text-4xl md:text-5xl font-semibold tracking-tighter text-[#FF8A3D]">{metric.value}</div>
        </div>
      ))}
    </div>
  );
};

const CustomSlide = ({ slide, order, registerSlide, getSlideStyle, isEditMode, onUpdate, hideForDraftPreview = false }) => {
  const updateText = (key) => (event) => onUpdate(slide.id, { [key]: event.currentTarget.innerText });
  const metrics = slide.metrics || [];

  return (
    <section
      data-slide-key={slide.id}
      ref={registerSlide(slide.id)}
      style={{ ...getSlideStyle(slide.id), display: hideForDraftPreview ? "none" : undefined }}
      className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative"
    >
      {slide.imageUrl && (
        <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_100%)] pointer-events-none">
          <img src={slide.imageUrl} alt="" className="w-full h-full object-cover grayscale mix-blend-luminosity" />
        </div>
      )}
      <div className="relative z-10">
        <FadeIn>
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] mb-4 uppercase opacity-80">
            {slide.kicker || `Custom ${order + 1}`}
          </div>
          <h2
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={updateText("title")}
            className={`text-5xl md:text-7xl font-semibold tracking-tighter mb-10 max-w-5xl ${isEditMode ? "outline-none ring-2 ring-dashed ring-white/30 bg-white/5 rounded px-2" : ""}`}
          >
            {slide.title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <CustomSlideChart metrics={metrics} chartType={slide.chartType} />
        </FadeIn>

        <FadeIn delay={0.25}>
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={updateText("body")}
            className={`text-xl md:text-2xl text-white/65 leading-relaxed max-w-4xl mb-10 ${isEditMode ? "outline-none ring-2 ring-dashed ring-white/30 bg-white/5 rounded px-2" : ""}`}
          >
            {slide.body}
          </p>
        </FadeIn>

        {slide.quote && (
          <FadeIn delay={0.4}>
            <h3
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={updateText("quote")}
              className={`text-2xl md:text-4xl font-medium tracking-tight text-[#FF8A3D] max-w-4xl italic ${isEditMode ? "outline-none ring-2 ring-dashed ring-white/30 bg-white/5 rounded px-2" : ""}`}
            >
              {slide.quote}
            </h3>
          </FadeIn>
        )}
      </div>
    </section>
  );
};

const DraftSlidePreview = ({ slide }) => (
  <section className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 md:pr-[460px] max-w-none mx-auto w-full relative">
    {slide.imageUrl && (
      <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_100%)] pointer-events-none">
        <img src={slide.imageUrl} alt="" className="w-full h-full object-cover grayscale mix-blend-luminosity" />
      </div>
    )}
    <div className="relative z-10">
      <div className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] mb-4 uppercase opacity-80">
        Draft Preview · {CUSTOM_SLIDE_TEMPLATES[slide.template]?.label || "Custom"}
      </div>
      <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-10 max-w-5xl">
        {slide.title || "New Slide"}
      </h2>
      <CustomSlideChart metrics={slide.metrics || []} chartType={slide.chartType} />
      <p className="text-xl md:text-2xl text-white/65 leading-relaxed max-w-4xl mb-10">
        {slide.body || "Use the admin panel to shape this slide."}
      </p>
      {slide.quote && (
        <h3 className="text-2xl md:text-4xl font-medium tracking-tight text-[#FF8A3D] max-w-4xl italic">
          {slide.quote}
        </h3>
      )}
    </div>
  </section>
);

// --- MAIN APP (PITCH DECK) ---
export default function App() {
  const [suite, setSuite] = useState(() => createDefaultSuite());
  const [analytics, setAnalytics] = useState(() => createDefaultAnalytics());
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeView, setActiveView] = useState("teaserDeck");
  const [lastDeckView, setLastDeckView] = useState("teaserDeck");
  const [showPitchGate, setShowPitchGate] = useState(false);
  const [pitchLogin, setPitchLogin] = useState({ email: "", password: "" });
  const [adminToken, setAdminToken] = useState("");
  const [pitchToken, setPitchToken] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTab, setAdminTab] = useState("content");
  const [newInvestor, setNewInvestor] = useState({ email: "", password: "", label: "" });
  const [selectedInvestorEmail, setSelectedInvestorEmail] = useState("");
  const [newSlideDraft, setNewSlideDraft] = useState(() => ({
    template: "narrative",
    chartType: "metric-cards",
    ...CUSTOM_SLIDE_TEMPLATES.narrative
  }));
  const [showDraftPreview, setShowDraftPreview] = useState(false);
  
  // Navigation State
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showOnePager, setShowOnePager] = useState(false);
  const slideRefs = useRef({});
  const containerRef = useRef(null);

  const activeDocumentKey = activeView === "onePager" ? "onePager" : activeView;
  const content = React.useMemo(() => resolveDocumentContent(suite, activeDocumentKey), [suite, activeDocumentKey]);
  const onePagerContent = React.useMemo(() => resolveDocumentContent(suite, "onePager"), [suite]);
  const activeSlideOrder = suite.slideOrder?.[activeDocumentKey] || DEFAULT_SLIDE_ORDER;
  const activeSlideKey = activeView === "onePager" ? "onePager" : (activeSlideOrder[currentSlide - 1] || activeSlideOrder[0] || "hero");
  const activeCustomSlides = (suite.customSlides?.[activeDocumentKey] || []).filter(slide => activeSlideOrder.includes(slide.id));
  const shouldShowDraftPreview = isEditMode && showAdminPanel && adminTab === "slides" && showDraftPreview;

  const authHeaders = (token) => token ? { Authorization: `Bearer ${token}` } : {};

  const loadSuiteFromServer = async (token = adminToken || pitchToken) => {
    const response = await fetch("/api/state", {
      headers: authHeaders(token)
    });
    if (!response.ok) throw new Error("Could not load deck data.");
    const data = await response.json();
    setSuite(normalizeSuite(data.suite));
    return data;
  };

  const loadAnalyticsFromServer = async () => {
    const response = await fetch("/api/analytics");
    if (!response.ok) return;
    const data = await response.json();
    setAnalytics(prev => ({
      ...prev,
      ...(data.analytics || {})
    }));
  };

  useEffect(() => {
    if (adminTab === "analytics" && showAdminPanel) {
      loadAnalyticsFromServer();
    }
  }, [adminTab, showAdminPanel]);

  // Load shared suite data on mount
  useEffect(() => {
    // Add Google Font for Noto Serif Black
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Serif:wght@900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    loadSuiteFromServer().catch(() => setErrorMsg("Could not load shared deck data."));
    loadAnalyticsFromServer();

    return () => {
      if(document.head.contains(fontLink)) document.head.removeChild(fontLink);
    }
  }, []);

  // Intersection Observer for Slide Tracking
  useEffect(() => {
    if (activeView === "onePager") return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const key = entry.target?.dataset?.slideKey;
          const idx = activeSlideOrder.indexOf(key);
          if (idx !== -1) setCurrentSlide(idx + 1);
        }
      });
    }, { threshold: 0.5 });
    
    Object.values(slideRefs.current).forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [activeView, activeSlideOrder.join("|")]);

  // Lightweight engagement analytics
  useEffect(() => {
    if (isEditMode) return undefined;
    const timer = window.setInterval(() => {
      const metricKey = activeView === "onePager" ? "onePager" : `${activeView}:${activeSlideKey}`;
      fetch("/api/analytics/tick", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...authHeaders(!isEditMode ? pitchToken : "")
        },
        body: JSON.stringify({ view: activeView, slideKey: activeSlideKey, seconds: 1 }),
        keepalive: true
      })
        .then(response => response.ok ? response.json() : null)
        .then(data => {
          if (data?.analytics) setAnalytics(prev => ({ ...prev, ...data.analytics }));
        })
        .catch(() => {});
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeView, activeSlideKey, pitchToken, isEditMode]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showPasswordModal || isEditMode || showOnePager || showPitchGate) return;
      if (e.key === 'ArrowRight' && currentSlide < activeSlideOrder.length) scrollToSlide(currentSlide); 
      if (e.key === 'ArrowLeft' && currentSlide > 1) scrollToSlide(currentSlide - 2); 
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, showPasswordModal, isEditMode, showOnePager, showPitchGate, activeSlideOrder.length]);

  const scrollToSlide = (index) => {
    const key = activeSlideOrder[index];
    if (index >= 0 && key && slideRefs.current[key]) {
      slideRefs.current[key].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const registerSlide = (key) => (el) => {
    if (el) slideRefs.current[key] = el;
  };

  const getSlideStyle = (key) => ({
    order: Math.max(1, activeSlideOrder.indexOf(key) + 1)
  });

  const getSlideLabel = (key) => {
    const customSlide = Object.values(suite.customSlides || {})
      .flat()
      .find(slide => slide.id === key);
    return SLIDE_LABELS[key] || customSlide?.title || key;
  };

  const getFieldOrigin = (documentKey, id, seen = new Set()) => {
    if (suite.documents?.[documentKey] && Object.prototype.hasOwnProperty.call(suite.documents[documentKey], id)) {
      return documentKey;
    }
    const sourceKey = suite.sources?.[documentKey];
    if (!sourceKey || sourceKey === documentKey || seen.has(sourceKey)) return "Default";
    seen.add(documentKey);
    return getFieldOrigin(sourceKey, id, seen);
  };

  const clearContentOverride = (documentKey, id) => {
    setSuite(prev => {
      const documentContent = { ...(prev.documents?.[documentKey] || {}) };
      delete documentContent[id];
      return normalizeSuite({
        ...prev,
        documents: {
          ...prev.documents,
          [documentKey]: documentContent
        }
      });
    });
  };

  const getDocumentStats = (documentKey) => {
    const localFields = Object.keys(suite.documents?.[documentKey] || {}).length;
    const inheritedFields = TEXT_FIELD_IDS.concat(IMAGE_FIELD_IDS).filter(id => getFieldOrigin(documentKey, id) !== documentKey).length;
    return { localFields, inheritedFields };
  };

  const getSourceChain = (documentKey) => {
    const chain = [documentKey];
    const seen = new Set([documentKey]);
    let current = documentKey;
    while (suite.sources?.[current] && !seen.has(suite.sources[current])) {
      current = suite.sources[current];
      chain.push(current);
      seen.add(current);
    }
    return chain;
  };

  const investorAccessList = suite.settings?.pitchAccess || [];
  const selectedInvestor = investorAccessList.find(entry =>
    String(entry.email || "").trim().toLowerCase() === selectedInvestorEmail
  ) || investorAccessList[0];
  const selectedInvestorKey = String(selectedInvestor?.email || "").trim().toLowerCase();
  const selectedInvestorSlides = analytics.investorSlideSeconds?.[selectedInvestorKey] || {};

  const getInvestorActivity = (email) => {
    const key = String(email || "").trim().toLowerCase();
    const slideSeconds = analytics.investorSlideSeconds?.[key] || {};
    const byView = {
      onePager: 0,
      teaserDeck: 0,
      pitchDeck: 0
    };
    Object.entries(slideSeconds).forEach(([metricKey, seconds]) => {
      const [view] = metricKey.split(":");
      if (metricKey === "onePager") byView.onePager += seconds;
      else if (byView[view] !== undefined) byView[view] += seconds;
    });
    return {
      email: key,
      total: analytics.investorSeconds?.[key] || 0,
      logins: analytics.investorLogins?.[key] || 0,
      lastSeen: analytics.investorLastSeen?.[key],
      byView,
      slideSeconds
    };
  };

  const setDraftTemplate = (templateKey) => {
    const template = CUSTOM_SLIDE_TEMPLATES[templateKey] || CUSTOM_SLIDE_TEMPLATES.narrative;
    setNewSlideDraft({
      template: templateKey,
      chartType: template.chartType || "metric-cards",
      ...template
    });
  };

  const updateDraftMetric = (index, patch) => {
    setNewSlideDraft(prev => ({
      ...prev,
      metrics: (prev.metrics || []).map((metric, i) => i === index ? { ...metric, ...patch } : metric)
    }));
  };

  const moveDraftMetric = (index, direction) => {
    setNewSlideDraft(prev => {
      const metrics = [...(prev.metrics || [])];
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= metrics.length) return prev;
      [metrics[index], metrics[nextIndex]] = [metrics[nextIndex], metrics[index]];
      return { ...prev, metrics };
    });
  };

  const addDraftMetric = () => {
    setNewSlideDraft(prev => ({
      ...prev,
      metrics: [...(prev.metrics || []), { label: "Metric", value: "0" }]
    }));
  };

  const removeDraftMetric = (index) => {
    setNewSlideDraft(prev => ({
      ...prev,
      metrics: (prev.metrics || []).filter((_, i) => i !== index)
    }));
  };

  const updateDraftChartType = (chartType) => {
    setNewSlideDraft(prev => ({
      ...prev,
      chartType,
      metrics: (prev.metrics || []).length ? prev.metrics : getDefaultMetricsForChartType(chartType)
    }));
  };

  const updateContentField = (documentKey, id, value) => {
    setSuite(prev => normalizeSuite({
      ...prev,
      documents: {
        ...prev.documents,
        [documentKey]: {
          ...(prev.documents?.[documentKey] || {}),
          [id]: value
        }
      }
    }));
  };

  const updateSource = (documentKey, sourceKey) => {
    setSuite(prev => normalizeSuite({
      ...prev,
      sources: {
        ...prev.sources,
        [documentKey]: sourceKey
      }
    }));
  };

  const updateSetting = (id, value) => {
    setSuite(prev => normalizeSuite({
      ...prev,
      settings: {
        ...prev.settings,
        [id]: value
      }
    }));
  };

  const moveSlide = (fromIndex, direction) => {
    setSuite(prev => {
      const nextOrder = [...(prev.slideOrder?.[activeDocumentKey] || DEFAULT_SLIDE_ORDER)];
      const toIndex = fromIndex + direction;
      if (toIndex < 0 || toIndex >= nextOrder.length) return prev;
      [nextOrder[fromIndex], nextOrder[toIndex]] = [nextOrder[toIndex], nextOrder[fromIndex]];
      return normalizeSuite({
        ...prev,
        slideOrder: {
          ...prev.slideOrder,
          [activeDocumentKey]: nextOrder
        }
      });
    });
  };

  const removeSlideFromDocument = (slideKey) => {
    const currentOrder = suite.slideOrder?.[activeDocumentKey] || DEFAULT_SLIDE_ORDER;
    if (currentOrder.length <= 1) return;
    setSuite(prev => {
      const nextOrder = (prev.slideOrder?.[activeDocumentKey] || DEFAULT_SLIDE_ORDER).filter(key => key !== slideKey);
      const nextCustomSlides = DEFAULT_SLIDE_ORDER.includes(slideKey)
        ? (prev.customSlides?.[activeDocumentKey] || [])
        : (prev.customSlides?.[activeDocumentKey] || []).filter(slide => slide.id !== slideKey);
      return normalizeSuite({
        ...prev,
        customSlides: {
          ...prev.customSlides,
          [activeDocumentKey]: nextCustomSlides
        },
        slideOrder: {
          ...prev.slideOrder,
          [activeDocumentKey]: nextOrder.length ? nextOrder : currentOrder
        }
      });
    });
    setCurrentSlide(prev => Math.min(prev, Math.max(currentOrder.length - 1, 1)));
  };

  const addInvestorAccess = () => {
    const email = newInvestor.email.trim().toLowerCase();
    if (!email || !newInvestor.password) return;
    setSuite(prev => normalizeSuite({
      ...prev,
      settings: {
        ...prev.settings,
        pitchAccess: [
          ...(prev.settings?.pitchAccess || []),
          {
            email,
            password: newInvestor.password,
            label: newInvestor.label || email,
            active: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    }));
    setNewInvestor({ email: "", password: "", label: "" });
  };

  const updateInvestorAccess = (index, patch) => {
    setSuite(prev => {
      const pitchAccess = [...(prev.settings?.pitchAccess || [])];
      pitchAccess[index] = { ...pitchAccess[index], ...patch };
      return normalizeSuite({
        ...prev,
        settings: {
          ...prev.settings,
          pitchAccess
        }
      });
    });
  };

  const removeInvestorAccess = (index) => {
    setSuite(prev => normalizeSuite({
      ...prev,
      settings: {
        ...prev.settings,
        pitchAccess: (prev.settings?.pitchAccess || []).filter((_, i) => i !== index)
      }
    }));
  };

  const createCustomSlide = () => {
    const id = `custom-${Date.now()}`;
    const slide = {
      id,
      template: newSlideDraft.template,
      chartType: newSlideDraft.chartType || "metric-cards",
      title: newSlideDraft.title || "New Slide",
      kicker: newSlideDraft.kicker || "New Slide",
      body: newSlideDraft.body || "",
      quote: newSlideDraft.quote || "",
      imageUrl: newSlideDraft.imageUrl || "",
      metrics: newSlideDraft.metrics || []
    };
    setSuite(prev => normalizeSuite({
      ...prev,
      customSlides: {
        ...prev.customSlides,
        [activeDocumentKey]: [...(prev.customSlides?.[activeDocumentKey] || []), slide]
      },
      slideOrder: {
        ...prev.slideOrder,
        [activeDocumentKey]: [...(prev.slideOrder?.[activeDocumentKey] || DEFAULT_SLIDE_ORDER), id]
      }
    }));
    setShowDraftPreview(false);
    setDraftTemplate("narrative");
  };

  const updateCustomSlide = (slideId, patch) => {
    setSuite(prev => normalizeSuite({
      ...prev,
      customSlides: {
        ...prev.customSlides,
        [activeDocumentKey]: (prev.customSlides?.[activeDocumentKey] || []).map(slide =>
          slide.id === slideId ? { ...slide, ...patch } : slide
        )
      }
    }));
  };

  const updateCustomSlideChartType = (slideId, chartType) => {
    const slide = activeCustomSlides.find(item => item.id === slideId);
    updateCustomSlide(slideId, {
      chartType,
      metrics: (slide?.metrics || []).length ? slide.metrics : getDefaultMetricsForChartType(chartType)
    });
  };

  const updateCustomSlideMetric = (slideId, index, patch) => {
    const slide = activeCustomSlides.find(item => item.id === slideId);
    const metrics = (slide?.metrics || []).map((metric, i) => i === index ? { ...metric, ...patch } : metric);
    updateCustomSlide(slideId, { metrics });
  };

  const moveCustomSlideMetric = (slideId, index, direction) => {
    const slide = activeCustomSlides.find(item => item.id === slideId);
    const metrics = [...(slide?.metrics || [])];
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= metrics.length) return;
    [metrics[index], metrics[nextIndex]] = [metrics[nextIndex], metrics[index]];
    updateCustomSlide(slideId, { metrics });
  };

  const addCustomSlideMetric = (slideId) => {
    const slide = activeCustomSlides.find(item => item.id === slideId);
    updateCustomSlide(slideId, { metrics: [...(slide?.metrics || []), { label: "Metric", value: "0" }] });
  };

  const removeCustomSlideMetric = (slideId, index) => {
    const slide = activeCustomSlides.find(item => item.id === slideId);
    updateCustomSlide(slideId, { metrics: (slide?.metrics || []).filter((_, i) => i !== index) });
  };

  const removeCustomSlide = (slideId) => {
    removeSlideFromDocument(slideId);
  };

  const importSlidesFromDocument = (targetKey, sourceKey, mode = "appendCustom") => {
    if (!sourceKey || sourceKey === targetKey) return;
    setSuite(prev => {
      const sourceOrder = prev.slideOrder?.[sourceKey] || DEFAULT_SLIDE_ORDER;
      const targetOrder = prev.slideOrder?.[targetKey] || DEFAULT_SLIDE_ORDER;
      const sourceCustom = prev.customSlides?.[sourceKey] || [];
      const targetCustom = prev.customSlides?.[targetKey] || [];
      const existingCustomIds = new Set(targetCustom.map(slide => slide.id));

      const copiedCustom = sourceCustom
        .filter(slide => !existingCustomIds.has(slide.id))
        .map(slide => ({ ...slide, id: `${slide.id}-${Date.now()}` }));

      const copiedIdMap = new Map();
      sourceCustom
        .filter(slide => !existingCustomIds.has(slide.id))
        .forEach((slide, index) => copiedIdMap.set(slide.id, copiedCustom[index]?.id));

      const importedOrder = sourceOrder
        .map(key => copiedIdMap.get(key) || key)
        .filter(key => !targetOrder.includes(key));

      const nextOrder = mode === "replace"
        ? [...sourceOrder.map(key => copiedIdMap.get(key) || key)]
        : [...targetOrder, ...importedOrder];

      return normalizeSuite({
        ...prev,
        customSlides: {
          ...prev.customSlides,
          [targetKey]: [...targetCustom, ...copiedCustom]
        },
        slideOrder: {
          ...prev.slideOrder,
          [targetKey]: nextOrder
        }
      });
    });
  };

  const copySlideStructureFromSource = (documentKey) => {
    const sourceKey = suite.sources?.[documentKey];
    if (!sourceKey) return;
    setSuite(prev => normalizeSuite({
      ...prev,
      slideOrder: {
        ...prev.slideOrder,
        [documentKey]: [...(prev.slideOrder?.[sourceKey] || DEFAULT_SLIDE_ORDER)]
      },
      customSlides: {
        ...prev.customSlides,
        [documentKey]: [...(prev.customSlides?.[sourceKey] || [])]
      }
    }));
  };

  const handleSave = async () => {
    if (!adminToken) {
      setErrorMsg("Admin session expired. Please unlock admin mode again.");
      setShowPasswordModal(true);
      return;
    }

    const response = await fetch("/api/suite", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        ...authHeaders(adminToken)
      },
      body: JSON.stringify({ suite: normalizeSuite(suite) })
    });

    if (!response.ok) {
      setErrorMsg("Could not save shared deck data.");
      return;
    }

    const data = await response.json();
    setSuite(normalizeSuite(data.suite));
    setIsEditMode(false);
    setShowAdminPanel(false);
  };

  const handleDiscard = async () => {
    await loadSuiteFromServer(adminToken || pitchToken).catch(() => setSuite(createDefaultSuite()));
    setIsEditMode(false);
    setShowAdminPanel(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: passwordInput })
    });

    if (response.ok) {
      const data = await response.json();
      setAdminToken(data.token);
      setIsEditMode(true);
      setShowPasswordModal(false);
      setPasswordInput("");
      setErrorMsg("");
      await loadSuiteFromServer(data.token);
    } else {
      setErrorMsg("Incorrect password.");
    }
  };

  const openDocument = (documentKey) => {
    setShowDraftPreview(false);
    if (documentKey === "onePager") {
      setLastDeckView(activeView === "onePager" ? lastDeckView : activeView);
      setActiveView("onePager");
      setShowOnePager(true);
      return;
    }

    if (documentKey === "pitchDeck" && !pitchToken && !isEditMode) {
      setShowPitchGate(true);
      return;
    }

    setShowOnePager(false);
    setActiveView(documentKey);
    setLastDeckView(documentKey);
    setCurrentSlide(1);
    window.setTimeout(() => scrollToSlide(0), 0);
  };

  const handleCloseOnePager = () => {
    setShowOnePager(false);
    setActiveView(lastDeckView || "teaserDeck");
  };

  const handlePitchLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/pitch/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(pitchLogin)
    });

    if (response.ok) {
      const data = await response.json();
      setPitchToken(data.token);
      setShowPitchGate(false);
      setPitchLogin({ email: "", password: "" });
      setErrorMsg("");
      await loadSuiteFromServer(data.token);
      setActiveView("pitchDeck");
      setLastDeckView("pitchDeck");
      setCurrentSlide(1);
      window.setTimeout(() => scrollToSlide(0), 0);
    } else {
      setErrorMsg("Incorrect email or password.");
    }
  };

  // Inline Editable Components
  const EditableText = ({ id, as: Tag = 'div', className = "", style = {} }) => {
    const handleBlur = (e) => {
      updateContentField(activeDocumentKey, id, e.target.innerText);
    };
    return (
      <Tag
        contentEditable={isEditMode}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        className={`${className} ${isEditMode ? 'outline-none ring-2 ring-dashed ring-white/30 bg-white/5 rounded px-2 hover:bg-white/10 transition-colors' : 'outline-none whitespace-pre-wrap'}`}
        style={{ cursor: isEditMode ? 'text' : 'inherit', ...style }}
      >
        {content[id]}
      </Tag>
    );
  };

  const EditableImage = ({ id, className = "", alt = "" }) => {
    const handleClick = () => {
      if (!isEditMode) return;
      const newUrl = window.prompt("Enter new image URL:", content[id]);
      if (newUrl) {
        updateContentField(activeDocumentKey, id, newUrl);
      }
    };
    return (
      <div className={`relative ${isEditMode ? 'cursor-pointer group' : ''}`} onClick={handleClick}>
        <img src={content[id]} alt={alt} className={className} />
        {isEditMode && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[inherit] ring-2 ring-dashed ring-white/50">
            <ImageIcon className="text-white" size={32} />
          </div>
        )}
      </div>
    );
  };


  const renderAdminPanel = () => (
    <AnimatePresence>
      {showAdminPanel && (
        <div className={`fixed inset-0 z-[300] flex justify-end print:hidden ${shouldShowDraftPreview ? "pointer-events-none bg-transparent backdrop-blur-0" : "bg-[#050505]/80 backdrop-blur-md"}`}>
          <motion.aside
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            className="h-full w-full max-w-[420px] bg-[#0b0b0b] border-l border-white/10 shadow-2xl overflow-y-auto pointer-events-auto"
          >
            <div className="sticky top-0 bg-[#0b0b0b]/95 backdrop-blur-xl border-b border-white/10 p-5 z-10">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#FF8A3D] font-bold">Admin</div>
                  <div className="text-lg font-semibold">{DOCUMENT_LABELS[activeDocumentKey]}</div>
                </div>
                <button onClick={() => setShowAdminPanel(false)} className="p-2 text-white/50 hover:text-white transition-colors"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {["flow", "content", "slides", "access", "analytics"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAdminTab(tab)}
                    className={`px-2 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-colors ${adminTab === tab ? "bg-[#FF8A3D] text-black font-bold" : "bg-white/5 text-white/60 hover:text-white"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 pb-28">
              {adminTab === "flow" && (
                <div className="space-y-5">
                  {activeDocumentKey === "onePager" && (
                    <div className="rounded-2xl border border-[#FF8A3D]/30 bg-[#FF8A3D]/10 p-4 text-sm text-white/75 leading-relaxed">
                      One Pager is edited from the One Pager view itself for layout-specific content, and from this panel for shared fields. Use Content to edit inherited text or clear overrides.
                    </div>
                  )}
                  <div className="text-sm text-white/50 leading-relaxed">
                    This is the publishing chain. Pitch Deck is the master. Teaser Deck reads missing fields from Pitch Deck, and One Pager reads missing fields from Teaser Deck. Local overrides win only where you edit that document directly.
                  </div>
                  {activeDocumentKey !== "pitchDeck" && (
                    <div className="rounded-2xl border border-[#FF8A3D]/30 bg-[#FF8A3D]/10 p-4 space-y-3">
                      <div className="text-sm font-semibold text-white">Bring slides into {DOCUMENT_LABELS[activeDocumentKey]}</div>
                      <div className="text-xs text-white/55 leading-relaxed">
                        Content fields inherit automatically. Slide structure is intentional: import the slide list when you want this document to include upstream slides.
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {DOCUMENT_CHAIN.filter(key => DOCUMENT_CHAIN.indexOf(key) < DOCUMENT_CHAIN.indexOf(activeDocumentKey)).map(sourceKey => (
                          <button
                            key={sourceKey}
                            onClick={() => importSlidesFromDocument(activeDocumentKey, sourceKey)}
                            className="px-3 py-2 rounded-xl bg-black/30 hover:bg-black/50 text-sm text-left transition-colors"
                          >
                            Import missing slides from {DOCUMENT_LABELS[sourceKey]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    {["pitchDeck", "teaserDeck", "onePager"].map((key, index) => {
                      const stats = getDocumentStats(key);
                      const source = suite.sources?.[key];
                      return (
                        <div key={key} className={`rounded-2xl border p-4 ${key === activeDocumentKey ? "border-[#FF8A3D]/60 bg-[#FF8A3D]/10" : "border-white/10 bg-white/[0.03]"}`}>
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div>
                              <div className="text-xs text-white/35 uppercase tracking-wider">Step {index + 1}</div>
                              <div className="text-lg font-semibold">{DOCUMENT_LABELS[key]}</div>
                            </div>
                            <div className="text-right text-xs text-white/45">
                              <div>{stats.localFields} local overrides</div>
                              <div>{stats.inheritedFields} inherited fields</div>
                            </div>
                          </div>
                          <div className="text-sm text-white/55">
                            {source ? `Reads missing data from ${DOCUMENT_LABELS[source]}.` : "Source of truth. No upstream document."}
                          </div>
                          {source && (
                            <button onClick={() => copySlideStructureFromSource(key)} className="mt-3 text-[10px] uppercase tracking-wider text-[#FF8A3D] hover:text-[#ffb17c]">
                              Copy slide structure from {DOCUMENT_LABELS[source]}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Current Chain</div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {getSourceChain(activeDocumentKey).map((key, index) => (
                        <React.Fragment key={key}>
                          {index > 0 && <ArrowRight size={14} className="text-white/25 rotate-180" />}
                          <span className="px-3 py-1.5 rounded-full bg-white/5 text-white/80">{DOCUMENT_LABELS[key]}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {adminTab === "content" && (
                <div className="space-y-6">
                  <div className="text-sm text-white/50 leading-relaxed">
                    Edit any text, metric, chart label, use-of-funds item, or image URL for this document. Empty fields continue reading from the configured source.
                  </div>
                  <div className="space-y-3">
                    {TEXT_FIELD_IDS.map(id => {
                      const origin = getFieldOrigin(activeDocumentKey, id);
                      const isLocal = origin === activeDocumentKey;
                      return (
                      <label key={id} className="block">
                        <span className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-white/35 mb-1">
                          <span>{id.replaceAll("_", " ")}</span>
                          <span className={isLocal ? "text-[#FF8A3D]" : "text-white/35"}>
                            {isLocal ? "Local override" : `Inherited: ${DOCUMENT_LABELS[origin] || origin}`}
                          </span>
                        </span>
                        <textarea
                          value={content[id] || ""}
                          onChange={(e) => updateContentField(activeDocumentKey, id, e.target.value)}
                          rows={id.includes("body") || id.includes("quote") || id.includes("sub") ? 3 : 2}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70 resize-y"
                        />
                        {isLocal && (
                          <button type="button" onClick={() => clearContentOverride(activeDocumentKey, id)} className="mt-1 text-[10px] uppercase tracking-wider text-white/35 hover:text-[#FF8A3D]">
                            Clear override and inherit
                          </button>
                        )}
                      </label>
                    )})}
                  </div>
                  <div className="pt-5 border-t border-white/10 space-y-3">
                    {IMAGE_FIELD_IDS.map(id => {
                      const origin = getFieldOrigin(activeDocumentKey, id);
                      const isLocal = origin === activeDocumentKey;
                      return (
                      <label key={id} className="block">
                        <span className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-white/35 mb-1">
                          <span>{id.replaceAll("_", " ")}</span>
                          <span className={isLocal ? "text-[#FF8A3D]" : "text-white/35"}>
                            {isLocal ? "Local override" : `Inherited: ${DOCUMENT_LABELS[origin] || origin}`}
                          </span>
                        </span>
                        <input
                          value={content[id] || ""}
                          onChange={(e) => updateContentField(activeDocumentKey, id, e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70"
                        />
                        {isLocal && (
                          <button type="button" onClick={() => clearContentOverride(activeDocumentKey, id)} className="mt-1 text-[10px] uppercase tracking-wider text-white/35 hover:text-[#FF8A3D]">
                            Clear override and inherit
                          </button>
                        )}
                      </label>
                    )})}
                  </div>
                  {(
                    <div className="pt-5 border-t border-white/10 space-y-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-white/35">Custom slide content</div>
                        <div className="text-xs text-white/40 mt-1">New slides live here too, so Content is the full editorial surface.</div>
                      </div>
                      {activeCustomSlides.length === 0 && (
                        <div className="text-xs text-white/35 bg-white/[0.02] rounded-xl px-3 py-3">No custom slides in this document yet.</div>
                      )}
                      {activeCustomSlides.map(slide => (
                        <div key={slide.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
                          <div className="text-sm font-semibold text-white/80">{slide.title || "Untitled custom slide"}</div>
                          <input value={slide.kicker || ""} onChange={(e) => updateCustomSlide(slide.id, { kicker: e.target.value })} placeholder="Kicker" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                          <input value={slide.title || ""} onChange={(e) => updateCustomSlide(slide.id, { title: e.target.value })} placeholder="Title" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                          <textarea value={slide.body || ""} onChange={(e) => updateCustomSlide(slide.id, { body: e.target.value })} rows={3} placeholder="Body" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70 resize-y" />
                          <textarea value={slide.quote || ""} onChange={(e) => updateCustomSlide(slide.id, { quote: e.target.value })} rows={2} placeholder="Quote" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70 resize-y" />
                          <input value={slide.imageUrl || ""} onChange={(e) => updateCustomSlide(slide.id, { imageUrl: e.target.value })} placeholder="Optional image URL" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                          <select value={slide.chartType || "metric-cards"} onChange={(e) => updateCustomSlideChartType(slide.id, e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70">
                            {CHART_TYPE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-[10px] uppercase tracking-wider text-white/35">Fields / metrics</div>
                              <button onClick={() => addCustomSlideMetric(slide.id)} className="text-[10px] uppercase tracking-wider text-[#FF8A3D]">Add field</button>
                            </div>
                            {(slide.metrics || []).map((metric, index) => (
                              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                                <input value={metric.label || ""} onChange={(e) => updateCustomSlideMetric(slide.id, index, { label: e.target.value })} className="min-w-0 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF8A3D]/70" />
                                <input value={metric.value || ""} onChange={(e) => updateCustomSlideMetric(slide.id, index, { value: e.target.value })} className="min-w-0 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF8A3D]/70" />
                                <div className="flex gap-1">
                                  <button disabled={index === 0} onClick={() => moveCustomSlideMetric(slide.id, index, -1)} className="px-2 rounded-lg bg-white/5 disabled:opacity-20">Up</button>
                                  <button disabled={index === (slide.metrics || []).length - 1} onClick={() => moveCustomSlideMetric(slide.id, index, 1)} className="px-2 rounded-lg bg-white/5 disabled:opacity-20">Down</button>
                                  <button onClick={() => removeCustomSlideMetric(slide.id, index)} className="px-2 rounded-lg bg-red-500/10 text-red-200">X</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {adminTab === "slides" && (
                <div className="space-y-4">
                  <div className="text-sm text-white/50 leading-relaxed">Change slide order, add new slides from reusable templates, and edit custom slide content.</div>
                  {activeDocumentKey !== "pitchDeck" && (
                    <div className="rounded-2xl border border-[#FF8A3D]/30 bg-[#FF8A3D]/10 p-4 space-y-3">
                      <div className="text-sm font-semibold">Import upstream slides</div>
                      <div className="text-xs text-white/55">Use this when you want Teaser Deck or One Pager to include slides that already exist upstream.</div>
                      {DOCUMENT_CHAIN.filter(key => DOCUMENT_CHAIN.indexOf(key) < DOCUMENT_CHAIN.indexOf(activeDocumentKey)).map(sourceKey => (
                        <button
                          key={sourceKey}
                          onClick={() => importSlidesFromDocument(activeDocumentKey, sourceKey)}
                          className="w-full px-3 py-2 rounded-xl bg-black/30 hover:bg-black/50 text-sm text-left transition-colors"
                        >
                          Import missing slides from {DOCUMENT_LABELS[sourceKey]}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/35">Create Slide</div>
                    <select
                      value={newSlideDraft.template}
                      onChange={(e) => setDraftTemplate(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70"
                    >
                      {Object.entries(CUSTOM_SLIDE_TEMPLATES).map(([key, template]) => (
                        <option key={key} value={key}>{template.label}</option>
                      ))}
                    </select>
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-white/35 mb-2">Template preview</div>
                      <div className="text-xs text-[#FF8A3D] uppercase tracking-wider">{newSlideDraft.kicker}</div>
                      <div className="text-xl font-semibold mt-1">{newSlideDraft.title}</div>
                      <div className="text-xs text-white/50 mt-2">{newSlideDraft.body}</div>
                      {(newSlideDraft.metrics || []).length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {newSlideDraft.metrics.map((metric, index) => (
                            <div key={index} className="rounded-lg bg-white/5 p-2">
                              <div className="text-[9px] text-white/35 uppercase">{metric.label}</div>
                              <div className="text-sm text-[#FF8A3D] font-semibold">{metric.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowDraftPreview(prev => !prev)}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${showDraftPreview ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/15"}`}
                    >
                      {showDraftPreview ? "Hide full canvas preview" : "Show full canvas preview"}
                    </button>
                    <input
                      value={newSlideDraft.kicker || ""}
                      onChange={(e) => setNewSlideDraft(prev => ({ ...prev, kicker: e.target.value }))}
                      placeholder="Kicker"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70"
                    />
                    <input
                      value={newSlideDraft.title || ""}
                      onChange={(e) => setNewSlideDraft(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={CUSTOM_SLIDE_TEMPLATES[newSlideDraft.template]?.title || "Slide title"}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70"
                    />
                    <textarea
                      value={newSlideDraft.body || ""}
                      onChange={(e) => setNewSlideDraft(prev => ({ ...prev, body: e.target.value }))}
                      rows={3}
                      placeholder="Body"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70 resize-y"
                    />
                    <textarea
                      value={newSlideDraft.quote || ""}
                      onChange={(e) => setNewSlideDraft(prev => ({ ...prev, quote: e.target.value }))}
                      rows={2}
                      placeholder="Quote or takeaway"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70 resize-y"
                    />
                    <input
                      value={newSlideDraft.imageUrl || ""}
                      onChange={(e) => setNewSlideDraft(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="Optional image URL"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70"
                    />
                    <select
                      value={newSlideDraft.chartType || "metric-cards"}
                      onChange={(e) => updateDraftChartType(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70"
                    >
                      {CHART_TYPE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] uppercase tracking-wider text-white/35">Fields / metrics</div>
                        <button onClick={addDraftMetric} className="text-[10px] uppercase tracking-wider text-[#FF8A3D]">Add field</button>
                      </div>
                      {(newSlideDraft.metrics || []).map((metric, index) => (
                        <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                          <input value={metric.label || ""} onChange={(e) => updateDraftMetric(index, { label: e.target.value })} className="min-w-0 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF8A3D]/70" />
                          <input value={metric.value || ""} onChange={(e) => updateDraftMetric(index, { value: e.target.value })} className="min-w-0 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF8A3D]/70" />
                          <div className="flex gap-1">
                            <button disabled={index === 0} onClick={() => moveDraftMetric(index, -1)} className="px-2 rounded-lg bg-white/5 disabled:opacity-20">Up</button>
                            <button disabled={index === (newSlideDraft.metrics || []).length - 1} onClick={() => moveDraftMetric(index, 1)} className="px-2 rounded-lg bg-white/5 disabled:opacity-20">Down</button>
                            <button onClick={() => removeDraftMetric(index)} className="px-2 rounded-lg bg-red-500/10 text-red-200">X</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={createCustomSlide} className="w-full px-4 py-3 rounded-xl bg-[#FF8A3D] text-black text-sm font-bold hover:bg-[#ff9a55] transition-colors">
                      Add slide to {DOCUMENT_LABELS[activeDocumentKey]}
                    </button>
                  </div>
                  {activeSlideOrder.map((key, index) => (
                    <div key={key} className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-3">
                      <div className="text-xs text-white/35 w-6">{index + 1}</div>
                      <div className="flex-1 text-sm font-medium">{getSlideLabel(key)}</div>
                      <button disabled={index === 0} onClick={() => moveSlide(index, -1)} className="px-3 py-1 rounded-lg bg-white/5 text-white/60 disabled:opacity-20 hover:text-white">Up</button>
                      <button disabled={index === activeSlideOrder.length - 1} onClick={() => moveSlide(index, 1)} className="px-3 py-1 rounded-lg bg-white/5 text-white/60 disabled:opacity-20 hover:text-white">Down</button>
                      <button
                        disabled={activeSlideOrder.length <= 1}
                        onClick={() => removeSlideFromDocument(key)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-200/70 hover:text-red-200 disabled:opacity-20"
                        title={`Delete ${getSlideLabel(key)} from ${DOCUMENT_LABELS[activeDocumentKey]}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  {activeCustomSlides.length > 0 && (
                    <div className="pt-5 border-t border-white/10 space-y-4">
                      <div className="text-[10px] uppercase tracking-wider text-white/35">Custom Slides</div>
                      {activeCustomSlides.map(slide => (
                        <div key={slide.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
                          <input value={slide.kicker || ""} onChange={(e) => updateCustomSlide(slide.id, { kicker: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                          <input value={slide.title || ""} onChange={(e) => updateCustomSlide(slide.id, { title: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                          <textarea value={slide.body || ""} onChange={(e) => updateCustomSlide(slide.id, { body: e.target.value })} rows={3} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70 resize-y" />
                          <textarea value={slide.quote || ""} onChange={(e) => updateCustomSlide(slide.id, { quote: e.target.value })} rows={2} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70 resize-y" />
                          <input value={slide.imageUrl || ""} onChange={(e) => updateCustomSlide(slide.id, { imageUrl: e.target.value })} placeholder="Optional image URL" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                          <select value={slide.chartType || "metric-cards"} onChange={(e) => updateCustomSlideChartType(slide.id, e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70">
                            {CHART_TYPE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-[10px] uppercase tracking-wider text-white/35">Fields / metrics</div>
                              <button onClick={() => addCustomSlideMetric(slide.id)} className="text-[10px] uppercase tracking-wider text-[#FF8A3D]">Add field</button>
                            </div>
                            {(slide.metrics || []).map((metric, index) => (
                              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                                <input value={metric.label || ""} onChange={(e) => updateCustomSlideMetric(slide.id, index, { label: e.target.value })} className="min-w-0 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF8A3D]/70" />
                                <input value={metric.value || ""} onChange={(e) => updateCustomSlideMetric(slide.id, index, { value: e.target.value })} className="min-w-0 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FF8A3D]/70" />
                                <div className="flex gap-1">
                                  <button disabled={index === 0} onClick={() => moveCustomSlideMetric(slide.id, index, -1)} className="px-2 rounded-lg bg-white/5 disabled:opacity-20">Up</button>
                                  <button disabled={index === (slide.metrics || []).length - 1} onClick={() => moveCustomSlideMetric(slide.id, index, 1)} className="px-2 rounded-lg bg-white/5 disabled:opacity-20">Down</button>
                                  <button onClick={() => removeCustomSlideMetric(slide.id, index)} className="px-2 rounded-lg bg-red-500/10 text-red-200">X</button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => removeCustomSlide(slide.id)} className="text-xs uppercase tracking-wider text-red-300/70 hover:text-red-300">Remove slide</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {adminTab === "access" && (
                <div className="space-y-6">
                  <label className="block">
                    <span className="block text-[10px] uppercase tracking-wider text-white/35 mb-2">Read missing data from</span>
                    <select
                      value={suite.sources?.[activeDocumentKey] || ""}
                      onChange={(e) => updateSource(activeDocumentKey, e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70"
                    >
                      <option value="">No source</option>
                      {Object.keys(DOCUMENT_LABELS).filter(key => key !== activeDocumentKey).map(key => (
                        <option key={key} value={key}>{DOCUMENT_LABELS[key]}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-[10px] uppercase tracking-wider text-white/35 mb-1">Admin password</span>
                    <input type="password" value={suite.settings?.adminPassword || ""} onChange={(e) => updateSetting("adminPassword", e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                  </label>
                  <div className="pt-5 border-t border-white/10 space-y-3">
                    <div>
                      <div className="text-sm font-medium text-white/80">Investor Pitch Deck access</div>
                      <div className="text-xs text-white/40 mt-1">Each investor gets their own credentials so analytics can be attributed to that email.</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                      <input value={newInvestor.label} onChange={(e) => setNewInvestor(prev => ({ ...prev, label: e.target.value }))} placeholder="Investor name or fund" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                      <input type="email" value={newInvestor.email} onChange={(e) => setNewInvestor(prev => ({ ...prev, email: e.target.value }))} placeholder="investor@fund.com" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                      <input type="password" value={newInvestor.password} onChange={(e) => setNewInvestor(prev => ({ ...prev, password: e.target.value }))} placeholder="Password" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                      <button onClick={addInvestorAccess} className="w-full px-4 py-3 rounded-xl bg-[#FF8A3D] text-black text-sm font-bold hover:bg-[#ff9a55] transition-colors">Add investor access</button>
                    </div>
                    {(suite.settings?.pitchAccess || []).map((entry, index) => (
                      <div key={`${entry.email}-${index}`} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium">{entry.label || entry.email}</div>
                          <label className="flex items-center gap-2 text-xs text-white/50">
                            <input type="checkbox" checked={entry.active !== false} onChange={(e) => updateInvestorAccess(index, { active: e.target.checked })} />
                            Active
                          </label>
                        </div>
                        <input value={entry.label || ""} onChange={(e) => updateInvestorAccess(index, { label: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                        <input type="email" value={entry.email || ""} onChange={(e) => updateInvestorAccess(index, { email: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                        <input type="password" value={entry.password || ""} onChange={(e) => updateInvestorAccess(index, { password: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF8A3D]/70" />
                        <button onClick={() => removeInvestorAccess(index)} className="text-xs uppercase tracking-wider text-red-300/70 hover:text-red-300">Remove investor</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === "analytics" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                      <div className="text-[10px] uppercase tracking-wider text-white/35 mb-1">Last opened</div>
                      <div className="text-sm">{formatDateTime(analytics.lastOpened)}</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                      <div className="text-[10px] uppercase tracking-wider text-white/35 mb-1">Tracked investors</div>
                      <div className="text-sm">{investorAccessList.length}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-wider text-white/35">Investors</div>
                    {investorAccessList.map((entry, index) => {
                      const activity = getInvestorActivity(entry.email);
                      const isSelected = activity.email === selectedInvestorKey;
                      return (
                        <button
                          key={entry.email + "-" + index}
                          onClick={() => setSelectedInvestorEmail(activity.email)}
                          className={"w-full text-left border rounded-xl p-3 transition-colors " + (isSelected ? "border-[#FF8A3D]/70 bg-[#FF8A3D]/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]")}
                        >
                          <div className="flex justify-between gap-3 text-sm">
                            <span className="font-medium">{entry.label || entry.email}</span>
                            <span className="text-[#FF8A3D]">{formatDuration(activity.total)}</span>
                          </div>
                          <div className="text-xs text-white/40 mt-1">{activity.email || "No email"} · {activity.logins} logins · last {formatDateTime(activity.lastSeen)}</div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedInvestor && (
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-white/35">Selected investor</div>
                        <div className="text-lg font-semibold">{selectedInvestor.label || selectedInvestor.email}</div>
                        <div className="text-xs text-white/40">{selectedInvestorKey}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(getInvestorActivity(selectedInvestorKey).byView).map(([view, seconds]) => (
                          <div key={view} className="rounded-xl bg-white/[0.04] p-3">
                            <div className="text-[10px] uppercase tracking-wider text-white/35">{DOCUMENT_LABELS[view]}</div>
                            <div className="text-sm text-[#FF8A3D] mt-1">{formatDuration(seconds)}</div>
                          </div>
                        ))}
                      </div>
                      {["onePager", "teaserDeck", "pitchDeck"].map(view => {
                        const rows = Object.entries(selectedInvestorSlides)
                          .filter(([key]) => view === "onePager" ? key === "onePager" : key.startsWith(view + ":"))
                          .sort((a, b) => b[1] - a[1]);
                        return (
                          <div key={view} className="space-y-2">
                            <div className="text-[10px] uppercase tracking-wider text-white/35">{DOCUMENT_LABELS[view]} reading</div>
                            {rows.length === 0 ? (
                              <div className="text-xs text-white/35 bg-white/[0.02] rounded-lg px-3 py-2">No tracked reads yet.</div>
                            ) : rows.map(([key, seconds]) => {
                              const slideKey = key.includes(":") ? key.split(":")[1] : "onePager";
                              return (
                                <div key={key} className="flex justify-between text-sm bg-white/[0.02] rounded-lg px-3 py-2">
                                  <span>{slideKey === "onePager" ? "One Pager" : getSlideLabel(slideKey)}</span>
                                  <span className="text-[#FF8A3D]">{formatDuration(seconds)}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-wider text-white/35">Global deck totals</div>
                    {Object.entries(analytics.viewSeconds || {}).map(([key, seconds]) => (
                      <div key={key} className="flex justify-between text-sm bg-white/[0.02] rounded-lg px-3 py-2">
                        <span>{DOCUMENT_LABELS[key] || key}</span>
                        <span className="text-[#FF8A3D]">{formatDuration(seconds)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-wider text-white/35">Time per slide</div>
                    {Object.entries(analytics.slideSeconds || {}).map(([key, seconds]) => (
                      <div key={key} className="flex justify-between text-sm bg-white/[0.02] rounded-lg px-3 py-2">
                        <span>{key.replace(":", " / ")}</span>
                        <span className="text-[#FF8A3D]">{formatDuration(seconds)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="fixed bottom-0 right-0 w-full max-w-[420px] bg-[#0b0b0b]/95 backdrop-blur-xl border-t border-white/10 p-4 flex gap-3">
              <button onClick={handleDiscard} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">Discard</button>
              <button onClick={handleSave} className="flex-1 px-4 py-3 bg-[#FF8A3D] text-black hover:bg-[#ff9a55] rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"><Save size={14} /> Save</button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="bg-[#050505] text-white h-screen overflow-hidden font-manrope selection:bg-[#FF8A3D] selection:text-black">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 print:hidden">
        <MeshBackground />
        <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#FF8A3D]/5 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 md:p-8 flex justify-between items-center z-40 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none print:hidden">
        <div className="text-xl md:text-2xl tracking-tight text-white" style={{ fontFamily: "'Noto Serif', serif", fontWeight: 900, letterSpacing: "-0.02em" }}>aiai3D</div>
        <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Investor Confidential</div>
      </nav>

      {/* Main Content Wrapper (Normal Scrolling without Snap) */}
      <div ref={containerRef} className="h-screen w-full overflow-y-auto scroll-smooth relative z-10 pb-20 flex flex-col print:hidden">
        {shouldShowDraftPreview && (
          <DraftSlidePreview slide={newSlideDraft} />
        )}
        
        {/* --- SLIDE 1: HERO --- */}
        <section data-slide-key="hero" ref={registerSlide("hero")} style={{ ...getSlideStyle("hero"), display: shouldShowDraftPreview ? "none" : undefined }} className="min-h-[100dvh] flex flex-col justify-center items-center text-center relative px-6 w-full overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] pointer-events-none">
            <EditableImage id="img_hero_bg" className="w-full h-full object-cover grayscale mix-blend-luminosity" alt="Architecture" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
            <FadeIn delay={0.2}>
              <EditableText 
                id="s1_head" 
                as="h1" 
                className="text-[11vw] md:text-9xl tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 leading-none py-2" 
                style={{ fontFamily: "'Noto Serif', serif", fontWeight: 900, letterSpacing: "-0.02em" }} 
              />
            </FadeIn>
            <FadeIn delay={0.4}>
              <EditableText id="s1_sub" as="p" className="text-2xl md:text-4xl font-medium tracking-tight text-[#FF8A3D] mb-8 max-w-3xl leading-tight" />
            </FadeIn>
            <FadeIn delay={0.6}>
              <EditableText id="s1_sec" as="p" className="text-lg md:text-xl font-medium text-white/50 max-w-2xl" />
            </FadeIn>
          </div>
        </section>

        {/* --- SLIDE 2: THE PROBLEM --- */}
        <section data-slide-key="problem" ref={registerSlide("problem")} style={{ ...getSlideStyle("problem"), display: shouldShowDraftPreview ? "none" : undefined }} className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative">
          <FadeIn>
            <EditableText id="s2_head" as="h2" className="text-5xl md:text-7xl font-semibold tracking-tighter mb-16 text-center" />
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-16">
            <FadeIn direction="right" delay={0.2}>
              <div className="p-8 md:p-10 rounded-[2rem] bg-white/[0.02] shadow-sm backdrop-blur-sm relative overflow-hidden group h-full">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Clock size={120} /></div>
                <h3 className="text-2xl md:text-3xl font-medium mb-6 text-white/80 border-b border-white/10 pb-6"><EditableText id="s2_l_head" /></h3>
                <EditableText id="s2_l_body" as="p" className="text-lg md:text-xl text-white/50 leading-relaxed" />
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.4}>
              <div className="p-8 md:p-10 rounded-[2rem] bg-red-500/[0.02] shadow-sm backdrop-blur-sm relative overflow-hidden group h-full">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-red-500"><AlertTriangle size={120} /></div>
                <h3 className="text-2xl md:text-3xl font-medium mb-6 text-red-400 border-b border-red-500/20 pb-6"><EditableText id="s2_r_head" /></h3>
                <EditableText id="s2_r_body" as="p" className="text-lg md:text-xl text-white/50 leading-relaxed" />
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <EditableText id="s2_quote" as="h3" className="text-2xl md:text-4xl font-medium tracking-tight text-center text-[#FF8A3D] max-w-4xl mx-auto italic" />
          </FadeIn>
        </section>

        {/* --- SLIDE 3: THE BREAKTHROUGH --- */}
        <section data-slide-key="breakthrough" ref={registerSlide("breakthrough")} style={{ ...getSlideStyle("breakthrough"), display: shouldShowDraftPreview ? "none" : undefined }} className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative">
          <FadeIn className="text-center">
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] mb-4 uppercase opacity-80">The Breakthrough</div>
            <EditableText id="s3_head" as="h2" className="text-5xl md:text-7xl font-semibold tracking-tighter mb-12 max-w-4xl mx-auto" />
          </FadeIn>

          {/* Validation/Lock Symbolism */}
          <FadeIn delay={0.2}>
            <div className="flex justify-center mb-16 relative">
              <div className="absolute inset-0 bg-[#FF8A3D]/20 blur-[60px] rounded-full w-32 h-32 mx-auto"></div>
              <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] backdrop-blur-md flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(255,138,61,0.1)]">
                 <Box className="text-[#FF8A3D] absolute animate-[spin_10s_linear_infinite]" size={72} strokeWidth={1} />
                 <div className="w-12 h-12 bg-[#050505] rounded-full flex items-center justify-center relative z-10 shadow-lg">
                    <Lock className="text-white" size={18} />
                 </div>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative">
            <div className="absolute top-1/2 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block"></div>
            {[
              { id: 's3_p1', icon: <Box size={24} />, num: "01" },
              { id: 's3_p2', icon: <Sparkles size={24} />, num: "02" },
              { id: 's3_p3', icon: <Layers size={24} />, num: "03" }
            ].map((col, i) => (
              <FadeIn key={i} delay={0.3 + (i * 0.1)} direction="up" className="relative z-10">
                <div className="h-full flex flex-col p-8 rounded-[2rem] bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                  <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/5">
                    <div className="text-[#FF8A3D] opacity-80">{col.icon}</div>
                    <div className="text-xl font-light text-white/20">{col.num}</div>
                  </div>
                  <EditableText id={col.id} as="h4" className="text-xl font-medium text-white/90" />
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.6}>
            <div className="p-8 md:p-12 rounded-[2rem] bg-white/[0.01] text-center shadow-sm">
              <EditableText id="s3_quote" as="h3" className="text-2xl md:text-3xl font-medium tracking-tight leading-snug text-white/80 italic" />
            </div>
          </FadeIn>
        </section>

        {/* --- SLIDE 4: MARKET OPPORTUNITY --- */}
        <section data-slide-key="market" ref={registerSlide("market")} style={{ ...getSlideStyle("market"), display: shouldShowDraftPreview ? "none" : undefined }} className="min-h-[100dvh] flex flex-col justify-center items-center text-center px-6 relative w-full overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none">
            <EditableImage id="img_market_bg" className="w-full h-full object-cover mix-blend-screen grayscale" alt="Global Network" />
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center h-full">
            <FadeIn>
              <EditableText id="s5_head" as="h2" className="text-4xl md:text-6xl font-semibold tracking-tighter mb-10 max-w-5xl mx-auto" />
            </FadeIn>

            <FadeIn delay={0.2} direction="up">
              <div className="mb-8 text-center">
                <EditableText id="s5_core_val" as="h3" className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2 drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]" />
                <EditableText id="s5_core_sub" as="p" className="text-lg md:text-xl font-medium text-white/50" />
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-5xl mx-auto w-full">
              {[
                { t: 's5_c1_t', v: 's5_c1_v' },
                { t: 's5_c2_t', v: 's5_c2_v' },
                { t: 's5_c3_t', v: 's5_c3_v' },
                { t: 's5_c4_t', v: 's5_c4_v', highlight: true }
              ].map((card, i) => (
                <FadeIn key={i} delay={0.3 + (i * 0.1)}>
                  <div className={`p-6 rounded-3xl backdrop-blur-md flex flex-col justify-center items-center h-28 transition-transform hover:-translate-y-1 ${card.highlight ? 'bg-[#FF8A3D]/10 shadow-[0_0_40px_rgba(255,138,61,0.15)]' : 'bg-white/[0.02]'}`}>
                    <EditableText id={card.t} as="div" className="text-[10px] md:text-xs font-medium text-white/50 mb-2 uppercase tracking-wider text-center" />
                    <EditableText id={card.v} as="div" className={`text-lg md:text-xl font-semibold tracking-tight text-center leading-tight ${card.highlight ? 'text-[#FF8A3D]' : 'text-white/80'}`} />
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.7} direction="up">
              <div className="mb-10 p-8 md:p-10 rounded-[2rem] bg-gradient-to-b from-[#FF8A3D]/10 to-transparent relative max-w-4xl mx-auto text-center shadow-sm">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#FF8A3D] to-transparent"></div>
                <EditableText id="s5_exp_val" as="h3" className="text-4xl md:text-6xl font-bold tracking-tighter text-[#FF8A3D] mb-2" />
                <EditableText id="s5_exp_sub" as="p" className="text-base md:text-lg font-medium text-[#FF8A3D]/60" />
              </div>
            </FadeIn>

            <FadeIn delay={0.9}>
              <div className="max-w-4xl mx-auto">
                <EditableText id="s5_quote1" as="h3" className="text-2xl md:text-3xl font-medium tracking-tight leading-tight mb-4" />
                <EditableText id="s5_quote2" as="p" className="text-lg md:text-xl text-[#FF8A3D] font-medium" />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* --- SLIDE 5: WHY OTHERS FAIL --- */}
        <section data-slide-key="trust" ref={registerSlide("trust")} style={{ ...getSlideStyle("trust"), display: shouldShowDraftPreview ? "none" : undefined }} className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-20 text-center md:text-left leading-tight whitespace-pre-wrap">
              <EditableText id="s6_head_p1" as="span" className="block md:inline" />
              <EditableText id="s6_head_p2" as="span" className="text-[#FF8A3D]" />
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block"></div>
            
            <FadeIn direction="right" delay={0.2}>
              <div className="pr-0 md:pr-12 bg-white/[0.01] p-8 rounded-[2rem] shadow-sm md:bg-transparent md:p-0 md:shadow-none">
                <div className="flex items-center space-x-4 mb-8 text-white/40">
                  <Cpu size={24} />
                  <EditableText id="s6_l_head" as="h3" className="text-2xl md:text-3xl font-medium" />
                </div>
                <EditableText id="s6_l_body" as="div" className="text-lg md:text-xl text-white/40 space-y-4 leading-relaxed" />
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.4}>
              <div className="pl-0 md:pl-12 bg-[#FF8A3D]/5 p-8 rounded-[2rem] shadow-sm md:bg-transparent md:p-0 md:shadow-none">
                <div className="flex items-center space-x-4 mb-8 text-[#FF8A3D]">
                  <Building2 size={24} />
                  <EditableText id="s6_r_head" as="h3" className="text-2xl md:text-3xl font-medium" />
                </div>
                <EditableText id="s6_r_body" as="div" className="text-lg md:text-xl text-white/90 space-y-4 leading-relaxed font-medium" />
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <div className="text-center">
              <EditableText id="s6_quote" as="h3" className="text-2xl md:text-4xl font-medium tracking-tight max-w-4xl mx-auto italic text-white/80" />
            </div>
          </FadeIn>
        </section>

        {/* --- SLIDE 6: DEFENSIBILITY --- */}
        <section data-slide-key="moat" ref={registerSlide("moat")} style={{ ...getSlideStyle("moat"), display: shouldShowDraftPreview ? "none" : undefined }} className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative">
          <FadeIn>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] mb-4 uppercase text-center md:text-left opacity-80">Moat</div>
            <EditableText id="s7_head" as="h2" className="text-5xl md:text-7xl font-semibold tracking-tighter mb-16 text-center md:text-left" />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24">
            {[
              { id: 's7_p1', icon: <Layers size={24} /> },
              { id: 's7_p2', icon: <ShieldCheck size={24} /> },
              { id: 's7_p3', icon: <Users size={24} /> },
              { id: 's7_p4', icon: <Zap size={24} /> }
            ].map((item, i) => (
              <FadeIn key={i} delay={0.2 + (i * 0.1)}>
                <div className="p-8 rounded-[2rem] bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex items-center space-x-6 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-[#FF8A3D] shrink-0">
                    {item.icon}
                  </div>
                  <EditableText id={item.id} as="h4" className="text-lg md:text-xl font-medium text-white/90" />
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.6}>
            <EditableText id="s7_quote" as="h3" className="text-2xl md:text-4xl font-medium tracking-tight text-[#FF8A3D] text-center max-w-4xl mx-auto leading-tight italic" />
          </FadeIn>
        </section>

        {/* --- SLIDE 7: TEAM --- */}
        <section data-slide-key="team" ref={registerSlide("team")} style={{ ...getSlideStyle("team"), display: shouldShowDraftPreview ? "none" : undefined }} className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative">
          <FadeIn>
            <EditableText id="s8_head" as="h2" className="text-5xl md:text-7xl font-semibold tracking-tighter mb-20 text-center" />
          </FadeIn>

          <div className="flex flex-col md:flex-row justify-center items-start gap-12 max-w-4xl mx-auto mb-16 w-full">
            {/* Vegard */}
            <FadeIn delay={0.2} direction="up" className="flex-1 max-w-[340px] mx-auto w-full">
              <div className="flex flex-col text-left group cursor-pointer w-full">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/4.5] bg-white/[0.02] shadow-sm mb-6">
                  <EditableImage id="img_vegard" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0" alt="Vegard" />
                </div>
                
                <EditableText id="s8_n1" as="h4" className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight" />
                <EditableText id="s8_r1" as="p" className="text-sm md:text-base font-medium text-[#FF8A3D]" />
                
                <div className="flex items-center gap-3 my-5 opacity-60">
                  <div className="w-3 h-3 rounded-full border-[1.5px] border-[#FF8A3D] flex items-center justify-center shrink-0">
                      <div className="w-1 h-1 bg-[#FF8A3D] rounded-full"></div>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#FF8A3D]/50 to-transparent"></div>
                </div>

                <EditableText id="s8_b1" as="div" className="text-white/60 text-sm md:text-base leading-relaxed font-medium pr-4" />
              </div>
            </FadeIn>

            {/* Per */}
            <FadeIn delay={0.4} direction="up" className="flex-1 max-w-[340px] mx-auto w-full">
              <div className="flex flex-col text-left group cursor-pointer w-full">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/4.5] bg-white/[0.02] shadow-sm mb-6">
                  <EditableImage id="img_per" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0" alt="Per" />
                </div>
                
                <EditableText id="s8_n2" as="h4" className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight" />
                <EditableText id="s8_r2" as="p" className="text-sm md:text-base font-medium text-[#FF8A3D]" />
                
                <div className="flex items-center gap-3 my-5 opacity-60">
                  <div className="w-3 h-3 rounded-full border-[1.5px] border-[#FF8A3D] flex items-center justify-center shrink-0">
                      <div className="w-1 h-1 bg-[#FF8A3D] rounded-full"></div>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#FF8A3D]/50 to-transparent"></div>
                </div>

                <EditableText id="s8_b2" as="div" className="text-white/60 text-sm md:text-base leading-relaxed font-medium pr-4" />
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <EditableText id="s8_quote" as="p" className="text-xl md:text-2xl font-medium text-center text-white/80 max-w-3xl mx-auto italic" />
          </FadeIn>
        </section>

        {/* --- SLIDE 8: THE ASK --- */}
        <section data-slide-key="ask" ref={registerSlide("ask")} style={{ ...getSlideStyle("ask"), display: shouldShowDraftPreview ? "none" : undefined }} className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8A3D]/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <FadeIn>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] mb-4 uppercase text-center md:text-left opacity-80">The Ask</div>
            <EditableText id="s9_head" as="h2" className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 max-w-4xl text-center md:text-left mx-auto md:mx-0" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FadeIn delay={0.2} direction="up">
               <div className="p-6 md:p-8 rounded-[2rem] bg-white/[0.02] shadow-sm backdrop-blur-sm h-full flex flex-col justify-center text-center md:text-left">
                 <EditableText id="s9_ticket_label" as="div" className="text-xs md:text-sm font-medium text-white/50 mb-2 uppercase tracking-wider" />
                 <EditableText id="s9_ticket_val" as="div" className="text-5xl md:text-6xl font-semibold tracking-tighter text-white" />
               </div>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
               <div className="p-6 md:p-8 rounded-[2rem] bg-[#FF8A3D]/5 shadow-[0_0_30px_rgba(255,138,61,0.05)] backdrop-blur-sm h-full flex flex-col justify-center text-center md:text-left">
                 <EditableText id="s9_val_label" as="div" className="text-xs md:text-sm font-medium text-[#FF8A3D]/70 mb-2 uppercase tracking-wider" />
                 <EditableText id="s9_val_val" as="div" className="text-5xl md:text-6xl font-semibold tracking-tighter text-[#FF8A3D]" />
               </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4} direction="up">
            <div className="p-6 md:p-8 rounded-[2rem] bg-white/[0.01] shadow-sm backdrop-blur-sm mb-6">
              <EditableText id="s9_rm_title" as="div" className="text-lg md:text-xl font-medium text-white/80 mb-6 text-center md:text-left" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                 <div className="absolute top-3 left-10 right-10 h-[1px] bg-white/10 hidden md:block"></div>
                 
                 <div className="relative z-10">
                   <div className="w-6 h-6 rounded-full bg-[#050505] shadow-sm mb-4 mx-auto md:mx-0 flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-white/40"></div>
                   </div>
                   <EditableText id="s9_rm_y0_lbl" as="div" className="text-xs md:text-sm text-white/50 mb-1 text-center md:text-left" />
                   <EditableText id="s9_rm_y0_val" as="div" className="text-2xl md:text-3xl font-medium text-white text-center md:text-left" />
                 </div>

                 <div className="relative z-10">
                   <div className="w-6 h-6 rounded-full bg-[#050505] shadow-sm mb-4 mx-auto md:mx-0 flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-white/40"></div>
                   </div>
                   <EditableText id="s9_rm_y1_lbl" as="div" className="text-xs md:text-sm text-white/50 mb-1 text-center md:text-left" />
                   <EditableText id="s9_rm_y1_val" as="div" className="text-2xl md:text-3xl font-medium text-white text-center md:text-left" />
                 </div>

                 <div className="relative z-10">
                   <div className="w-6 h-6 rounded-full bg-[#050505] mb-4 mx-auto md:mx-0 flex items-center justify-center shadow-[0_0_15px_rgba(255,138,61,0.3)]">
                     <div className="w-2 h-2 rounded-full bg-[#FF8A3D] animate-ping opacity-50"></div>
                     <div className="w-2 h-2 rounded-full bg-[#FF8A3D] absolute"></div>
                   </div>
                   <EditableText id="s9_rm_y3_lbl" as="div" className="text-xs md:text-sm text-[#FF8A3D]/70 mb-1 text-center md:text-left" />
                   <EditableText id="s9_rm_y3_val" as="div" className="text-3xl md:text-4xl font-semibold text-[#FF8A3D] text-center md:text-left" />
                 </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.5} direction="up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pt-6 border-t border-white/5">
              {[content.s9_use_1, content.s9_use_2, content.s9_use_3, content.s9_use_4].map((text, i) => (
                <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-2 p-4 bg-white/[0.01] rounded-xl h-full shadow-sm">
                  <CheckCircle2 size={16} className="text-[#FF8A3D] opacity-80" />
                  <span className="text-xs text-white/70">{text}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <EditableText id="s9_quote" as="h3" className="text-2xl md:text-3xl font-medium tracking-tight text-center max-w-4xl mx-auto italic text-white/80" />
          </FadeIn>
        </section>

        {/* --- SLIDE 9: CLOSING --- */}
        <section data-slide-key="closing" ref={registerSlide("closing")} style={{ ...getSlideStyle("closing"), display: shouldShowDraftPreview ? "none" : undefined }} className="h-[100dvh] flex flex-col justify-center items-center text-center relative px-6 w-full overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none">
            <EditableImage id="img_closing_bg" className="w-full h-full object-cover mix-blend-luminosity" alt="Future City" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center">
            <FadeIn delay={0.2}>
              <img src={LOGO_URL} alt="aiai3D" className="h-40 md:h-56 object-contain mx-auto mb-10" />
            </FadeIn>
            <FadeIn delay={0.4}>
              <EditableText id="s10_sub" as="h2" className="text-3xl md:text-5xl font-semibold tracking-tighter mb-12 leading-tight max-w-3xl" />
            </FadeIn>
            <FadeIn delay={0.6} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href={`mailto:${content.s10_contact_mail}`} className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-sm md:text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
                <EditableText id="s10_contact_mail" as="span" />
              </a>
              <a href={`tel:${content.s10_contact_phone}`} className="inline-block bg-white/10 text-white backdrop-blur-md px-8 py-4 rounded-full font-semibold text-sm md:text-lg hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
                <EditableText id="s10_contact_phone" as="span" />
              </a>
            </FadeIn>
          </div>
        </section>

        {activeCustomSlides.map((slide) => (
          <CustomSlide
            key={slide.id}
            slide={slide}
            order={activeSlideOrder.indexOf(slide.id)}
            registerSlide={registerSlide}
            getSlideStyle={getSlideStyle}
            isEditMode={isEditMode}
            onUpdate={updateCustomSlide}
            hideForDraftPreview={shouldShowDraftPreview}
          />
        ))}
      </div>

      <DeckFooter
        activeView={activeView}
        activeDocumentKey={activeDocumentKey}
        currentSlide={currentSlide}
        totalSlides={activeSlideOrder.length}
        onOpenDocument={openDocument}
        onPrevious={() => scrollToSlide(currentSlide - 2)}
        onNext={() => scrollToSlide(currentSlide)}
        disableSlideControls={activeView === "onePager"}
        showAdminLock={!isEditMode}
        onAdminClick={() => setShowPasswordModal(true)}
      />

      {/* --- FULLSCREEN ONE PAGER MODAL --- */}
      <AnimatePresence>
      {showOnePager && (
        <OnePager
          content={onePagerContent}
          isEditMode={isEditMode}
          onFieldChange={(id, value) => updateContentField("onePager", id, value)}
          onOpenAdmin={() => { setAdminTab("content"); setShowAdminPanel(true); }}
          onOpenDocument={openDocument}
          onAdminClick={() => setShowPasswordModal(true)}
        />
      )}
      </AnimatePresence>

      {/* --- INLINE EDITING SYSTEM --- */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div 
            initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
            className="fixed top-0 left-0 w-full h-16 bg-[#FF8A3D] text-black z-[100] flex items-center justify-between px-4 md:px-8 font-semibold shadow-[0_10px_30px_rgba(255,138,61,0.3)] print:hidden"
          >
            <div className="flex items-center gap-3">
              <Edit3 size={18} className="animate-pulse shrink-0" />
              <span className="tracking-tight text-sm md:text-lg">EDIT MODE ACTIVE</span>
              <span className="font-medium text-sm ml-4 opacity-70 hidden md:inline">Click any text or image to edit.</span>
            </div>
            <div className="flex gap-2 md:gap-4">
              <button onClick={() => { setAdminTab("content"); setShowAdminPanel(true); }} className="px-3 py-1.5 md:px-4 md:py-2 bg-black/10 hover:bg-black/20 rounded-full text-xs md:text-sm transition-colors flex items-center gap-2">
                <ShieldCheck size={14} /> Admin
              </button>
              <button onClick={handleDiscard} className="px-3 py-1.5 md:px-4 md:py-2 bg-black/10 hover:bg-black/20 rounded-full text-xs md:text-sm transition-colors">
                Discard
              </button>
              <button onClick={handleSave} className="px-4 py-1.5 md:px-6 md:py-2 bg-black text-white hover:bg-gray-800 rounded-full text-xs md:text-sm flex items-center gap-2 transition-colors">
                <Save size={14} /> <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md print:hidden">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] rounded-[2rem] p-10 w-full max-w-sm shadow-2xl relative"
            >
              <button onClick={() => { setShowPasswordModal(false); setErrorMsg(""); }} className="absolute top-6 right-6 text-white/40 hover:text-white"><X size={20} /></button>
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 text-[#FF8A3D]">
                <Lock size={20} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Access Edit Mode</h3>
              <p className="text-white/50 text-sm mb-8">Enter the admin password to unlock content, ordering, access and analytics.</p>
              <form onSubmit={handleLogin}>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••" 
                  className="w-full bg-black rounded-xl px-4 py-4 text-center tracking-[0.5em] text-xl font-medium outline-none focus:ring-1 focus:ring-[#FF8A3D] transition-all mb-4"
                  autoFocus
                />
                {errorMsg && <p className="text-red-400 text-sm mb-4 text-center">{errorMsg}</p>}
                <button type="submit" className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  Unlock
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Pitch Deck Gate */}
      <AnimatePresence>
        {showPitchGate && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md print:hidden">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] rounded-[2rem] p-10 w-full max-w-sm shadow-2xl relative"
            >
              <button onClick={() => { setShowPitchGate(false); setErrorMsg(""); }} className="absolute top-6 right-6 text-white/40 hover:text-white"><X size={20} /></button>
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 text-[#FF8A3D]">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Pitch Deck Access</h3>
              <p className="text-white/50 text-sm mb-8">Enter the investor email and password set by the admin.</p>
              <form onSubmit={handlePitchLogin} className="space-y-4">
                <input 
                  type="email" 
                  value={pitchLogin.email}
                  onChange={(e) => setPitchLogin(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email" 
                  className="w-full bg-black rounded-xl px-4 py-4 text-sm font-medium outline-none focus:ring-1 focus:ring-[#FF8A3D] transition-all"
                  autoFocus
                />
                <input 
                  type="password" 
                  value={pitchLogin.password}
                  onChange={(e) => setPitchLogin(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Password" 
                  className="w-full bg-black rounded-xl px-4 py-4 text-sm font-medium outline-none focus:ring-1 focus:ring-[#FF8A3D] transition-all"
                />
                {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
                <button type="submit" className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  Unlock Pitch Deck
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {renderAdminPanel()}


    </div>
  );
}
