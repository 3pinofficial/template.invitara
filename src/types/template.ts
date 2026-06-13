// ─── Template Registry Types ────────────────────────────────────────────────
// The single source of truth for the template system.
// Templates = React Component + Schema. No JSON engine, no coordinate math.

import type { ComponentType } from "react";
import type {
  InviteProps,
  FieldDefinition,
  EventSchema,
  AddonDefinition,
  SupportedLanguage,
} from "./invite-schema";
import type { SectionDefinition } from "./block-schema";

// ─── Tier & Motion ──────────────────────────────────────────────────────────
// Pricing tier gates template access. Motion level signals what the user
// should expect visually and lets us filter at the picker level.

export type TemplateTier = "free" | "basic" | "premium" | "royal";

export type TemplateMotionLevel =
  | "classic"    // No animations — formal/professional invites
  | "animated"   // Reveals, stagger, gentle motion — standard wedding
  | "cinematic"; // Parallax, scroll-pin, full motion — top-tier wedding

export const TIER_RANK: Record<TemplateTier, number> = {
  free: 0,
  basic: 1,
  premium: 2,
  royal: 3,
};

// ─── Template Schema ─────────────────────────────────────────────────────────

export interface TemplateDefinition {
  slug: string;
  name: string;
  /** Display label for the category (e.g. "Indian Wedding"). Free text. */
  category: string;
  /** FK reference into `template_categories.slug` — used by the sync script
   *  to populate `templates.category_id`. Must match an existing category. */
  categorySlug: string;
  description?: string;
  thumbnail: string;
  canvasWidth: number;

  /** Pricing tier — gates template access against user plan */
  tier: TemplateTier;
  /** Motion expectation — drives filtering and accessibility decisions */
  motionLevel: TemplateMotionLevel;
  /** Languages this template ships translations for */
  supportedLanguages: SupportedLanguage[];

  /** Version of the template (semver format) */
  version: string;
  /** Lifecycle status of the template */
  status: "draft" | "preview" | "published" | "deprecated";

  globalFields: FieldDefinition[];
  events: EventSchema[];
  addons: AddonDefinition[];
  sections: SectionDefinition[];

  /** The React component that renders the template */
  component: ComponentType<InviteProps>;
}

/** A template schema without its runtime component — what each template's
 *  schema.ts exports. The registry injects the component. */
export type TemplateSchemaDefinition = Omit<TemplateDefinition, "component">;
