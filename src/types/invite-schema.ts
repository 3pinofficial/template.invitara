// ─── Invite Schema Types ──────────────────────────────────────────
// The core types for the Invitara preset template system.
// Templates are React components built by the team.
// Users fill in UserData via a form, which is injected into the template.

import type { SectionDefinition, SectionInstance } from "./block-schema";
export type { SectionDefinition, SectionInstance } from "./block-schema";

// ─── Field Types ─────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "time"
  | "url"
  | "phone"
  | "image"
  | "video"
  | "color"
  | "select"
  | "toggle"
  | "number";

export type SupportedLanguage = "en" | "te" | "ta" | "hi" | "kn" | "ml";

export type AddonPlan = "free" | "pro";

// ─── Template Schema (schema.json per template) ───────────────────
// Authored by your team. Defines what users can edit.

export interface FieldDefinition {
  key: string;          // e.g. "brideName", "weddingDate"
  label: string;        // Display name in the form panel
  type: FieldType;
  required?: boolean;
  optional?: boolean;   // Can be skipped entirely
  multilingual?: boolean; // If true, stores { en: "...", te: "..." }
  placeholder?: string;
  aspectRatio?: string; // For image type, e.g. "1:1", "16:9", "4:3"
  maxSizeMb?: number;   // For image/video uploads
  options?: { label: string; value: string }[]; // For select type
  group?: string;       // Grouping label in the form panel
  min?: number;         // For number type — minimum value
  max?: number;         // For number type — maximum value
  defaultValue?: unknown; // Default value when field is unset
}

export interface EventSchema {
  key: string;          // e.g. "mehendi", "wedding"
  label: string;        // Display name e.g. "Mehendi Ceremony"
  icon?: string;        // Emoji or icon name
  optional?: boolean;   // User can toggle this event on/off
  fields: FieldDefinition[];
}

export interface AddonDefinition {
  key: string;          // e.g. "maps", "rsvp"
  label: string;        // Display name
  description?: string;
  plan: AddonPlan;
  default: boolean;     // Whether enabled by default
  icon?: string;
}

export interface TemplateSchema {
  slug: string;                         // Unique, matches folder name
  name: string;                         // Display name e.g. "Meenaaya"
  category: string;                     // e.g. "South Indian Wedding"
  thumbnail: string;                    // Path to thumbnail image
  supportedLanguages: SupportedLanguage[];
  globalFields: FieldDefinition[];      // Fields at the top level (couple info, photos)
  events: EventSchema[];                // Per-ceremony fields
  addons: AddonDefinition[];            // Optional blocks with Pro gating
  sections?: SectionDefinition[];       // Block-based section definitions
}

// ─── User Data ────────────────────────────────────────────────────
// The actual data a user fills in. Stored as JSONB in the events table.

// Multilingual field value: { en: "Meena", te: "మీనా" }
export type MultilingualValue = Partial<Record<SupportedLanguage, string>>;

// A single field value can be a string, multilingual map, or boolean
export type FieldValue = string | MultilingualValue | boolean;

// The full user data object: fieldKey → value
// Using unknown at index level to be compatible with JSONB data from Supabase
export type UserData = Record<string, unknown>;

// Helper to resolve a multilingual value with fallback to English
export function resolveField(
  value: unknown,
  language: SupportedLanguage = "en"
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "object" && value !== null) {
    // Multilingual map — return requested language or fall back to English
    const map = value as Record<string, string>;
    return map[language] ?? map["en"] ?? Object.values(map)[0] ?? "";
  }
  return "";
}

// ─── Invite Record ───────────────────────────────────────────────
// Matches the public.events row (the relevant fields)

export interface InviteRecord {
  id: string;
  user_id: string;
  template_id: string;       // FK to templates table
  template_slug: string;     // Denormalized for fast lookups
  slug: string;              // Public URL slug: /i/[slug]
  status: "draft" | "preview" | "published" | "expired" | "archived";
  user_data: UserData;
  language: SupportedLanguage;
  enabled_addons: string[];
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Template Component Contract ─────────────────────────────────
// Every template component must accept these props.

export interface InviteProps {
  userData: UserData;
  language: SupportedLanguage;
  enabledAddons: string[];
  isPreview?: boolean;         // true in editor — skip autoplay, disable links
  onImageClick?: (fieldKey: string) => void; // Editor: opens crop modal
  sectionInstances?: SectionInstance[];      // Passed by the editor to live-preview section changes
  eventId?: string;            // The events.id UUID — needed for RSVP submission
}

// ─── Editor State (lightweight, replaces old editor-store) ────────

export interface EditorState {
  inviteId: string | null;
  templateSlug: string | null;
  userData: UserData;
  language: SupportedLanguage;
  enabledAddons: string[];
  activeTab: "edit" | "preview" | "addons" | "sections"; // Tabs
  viewportPreview: "mobile" | "desktop";
  isDirty: boolean;
  isSaving: boolean;
  activeCropField: string | null;          // fieldKey of image being cropped
  activeVideoField: string | null;         // fieldKey of video being uploaded
  sectionInstances: SectionInstance[];     // Block-based section instances
  selectedSectionId: string | null;        // Currently selected section in editor
}
