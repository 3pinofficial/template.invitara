"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { resolveField } from "@/types/invite-schema";
import type { UserData, SupportedLanguage } from "@/types/invite-schema";

export interface MomentsTheme {
  variant?: "polaroid" | "journal" | "editorial" | "radial" | "filmstrip";
  fontHeading?: string;       // Font for title
  fontBody?: string;          // Font for description
  colorHeading?: string;      // Color of title
  colorText?: string;         // Color of paragraph
  colorBg?: string;           // Section background color
  accentColor?: string;       // Color of dividers / minor elements
  polaroidBg?: string;        // Polaroid card color
  tapeColor?: string;         // Polaroid tape color
  isKids?: boolean;           // Turn on playful features
}

interface MomentsSectionProps {
  userData: UserData;
  language: SupportedLanguage;
  theme: MomentsTheme;
}

export const MomentsSection = memo(function MomentsSection({ userData, language, theme }: MomentsSectionProps) {
  const r = (key: string, fb = "") => resolveField(userData[key], language) || fb;

  // Unsplash fallbacks matching event type (5 photos)
  const defaultImages = theme.isKids
    ? [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517263904838-7fa9ae832350?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600&auto=format&fit=crop",
      ]
    : [
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop",
      ];

  // Robust URL validation to prevent placeholder strings like "Journal 4" or broken relative paths from breaking images
  const getValidPhoto = (key: string, fallback: string) => {
    const value = r(key);
    if (!value) return fallback;
    if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:image/"))) {
      return value;
    }
    return fallback;
  };

  const photo1 = getValidPhoto("moments_photo1", defaultImages[0]);
  const photo2 = getValidPhoto("moments_photo2", defaultImages[1]);
  const photo3 = getValidPhoto("moments_photo3", defaultImages[2]);
  const photo4 = getValidPhoto("moments_photo4", defaultImages[3]);
  const photo5 = getValidPhoto("moments_photo5", defaultImages[4]);

  const defaultDesc = "Life moves quickly, and the little moments we often overlook are the ones that bring the most joy. Pause, breathe, and soak in the present—whether it's a shared laugh, a quiet cup of coffee, or the warmth of the sun.";
  const descriptionText = r("moments_text") || defaultDesc;

  // Resolve layout variant
  const variant = (r("moments_layout") as "polaroid" | "journal" | "editorial" | "radial" | "filmstrip") || theme.variant || "polaroid";

  const fontHeading = variant === "filmstrip"
    ? "'Special Elite', monospace"
    : (theme.fontHeading || "'Alex Brush', cursive");
  const fontBody = theme.fontBody || "inherit";
  const colorHeading = theme.colorHeading || "#A38241";
  const colorText = theme.colorText || "#4B5563";
  const colorBg = theme.colorBg || "transparent";
  const polaroidBg = theme.polaroidBg || "#FFFFFF";
  const tapeColor = theme.tapeColor || "rgba(244, 201, 155, 0.25)";

  const renderSprocketRow = (count = 14) => (
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 12px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "10px",
            height: "14px",
            backgroundColor: colorBg === "transparent" || colorBg === "none" ? "#111111" : colorBg,
            borderRadius: "2px",
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );

  return (
    <section
      style={{
        width: "100%",
        padding: variant === "journal" ? "60px 12px" : "60px 16px",
        background: colorBg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        containerType: "inline-size", // Enable CSS Container Queries!
      }}
    >
      {/* Dynamic Font Imports & Responsive Stylesheet using Container Queries */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@400;700&family=Special+Elite&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@400;700;900&display=swap');

        /* Journal Concrete Grit Texture */
        .journal-texture {
          background-color: #f6f5f0;
          background-image: 
            radial-gradient(rgba(0,0,0,0.04) 0.5px, transparent 0), 
            radial-gradient(rgba(0,0,0,0.02) 0.5px, transparent 0);
          background-size: 8px 8px;
          background-position: 0 0, 4px 4px;
        }

        /* Editorial Light Shadow Play */
        .editorial-shadow-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.08;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M15,0 L30,0 L15,100 L0,100 Z' fill='%23000'/%3E%3Cpath d='M45,0 L65,0 L50,100 L30,100 Z' fill='%23000'/%3E%3Cpath d='M80,0 L95,0 L85,100 L70,100 Z' fill='%23000'/%3E%3C/svg%3E");
          filter: blur(12px);
          pointer-events: none;
          z-index: 1;
        }

        /* Container Query for Mobile view (< 680px width) */
        @container (max-width: 680px) {
          .moments-title-container {
            margin-bottom: 20px !important;
          }
          .moments-title-text {
            font-size: ${variant === "filmstrip" ? "26px" : "44px"} !important;
          }

          /* 1. Journal Mobile Collage (Scaled absolute collage for high fidelity) */
          .journal-desktop-grid {
            display: none !important;
          }
          .journal-mobile-collage {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            max-width: 380px !important;
            height: 660px !important;
            margin: 0 auto !important;
          }

          /* 2. Editorial Mobile Layout (Scaled grid + layout box) */
          .editorial-desktop-row {
            flex-direction: column !important;
            align-items: center !important;
            gap: 32px !important;
          }
          .editorial-sidebar-col {
            width: 100% !important;
            max-width: 380px !important;
            text-align: center !important;
            align-items: center !important;
          }
          .editorial-sidebar-col h2 {
            font-size: 30px !important;
          }
          .editorial-sidebar-col p {
            font-size: 28px !important;
          }
          .editorial-dark-card {
            padding: 20px !important;
            gap: 14px !important;
          }
          .editorial-dark-card p {
            font-size: 12px !important;
          }
          .editorial-dark-card span {
            font-size: 32px !important;
          }
          .editorial-collage-col {
            width: 100% !important;
            max-width: 380px !important;
            height: 400px !important;
          }
          .editorial-card-wrapper {
            border-width: 4px !important;
          }

          /* 3. Radial Mobile Fan (Centered and scaled) */
          .radial-desktop-row {
            flex-direction: column !important;
            align-items: center !important;
            gap: 32px !important;
          }
          .radial-info-col {
            width: 100% !important;
            max-width: 380px !important;
            text-align: center !important;
            align-items: center !important;
          }
          .radial-info-col h2 {
            font-size: 24px !important;
          }
          .radial-info-col .divider-line {
            margin: 0 auto !important;
          }
          .radial-collage-col {
            width: 300px !important;
            height: 300px !important;
          }
          .radial-outer-ring {
            width: 280px !important;
            height: 280px !important;
            right: 50% !important;
            transform: translateX(50%) !important;
          }
          .radial-wheel-mask {
            width: 270px !important;
            height: 270px !important;
            right: 50% !important;
            transform: translateX(50%) !important;
          }
          .radial-center-badge {
            width: 36px !important;
            height: 36px !important;
            font-size: 10px !important;
            right: 50% !important;
            transform: translate(135px, -50%) !important;
          }

          /* 4. Polaroid Mobile Grid */
          .polaroid-grid {
            gap: 16px !important;
          }
          .polaroid-card {
            width: 44% !important;
            min-width: 145px !important;
            padding: 8px 8px 24px 8px !important;
            transform: rotate(var(--mobile-rot)) !important;
          }
          .polaroid-card img {
            height: 140px !important;
          }
          .polaroid-card div {
            font-size: 14px !important;
            margin-top: 6px !important;
          }

          /* 5. Filmstrip Mobile Carousel */
          .filmstrip-scroll-wrapper {
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            justify-content: flex-start !important;
            padding: 10px 16px 20px !important;
            width: 100% !important;
            -webkit-overflow-scrolling: touch;
          }
          .filmstrip-item {
            flex-shrink: 0 !important;
            width: 160px !important;
          }
        }
      ` }} />

      {/* Title block (Skip for radial, editorial and journal which have custom integrated headers) */}
      {variant !== "radial" && variant !== "editorial" && variant !== "journal" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="moments-title-container"
          style={{ textAlign: "center", marginBottom: "36px", zIndex: 2 }}
        >
          <h2
            className="moments-title-text"
            style={{
              fontFamily: fontHeading,
              fontSize: variant === "filmstrip" ? "36px" : "64px",
              color: colorHeading,
              margin: 0,
              fontWeight: "normal",
              lineHeight: 1.1,
              letterSpacing: variant === "filmstrip" ? "4px" : "normal",
              textTransform: variant === "filmstrip" ? "uppercase" : "none",
            }}
          >
            {variant === "filmstrip" ? "Captured Moments" : "enjoy every moment."}
          </h2>
        </motion.div>
      )}

      {/* ── DESIGN 1: POLAROID GRID (3 Photos) ── */}
      {variant === "polaroid" && (
        <div
          className="polaroid-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: "900px",
            marginBottom: "40px",
            zIndex: 2,
          }}
        >
          {[
            { img: photo1, rot: -4, mRot: -2, label: "the best day" },
            { img: photo2, rot: 3, mRot: 2, label: "favorite memory" },
            { img: photo3, rot: -2, mRot: -1, label: "happy together" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 10, boxShadow: "0 20px 45px rgba(0,0,0,0.18)" }}
              className="polaroid-card"
              style={{
                background: polaroidBg,
                padding: "14px 14px 40px 14px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                borderRadius: "4px",
                width: "230px",
                position: "relative",
                cursor: "pointer",
                border: "1px solid rgba(0,0,0,0.04)",
                transform: `rotate(${item.rot}deg)`,
                ["--mobile-rot" as any]: `${item.mRot}deg`,
              }}
            >
              {/* Tape Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: `translateX(-50%) rotate(${idx % 2 === 0 ? -4 : 4}deg)`,
                  width: "65px",
                  height: "22px",
                  backgroundColor: tapeColor,
                  backdropFilter: "blur(1px)",
                  borderLeft: "2px dashed rgba(0,0,0,0.08)",
                  borderRight: "2px dashed rgba(0,0,0,0.08)",
                  zIndex: 3,
                }}
              />
              <div style={{ width: "100%", height: "180px", overflow: "hidden", borderRadius: "2px", background: "#f3f4f6" }}>
                <img src={item.img} alt={`Moment ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
              <div
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "18px",
                  color: colorText,
                  textAlign: "center",
                  marginTop: "12px",
                }}
              >
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── DESIGN 2: JOURNAL SCRAPBOOK (5 Photos) ── */}
      {variant === "journal" && (
        <div style={{ width: "100%", maxWidth: "800px", zIndex: 2, padding: "40px 16px", borderRadius: "8px", boxShadow: "inset 0 0 40px rgba(0,0,0,0.02)" }} className="journal-texture">
          
          {/* DESKTOP COLLAGE VIEW */}
          <div
            className="journal-desktop-grid"
            style={{
              position: "relative",
              width: "100%",
              height: "780px",
              margin: "0 auto",
            }}
          >
            {/* Photo 1 (Top Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30, rotate: -4 }}
              whileInView={{ opacity: 1, x: 0, rotate: -2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, zIndex: 5, boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}
              style={{
                position: "absolute",
                left: "4%",
                top: "30px",
                width: "210px",
                padding: "10px 10px 14px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              <div style={{
                position: "absolute", top: "-10px", left: "20%", transform: "rotate(-1deg)",
                background: "rgba(186, 204, 212, 0.8)", padding: "2px 8px", color: "#1e293b",
                fontFamily: "monospace", fontSize: "10px", fontWeight: "bold", letterSpacing: "0.5px",
                borderRadius: "1px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", zIndex: 4
              }}>
                Absolute serenity
              </div>
              <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden", borderRadius: "1px" }}>
                <img src={photo1} alt="Journal 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </motion.div>

            {/* Cursive Text top right */}
            <div style={{ position: "absolute", right: "6%", top: "20px", width: "230px" }}>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "18px", lineHeight: "1.4", color: colorText, margin: "0 0 10px" }}>
                Running hand in hand, chasing waves and dreams together.
              </p>
              
              {/* Photo 2 (Top Right Card) */}
              <motion.div
                initial={{ opacity: 0, x: 30, rotate: 3 }}
                whileInView={{ opacity: 1, x: 0, rotate: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, zIndex: 5, boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}
                style={{
                  width: "100%",
                  padding: "10px 10px 14px",
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", borderRadius: "1px" }}>
                  <img src={photo2} alt="Journal 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
                </div>
              </motion.div>
            </div>

            {/* Sticker Stamp "the best day" (Center) */}
            <div style={{ position: "absolute", left: "42%", top: "260px", zIndex: 4, transform: "rotate(-10deg) translate(-50%, -50%)", pointerEvents: "none" }}>
              <div style={{
                background: "rgba(244, 201, 155, 0.65)", padding: "8px 24px", borderRadius: "20px 4px 24px 6px",
                fontFamily: "'Alex Brush', cursive", fontSize: "28px", color: colorHeading, fontWeight: "bold",
                whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
              }}>
                the best day
              </div>
            </div>

            {/* Photo 3 (Center Card) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, zIndex: 5, boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}
              style={{
                position: "absolute",
                left: "37%",
                top: "320px",
                width: "210px",
                padding: "10px 10px 14px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                borderRadius: "2px",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              <div style={{ width: "100%", aspectRatio: "1:1", overflow: "hidden", borderRadius: "1px" }}>
                <img src={photo3} alt="Journal 3" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </motion.div>

            {/* Photo 4 (Bottom Left) */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: -1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, zIndex: 5, boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}
              style={{
                position: "absolute",
                left: "8%",
                top: "430px",
                width: "220px",
                padding: "10px 10px 14px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                borderRadius: "2px",
                cursor: "pointer",
                zIndex: 1,
              }}
            >
              <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden", borderRadius: "1px" }}>
                <img src={photo4} alt="Journal 4" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </motion.div>

            {/* Description Text Bottom Center */}
            <div style={{ position: "absolute", left: "38%", top: "580px", width: "220px", textAlign: "left" }}>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "18px", lineHeight: "1.4", color: colorText, margin: "0 0 10px" }}>
                Every moment is a treasure, and laughter is the best currency.
              </p>
              <div style={{
                display: "inline-block", background: "rgba(186, 204, 212, 0.8)", padding: "4px 12px",
                color: "#1e293b", fontFamily: "monospace", fontSize: "11px", fontWeight: "bold", borderRadius: "1px"
              }}>
                Perfect happiness
              </div>
            </div>

            {/* Photo 5 (Bottom Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 2 }}
              whileInView={{ opacity: 1, x: 0, rotate: -2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, zIndex: 5, boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}
              style={{
                position: "absolute",
                right: "6%",
                top: "460px",
                width: "200px",
                padding: "10px 10px 14px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                borderRadius: "2px",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              <div style={{ width: "100%", aspectRatio: "1:1", overflow: "hidden", borderRadius: "1px" }}>
                <img src={photo5} alt="Journal 5" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </motion.div>

            {/* Sticker Blob Bottom Right */}
            <div style={{ position: "absolute", right: "4%", bottom: "30px", zIndex: 3, transform: "rotate(6deg)", pointerEvents: "none" }}>
              <div style={{
                background: "rgba(224, 204, 192, 0.7)", padding: "8px 16px", borderRadius: "6px 20px 8px 16px",
                fontFamily: "'Alex Brush', cursive", fontSize: "24px", color: colorHeading, textAlign: "center", lineHeight: 1.1
              }}>
                Favorite<br />
                <span style={{ fontSize: "18px" }}>moment</span>
              </div>
            </div>

            {/* Title center bottom */}
            <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", width: "100%", textAlign: "center" }}>
              <h3 style={{ fontFamily: "'Alex Brush', cursive", fontSize: "48px", color: colorHeading, margin: 0, fontWeight: "normal" }}>
                Moments of the year
              </h3>
            </div>
          </div>

          {/* MOBILE COLLAGE VIEW */}
          <div className="journal-mobile-collage" style={{ display: "none" }}>
            <div style={{ position: "absolute", left: "4%", top: "15px", width: "43%", padding: "6px 6px 10px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 10px rgba(0,0,0,0.04)", borderRadius: "2px", transform: "rotate(-3deg)" }}>
              <div style={{ position: "absolute", top: "-8px", left: "10%", background: "rgba(186, 204, 212, 0.85)", padding: "1px 6px", color: "#1e293b", fontFamily: "monospace", fontSize: "8px", fontWeight: "bold", borderRadius: "1px", zIndex: 3 }}>
                Absolute serenity
              </div>
              <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden" }}>
                <img src={photo1} alt="Journal 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </div>

            <div style={{ position: "absolute", right: "4%", top: "10px", width: "45%", textAlign: "left" }}>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", lineHeight: "1.3", color: colorText, margin: 0 }}>
                Running hand in hand, chasing waves and dreams together.
              </p>
            </div>

            <div style={{ position: "absolute", right: "4%", top: "70px", width: "45%", padding: "6px 6px 10px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 10px rgba(0,0,0,0.04)", borderRadius: "2px", transform: "rotate(2deg)" }}>
              <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
                <img src={photo2} alt="Journal 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </div>

            <div style={{ position: "absolute", left: "50%", top: "205px", transform: "translate(-50%, -50%) rotate(-8deg)", zIndex: 4, pointerEvents: "none" }}>
              <div style={{ background: "rgba(244, 201, 155, 0.75)", padding: "4px 14px", borderRadius: "14px 4px 16px 4px", fontFamily: "'Alex Brush', cursive", fontSize: "18px", color: colorHeading, fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.04)", whiteSpace: "nowrap" }}>
                the best day
              </div>
            </div>

            <div style={{ position: "absolute", left: "28%", top: "225px", width: "44%", padding: "6px 6px 10px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 15px rgba(0,0,0,0.06)", borderRadius: "2px", transform: "rotate(-1deg)", zIndex: 2 }}>
              <div style={{ width: "100%", aspectRatio: "1:1", overflow: "hidden" }}>
                <img src={photo3} alt="Journal 3" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </div>

            <div style={{ position: "absolute", left: "4%", top: "375px", width: "44%", textAlign: "left" }}>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", lineHeight: "1.3", color: colorText, margin: "0 0 4px" }}>
                Every moment is a treasure, and laughter is the best currency.
              </p>
              <div style={{ display: "inline-block", background: "rgba(186, 204, 212, 0.85)", padding: "1px 6px", color: "#1e293b", fontFamily: "monospace", fontSize: "8px", fontWeight: "bold", borderRadius: "1px" }}>
                Perfect happiness
              </div>
            </div>

            <div style={{ position: "absolute", left: "4%", top: "435px", width: "43%", padding: "6px 6px 10px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 10px rgba(0,0,0,0.04)", borderRadius: "2px", transform: "rotate(3deg)" }}>
              <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden" }}>
                <img src={photo4} alt="Journal 4" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </div>

            <div style={{ position: "absolute", right: "4%", top: "425px", width: "44%", padding: "6px 6px 10px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 10px rgba(0,0,0,0.04)", borderRadius: "2px", transform: "rotate(-3deg)", zIndex: 1 }}>
              <div style={{ width: "100%", aspectRatio: "1:1", overflow: "hidden" }}>
                <img src={photo5} alt="Journal 5" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </div>

            <div style={{ position: "absolute", right: "4%", top: "545px", zIndex: 3, transform: "rotate(5deg)", pointerEvents: "none" }}>
              <div style={{ background: "rgba(224, 204, 192, 0.75)", padding: "4px 10px", borderRadius: "4px 12px 4px 10px", fontFamily: "'Alex Brush', cursive", fontSize: "16px", color: colorHeading, textAlign: "center", lineHeight: 1.1 }}>
                Favorite moment
              </div>
            </div>

            <div style={{ position: "absolute", bottom: "10px", left: "0", width: "100%", textAlign: "center" }}>
              <h3 style={{ fontFamily: "'Alex Brush', cursive", fontSize: "32px", color: colorHeading, margin: 0, fontWeight: "normal" }}>
                Moments of the year
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* ── RETRO EDITORIAL POSTER ── */}
      {variant === "editorial" && (
        <div
          className="editorial-desktop-row"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "40px",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
            maxWidth: "960px",
            marginBottom: "30px",
            zIndex: 2,
            position: "relative",
          }}
        >
          <div className="editorial-shadow-overlay" />

          <div
            className="editorial-sidebar-col"
            style={{
              width: "300px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              textAlign: "left",
              flexShrink: 0,
            }}
          >
            <div>
              <p style={{ fontFamily: "'Alex Brush', cursive", fontSize: "36px", color: colorHeading, margin: "0 0 -8px 0", lineHeight: 1 }}>The old</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "38px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "3px", color: colorHeading, margin: 0, lineHeight: 1.1 }}>Memories</h2>
            </div>

            <div
              className="editorial-dark-card"
              style={{
                background: "#222222",
                color: "#ffffff",
                padding: "28px 24px",
                borderRadius: "4px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <p style={{ fontFamily: fontBody, fontSize: "13px", lineHeight: "1.7", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                {descriptionText}
              </p>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "44px",
                  fontWeight: "bold",
                  lineHeight: 1,
                  color: colorHeading,
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                  paddingTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>2026</span>
                <span style={{ fontSize: "14px", fontFamily: "sans-serif", fontWeight: "normal", opacity: 0.5 }}>EST.</span>
              </div>
            </div>
          </div>

          <div
            className="editorial-collage-col"
            style={{
              position: "relative",
              width: "520px",
              height: "440px",
              flexShrink: 0,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ zIndex: 6, scale: 1.02 }}
              className="editorial-card-wrapper"
              style={{
                position: "absolute",
                top: "0px",
                right: "10px",
                width: "280px",
                height: "210px",
                zIndex: 2,
                cursor: "pointer",
              }}
            >
              <div style={{ position: "absolute", top: "10px", left: "10px", right: "-10px", bottom: "-10px", background: "#ffffff", boxShadow: "0 6px 15px rgba(0,0,0,0.06)", borderRadius: "2px", zIndex: -1 }} />
              <div style={{ width: "100%", height: "100%", border: "8px solid #ffffff", overflow: "hidden", background: "#f3f4f6" }}>
                <img src={photo1} alt="Editorial 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ zIndex: 6, scale: 1.02 }}
              className="editorial-card-wrapper"
              style={{
                position: "absolute",
                top: "130px",
                left: "10px",
                width: "230px",
                height: "160px",
                zIndex: 4,
                cursor: "pointer",
              }}
            >
              <div style={{ position: "absolute", top: "-8px", left: "-8px", right: "8px", bottom: "8px", background: "#ffffff", boxShadow: "0 6px 15px rgba(0,0,0,0.06)", borderRadius: "2px", zIndex: -1 }} />
              <div style={{ width: "100%", height: "100%", border: "8px solid #ffffff", overflow: "hidden", background: "#f3f4f6" }}>
                <img src={photo2} alt="Editorial 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ zIndex: 6, scale: 1.02 }}
              className="editorial-card-wrapper"
              style={{
                position: "absolute",
                top: "220px",
                right: "40px",
                width: "210px",
                height: "200px",
                zIndex: 3,
                cursor: "pointer",
              }}
            >
              <div style={{ position: "absolute", top: "10px", left: "-10px", right: "10px", bottom: "-10px", background: "#ffffff", boxShadow: "0 6px 15px rgba(0,0,0,0.06)", borderRadius: "2px", zIndex: -1 }} />
              <div style={{ width: "100%", height: "100%", border: "8px solid #ffffff", overflow: "hidden", background: "#f3f4f6" }}>
                <img src={photo3} alt="Editorial 3" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </motion.div>

            <div
              className="editorial-card-wrapper"
              style={{
                position: "absolute",
                bottom: "20px",
                left: "40px",
                width: "70px",
                height: "100px",
                background: "#222222",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                zIndex: 4,
                fontFamily: "'Playfair Display', serif",
                fontSize: "24px",
                fontWeight: "bold",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                letterSpacing: "4px",
                borderRadius: "2px",
              }}
            >
              2026
            </div>
          </div>
        </div>
      )}

      {/* ── RADIAL ARC FAN ── */}
      {variant === "radial" && (
        <div
          className="radial-desktop-row"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "40px",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: "960px",
            marginBottom: "30px",
            zIndex: 2,
          }}
        >
          <div
            className="radial-info-col"
            style={{
              width: "300px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "30px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: colorHeading,
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Captured Love<br />&amp; Moments
            </h2>
            <div className="divider-line" style={{ width: "60px", height: "4px", backgroundColor: "#EAB308" }} />
            <p style={{ fontFamily: fontBody, fontSize: "14px", lineHeight: "1.7", color: colorText, margin: 0 }}>
              {descriptionText}
            </p>
            <div style={{ marginTop: "12px", fontFamily: "'Outfit', sans-serif", fontSize: "11px", color: colorText, opacity: 0.6, letterSpacing: "1px", textTransform: "uppercase" }}>
              From Planning to Marriage &bull; Est. 2026
            </div>
          </div>

          <div
            className="radial-collage-col"
            style={{
              position: "relative",
              width: "500px",
              height: "500px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="radial-outer-ring"
              style={{
                position: "absolute",
                right: "0px",
                width: "480px",
                height: "480px",
                borderRadius: "50%",
                border: "2px dashed rgba(0,0,0,0.1)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            <div
              className="radial-wheel-mask"
              style={{
                position: "absolute",
                right: "0px",
                width: "460px",
                height: "460px",
                borderRadius: "50% 0 0 50%",
                overflow: "hidden",
                zIndex: 1,
              }}
            >
              <motion.div
                initial={{ opacity: 0, rotate: -15 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  clipPath: "polygon(100% 50%, 100% 0, 0 0, 0 30%)",
                  cursor: "pointer",
                }}
              >
                <img src={photo1} alt="Radial 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  clipPath: "polygon(100% 50%, 0 34%, 0 66%)",
                  cursor: "pointer",
                }}
              >
                <img src={photo2} alt="Radial 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: 15 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  clipPath: "polygon(100% 50%, 0 70%, 0 100%, 100% 100%)",
                  cursor: "pointer",
                }}
              >
                <img src={photo3} alt="Radial 3" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </motion.div>
            </div>

            <div
              className="radial-center-badge"
              style={{
                position: "absolute",
                right: "-20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#EAB308",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 5,
                color: "#ffffff",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              2026
            </div>
          </div>
        </div>
      )}

      {/* ── RETRO FILMSTRIP CAROUSEL ── */}
      {variant === "filmstrip" && (
        <div
          style={{
            width: "100%",
            maxWidth: "760px",
            background: "#161616",
            padding: "20px 0 24px",
            borderRadius: "8px",
            boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "30px",
            zIndex: 2,
          }}
        >
          {renderSprocketRow(11)}

          <div
            className="filmstrip-scroll-wrapper"
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 20px",
            }}
          >
            {[photo1, photo2, photo3].map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="filmstrip-item"
                style={{
                  width: "180px",
                  background: "#000000",
                  padding: "10px 10px 18px",
                  borderRadius: "2px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ width: "100%", height: "130px", overflow: "hidden", background: "#333333", border: "1px solid #222222" }}>
                  <img src={img} alt={`Film frame ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.08) sepia(0.12)" }} decoding="async" loading="lazy" />
                </div>
                <span
                  style={{
                    fontFamily: "'Special Elite', monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.6)",
                    letterSpacing: "2px",
                    marginTop: "10px",
                  }}
                >
                  ROLL #01 / FRM_{String(idx + 1).padStart(2, "0")}
                </span>
              </motion.div>
            ))}
          </div>

          {renderSprocketRow(11)}
        </div>
      )}

      {/* Description Text block */}
      {(variant === "polaroid" || variant === "filmstrip") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            maxWidth: "580px",
            width: "100%",
            textAlign: "center",
            padding: "0 16px",
            zIndex: 2,
          }}
        >
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "13px",
              color: colorText,
              lineHeight: 1.8,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              margin: 0,
              opacity: 0.85,
            }}
          >
            {descriptionText}
          </p>
        </motion.div>
      )}
    </section>
  );
}, (prevProps, nextProps) => {
  const prevR = (key: string) => resolveField(prevProps.userData[key], prevProps.language);
  const nextR = (key: string) => resolveField(nextProps.userData[key], nextProps.language);

  const keys = [
    "moments_layout",
    "moments_photo1",
    "moments_photo2",
    "moments_photo3",
    "moments_photo4",
    "moments_photo5",
    "moments_text"
  ];

  const momentsEqual = keys.every(k => prevR(k) === nextR(k));
  const langEqual = prevProps.language === nextProps.language;
  const themeEqual = 
    prevProps.theme.variant === nextProps.theme.variant &&
    prevProps.theme.fontHeading === nextProps.theme.fontHeading &&
    prevProps.theme.fontBody === nextProps.theme.fontBody &&
    prevProps.theme.colorHeading === nextProps.theme.colorHeading &&
    prevProps.theme.colorText === nextProps.theme.colorText &&
    prevProps.theme.colorBg === nextProps.theme.colorBg;

  return momentsEqual && langEqual && themeEqual;
});
