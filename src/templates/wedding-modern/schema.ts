// ─── Wedding Modern — Schema ────────────────────────────────────────────────
// Defines every user-editable field for this template.
// The editor auto-generates the form panel from this schema.

import type { TemplateSchemaDefinition } from "@/types/template";

export const weddingModernSchema: TemplateSchemaDefinition = {
  slug: "wedding-modern",
  name: "Wedding Modern",
  category: "Indian Wedding",
  categorySlug: "wedding",
  description:
    "A premium emerald green and gold Indian wedding invitation with arch frames, luxury illustrations, and elegant typography.",
  thumbnail: "/thumbnails/wedding-modern.jpg",
  canvasWidth: 540,
  tier: "free",
  motionLevel: "cinematic",
  supportedLanguages: ["en"],

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
      label: "Blessings / Opening Verse Line 1",
      type: "text",
      placeholder: "With the heavenly blessings of",
      group: "Content",
    },
    {
      key: "blessingsLine2",
      label: "Blessings / Opening Verse Line 2",
      type: "text",
      placeholder: "Smt. Lata Devi & Sm. Kamal Kapoor",
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
        { key: "wedding_venue",   label: "Venue",   type: "text", placeholder: "The Grand Palace" },
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
};
