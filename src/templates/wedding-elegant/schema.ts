// ─── Wedding Elegant — Schema ────────────────────────────────────────────────
// Defines every user-editable field for this template.
// The editor auto-generates the form panel from this schema.

import type { TemplateSchemaDefinition } from "@/types/template";

export const templateConfig: TemplateSchemaDefinition = {
  slug: "wedding-elegant",
  name: "Wedding Elegant",
  category: "Indian Wedding",
  categorySlug: "wedding",
  description:
    "A timeless, crimson and cream Indian wedding invitation with ornate typography and elegant design.",
  thumbnail: "/thumbnails/wedding-elegant.jpg",
  canvasWidth: 540,
  tier: "royal",
  motionLevel: "cinematic",
  supportedLanguages: ["en"],
  version: "1.0.0",
  status: "published",

  globalFields: [
    // ── Couple ─────────────────────────────────────────────────────────────
    {
      key: "groomName",
      label: "Groom's Name",
      type: "text",
      placeholder: "Jagadish",
      group: "Couple",
    },
    {
      key: "brideName",
      label: "Bride's Name",
      type: "text",
      placeholder: "Madison",
      group: "Couple",
    },
    {
      key: "couplePhoto",
      label: "Couple Photo",
      type: "image",
      aspectRatio: "4:5",
      maxSizeMb: 5,
      group: "Couple",
    },

    // ── Families ───────────────────────────────────────────────────────────
    {
      key: "groomParents",
      label: "Groom's Parents",
      type: "text",
      placeholder: "S/O Sri. Narasimha Rao & Smt. Lakshmi",
      group: "Families",
    },
    {
      key: "brideParents",
      label: "Bride's Parents",
      type: "text",
      placeholder: "D/O Sri. Robert & Smt. Mary",
      group: "Families",
    },

    // ── Blessings ──────────────────────────────────────────────────────────
    {
      key: "blessingsText",
      label: "Blessings / Opening Verse",
      type: "textarea",
      placeholder:
        "With the blessings of God and our parents, we joyfully invite you to celebrate our wedding.",
      group: "Content",
    },

    // ── Invite Intro ───────────────────────────────────────────────────────
    {
      key: "inviteIntro",
      label: "Invite Introduction",
      type: "textarea",
      placeholder:
        "Together with their families, Jagadish and Madison request the pleasure of your company at the celebrations of their marriage.",
      group: "Content",
    },

    // ── Gallery ────────────────────────────────────────────────────────────
    {
      key: "gallery1",
      label: "Gallery Photo 1",
      type: "image",
      aspectRatio: "1:1",
      maxSizeMb: 5,
      group: "Gallery",
    },
    {
      key: "gallery2",
      label: "Gallery Photo 2",
      type: "image",
      aspectRatio: "1:1",
      maxSizeMb: 5,
      group: "Gallery",
      optional: true,
    },
    {
      key: "gallery3",
      label: "Gallery Photo 3",
      type: "image",
      aspectRatio: "1:1",
      maxSizeMb: 5,
      group: "Gallery",
      optional: true,
    },
    // ── Moments ────────────────────────────────────────────────────────────
    {
      key: "moments_layout",
      label: "Moments Layout Style",
      type: "select",
      group: "Moments",
      defaultValue: "journal",
      options: [
        { label: "Polaroid Scrapbook", value: "polaroid" },
        { label: "Journal Scrapbook", value: "journal" },
        { label: "Retro Editorial", value: "editorial" },
        { label: "Radial Arc Fan", value: "radial" },
        { label: "Retro Filmstrip", value: "filmstrip" },
      ],
      optional: true,
    },
    {
      key: "moments_photo1",
      label: "Moments Photo 1",
      type: "image",
      aspectRatio: "3:4",
      maxSizeMb: 5,
      group: "Moments",
      optional: true,
    },
    {
      key: "moments_photo2",
      label: "Moments Photo 2",
      type: "image",
      aspectRatio: "3:4",
      maxSizeMb: 5,
      group: "Moments",
      optional: true,
    },
    {
      key: "moments_photo3",
      label: "Moments Photo 3",
      type: "image",
      aspectRatio: "3:4",
      maxSizeMb: 5,
      group: "Moments",
      optional: true,
    },
    {
      key: "moments_photo4",
      label: "Moments Photo 4",
      type: "image",
      aspectRatio: "3:4",
      maxSizeMb: 5,
      group: "Moments",
      optional: true,
    },
    {
      key: "moments_photo5",
      label: "Moments Photo 5",
      type: "image",
      aspectRatio: "3:4",
      maxSizeMb: 5,
      group: "Moments",
      optional: true,
    },
    {
      key: "moments_text",
      label: "Moments Text",
      type: "textarea",
      placeholder: "Life moves quickly, and the little moments we often overlook...",
      group: "Moments",
      optional: true,
    },

    // ── RSVP Settings ─────────────────────────────────────────────────
    {
      key: "rsvp_requireEmail",
      label: "Require Email",
      type: "toggle",
      group: "RSVP Settings",
      defaultValue: false,
    },
    {
      key: "rsvp_showPhone",
      label: "Show Phone Field",
      type: "toggle",
      group: "RSVP Settings",
      defaultValue: true,
    },
    {
      key: "rsvp_requirePhone",
      label: "Require Phone",
      type: "toggle",
      group: "RSVP Settings",
      defaultValue: false,
    },
    {
      key: "rsvp_showDietary",
      label: "Show Dietary Notes",
      type: "toggle",
      group: "RSVP Settings",
      defaultValue: true,
    },
    {
      key: "rsvp_showLeaveMessage",
      label: "Show 'Leave a Message'",
      type: "toggle",
      group: "RSVP Settings",
      defaultValue: true,
    },
    {
      key: "rsvp_maxGuests",
      label: "Max Guests Allowed",
      type: "number",
      group: "RSVP Settings",
      min: 1,
      max: 50,
      defaultValue: 10,
    },
  ],

  events: [
    {
      key: "haldi",
      label: "Haldi Ceremony",
      icon: "🌼",
      optional: true,
      fields: [
        { key: "haldi_date",  label: "Date",   type: "date" },
        { key: "haldi_time",  label: "Time",   type: "time" },
        { key: "haldi_venue", label: "Venue",  type: "text", placeholder: "Residence" },
        { key: "haldi_image", label: "Photo",  type: "image", aspectRatio: "16:9", optional: true },
      ],
    },
    {
      key: "mehendi",
      label: "Mehendi Night",
      icon: "🌿",
      optional: true,
      fields: [
        { key: "mehendi_date",  label: "Date",  type: "date" },
        { key: "mehendi_time",  label: "Time",  type: "time" },
        { key: "mehendi_venue", label: "Venue", type: "text" },
        { key: "mehendi_image", label: "Photo", type: "image", aspectRatio: "16:9", optional: true },
      ],
    },
    {
      key: "wedding",
      label: "Wedding Ceremony",
      icon: "💍",
      optional: false,
      fields: [
        { key: "wedding_date",    label: "Date",    type: "date" },
        { key: "wedding_time",    label: "Time",    type: "time" },
        { key: "wedding_venue",   label: "Venue",   type: "text", placeholder: "Sri Rama Kalyana Mandapam" },
        { key: "wedding_address", label: "Address", type: "textarea" },
        { key: "wedding_image",   label: "Photo",   type: "image", aspectRatio: "16:9", optional: true },
      ],
    },
    {
      key: "reception",
      label: "Grand Reception",
      icon: "🎉",
      optional: true,
      fields: [
        { key: "reception_date",    label: "Date",    type: "date" },
        { key: "reception_time",    label: "Time",    type: "time" },
        { key: "reception_venue",   label: "Venue",   type: "text" },
        { key: "reception_address", label: "Address", type: "textarea" },
        { key: "reception_image",   label: "Photo",   type: "image", aspectRatio: "16:9", optional: true },
      ],
    },
  ],

  addons: [
    { key: "rsvp",      label: "RSVP Form",     description: "Collect RSVPs from guests",      plan: "free", default: true  },
    { key: "maps",      label: "Google Maps",   description: "Embed maps for each venue",      plan: "pro",  default: false },
    { key: "countdown", label: "Countdown Timer", description: "Live countdown to the wedding", plan: "free", default: true  },
    { key: "gallery",   label: "Photo Gallery",  description: "3-photo gallery section",        plan: "free", default: true  },
  ],

  sections: [
    {
      id: "hero",
      type: "hero",
      label: "Couple Hero",
      icon: "✨",
      required: true,
      pinned: "top",
      defaultEnabled: true,
      order: 0,
      fields: []
    },
    {
      id: "haldi",
      type: "event-details",
      label: "Haldi Ceremony",
      icon: "🌼",
      required: false,
      defaultEnabled: true,
      order: 1,
      fields: []
    },
    {
      id: "mehendi",
      type: "event-details",
      label: "Mehendi Night",
      icon: "🌿",
      required: false,
      defaultEnabled: true,
      order: 2,
      fields: []
    },
    {
      id: "wedding",
      type: "event-details",
      label: "Wedding Ceremony",
      icon: "💍",
      required: true,
      defaultEnabled: true,
      order: 3,
      fields: []
    },
    {
      id: "reception",
      type: "event-details",
      label: "Grand Reception",
      icon: "🎉",
      required: false,
      defaultEnabled: true,
      order: 4,
      fields: []
    },
    {
      id: "gallery",
      type: "gallery",
      label: "Photo Gallery",
      icon: "📸",
      required: false,
      defaultEnabled: true,
      order: 5,
      fields: []
    },
    {
      id: "rsvp",
      type: "rsvp",
      label: "RSVP Form",
      icon: "✉️",
      required: true,
      pinned: "bottom",
      defaultEnabled: true,
      order: 6,
      fields: []
    }
  ]
};
