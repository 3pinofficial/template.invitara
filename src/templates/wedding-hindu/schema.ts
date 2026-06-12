// ─── Wedding Hindu — Schema ────────────────────────────────────────────────
// Defines every user-editable field for this template.
// The editor auto-generates the form panel from this schema.

import type { TemplateSchemaDefinition } from "@/types/template";

export const templateConfig: TemplateSchemaDefinition = {
  slug: "wedding-hindu",
  name: "Traditional Hindu Wedding",
  category: "Indian Wedding",
  categorySlug: "wedding",
  description:
    "A traditional Hindu wedding invitation with beautiful gold mandalas, lotuses, hands holding (Gathbandhan), and deep red motifs.",
  thumbnail: "/thumbnails/wedding-hindu.jpg",
  canvasWidth: 402,
  tier: "free",
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
      placeholder: "Mrs. Reena & Mr. Rajiv Kapoor",
      group: "Families",
    },
    {
      key: "brideParents",
      label: "Bride's Parents",
      type: "text",
      placeholder: "Mrs. Shalini & Mr. Aakash Mittal",
      group: "Families",
    },

    // ── Blessings ──────────────────────────────────────────────────────────
    {
      key: "blessingsLine1",
      label: "Blessings Line 1",
      type: "text",
      placeholder: "With the heavenly blessings of",
      group: "Content",
    },
    {
      key: "blessingsLine2",
      label: "Blessings Line 2",
      type: "text",
      placeholder: "Smt. Lata Devi & Sm. Kamal Kapoor",
      group: "Content",
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
    // ── Moments ────────────────────────────────────────────────────────────
    {
      key: "moments_layout",
      label: "Moments Layout Style",
      type: "select",
      group: "Moments",
      defaultValue: "editorial",
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
        { key: "mehendi_venue", label: "Venue", type: "text", placeholder: "Grand Hall" },
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
        { key: "wedding_venue",   label: "Venue",   type: "text", placeholder: "Maheen khanna Wedding Hall" },
        { key: "wedding_address", label: "Address", type: "textarea", placeholder: "Chennai, Tamilnadu" },
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
        { key: "reception_venue",   label: "Venue",   type: "text", placeholder: "Grand Hall" },
        { key: "reception_address", label: "Address", type: "textarea", placeholder: "Chennai, Tamilnadu" },
        { key: "reception_image",   label: "Photo",   type: "image", aspectRatio: "16:9", optional: true },
      ],
    },
  ],

  addons: [
    { key: "rsvp",      label: "RSVP Form",     description: "Collect RSVPs from guests",      plan: "free", default: true  },
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
