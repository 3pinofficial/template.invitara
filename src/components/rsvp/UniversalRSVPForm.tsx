"use client";

import { useState, useEffect, useCallback, useRef, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getInvitationEvents,
  submitRSVP,
} from "@/lib/rsvp-actions";
import type {
  InvitationEvent,
  RSVPThemeConfig,
  RSVPFieldConfig,
  RSVPEventEntry,
} from "@/types/invitation";

export type { RSVPThemeConfig, RSVPFieldConfig };

// ─── Interface Contracts ─────────────────────────────────────────

export interface UniversalRSVPProps {
  eventId: string;
  theme: RSVPThemeConfig;
  formConfig: RSVPFieldConfig;
  className?: string;
  /** Pre-computed ceremonies for editor preview (skips DB fetch) */
  previewCeremonies?: InvitationEvent[];
  maxWidth?: string;
  isMobile?: boolean;
}

// ─── Internal Types ──────────────────────────────────────────────

type FormStep = "loading" | "form" | "success";

interface EventSelection {
  selected: boolean;
  guestCount: number;
}

// ─── Animation Variants ──────────────────────────────────────────

const fadeSlide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ─── Utility: Hex to RGBA ────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Sub-Component: Loading Skeleton ─────────────────────────────

function LoadingSkeleton({ theme }: { theme: RSVPThemeConfig }) {
  const shimmerBg = hexToRgba(theme.primaryColor, 0.08);
  const shimmerAccent = hexToRgba(theme.primaryColor, 0.15);

  return (
    <div className="space-y-6 p-8">
      {/* Title skeleton */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-3 w-32 rounded-full animate-pulse"
          style={{ background: shimmerBg }}
        />
        <div
          className="h-8 w-48 rounded-full animate-pulse"
          style={{ background: shimmerAccent }}
        />
      </div>
      {/* Field skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div
            className="h-2.5 w-24 rounded-full animate-pulse"
            style={{ background: shimmerBg }}
          />
          <div
            className="h-12 w-full rounded-lg animate-pulse"
            style={{ background: shimmerBg }}
          />
        </div>
      ))}
      {/* Button skeleton */}
      <div
        className="h-14 w-full rounded-xl animate-pulse"
        style={{ background: shimmerAccent }}
      />
    </div>
  );
}

// ─── Sub-Component: Themed Input ─────────────────────────────────

interface ThemedInputProps {
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  theme: RSVPThemeConfig;
  /** Set false when nested inside a non-stagger container */
  animated?: boolean;
}

function ThemedInput({
  label,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
  theme,
  animated = true,
}: ThemedInputProps) {
  const [focused, setFocused] = useState(false);

  const labelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: hexToRgba(theme.primaryColor, 0.65),
    marginBottom: 6,
    display: "block",
    fontFamily: theme.fontFamily,
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1.5px solid ${hexToRgba(
      theme.primaryColor,
      focused ? 0.8 : 0.2
    )}`,
    padding: "14px 0",
    fontSize: 16,
    color: theme.textColor,
    outline: "none",
    fontFamily: theme.fontFamily,
    transition: "border-color 0.3s ease",
  };

  const inner = (
    <>
      <label style={labelStyle}>
        {label}
        {required && (
          <span style={{ color: theme.primaryColor, marginLeft: 4 }}>*</span>
        )}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
      />
    </>
  );

  if (!animated) return <div>{inner}</div>;
  return <motion.div variants={fadeSlide}>{inner}</motion.div>;
}

// ─── Sub-Component: Guest Count Stepper ──────────────────────────

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  theme: RSVPThemeConfig;
  size?: "sm" | "md";
  label?: string;
}

function GuestStepper({
  value,
  min,
  max,
  onChange,
  theme,
  size = "md",
  label,
}: StepperProps) {
  const btnSize = size === "sm" ? "w-7 h-7" : "w-11 h-11";
  const textSize = size === "sm" ? "text-sm" : "text-2xl";

  const buttonStyle: CSSProperties = {
    border: `1.5px solid ${hexToRgba(theme.primaryColor, 0.25)}`,
    color: theme.primaryColor,
    background: "transparent",
    transition: "all 0.2s ease",
  };

  const handleDecrement = () => onChange(Math.max(min, value - 1));
  const handleIncrement = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center gap-3">
      {label && (
        <span
          className="text-xs mr-auto"
          style={{ color: hexToRgba(theme.textColor, 0.5) }}
        >
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={`${btnSize} rounded-full flex items-center justify-center text-lg transition-all disabled:opacity-30`}
        style={buttonStyle}
        aria-label="Decrease guest count"
      >
        −
      </button>
      <span
        className={`${textSize} font-semibold w-6 text-center tabular-nums`}
        style={{ color: theme.primaryColor }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={`${btnSize} rounded-full flex items-center justify-center text-lg transition-all disabled:opacity-30`}
        style={buttonStyle}
        aria-label="Increase guest count"
      >
        +
      </button>
    </div>
  );
}

// ─── Sub-Component: Ceremony Checkbox ────────────────────────────

interface CeremonyCheckboxProps {
  ceremony: InvitationEvent;
  selected: boolean;
  guestCount: number;
  overallGuestCount: number;
  onToggle: () => void;
  onGuestCountChange: (n: number) => void;
  theme: RSVPThemeConfig;
}

function CeremonyCheckbox({
  ceremony,
  selected,
  guestCount,
  overallGuestCount,
  onToggle,
  onGuestCountChange,
  theme,
}: CeremonyCheckboxProps) {
  return (
    <motion.div
      layout
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        border: `1.5px solid ${hexToRgba(
          theme.primaryColor,
          selected ? 0.35 : 0.1
        )}`,
        background: selected
          ? hexToRgba(theme.primaryColor, 0.06)
          : "transparent",
      }}
    >
      {/* Toggle row */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
      >
        {/* Custom checkbox */}
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            border: `1.5px solid ${hexToRgba(
              theme.primaryColor,
              selected ? 1 : 0.3
            )}`,
            background: selected
              ? hexToRgba(theme.primaryColor, 0.2)
              : "transparent",
          }}
        >
          <AnimatePresence>
            {selected && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke={theme.primaryColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  // Added static stroke replacement because runtime dynamic SVG bindings might fail in simple rendering
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>

        {/* Ceremony info */}
        <div className="flex-1 min-w-0">
          <span
            className="text-base font-medium block"
            style={{
              color: selected
                ? theme.textColor
                : hexToRgba(theme.textColor, 0.55),
              fontFamily: theme.fontFamily,
            }}
          >
            {ceremony.name}
          </span>
          {(ceremony.venue_name || ceremony.event_time) && (
            <span
              className="text-sm block mt-0.5"
              style={{ color: hexToRgba(theme.textColor, 0.35) }}
            >
              {[ceremony.venue_name, ceremony.event_time]
                .filter(Boolean)
                .join(" · ")}
            </span>
          )}
        </div>

        {/* Check badge */}
        {selected && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: hexToRgba(theme.primaryColor, 0.15),
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke={theme.primaryColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </button>

      {/* Per-ceremony guest stepper (only when selected & overall > 1) */}
      <AnimatePresence>
        {selected && overallGuestCount > 1 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-3 pt-2"
              style={{
                borderTop: `1px solid ${hexToRgba(theme.primaryColor, 0.08)}`,
              }}
            >
              <GuestStepper
                value={guestCount}
                min={1}
                max={overallGuestCount}
                onChange={onGuestCountChange}
                theme={theme}
                size="sm"
                label="Guests attending:"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Sub-Component: Decision Buttons ─────────────────────────────

interface DecisionButtonsProps {
  attending: "yes" | "no" | null;
  onSelect: (choice: "yes" | "no") => void;
  theme: RSVPThemeConfig;
}

function DecisionButtons({ attending, onSelect, theme, isMobile }: DecisionButtonsProps & { isMobile?: boolean }) {
  const choices = [
    { key: "yes" as const, label: "Joyfully Accept", icon: "✦" },
    { key: "no" as const, label: "Regretfully Decline", icon: "✧" },
  ];

  return (
    <motion.div variants={fadeSlide}>
      <label
        className="block mb-3"
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: hexToRgba(theme.primaryColor, 0.65),
          fontFamily: theme.fontFamily,
        }}
      >
        Will You Attend?
        <span style={{ color: theme.primaryColor, marginLeft: 4 }}>*</span>
      </label>
      <div className={`flex ${isMobile ? "flex-col" : "flex-col sm:flex-row"} gap-3 w-full`}>
        {choices.map(({ key, label, icon }) => {
          const isActive = attending === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`flex-1 relative py-3.5 px-4 text-base font-semibold tracking-wide transition-all duration-300 overflow-hidden ${theme.buttonShape}`}
              style={{
                background: isActive
                  ? hexToRgba(theme.primaryColor, 0.12)
                  : "transparent",
                border: `1.5px solid ${hexToRgba(
                  theme.primaryColor,
                  isActive ? 0.7 : 0.15
                )}`,
                color: isActive
                  ? theme.primaryColor
                  : hexToRgba(theme.textColor, 0.5),
                fontFamily: theme.fontFamily,
                boxShadow: isActive
                  ? `0 4px 20px ${hexToRgba(theme.primaryColor, 0.15)}`
                  : "none",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span
                  className="text-base transition-transform duration-300"
                  style={{
                    transform: isActive ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  {icon}
                </span>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Sub-Component: Thank You State ──────────────────────────────

function ThankYouState({
  guestName,
  isDecline,
  theme,
}: {
  guestName: string;
  isDecline: boolean;
  theme: RSVPThemeConfig;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center py-12 px-8"
    >
      {/* Animated check circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: hexToRgba(theme.primaryColor, 0.1) }}
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </motion.svg>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-semibold mb-3"
        style={{ color: theme.primaryColor, fontFamily: theme.fontFamily }}
      >
        Thank You, {guestName}!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="text-sm leading-relaxed max-w-[300px]"
        style={{ color: hexToRgba(theme.textColor, 0.55) }}
      >
        {isDecline
          ? "We understand and appreciate you letting us know. You'll be missed!"
          : "Your RSVP has been received. We look forward to celebrating with you!"}
      </motion.p>

      {/* Decorative divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="h-px w-16 mt-6"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.primaryColor}, transparent)`,
        }}
      />
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────

export function UniversalRSVPForm({
  eventId,
  theme,
  formConfig,
  className,
  previewCeremonies,
  maxWidth = "max-w-md",
  isMobile,
}: UniversalRSVPProps) {
  // ── State ────────────────────────────────────────────────────

  const [step, setStep] = useState<FormStep>("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ceremonies, setCeremonies] = useState<InvitationEvent[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [overallGuestCount, setOverallGuestCount] = useState(1);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [eventSelections, setEventSelections] = useState<
    Record<string, EventSelection>
  >({});
  const [errorMsg, setErrorMsg] = useState("");
  const [guestMessage, setGuestMessage] = useState("");

  // Ref to track previous overall guest count for smart sync
  const prevOverallRef = useRef(1);

  const maxGuests = formConfig.maxGuestsAllowed || 10;

  // ── Fetch ceremonies on mount (or use preview data) ────────────

  useEffect(() => {
    // If preview ceremonies are provided (editor mode), use them directly
    if (previewCeremonies && previewCeremonies.length > 0) {
      setCeremonies(previewCeremonies);
      setEventSelections((prev) => {
        const initial: Record<string, EventSelection> = {};
        for (const ev of previewCeremonies) {
          // Preserve existing selections if ceremony was already selected
          initial[ev.id] = prev[ev.id] ?? { selected: true, guestCount: 1 };
        }
        return initial;
      });
      setStep("form");
      return;
    }

    // Skip fetch if eventId is empty or not a valid UUID (e.g. demo mode)
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);
    if (!isValidUuid) {
      // Direct mock fallback for previewer
      getInvitationEvents("default")
        .then((events) => {
          setCeremonies(events);
          const initial: Record<string, EventSelection> = {};
          for (const ev of events) {
            initial[ev.id] = { selected: true, guestCount: 1 };
          }
          setEventSelections(initial);
          setStep("form");
        });
      return;
    }

    let cancelled = false;
    getInvitationEvents(eventId)
      .then((events) => {
        if (cancelled) return;
        setCeremonies(events);
        const initial: Record<string, EventSelection> = {};
        for (const ev of events) {
          initial[ev.id] = { selected: true, guestCount: 1 };
        }
        setEventSelections(initial);
        setStep("form");
      })
      .catch(() => {
        if (!cancelled) setStep("form");
      });
    return () => {
      cancelled = true;
    };
  }, [eventId, previewCeremonies]);

  // ── Smart Sync: per-ceremony guest counts when overall changes ──

  useEffect(() => {
    const prevCount = prevOverallRef.current;
    prevOverallRef.current = overallGuestCount;

    setEventSelections((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const key of Object.keys(next)) {
        if (!next[key].selected) continue;
        const cur = next[key].guestCount;

        if (overallGuestCount < prevCount) {
          // Shrink: clamp down to new max
          if (cur > overallGuestCount) {
            next[key] = { ...next[key], guestCount: overallGuestCount };
            changed = true;
          }
        } else if (overallGuestCount > prevCount) {
          // Grow: scale up only ceremonies that were matching the old max
          if (cur === prevCount) {
            next[key] = { ...next[key], guestCount: overallGuestCount };
            changed = true;
          }
        }
      }
      return changed ? next : prev;
    });
  }, [overallGuestCount]);

  // ── Ceremony toggle ──────────────────────────────────────────

  const toggleEvent = useCallback((id: string) => {
    setEventSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: !prev[id]?.selected,
        // When toggling ON, default to overall guest count (smart default for families)
        guestCount: !prev[id]?.selected ? overallGuestCount : prev[id]?.guestCount || 0,
      },
    }));
  }, [overallGuestCount]);

  const updateEventGuestCount = useCallback((id: string, count: number) => {
    setEventSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], guestCount: count },
    }));
  }, []);

  // ── Decision handler ─────────────────────────────────────────

  const handleDecision = (choice: "yes" | "no") => {
    setAttending(choice);
  };

  // ── Validation ───────────────────────────────────────────────

  const validate = (): string | null => {
    if (!guestName.trim()) return "Please enter your name.";
    if (formConfig.requireEmail && !guestEmail.trim())
      return "Please enter your email address.";
    if (
      formConfig.requireEmail &&
      guestEmail.trim() &&
      !guestEmail.includes("@")
    )
      return "Please enter a valid email address.";
    if (formConfig.requirePhone && !guestPhone.trim())
      return "Please enter your phone number.";
    if (attending === null) return "Please select your attendance.";
    return null;
  };

  // ── Submit ───────────────────────────────────────────────────

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const eventResponses: RSVPEventEntry[] = Object.entries(
      eventSelections
    ).map(([invEventId, sel]) => ({
      invitation_event_id: invEventId,
      is_attending: sel.selected,
      guest_count: sel.selected ? sel.guestCount : 0,
    }));

    const customResponses: Record<string, unknown> = {};
    if (guestMessage.trim()) {
      customResponses.message = guestMessage.trim();
    }

    try {
      await submitRSVP({
        event_id: eventId,
        guest_name: guestName.trim(),
        guest_email: guestEmail.trim() || undefined,
        guest_phone: guestPhone.trim() || undefined,
        status: attending === "yes" ? "attending" : "not_attending",
        guest_count: attending === "yes" ? overallGuestCount : 0,
        dietary_notes: dietaryNotes.trim() || undefined,
        custom_responses: Object.keys(customResponses).length > 0 ? customResponses : undefined,
        event_responses: attending === "yes" ? eventResponses : [],
      });
      setStep("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // ── Derived state ────────────────────────────────────────────

  const isSubmitReady =
    guestName.trim().length > 0 && attending !== null;

  const showSubmitButton =
    step === "form" &&
    attending !== null;

  // ── Style tokens ─────────────────────────────────────────────

  const sectionLabelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: hexToRgba(theme.primaryColor, 0.65),
    fontFamily: theme.fontFamily,
    marginBottom: 8,
    display: "block",
  };

  // ── Render ───────────────────────────────────────────────────

  return (
    <section
      className={`py-8 px-4 sm:px-6 ${className ?? ""}`}
      style={{ fontFamily: theme.fontFamily }}
    >
      <div className={`${maxWidth} mx-auto`}>
        {/* ── Section header ────────────────────── */}
        <div className="text-center mb-5">
          <p
            className="text-sm tracking-[0.3em] uppercase mb-2"
            style={{ color: hexToRgba(theme.primaryColor, 0.5) }}
          >
            We&apos;d Love Your Presence
          </p>
          <h2
            className="text-3xl sm:text-4xl font-semibold"
            style={{
              color: theme.primaryColor,
              fontFamily: theme.fontFamily,
            }}
          >
            Kindly Respond
          </h2>
        </div>

        {/* ── Form card ────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            background: theme.backgroundColor,
            borderColor: hexToRgba(theme.primaryColor, 0.1),
            boxShadow: `0 8px 40px ${hexToRgba(theme.primaryColor, 0.06)}`,
          }}
        >
          {/* Top accent line */}
          <div
            className="h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${hexToRgba(
                theme.primaryColor,
                0.5
              )}, transparent)`,
            }}
          />

          {/* ── Loading state ───────────────────── */}
          {step === "loading" && <LoadingSkeleton theme={theme} />}

          {/* ── Form body ───────────────────────── */}
          {step === "form" && (
            <motion.div
              className="p-6 sm:p-8 space-y-5"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {/* ── Step 1: Identity Fields ──────── */}
              <ThemedInput
                label="Your Full Name"
                required
                placeholder="Enter your name"
                value={guestName}
                onChange={setGuestName}
                theme={theme}
              />

              <ThemedInput
                label="Email Address"
                required={formConfig.requireEmail}
                type="email"
                placeholder="you@example.com"
                value={guestEmail}
                onChange={setGuestEmail}
                theme={theme}
              />

              {formConfig.showPhone && (
                <ThemedInput
                  label="Phone Number"
                  required={formConfig.requirePhone}
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={guestPhone}
                  onChange={setGuestPhone}
                  theme={theme}
                />
              )}

              {/* ── Step 2: The Fork ─────────────── */}
              <DecisionButtons
                attending={attending}
                onSelect={handleDecision}
                theme={theme}
                isMobile={isMobile}
              />

              {/* ── Step 3: Details (Accept path) ── */}
              <AnimatePresence mode="wait">
                {attending === "yes" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="space-y-5">
                      {/* Total party size */}
                      <div>
                        <label style={sectionLabelStyle}>
                          Total Guests (including you)
                        </label>
                        <div className="mt-2">
                          <GuestStepper
                            value={overallGuestCount}
                            min={1}
                            max={maxGuests}
                            onChange={setOverallGuestCount}
                            theme={theme}
                            size="md"
                          />
                        </div>
                      </div>

                      {/* Per-ceremony selection */}
                      {ceremonies.length > 0 && (
                        <div>
                          <label style={sectionLabelStyle}>
                            Which Events Will You Attend?
                          </label>
                          <div className="mt-3 space-y-2.5">
                            {ceremonies.map((ceremony) => {
                              const sel = eventSelections[ceremony.id];
                              return (
                                <CeremonyCheckbox
                                  key={ceremony.id}
                                  ceremony={ceremony}
                                  selected={sel?.selected ?? false}
                                  guestCount={sel?.guestCount ?? 1}
                                  overallGuestCount={overallGuestCount}
                                  onToggle={() => toggleEvent(ceremony.id)}
                                  onGuestCountChange={(n) =>
                                    updateEventGuestCount(ceremony.id, n)
                                  }
                                  theme={theme}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Dietary notes */}
                      {formConfig.showDietary && (
                        <ThemedInput
                          label="Dietary Restrictions"
                          placeholder="Vegetarian, allergies, etc."
                          value={dietaryNotes}
                          onChange={setDietaryNotes}
                          theme={theme}
                          animated={false}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Leave a Message ────────────────── */}
              <AnimatePresence>
                {attending !== null && formConfig.showLeaveMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <label style={sectionLabelStyle}>
                      Leave a Message
                    </label>
                    <textarea
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      placeholder="Share your wishes or a note for the couple…"
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "14px 0",
                        border: "none",
                        borderBottom: `1px solid ${hexToRgba(theme.primaryColor, 0.2)}`,
                        background: "transparent",
                        color: theme.textColor,
                        fontFamily: theme.fontFamily,
                        fontSize: 16,
                        lineHeight: 1.6,
                        resize: "vertical",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderBottomColor = theme.primaryColor;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderBottomColor = hexToRgba(theme.primaryColor, 0.2);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Error message ─────────────────── */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-sm text-center py-2 px-4 rounded-lg"
                    style={{
                      color: "#ef4444",
                      background: "rgba(239, 68, 68, 0.08)",
                    }}
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* ── Submit button ─────────────────── */}
              <AnimatePresence>
                {showSubmitButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isSubmitReady || isSubmitting}
                    className={`w-full py-4 text-base font-semibold tracking-[0.2em] uppercase transition-all duration-300 relative overflow-hidden disabled:cursor-not-allowed ${theme.buttonShape}`}
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${hexToRgba(
                        theme.primaryColor,
                        0.8
                      )})`,
                      color: "#ffffff",
                      opacity: isSubmitting || !isSubmitReady ? 0.6 : 1,
                      boxShadow: `0 8px 32px ${hexToRgba(
                        theme.primaryColor,
                        0.2
                      )}`,
                      fontFamily: theme.fontFamily,
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send RSVP →"
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── Success state ───────────────────── */}
          {step === "success" && (
            <ThankYouState
              guestName={guestName}
              isDecline={attending === "no"}
              theme={theme}
            />
          )}
        </div>
      </div>
    </section>
  );
}
