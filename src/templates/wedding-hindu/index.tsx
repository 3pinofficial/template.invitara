"use client";

// ─── Wedding Hindu — Traditional Canvas Layout ────────────────────────────────
// Desktop (≥768px): 1440px canvas with scale() transform — pixel-perfect match
// Mobile (<768px): 402px canvas with scale() transform — pixel-perfect match

import { useEffect, useRef, useState } from "react";
import type { InviteProps, UserData, SupportedLanguage } from "@/types/invite-schema";
import { resolveField } from "@/types/invite-schema";
import { UniversalRSVPForm, type RSVPThemeConfig, type RSVPFieldConfig } from "@/components/rsvp/UniversalRSVPForm";
import { MomentsSection } from "@/components/invite/MomentsSection";
import { BrandFooter } from "@/components/invite/BrandFooter";

// ─── Local Assets ────────────────────────────────────────────────────────────
const getStorageBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/$/, "")}/storage/v1/object/public`;
  }
  return "https://vhhlzktemdywbhsrmsmx.supabase.co/storage/v1/object/public";
};
const STORAGE_BASE = getStorageBaseUrl();
const WB = `${STORAGE_BASE}/invitation-assets/wedding-hindu/default_assets`;

const A = {
  mandalaBg: `${WB}/f76dbcb23388cafb9ee4c955976dff23380d5e51.png`,
  handsHeader: `${WB}/fbe21e5bb3d5a704b70548d00c5843d2765965f8.png`,
  lotus: `${WB}/57f74b2820be5f6a4f181ea320ab96bd493176ab.png`,
  redBgGallery: `${WB}/0ec8f2d2d21ce68a288adf9e530a3f31e93411dc.png`,
  redBgStory: `${WB}/df1c6f8cdfb40ad6c43852c2adfb8026f5cb883a.png`,
  qrCode: `${WB}/0f4d00a8215b1c85f0fcaa25f557f3d264a963a1.png`,
  couplePhotoDefault: `${WB}/d9bd2442a4464f99a2914c8607460646d1b3de8f.png`,
  bottomDiyas: `${WB}/70b2e558d88ffc3e5e56db3b9d1e3a6a71ee3b71.png`,
  cardArchFrame: `${STORAGE_BASE}/invitation-assets/wedding-modern/default_assets/a55bc9d0dde44a079084301b8c798816a4f86d92.png`,
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  maroon: "#9d2712",
  creamGold: "#faf4d2",
  white: "#ffffff",
  cardText: "#faf4d2",
};

const F = {
  serif: "'Cormorant Garamond', Georgia, serif",
  italicSerif: "'Instrument Serif', Georgia, serif",
  sans: "'Jost', 'DM Sans', sans-serif",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Jost:ital,wght@0,100..900;1,100..900&display=swap');

/* Keyframes for Falling Flowers */
@keyframes fallAndFade {
  0% {
    transform: translateY(0px) rotate(var(--start-rot, 0deg)) translateX(0);
    opacity: 0;
  }
  15% {
    opacity: 0.95;
  }
  90% {
    opacity: 0.95;
  }
  100% {
    transform: translateY(110vh) rotate(calc(var(--start-rot, 0deg) + 360deg)) translateX(var(--drift-val, 50px));
    opacity: 0;
  }
}

/* Floating / Swaying Keyframes for Lotuses */
@keyframes floatSway1 {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-7px) rotate(1.5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
@keyframes floatSway2 {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(-1.5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
@keyframes floatSway3 {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-9px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

/* Entrance Animations */
@keyframes lotusPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideDownFade {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes titleEntrance {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Animation Classes */
.animate-hands {
  opacity: 0;
  animation: slideDownFade 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.animate-bride {
  opacity: 0;
  animation: titleEntrance 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}
.animate-weds {
  opacity: 0;
  animation: titleEntrance 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
}
.animate-groom {
  opacity: 0;
  animation: titleEntrance 1.8s cubic-bezier(0.16, 1, 0.3, 1) 1.0s both;
}

.lotus-pop-1 { opacity: 0; animation: lotusPop 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
.lotus-pop-2 { opacity: 0; animation: lotusPop 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
.lotus-pop-3 { opacity: 0; animation: lotusPop 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both; }
.lotus-pop-4 { opacity: 0; animation: lotusPop 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
.lotus-pop-5 { opacity: 0; animation: lotusPop 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both; }
.lotus-pop-6 { opacity: 0; animation: lotusPop 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both; }
.lotus-pop-7 { opacity: 0; animation: lotusPop 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
.lotus-pop-8 { opacity: 0; animation: lotusPop 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both; }
.lotus-pop-9 { opacity: 0; animation: lotusPop 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both; }

.lotus-float-1 { animation: floatSway1 6s ease-in-out infinite; }
.lotus-float-2 { animation: floatSway2 5s ease-in-out infinite; }
.lotus-float-3 { animation: floatSway3 7s ease-in-out infinite; }
.lotus-float-4 { animation: floatSway1 5.5s ease-in-out infinite; }
.lotus-float-5 { animation: floatSway2 6.5s ease-in-out infinite; }
.lotus-float-6 { animation: floatSway3 5.8s ease-in-out infinite; }
.lotus-float-7 { animation: floatSway1 6.2s ease-in-out infinite; }
.lotus-float-8 { animation: floatSway2 7.2s ease-in-out infinite; }
.lotus-float-9 { animation: floatSway3 5.2s ease-in-out infinite; }
`;

// ─── Formatting Helpers ───────────────────────────────────────────────────────
function fmtDate(d: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
}

function fmtTime(t: string) {
  if (!t) return "";
  try {
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  } catch {
    return t;
  }
}

function fmtMobileDate(d: string) {
  if (!d) return "";
  try {
    const dateObj = new Date(d);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[dateObj.getMonth()]} ${dateObj.getDate()} , ${dateObj.getFullYear()}`;
  } catch {
    return d;
  }
}

// ─── Scroll Reveal Animation Component ────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVis(true);
    }, { threshold: 0.04 });
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
        height: "100%",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(18px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Absolute Positioning Helpers ─────────────────────────────────────────────
function Abs({ x = 0, y = 0, w, h, z = 0, children, style }: { x?: number; y?: number; w?: number; h?: number; z?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w ?? "auto", height: h ?? "auto", zIndex: z, ...style }}>
      {children}
    </div>
  );
}

function Section({ h, bg, children, style }: { h: number; bg: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", width: "100%", height: h, background: bg, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

// ─── Sub-Component: Mobile Layout ─────────────────────────────────────────────
function MobileLayout({
  groom, bride, wDate, wTime, groomParents, brideParents, blessings1, blessings2, couplePhoto, story, venueName, venueAddr1, venueAddr2, venueDesc, showRsvp, eventId, rsvpTheme, rsvpFields, scale, contentRef,
  haldiTime, haldiDate, haldiVenue, mehendiTime, mehendiDate, mehendiVenue, recepTime, recepDate, recepVenue,
  previewCeremonies, isPreview, userData, language, contact
}: {
  groom: string; bride: string; wDate: string; wTime: string; groomParents: string; brideParents: string; blessings1: string; blessings2: string; couplePhoto: string; story: string; venueName: string; venueAddr1: string; venueAddr2: string; venueDesc: string; showRsvp: boolean; eventId?: string; rsvpTheme: RSVPThemeConfig; rsvpFields: RSVPFieldConfig; scale: number; contentRef: React.RefObject<HTMLDivElement | null>;
  haldiTime: string; haldiDate: string; haldiVenue: string; mehendiTime: string; mehendiDate: string; mehendiVenue: string; recepTime: string; recepDate: string; recepVenue: string;
  previewCeremonies?: any; isPreview?: boolean; userData: UserData; language: SupportedLanguage; contact: string;
}) {
  const activeEvents = [
    { key: "haldi", name: "Haldi Ceremony", time: haldiTime, date: haldiDate, venue: haldiVenue },
    { key: "mehendi", name: "Mehndi Night", time: mehendiTime, date: mehendiDate, venue: mehendiVenue },
    { key: "wedding", name: "Wedding Ceremony", time: fmtTime(wTime), date: fmtDate(wDate), venue: venueName },
    { key: "reception", name: "Grand Reception", time: recepTime, date: recepDate, venue: recepVenue },
  ].filter(e => e.date || e.time || e.venue);

  const eventSectionHeight = activeEvents.length > 0 ? 250 + activeEvents.length * 490 : 0;

  return (
    <div
      ref={contentRef}
      style={{
        width: 402,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        flexShrink: 0,
        position: "relative",
        background: C.white,
        overflow: "hidden",
      }}
    >
      <style>{FONTS}</style>

      {/* ── SECTION 1: HERO COVER (h: 1748px) ── */}
      <Section h={1748} bg={C.white}>
        {/* Repeating Mandala Backgrounds */}
        <Abs x={-45} y={0} w={492} h={874} z={0}>
          <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} src={A.mandalaBg} />
        </Abs>
        <Abs x={-45} y={874} w={492} h={874} z={0}>
          <div style={{ transform: "rotate(180deg)", width: "100%", height: "100%" }}>
            <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} src={A.mandalaBg} />
          </div>
        </Abs>

        {/* Header Hands Cover */}
        <Abs x={0} y={0} w={402} h={289} z={1}>
          <img className="animate-hands" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} src={A.handsHeader} />
        </Abs>

        {/* Lotus Flowers Surrounding Title */}
        <Abs x={249} y={269} w={115} h={103} z={2}>
          <div style={{ transform: "rotate(-30.02deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-1" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-1" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={68} y={289} w={49} h={44} z={2}>
          <div style={{ transform: "rotate(13.71deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-2" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-2" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={9} y={367} w={84} h={75} z={2}>
          <div style={{ transform: "rotate(-17.99deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-3" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-3" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={251} y={418} w={39} h={35} z={2}>
          <div style={{ transform: "rotate(21.71deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-4" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-4" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={259} y={465} w={100} h={89} z={2}>
          <div style={{ transform: "rotate(-30.02deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-5" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-5" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={143} y={554} w={66} h={59} z={2}>
          <div style={{ transform: "rotate(-2.01deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-6" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-6" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={-55} y={551} w={202} h={180} z={2}>
          <div style={{ transform: "rotate(22.69deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-7" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-7" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={224} y={647} w={154} h={137} z={2}>
          <div style={{ transform: "rotate(-30.02deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-8" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-8" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={31} y={797} w={188} h={168} z={2}>
          <div style={{ transform: "rotate(16.98deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-9" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-9" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>

        {/* Main Title Groom & Bride */}
        <Abs x={0} y={319} w={402} z={3}>
          <p className="animate-bride" style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "80px", color: C.maroon, margin: 0, textAlign: "center", lineHeight: "1" }}>{bride}</p>
        </Abs>
        <Abs x={0} y={416} w={402} z={3}>
          <p className="animate-weds" style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "32px", color: C.maroon, margin: 0, textAlign: "center", lineHeight: "1" }}>weds</p>
        </Abs>
        <Abs x={0} y={447} w={402} z={3}>
          <p className="animate-groom" style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "80px", color: C.maroon, margin: 0, textAlign: "center", lineHeight: "1" }}>{groom}</p>
        </Abs>

        {/* Blessings */}
        <Abs x={20} y={1037} w={362} z={2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "20px", color: C.maroon, margin: 0, textAlign: "center" }}>{blessings1}</p>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "20px", color: C.maroon, margin: 0, textAlign: "center", fontWeight: "bold" }}>{blessings2}</p>
            {/* Divider Line */}
            <div style={{ width: 64, height: 1, backgroundColor: C.maroon, marginTop: 15 }} />
          </div>
        </Abs>

        {/* Invitation Details Block */}
        <Abs x={20} y={1148} w={362} z={2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <p style={{ fontFamily: F.serif, fontSize: "20px", color: C.maroon, margin: 0, textAlign: "center", fontWeight: "bold" }}>{groomParents}</p>
            <p style={{ fontFamily: F.serif, fontSize: "16px", color: C.maroon, margin: 0, textAlign: "center", letterSpacing: 4 }}>INVITE</p>
            <p style={{ fontFamily: F.serif, fontSize: "20px", color: C.maroon, margin: 0, textAlign: "center" }}>You to join us in the wedding celebrations of</p>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "56px", color: C.maroon, margin: "10px 0 0", textAlign: "center", lineHeight: "1.1" }}>{bride}</p>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "32px", color: C.maroon, margin: 0, textAlign: "center" }}>&amp;</p>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "56px", color: C.maroon, margin: 0, textAlign: "center", lineHeight: "1.1" }}>{groom}</p>
            <p style={{ fontFamily: F.serif, fontSize: "20px", color: C.maroon, margin: "10px 0 0", textAlign: "center" }}>Daughter of</p>
            <p style={{ fontFamily: F.serif, fontSize: "20px", color: C.maroon, margin: 0, textAlign: "center", fontWeight: "bold" }}>{brideParents}</p>
          </div>
        </Abs>

        {/* Big Date */}
        {wDate && (
          <Abs x={0} y={1578} w={402} z={3}>
            <p style={{ fontFamily: F.serif, fontWeight: "bold", fontSize: "20px", color: C.maroon, textAlign: "center", margin: 0 }}>
              {fmtMobileDate(wDate)} {wTime ? ` |  ${fmtTime(wTime)}` : ""}
            </p>
          </Abs>
        )}
      </Section>

      {/* ── SECTION 2: EVENTS (h: dynamic) ── */}
      {activeEvents.length > 0 && (
        <Section h={eventSectionHeight + 120} bg={C.maroon} style={{ overflow: "visible" }}>
          {/* Red patterned background */}
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
            <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} src={A.redBgGallery} />
          </div>

          {/* Dynamic transition lotus between cream cover and red events section */}
          <Abs x={107} y={-84} w={188} h={168} z={2}>
            <div className="lotus-pop-4" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-4" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </Abs>

          <Abs x={40} y={90} w={322} z={2}>
            <Reveal>
              <p style={{ fontFamily: F.sans, fontSize: 11, letterSpacing: 4, color: C.cardText, textAlign: "center", textTransform: "uppercase", margin: "0 0 6px", fontWeight: "bold" }}>JOIN THE CELEBRATION</p>
              <p style={{ fontFamily: F.serif, fontSize: 36, color: C.cardText, textAlign: "center", margin: 0, fontWeight: "bold" }}>Wedding Events</p>
              
              <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
                <div style={{ width: 160, height: 1, backgroundColor: C.cardText }} />
              </div>

              <p style={{ fontFamily: F.serif, fontSize: 16, color: C.cardText, textAlign: "center", margin: "12px auto 0", opacity: 0.85, lineHeight: 1.5, maxWidth: 300, fontStyle: "italic" }}>
                Join us as we celebrate the union of two hearts through traditional rituals.
              </p>
            </Reveal>
          </Abs>

          {/* Staggered Event Cards */}
          {activeEvents.map((evt, idx) => {
            const cardY = 230 + idx * 490;
            return (
              <Abs key={evt.key} x={56} y={cardY} w={291} h={471} z={2}>
                <Reveal delay={idx * 80}>
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img src={A.cardArchFrame} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    
                    {/* Floating Lotus instead of modern flowers */}
                    <div className="lotus-float-2" style={{ position: "absolute", left: 46, top: 265, width: 200, height: 160, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                      <img src={A.lotus} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>

                    <div style={{ 
                       position: "absolute", 
                       inset: 0, 
                       display: "flex", 
                       flexDirection: "column", 
                       alignItems: "center", 
                       justifyContent: "flex-start",
                       padding: "124px 24px 24px",
                       textAlign: "center"
                    }}>
                      <p style={{ 
                        fontFamily: F.serif, 
                        fontSize: evt.key === "wedding" ? 34 : 42, 
                        color: C.cardText, 
                        margin: "0 0 16px",
                        lineHeight: 1.1,
                        fontWeight: "bold"
                      }}>
                        {evt.key === "haldi" ? "Haldi" : evt.key === "mehendi" ? "Mehndi" : evt.key === "wedding" ? "Wedding" : "Reception"}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: 22, color: C.cardText, margin: 0, fontWeight: "bold" }}>{evt.time}</p>
                        <p style={{ fontFamily: F.serif, fontSize: 18, color: C.cardText, margin: 0 }}>{evt.date}</p>
                        <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: 18, color: C.cardText, margin: "8px 0 0" }}>{evt.venue}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </Abs>
            );
          })}
        </Section>
      )}

      {/* ── SECTION 3: VENUE (h: 584px) ── */}
      <Section h={584} bg={C.white} style={{ overflow: "visible" }}>
        {/* Background Mandala Cover */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={A.mandalaBg} />
        </div>

        {/* Venue Title, QR Code, Timing Details */}
        <Abs x={0} y={0} w={402} z={2}>
          <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "80px", color: C.maroon, textAlign: "center", margin: 0 }}>Venue</p>
        </Abs>
        <Abs x={119} y={140} w={164} h={164} z={2}>
          <img alt="QR Code" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} src={A.qrCode} />
        </Abs>
        <Abs x={20} y={326} w={362} z={2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "22px", color: C.maroon, textAlign: "center", margin: 0, fontWeight: "bold" }}>{venueName}</p>
              <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "20px", color: C.maroon, textAlign: "center", margin: 0 }}>{venueAddr1}</p>
              {venueAddr2 && <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "20px", color: C.maroon, textAlign: "center", margin: 0 }}>{venueAddr2}</p>}
            </div>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "16px", color: C.maroon, textAlign: "center", margin: 0, lineHeight: "1.4", maxWidth: 320 }}>
              Doors open at 6:00 PM. Guests are requested to be seated by 6:30 PM.
            </p>
          </div>
        </Abs>
        <Abs x={107} y={500} w={188} h={168} z={2}>
          <div className="lotus-pop-6" style={{ width: "100%", height: "100%" }}>
            <div className="lotus-float-6" style={{ width: "100%", height: "100%" }}>
              <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", pointerEvents: "none" }} src={A.lotus} />
            </div>
          </div>
        </Abs>
      </Section>

      {/* ── SECTION 4: STORY (h: 780px) ── */}
      <Section h={780} bg={C.maroon}>
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
          <img alt="" style={{ width: "100%", height: "100%", objectPosition: "bottom", objectFit: "cover", pointerEvents: "none" }} src={A.redBgStory} />
        </div>
        <Abs x={0} y={125} w={402} z={2}>
          <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "44px", color: C.cardText, textAlign: "center", margin: 0, lineHeight: "1" }}>Meet the</p>
          <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "44px", color: C.cardText, textAlign: "center", margin: 0, lineHeight: "1" }}>bride and groom</p>
        </Abs>
        <Abs x={25} y={234} w={352} z={2}>
          <p style={{ fontFamily: F.serif, fontSize: "13px", color: C.cardText, textAlign: "center", margin: 0, lineHeight: "1.5" }}>{story}</p>
        </Abs>
        <Abs x={-38} y={360} w={477} h={343} z={2}>
          {/* Traditional Arch Frame containing the Couple Photo */}
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <img alt="Arch Frame Background" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} src={A.couplePhotoDefault} />
            {couplePhoto && couplePhoto !== A.couplePhotoDefault && (
              <div style={{ position: "absolute", left: "109px", top: "79px", width: "258px", height: "235px", overflow: "hidden", borderRadius: "129px 129px 0 0" }}>
                <img alt="Couple Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={couplePhoto} />
              </div>
            )}
          </div>
        </Abs>
      </Section>

      {/* ── SECTION 5: MOMENTS (Dynamic Height) ── */}
      <div style={{ position: "relative", width: "100%", background: C.white, overflow: "hidden", borderTop: `4px double ${C.maroon}` }}>
        {/* Background Mandala overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.85, pointerEvents: "none" }}>
          <img src={A.mandalaBg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <MomentsSection
            userData={userData}
            language={language}
            theme={{
              variant: "editorial",
              fontHeading: F.serif,
              fontBody: F.sans,
              colorHeading: C.maroon,
              colorText: C.maroon,
              colorBg: "transparent",
              polaroidBg: "#FAF8ED",
              tapeColor: "rgba(157, 39, 18, 0.15)",
            }}
          />
        </div>
      </div>

      {/* ── SECTION 6: RSVP (Dynamic Height) ── */}
      {showRsvp && (
        <div style={{ position: "relative", width: "100%", background: C.white, padding: "60px 24px 0", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
          {/* Background Mandala */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.85, pointerEvents: "none" }}>
            <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={A.mandalaBg} />
          </div>

          {/* Mandalas decoration relative to form */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <Abs x={-53} y={0} w={492} h={396} z={0}>
              <div style={{ transform: "rotate(180deg)", width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={A.mandalaBg} />
              </div>
            </Abs>
            <Abs x={-45} y={317} w={492} h={396} z={0}>
              <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={A.mandalaBg} />
            </Abs>
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 24, marginBottom: "40px" }}>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "48px", color: C.maroon, textAlign: "center", margin: 0 }}>Please RSVP</p>
            
            <div style={{ width: "100%", maxWidth: 352 }}>
              <UniversalRSVPForm
                eventId={eventId ?? ""}
                theme={rsvpTheme}
                formConfig={rsvpFields}
                previewCeremonies={isPreview ? previewCeremonies : undefined}
                isMobile={true}
              />
            </div>

            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "16px", color: C.maroon, textAlign: "center", margin: 0, lineHeight: "1.4", maxWidth: 352 }}>
              Our families are excited that you are able to join us in celebrating what we hope will be one of the happiest days of our lives.
            </p>
          </div>

          {/* Bottom Diyas serving as transition to footer */}
          <div style={{ width: 402, height: 289, position: "relative", zIndex: 1, marginTop: "-40px", marginBottom: "-1px" }}>
            <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} src={A.bottomDiyas} />
          </div>
        </div>
      )}

      {/* ── SECTION 7: FOOTER ── */}
      <BrandFooter
        eventType="wedding"
        heading={`${groom} & ${bride}`}
        date={wDate ? fmtMobileDate(wDate) : ""}
        venue={venueName}
        contact={contact}
        theme={{
          colorBg: C.creamGold,
          colorAccent: C.maroon,
          colorText: C.maroon,
          colorTextMuted: "rgba(157, 39, 18, 0.6)",
          colorTextAccent: C.white,
          fontHeading: F.serif,
          fontBody: F.sans,
        }}
        isMobile={true}
      />
    </div>
  );
}

// ─── Sub-Component: Desktop Layout ────────────────────────────────────────────
function DesktopLayout({
  groom, bride, wDate, wTime, groomParents, brideParents, blessings1, blessings2, couplePhoto, story, venueName, venueAddr1, venueAddr2, venueDesc, showRsvp, eventId, rsvpTheme, rsvpFields, scale, contentRef,
  haldiTime, haldiDate, haldiVenue, mehendiTime, mehendiDate, mehendiVenue, recepTime, recepDate, recepVenue,
  previewCeremonies, isPreview, userData, language, contact
}: {
  groom: string; bride: string; wDate: string; wTime: string; groomParents: string; brideParents: string; blessings1: string; blessings2: string; couplePhoto: string; story: string; venueName: string; venueAddr1: string; venueAddr2: string; venueDesc: string; showRsvp: boolean; eventId?: string; rsvpTheme: RSVPThemeConfig; rsvpFields: RSVPFieldConfig; scale: number; contentRef: React.RefObject<HTMLDivElement | null>;
  haldiTime: string; haldiDate: string; haldiVenue: string; mehendiTime: string; mehendiDate: string; mehendiVenue: string; recepTime: string; recepDate: string; recepVenue: string;
  previewCeremonies?: any; isPreview?: boolean; userData: UserData; language: SupportedLanguage; contact: string;
}) {
  const activeEvents = [
    { key: "haldi", name: "Haldi Ceremony", time: haldiTime, date: haldiDate, venue: haldiVenue },
    { key: "mehendi", name: "Mehndi Night", time: mehendiTime, date: mehendiDate, venue: mehendiVenue },
    { key: "wedding", name: "Wedding Ceremony", time: fmtTime(wTime), date: fmtDate(wDate), venue: venueName },
    { key: "reception", name: "Grand Reception", time: recepTime, date: recepDate, venue: recepVenue },
  ].filter(e => e.date || e.time || e.venue);

  return (
    <div
      ref={contentRef}
      style={{
        width: 1440,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        flexShrink: 0,
        position: "relative",
        background: C.white,
        overflow: "hidden",
      }}
    >
      <style>{FONTS}</style>

      {/* ── SECTION 1: HERO COVER (h: 1800px) ── */}
      <Section h={1800} bg={C.white}>
        {/* Background Mandala Cover */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 1800, pointerEvents: "none", zIndex: 0 }}>
          <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={A.mandalaBg} />
        </div>

        {/* Gathbandhan hands cover header */}
        <Abs x={420} y={0} w={600} h={431} z={1}>
          <img className="animate-hands" alt="" style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} src={A.handsHeader} />
        </Abs>

        {/* Title */}
        <Abs x={0} y={490} w={1440} z={2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p className="animate-bride" style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "120px", color: C.maroon, margin: 0, textAlign: "center", lineHeight: "1" }}>{bride}</p>
            <p className="animate-weds" style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "40px", color: C.maroon, margin: "10px 0", textAlign: "center" }}>weds</p>
            <p className="animate-groom" style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "120px", color: C.maroon, margin: 0, textAlign: "center", lineHeight: "1" }}>{groom}</p>
          </div>
        </Abs>

        {/* Lotuses surrounding title and content */}
        <Abs x={1000} y={200} w={160} h={140} z={2}>
          <div style={{ transform: "rotate(-30deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-1" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-1" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={250} y={240} w={120} h={110} z={2}>
          <div style={{ transform: "rotate(15deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-2" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-2" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={150} y={400} w={180} h={160} z={2}>
          <div style={{ transform: "rotate(-15deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-3" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-3" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={1100} y={450} w={144} h={128} z={2}>
          <div style={{ transform: "rotate(25deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-4" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-4" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={980} y={620} w={200} h={180} z={2}>
          <div style={{ transform: "rotate(-20deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-5" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-5" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={320} y={700} w={150} h={130} z={2}>
          <div style={{ transform: "rotate(10deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-6" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-6" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={50} y={950} w={240} h={210} z={2}>
          <div style={{ transform: "rotate(30deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-7" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-7" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={1150} y={1050} w={260} h={230} z={2}>
          <div style={{ transform: "rotate(-35deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-8" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-8" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={200} y={1300} w={200} h={180} z={2}>
          <div style={{ transform: "rotate(20deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-9" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-9" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>

        {/* Blessings details */}
        <Abs x={0} y={880} w={1440} z={2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "32px", color: C.maroon, margin: 0, textAlign: "center" }}>{blessings1}</p>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "32px", color: C.maroon, margin: 0, textAlign: "center", fontWeight: "bold" }}>{blessings2}</p>
            <div style={{ width: 120, height: 1, backgroundColor: C.maroon, marginTop: 24, marginBottom: 24 }} />
          </div>
        </Abs>

        {/* Invitation Text */}
        <Abs x={0} y={1020} w={1440} z={2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <p style={{ fontFamily: F.serif, fontSize: "28px", color: C.maroon, margin: 0, fontWeight: "bold" }}>{groomParents}</p>
            <p style={{ fontFamily: F.serif, fontSize: "20px", color: C.maroon, margin: 0, letterSpacing: 6 }}>INVITE</p>
            <p style={{ fontFamily: F.serif, fontSize: "26px", color: C.maroon, margin: 0 }}>You to join us in the wedding celebrations of</p>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "72px", color: C.maroon, margin: "10px 0 0", textAlign: "center", lineHeight: "1.1" }}>{bride}</p>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "40px", color: C.maroon, margin: 0, textAlign: "center" }}>&amp;</p>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "72px", color: C.maroon, margin: 0, textAlign: "center", lineHeight: "1.1" }}>{groom}</p>
            <p style={{ fontFamily: F.serif, fontSize: "26px", color: C.maroon, margin: "10px 0 0", textAlign: "center" }}>Daughter of</p>
            <p style={{ fontFamily: F.serif, fontSize: "28px", color: C.maroon, margin: 0, fontWeight: "bold" }}>{brideParents}</p>
          </div>
        </Abs>

        {/* Centered Date Time */}
        {wDate && (
          <Abs x={0} y={1620} w={1440} z={3}>
            <p style={{ fontFamily: F.serif, fontWeight: "bold", fontSize: "32px", color: C.maroon, textAlign: "center", margin: 0, letterSpacing: 2 }}>
              {fmtDate(wDate)} {wTime ? `  |  ${fmtTime(wTime)}` : ""}
            </p>
          </Abs>
        )}
      </Section>

      {/* ── SECTION 2: EVENTS (h: dynamic) ── */}
      {activeEvents.length > 0 && (
        <Section h={activeEvents.length <= 3 ? 1020 : 1620} bg={C.maroon} style={{ overflow: "visible" }}>
          {/* Red patterned background */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: "100%", pointerEvents: "none", zIndex: 0 }}>
            <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={A.redBgGallery} />
          </div>

          {/* Dynamic transition lotus between cream cover and red events section */}
          <Abs x={580} y={-130} w={280} h={250} z={3}>
            <div className="lotus-pop-4" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-4" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} src={A.lotus} />
              </div>
            </div>
          </Abs>

          <Abs x={160} y={150} w={1120} z={2}>
            <Reveal>
              <p style={{ fontFamily: F.sans, fontSize: 14, letterSpacing: 6, color: C.cardText, textAlign: "center", textTransform: "uppercase", margin: "0 0 12px", fontWeight: "bold" }}>JOIN THE CELEBRATION</p>
              <p style={{ fontFamily: F.serif, fontSize: 64, color: C.cardText, textAlign: "center", margin: 0, fontWeight: "bold" }}>Wedding Events</p>
              
              <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <div style={{ width: 340, height: 1, backgroundColor: C.cardText }} />
              </div>

              <p style={{ fontFamily: F.serif, fontSize: 24, color: C.cardText, textAlign: "center", margin: "20px auto 0", opacity: 0.85, lineHeight: 1.5, maxWidth: 900, fontStyle: "italic" }}>
                Join us as we celebrate the union of two hearts through traditional rituals.
              </p>
            </Reveal>
          </Abs>

          <Abs x={120} y={activeEvents.length <= 3 ? 430 : 400} w={1200} z={2}>
            {/* Cards Flex Container */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px 60px",
              flexWrap: "wrap",
              maxWidth: activeEvents.length === 4 ? 700 : 1200,
              margin: "0 auto"
            }}>
              {activeEvents.map((evt, idx) => (
                <div key={evt.key} style={{ width: 320, height: 520, position: "relative" }}>
                  <Reveal delay={idx * 100}>
                    <div style={{ width: "100%", height: "100%", position: "relative" }}>
                      <img src={A.cardArchFrame} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      
                      {/* Floating Lotus at the bottom of the card */}
                      <div className="lotus-float-1" style={{ position: "absolute", left: "15%", bottom: "6%", width: "70%", height: "30%", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                        <img src={A.lotus} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>

                      <div style={{ 
                        position: "absolute", 
                        inset: 0, 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center", 
                        justifyContent: "flex-start",
                        padding: "130px 24px 24px",
                        textAlign: "center"
                      }}>
                        <p style={{ 
                          fontFamily: F.serif, 
                          fontSize: evt.key === "wedding" ? 32 : 40, 
                          color: C.cardText, 
                          margin: "0 0 16px",
                          lineHeight: 1.1,
                          fontWeight: "bold"
                        }}>
                          {evt.key === "haldi" ? "Haldi" : evt.key === "mehendi" ? "Mehndi" : evt.key === "wedding" ? "Wedding" : "Reception"}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: 24, color: C.cardText, margin: 0, fontWeight: "bold" }}>{evt.time}</p>
                          <p style={{ fontFamily: F.serif, fontSize: 18, color: C.cardText, margin: 0 }}>{evt.date}</p>
                          <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: 18, color: C.cardText, margin: "8px 0 0" }}>{evt.venue}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </Abs>
        </Section>
      )}

      {/* ── SECTION 3: VENUE DETAILS (h: 900px) ── */}
      <Section h={900} bg={C.white}>
        {/* Background Mandala Cover */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 900, pointerEvents: "none", zIndex: 0 }}>
          <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={A.mandalaBg} />
        </div>

        {/* Title */}
        <Abs x={0} y={80} w={1440} z={2}>
          <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "90px", color: C.maroon, textAlign: "center", margin: 0 }}>Venue</p>
        </Abs>

        {/* Small floating lotus below title */}
        <Abs x={670} y={190} w={100} h={90} z={2}>
          <div className="lotus-pop-9" style={{ width: "100%", height: "100%" }}>
            <div className="lotus-float-9" style={{ width: "100%", height: "100%" }}>
              <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
            </div>
          </div>
        </Abs>

        {/* Left Card: Location Map QR */}
        <Abs x={280} y={300} w={400} h={480} z={2}>
          <div style={{
            width: "100%",
            height: "100%",
            border: `2px solid ${C.maroon}`,
            borderRadius: "20px",
            boxShadow: "0 15px 35px rgba(157, 39, 18, 0.05)",
            background: C.white,
            padding: "36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <p style={{ fontFamily: F.serif, fontSize: "28px", color: C.maroon, fontWeight: "bold", textAlign: "center", margin: "0 0 24px" }}>Location Map</p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 12, border: `2px dashed ${C.maroon}`, borderRadius: 8, background: C.white, width: 224, height: 224 }}>
              <img alt="QR Code" style={{ width: 200, height: 200, objectFit: "cover" }} src={A.qrCode} />
            </div>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "18px", color: C.maroon, textAlign: "center", margin: "24px 0 0", lineHeight: "1.4" }}>
              Scan the QR code with your phone camera to view directions in Google Maps.
            </p>
          </div>
        </Abs>

        {/* Right Card: Hall Details */}
        <Abs x={760} y={300} w={400} h={480} z={2}>
          <div style={{
            width: "100%",
            height: "100%",
            border: `2px solid ${C.maroon}`,
            borderRadius: "20px",
            boxShadow: "0 15px 35px rgba(157, 39, 18, 0.05)",
            background: C.white,
            padding: "36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <p style={{ fontFamily: F.serif, fontSize: "28px", color: C.maroon, fontWeight: "bold", textAlign: "center", margin: "0 0 24px" }}>Wedding Hall</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 224, gap: 12 }}>
              <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "32px", color: C.maroon, textAlign: "center", margin: 0, fontWeight: "bold" }}>{venueName}</p>
              <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "22px", color: C.maroon, textAlign: "center", margin: 0 }}>{venueAddr1}</p>
              {venueAddr2 && <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "22px", color: C.maroon, textAlign: "center", margin: 0 }}>{venueAddr2}</p>}
            </div>
            <div style={{ width: 120, height: 1, backgroundColor: C.maroon, margin: "12px 0 0" }} />
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "18px", color: C.maroon, textAlign: "center", margin: "16px 0 0", lineHeight: "1.4" }}>
              Doors open at 6:00 PM. Guests are requested to be seated by 6:30 PM.
            </p>
          </div>
        </Abs>

        {/* Side decoration lotuses */}
        <Abs x={80} y={380} w={150} h={130} z={2}>
          <div style={{ transform: "rotate(15deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-5" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-5" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={1210} y={380} w={150} h={130} z={2}>
          <div style={{ transform: "rotate(-15deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-6" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-6" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
      </Section>

      {/* ── SECTION 4: GALLERY & STORY (h: 1000px) ── */}
      <Section h={1000} bg={C.maroon}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 1000, pointerEvents: "none", zIndex: 0 }}>
          <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={A.redBgGallery} />
        </div>

        {/* Left Column: Traditional Arch Frame containing the Couple Photo */}
        <Abs x={100} y={243} w={715} h={514} z={2}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* The default arch frame is used as wrapper */}
            <img alt="Arch Frame Background" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} src={A.couplePhotoDefault} />
            
            {/* Overlay actual photo inside the arch space */}
            {couplePhoto && couplePhoto !== A.couplePhotoDefault && (
              <div
                style={{
                  position: "absolute",
                  left: 163,
                  top: 118,
                  width: 387,
                  height: 352,
                  overflow: "hidden",
                  borderRadius: "193.5px 193.5px 0 0",
                }}
              >
                <img alt="Couple Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={couplePhoto} />
              </div>
            )}
          </div>
        </Abs>

        {/* Right Column: Meet the Bride & Groom + Story */}
        <Abs x={860} y={243} w={480} z={2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 28, color: C.cardText }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontFamily: F.sans, fontSize: 14, letterSpacing: 6, color: C.cardText, textTransform: "uppercase", margin: 0, opacity: 0.85, fontWeight: "bold" }}>THE WEDDING STORY</p>
              <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "64px", color: C.cardText, margin: 0, lineHeight: 1.1 }}>Meet the Bride &amp; Groom</p>
            </div>
            <div style={{ width: 180, height: 1, backgroundColor: C.cardText }} />
            <p style={{ fontFamily: F.serif, fontSize: "20px", color: C.cardText, textAlign: "justify", margin: 0, lineHeight: "1.7", opacity: 0.9 }}>
              {story}
            </p>
            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "26px", color: C.cardText, margin: 0, fontWeight: "bold" }}>
              — {bride} &amp; {groom}
            </p>
          </div>
        </Abs>

        {/* Corner Lotuses */}
        <Abs x={1160} y={80} w={180} h={160} z={2}>
          <div style={{ transform: "rotate(35deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-5" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-5" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={80} y={760} w={180} h={160} z={2}>
          <div style={{ transform: "rotate(-15deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-7" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-7" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
        <Abs x={1160} y={760} w={180} h={160} z={2}>
          <div style={{ transform: "rotate(15deg)", width: "100%", height: "100%" }}>
            <div className="lotus-pop-8" style={{ width: "100%", height: "100%" }}>
              <div className="lotus-float-8" style={{ width: "100%", height: "100%" }}>
                <img alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={A.lotus} />
              </div>
            </div>
          </div>
        </Abs>
      </Section>

      {/* ── DESKTOP MOMENTS SECTION (Dynamic Height) ── */}
      <div style={{ position: "relative", width: "100%", background: C.white, overflow: "hidden", borderTop: `4px double ${C.maroon}` }}>
        {/* Background Mandala overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.85, pointerEvents: "none" }}>
          <img src={A.mandalaBg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "80px 120px" }}>
          <MomentsSection
            userData={userData}
            language={language}
            theme={{
              variant: "editorial",
              fontHeading: F.serif,
              fontBody: F.sans,
              colorHeading: C.maroon,
              colorText: C.maroon,
              colorBg: "transparent",
              polaroidBg: "#FAF8ED",
              tapeColor: "rgba(157, 39, 18, 0.15)",
            }}
          />
        </div>
      </div>

      {/* ── SECTION 5: RSVP (h: 1050px) ── */}
      <Section h={1050} bg={C.maroon}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 1050, pointerEvents: "none", zIndex: 0 }}>
          <img alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={A.redBgStory} />
        </div>

        {/* RSVP Container */}
        <Abs x={320} y={100} w={800} z={2}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              padding: "60px",
              background: "#FAF8ED",
              border: `4px double ${C.maroon}`,
              borderRadius: "20px",
              boxShadow: "0 20px 50px rgba(157, 39, 18, 0.15)",
              position: "relative",
            }}
          >
            {/* Corner Decorative Lotuses */}
            <div className="lotus-float-1" style={{ position: "absolute", left: "-25px", top: "-25px", width: "80px", height: "70px", zIndex: 10, transform: "rotate(-15deg)" }}>
              <img src={A.lotus} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div className="lotus-float-2" style={{ position: "absolute", right: "-25px", top: "-25px", width: "80px", height: "70px", zIndex: 10, transform: "rotate(15deg)" }}>
              <img src={A.lotus} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div className="lotus-float-3" style={{ position: "absolute", left: "-25px", bottom: "-25px", width: "80px", height: "70px", zIndex: 10, transform: "rotate(15deg)" }}>
              <img src={A.lotus} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div className="lotus-float-1" style={{ position: "absolute", right: "-25px", bottom: "-25px", width: "80px", height: "70px", zIndex: 10, transform: "rotate(-15deg)" }}>
              <img src={A.lotus} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <p style={{ fontFamily: F.italicSerif, fontStyle: "italic", fontSize: "64px", color: C.maroon, margin: 0 }}>Please RSVP</p>
            <p style={{ fontFamily: F.serif, fontSize: "18px", color: C.maroon, textAlign: "center", margin: 0, maxWidth: 600, lineHeight: "1.5" }}>
              Our families are excited that you are able to join us in celebrating what we hope will be one of the happiest days of our lives.
            </p>
            
            {showRsvp && (
              <div style={{ width: "100%", maxWidth: 600, marginTop: 20 }}>
                <UniversalRSVPForm
                   eventId={eventId ?? ""}
                   theme={rsvpTheme}
                   formConfig={rsvpFields}
                   previewCeremonies={isPreview ? previewCeremonies : undefined}
                   maxWidth="max-w-2xl"
                />
              </div>
            )}
          </div>
        </Abs>
      </Section>

      {/* ── DESKTOP BRAND FOOTER ── */}
      <BrandFooter
        eventType="wedding"
        heading={`${groom} & ${bride}`}
        date={wDate ? fmtMobileDate(wDate) : ""}
        venue={venueName}
        contact={contact}
        theme={{
          colorBg: C.creamGold,
          colorAccent: C.maroon,
          colorText: C.maroon,
          colorTextMuted: "rgba(157, 39, 18, 0.6)",
          colorTextAccent: C.white,
          fontHeading: F.serif,
          fontBody: F.sans,
        }}
        isMobile={false}
      />
    </div>
  );
}

// ─── Main Component Router ───────────────────────────────────────────────────
export default function WeddingHindu({ userData, language = "en", enabledAddons = [], isPreview = false, eventId }: InviteProps) {
  const r = (key: string, fb = "") => resolveField(userData[key], language) || fb;

  const showRsvp = enabledAddons.includes("rsvp");

  // Editable fields mapping
  const groom = r("groomName", "Jagadish");
  const bride = r("brideName", "Madison");
  const wDate = r("wedding_date", "2026-08-27");
  const wTime = r("wedding_time", "10:30");
  const groomParents = r("groomParents", "Mrs. Reena & Mr. Rajiv Kapoor");
  const brideParents = r("brideParents", "Mrs. Shalini & Mr. Aakash Mittal");
  const blessings1 = r("blessingsLine1", "With the heavenly blessings of");
  const blessings2 = r("blessingsLine2", "Smt. Lata Devi & Sm. Kamal Kapoor");
  const couplePhoto = r("couplePhoto") || A.couplePhotoDefault;
  const story = r("coupleStory", "We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our Nichayathartham has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness. We are looking forward to see you at the wedding.");
  const venueName = r("wedding_venue", "Maheen khanna Wedding Hall");
  const venueAddr1 = r("venueAddress1", "Chennai,");
  const venueAddr2 = r("venueAddress2", "Tamilnadu");
  const venueDesc = r("venueDescription", "A magnificent heritage property offering world-class amenities.");
  const contact = r("contactEmail");

  // Resolved event fields
  const haldiTime = fmtTime(r("haldi_time", "11:00"));
  const haldiDate = fmtDate(r("haldi_date")) || "August 26th 2026";
  const haldiVenue = r("haldi_venue", "Groom's Residence");
  const mehendiTime = fmtTime(r("mehendi_time", "18:00"));
  const mehendiDate = fmtDate(r("mehendi_date")) || "August 26th 2026";
  const mehendiVenue = r("mehendi_venue", "Grand Palace Hall");
  const recepTime = fmtTime(r("reception_time", "19:00"));
  const recepDate = fmtDate(r("reception_date")) || "August 28th 2026";
  const recepVenue = r("reception_venue", "Royal Banquet Hall");

  // RSVP Form Configuration
  const rsvpTheme: RSVPThemeConfig = {
    primaryColor: C.maroon,
    textColor: C.maroon,
    backgroundColor: "#FAF8ED",
    fontFamily: F.sans,
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

  // Previews sync for editor active changes
  const ceremonyDefs = [
    { key: "haldi",     label: "Haldi Ceremony" },
    { key: "mehendi",   label: "Mehndi Night" },
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
      id: d.key,
      name: d.label,
      event_date: r(`${d.key}_date`, "") || null,
      event_time: r(`${d.key}_time`, "") || null,
      venue_name: r(`${d.key}_venue`, "") || null,
    }));

  // Falling flowers state and effect
  interface FallingFlower {
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
    rotation: number;
    drift: number;
  }
  const [fallingFlowers, setFallingFlowers] = useState<FallingFlower[]>([]);
  useEffect(() => {
    const flowers: FallingFlower[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 25 + 15, // 15px to 40px
      duration: Math.random() * 5 + 5, // 5s to 10s
      delay: Math.random() * 3, // 0s to 3s delay
      rotation: Math.random() * 360,
      drift: Math.random() * 120 - 60,
    }));
    setFallingFlowers(flowers);
  }, []);

  // Viewport detect / scaling hooks
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const [contentH, setContentH] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => {
      const w = containerRef.current?.parentElement?.clientWidth || window.innerWidth;
      const isMob = w < 768;
      setIsMobile(isMob);
      if (isMob) {
        setScale(w < 402 ? w / 402 : 1);
      } else {
        setScale(w < 1440 ? w / 1440 : 1);
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

  const sharedProps = {
    groom, bride, wDate, wTime, groomParents, brideParents, blessings1, blessings2, couplePhoto, story, venueName, venueAddr1, venueAddr2, venueDesc, showRsvp, eventId, rsvpTheme, rsvpFields, contentRef, scale,
    haldiTime, haldiDate, haldiVenue, mehendiTime, mehendiDate, mehendiVenue, recepTime, recepDate, recepVenue,
    previewCeremonies, isPreview, userData, language, contact
  };

  const renderFallingFlowers = () => {
    const sizeMultiplier = isMobile ? 1 : 2.5;
    return (
      <>
        {fallingFlowers.map((f) => {
          const finalSize = f.size * sizeMultiplier;
          return (
            <div
              key={f.id}
              style={{
                position: "fixed",
                left: `${f.left}%`,
                top: -finalSize - 20,
                width: finalSize,
                height: finalSize,
                pointerEvents: "none",
                zIndex: 9999,
                opacity: 0,
                animation: `fallAndFade ${f.duration}s linear ${f.delay}s forwards`,
                ...({
                  "--start-rot": `${f.rotation}deg`,
                  "--drift-val": `${f.drift}px`,
                } as any)
              }}
            >
              <img
                src={A.lotus}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          );
        })}
      </>
    );
  };

  if (isMobile) {
    if (isPreview) {
      return (
        <div ref={containerRef} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start", background: C.maroon, position: "relative" }}>
          <MobileLayout {...sharedProps} scale={1} />
          {renderFallingFlowers()}
        </div>
      );
    }
    return (
      <div 
        ref={containerRef} 
        style={{ 
          width: "100%", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "flex-start", 
          background: C.maroon, 
          height: contentH ? contentH * scale : "auto", 
          overflow: "hidden",
          position: "relative"
        }}
      >
        <MobileLayout {...sharedProps} scale={scale} />
        {renderFallingFlowers()}
      </div>
    );
  }

  if (isPreview) {
    return (
      <div ref={containerRef} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start", background: C.maroon, position: "relative" }}>
        <DesktopLayout {...sharedProps} scale={1} />
        {renderFallingFlowers()}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: "100%", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "flex-start", 
        background: C.maroon, 
        height: contentH ? contentH * scale : "auto", 
        overflow: "hidden",
        position: "relative"
      }}
    >
      <DesktopLayout {...sharedProps} scale={scale} />
      {renderFallingFlowers()}
    </div>
  );
}
