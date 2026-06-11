"use client";

import { memo } from "react";

export interface BrandFooterTheme {
  colorBg?: string;           // background of footer
  colorAccent?: string;       // gold/peach/cream accent color
  colorText?: string;         // primary text color
  colorTextMuted?: string;    // muted/secondary text color
  colorTextAccent?: string;   // text color on top of button
  fontHeading?: string;       // font family for serif headings
  fontBody?: string;          // font family for body texts
  logoColor?: "white" | "black"; // Optional: logo color
}

export interface BrandFooterProps {
  eventType?: "wedding" | "birthday" | "party" | "corporate" | "other";
  title?: string;             // e.g. "THE WEDDING OF"
  heading?: string;           // e.g. "Groom & Bride" / "Aarav's 5th Birthday"
  date?: string;              // formatted event date
  venue?: string;             // venue name/address
  contact?: string;           // contact email or phone
  theme?: BrandFooterTheme;
  isMobile?: boolean;
}

export const BrandFooter = memo(function BrandFooter({
  eventType = "wedding",
  title,
  heading,
  date,
  venue,
  contact,
  theme = {},
  isMobile = true,
}: BrandFooterProps) {
  // Default themes
  const colorBg = theme.colorBg || "#9d2712";
  const colorAccent = theme.colorAccent || "#faf4d2";
  const colorText = theme.colorText || "rgba(255, 255, 255, 0.85)";
  const colorTextMuted = theme.colorTextMuted || "rgba(255, 255, 255, 0.5)";
  const colorTextAccent = theme.colorTextAccent || "#9d2712";
  const fontHeading = theme.fontHeading || "Georgia, serif";
  const fontBody = theme.fontBody || "sans-serif";
  const logoColor = theme.logoColor || (colorBg.toLowerCase() === "#faf8ed" || colorBg.toLowerCase() === "#faf4d2" ? "black" : "white");
  const logoSrc = logoColor === "black" ? "/logo/sec_two_black.svg" : "/logo/sec_two_white.svg";

  // Default title
  const defaultTitle = eventType === "wedding" 
    ? "THE WEDDING OF" 
    : eventType === "birthday" 
    ? "THE BIRTHDAY OF" 
    : "CELEBRATING THE EVENT OF";
  
  const displayTitle = title || defaultTitle;

  // Event symbol for divider/ornament
  const dividerSymbol = eventType === "wedding" ? "♥" : eventType === "birthday" ? "★" : "✦";

  if (isMobile) {
    return (
      <div style={{ background: colorBg, padding: "32px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)", gap: 20, textAlign: "center" }}>
        {/* Couple/Host Signature Block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
          <p style={{ fontFamily: fontBody, fontSize: 10, letterSpacing: 4, color: colorTextMuted, margin: 0, textTransform: "uppercase" }}>{displayTitle}</p>
          <p style={{ fontFamily: fontHeading, fontStyle: "italic", fontSize: 32, color: colorAccent, margin: 0, lineHeight: 1 }}>{heading}</p>
          
          {/* Heart/Star Divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "60%", margin: "2px 0" }}>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.15)" }} />
            <span style={{ color: colorAccent, fontSize: 12, lineHeight: 1 }}>{dividerSymbol}</span>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.15)" }} />
          </div>
          
          {(date || venue) && (
            <p style={{ fontFamily: fontHeading, fontSize: 13, color: colorText, margin: 0, lineHeight: 1.3 }}>
              {date} {date && venue ? " • " : ""} {venue}
            </p>
          )}
          {contact && (
            <p style={{ fontFamily: fontBody, fontSize: 11, color: colorTextMuted, margin: 0 }}>
              Enquiries: <a href={`mailto:${contact}`} style={{ color: colorAccent, textDecoration: "none" }}>{contact}</a>
            </p>
          )}
        </div>

        {/* Clean Gold-Gradient CSS Divider */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", margin: "8px 0", gap: "12px" }}>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2))" }} />
          <span style={{ color: colorAccent, fontSize: "10px", opacity: 0.6 }}>✦</span>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.2))" }} />
        </div>

        {/* Brand & CTA Group */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
          <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", transition: "opacity 0.2s" }}>
            <img src={logoSrc} alt="Invitara Logo" style={{ height: "30px", display: "block" }} decoding="async" loading="lazy" />
          </a>
          
          <p style={{ fontFamily: fontBody, fontSize: "12px", color: colorText, opacity: 0.8, lineHeight: "1.5", margin: "0 auto", maxWidth: "260px" }}>
            Beautiful digital invitations for every celebration. Build an experience that your guests will cherish forever.
          </p>

          <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 20px",
            background: colorAccent,
            borderRadius: "20px",
            color: colorTextAccent,
            fontFamily: fontBody,
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
          <p style={{ fontFamily: fontBody, fontSize: "11px", color: colorTextMuted, margin: 0 }}>© 2026 Invitara. All rights reserved.</p>
          <p style={{ fontFamily: fontBody, fontSize: "11px", color: colorTextMuted, margin: 0 }}>
            A product by <a href="https://3pin.co.in" target="_blank" rel="noopener noreferrer" style={{ color: colorAccent, textDecoration: "none", fontWeight: 500 }}>3PIN</a>
          </p>
        </div>
      </div>
    );
  }

  // Desktop layout (1440px wide canvas block)
  return (
    <div style={{ background: colorBg, padding: "80px 120px 40px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", width: "1440px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      {/* Couple/Host Signature Block */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%", marginBottom: "40px", textAlign: "center" }}>
        <p style={{ fontFamily: fontBody, fontSize: 13, letterSpacing: 6, color: colorTextMuted, margin: 0, textTransform: "uppercase" }}>{displayTitle}</p>
        <p style={{ fontFamily: fontHeading, fontStyle: "italic", fontSize: 56, color: colorAccent, margin: 0, lineHeight: 1 }}>{heading}</p>
        
        {/* Heart/Star Divider */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "30%", margin: "8px 0" }}>
          <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.15)" }} />
          <span style={{ color: colorAccent, fontSize: 16, lineHeight: 1 }}>{dividerSymbol}</span>
          <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.15)" }} />
        </div>
        
        {(date || venue) && (
          <p style={{ fontFamily: fontHeading, fontSize: 20, color: colorText, margin: 0, lineHeight: 1.4 }}>
            {date} {date && venue ? " • " : ""} {venue}
          </p>
        )}
        {contact && (
          <p style={{ fontFamily: fontBody, fontSize: 14, color: colorTextMuted, margin: 0 }}>
            Enquiries: <a href={`mailto:${contact}`} style={{ color: colorAccent, textDecoration: "none" }}>{contact}</a>
          </p>
        )}
      </div>

      {/* Clean Gold-Gradient CSS Divider */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "10px", marginBottom: "40px", gap: "16px" }}>
        <div style={{ height: "1px", width: "180px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25))" }} />
        <span style={{ color: colorAccent, fontSize: "14px", opacity: 0.7 }}>✦</span>
        <div style={{ height: "1px", width: "180px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.25))" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "60px", gap: "80px" }}>
        {/* Brand & CTA */}
        <div style={{ flex: "1 1 40%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: "24px", transition: "opacity 0.2s" }}>
            <img src={logoSrc} alt="Invitara Logo" style={{ height: "42px", display: "block" }} decoding="async" loading="lazy" />
          </a>
          <p style={{ fontFamily: fontBody, fontSize: "15px", color: colorText, opacity: 0.8, lineHeight: "1.7", margin: "0 0 24px", maxWidth: "420px" }}>
            Beautiful digital invitations for every celebration. Build an experience that your guests will remember.
          </p>
          <p style={{ fontFamily: fontHeading, fontStyle: "italic", fontSize: "20px", color: colorAccent, margin: "0 0 20px" }}>
            Create your own elegant invitation today.
          </p>
          <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 28px",
            background: colorAccent,
            borderRadius: "30px",
            color: colorTextAccent,
            fontFamily: fontBody,
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "0.5px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
          }}
          >
            Get Started Free <span style={{ fontSize: "16px", fontWeight: "bold" }}>→</span>
          </a>
        </div>

        {/* Luxury Highlights Showcase */}
        <div style={{ flex: "1 1 50%", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ fontFamily: fontBody, fontWeight: 600, fontSize: "13px", color: colorAccent, letterSpacing: "1px", margin: 0 }}>✦ CINEMATIC DESIGN</p>
            <p style={{ fontFamily: fontBody, fontSize: "12px", color: colorText, opacity: 0.7, lineHeight: "1.5", margin: 0 }}>
              Exquisite, hand-crafted layouts designed to showcase your celebrations on the finest screens.
            </p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ fontFamily: fontBody, fontWeight: 600, fontSize: "13px", color: colorAccent, letterSpacing: "1px", margin: 0 }}>✦ SEAMLESS RSVPS</p>
            <p style={{ fontFamily: fontBody, fontSize: "12px", color: colorText, opacity: 0.7, lineHeight: "1.5", margin: 0 }}>
              Track RSVPs, manage guest preferences, and receive warm wishes in real-time.
            </p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ fontFamily: fontBody, fontWeight: 600, fontSize: "13px", color: colorAccent, letterSpacing: "1px", margin: 0 }}>✦ DYNAMIC MAPS</p>
            <p style={{ fontFamily: fontBody, fontSize: "12px", color: colorText, opacity: 0.7, lineHeight: "1.5", margin: 0 }}>
              Integrated GPS navigation and detailed schedule maps ensure guests arrive smoothly.
            </p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ fontFamily: fontBody, fontWeight: 600, fontSize: "13px", color: colorAccent, letterSpacing: "1px", margin: 0 }}>✦ SECURE GIFTING</p>
            <p style={{ fontFamily: fontBody, fontSize: "12px", color: colorText, opacity: 0.7, lineHeight: "1.5", margin: 0 }}>
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
          <p style={{ fontFamily: fontBody, fontSize: "13px", color: colorTextMuted, margin: 0 }}>© 2026 Invitara. All rights reserved.</p>
          <span style={{ fontFamily: fontBody, fontSize: "13px", color: "rgba(255,255,255,0.2)", margin: 0 }}>|</span>
          <p style={{ fontFamily: fontBody, fontSize: "13px", color: colorTextMuted, margin: 0 }}>
            A product by <a href="https://3pin.co.in" target="_blank" rel="noopener noreferrer" style={{ color: colorAccent, textDecoration: "none", fontWeight: 500 }}>3PIN</a>
          </p>
        </div>
      </div>
    </div>
  );
});
