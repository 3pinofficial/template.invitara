"use client";

// ─── Kids Birthday — Engine-Faithful Desktop & Responsive Mobile Layout ────────
// Desktop: 911px absolute canvas with automatic container-scaled resizing
// Mobile: Natively responsive card layout under 768px parent viewport width
// Animations: Drifting background balloons (fixed viewport), interactive confetti canvas, scroll reveal

import { useEffect, useRef, useState, useCallback } from "react";
import type { InviteProps } from "@/types/invite-schema";
import { resolveField } from "@/types/invite-schema";
import { UniversalRSVPForm, type RSVPThemeConfig, type RSVPFieldConfig } from "@/components/rsvp/UniversalRSVPForm";
import type { InvitationEvent } from "@/lib/rsvp-actions";
import { Gift, Calendar, Clock, MapPin, Gamepad2, Music, Cake, PartyPopper } from "lucide-react";

// ─── Asset Registry ───────────────────────────────────────────────────────────
const getStorageBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/$/, "")}/storage/v1/object/public`;
  }
  return "https://vhhlzktemdywbhsrmsmx.supabase.co/storage/v1/object/public";
};
const STORAGE_BASE = getStorageBaseUrl();
const WB = `${STORAGE_BASE}/invitation-assets/kids-birthday/default_assets`;

const A = {
  kidsPartyImg: `${WB}/3b3b88c0fc1f24b2d2ef9db2740b18f225a42c56.png`,
  cakeImg: `${WB}/a29828b2a733e01838bb7df86c5d848ec7cacef6.png`,
  
  // Self-contained light cloud vector asset
  cloudImg: "data:image/svg+xml;utf8,<svg viewBox='0 0 100 60' fill='white' xmlns='http://www.w3.org/2000/svg'><path d='M20 35a15 15 0 0 1 15-15h2a18 18 0 0 1 34-6 16 16 0 0 1 9 29 15 15 0 0 1-15 12H35A15 15 0 0 1 20 35z'/></svg>",

  // Balloons mapped to public SVGs
  balloons: [
    `${WB}/a784568da91d08014d4e9a6bdb02cb5ef1c28801.svg`,
    `${WB}/618b6b8f75b8d28e0857407c3a8630ba2fe3e45d.svg`,
    `${WB}/28f6a9b30af909ceadc8e3cb346e18b02da4aa6d.svg`,
    `${WB}/ffdb722ca2e6527a427f28548eb4685452b11d6c.svg`,
    `${WB}/116f438a0574739afa4a594562435c6c5ee1da76.svg`,
    `${WB}/7c3e521a33a9b6130c4219db710799de30817d69.svg`,
    `${WB}/f232a3ce8adcd06d08e666c1485d1edb754df3f0.svg`,
    `${WB}/70d5677557f28c4f549b174896245fb1b7515877.svg`,
    `${WB}/38ea20886bd429eaf004153a863372247d8750b9.svg`,
    `${WB}/eb595fb5d0b91538404c1cb274dd2eac72e27bca.svg`,
    `${WB}/bbdb6c56a70fc15dfd7daab4bbf6dbdbedfaff23.svg`,
    `${WB}/c419983bfa6a1010fd31674df10b8ec861d1619d.svg`,
    `${WB}/3ed093d4244c6d109707c6203cb08e6d0589d0c4.svg`,
    `${WB}/b938c260c6112a7e8b2af31aeb1aa3b5962744f3.svg`,
    `${WB}/49b0b978457ff8e29b341162f65c335d7258c4ef.svg`,
  ],

  // Specific RSVP header icons
  rsvpLeft: `${WB}/9ec50bf6bb4bcb965b6bafc4399a4af061fa3d44.svg`,
  rsvpRight: `${WB}/55169bd53c3799e237a321c08458d81ddc5875ec.svg`,
};

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  skyBg: "#f0f9ff",
  white: "#ffffff",
  darkBlue: "#1d293d",
  bodyText: "#45556c",
  subMuted: "#62748e",
  
  whenBg: "#dff2fe",
  whenBorder: "#74d4ff",
  timeBg: "#fce7f3",
  timeBorder: "#fda5d5",
  whereBg: "#f3e8ff",
  whereBorder: "#dab2ff",

  yellowBorder: "#ffdf20",
  pinkMain: "#f6339a",
  pinkShadow: "#be185d",
  purpleMain: "#ad46ff",
  blueMain: "#00a6f4",
};

// ─── Fonts & CSS Styles ──────────────────────────────────────────────────────
const F = {
  kidsHead: "'Fredoka', sans-serif",
  kidsBody: "'Nunito', sans-serif",
};

const GOOGLE_FONTS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700;800&display=swap');
  
  /* Background Drifting Balloon Animations (Layout Bound) */
  @keyframes driftUp {
    0% {
      top: 100%;
      transform: translateX(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      top: -200px;
      transform: translateX(25px) rotate(15deg);
      opacity: 0;
    }
  }

  /* Drifting cloud animation (Layout Bound) */
  @keyframes driftCloud {
    0% {
      left: -200px;
      opacity: 0;
    }
    10% {
      opacity: 0.45;
    }
    90% {
      opacity: 0.45;
    }
    100% {
      left: 100%;
      opacity: 0;
    }
  }

  /* Micro-breathing floating animation for expectations */
  @keyframes popPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
`;

// ─── High-Fidelity Formatter Helpers ──────────────────────────────────────────
function formatOrdinalDate(d: string) {
  if (!d) return "";
  try {
    const dateObj = new Date(d);
    const day = dateObj.getDate();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthStr = months[dateObj.getMonth()];
    
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeekStr = daysOfWeek[dateObj.getDay()];

    return `${dayOfWeekStr}, ${monthStr} ${day}${suffix}`;
  } catch {
    return d;
  }
}

// Year formatting
function formatYear(d: string) {
  if (!d) return "";
  try {
    return new Date(d).getFullYear().toString();
  } catch {
    return "";
  }
}

function format12hTime(t: string) {
  if (!t) return "";
  try {
    const [hStr, mStr] = t.split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const hr = h % 12 || 12;
    const min = String(m).padStart(2, "0");
    return `${hr}:${min} ${ampm}`;
  } catch {
    return t;
  }
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVis(true);
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, vis };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, vis } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(24px)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Fixed Confetti Popper Canvas Component ──────────────────────────────────
interface ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "circle" | "square" | "triangle" | "star";
  angle: number;
  speed: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

function ConfettiPopper({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const colors = ["#f6339a", "#ad46ff", "#00a6f4", "#ffdf20", "#ff6900", "#4ade80"];
  const shapes: ("circle" | "square" | "triangle" | "star")[] = ["circle", "square", "triangle", "star"];

  const initConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    
    // Create colorful particles bursting from left and right bottom corners
    const leftParticles: ConfettiParticle[] = Array.from({ length: 90 }).map(() => {
      // Shooting up and to the right
      const angle = Math.random() * (Math.PI * 0.3) + Math.PI * 0.1; 
      const speed = 10 + Math.random() * 16;
      return {
        x: 50,
        y: h - 50,
        size: 6 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        angle: angle,
        speed: speed,
        vx: Math.sin(angle) * speed,
        vy: -Math.cos(angle) * speed,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
      };
    });

    const rightParticles: ConfettiParticle[] = Array.from({ length: 90 }).map(() => {
      // Shooting up and to the left
      const angle = -(Math.random() * (Math.PI * 0.3) + Math.PI * 0.1);
      const speed = 10 + Math.random() * 16;
      return {
        x: w - 50,
        y: h - 50,
        size: 6 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        angle: angle,
        speed: speed,
        vx: Math.sin(angle) * speed,
        vy: -Math.cos(angle) * speed,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
      };
    });

    particlesRef.current = [...particlesRef.current, ...leftParticles, ...rightParticles];
  }, []);

  useEffect(() => {
    if (trigger > 0) {
      initConfetti();
    }
  }, [trigger, initConfetti]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.98; // air friction
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012; // slow fadeout

        if (p.y > canvas.height || p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        ctx.beginPath();
        if (p.shape === "circle") {
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        } else if (p.shape === "square") {
          ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === "triangle") {
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
        } else {
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * (p.size / 2), -Math.sin(((18 + s * 72) * Math.PI) / 180) * (p.size / 2));
            ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 4), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 4));
          }
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
}

// ─── Helper for Absolute Positions ────────────────────────────────────────────
function Abs({
  x = 0,
  y = 0,
  w,
  h,
  z = 0,
  children,
}: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  z?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        ...(w !== undefined ? { width: w } : {}),
        ...(h !== undefined ? { height: h } : {}),
        zIndex: z,
      }}
    >
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ─── VIEWPORT 1: RESPONSIVE MOBILE LAYOUT (<768px parent viewport) ────────────
// ════════════════════════════════════════════════════════════════════════════════
function MobileLayout({
  childName,
  childAge,
  hostName,
  heroSubtitle,
  heroImage,
  partyDate,
  partyTime,
  partyVenue,
  partyAddress,
  rsvpDeadline,
  showRsvp,
  eventId,
  rsvpTheme,
  rsvpFields,
  previewCeremonies,
  onConfettiClick,
  poppedBalloons,
  onPopBalloon,
}: {
  childName: string;
  childAge: string;
  hostName: string;
  heroSubtitle: string;
  heroImage: string;
  partyDate: string;
  partyTime: string;
  partyVenue: string;
  partyAddress: string;
  rsvpDeadline: string;
  showRsvp: boolean;
  eventId?: string;
  rsvpTheme: RSVPThemeConfig;
  rsvpFields: RSVPFieldConfig;
  previewCeremonies?: InvitationEvent[];
  onConfettiClick: () => void;
  poppedBalloons: Record<number, boolean>;
  onPopBalloon: (index: number) => void;
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        position: "relative",
        background: "transparent",
        fontFamily: F.kidsBody,
        paddingBottom: 0,
        zIndex: 10,
      }}
    >
      <style>{GOOGLE_FONTS_CSS}</style>

      {/* Absolute drifting background balloons and clouds container */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {/* Clouds drifting horizontally */}
        {Array.from({ length: 4 }).map((_, i) => {
          const topPercent = 12 + i * 24;
          const delay = i * -12;
          const duration = 28 + i * 8;
          const scale = 0.7 + (i % 2) * 0.4;
          return (
            <img
              key={`cloud-${i}`}
              src={A.cloudImg}
              alt=""
              style={{
                position: "absolute",
                top: `${topPercent}%`,
                width: 140 * scale,
                height: "auto",
                opacity: 0.45,
                animation: `driftCloud ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
        {/* Balloons drifting vertically */}
        {A.balloons.map((svg, i) => {
          const leftPercent = 5 + (i * 22) % 90;
          const delay = i * 2.8;
          const duration = 12 + (i % 5) * 4;
          const isPopped = poppedBalloons[i];
          return (
            <img
              key={i}
              src={svg}
              alt=""
              onClick={(e) => {
                e.stopPropagation();
                onPopBalloon(i);
              }}
              style={{
                position: "absolute",
                top: "100%", // Start at the bottom to avoid sitting at top before delay!
                left: `${leftPercent}%`,
                width: 60 + (i % 3) * 15,
                height: "auto",
                opacity: isPopped ? 0 : 0.6,
                transform: isPopped ? "scale(0)" : "scale(1)",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                animation: isPopped ? "none" : `driftUp ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                cursor: "pointer",
                pointerEvents: "auto", // Allow clicking on individual balloons!
              }}
            />
          );
        })}
      </div>

      {/* ── MOBILE SECTION 1: HERO CONTAINER ── */}
      <div style={{ padding: "40px 16px 24px", position: "relative" }}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            border: `3.5px solid rgba(255, 255, 255, 0.85)`,
            borderRadius: 44,
            boxShadow: "0px 20px 45px -10px rgba(0, 0, 0, 0.15), inset 0 2px 2px rgba(255,255,255,0.4)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            padding: "36px 20px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div
              style={{
                background: "#fdc700",
                boxShadow: "0px 6px 0px #b58d00",
                borderRadius: 9999,
                padding: "10px 28px",
                transform: "rotate(-1deg)",
              }}
            >
              <span
                style={{
                  fontFamily: F.kidsHead,
                  fontSize: 16,
                  color: "#432004",
                  fontWeight: "bold",
                  letterSpacing: "0.9px",
                  textTransform: "uppercase",
                }}
              >
                ✨ You&apos;re Invited! ✨
              </span>
            </div>
          </div>

          {/* Heading 1 */}
          <h1
            style={{
              fontFamily: F.kidsHead,
              fontSize: 42,
              lineHeight: "48px",
              fontWeight: 700,
              background: `linear-gradient(to right, ${C.pinkMain}, ${C.purpleMain}, ${C.blueMain})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0px 4px 0px rgba(0,0,0,0.05)",
              marginBottom: 16,
            }}
          >
            {childName} is turning {childAge}!
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: F.kidsBody,
              fontSize: 18,
              lineHeight: "26px",
              fontWeight: 600,
              color: C.bodyText,
              padding: "0 8px",
              marginBottom: 28,
            }}
          >
            {heroSubtitle}
          </p>

          {/* Image Frame */}
          <div
            style={{
              background: C.white,
              border: `3.5px solid ${C.white}`,
              borderRadius: 24,
              boxShadow: "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)",
              overflow: "hidden",
              position: "relative",
              aspectRatio: "16/10",
              marginBottom: 28,
            }}
          >
            <img
              src={heroImage}
              alt="Birthday celebrant"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)",
              }}
            />
          </div>

          {/* Pop Confetti 3D Button */}
          <button
            onClick={onConfettiClick}
            style={{
              background: C.pinkMain,
              border: "none",
              borderRadius: 9999,
              boxShadow: `0px 8px 0px ${C.pinkShadow}`,
              color: C.white,
              fontFamily: F.kidsHead,
              fontSize: 18,
              fontWeight: "bold",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "16px 36px",
              cursor: "pointer",
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
              animation: "popPulse 3s ease-in-out infinite",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(4px)";
              e.currentTarget.style.boxShadow = `0px 4px 0px ${C.pinkShadow}`;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = `0px 8px 0px ${C.pinkShadow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = `0px 8px 0px ${C.pinkShadow}`;
            }}
          >
            <PartyPopper className="w-5 h-5 text-white" />
            <span>Pop Some Confetti!</span>
          </button>
        </div>
      </div>

      {/* ── MOBILE SECTION 2: DETAILS SECTION ── */}
      <div style={{ padding: "32px 16px" }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* When Card */}
            <div
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0px 15px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px) scale(1)";
                e.currentTarget.style.boxShadow = "0px 10px 7.5px rgba(0,0,0,0.05)";
              }}
              style={{
                background: C.whenBg,
                border: `3.5px solid ${C.whenBorder}`,
                borderRadius: 32,
                boxShadow: "0px 10px 7.5px rgba(0,0,0,0.05)",
                padding: "28px 24px",
                textAlign: "center",
                transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div
                  style={{
                    background: C.white,
                    border: `3.5px solid ${C.white}`,
                    borderRadius: 9999,
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
                    padding: 12,
                  }}
                >
                  <Calendar className="w-8 h-8 text-[#00a6f4]" />
                </div>
              </div>
              <h3 style={{ fontFamily: F.kidsHead, fontSize: 24, fontWeight: "bold", color: C.darkBlue, marginBottom: 8 }}>
                When
              </h3>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.bodyText, margin: "0 0 2px" }}>
                {formatOrdinalDate(partyDate) || "Saturday, August 12th"}
              </p>
              <p style={{ fontSize: 16, fontWeight: 500, color: C.subMuted, margin: 0 }}>
                {formatYear(partyDate) || "2026"}
              </p>
            </div>

            {/* Time Card */}
            <div
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0px 15px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px) scale(1)";
                e.currentTarget.style.boxShadow = "0px 10px 7.5px rgba(0,0,0,0.05)";
              }}
              style={{
                background: C.timeBg,
                border: `3.5px solid ${C.timeBorder}`,
                borderRadius: 32,
                boxShadow: "0px 10px 7.5px rgba(0,0,0,0.05)",
                padding: "28px 24px",
                textAlign: "center",
                transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div
                  style={{
                    background: C.white,
                    border: `3.5px solid ${C.white}`,
                    borderRadius: 9999,
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
                    padding: 12,
                  }}
                >
                  <Clock className="w-8 h-8 text-[#f6339a]" />
                </div>
              </div>
              <h3 style={{ fontFamily: F.kidsHead, fontSize: 24, fontWeight: "bold", color: C.darkBlue, marginBottom: 8 }}>
                Time
              </h3>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.bodyText, margin: "0 0 2px" }}>
                {format12hTime(partyTime) || "2:00 PM"}
              </p>
              <p style={{ fontSize: 16, fontWeight: 500, color: C.subMuted, margin: 0 }}>
                to 5:00 PM
              </p>
            </div>

            {/* Where Card */}
            <div
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0px 15px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px) scale(1)";
                e.currentTarget.style.boxShadow = "0px 10px 7.5px rgba(0,0,0,0.05)";
              }}
              style={{
                background: C.whereBg,
                border: `3.5px solid ${C.whereBorder}`,
                borderRadius: 32,
                boxShadow: "0px 10px 7.5px rgba(0,0,0,0.05)",
                padding: "28px 24px",
                textAlign: "center",
                transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div
                  style={{
                    background: C.white,
                    border: `3.5px solid ${C.white}`,
                    borderRadius: 9999,
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
                    padding: 12,
                  }}
                >
                  <MapPin className="w-8 h-8 text-[#ad46ff]" />
                </div>
              </div>
              <h3 style={{ fontFamily: F.kidsHead, fontSize: 24, fontWeight: "bold", color: C.darkBlue, marginBottom: 8 }}>
                Where
              </h3>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.bodyText, margin: "0 0 2px" }}>
                {partyVenue || "Sunshine Park Pavilion"}
              </p>
              <p style={{ fontSize: 16, fontWeight: 500, color: C.subMuted, margin: 0 }}>
                {partyAddress || "123 Rainbow Lane"}
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── MOBILE SECTION 3: WHAT TO EXPECT ── */}
      <div style={{ padding: "32px 16px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: F.kidsHead, fontSize: 32, fontWeight: "bold", color: C.darkBlue, marginBottom: 12 }}>
              What to Expect!
            </h2>
            <p style={{ fontSize: 16, color: C.bodyText, lineHeight: "24px", margin: "0 auto", maxWidth: 320 }}>
              We&apos;ve planned an amazing afternoon full of magical surprises. Make sure to wear comfortable clothes for playing!
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 48,
            }}
          >
            {/* Fun Games Card (tilted -3deg) */}
            <div
              style={{
                background: "#ff6900",
                border: `3.5px solid ${C.white}`,
                borderRadius: 24,
                boxShadow: "0px 10px 7.5px rgba(0,0,0,0.08)",
                padding: "24px 16px",
                textAlign: "center",
                transform: "rotate(-3deg)",
                transition: "transform 0.3s ease, scale 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ background: "rgba(255, 255, 255, 0.2)", borderRadius: 9999, padding: 12 }}>
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <span style={{ fontFamily: F.kidsHead, fontSize: 18, fontWeight: "bold", color: C.white }}>
                Fun Games
              </span>
            </div>

            {/* Dance Party Card (tilted 3deg) */}
            <div
              style={{
                background: "#ad46ff",
                border: `3.5px solid ${C.white}`,
                borderRadius: 24,
                boxShadow: "0px 10px 7.5px rgba(0,0,0,0.08)",
                padding: "24px 16px",
                textAlign: "center",
                transform: "rotate(3deg)",
                transition: "transform 0.3s ease, scale 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ background: "rgba(255, 255, 255, 0.2)", borderRadius: 9999, padding: 12 }}>
                  <Music className="w-8 h-8 text-white" />
                </div>
              </div>
              <span style={{ fontFamily: F.kidsHead, fontSize: 18, fontWeight: "bold", color: C.white }}>
                Dance Party
              </span>
            </div>

            {/* Lots of Cake Card (tilted -3deg) */}
            <div
              style={{
                background: "#f6339a",
                border: `3.5px solid ${C.white}`,
                borderRadius: 24,
                boxShadow: "0px 10px 7.5px rgba(0,0,0,0.08)",
                padding: "24px 16px",
                textAlign: "center",
                transform: "rotate(-3deg)",
                transition: "transform 0.3s ease, scale 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ background: "rgba(255, 255, 255, 0.2)", borderRadius: 9999, padding: 12 }}>
                  <Cake className="w-8 h-8 text-white" />
                </div>
              </div>
              <span style={{ fontFamily: F.kidsHead, fontSize: 18, fontWeight: "bold", color: C.white }}>
                Lots of Cake
              </span>
            </div>

            {/* Goodie Bags Card (tilted 3deg) */}
            <div
              style={{
                background: "#00a6f4",
                border: `3.5px solid ${C.white}`,
                borderRadius: 24,
                boxShadow: "0px 10px 7.5px rgba(0,0,0,0.08)",
                padding: "24px 16px",
                textAlign: "center",
                transform: "rotate(3deg)",
                transition: "transform 0.3s ease, scale 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ background: "rgba(255, 255, 255, 0.2)", borderRadius: 9999, padding: 12 }}>
                  <Gift className="w-8 h-8 text-white" />
                </div>
              </div>
              <span style={{ fontFamily: F.kidsHead, fontSize: 18, fontWeight: "bold", color: C.white }}>
                Goodie Bags
              </span>
            </div>
          </div>

          {/* Dynamic colorful blobs behind Cake portrait */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{ position: "absolute", background: "#ffdf20", filter: "blur(30px)", opacity: 0.6, borderRadius: 9999, width: 240, height: 240, top: 0, left: 20, zIndex: 0 }} />
            <div style={{ position: "absolute", background: "#fda5d5", filter: "blur(30px)", opacity: 0.6, borderRadius: 9999, width: 240, height: 240, top: 0, right: 20, zIndex: 0 }} />
            
            {/* Cake image */}
            <div
              style={{
                border: "6px solid #ffffff",
                borderRadius: 36,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                width: 280,
                height: 280,
                transform: "rotate(3deg)",
                overflow: "hidden",
                position: "relative",
                zIndex: 10,
              }}
            >
              <img
                src={A.cakeImg}
                alt="Birthday Cake"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── MOBILE SECTION 4: RSVP FORM ── */}
      {showRsvp && (
        <div style={{ padding: "32px 16px" }}>
          <Reveal>
            <div
              style={{
                background: C.white,
                border: `6px solid ${C.yellowBorder}`,
                borderRadius: 40,
                boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.2)",
                overflow: "hidden",
              }}
            >
              {/* RSVP Banner */}
              <div
                style={{
                  background: C.yellowBorder,
                  padding: "28px 16px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <img
                  src={A.rsvpLeft}
                  alt=""
                  style={{
                    position: "absolute",
                    left: 10,
                    top: 15,
                    width: 48,
                    height: 48,
                    transform: "rotate(12deg)",
                    opacity: 0.6,
                  }}
                />
                <img
                  src={A.rsvpRight}
                  alt=""
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 15,
                    width: 48,
                    height: 48,
                    transform: "rotate(-12deg)",
                    opacity: 0.6,
                  }}
                />

                <h2
                  style={{
                    fontFamily: F.kidsHead,
                    fontSize: 28,
                    fontWeight: "bold",
                    color: "#432004",
                    margin: "0 0 4px",
                  }}
                >
                  Can You Make It?
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#894b00",
                    margin: 0,
                  }}
                >
                  Please RSVP by {formatOrdinalDate(rsvpDeadline) || "August 1st"}
                </p>
              </div>

              {/* Universal Form */}
              <div style={{ padding: 24 }}>
                <UniversalRSVPForm
                  eventId={eventId ?? ""}
                  theme={rsvpTheme}
                  formConfig={rsvpFields}
                  previewCeremonies={previewCeremonies}
                  isMobile={true}
                />
              </div>
            </div>
          </Reveal>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{ background: C.darkBlue, padding: "48px 24px 32px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", borderTop: "1px solid rgba(255,255,255,0.08)", gap: 20, textAlign: "center", position: "relative", zIndex: 10 }}>
        {/* Celebrant details */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
          <p style={{ fontFamily: F.kidsBody, fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.4)", margin: 0, fontWeight: "bold", textTransform: "uppercase" }}>THE BIRTHDAY PARTY OF</p>
          <p style={{ fontFamily: F.kidsHead, fontSize: 32, background: `linear-gradient(to right, ${C.pinkMain}, ${C.purpleMain})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, lineHeight: 1.1, fontWeight: "bold" }}>{childName}</p>
          <p style={{ fontFamily: F.kidsBody, fontSize: 14, fontWeight: "bold", color: "#ffffff", margin: 0 }}>
            {formatOrdinalDate(partyDate) || "Saturday, August 12th"} &bull; {partyVenue}
          </p>
        </div>

        {/* Bouncy CSS Divider */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", margin: "8px 0", gap: "12px" }}>
          <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15))" }} />
          <span style={{ color: C.pinkMain, fontSize: "12px" }}>🎈</span>
          <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.15))" }} />
        </div>

        {/* Brand & CTA Group */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
          <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
            <img src="/logo/sec_two_white.svg" alt="Invitara Logo" style={{ height: "30px", display: "block" }} />
          </a>
          
          <p style={{ fontFamily: F.kidsBody, fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5", margin: "0 auto", maxWidth: "280px", fontWeight: 500 }}>
            Beautiful digital invitations for every celebration. Build an experience that your guests will cherish forever.
          </p>

          <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 24px",
            background: C.pinkMain,
            boxShadow: `0px 4px 0px ${C.pinkShadow}`,
            color: C.white,
            fontFamily: F.kidsHead,
            fontSize: "13px",
            fontWeight: "bold",
            borderRadius: 9999,
            textDecoration: "none",
            transition: "transform 0.1s ease, box-shadow 0.1s ease",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(2px)";
            e.currentTarget.style.boxShadow = `0px 2px 0px ${C.pinkShadow}`;
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = `0px 4px 0px ${C.pinkShadow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = `0px 4px 0px ${C.pinkShadow}`;
          }}
          >
            Create Your Own Invite <span style={{ fontSize: "14px", fontWeight: "bold" }}>→</span>
          </a>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.08)", margin: "8px 0 0" }} />

        {/* Bottom bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
          <p style={{ fontFamily: F.kidsBody, fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>© 2026 Invitara. All rights reserved.</p>
          <p style={{ fontFamily: F.kidsBody, fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
            A product by <a href="https://3pin.co.in" target="_blank" rel="noopener noreferrer" style={{ color: C.pinkMain, textDecoration: "none", fontWeight: "bold" }}>3PIN</a>
          </p>
          
          {/* Socials */}
          <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = C.pinkMain} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = C.pinkMain} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ─── VIEWPORT 2: ABSOLUTE WIDESCREEN DESKTOP LAYOUT (911px canvas) ────────────
// ════════════════════════════════════════════════════════════════════════════════
function DesktopLayout({
  childName,
  childAge,
  hostName,
  heroSubtitle,
  heroImage,
  partyDate,
  partyTime,
  partyVenue,
  partyAddress,
  rsvpDeadline,
  showRsvp,
  eventId,
  rsvpTheme,
  rsvpFields,
  previewCeremonies,
  scale,
  contentRef,
  onConfettiClick,
  poppedBalloons,
  onPopBalloon,
}: {
  childName: string;
  childAge: string;
  hostName: string;
  heroSubtitle: string;
  heroImage: string;
  partyDate: string;
  partyTime: string;
  partyVenue: string;
  partyAddress: string;
  rsvpDeadline: string;
  showRsvp: boolean;
  eventId?: string;
  rsvpTheme: RSVPThemeConfig;
  rsvpFields: RSVPFieldConfig;
  previewCeremonies?: InvitationEvent[];
  scale: number;
  contentRef: React.RefObject<HTMLDivElement>;
  onConfettiClick: () => void;
  poppedBalloons: Record<number, boolean>;
  onPopBalloon: (index: number) => void;
}) {
  return (
    <div
      ref={contentRef}
      style={{
        width: 1440,
        position: "relative",
        background: "transparent",
        fontFamily: F.kidsBody,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        flexShrink: 0,
        overflow: "hidden",
        paddingBottom: 0,
        zIndex: 10,
      }}
    >
      <style>{GOOGLE_FONTS_CSS}</style>

      {/* Absolute drifting background balloons and clouds container */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {/* Clouds drifting horizontally */}
        {Array.from({ length: 4 }).map((_, i) => {
          const topPercent = 12 + i * 24;
          const delay = i * -12;
          const duration = 28 + i * 8;
          const scale = 0.7 + (i % 2) * 0.4;
          return (
            <img
              key={`cloud-${i}`}
              src={A.cloudImg}
              alt=""
              style={{
                position: "absolute",
                top: `${topPercent}%`,
                width: 140 * scale,
                height: "auto",
                opacity: 0.45,
                animation: `driftCloud ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
        {/* Balloons drifting vertically */}
        {A.balloons.map((svg, i) => {
          const leftPercent = 5 + (i * 22) % 90;
          const delay = i * 2.8;
          const duration = 12 + (i % 5) * 4;
          const isPopped = poppedBalloons[i];
          return (
            <img
              key={i}
              src={svg}
              alt=""
              onClick={(e) => {
                e.stopPropagation();
                onPopBalloon(i);
              }}
              style={{
                position: "absolute",
                top: "100%", // Start at the bottom to avoid sitting at top before delay!
                left: `${leftPercent}%`,
                width: 60 + (i % 3) * 15,
                height: "auto",
                opacity: isPopped ? 0 : 0.6,
                transform: isPopped ? "scale(0)" : "scale(1)",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                animation: isPopped ? "none" : `driftUp ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                cursor: "pointer",
                pointerEvents: "auto", // Allow clicking on individual balloons!
              }}
            />
          );
        })}
      </div>

      {/* ── DESKTOP SECTION 1: HERO CONTAINER (h:1028px) ── */}
      <div style={{ height: 1028, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <Abs x={280} y={40} w={879}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.72)",
              border: `4px solid rgba(255, 255, 255, 0.85)`,
              borderRadius: 48,
              boxShadow: "0px 25px 60px -15px rgba(0, 0, 0, 0.18), inset 0 2px 2px rgba(255,255,255,0.4)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              padding: "68px",
              textAlign: "center",
            }}
          >
            {/* Badge container */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div
                style={{
                  background: "#fdc700",
                  boxShadow: "0px 6px 0px #b58d00",
                  borderRadius: 9999,
                  padding: "10px 36px",
                  transform: "rotate(-1deg)",
                }}
              >
                <span
                  style={{
                    fontFamily: F.kidsHead,
                    fontSize: 18,
                    color: "#432004",
                    fontWeight: "bold",
                    letterSpacing: "0.9px",
                    textTransform: "uppercase",
                  }}
                >
                  ✨ You&apos;re Invited! ✨
                </span>
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: F.kidsHead,
                fontSize: 72,
                lineHeight: "90px",
                fontWeight: 700,
                background: `linear-gradient(to right, ${C.pinkMain}, ${C.purpleMain}, ${C.blueMain})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0px 4px 0px rgba(0,0,0,0.05)",
                marginBottom: 18,
              }}
            >
              {childName} is turning {childAge}!
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: F.kidsBody,
                fontSize: 24,
                lineHeight: "32px",
                fontWeight: 600,
                color: C.bodyText,
                maxWidth: 672,
                margin: "0 auto 40px",
              }}
            >
              {heroSubtitle}
            </p>

            {/* Photo frame */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
              <div
                style={{
                  background: C.white,
                  border: `4px solid ${C.white}`,
                  borderRadius: 24,
                  boxShadow: "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  width: 672,
                  height: 378,
                  position: "relative",
                }}
              >
                <img
                  src={heroImage}
                  alt="Party photo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)",
                  }}
                />
              </div>
            </div>

            {/* Interactive Confetti Popper Button */}
            <button
              onClick={onConfettiClick}
              style={{
                background: C.pinkMain,
                border: "none",
                borderRadius: 9999,
                boxShadow: `0px 8px 0px ${C.pinkShadow}`,
                color: C.white,
                fontFamily: F.kidsHead,
                fontSize: 20,
                fontWeight: "bold",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "20px 40px",
                cursor: "pointer",
                transition: "transform 0.1s ease, box-shadow 0.1s ease",
                animation: "popPulse 3s ease-in-out infinite",
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(4px)";
                e.currentTarget.style.boxShadow = `0px 4px 0px ${C.pinkShadow}`;
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = `0px 8px 0px ${C.pinkShadow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = `0px 8px 0px ${C.pinkShadow}`;
              }}
            >
              <PartyPopper className="w-6 h-6 text-white" />
              <span>Pop Some Confetti!</span>
            </button>
          </div>
        </Abs>
      </div>

      {/* ── DESKTOP SECTION 2: DETAILS SECTION (h:440px) ── */}
      <div style={{ height: 440, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <Abs x={280} y={64} w={879}>
          <Reveal>
            <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
              {/* When Card */}
              <div
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
                  e.currentTarget.style.boxShadow = "0px 20px 30px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) scale(1)";
                  e.currentTarget.style.boxShadow = "0px 10px 7.5px rgba(0,0,0,0.1)";
                }}
                style={{
                  background: C.whenBg,
                  border: `4px solid ${C.whenBorder}`,
                  borderRadius: 32,
                  boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
                  padding: "36px",
                  textAlign: "center",
                  flex: 1,
                  transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                  <div
                    style={{
                      background: C.white,
                      border: `4px solid ${C.white}`,
                      borderRadius: 9999,
                      boxShadow: "0px 1px 1.5px rgba(0,0,0,0.1), 0px 1px 1px rgba(0,0,0,0.1)",
                      padding: 16,
                    }}
                  >
                    <Calendar className="w-8 h-8 text-[#00a6f4]" />
                  </div>
                </div>
                <h3 style={{ fontFamily: F.kidsHead, fontSize: 30, fontWeight: "bold", color: C.darkBlue, margin: "0 0 8px" }}>
                  When
                </h3>
                <p style={{ fontSize: 20, fontWeight: 700, color: C.bodyText, margin: "0 0 2px" }}>
                  {formatOrdinalDate(partyDate) || "Saturday, August 12th"}
                </p>
                <p style={{ fontSize: 18, fontWeight: 500, color: C.subMuted, margin: 0 }}>
                  {formatYear(partyDate) || "2026"}
                </p>
              </div>

              {/* Time Card */}
              <div
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
                  e.currentTarget.style.boxShadow = "0px 20px 30px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) scale(1)";
                  e.currentTarget.style.boxShadow = "0px 10px 7.5px rgba(0,0,0,0.1)";
                }}
                style={{
                  background: C.timeBg,
                  border: `4px solid ${C.timeBorder}`,
                  borderRadius: 32,
                  boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
                  padding: "36px",
                  textAlign: "center",
                  flex: 1,
                  transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                  <div
                    style={{
                      background: C.white,
                      border: `4px solid ${C.white}`,
                      borderRadius: 9999,
                      boxShadow: "0px 1px 1.5px rgba(0,0,0,0.1), 0px 1px 1px rgba(0,0,0,0.1)",
                      padding: 16,
                    }}
                  >
                    <Clock className="w-8 h-8 text-[#f6339a]" />
                  </div>
                </div>
                <h3 style={{ fontFamily: F.kidsHead, fontSize: 30, fontWeight: "bold", color: C.darkBlue, margin: "0 0 8px" }}>
                  Time
                </h3>
                <p style={{ fontSize: 20, fontWeight: 700, color: C.bodyText, margin: "0 0 2px" }}>
                  {format12hTime(partyTime) || "2:00 PM"}
                </p>
                <p style={{ fontSize: 18, fontWeight: 500, color: C.subMuted, margin: 0 }}>
                  to 5:00 PM
                </p>
              </div>

              {/* Where Card */}
              <div
                style={{
                  background: C.whereBg,
                  border: `4px solid ${C.whereBorder}`,
                  borderRadius: 32,
                  boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
                  padding: "36px",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                  <div
                    style={{
                      background: C.white,
                      border: `4px solid ${C.white}`,
                      borderRadius: 9999,
                      boxShadow: "0px 1px 1.5px rgba(0,0,0,0.1), 0px 1px 1px rgba(0,0,0,0.1)",
                      padding: 16,
                    }}
                  >
                    <MapPin className="w-8 h-8 text-[#ad46ff]" />
                  </div>
                </div>
                <h3 style={{ fontFamily: F.kidsHead, fontSize: 30, fontWeight: "bold", color: C.darkBlue, margin: "0 0 8px" }}>
                  Where
                </h3>
                <p style={{ fontSize: 20, fontWeight: 700, color: C.bodyText, margin: "0 0 2px" }}>
                  {partyVenue || "Sunshine Park Pavilion"}
                </p>
                <p style={{ fontSize: 18, fontWeight: 500, color: C.subMuted, margin: 0 }}>
                  {partyAddress || "123 Rainbow Lane"}
                </p>
              </div>
            </div>
          </Reveal>
        </Abs>
      </div>

      {/* ── DESKTOP SECTION 3: EXPECTATIONS & CAKE (h:600px) ── */}
      <div style={{ height: 600, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <Abs x={280} y={40} w={879}>
          <Reveal>
            <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
              {/* Expectations Grid */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: F.kidsHead, fontSize: 48, fontWeight: "bold", color: C.darkBlue, marginBottom: 12 }}>
                  What to Expect!
                </h2>
                <p style={{ fontSize: 20, color: C.bodyText, lineHeight: "28px", marginBottom: 40, maxWidth: 512 }}>
                  We&apos;ve planned an amazing afternoon full of magical surprises. Make sure to wear comfortable clothes for playing!
                </p>

                {/* Expect cards grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  {/* Fun Games Card (tilted -6deg) */}
                  <div
                    style={{
                      background: "#ff6900",
                      border: `4px solid ${C.white}`,
                      borderRadius: 24,
                      boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
                      padding: "24px 28px",
                      textAlign: "center",
                      transform: "rotate(-6deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "rotate(0deg) scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "rotate(-6deg) scale(1)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                      <div style={{ background: "rgba(255, 255, 255, 0.2)", borderRadius: 9999, padding: 16 }}>
                        <Gamepad2 className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <span style={{ fontFamily: F.kidsHead, fontSize: 20, fontWeight: "bold", color: C.white }}>
                      Fun Games
                    </span>
                  </div>

                  {/* Dance Party Card (tilted 3deg) */}
                  <div
                    style={{
                      background: "#ad46ff",
                      border: `4px solid ${C.white}`,
                      borderRadius: 24,
                      boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
                      padding: "24px 28px",
                      textAlign: "center",
                      transform: "rotate(3deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "rotate(0deg) scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "rotate(3deg) scale(1)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                      <div style={{ background: "rgba(255, 255, 255, 0.2)", borderRadius: 9999, padding: 16 }}>
                        <Music className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <span style={{ fontFamily: F.kidsHead, fontSize: 20, fontWeight: "bold", color: C.white }}>
                      Dance Party
                    </span>
                  </div>

                  {/* Lots of Cake Card (tilted -3deg) */}
                  <div
                    style={{
                      background: "#f6339a",
                      border: `4px solid ${C.white}`,
                      borderRadius: 24,
                      boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
                      padding: "24px 28px",
                      textAlign: "center",
                      transform: "rotate(-3deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "rotate(0deg) scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "rotate(-3deg) scale(1)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                      <div style={{ background: "rgba(255, 255, 255, 0.2)", borderRadius: 9999, padding: 16 }}>
                        <Cake className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <span style={{ fontFamily: F.kidsHead, fontSize: 20, fontWeight: "bold", color: C.white }}>
                      Lots of Cake
                    </span>
                  </div>

                  {/* Goodie Bags Card (tilted 6deg) */}
                  <div
                    style={{
                      background: "#00a6f4",
                      border: `4px solid ${C.white}`,
                      borderRadius: 24,
                      boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
                      padding: "24px 28px",
                      textAlign: "center",
                      transform: "rotate(6deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "rotate(0deg) scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "rotate(6deg) scale(1)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                      <div style={{ background: "rgba(255, 255, 255, 0.2)", borderRadius: 9999, padding: 16 }}>
                        <Gift className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <span style={{ fontFamily: F.kidsHead, fontSize: 20, fontWeight: "bold", color: C.white }}>
                      Goodie Bags
                    </span>
                  </div>
                </div>
              </div>

              {/* Cake Image Portrait Block */}
              <div style={{ width: 400, position: "relative", display: "flex", justifyContent: "center" }}>
                <div style={{ position: "absolute", background: "#ffdf20", filter: "blur(40px)", opacity: 0.7, borderRadius: 9999, width: 380, height: 380, top: -20, left: -40, zIndex: 0 }} />
                <div style={{ position: "absolute", background: "#fda5d5", filter: "blur(40px)", opacity: 0.7, borderRadius: 9999, width: 380, height: 380, top: -20, right: -40, zIndex: 0 }} />
                <div style={{ position: "absolute", background: "#74d4ff", filter: "blur(40px)", opacity: 0.69, borderRadius: 9999, width: 380, height: 380, bottom: -40, left: -40, zIndex: 0 }} />
                
                {/* Cake Portrait */}
                <div
                  style={{
                    border: "8px solid #ffffff",
                    borderRadius: 48,
                    boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
                    width: 360,
                    height: 360,
                    transform: "rotate(3deg)",
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  <img
                    src={A.cakeImg}
                    alt="Cake"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </Abs>
      </div>

      {/* ── DESKTOP SECTION 4: RSVP (h:1020px) ── */}
      {showRsvp && (
        <div style={{ height: 1020, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <Abs x={280} y={32} w={879}>
            <Reveal>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    background: C.white,
                    border: `8px solid ${C.yellowBorder}`,
                    borderRadius: 48,
                    boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    width: 768,
                    overflow: "hidden",
                  }}
                >
                  {/* Banner */}
                  <div
                    style={{
                      background: C.yellowBorder,
                      height: 164,
                      textAlign: "center",
                      padding: "40px 32px",
                      position: "relative",
                    }}
                  >
                    <img
                      src={A.rsvpLeft}
                      alt=""
                      style={{
                        position: "absolute",
                        left: 20,
                        top: 30,
                        width: 96,
                        height: 96,
                        transform: "rotate(12deg)",
                        opacity: 0.6,
                      }}
                    />
                    <img
                      src={A.rsvpRight}
                      alt=""
                      style={{
                        position: "absolute",
                        right: 20,
                        top: 30,
                        width: 96,
                        height: 96,
                        transform: "rotate(-12deg)",
                        opacity: 0.6,
                      }}
                    />

                    <h2
                      style={{
                        fontFamily: F.kidsHead,
                        fontSize: 48,
                        fontWeight: "bold",
                        color: "#432004",
                        margin: "0 0 6px",
                      }}
                    >
                      Can You Make It?
                    </h2>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#894b00",
                        margin: 0,
                      }}
                    >
                      Please RSVP by {formatOrdinalDate(rsvpDeadline) || "August 1st"}
                    </p>
                  </div>

                  {/* Form fields */}
                  <div style={{ padding: "48px" }}>
                    <UniversalRSVPForm
                      eventId={eventId ?? ""}
                      theme={rsvpTheme}
                      formConfig={rsvpFields}
                      previewCeremonies={previewCeremonies}
                      maxWidth="w-full"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </Abs>
        </div>
      )}

      {/* ── DESKTOP BRAND FOOTER (h:500px) ── */}
      <div style={{
        height: 500,
        width: 1440,
        background: C.darkBlue,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        position: "relative",
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
      }}>
        <div style={{
          width: 911,
          height: "100%",
          padding: "56px 64px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
        {/* Signature row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 20 }}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontFamily: F.kidsBody, fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.4)", margin: "0 0 4px", fontWeight: "bold", textTransform: "uppercase" }}>THE BIRTHDAY PARTY OF</p>
            <p style={{ fontFamily: F.kidsHead, fontSize: 32, background: `linear-gradient(to right, ${C.pinkMain}, ${C.purpleMain})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, lineHeight: 1.1, fontWeight: "bold" }}>{childName}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: F.kidsBody, fontSize: 15, fontWeight: "bold", color: "#ffffff", margin: 0 }}>
              {formatOrdinalDate(partyDate) || "Saturday, August 12th"}
            </p>
            <p style={{ fontFamily: F.kidsBody, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>
              {partyVenue}
            </p>
          </div>
        </div>

        {/* Bouncy CSS Divider Ornament */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", margin: "-8px 0 8px", gap: "16px" }}>
          <div style={{ height: "1px", width: "180px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15))" }} />
          <span style={{ color: C.pinkMain, fontSize: "14px" }}>🎈</span>
          <div style={{ height: "1px", width: "180px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.15))" }} />
        </div>

        {/* Main brand and highlights grid */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "64px" }}>
          {/* Brand & CTA */}
          <div style={{ flex: "1 1 42%", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
            <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: "20px", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
              <img src="/logo/sec_two_white.svg" alt="Invitara Logo" style={{ height: "36px", display: "block" }} />
            </a>
            <p style={{ fontFamily: F.kidsBody, fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.6", margin: "0 0 20px", maxWidth: "340px" }}>
              Beautiful digital invitations for every celebration. Build an experience that your guests will cherish forever.
            </p>
            <p style={{ fontFamily: F.kidsBody, fontStyle: "italic", fontSize: "16px", color: C.pinkMain, margin: "0 0 20px", fontWeight: "bold" }}>
              Create your own magical birthday invite today!
            </p>
            <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "12px 28px",
              background: C.pinkMain,
              boxShadow: `0px 4px 0px ${C.pinkShadow}`,
              color: C.white,
              fontFamily: F.kidsHead,
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: 9999,
              textDecoration: "none",
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(2px)";
              e.currentTarget.style.boxShadow = `0px 2px 0px ${C.pinkShadow}`;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = `0px 4px 0px ${C.pinkShadow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = `0px 4px 0px ${C.pinkShadow}`;
            }}
            >
              Create Your Own Invite <span style={{ fontSize: "14px", fontWeight: "bold" }}>→</span>
            </a>
          </div>

          {/* Highlights Showcase */}
          <div style={{ flex: "1 1 58%", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px 32px", textAlign: "left" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.kidsHead, fontWeight: "bold", fontSize: "13px", color: C.pinkMain, letterSpacing: "1px", margin: 0 }}>✦ PLAYFUL DESIGN</p>
              <p style={{ fontFamily: F.kidsBody, fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: "1.5", margin: 0 }}>
                Exquisite, hand-crafted layouts designed to showcase your celebrations on the finest screens.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.kidsHead, fontWeight: "bold", fontSize: "13px", color: C.pinkMain, letterSpacing: "1px", margin: 0 }}>✦ SEAMLESS RSVPS</p>
              <p style={{ fontFamily: F.kidsBody, fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: "1.5", margin: 0 }}>
                Track RSVPs, manage guest preferences, and receive warm wishes in real-time.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.kidsHead, fontWeight: "bold", fontSize: "13px", color: C.pinkMain, letterSpacing: "1px", margin: 0 }}>✦ DYNAMIC MAPS</p>
              <p style={{ fontFamily: F.kidsBody, fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: "1.5", margin: 0 }}>
                Integrated GPS navigation and detailed schedule maps ensure guests arrive smoothly.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.kidsHead, fontWeight: "bold", fontSize: "13px", color: C.pinkMain, letterSpacing: "1px", margin: 0 }}>✦ SECURE GIFTING</p>
              <p style={{ fontFamily: F.kidsBody, fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: "1.5", margin: 0 }}>
                Elegant, integrated registry support for seamless gift registries and direct wishes.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <p style={{ fontFamily: F.kidsBody, fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>© 2026 Invitara. All rights reserved.</p>
            <span style={{ fontFamily: F.kidsBody, fontSize: "12px", color: "rgba(255,255,255,0.15)", margin: 0 }}>|</span>
            <p style={{ fontFamily: F.kidsBody, fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
              A product by <a href="https://3pin.co.in" target="_blank" rel="noopener noreferrer" style={{ color: C.pinkMain, textDecoration: "none", fontWeight: "bold" }}>3PIN</a>
            </p>
          </div>

          {/* Socials */}
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = C.pinkMain} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = C.pinkMain} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ─── ENTRYPOINT MAIN WRAPPER COMPONENT ─────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════
export default function KidsBirthdayComponent({
  userData,
  language,
  enabledAddons,
  isPreview,
  eventId,
}: InviteProps) {
  const r = (key: string, fallback: string = "") => {
    return resolveField(userData[key], language) || fallback;
  };

  // ── CONFETTI BURST TRIGGER STATE ──
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const handleConfettiClick = () => {
    setConfettiTrigger((t) => t + 1);
  };

  // ── POPPED BALLOONS GAME STATE ──
  const [poppedBalloons, setPoppedBalloons] = useState<Record<number, boolean>>({});
  const handlePopBalloon = (index: number) => {
    setPoppedBalloons((prev) => ({ ...prev, [index]: true }));
    handleConfettiClick(); // Celebrate!
  };

  // ── RESOLVING DYNAMIC DATA FIELDS ──
  const childName = r("childName", "Leo");
  const childAge = r("childAge") ? String(userData.childAge) : "5";
  const hostName = r("hostName", "Sarah");
  const heroSubtitle = r("heroSubtitle", "Get ready for a magical day filled with fun, games, and lots of cake!");
  const heroImage = r("heroImage", A.kidsPartyImg);

  const partyDate = r("party_date", "2026-08-12");
  const partyTime = r("party_time", "14:00");
  const partyVenue = r("party_venue", "Sunshine Park Pavilion");
  const partyAddress = r("party_address", "123 Rainbow Lane");

  const rsvpDeadline = r("rsvpDeadline", "2026-08-01");
  const showRsvp = enabledAddons.includes("rsvp");

  // ── RSVP custom child-friendly theme styled matching yellow accent ──────────
  const rsvpTheme: RSVPThemeConfig = {
    primaryColor: C.pinkMain,
    textColor: C.darkBlue,
    backgroundColor: C.white,
    fontFamily: F.kidsBody,
    buttonShape: "rounded-full",
  };

  const rsvpFields: RSVPFieldConfig = {
    requireEmail: typeof userData.rsvp_requireEmail === "boolean" ? userData.rsvp_requireEmail : false,
    showPhone: typeof userData.rsvp_showPhone === "boolean" ? userData.rsvp_showPhone : true,
    requirePhone: typeof userData.rsvp_requirePhone === "boolean" ? userData.rsvp_requirePhone : false,
    showDietary: typeof userData.rsvp_showDietary === "boolean" ? userData.rsvp_showDietary : true,
    showLeaveMessage: typeof userData.rsvp_showLeaveMessage === "boolean" ? userData.rsvp_showLeaveMessage : true,
    maxGuestsAllowed: typeof userData.rsvp_maxGuests === "number" ? userData.rsvp_maxGuests : 10,
  };

  // ── Previews sync for editor active changes ────────────────────────────────
  const ceremonyDefs = [{ key: "birthday_party", label: "Birthday Party" }];
  
  const previewCeremonies = ceremonyDefs
    .filter((d) => {
      const date = r("party_date", "");
      const time = r("party_time", "");
      const venue = r("party_venue", "");
      return !!(date || time || venue);
    })
    .map((d) => ({
      id: d.key,
      name: d.label,
      event_date: r("party_date", "") || null,
      event_time: r("party_time", "") || null,
      venue_name: r("party_venue", "") || null,
    }));

  const sharedProps = {
    childName,
    childAge,
    hostName,
    heroSubtitle,
    heroImage,
    partyDate,
    partyTime,
    partyVenue,
    partyAddress,
    rsvpDeadline,
    showRsvp,
    eventId,
    rsvpTheme,
    rsvpFields,
    previewCeremonies,
    onConfettiClick: handleConfettiClick,
    poppedBalloons,
    onPopBalloon: handlePopBalloon,
  };

  // ── Viewport Detect scaling triggers using ResizeObserver on parent ─────────
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const [contentH, setContentH] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => {
      const parentWidth = containerRef.current?.parentElement?.clientWidth || window.innerWidth;
      const isMob = parentWidth < 768;
      setIsMobile(isMob);
      
      if (isMob) {
        setScale(parentWidth < 420 ? parentWidth / 420 : 1);
      } else {
        setScale(parentWidth < 1440 ? parentWidth / 1440 : 1);
      }
    };

    check();
    window.addEventListener("resize", check);
    const ro = new ResizeObserver(check);
    if (containerRef.current?.parentElement) ro.observe(containerRef.current.parentElement);

    return () => {
      window.removeEventListener("resize", check);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setContentH(contentRef.current.scrollHeight);
    }
  }, [scale, isMobile, isPreview, userData]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: C.skyBg,
        ...(isPreview ? {} : { height: contentH ? contentH * scale : "auto", overflow: "hidden" }),
        position: "relative",
      }}
    >
      <ConfettiPopper trigger={confettiTrigger} />

      {isMobile ? (
        isPreview ? (
          <MobileLayout {...sharedProps} />
        ) : (
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "100%", display: "flex", justifyContent: "center" }}>
            <MobileLayout {...sharedProps} />
          </div>
        )
      ) : (
        <DesktopLayout {...sharedProps} scale={isPreview ? 1 : scale} contentRef={contentRef as React.RefObject<HTMLDivElement>} />
      )}
    </div>
  );
}
