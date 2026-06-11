// ─── Block/Section Schema Types ──────────────────────────────────
// Defines the section-based architecture for Invitara templates.
// Templates are composed of reorderable, toggleable sections.

// ─── Effect Names ──────────────────────────────────────────────
// Declared in schema.json to apply animations to any section.

export type EffectName =
  | "reveal"        // Fade + slide in on scroll
  | "scale-in"      // Scale from 0 on scroll
  | "float"         // Gentle floating loop
  | "parallax"      // Scroll parallax depth
  | "stagger"       // Children stagger in
  | "slide-left"    // Slide in from left
  | "slide-right"   // Slide in from right
  | "typewriter"    // Typewriter text effect
  | "none";         // No animation

// ─── Section Types ──────────────────────────────────────────────

export type SectionType =
  | "hero"
  | "intro"
  | "schedule"
  | "event-details"
  | "gallery"
  | "rsvp"
  | "footer";

// ─── Section Field Definition ───────────────────────────────────

export type SectionFieldType =
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
  | "toggle";

export interface SectionFieldDef {
  key: string;
  label: string;
  type: SectionFieldType;
  required?: boolean;
  optional?: boolean;
  multilingual?: boolean;
  placeholder?: string;
  aspectRatio?: string;       // For image type, e.g. "1:1"
  maxSizeMb?: number;         // For image/video uploads
  options?: { label: string; value: string }[];
  defaultValue?: string | boolean;
}

// ─── Section Style Config ───────────────────────────────────────

export interface SectionStyleConfig {
  backgroundColor?: string;
  backgroundImage?: string;
  textColor?: string;
  accentColor?: string;
  padding?: string;           // e.g. "48px 24px"
  borderRadius?: string;
}

// ─── Section Definition (authored in template schema.json) ──────

export interface SectionDefinition {
  id: string;                   // Unique ID, e.g. "section-hero"
  type: SectionType;
  label: string;                // Display name in the editor
  icon?: string;                // Emoji for UI
  required: boolean;            // Can the user remove this?
  pinned?: "top" | "bottom";    // Lock position in the order
  defaultEnabled: boolean;      // Shown by default?
  plan?: "free" | "pro";        // Plan gating
  order: number;                // Default display order
  fields: SectionFieldDef[];    // Editable fields within this section
  style?: SectionStyleConfig;   // Optional per-section styling overrides
  repeatable?: boolean;         // e.g. event-details can have N event cards
  maxInstances?: number;        // Limit on repeatable instances
  // ── Registry-driven rendering ────────────────────────────────
  variant?: string;             // e.g. "centered", "arched-cards", "split"
  effects?: EffectName[];       // e.g. ["reveal", "float"]
}

// ─── Section Instance (runtime user state) ──────────────────────

export interface SectionInstance {
  sectionId: string;            // References SectionDefinition.id
  enabled: boolean;
  order: number;                // User-customized order
  fieldValues: Record<string, unknown>;
  styleOverrides?: Partial<SectionStyleConfig>;
}

// ─── Sections Config (subset of template schema) ────────────────

export interface TemplateSectionsConfig {
  sections: SectionDefinition[];
  availableSections: SectionType[];
}

// ─── Helper: Build default section instances from definitions ────

export function buildDefaultSectionInstances(
  definitions: SectionDefinition[]
): SectionInstance[] {
  return definitions.map((def) => {
    const fieldValues: Record<string, unknown> = {};
    for (const field of def.fields) {
      if (field.defaultValue !== undefined) {
        fieldValues[field.key] = field.defaultValue;
      }
    }
    return {
      sectionId: def.id,
      enabled: def.defaultEnabled,
      order: def.order,
      fieldValues,
    };
  });
}

// ─── Helper: Get sorted enabled sections ────────────────────────

export function getSortedEnabledSections(
  definitions: SectionDefinition[],
  instances: SectionInstance[]
): { definition: SectionDefinition; instance: SectionInstance }[] {
  return instances
    .filter((inst) => inst.enabled)
    .sort((a, b) => a.order - b.order)
    .map((inst) => {
      const definition = definitions.find((d) => d.id === inst.sectionId);
      return definition ? { definition, instance: inst } : null;
    })
    .filter(Boolean) as { definition: SectionDefinition; instance: SectionInstance }[];
}
