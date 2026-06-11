// ─── Kids Birthday — Schema ──────────────────────────────────────────────────
// Defines every user-editable field for this template.
// The editor auto-generates the form panel from this schema.

import type { TemplateSchemaDefinition } from "@/types/template";

export const kidsBirthdaySchema: TemplateSchemaDefinition = {
  slug: "kids-birthday",
  name: "Kids Birthday",
  category: "Birthday",
  categorySlug: "birthday",
  description:
    "A vibrant, playful sky-blue invitation with animated floating balloons, custom confetti burst, and tilted cards perfect for a magical kids birthday party.",
  thumbnail: "/thumbnails/kids-birthday.jpg",
  canvasWidth: 1440,
  tier: "free",
  motionLevel: "cinematic",
  supportedLanguages: ["en"],

  globalFields: [
    // ── Birthday Child ───────────────────────────────────────────────────────
    {
      key: "childName",
      label: "Child's Name",
      type: "text",
      placeholder: "Leo",
      group: "Celebrant",
    },
    {
      key: "childAge",
      label: "Child's Age",
      type: "number",
      placeholder: "5",
      group: "Celebrant",
    },
    {
      key: "hostName",
      label: "Parent's / Host's Name",
      type: "text",
      placeholder: "Sarah",
      group: "Celebrant",
    },
    {
      key: "heroSubtitle",
      label: "Hero Subtitle",
      type: "textarea",
      placeholder: "Get ready for a magical day filled with fun, games, and lots of cake!",
      group: "Celebrant",
    },
    {
      key: "heroImage",
      label: "Main Image / Photo",
      type: "image",
      aspectRatio: "16:9",
      maxSizeMb: 5,
      group: "Celebrant",
    },
    // ── Moments ────────────────────────────────────────────────────────────
    {
      key: "moments_layout",
      label: "Moments Layout Style",
      type: "select",
      group: "Moments",
      defaultValue: "polaroid",
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

    // ── RSVP Settings ────────────────────────────────────────────────────────
    {
      key: "rsvpDeadline",
      label: "RSVP Deadline Date",
      type: "date",
      group: "RSVP Settings",
    },
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
      key: "birthday_party",
      label: "Birthday Party",
      icon: "🎉",
      optional: false,
      fields: [
        { key: "party_date",    label: "Date",    type: "date" },
        { key: "party_time",    label: "Time",    type: "time" },
        { key: "party_venue",   label: "Venue",   type: "text", placeholder: "Sunshine Park Pavilion" },
        { key: "party_address", label: "Address", type: "textarea", placeholder: "123 Rainbow Lane" },
      ],
    },
  ],

  addons: [
    { key: "rsvp",      label: "RSVP Form",     description: "Collect RSVPs from kids and parents", plan: "free", default: true  },
    { key: "maps",      label: "Google Maps",   description: "Embed maps for your party location",   plan: "pro",  default: false },
    { key: "countdown", label: "Countdown Timer", description: "Live countdown to the party",        plan: "free", default: true  },
  ],
};
