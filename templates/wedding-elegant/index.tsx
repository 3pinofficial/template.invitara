"use client";

// ─── Wedding Elegant — Engine-Faithful Desktop + Native Mobile Layout ─────────
// Desktop (≥768px): 1440px canvas with scale() transform — pixel-perfect match
// Mobile (<768px): Natively designed responsive layout, no scale transform

import { useEffect, useRef, useState } from "react";
import type { InviteProps, UserData, SupportedLanguage } from "@/types/invite-schema";
import { resolveField } from "@/types/invite-schema";
import { UniversalRSVPForm, type RSVPThemeConfig, type RSVPFieldConfig } from "@/components/rsvp/UniversalRSVPForm";
import { MomentsSection } from "@/components/invite/MomentsSection";

// ─── Asset Registry ───────────────────────────────────────────────────────────
const getStorageBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/$/, "")}/storage/v1/object/public`;
  }
  return "https://vhhlzktemdywbhsrmsmx.supabase.co/storage/v1/object/public";
};
const STORAGE_BASE = getStorageBaseUrl();
const WB = `${STORAGE_BASE}/invitation-assets/wedding-elegant/default_assets`;
const AB = `${STORAGE_BASE}/invitation-assets/wedding-elegant/default_assets`;

const A = {
  flower: `${WB}/3f1584b28d5323adff9c0c75dd2ef8182c614374.png`,
  hands: `${WB}/fbe21e5bb3d5a704b70548d00c5843d2765965f8.png`,
  wave: `${WB}/ab441c8456f866c14da53a5e17afff6263b34b67.svg`,
  eventFrame: `${WB}/5ffa0bb989cca04f2da3d5b18cc70e408d88dc19.svg`,
  haldiLogo: `${WB}/2b73f56c860c4a332ea9d49721d4cc7844542709.png`,
  marriageLogo: `${WB}/d1e9278121cf19db83b24f570c755273bce94e43.png`,
  receptionLogo: `${WB}/66561bd3659a3e9a271c8ee835f747a10cf16145.png`,
  firefly: `${WB}/6f2f99e0d44980dc70ad0d1531bc808a6f8d0070.png`,
  pinIcon: `${WB}/9ec1d6bf6ff02e50fd1b529481495918b070ceee.svg`,
  mapsIcon: `${WB}/66531b22283cad48fa099cf32a256a8f6820e2c5.svg`,
  dirIcon: `${WB}/0279374dcd8f534dad6b0681bf2b443e24cc2d6f.svg`,
  archFrame: `${WB}/7b0ef3c9f0ea27293985b29dbc4fd753a5c5b3c1.svg`,
  coupleMask: `${WB}/6d4298b97fb8f118033baf09013403c3bbe63a6f.svg`,
  unionSvg: `${WB}/1e546e9d14048480fa57fbcbb798ede2cfa0eee6.svg`,
  subtractSvg: `${WB}/9c891a9c782b0d1547c1592a3422f9c4b7dfa952.svg`,
  footerDivider: `${WB}/55d50cbb69e32c0368d6d6741be6af30c494d13c.svg`,
  headerDivider: `${WB}/e2d9de93a2f43cd47a05c1c94f56cb759fcebe3f.svg`,
  sampleCouple: `${AB}/sample_couple.png`,
} as const;

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = { cream: "#FDF4D2", crimson: "#9D2712", red: "#A12727", white: "#ffffff", footer: "#A02727", cardText: "#FFDDA9", storyFg: "#FAF4D2", rsvpBg: "#F8DAD5" };
const F = { serif: "'Instrument Serif', Georgia, serif", cg: "'Cormorant Garamond', Georgia, serif", dm: "'DM Sans', sans-serif", jost: "'Jost', 'DM Sans', sans-serif" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d: string) { if (!d) return ""; try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; } }
function fmtTime(t: string) { if (!t) return ""; try { const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; } catch { return t; } }
function fmtMobileDate(d: string) { if (!d) return ""; try { const dateObj = new Date(d); const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; return `${months[dateObj.getMonth()]} ${dateObj.getDate()} , ${dateObj.getFullYear()}`; } catch { return d; } }

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.04 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, vis };
}
// Note: position: "relative" ensures absolute-positioned children (like the Abs helper) remain relative to the Reveal's original placement
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, vis } = useReveal();
  return <div ref={ref} style={{ position: "relative", width: "100%", height: "100%", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(18px)", transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms` }}>{children}</div>;
}

// ─── Ornament Divider ─────────────────────────────────────────────────────────
function OrnamentDivider({ white = false, scale = 1 }: { white?: boolean; scale?: number }) {
  const c = white ? "#ffffff" : C.crimson;
  const s = scale;
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 33 * s, padding: "0", position: "relative" }}>
    <div style={{ width: 178 * s, height: 2.8 * s, background: c, opacity: 0.35 }} />
    <span style={{ fontFamily: F.dm, fontSize: 22 * s, color: c, opacity: 0.7 }}>◆</span>
    <div style={{ width: 67 * s, height: 2.8 * s, background: c, opacity: 0.55 }} />
    <span style={{ fontFamily: F.dm, fontSize: 50 * s, color: c }}>✦</span>
    <div style={{ width: 67 * s, height: 2.8 * s, background: c, opacity: 0.55 }} />
    <span style={{ fontFamily: F.dm, fontSize: 22 * s, color: c, opacity: 0.7 }}>◆</span>
    <div style={{ width: 178 * s, height: 2.8 * s, background: c, opacity: 0.35 }} />
  </div>;
}

// ─── Desktop helpers ──────────────────────────────────────────────────────────
function Abs({ x = 0, y = 0, w, h, z = 0, children }: { x?: number; y?: number; w?: number; h?: number; z?: number; children: React.ReactNode }) {
  return <div style={{ position: "absolute", left: x, top: y, ...(w !== undefined ? { width: w } : {}), ...(h !== undefined ? { height: h } : {}), zIndex: z }}>{children}</div>;
}
function Section({ h, bg, children, style }: { h: number; bg: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ position: "relative", width: 1440, height: h, background: bg, overflow: "hidden", ...style }}>{children}</div>;
}

// ─── Font import (shared) ─────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=Jost:wght@300;400;500;600&display=swap');`;

// ════════════════════════════════════════════════════════════════════════════════
// MOBILE LAYOUT  ─ native responsive, designed for 390px viewport
// ════════════════════════════════════════════════════════════════════════════════
function MobileLayout({ groom, bride, wDate, wTime, groomParents, brideParents, blessings1, blessings2, couplePhoto, story, venueName, venueAddr1, venueAddr2, venueDesc, mapsUrl, dirUrl, contact, haldiTime, haldiDate, haldiVenue, weddingTime, weddingDate, weddingVenue, recepTime, recepDate, recepVenue, showRsvp, eventId, rsvpTheme, rsvpFields, previewCeremonies, isPreview, userData, language }: {
  groom: string; bride: string; wDate: string; wTime: string; groomParents: string; brideParents: string; blessings1: string; blessings2: string; couplePhoto: string; story: string; venueName: string; venueAddr1: string; venueAddr2: string; venueDesc: string; mapsUrl: string; dirUrl: string; contact: string; haldiTime: string; haldiDate: string; haldiVenue: string; weddingTime: string; weddingDate: string; weddingVenue: string; recepTime: string; recepDate: string; recepVenue: string; showRsvp: boolean; eventId?: string; rsvpTheme: RSVPThemeConfig; rsvpFields: RSVPFieldConfig; previewCeremonies?: any; isPreview?: boolean; userData: UserData; language: SupportedLanguage;
}) {
  const mCards = [
    { logo: A.haldiLogo, name: "Haldi", time: haldiTime, date: haldiDate, venue: haldiVenue, lw: 138, lh: 125 },
    { logo: A.marriageLogo, name: "Kalyanam", time: weddingTime, date: weddingDate, venue: weddingVenue, lw: 102, lh: 153 },
    { logo: A.receptionLogo, name: "Grand Reception", time: recepTime, date: recepDate, venue: recepVenue, lw: 99, lh: 99 },
  ];

  return (
    <div style={{ width: "100%", background: C.footer, fontFamily: F.dm }}>
      <style>{FONTS}{`
        * { box-sizing: border-box; }
        .m-section { width: 100%; position: relative; overflow: hidden; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="m-section" style={{ background: C.cream, paddingBottom: 0 }}>
        {/* flower bg */}
        <img src={A.flower} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.09, pointerEvents: "none" }} decoding="async" />

        {/* Hands image */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", paddingTop: 0, marginBottom: 16 }}>
          <img src={A.hands} alt="Hands" style={{ width: "90%", maxWidth: 380, objectFit: "cover", display: "block" }} decoding="async" />
        </div>

        {/* Names row */}
        <Reveal>
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 16px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", flexWrap: "wrap", gap: "0 10px" }}>
              <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 38, color: C.crimson, lineHeight: 1 }}>{groom}</span>
              <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 18, color: C.crimson, margin: "0 8px" }}>weds</span>
              <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 38, color: C.crimson, lineHeight: 1 }}>{bride}</span>
            </div>
          </div>
        </Reveal>

        {/* Blessings */}
        <Reveal delay={80}>
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "20px 24px 0" }}>
            <p style={{ fontFamily: F.cg, fontSize: 16, color: C.crimson, lineHeight: 1.4, margin: "0 0 4px", fontStyle: "italic" }}>{blessings1}</p>
            <p style={{ fontFamily: F.cg, fontSize: 16, color: C.crimson, fontWeight: 500, lineHeight: 1.4, margin: 0 }}>{blessings2}</p>
            <div style={{ width: 48, height: 1.5, background: C.crimson, opacity: 0.3, margin: "16px auto 0" }} />
          </div>
        </Reveal>

        {/* Invite block */}
        <Reveal delay={120}>
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "24px 20px 0" }}>
            <p style={{ fontFamily: F.cg, fontSize: 16, color: C.crimson, fontWeight: 500, lineHeight: 1.4, margin: 0 }}>{groomParents}</p>
            <p style={{ fontFamily: F.cg, fontSize: 11, color: C.crimson, fontWeight: 600, margin: "12px 0", letterSpacing: 4 }}>INVITE</p>
            <p style={{ fontFamily: F.cg, fontSize: 16, color: C.crimson, fontStyle: "italic", lineHeight: 1.4, margin: 0 }}>You to join us in the wedding celebrations of</p>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 68, color: C.crimson, lineHeight: 0.92, margin: "20px 0 0" }}>{groom}</p>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 36, color: C.crimson, lineHeight: 1, margin: "6px 0" }}>&amp;</p>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 68, color: C.crimson, lineHeight: 0.92, margin: 0 }}>{bride}</p>
            <p style={{ fontFamily: F.cg, fontSize: 16, color: C.crimson, fontStyle: "italic", lineHeight: 1.4, marginTop: 20 }}>Daughter of</p>
            <p style={{ fontFamily: F.cg, fontSize: 16, color: C.crimson, fontWeight: 500, lineHeight: 1.4, margin: 0 }}>{brideParents}</p>
          </div>
        </Reveal>

        {/* Date */}
        {(wDate || wTime) && (
          <Reveal delay={160}>
            <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "28px 20px 0" }}>
              <p style={{ fontFamily: F.cg, fontWeight: 600, fontSize: 15, color: C.crimson, margin: 0, letterSpacing: 1.2 }}>
                {wDate ? fmtMobileDate(wDate) : ""}{"  |  "}{wTime ? fmtTime(wTime) : ""}
              </p>
            </div>
          </Reveal>
        )}

        {/* Wave Transition */}
        <div style={{ position: "relative", zIndex: 3, marginTop: 28, marginBottom: -1 }}>
          <img src={A.wave} alt="" style={{ width: "100%", display: "block" }} decoding="async" />
        </div>
      </div>

      {/* ── EVENTS ───────────────────────────────────────────────────────── */}
      <div className="m-section" style={{ background: C.red, padding: "40px 20px 48px" }}>
        <img src={A.flower} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.07, pointerEvents: "none" }} decoding="async" loading="lazy" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <p style={{ fontFamily: F.dm, fontSize: 12, color: "#fff", letterSpacing: "8px", textAlign: "center", margin: "0 0 6px", textTransform: "uppercase" }}>JOIN THE CELEBRATION</p>
            <p style={{ fontFamily: F.cg, fontSize: 44, color: "#fff", textAlign: "center", margin: "0 0 12px", fontWeight: 400 }}>Wedding Events</p>
            <OrnamentDivider white scale={0.55} />
            <p style={{ fontFamily: F.dm, fontSize: 14, color: "#fff", textAlign: "center", margin: "12px 0 32px", opacity: 0.6, lineHeight: 1.6 }}>Four days of rituals, music, colour, and joy —{"\n"}every event is a chapter in our story.</p>
          </Reveal>

          {/* Event cards — vertical stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {mCards.map((card) => (
              <Reveal key={card.name} delay={60}>
                <div style={{ 
                  position: "relative", 
                  width: 280,
                  aspectRatio: "387.36 / 526.8",
                  margin: "0 auto",
                  borderRadius: 12, 
                  overflow: "hidden"
                }}>
                  <img src={A.eventFrame} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} decoding="async" loading="lazy" />
                  <div style={{ 
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px 20px"
                  }}>
                    <img src={card.logo} alt={card.name} style={{ width: card.lw, height: card.lh, objectFit: "cover", marginBottom: 8 }} decoding="async" loading="lazy" />
                    <p style={{ fontFamily: F.cg, fontSize: 28, color: C.cardText, margin: "0 0 6px", textAlign: "center" }}>{card.name}</p>
                    <p style={{ fontFamily: F.cg, fontSize: 14, color: C.cardText, margin: 0, textAlign: "center", lineHeight: 1.8 }}>{card.time}<br />{card.date}<br />{card.venue}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── VENUE ────────────────────────────────────────────────────────── */}
      <div className="m-section" style={{ background: C.white, padding: "36px 0 28px" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ padding: "0 24px" }}>
              <p style={{ fontFamily: F.jost, fontWeight: 500, fontSize: 11, letterSpacing: "6px", textTransform: "uppercase", color: C.crimson, textAlign: "center", margin: "0 0 4px" }}>Find Us Here</p>
              <p style={{ fontFamily: F.cg, fontSize: 44, color: C.crimson, textAlign: "center", margin: "0 0 12px", fontWeight: 400 }}>Venue &amp; Location</p>
              
              {/* Star/Line Ornament Divider */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "16px 0 12px" }}>
                <div style={{ height: 1.5, width: 90, background: C.crimson, opacity: 0.35 }} />
                <span style={{ fontSize: 22, color: C.crimson, lineHeight: 1, display: "inline-block", transform: "translateY(2px)" }}>✴</span>
                <div style={{ height: 1.5, width: 90, background: C.crimson, opacity: 0.35 }} />
              </div>
            </div>
          </Reveal>

          {/* Solid Altar/Mandap Altar Drawing — Full Width Edge-to-Edge */}
          <Reveal>
            <img src={A.firefly} alt="Mandap Altar" style={{ width: "100%", height: "auto", display: "block", margin: "0 auto 20px", opacity: 1 }} decoding="async" loading="lazy" />
          </Reveal>

          <Reveal>
            <div style={{ textAlign: "center", padding: "0 24px" }}>
              <p style={{ fontFamily: F.cg, fontWeight: 500, fontSize: 32, lineHeight: "40px", color: C.crimson, margin: "0 0 16px" }}>{venueName}</p>
              
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 8, margin: "0 auto 20px", maxWidth: 280 }}>
                <img src={A.pinIcon} alt="" style={{ width: 14, height: 14, marginTop: 3, flexShrink: 0 }} decoding="async" loading="lazy" />
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontFamily: F.jost, fontSize: 14, color: C.crimson, margin: 0, lineHeight: "20px" }}>{venueAddr1}</p>
                  <p style={{ fontFamily: F.jost, fontSize: 14, color: C.crimson, margin: 0, lineHeight: "20px" }}>{venueAddr2}</p>
                </div>
              </div>
              
              <p style={{ fontFamily: F.jost, fontWeight: 300, fontSize: 13, color: C.crimson, lineHeight: "20px", textAlign: "center", margin: "0 auto 28px", maxWidth: 300, opacity: 0.85 }}>{venueDesc}</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300, margin: "0 auto" }}>
                <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 24px", background: C.crimson, border: `1.5px solid ${C.crimson}`, borderRadius: 8, textDecoration: "none", color: "#ffffff", fontFamily: F.jost, fontSize: 14, fontWeight: 500 }}>
                  <img src={A.mapsIcon} alt="" style={{ width: 16, height: 16, filter: "brightness(0) invert(1)" }} decoding="async" loading="lazy" /> Open in Maps
                </a>
                <a href={dirUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 24px", background: "transparent", border: `1.5px solid ${C.crimson}`, borderRadius: 8, textDecoration: "none", color: C.crimson, fontFamily: F.jost, fontSize: 14, fontWeight: 500 }}>
                  <img src={A.dirIcon} alt="" style={{ width: 16, height: 16 }} decoding="async" loading="lazy" /> Get Directions
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── COUPLE STORY ─────────────────────────────────────────────────── */}
      <div className="m-section" style={{ background: C.red, padding: "48px 24px 0", overflow: "visible" }}>
        <img src={A.flower} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.11, pointerEvents: "none" }} decoding="async" loading="lazy" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 44, color: C.storyFg, textAlign: "center", margin: "0 0 16px" }}>
              Meet the<br />bride and groom
            </p>
          </Reveal>
          <Reveal>
            <p style={{ fontFamily: F.jost, fontWeight: 300, fontSize: 13, color: C.storyFg, lineHeight: "20px", textAlign: "center", margin: "0 auto 28px", maxWidth: 320, opacity: 0.85 }}>{story}</p>
          </Reveal>

          {/* Couple photo with arch frame — centered, responsive */}
          <Reveal>
            <div style={{ position: "relative", width: "72%", maxWidth: 340, aspectRatio: "502 / 872", margin: "0 auto", paddingBottom: 0 }}>
              <img src={A.archFrame} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 1, pointerEvents: "none" }} decoding="async" loading="lazy" />
              <div style={{
                position: "absolute",
                top: "2.4%", left: "2.4%", width: "95.2%", height: "95.2%",
                WebkitMaskImage: `url('${A.coupleMask}')`,
                WebkitMaskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
                maskImage: `url('${A.coupleMask}')`,
                maskSize: "100% 100%", maskRepeat: "no-repeat", maskPosition: "center",
                zIndex: 0,
              }}>
                <img src={couplePhoto} alt={`${groom} & ${bride}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} decoding="async" loading="lazy" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── MOMENTS ──────────────────────────────────────────────────────── */}
      <MomentsSection
        userData={userData}
        language={language}
        theme={{
          variant: "journal",
          fontHeading: "'Alex Brush', cursive",
          fontBody: F.cg,
          colorHeading: C.crimson,
          colorText: C.crimson,
          colorBg: C.cream,
          polaroidBg: C.white,
          tapeColor: "rgba(157, 39, 18, 0.15)",
        }}
      />

      {/* ── RSVP ─────────────────────────────────────────────────────────── */}
      {showRsvp && (
        <div style={{ background: C.white, position: "relative", zIndex: 1, padding: "32px 20px 48px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <UniversalRSVPForm eventId={eventId ?? ""} theme={rsvpTheme} formConfig={rsvpFields} previewCeremonies={isPreview ? previewCeremonies : undefined} isMobile={true} />
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{ background: C.footer, padding: "12px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)", gap: 20, textAlign: "center" }}>
        {/* Couple Signature Block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
          <p style={{ fontFamily: F.dm, fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,0.5)", margin: 0, textTransform: "uppercase" }}>THE WEDDING OF</p>
          <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 32, color: "#FFDDA9", margin: 0, lineHeight: 1 }}>{groom} &amp; {bride}</p>
          
          {/* Heart Divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "60%", margin: "2px 0" }}>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.15)" }} />
            <span style={{ color: "#FFDDA9", fontSize: 12, lineHeight: 1 }}>♥</span>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.15)" }} />
          </div>
          
          <p style={{ fontFamily: F.cg, fontSize: 13, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.3 }}>
            {wDate ? fmtMobileDate(wDate) : ""} &bull; {venueName}
          </p>
          {contact && (
            <p style={{ fontFamily: F.dm, fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>
              Enquiries: <a href={`mailto:${contact}`} style={{ color: "#FFDDA9", textDecoration: "none" }}>{contact}</a>
            </p>
          )}
        </div>

        {/* Clean Gold-Gradient CSS Divider */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", margin: "8px 0", gap: "12px" }}>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2))" }} />
          <span style={{ color: "#FFDDA9", fontSize: "10px", opacity: 0.6 }}>✦</span>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.2))" }} />
        </div>

        {/* Brand & CTA Group */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
          <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", transition: "opacity 0.2s" }}>
            <img src="/logo/sec_two_white.svg" alt="Invitara Logo" style={{ height: "30px", display: "block" }} decoding="async" loading="lazy" />
          </a>
          
          <p style={{ fontFamily: F.dm, fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5", margin: "0 auto", maxWidth: "260px" }}>
            Beautiful digital invitations for every celebration. Build an experience that your guests will cherish forever.
          </p>

          <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 20px",
            background: "#FFDDA9",
            borderRadius: "20px",
            color: C.crimson,
            fontFamily: F.dm,
            fontSize: "12px",
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "0.5px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
          }}>
            Create Your Invitation <span style={{ fontSize: "12px", fontWeight: "bold" }}>→</span>
          </a>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.12)", margin: "8px 0 0" }} />

        {/* Bottom bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <p style={{ fontFamily: F.dm, fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0 }}>© 2026 Invitara. All rights reserved.</p>
          <p style={{ fontFamily: F.dm, fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
            A product by <a href="https://3pin.co.in" target="_blank" rel="noopener noreferrer" style={{ color: "#FFDDA9", textDecoration: "none", fontWeight: 500 }}>3PIN</a>
          </p>
          
          {/* Socials */}
          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)" }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)" }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// DESKTOP LAYOUT  ─ engine-faithful 1440px absolute positioning
// ════════════════════════════════════════════════════════════════════════════════
function DesktopLayout({ groom, bride, wDate, wTime, groomParents, brideParents, blessings1, blessings2, couplePhoto, story, venueName, venueAddr1, venueAddr2, venueDesc, mapsUrl, dirUrl, contact, haldiTime, haldiDate, haldiVenue, weddingTime, weddingDate, weddingVenue, recepTime, recepDate, recepVenue, showRsvp, eventId, rsvpTheme, rsvpFields, scale, contentRef, previewCeremonies, isPreview, userData, language }: {
  groom: string; bride: string; wDate: string; wTime: string; groomParents: string; brideParents: string; blessings1: string; blessings2: string; couplePhoto: string; story: string; venueName: string; venueAddr1: string; venueAddr2: string; venueDesc: string; mapsUrl: string; dirUrl: string; contact: string; haldiTime: string; haldiDate: string; haldiVenue: string; weddingTime: string; weddingDate: string; weddingVenue: string; recepTime: string; recepDate: string; recepVenue: string; showRsvp: boolean; eventId?: string; rsvpTheme: RSVPThemeConfig; rsvpFields: RSVPFieldConfig; scale: number; contentRef: React.RefObject<HTMLDivElement>; previewCeremonies?: any; isPreview?: boolean; userData: UserData; language: SupportedLanguage;
}) {
  const cards = [
    { logo: A.haldiLogo, name: "Haldi", time: haldiTime, date: haldiDate, venue: haldiVenue, logoW: 230.587, logoH: 208.514, logoX: 197, logoY: 763, titleX: 222, titleY: 971, detailX: 197, detailY: 1049, cardX: 105 },
    { logo: A.marriageLogo, name: "Kalyanam", time: weddingTime, date: weddingDate, venue: weddingVenue, logoW: 170.635, logoH: 255.952, logoX: 643, logoY: 726, titleX: 621, titleY: 959, detailX: 624, detailY: 1050, cardX: 535 },
    { logo: A.receptionLogo, name: "Grand Reception", time: recepTime, date: recepDate, venue: recepVenue, logoW: 164.87, logoH: 164.87, logoX: 1058, logoY: 743, titleX: 1033, titleY: 930, detailX: 1037, detailY: 1055, cardX: 947 },
  ];

  return (
    <div ref={contentRef} style={{ width: 1440, transform: `scale(${scale})`, transformOrigin: "top center", flexShrink: 0, position: "relative" }}>
      <style>{FONTS}</style>

      {/* §1 HERO — h:2421 */}
      <Section h={2421} bg={C.cream}>
        <img src={A.flower} alt="" aria-hidden style={{ position: "absolute", left: 0, top: 15, width: 1439, height: 1163, objectFit: "cover", opacity: 0.08, pointerEvents: "none" }} decoding="async" loading="lazy" />
        <img src={A.flower} alt="" aria-hidden style={{ position: "absolute", left: 1, top: 1163, width: 1439, height: 1163, objectFit: "cover", opacity: 0.08, pointerEvents: "none" }} decoding="async" loading="lazy" />
        <img src={A.hands} alt="Hands" style={{ position: "absolute", left: 216, top: -97, width: 1007, height: 724, objectFit: "cover", pointerEvents: "none" }} decoding="async" loading="lazy" />
        
        {/* Centered names row */}
        <Abs x={0} y={627} w={1440}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 30 }}>
            <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 110, color: C.crimson, lineHeight: 1 }}>{groom}</span>
            <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 44, color: C.crimson }}>weds</span>
            <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 110, color: C.crimson, lineHeight: 1 }}>{bride}</span>
          </div>
        </Abs>

        {/* Blessings */}
        <Abs x={0} y={790} w={1440}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ fontFamily: F.cg, fontStyle: "italic", fontSize: 32, color: C.crimson, margin: "0 0 8px", textAlign: "center" }}>{blessings1}</p>
            <p style={{ fontFamily: F.cg, fontWeight: 500, fontSize: 32, color: C.crimson, margin: 0, textAlign: "center" }}>{blessings2}</p>
          </div>
        </Abs>
        
        <Abs x={634} y={910} w={172} h={5.5}><div style={{ width: "100%", height: "100%", background: C.crimson, opacity: 0.3 }} /></Abs>

        {/* Invite block */}
        <Abs x={0} y={960} w={1440}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ fontFamily: F.cg, fontWeight: 500, fontSize: 32, color: C.crimson, margin: 0, textAlign: "center" }}>{groomParents}</p>
            <p style={{ fontFamily: F.cg, fontWeight: 600, fontSize: 20, color: C.crimson, margin: "16px 0", letterSpacing: 6, textAlign: "center" }}>INVITE</p>
            <p style={{ fontFamily: F.cg, fontStyle: "italic", fontSize: 30, color: C.crimson, margin: 0, textAlign: "center" }}>You to join us in the wedding celebrations of</p>
            
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 130, color: C.crimson, lineHeight: 0.92, margin: "32px 0 0", textAlign: "center" }}>{groom}</p>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 60, color: C.crimson, lineHeight: 1, margin: "12px 0", textAlign: "center" }}>&amp;</p>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 130, color: C.crimson, lineHeight: 0.92, margin: 0, textAlign: "center" }}>{bride}</p>
            
            <p style={{ fontFamily: F.cg, fontStyle: "italic", fontSize: 30, color: C.crimson, margin: "32px 0 0", textAlign: "center" }}>Daughter of</p>
            <p style={{ fontFamily: F.cg, fontWeight: 500, fontSize: 32, color: C.crimson, margin: 0, textAlign: "center" }}>{brideParents}</p>
          </div>
        </Abs>

        {/* Date */}
        {(wDate || wTime) && (
          <Abs x={0} y={1620} w={1440}>
            <p style={{ fontFamily: F.cg, fontWeight: 600, fontSize: 30, color: C.crimson, margin: 0, textAlign: "center", letterSpacing: 1.5 }}>
              {wDate ? fmtMobileDate(wDate) : ""}{"  |  "}{wTime ? fmtTime(wTime) : ""}
            </p>
          </Abs>
        )}
        <img src={A.wave} alt="" aria-hidden style={{ position: "absolute", left: 1, top: 1700, width: 1440, height: 721, pointerEvents: "none", zIndex: 2 }} decoding="async" loading="lazy" />
      </Section>

      {/* §2 EVENTS — h:1309 */}
      <Section h={1309} bg={C.red}>
        <img src={A.flower} alt="" aria-hidden style={{ position: "absolute", left: 1, top: 0, width: 1440, height: 1161, objectFit: "cover", opacity: 0.07, pointerEvents: "none" }} decoding="async" loading="lazy" />
        <img src={A.flower} alt="" aria-hidden style={{ position: "absolute", left: 1, top: 1161, width: 1440, height: 148, objectFit: "cover", opacity: 0.07, pointerEvents: "none" }} decoding="async" loading="lazy" />
        <Abs x={273} y={84} w={894}>
          <Reveal><p style={{ fontFamily: F.dm, fontWeight: 400, fontSize: 30.632, lineHeight: "45.948px", letterSpacing: "11.64px", color: "#ffffff", textAlign: "center", textTransform: "uppercase", margin: 0 }}>JOIN THE CELEBRATION</p></Reveal>
          <Reveal delay={60}><p style={{ fontFamily: F.cg, fontWeight: 400, fontSize: 100.249, lineHeight: "150.374px", color: "#ffffff", textAlign: "center", whiteSpace: "nowrap", margin: 0 }}>Wedding Events</p></Reveal>
          <Reveal delay={100}><OrnamentDivider white /></Reveal>
          <Reveal delay={140}><div style={{ opacity: 0.56 }}><p style={{ fontFamily: F.dm, fontWeight: 400, fontSize: 44.555, lineHeight: "66.833px", color: "#ffffff", textAlign: "center", whiteSpace: "nowrap", margin: 0 }}>Four days of rituals, music, colour, and joy —</p><p style={{ fontFamily: F.dm, fontWeight: 400, fontSize: 44.555, lineHeight: "66.833px", color: "#ffffff", textAlign: "center", whiteSpace: "nowrap", margin: 0 }}>every event is a chapter in our story.</p></div></Reveal>
        </Abs>
        {cards.map((card) => {
          // Standardize local coordinates to align elements horizontally across all three cards
          let localLogoY = 55;
          if (card.name === "Haldi") localLogoY = 45;
          if (card.name === "Kalyanam") localLogoY = 20;

          const localTitleY = 275;
          const localDetailY = 362;

          return (
            <div key={card.name} style={{ position: "absolute", left: card.cardX, top: 688, width: 387.36, height: 526.8 }}>
              <img src={A.eventFrame} alt="" style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }} decoding="async" loading="lazy" />
              <img src={card.logo} alt={card.name} style={{ position: "absolute", left: card.logoX - card.cardX, top: localLogoY, width: card.logoW, height: card.logoH, objectFit: "cover" }} decoding="async" loading="lazy" />
              
              {/* Centered Title */}
              <div style={{ position: "absolute", left: 0, top: localTitleY, width: "100%", display: "flex", justifyContent: "center", padding: "0 20px" }}>
                <p style={{ 
                  fontFamily: F.cg, 
                  fontWeight: 400, 
                  fontSize: card.name === "Grand Reception" ? 44 : 58, 
                  lineHeight: "normal", 
                  color: C.cardText, 
                  margin: 0, 
                  textAlign: "center" 
                }}>
                  {card.name}
                </p>
              </div>

              {/* Centered Details */}
              <div style={{ position: "absolute", left: 0, top: localDetailY, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p style={{ fontFamily: F.cg, fontSize: 25.086, lineHeight: "normal", color: C.cardText, margin: 0, textAlign: "center" }}>{card.time}</p>
                <p style={{ fontFamily: F.cg, fontSize: 25.086, lineHeight: "normal", color: C.cardText, margin: 0, textAlign: "center" }}>{card.date}</p>
                <p style={{ fontFamily: F.cg, fontSize: 25.086, lineHeight: "normal", color: C.cardText, margin: 0, textAlign: "center" }}>{card.venue}</p>
              </div>
            </div>
          );
        })}
      </Section>

      {/* §3 VENUE — h:1000 */}
      <Section h={1000} bg={C.white}>
        {/* Centered Title & Gold Star Ornament Divider Header */}
        <Abs x={0} y={80} w={1440} z={2}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p style={{ fontFamily: F.jost, fontWeight: 500, fontSize: 24, letterSpacing: "8px", textTransform: "uppercase", color: C.crimson, margin: "0 0 12px" }}>Find Us Here</p>
              <p style={{ fontFamily: F.cg, fontWeight: 400, fontSize: 80, lineHeight: "96px", color: C.crimson, margin: 0, textAlign: "center" }}>Venue &amp; Location</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 24, width: "100%" }}>
                <div style={{ width: 280, height: 2, background: C.crimson, opacity: 0.35 }} />
                <span style={{ fontSize: 28, color: C.crimson, lineHeight: 1, display: "inline-block", transform: "translateY(2px)" }}>✴</span>
                <div style={{ width: 280, height: 2, background: C.crimson, opacity: 0.35 }} />
              </div>
            </div>
          </Reveal>
        </Abs>

        {/* Left Column: Clean Venue Details Block (100% legibility on solid white background) */}
        <Abs x={120} y={420} w={540} z={2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 24 }}>
            <Reveal delay={60}>
              <p style={{ fontFamily: F.cg, fontWeight: 500, fontSize: 44, lineHeight: "54px", color: C.crimson, margin: "0 0 8px" }}>{venueName}</p>
            </Reveal>
            
            <Reveal delay={80}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <img src={A.pinIcon} alt="" style={{ width: 20, height: 20, marginTop: 6, flexShrink: 0 }} decoding="async" loading="lazy" />
                <div>
                  <p style={{ fontFamily: F.jost, fontWeight: 400, fontSize: 18, lineHeight: "28px", color: C.crimson, margin: 0 }}>{venueAddr1}</p>
                  <p style={{ fontFamily: F.jost, fontWeight: 400, fontSize: 18, lineHeight: "28px", color: C.crimson, margin: 0 }}>{venueAddr2}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p style={{ fontFamily: F.jost, fontWeight: 300, fontSize: 16, lineHeight: "26px", color: C.crimson, maxWidth: 500, margin: 0 }}>{venueDesc}</p>
            </Reveal>
            
            <Reveal delay={120}>
              <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", border: `1.5px solid ${C.crimson}`, borderRadius: 6, textDecoration: "none", color: C.crimson, fontFamily: F.jost, fontSize: 15, fontWeight: 500 }}>
                  <img src={A.mapsIcon} alt="" style={{ width: 18, height: 18 }} decoding="async" loading="lazy" /> Open Maps
                </a>
                <a href={dirUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", border: `1.5px solid ${C.crimson}`, borderRadius: 6, textDecoration: "none", color: C.crimson, fontFamily: F.jost, fontSize: 15, fontWeight: 500 }}>
                  <img src={A.dirIcon} alt="" style={{ width: 18, height: 18 }} decoding="async" loading="lazy" /> Get Directions
                </a>
              </div>
            </Reveal>
          </div>
        </Abs>

        {/* Right Column: Full, Unobstructed Mandap Illustration */}
        <div style={{ position: "absolute", left: 620, top: 220, width: 780, height: 780, zIndex: 1 }}>
          <Reveal delay={80}>
            <img src={A.firefly} alt="Wedding Altar" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} decoding="async" loading="lazy" />
          </Reveal>
        </div>
      </Section>

      {/* §4 BRIDE & GROOM — h:1492 */}
      <Section h={1492} bg={C.red}>
        <img src={A.flower} alt="" aria-hidden style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 1163.48, objectFit: "cover", opacity: 0.11, pointerEvents: "none" }} decoding="async" loading="lazy" />
        <img src={A.flower} alt="" aria-hidden style={{ position: "absolute", left: 0, top: 1163, width: 1440, height: 329, objectFit: "cover", opacity: 0.11, pointerEvents: "none" }} decoding="async" loading="lazy" />
        
        {/* Title — centered across full width */}
        <Abs x={0} y={123} w={1440}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 100, lineHeight: 0.9, color: C.storyFg, textAlign: "center", margin: 0 }}>Meet the</p>
              <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 100, lineHeight: 0.9, color: C.storyFg, textAlign: "center", margin: 0 }}>&nbsp;bride and groom</p>
            </div>
          </Reveal>
        </Abs>
        
        {/* Story text — centered across full width */}
        <Abs x={0} y={364} w={1440}>
          <Reveal delay={80}>
            <p style={{ fontFamily: F.serif, fontStyle: "normal", fontSize: 29, lineHeight: 1.5, color: C.storyFg, textAlign: "center", margin: "0 auto", maxWidth: 1054, padding: "0 40px" }}>{story}</p>
          </Reveal>
        </Abs>
        
        {/* Couple photo — centered */}
        <Abs x={0} y={545} w={1440}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 502, height: 872 }}>
              <img src={A.archFrame} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 2, pointerEvents: "none" }} decoding="async" loading="lazy" />
              <div style={{
                position: "absolute",
                top: "2%", left: "2%", width: "96%", height: "96%",
                WebkitMaskImage: `url('${A.coupleMask}')`,
                WebkitMaskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
                maskImage: `url('${A.coupleMask}')`,
                maskSize: "100% 100%", maskRepeat: "no-repeat", maskPosition: "center",
                zIndex: 1,
              }}>
                <img src={couplePhoto} alt={`${groom} & ${bride}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} decoding="async" loading="lazy" />
              </div>
            </div>
          </div>
        </Abs>
      </Section>

      {/* §5 MOMENTS */}
      <MomentsSection
        userData={userData}
        language={language}
        theme={{
          variant: "journal",
          fontHeading: "'Alex Brush', cursive",
          fontBody: F.cg,
          colorHeading: C.crimson,
          colorText: C.crimson,
          colorBg: C.cream,
          polaroidBg: C.white,
          tapeColor: "rgba(157, 39, 18, 0.15)",
        }}
      />

      {/* §6 RSVP */}
      {showRsvp && (
        <div style={{ background: C.white, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "52px 40px 60px" }}>
          <UniversalRSVPForm eventId={eventId ?? ""} theme={rsvpTheme} formConfig={rsvpFields} previewCeremonies={isPreview ? previewCeremonies : undefined} maxWidth="max-w-3xl" />
        </div>
      )}

      {/* §8 FOOTER */}
      <div style={{ background: C.footer, padding: "80px 120px 40px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", width: "1440px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        {/* Couple Signature Block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%", marginBottom: "40px", textAlign: "center" }}>
          <p style={{ fontFamily: F.dm, fontSize: 13, letterSpacing: 6, color: "rgba(255,255,255,0.6)", margin: 0, textTransform: "uppercase" }}>THE WEDDING OF</p>
          <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 56, color: "#FFDDA9", margin: 0, lineHeight: 1 }}>{groom} &amp; {bride}</p>
          
          {/* Heart Divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, width: "400px", margin: "6px 0" }}>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ color: "#FFDDA9", fontSize: 18 }}>♥</span>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.2)" }} />
          </div>
          
          <p style={{ fontFamily: F.cg, fontSize: 20, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.4 }}>
            {wDate ? fmtMobileDate(wDate) : ""} &bull; {venueName}
          </p>
          {contact && (
            <p style={{ fontFamily: F.dm, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0 }}>
              Enquiries: <a href={`mailto:${contact}`} style={{ color: "#FFDDA9", textDecoration: "none" }}>{contact}</a>
            </p>
          )}
        </div>

        {/* Clean Gold-Gradient CSS Divider */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "10px", marginBottom: "40px", gap: "16px" }}>
          <div style={{ height: "1px", width: "180px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25))" }} />
          <span style={{ color: "#FFDDA9", fontSize: "14px", opacity: 0.7 }}>✦</span>
          <div style={{ height: "1px", width: "180px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.25))" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "60px", gap: "80px" }}>
          {/* Brand & CTA */}
          <div style={{ flex: "1 1 40%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: "24px", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
              <img src="/logo/sec_two_white.svg" alt="Invitara Logo" style={{ height: "42px", display: "block" }} decoding="async" loading="lazy" />
            </a>
            <p style={{ fontFamily: F.dm, fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7", margin: "0 0 24px", maxWidth: "420px" }}>
              Beautiful digital invitations for every celebration. Build an experience that your guests will remember.
            </p>
            <p style={{ fontFamily: F.cg, fontStyle: "italic", fontSize: "20px", color: "#FFDDA9", margin: "0 0 20px" }}>
              Create your own elegant invitation today.
            </p>
            <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              background: "#FFDDA9",
              borderRadius: "30px",
              color: C.crimson,
              fontFamily: F.dm,
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.5px",
              transition: "transform 0.2s, background-color 0.2s",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "#FFDDA9"; }}
            >
              Get Started Free <span style={{ fontSize: "16px", fontWeight: "bold" }}>→</span>
            </a>
          </div>

          {/* Luxury Highlights Showcase */}
          <div style={{ flex: "1 1 50%", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px 32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.dm, fontWeight: 600, fontSize: "13px", color: "#FFDDA9", letterSpacing: "1px", margin: 0 }}>✦ CINEMATIC DESIGN</p>
              <p style={{ fontFamily: F.dm, fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5", margin: 0 }}>
                Exquisite, hand-crafted layouts designed to showcase your celebrations on the finest screens.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.dm, fontWeight: 600, fontSize: "13px", color: "#FFDDA9", letterSpacing: "1px", margin: 0 }}>✦ SEAMLESS RSVPS</p>
              <p style={{ fontFamily: F.dm, fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5", margin: 0 }}>
                Track RSVPs, manage guest preferences, and receive warm wishes in real-time.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.dm, fontWeight: 600, fontSize: "13px", color: "#FFDDA9", letterSpacing: "1px", margin: 0 }}>✦ DYNAMIC MAPS</p>
              <p style={{ fontFamily: F.dm, fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5", margin: 0 }}>
                Integrated GPS navigation and detailed schedule maps ensure guests arrive smoothly.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.dm, fontWeight: 600, fontSize: "13px", color: "#FFDDA9", letterSpacing: "1px", margin: 0 }}>✦ SECURE GIFTING</p>
              <p style={{ fontFamily: F.dm, fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5", margin: 0 }}>
                Elegant, integrated registry support for seamless gift registries and direct wishes.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "30px" }} />

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <p style={{ fontFamily: F.dm, fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: 0 }}>© 2026 Invitara. All rights reserved.</p>
            <span style={{ fontFamily: F.dm, fontSize: "13px", color: "rgba(255,255,255,0.2)", margin: 0 }}>|</span>
            <p style={{ fontFamily: F.dm, fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
              A product by <a href="https://3pin.co.in" target="_blank" rel="noopener noreferrer" style={{ color: "#FFDDA9", textDecoration: "none", fontWeight: 500 }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}>3PIN</a>
            </p>
          </div>

          {/* Socials */}
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#FFDDA9"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#FFDDA9"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ROOT COMPONENT — switches between Mobile and Desktop
// ════════════════════════════════════════════════════════════════════════════════
export default function WeddingElegant({ userData, language = "en", enabledAddons = [], isPreview = false, eventId }: InviteProps) {
  const r = (key: string, fb = "") => resolveField(userData[key], language) || fb;

  const showRsvp = enabledAddons.includes("rsvp");

  const groom = r("groomName", "Jagadish");
  const bride = r("brideName", "Madison");
  const wDate = r("wedding_date", "2026-08-27");
  const wTime = r("wedding_time", "10:30");
  const groomParents = r("groomParents", "Mrs. Reena & Mr. Rajiv Kapoor");
  const brideParents = r("brideParents", "Mrs. Shalini & Mr. Aakash Mittal");
  const blessings1 = r("blessingsLine1", "With the heavenly blessings of");
  const blessings2 = r("blessingsLine2", "Smt. Lata Devi & Smt. Kamal Kapoor");
  const couplePhoto = r("couplePhoto") || A.sampleCouple;
  const story = r("coupleStory", "We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our Nichayathartham has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness. We are looking forward to see you at the wedding.");
  const venueName = r("wedding_venue", "The Grand Palace");
  const venueAddr1 = r("venueAddress1", "Juhu Beach Road, Near Juhu Chowpatty,");
  const venueAddr2 = r("venueAddress2", "Mumbai, Maharashtra 400049, India");
  const venueDesc = r("venueDescription", "A magnificent heritage property nestled along the shores of Juhu Beach, offering world-class amenities and breathtaking sea views.");
  const mapsUrl = r("mapsUrl", "#");
  const dirUrl = r("directionsUrl", "#");
  const contact = r("contactEmail", "hello@invitara.in");
  const haldiTime = fmtTime(r("haldi_time", "11:00"));
  const haldiDate = fmtDate(r("haldi_date")) || "March 10th 2026";
  const haldiVenue = r("haldi_venue", "Chennai, Tamilnadu");
  const weddingTime = fmtTime(r("wedding_time", "11:00"));
  const weddingDate = fmtDate(r("wedding_date")) || "March 10th 2026";
  const weddingVenue = r("wedding_venue", "Chennai, Tamilnadu");
  const recepTime = fmtTime(r("reception_time", "11:00"));
  const recepDate = fmtDate(r("reception_date")) || "March 10th 2026";
  const recepVenue = r("reception_venue", "Chennai, Tamilnadu");

  // ── RSVP config (driven by user settings in editor) ───────────────────────
  const rsvpTheme: RSVPThemeConfig = {
    primaryColor: C.crimson,
    textColor: C.crimson,
    backgroundColor: C.white,
    fontFamily: F.cg,
    buttonShape: "rounded-md",
  };

  const rsvpFields: RSVPFieldConfig = {
    requireEmail:    typeof userData.rsvp_requireEmail === "boolean" ? userData.rsvp_requireEmail : false,
    showPhone:       typeof userData.rsvp_showPhone === "boolean" ? userData.rsvp_showPhone : true,
    requirePhone:    typeof userData.rsvp_requirePhone === "boolean" ? userData.rsvp_requirePhone : false,
    showDietary:     typeof userData.rsvp_showDietary === "boolean" ? userData.rsvp_showDietary : true,
    showLeaveMessage: typeof userData.rsvp_showLeaveMessage === "boolean" ? userData.rsvp_showLeaveMessage : true,
    maxGuestsAllowed: typeof userData.rsvp_maxGuests === "number" ? userData.rsvp_maxGuests : 10,
  };

  // ── Build preview ceremonies from userData (for editor live preview) ─────
  const ceremonyDefs = [
    { key: "haldi",     label: "Haldi Ceremony" },
    { key: "mehendi",   label: "Mehendi Night" },
    { key: "wedding",   label: "Wedding Ceremony" },
    { key: "reception", label: "Grand Reception" },
  ];
  const previewCeremonies = ceremonyDefs
    .filter((d) => {
      const date = r(`${d.key}_date`, "");
      const time = r(`${d.key}_time`, "");
      const venue = r(`${d.key}_venue`, "");
      return !!(date || time || venue);
    })
    .map((d) => ({
      id: d.key, // stable key for preview
      name: d.label,
      event_date: r(`${d.key}_date`, "") || null,
      event_time: r(`${d.key}_time`, "") || null,
      venue_name: r(`${d.key}_venue`, "") || null,
    }));

  // ── Shared props object ──────────────────────────────────────────────────
  const sharedProps = { groom, bride, wDate, wTime, groomParents, brideParents, blessings1, blessings2, couplePhoto, story, venueName, venueAddr1, venueAddr2, venueDesc, mapsUrl, dirUrl, contact, haldiTime, haldiDate, haldiVenue, weddingTime, weddingDate, weddingVenue, recepTime, recepDate, recepVenue, showRsvp, eventId, rsvpTheme, rsvpFields, previewCeremonies, isPreview, userData, language };

  // ── Viewport detection ───────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const [contentH, setContentH] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => {
      const w = containerRef.current?.parentElement?.clientWidth || window.innerWidth;
      setIsMobile(w < 768);
      if (w >= 768) setScale(w < 1440 ? w / 1440 : 1);
    };
    check();
    window.addEventListener("resize", check);
    const ro = new ResizeObserver(check);
    if (containerRef.current?.parentElement) ro.observe(containerRef.current.parentElement);
    return () => { window.removeEventListener("resize", check); ro.disconnect(); };
  }, []);

  useEffect(() => {
    if (!isMobile && contentRef.current) setContentH(contentRef.current.scrollHeight);
  }, [scale, isMobile, isPreview, userData]);

  if (isMobile) {
    return (
      <div ref={containerRef} style={{ width: "100%" }}>
        <MobileLayout {...sharedProps} />
      </div>
    );
  }

  // ── Desktop ─────────────────────────────────────────────────────────────────
  // When inside the editor (isPreview=true), the TemplateCanvas already CSS-
  // scales the outer div to fit the panel — so we render at natural size with
  // no extra transform or height clamping to avoid double-scaling.
  if (isPreview) {
    return (
      <div ref={containerRef} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start", background: C.footer }}>
        <DesktopLayout {...sharedProps} scale={1} contentRef={contentRef as React.RefObject<HTMLDivElement>} />
      </div>
    );
  }

  // On the real public invitation page, apply the viewport-fit scale transform.
  return (
    <div ref={containerRef} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start", background: C.footer, height: contentH ? contentH * scale : "auto", overflow: "hidden" }}>
      <DesktopLayout {...sharedProps} scale={scale} contentRef={contentRef as React.RefObject<HTMLDivElement>} />
    </div>
  );
}
