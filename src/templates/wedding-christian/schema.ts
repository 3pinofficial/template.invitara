// ─── Wedding Christian — Schema ─────────────────────────────────────────────
// Defines every user-editable field for this template.
// The editor auto-generates the form panel from this schema.

import type { TemplateSchemaDefinition } from "@/types/template";

export const templateConfig: TemplateSchemaDefinition = {
  slug: "wedding-christian",
  name: "Wedding Christian",
  category: "Christian Wedding",
  categorySlug: "wedding",
  description:
    "A gorgeous, classical Christian wedding invitation detailed with arch structures, fine-line floral icons, and luxurious navy, gold, and cream aesthetics.",
  thumbnail: "/thumbnails/wedding-christian.jpg",
  canvasWidth: 540,
  tier: "premium",
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
      placeholder: "James",
      group: "Couple",
    },
    {
      key: "brideName",
      label: "Bride's Name",
      type: "text",
      placeholder: "Eleanor",
      group: "Couple",
    },
    {
      key: "couplePhoto",
      label: "Couple Photo",
      type: "image",
      aspectRatio: "3:4",
      maxSizeMb: 5,
      group: "Couple",
    },

    // ── Families ───────────────────────────────────────────────────────────
    {
      key: "groomParents",
      label: "Groom's Parents",
      type: "text",
      placeholder: "Mr. & Mrs. Robert Vance",
      group: "Families",
      optional: true,
    },
    {
      key: "brideParents",
      label: "Bride's Parents",
      type: "text",
      placeholder: "Mr. & Mrs. William Stirling",
      group: "Families",
      optional: true,
    },

    // ── Blessings ──────────────────────────────────────────────────────────
    {
      key: "blessingsLine1",
      label: "Opening Verse / Invitation Line",
      type: "text",
      placeholder: "Join us for the holy matrimony of",
      group: "Content",
    },
    // ── Moments ────────────────────────────────────────────────────────────
    {
      key: "moments_layout",
      label: "Moments Layout Style",
      type: "select",
      group: "Moments",
      defaultValue: "radial",
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
      key: "rehearsal",
      label: "Rehearsal Dinner",
      icon: "🍽️",
      optional: true,
      fields: [
        { key: "rehearsal_date",  label: "Date",  type: "date" },
        { key: "rehearsal_time",  label: "Time",  type: "time" },
        { key: "rehearsal_venue", label: "Venue", type: "text", placeholder: "The Heritage Estate" },
      ],
    },
    {
      key: "wedding",
      label: "Wedding Ceremony",
      icon: "⛪",
      optional: false,
      fields: [
        { key: "wedding_date",    label: "Date",    type: "date" },
        { key: "wedding_time",    label: "Time",    type: "time" },
        { key: "wedding_venue",   label: "Venue",   type: "text", placeholder: "St. Patrick's Cathedral" },
        { key: "wedding_address", label: "Address", type: "textarea", placeholder: "123 Heritage Lane" },
      ],
    },
    {
      key: "cocktail",
      label: "Cocktail Hour",
      icon: "🍸",
      optional: true,
      fields: [
        { key: "cocktail_date",  label: "Date",  type: "date" },
        { key: "cocktail_time",  label: "Time",  type: "time" },
        { key: "cocktail_venue", label: "Venue", type: "text", placeholder: "The Grand Pavilion" },
      ],
    },
    {
      key: "reception",
      label: "Grand Reception",
      icon: "🥂",
      optional: true,
      fields: [
        { key: "reception_date",    label: "Date",    type: "date" },
        { key: "reception_time",    label: "Time",    type: "time" },
        { key: "reception_venue",   label: "Venue",   type: "text", placeholder: "The Grand Pavilion Ballroom" },
      ],
    },
  ],

  addons: [
    { key: "rsvp",      label: "RSVP Form",     description: "Collect RSVPs from guests",      plan: "free", default: true  },
    { key: "maps",      label: "Google Maps",   description: "Embed maps for each venue",      plan: "pro",  default: false },
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
      id: "rehearsal",
      type: "event-details",
      label: "Rehearsal Dinner",
      icon: "🍽️",
      required: false,
      defaultEnabled: true,
      order: 1,
      fields: []
    },
    {
      id: "wedding",
      type: "event-details",
      label: "Wedding Ceremony",
      icon: "⛪",
      required: true,
      defaultEnabled: true,
      order: 2,
      fields: []
    },
    {
      id: "reception",
      type: "event-details",
      label: "Grand Reception",
      icon: "🥂",
      required: false,
      defaultEnabled: true,
      order: 3,
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
      order: 4,
      fields: []
    }
  ]
};
