import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  Save,
  X,
  Edit3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Box,
  Layers,
  Zap,
  Cpu,
  Network,
  Image as ImageIcon,
  Clock,
  Sparkles,
  ShieldCheck,
  Users,
  FileText,
  Printer,
  ArrowRight,
} from "lucide-react";

const SECRET_PASSWORD = "472918";
const TOTAL_SLIDES = 9;

// --- Brand & Constants ---
const BRAND = {
  sunsetOrange: "#FF8A3D",
  softCopper: "#C98C6C",
  amberGlow: "#FFB068",
};
const LOGO_URL =
  "https://static.wixstatic.com/media/3069e0_a8673a14d1914bb995df7c95de94ca65~mv2.png/v1/fill/w_238,h_238,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/aiai3D-RGB.png";

// --- Initial Content Data ---
const defaultContent = {
  // Slide 1: Hero
  s1_head: "aiai3D",
  s1_sub: "The trusted infrastructure layer for\narchitectural AI.",
  s1_sec: "Secure AI generated visualizations directly from IFC/BIM data.",

  // Slide 2: Problem
  s2_head: "Architectural visualization is broken",
  s2_l_head: "Traditional Workflow",
  s2_l_body:
    "Manual rebuilding. Expensive revisions. Weeks of production. Fragmented workflows and severe bottlenecks.",
  s2_r_head: "Current AI Tools Fail",
  s2_r_body:
    "Hallucinated geometry. Broken layouts. Incorrect dimensions. Unreliable output that cannot be trusted commercially.",
  s2_quote: "“Beautiful images are useless if they are wrong.”",

  // Slide 3: Breakthrough
  s3_head: "aiai3D solves the hardest problem in the industry",
  s3_p1: "Geometry accuracy",
  s3_p2: "AI enhanced realism",
  s3_p3: "Scalable automation",
  s3_quote:
    "“We believe we are the first company capable of combining AI generation with BIM safe rendering.”",

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
  s5_exp_sub:
    "Digital twins, AI infrastructure and intelligent building environments",
  s5_quote1:
    "“Every building project in the world will require AI generated visualization, simulation and digital representation.”",
  s5_quote2: "“aiai3D is positioned where BIM, AI and digital twins converge.”",

  // Slide 5: Why Others Fail
  s6_head_p1: "The industry problem is not\nrendering quality. ",
  s6_head_p2: "It is trust.",
  s6_l_head: "Traditional AI",
  s6_l_body:
    "Hallucinates geometry\nFake windows\nBroken layouts\nInconsistent output",
  s6_r_head: "aiai3D",
  s6_r_body:
    "IFC/BIM constrained\nGeometry aware\nCommercially reliable\nStructure preserving",
  s6_quote:
    "“Architectural AI only becomes useful when it becomes trustworthy.”",

  // Slide 6: Defensibility
  s7_head: "Why aiai3D wins",
  s7_p1: "IFC/BIM expertise",
  s7_p2: "Proprietary geometry safe rendering pipelines",
  s7_p3: "Founder market fit",
  s7_p4: "Infrastructure positioning",
  s7_quote:
    "“This is not an AI wrapper.\nThis is infrastructure for the future of architectural visualization.”",

  // Slide 7: Team
  s8_head: "Built by industry insiders",
  s8_n1: "Vegard Rossi Westergård",
  s8_r1: "Founder/CEO",
  s8_b1:
    "Background from several 3D visualization providers, as well as experience as a client working with marketing in one of the largest developers in the Nordics.",
  s8_n2: "Per Hjaldahl",
  s8_r2: "Founding CTO",
  s8_b2:
    "Tech enthusiast, serial entrepreneur, and former co-founder of a Swedish 3D visualization agency, with strong technical and visual expertise.",
  s8_quote:
    "“The team combines BIM expertise, visualization experience and AI product execution.”",

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
  s9_quote:
    "“We are raising capital to accelerate our proprietary geometry parser and scale GTM.”",

  // Slide 9: Closing
  s10_sub: "We are building the trust layer for architectural AI.",
  s10_contact_mail: "vw@aiai3d.io",
  s10_contact_phone: "+47 976 76 358",

  // Images
  img_hero_bg:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400",
  img_market_bg:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2400",
  img_closing_bg:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=2400",
  img_vegard:
    "https://static.wixstatic.com/media/3069e0_85f4fad5791e402a926141f47bc57100~mv2.jpg/v1/fill/w_612,h_630,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7261_black_white_web.jpg",
  img_per:
    "https://static.wixstatic.com/media/3069e0_5c530b43ab27405abb751d90836eba2e~mv2.jpg/v1/crop/x_14,y_0,w_461,h_475/fill/w_553,h_569,al_c,lg_1,q_80,enc_avif,quality_auto/profilbild%20Per.jpg",
};

// --- Helper Components ---
const FadeIn = ({ children, delay = 0, className = "", direction = "up" }) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W, H;
    let particles = [];
    let animationFrameId;
    const RGB = "255, 138, 61";

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
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
        if (speed > 0.32) {
          this.vx = (this.vx / speed) * 0.32;
          this.vy = (this.vy / speed) * 0.32;
        }

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

      particles.forEach((p) => p.update());
      particles.forEach((p) => {
        p.fillAlpha *= 0.94;
      });

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const maxD = 150;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxD) {
            const baseOp = 0.13;
            const distFactor = 1 - dist / maxD;
            const activeLevel = Math.max(p1.fillAlpha, p2.fillAlpha);
            const lineAlpha =
              baseOp * distFactor + activeLevel * distFactor * 0.5;

            if (lineAlpha > 0.01) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${RGB}, ${lineAlpha})`;
              ctx.lineWidth = 1 + activeLevel * 1.5;
              ctx.stroke();

              if (lineAlpha > 0.1) {
                const pairSeed = i * 100 + j;
                const pSpeedMult = 0.7;
                const netPulseSpeed = 0.0008 * pSpeedMult;
                const t = (Date.now() * netPulseSpeed + pairSeed) % 3;
                if (t <= 1) {
                  const pulseWidth = 0.3;
                  const pStart = Math.max(0, t - pulseWidth / 2);
                  const pEnd = Math.min(1, t + pulseWidth / 2);
                  const pxStart = p1.x - dx * pStart;
                  const pyStart = p1.y - dy * pStart;
                  const pxEnd = p1.x - dx * pEnd;
                  const pyEnd = p1.y - dy * pEnd;
                  const grad = ctx.createLinearGradient(
                    pxStart,
                    pyStart,
                    pxEnd,
                    pyEnd,
                  );
                  grad.addColorStop(0, `rgba(${RGB}, 0)`);
                  grad.addColorStop(0.5, `rgba(${RGB}, ${lineAlpha * 2.5})`);
                  grad.addColorStop(1, `rgba(${RGB}, 0)`);
                  ctx.beginPath();
                  ctx.moveTo(pxStart, pyStart);
                  ctx.lineTo(pxEnd, pyEnd);
                  ctx.strokeStyle = grad;
                  ctx.lineWidth = 1.5 + lineAlpha * 2.5;
                  ctx.lineCap = "round";
                  ctx.stroke();
                  ctx.lineCap = "butt";
                }
              }
            }
          }
        }
      }

      particles.forEach((p) => {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distM = Math.sqrt(dx * dx + dy * dy);
        const mRad = 360;

        if (distM < mRad) {
          const lineAlpha = (1 - distM / mRad) * 0.13;
          ctx.beginPath();
          ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${RGB}, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          const pSpeedMult = 0.7;
          const pulseSpeed = 0.0015 * pSpeedMult;
          const pulseT = (Date.now() * pulseSpeed + p.pulseOffset) % 1;
          const pIntensity = 0;

          if (pIntensity > 0) {
            const pulseWidth = 0.25;
            const pStart = Math.max(0, pulseT - pulseWidth / 2);
            const pEnd = Math.min(1, pulseT + pulseWidth / 2);
            const pxStart = mouseRef.current.x + dx * pStart;
            const pyStart = mouseRef.current.y + dy * pStart;
            const pxEnd = mouseRef.current.x + dx * pEnd;
            const pyEnd = mouseRef.current.y + dy * pEnd;
            const pulseAlpha = Math.sin(pulseT * Math.PI) * pIntensity * 1.5;

            if (pulseAlpha > 0.01) {
              const grad = ctx.createLinearGradient(
                pxStart,
                pyStart,
                pxEnd,
                pyEnd,
              );
              grad.addColorStop(0, `rgba(${RGB}, 0)`);
              grad.addColorStop(0.5, `rgba(255, 230, 200, ${pulseAlpha})`);
              grad.addColorStop(1, `rgba(${RGB}, 0)`);
              ctx.beginPath();
              ctx.moveTo(pxStart, pyStart);
              ctx.lineTo(pxEnd, pyEnd);
              ctx.strokeStyle = grad;
              ctx.lineWidth = 3 + pIntensity * 3;
              ctx.lineCap = "round";
              ctx.shadowBlur = 12 * pIntensity;
              ctx.shadowColor = `rgba(${RGB}, 1)`;
              ctx.stroke();
              ctx.lineCap = "butt";
              ctx.shadowBlur = 0;
            }
          }
          if (pulseT > 0.85 && pulseT < 0.95)
            p.fillAlpha = Math.min(1, p.fillAlpha + 0.2);
        }
      });

      particles.forEach((p) => {
        const baseOp = 0.13;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RGB}, ${baseOp * 2})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (p.fillAlpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size - 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${RGB}, ${p.fillAlpha})`;
          ctx.shadowBlur = p.fillAlpha * 12;
          ctx.shadowColor = `rgba(${RGB}, 1)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-100 mix-blend-screen"
    />
  );
};

// --- FULLSCREEN ONE PAGER MODAL ---
const OnePager = ({ content, onClose, isEditMode, setContent }) => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page { margin: 0; size: auto; }
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: #050505 !important; }
        ::-webkit-scrollbar { display: none; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Internal EditableText for the modal
  const ModalEditableText = ({
    id,
    as: Tag = "div",
    className = "",
    style = {},
  }) => {
    const handleBlur = (e) => {
      setContent((prev) => ({ ...prev, [id]: e.target.innerText }));
    };
    return (
      <Tag
        contentEditable={isEditMode}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        className={`${className} ${isEditMode ? "outline-none ring-2 ring-dashed ring-white/30 bg-white/5 rounded px-2 hover:bg-white/10 transition-colors" : "outline-none whitespace-pre-wrap"}`}
        style={{ cursor: isEditMode ? "text" : "inherit", ...style }}
      >
        {content[id]}
      </Tag>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] overflow-y-auto text-white p-4 md:p-12 font-manrope selection:bg-[#FF8A3D] selection:text-black">
      <div className="max-w-5xl mx-auto bg-[#0a0a0a] rounded-[2rem] p-8 md:p-16 shadow-2xl print:p-8 print:shadow-none print:bg-[#0a0a0a] border border-white/5">
        {/* Controls (Hidden on Print) */}
        <div className="flex justify-between items-center mb-16 print:hidden">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} /> Back to Deck
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#FF8A3D] text-black px-6 py-2.5 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,138,61,0.3)]"
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>

        {/* --- ONE PAGER CONTENT --- */}
        <div className="space-y-20">
          {/* Header */}
          <header className="pb-12 flex flex-col md:flex-row gap-8 justify-between items-center md:items-start border-b border-white/10">
            <div className="max-w-2xl flex flex-col items-start w-full">
              <img
                src={LOGO_URL}
                alt="aiai3D"
                className="h-20 md:h-28 w-auto object-contain object-left mb-8"
              />
              <h2 className="text-2xl font-medium mb-3 text-white/90 leading-tight whitespace-pre-wrap text-center md:text-left">
                {content.s1_sub}
              </h2>
              <p className="text-white/50 text-center md:text-left">
                {content.s1_sec}
              </p>
            </div>
            <div className="shrink-0 text-center md:text-right w-full md:w-auto mt-4 md:mt-0">
              <div className="text-xs font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-2">
                Investor Confidential
              </div>
              <p className="text-sm text-white/50">
                {new Date().getFullYear()} Executive Summary
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Left Column */}
            <div className="space-y-16">
              {/* Problem */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">
                  The Problem
                </h3>
                <h4 className="text-xl font-medium tracking-tight mb-4">
                  {content.s2_head}
                </h4>
                <div className="space-y-4 text-sm text-white/60 leading-relaxed">
                  <p>
                    <strong className="text-white/90 font-medium">
                      Traditional:
                    </strong>{" "}
                    {content.s2_l_body}
                  </p>
                  <p>
                    <strong className="text-white/90 font-medium">
                      Current AI:
                    </strong>{" "}
                    {content.s2_r_body}
                  </p>
                </div>
              </section>

              {/* Breakthrough */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">
                  The Breakthrough
                </h3>
                <p className="text-lg font-medium text-white/90 leading-snug mb-6">
                  {content.s3_quote.replace(/[“”]/g, "")}
                </p>
                <ul className="space-y-2">
                  {[content.s3_p1, content.s3_p2, content.s3_p3].map(
                    (item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm text-white/70 bg-white/[0.02] p-3 rounded-xl shadow-sm border border-white/5"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-[#FF8A3D] shrink-0 opacity-80"
                        />{" "}
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </section>

              {/* Defensibility / Moat */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">
                  Why aiai3D Wins
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    content.s7_p1,
                    content.s7_p2,
                    content.s7_p3,
                    content.s7_p4,
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#0a0a0a] border border-white/10 shadow-[inset_0_0_15px_rgba(255,138,61,0.02)] p-4 rounded-xl flex flex-col justify-center text-center items-center"
                    >
                      <span className="text-xs font-medium text-white/80">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-16">
              {/* Market */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">
                  Market Opportunity
                </h3>
                <div className="mb-6">
                  <div className="text-3xl font-bold tracking-tight text-white mb-1">
                    {content.s5_core_val.split(" ")[0]}
                  </div>
                  <div className="text-sm font-medium text-[#FF8A3D] mb-1">
                    Core Market
                  </div>
                  <p className="text-xs text-white/50">{content.s5_core_sub}</p>
                </div>
                <div className="mb-8 bg-[#0a0a0a] border border-[#FF8A3D]/20 shadow-[inset_0_0_30px_rgba(255,138,61,0.05)] p-6 rounded-2xl relative overflow-hidden">
                  <div className="text-3xl font-bold tracking-tight text-[#FF8A3D] mb-1 relative z-10">
                    {content.s5_exp_val.split(" ")[0]}
                  </div>
                  <div className="text-sm font-medium text-white/90 mb-1 relative z-10">
                    Expansion Opportunity
                  </div>
                  <p className="text-xs text-[#FF8A3D]/70 relative z-10">
                    {content.s5_exp_sub}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-xs">
                    <span className="block text-white/90 font-medium">
                      {content.s5_c1_t}
                    </span>
                    <span className="text-white/50">{content.s5_c1_v}</span>
                  </div>
                  <div className="text-xs">
                    <span className="block text-white/90 font-medium">
                      {content.s5_c2_t}
                    </span>
                    <span className="text-white/50">{content.s5_c2_v}</span>
                  </div>
                </div>
              </section>

              {/* Team */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">
                  Founding Team
                </h3>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-5 items-center">
                    <img
                      src={content.img_vegard}
                      alt="Vegard"
                      className="w-14 h-14 rounded-full object-cover grayscale opacity-90 shadow-lg border border-white/10 shrink-0"
                    />
                    <div>
                      <div className="text-sm font-bold text-white/90">
                        {content.s8_n1}{" "}
                        <span className="font-normal text-[#FF8A3D] ml-1">
                          {content.s8_r1}
                        </span>
                      </div>
                      <div className="text-xs text-white/50">
                        {content.s8_b1}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-5 items-center">
                    <img
                      src={content.img_per}
                      alt="Per"
                      className="w-14 h-14 rounded-full object-cover grayscale opacity-90 shadow-lg border border-white/10 shrink-0"
                    />
                    <div>
                      <div className="text-sm font-bold text-white/90">
                        {content.s8_n2}{" "}
                        <span className="font-normal text-[#FF8A3D] ml-1">
                          {content.s8_r2}
                        </span>
                      </div>
                      <div className="text-xs text-white/50">
                        {content.s8_b2}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Backed By */}
              <section>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-6 opacity-80 border-b border-white/10 pb-2">
                  Trusted & Funded By
                </h3>
                <div className="bg-[#0a0a0a] border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)] p-5 rounded-2xl flex items-center gap-5">
                  <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-md overflow-hidden p-1 shrink-0">
                    <div className="bg-white/10 text-white/90 font-extrabold text-xl px-2 py-1.5 leading-none rounded-sm tracking-tighter">
                      .V
                    </div>
                    <div className="text-[9px] text-white/70 font-bold text-left leading-tight ml-2 pr-2 uppercase tracking-wider">
                      Innovation
                      <br />
                      Norway
                    </div>
                  </div>
                  <div>
                    <ModalEditableText
                      id="s8_backed_title"
                      className="text-sm font-medium text-white/90"
                    />
                    <ModalEditableText
                      id="s8_backed_desc"
                      className="text-xs text-white/50 mt-0.5"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Full Width Bottom: The Ask & Upside */}
          <section className="mt-16 pt-12 border-t border-white/5 bg-white/[0.01] p-8 md:p-12 rounded-[2rem]">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] uppercase mb-10 text-center opacity-80">
              The Ask & Execution
            </h3>

            <div className="flex flex-col md:flex-row justify-center gap-12 items-center text-center mb-12">
              <div>
                <div className="text-xs text-white/50 uppercase tracking-widest mb-1">
                  {content.s9_ticket_label}
                </div>
                <div className="text-4xl font-bold text-white tracking-tight">
                  {content.s9_ticket_val}
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-xs text-[#FF8A3D]/70 uppercase tracking-widest mb-1">
                  {content.s9_val_label}
                </div>
                <div className="text-4xl font-bold text-[#FF8A3D] tracking-tight">
                  {content.s9_val_val}
                </div>
              </div>
            </div>

            {/* Investor Upside */}
            <div className="max-w-3xl mx-auto mb-12">
              <h4 className="text-[10px] text-white/50 uppercase tracking-widest mb-4 text-center">
                Infrastructure Positioning Target
              </h4>
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 px-6 rounded-2xl shadow-sm mb-4">
                <div className="text-center">
                  <div className="text-xs text-white/40 mb-1">
                    {content.s9_rm_y0_lbl}
                  </div>
                  <div className="text-xl font-medium">
                    {content.s9_rm_y0_val}
                  </div>
                </div>
                <div className="text-white/20">
                  <ChevronRight size={16} />
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/40 mb-1">
                    {content.s9_rm_y1_lbl}
                  </div>
                  <div className="text-xl font-medium">
                    {content.s9_rm_y1_val}
                  </div>
                </div>
                <div className="text-white/20">
                  <ChevronRight size={16} />
                </div>
                <div className="text-center">
                  <div className="text-xs text-[#FF8A3D]/70 mb-1">
                    {content.s9_rm_y3_lbl}
                  </div>
                  <div className="text-2xl font-bold text-[#FF8A3D] drop-shadow-[0_0_10px_rgba(255,138,61,0.4)]">
                    {content.s9_rm_y3_val}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#FF8A3D]/90">
                  Potential 12.5x strategic value creation scenario
                </p>
                <p className="text-[9px] text-white/30 mt-1 uppercase tracking-wider">
                  Illustrative strategic positioning. Not financial guidance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/5">
              {[
                "Accelerate proprietary geometry parser",
                "Scale GTM",
                "Secure technical leadership",
                "Build early customer pilots",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <CheckCircle2
                    size={14}
                    className="text-[#FF8A3D] opacity-60"
                  />
                  <span className="text-xs text-white/60">{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-white/10 flex justify-between items-center text-xs text-white/40">
            <div
              className="text-sm tracking-tight"
              style={{
                fontFamily: "'Noto Serif', serif",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: BRAND.sunsetOrange,
              }}
            >
              aiai3D
            </div>
            <div className="flex gap-4">
              <span>{content.s10_contact_mail}</span>
              <span>{content.s10_contact_phone}</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP (PITCH DECK) ---
export default function App() {
  const [content, setContent] = useState(defaultContent);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Navigation State
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showOnePager, setShowOnePager] = useState(false);
  const slideRefs = useRef([]);
  const containerRef = useRef(null);

  // Load saved content on mount
  useEffect(() => {
    // Add Google Font for Noto Serif Black
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Serif:wght@900&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    const saved = localStorage.getItem("aiai3d-pitch-content");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContent((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Could not parse local content");
      }
    }

    return () => {
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
    };
  }, []);

  // Intersection Observer for Slide Tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.findIndex(
              (ref) => ref === entry.target,
            );
            if (idx !== -1) setCurrentSlide(idx + 1);
          }
        });
      },
      { threshold: 0.5 },
    );

    slideRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showPasswordModal || isEditMode || showOnePager) return;
      if (e.key === "ArrowRight" && currentSlide < TOTAL_SLIDES)
        scrollToSlide(currentSlide);
      if (e.key === "ArrowLeft" && currentSlide > 1)
        scrollToSlide(currentSlide - 2);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, showPasswordModal, isEditMode, showOnePager]);

  const scrollToSlide = (index) => {
    if (index >= 0 && index < TOTAL_SLIDES && slideRefs.current[index]) {
      slideRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleSave = () => {
    localStorage.setItem("aiai3d-pitch-content", JSON.stringify(content));
    setIsEditMode(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === SECRET_PASSWORD) {
      setIsEditMode(true);
      setShowPasswordModal(false);
      setPasswordInput("");
      setErrorMsg("");
    } else {
      setErrorMsg("Incorrect password.");
    }
  };

  // Inline Editable Components
  const EditableText = ({
    id,
    as: Tag = "div",
    className = "",
    style = {},
  }) => {
    const handleBlur = (e) => {
      setContent((prev) => ({ ...prev, [id]: e.target.innerText }));
    };
    return (
      <Tag
        contentEditable={isEditMode}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        className={`${className} ${isEditMode ? "outline-none ring-2 ring-dashed ring-white/30 bg-white/5 rounded px-2 hover:bg-white/10 transition-colors" : "outline-none whitespace-pre-wrap"}`}
        style={{ cursor: isEditMode ? "text" : "inherit", ...style }}
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
        setContent((prev) => ({ ...prev, [id]: newUrl }));
      }
    };
    return (
      <div
        className={`relative ${isEditMode ? "cursor-pointer group" : ""}`}
        onClick={handleClick}
      >
        <img src={content[id]} alt={alt} className={className} />
        {isEditMode && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[inherit] ring-2 ring-dashed ring-white/50">
            <ImageIcon className="text-white" size={32} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#050505] text-white h-screen overflow-hidden font-manrope selection:bg-[#FF8A3D] selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <MeshBackground />
        <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#FF8A3D]/5 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 md:p-8 flex justify-between items-center z-40 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none">
        <div
          className="text-xl md:text-2xl tracking-tight text-white"
          style={{
            fontFamily: "'Noto Serif', serif",
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
        >
          aiai3D
        </div>
        <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
          Investor Confidential
        </div>
      </nav>

      {/* Main Content Wrapper (Normal Scrolling without Snap) */}
      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-auto scroll-smooth relative z-10 pb-20"
      >
        {/* --- SLIDE 1: HERO --- */}
        <section
          ref={(el) => (slideRefs.current[0] = el)}
          className="min-h-[100dvh] flex flex-col justify-center items-center text-center relative px-6 w-full overflow-hidden"
        >
          <div className="absolute inset-0 z-0 opacity-40 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] pointer-events-none">
            <EditableImage
              id="img_hero_bg"
              className="w-full h-full object-cover grayscale mix-blend-luminosity"
              alt="Architecture"
            />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
            <FadeIn delay={0.2}>
              <EditableText
                id="s1_head"
                as="h1"
                className="text-[11vw] md:text-9xl tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 leading-none py-2"
                style={{
                  fontFamily: "'Noto Serif', serif",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                }}
              />
            </FadeIn>
            <FadeIn delay={0.4}>
              <EditableText
                id="s1_sub"
                as="p"
                className="text-2xl md:text-4xl font-medium tracking-tight text-[#FF8A3D] mb-8 max-w-3xl leading-tight"
              />
            </FadeIn>
            <FadeIn delay={0.6}>
              <EditableText
                id="s1_sec"
                as="p"
                className="text-lg md:text-xl font-medium text-white/50 max-w-2xl"
              />
            </FadeIn>
          </div>
        </section>

        {/* --- SLIDE 2: THE PROBLEM --- */}
        <section
          ref={(el) => (slideRefs.current[1] = el)}
          className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative"
        >
          <FadeIn>
            <EditableText
              id="s2_head"
              as="h2"
              className="text-5xl md:text-7xl font-semibold tracking-tighter mb-16 text-center"
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-16">
            <FadeIn direction="right" delay={0.2}>
              <div className="p-8 md:p-10 rounded-[2rem] bg-white/[0.02] shadow-sm backdrop-blur-sm relative overflow-hidden group h-full">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Clock size={120} />
                </div>
                <h3 className="text-2xl md:text-3xl font-medium mb-6 text-white/80 border-b border-white/10 pb-6">
                  <EditableText id="s2_l_head" />
                </h3>
                <EditableText
                  id="s2_l_body"
                  as="p"
                  className="text-lg md:text-xl text-white/50 leading-relaxed"
                />
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.4}>
              <div className="p-8 md:p-10 rounded-[2rem] bg-red-500/[0.02] shadow-sm backdrop-blur-sm relative overflow-hidden group h-full">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-red-500">
                  <AlertTriangle size={120} />
                </div>
                <h3 className="text-2xl md:text-3xl font-medium mb-6 text-red-400 border-b border-red-500/20 pb-6">
                  <EditableText id="s2_r_head" />
                </h3>
                <EditableText
                  id="s2_r_body"
                  as="p"
                  className="text-lg md:text-xl text-white/50 leading-relaxed"
                />
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <EditableText
              id="s2_quote"
              as="h3"
              className="text-2xl md:text-4xl font-medium tracking-tight text-center text-[#FF8A3D] max-w-4xl mx-auto italic"
            />
          </FadeIn>
        </section>

        {/* --- SLIDE 3: THE BREAKTHROUGH --- */}
        <section
          ref={(el) => (slideRefs.current[2] = el)}
          className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative"
        >
          <FadeIn className="text-center">
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] mb-4 uppercase opacity-80">
              The Breakthrough
            </div>
            <EditableText
              id="s3_head"
              as="h2"
              className="text-5xl md:text-7xl font-semibold tracking-tighter mb-12 max-w-4xl mx-auto"
            />
          </FadeIn>

          {/* Validation/Lock Symbolism */}
          <FadeIn delay={0.2}>
            <div className="flex justify-center mb-16 relative">
              <div className="absolute inset-0 bg-[#FF8A3D]/20 blur-[60px] rounded-full w-32 h-32 mx-auto"></div>
              <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] backdrop-blur-md flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(255,138,61,0.1)]">
                <Box
                  className="text-[#FF8A3D] absolute animate-[spin_10s_linear_infinite]"
                  size={72}
                  strokeWidth={1}
                />
                <div className="w-12 h-12 bg-[#050505] rounded-full flex items-center justify-center relative z-10 shadow-lg">
                  <Lock className="text-white" size={18} />
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative">
            <div className="absolute top-1/2 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block"></div>
            {[
              { id: "s3_p1", icon: <Box size={24} />, num: "01" },
              { id: "s3_p2", icon: <Sparkles size={24} />, num: "02" },
              { id: "s3_p3", icon: <Layers size={24} />, num: "03" },
            ].map((col, i) => (
              <FadeIn
                key={i}
                delay={0.3 + i * 0.1}
                direction="up"
                className="relative z-10"
              >
                <div className="h-full flex flex-col p-8 rounded-[2rem] bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                  <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/5">
                    <div className="text-[#FF8A3D] opacity-80">{col.icon}</div>
                    <div className="text-xl font-light text-white/20">
                      {col.num}
                    </div>
                  </div>
                  <EditableText
                    id={col.id}
                    as="h4"
                    className="text-xl font-medium text-white/90"
                  />
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.6}>
            <div className="p-8 md:p-12 rounded-[2rem] bg-white/[0.01] text-center shadow-sm">
              <EditableText
                id="s3_quote"
                as="h3"
                className="text-2xl md:text-3xl font-medium tracking-tight leading-snug text-white/80 italic"
              />
            </div>
          </FadeIn>
        </section>

        {/* --- SLIDE 4: MARKET OPPORTUNITY --- */}
        <section
          ref={(el) => (slideRefs.current[3] = el)}
          className="min-h-[100dvh] flex flex-col justify-center items-center text-center px-6 relative w-full overflow-hidden"
        >
          <div className="absolute inset-0 z-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none">
            <EditableImage
              id="img_market_bg"
              className="w-full h-full object-cover mix-blend-screen grayscale"
              alt="Global Network"
            />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center h-full">
            <FadeIn>
              <EditableText
                id="s5_head"
                as="h2"
                className="text-4xl md:text-6xl font-semibold tracking-tighter mb-10 max-w-5xl mx-auto"
              />
            </FadeIn>

            <FadeIn delay={0.2} direction="up">
              <div className="mb-8 text-center">
                <EditableText
                  id="s5_core_val"
                  as="h3"
                  className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2 drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                />
                <EditableText
                  id="s5_core_sub"
                  as="p"
                  className="text-lg md:text-xl font-medium text-white/50"
                />
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-5xl mx-auto w-full">
              {[
                { t: "s5_c1_t", v: "s5_c1_v" },
                { t: "s5_c2_t", v: "s5_c2_v" },
                { t: "s5_c3_t", v: "s5_c3_v" },
                { t: "s5_c4_t", v: "s5_c4_v", highlight: true },
              ].map((card, i) => (
                <FadeIn key={i} delay={0.3 + i * 0.1}>
                  <div
                    className={`p-6 rounded-3xl backdrop-blur-md flex flex-col justify-center items-center h-28 transition-transform hover:-translate-y-1 ${card.highlight ? "bg-[#FF8A3D]/10 shadow-[0_0_40px_rgba(255,138,61,0.15)]" : "bg-white/[0.02]"}`}
                  >
                    <EditableText
                      id={card.t}
                      as="div"
                      className="text-[10px] md:text-xs font-medium text-white/50 mb-2 uppercase tracking-wider text-center"
                    />
                    <EditableText
                      id={card.v}
                      as="div"
                      className={`text-lg md:text-xl font-semibold tracking-tight text-center leading-tight ${card.highlight ? "text-[#FF8A3D]" : "text-white/80"}`}
                    />
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.7} direction="up">
              <div className="mb-10 p-8 md:p-10 rounded-[2rem] bg-gradient-to-b from-[#FF8A3D]/10 to-transparent relative max-w-4xl mx-auto text-center shadow-sm">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#FF8A3D] to-transparent"></div>
                <EditableText
                  id="s5_exp_val"
                  as="h3"
                  className="text-4xl md:text-6xl font-bold tracking-tighter text-[#FF8A3D] mb-2"
                />
                <EditableText
                  id="s5_exp_sub"
                  as="p"
                  className="text-base md:text-lg font-medium text-[#FF8A3D]/60"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.9}>
              <div className="max-w-4xl mx-auto">
                <EditableText
                  id="s5_quote1"
                  as="h3"
                  className="text-2xl md:text-3xl font-medium tracking-tight leading-tight mb-4"
                />
                <EditableText
                  id="s5_quote2"
                  as="p"
                  className="text-lg md:text-xl text-[#FF8A3D] font-medium"
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* --- SLIDE 5: WHY OTHERS FAIL --- */}
        <section
          ref={(el) => (slideRefs.current[4] = el)}
          className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative"
        >
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-20 text-center md:text-left leading-tight whitespace-pre-wrap">
              <EditableText
                id="s6_head_p1"
                as="span"
                className="block md:inline"
              />
              <EditableText
                id="s6_head_p2"
                as="span"
                className="text-[#FF8A3D]"
              />
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block"></div>

            <FadeIn direction="right" delay={0.2}>
              <div className="pr-0 md:pr-12 bg-white/[0.01] p-8 rounded-[2rem] shadow-sm md:bg-transparent md:p-0 md:shadow-none">
                <div className="flex items-center space-x-4 mb-8 text-white/40">
                  <Cpu size={24} />
                  <EditableText
                    id="s6_l_head"
                    as="h3"
                    className="text-2xl md:text-3xl font-medium"
                  />
                </div>
                <EditableText
                  id="s6_l_body"
                  as="div"
                  className="text-lg md:text-xl text-white/40 space-y-4 leading-relaxed"
                />
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.4}>
              <div className="pl-0 md:pl-12 bg-[#FF8A3D]/5 p-8 rounded-[2rem] shadow-sm md:bg-transparent md:p-0 md:shadow-none">
                <div className="flex items-center space-x-4 mb-8 text-[#FF8A3D]">
                  <Building2 size={24} />
                  <EditableText
                    id="s6_r_head"
                    as="h3"
                    className="text-2xl md:text-3xl font-medium"
                  />
                </div>
                <EditableText
                  id="s6_r_body"
                  as="div"
                  className="text-lg md:text-xl text-white/90 space-y-4 leading-relaxed font-medium"
                />
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <div className="text-center">
              <EditableText
                id="s6_quote"
                as="h3"
                className="text-2xl md:text-4xl font-medium tracking-tight max-w-4xl mx-auto italic text-white/80"
              />
            </div>
          </FadeIn>
        </section>

        {/* --- SLIDE 6: DEFENSIBILITY --- */}
        <section
          ref={(el) => (slideRefs.current[5] = el)}
          className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative"
        >
          <FadeIn>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] mb-4 uppercase text-center md:text-left opacity-80">
              Moat
            </div>
            <EditableText
              id="s7_head"
              as="h2"
              className="text-5xl md:text-7xl font-semibold tracking-tighter mb-16 text-center md:text-left"
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24">
            {[
              { id: "s7_p1", icon: <Layers size={24} /> },
              { id: "s7_p2", icon: <ShieldCheck size={24} /> },
              { id: "s7_p3", icon: <Users size={24} /> },
              { id: "s7_p4", icon: <Zap size={24} /> },
            ].map((item, i) => (
              <FadeIn key={i} delay={0.2 + i * 0.1}>
                <div className="p-8 rounded-[2rem] bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex items-center space-x-6 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-[#FF8A3D] shrink-0">
                    {item.icon}
                  </div>
                  <EditableText
                    id={item.id}
                    as="h4"
                    className="text-lg md:text-xl font-medium text-white/90"
                  />
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.6}>
            <EditableText
              id="s7_quote"
              as="h3"
              className="text-2xl md:text-4xl font-medium tracking-tight text-[#FF8A3D] text-center max-w-4xl mx-auto leading-tight italic"
            />
          </FadeIn>
        </section>

        {/* --- SLIDE 7: TEAM --- */}
        <section
          ref={(el) => (slideRefs.current[6] = el)}
          className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative"
        >
          <FadeIn>
            <EditableText
              id="s8_head"
              as="h2"
              className="text-5xl md:text-7xl font-semibold tracking-tighter mb-20 text-center"
            />
          </FadeIn>

          <div className="flex flex-col md:flex-row justify-center items-start gap-12 max-w-4xl mx-auto mb-16 w-full">
            {/* Vegard */}
            <FadeIn
              delay={0.2}
              direction="up"
              className="flex-1 max-w-[340px] mx-auto w-full"
            >
              <div className="flex flex-col text-left group cursor-pointer w-full">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/4.5] bg-white/[0.02] shadow-sm mb-6">
                  <EditableImage
                    id="img_vegard"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    alt="Vegard"
                  />
                </div>

                <EditableText
                  id="s8_n1"
                  as="h4"
                  className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight"
                />
                <EditableText
                  id="s8_r1"
                  as="p"
                  className="text-sm md:text-base font-medium text-[#FF8A3D]"
                />

                <div className="flex items-center gap-3 my-5 opacity-60">
                  <div className="w-3 h-3 rounded-full border-[1.5px] border-[#FF8A3D] flex items-center justify-center shrink-0">
                    <div className="w-1 h-1 bg-[#FF8A3D] rounded-full"></div>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#FF8A3D]/50 to-transparent"></div>
                </div>

                <EditableText
                  id="s8_b1"
                  as="div"
                  className="text-white/60 text-sm md:text-base leading-relaxed font-medium pr-4"
                />
              </div>
            </FadeIn>

            {/* Per */}
            <FadeIn
              delay={0.4}
              direction="up"
              className="flex-1 max-w-[340px] mx-auto w-full"
            >
              <div className="flex flex-col text-left group cursor-pointer w-full">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/4.5] bg-white/[0.02] shadow-sm mb-6">
                  <EditableImage
                    id="img_per"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    alt="Per"
                  />
                </div>

                <EditableText
                  id="s8_n2"
                  as="h4"
                  className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight"
                />
                <EditableText
                  id="s8_r2"
                  as="p"
                  className="text-sm md:text-base font-medium text-[#FF8A3D]"
                />

                <div className="flex items-center gap-3 my-5 opacity-60">
                  <div className="w-3 h-3 rounded-full border-[1.5px] border-[#FF8A3D] flex items-center justify-center shrink-0">
                    <div className="w-1 h-1 bg-[#FF8A3D] rounded-full"></div>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#FF8A3D]/50 to-transparent"></div>
                </div>

                <EditableText
                  id="s8_b2"
                  as="div"
                  className="text-white/60 text-sm md:text-base leading-relaxed font-medium pr-4"
                />
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <EditableText
              id="s8_quote"
              as="p"
              className="text-xl md:text-2xl font-medium text-center text-white/80 max-w-3xl mx-auto italic"
            />
          </FadeIn>
        </section>

        {/* --- SLIDE 8: THE ASK --- */}
        <section
          ref={(el) => (slideRefs.current[7] = el)}
          className="min-h-[100dvh] flex flex-col justify-center px-6 max-w-7xl mx-auto w-full relative"
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8A3D]/5 rounded-full blur-[120px] pointer-events-none"></div>

          <FadeIn>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#FF8A3D] mb-4 uppercase text-center md:text-left opacity-80">
              The Ask
            </div>
            <EditableText
              id="s9_head"
              as="h2"
              className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 max-w-4xl text-center md:text-left mx-auto md:mx-0"
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FadeIn delay={0.2} direction="up">
              <div className="p-6 md:p-8 rounded-[2rem] bg-white/[0.02] shadow-sm backdrop-blur-sm h-full flex flex-col justify-center text-center md:text-left">
                <EditableText
                  id="s9_ticket_label"
                  as="div"
                  className="text-xs md:text-sm font-medium text-white/50 mb-2 uppercase tracking-wider"
                />
                <EditableText
                  id="s9_ticket_val"
                  as="div"
                  className="text-5xl md:text-6xl font-semibold tracking-tighter text-white"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
              <div className="p-6 md:p-8 rounded-[2rem] bg-[#FF8A3D]/5 shadow-[0_0_30px_rgba(255,138,61,0.05)] backdrop-blur-sm h-full flex flex-col justify-center text-center md:text-left">
                <EditableText
                  id="s9_val_label"
                  as="div"
                  className="text-xs md:text-sm font-medium text-[#FF8A3D]/70 mb-2 uppercase tracking-wider"
                />
                <EditableText
                  id="s9_val_val"
                  as="div"
                  className="text-5xl md:text-6xl font-semibold tracking-tighter text-[#FF8A3D]"
                />
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4} direction="up">
            <div className="p-6 md:p-8 rounded-[2rem] bg-white/[0.01] shadow-sm backdrop-blur-sm mb-6">
              <EditableText
                id="s9_rm_title"
                as="div"
                className="text-lg md:text-xl font-medium text-white/80 mb-6 text-center md:text-left"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                <div className="absolute top-3 left-10 right-10 h-[1px] bg-white/10 hidden md:block"></div>

                <div className="relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#050505] shadow-sm mb-4 mx-auto md:mx-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/40"></div>
                  </div>
                  <EditableText
                    id="s9_rm_y0_lbl"
                    as="div"
                    className="text-xs md:text-sm text-white/50 mb-1 text-center md:text-left"
                  />
                  <EditableText
                    id="s9_rm_y0_val"
                    as="div"
                    className="text-2xl md:text-3xl font-medium text-white text-center md:text-left"
                  />
                </div>

                <div className="relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#050505] shadow-sm mb-4 mx-auto md:mx-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/40"></div>
                  </div>
                  <EditableText
                    id="s9_rm_y1_lbl"
                    as="div"
                    className="text-xs md:text-sm text-white/50 mb-1 text-center md:text-left"
                  />
                  <EditableText
                    id="s9_rm_y1_val"
                    as="div"
                    className="text-2xl md:text-3xl font-medium text-white text-center md:text-left"
                  />
                </div>

                <div className="relative z-10">
                  <div className="w-6 h-6 rounded-full bg-[#050505] mb-4 mx-auto md:mx-0 flex items-center justify-center shadow-[0_0_15px_rgba(255,138,61,0.3)]">
                    <div className="w-2 h-2 rounded-full bg-[#FF8A3D] animate-ping opacity-50"></div>
                    <div className="w-2 h-2 rounded-full bg-[#FF8A3D] absolute"></div>
                  </div>
                  <EditableText
                    id="s9_rm_y3_lbl"
                    as="div"
                    className="text-xs md:text-sm text-[#FF8A3D]/70 mb-1 text-center md:text-left"
                  />
                  <EditableText
                    id="s9_rm_y3_val"
                    as="div"
                    className="text-3xl md:text-4xl font-semibold text-[#FF8A3D] text-center md:text-left"
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.5} direction="up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pt-6 border-t border-white/5">
              {[
                "Accelerate proprietary geometry parser",
                "Scale GTM",
                "Secure technical leadership",
                "Build early customer pilots",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center md:items-start text-center md:text-left gap-2 p-4 bg-white/[0.01] rounded-xl h-full shadow-sm"
                >
                  <CheckCircle2
                    size={16}
                    className="text-[#FF8A3D] opacity-80"
                  />
                  <span className="text-xs text-white/70">{text}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <EditableText
              id="s9_quote"
              as="h3"
              className="text-2xl md:text-3xl font-medium tracking-tight text-center max-w-4xl mx-auto italic text-white/80"
            />
          </FadeIn>
        </section>

        {/* --- SLIDE 9: CLOSING --- */}
        <section
          ref={(el) => (slideRefs.current[8] = el)}
          className="h-[100dvh] flex flex-col justify-center items-center text-center relative px-6 w-full overflow-hidden"
        >
          <div className="absolute inset-0 z-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none">
            <EditableImage
              id="img_closing_bg"
              className="w-full h-full object-cover mix-blend-luminosity"
              alt="Future City"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center">
            <FadeIn delay={0.2}>
              <img
                src={LOGO_URL}
                alt="aiai3D"
                className="h-40 md:h-56 object-contain mx-auto mb-10"
              />
            </FadeIn>
            <FadeIn delay={0.4}>
              <EditableText
                id="s10_sub"
                as="h2"
                className="text-3xl md:text-5xl font-semibold tracking-tighter mb-12 leading-tight max-w-3xl"
              />
            </FadeIn>
            <FadeIn
              delay={0.6}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <a
                href={`mailto:${content.s10_contact_mail}`}
                className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-sm md:text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
              >
                <EditableText id="s10_contact_mail" as="span" />
              </a>
              <a
                href={`tel:${content.s10_contact_phone}`}
                className="inline-block bg-white/10 text-white backdrop-blur-md px-8 py-4 rounded-full font-semibold text-sm md:text-lg hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
              >
                <EditableText id="s10_contact_phone" as="span" />
              </a>
            </FadeIn>
          </div>
        </section>
      </div>

      {/* --- STICKY FOOTER NAVIGATION --- */}
      <div className="fixed bottom-0 w-full z-50 pointer-events-none flex flex-col">
        {/* Progress Line */}
        <div className="w-full h-[2px] bg-white/5">
          <div
            className="h-full bg-[#FF8A3D] transition-all duration-300 ease-out"
            style={{ width: `${(currentSlide / TOTAL_SLIDES) * 100}%` }}
          />
        </div>
        {/* Footer Content */}
        <div className="h-16 md:h-20 bg-[#050505]/70 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-4 md:px-8 pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          {/* Left: One Pager */}
          <div className="w-1/3 flex justify-start">
            <button
              onClick={() => setShowOnePager(true)}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs md:text-sm font-medium uppercase tracking-widest group"
            >
              <FileText
                size={16}
                className="group-hover:text-[#FF8A3D] transition-colors"
              />
              <span className="hidden sm:inline">One Pager</span>
            </button>
          </div>

          {/* Center: Pagination */}
          <div className="w-1/3 flex justify-center items-center gap-4 md:gap-8">
            <button
              disabled={currentSlide === 1}
              onClick={() => scrollToSlide(currentSlide - 2)}
              className="text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              title="Previous Slide"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/50 uppercase whitespace-nowrap">
              Slide <span className="text-white">{currentSlide}</span> of{" "}
              {TOTAL_SLIDES}
            </span>
            <button
              disabled={currentSlide === TOTAL_SLIDES}
              onClick={() => scrollToSlide(currentSlide)}
              className="text-white/50 hover:text-white disabled:opacity-20 transition-colors"
              title="Next Slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Right: Edit Lock */}
          <div className="w-1/3 flex justify-end">
            {!isEditMode && (
              <button
                onClick={() => setShowPasswordModal(true)}
                className="p-2 rounded-full text-white/30 hover:text-[#FF8A3D] transition-colors"
                title="Investor Edit Mode"
              >
                <Lock size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- FULLSCREEN ONE PAGER MODAL --- */}
      <AnimatePresence>
        {showOnePager && (
          <OnePager
            content={content}
            onClose={() => setShowOnePager(false)}
            isEditMode={isEditMode}
            setContent={setContent}
          />
        )}
      </AnimatePresence>

      {/* --- INLINE EDITING SYSTEM --- */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 w-full h-16 bg-[#FF8A3D] text-black z-[100] flex items-center justify-between px-4 md:px-8 font-semibold shadow-[0_10px_30px_rgba(255,138,61,0.3)]"
          >
            <div className="flex items-center gap-3">
              <Edit3 size={18} className="animate-pulse shrink-0" />
              <span className="tracking-tight text-sm md:text-lg">
                EDIT MODE ACTIVE
              </span>
              <span className="font-medium text-sm ml-4 opacity-70 hidden md:inline">
                Click any text or image to edit.
              </span>
            </div>
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setContent(
                    JSON.parse(localStorage.getItem("aiai3d-pitch-content")) ||
                      defaultContent,
                  );
                }}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-black/10 hover:bg-black/20 rounded-full text-xs md:text-sm transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 md:px-6 md:py-2 bg-black text-white hover:bg-gray-800 rounded-full text-xs md:text-sm flex items-center gap-2 transition-colors"
              >
                <Save size={14} />{" "}
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] rounded-[2rem] p-10 w-full max-w-sm shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setErrorMsg("");
                }}
                className="absolute top-6 right-6 text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 text-[#FF8A3D]">
                <Lock size={20} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Access Edit Mode</h3>
              <p className="text-white/50 text-sm mb-8">
                Enter the secure PIN to unlock inline content editing.
              </p>
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-black rounded-xl px-4 py-4 text-center tracking-[0.5em] text-xl font-medium outline-none focus:ring-1 focus:ring-[#FF8A3D] transition-all mb-4"
                  autoFocus
                />
                {errorMsg && (
                  <p className="text-red-400 text-sm mb-4 text-center">
                    {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Unlock
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
