// ─── Template Registry ───────────────────────────────────────────────────────
// Single source of truth: maps template slugs → { ...schema, component }.

import React from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { InviteProps } from "../types/invite-schema";
import type {
  TemplateDefinition,
  TemplateSchemaDefinition,
  TemplateTier,
} from "../types/template";
import { TIER_RANK } from "../types/template";

// ─── Schema imports ──────────────────────────────────────────────────────────
import { templateConfig as weddingElegantSchema } from "../templates/wedding-elegant/schema";
import { templateConfig as weddingModernSchema } from "../templates/wedding-modern/schema";
import { templateConfig as weddingChristianSchema } from "../templates/wedding-christian/schema";
import { templateConfig as kidsBirthdaySchema } from "../templates/kids-birthday/schema";
import { templateConfig as weddingHinduSchema } from "../templates/wedding-hindu/schema";

// ─── Loader ─────────────────────────────────────────────────────────────────
const TemplateLoader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      minHeight: 400,
      width: "100%",
      background: "transparent",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 28,
          height: 28,
          border: "2px solid rgba(255,255,255,0.1)",
          borderTop: "2px solid rgba(201,168,76,0.8)",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <span style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
        Loading Template
      </span>
    </div>
  </div>
);

// ─── Dynamic component imports ──────────────────────────────────────────────
const WeddingElegantComponent = dynamic(
  () => import("../templates/wedding-elegant/index"),
  { loading: TemplateLoader }
) as ComponentType<InviteProps>;

const WeddingModernComponent = dynamic(
  () => import("../templates/wedding-modern/index"),
  { loading: TemplateLoader }
) as ComponentType<InviteProps>;

const WeddingChristianComponent = dynamic(
  () => import("../templates/wedding-christian/index"),
  { loading: TemplateLoader }
) as ComponentType<InviteProps>;

const KidsBirthdayComponent = dynamic(
  () => import("../templates/kids-birthday/index"),
  { loading: TemplateLoader }
) as ComponentType<InviteProps>;

const WeddingHinduComponent = dynamic(
  () => import("../templates/wedding-hindu/index"),
  { loading: TemplateLoader }
) as ComponentType<InviteProps>;

// ─── Registry ────────────────────────────────────────────────────────────────
const REGISTRY: Record<string, TemplateDefinition> = {
  "wedding-elegant": { ...weddingElegantSchema, component: WeddingElegantComponent },
  "wedding-modern": { ...weddingModernSchema, component: WeddingModernComponent },
  "wedding-christian": { ...weddingChristianSchema, component: WeddingChristianComponent },
  "kids-birthday": { ...kidsBirthdaySchema, component: KidsBirthdayComponent },
  "wedding-hindu": { ...weddingHinduSchema, component: WeddingHinduComponent },
};

export const REGISTERED_SLUGS = Object.keys(REGISTRY);

// ─── Lookup helpers ──────────────────────────────────────────────────────────
export function getTemplateDefinition(slug: string): TemplateDefinition | null {
  return REGISTRY[slug] ?? null;
}

export function getTemplateBySlug(slug: string): TemplateDefinition | null {
  return REGISTRY[slug] ?? null;
}

export function getTemplateComponent(slug: string): ComponentType<InviteProps> | null {
  return REGISTRY[slug]?.component ?? null;
}

export function getPublishedTemplates(): TemplateDefinition[] {
  return Object.values(REGISTRY).filter((t) => t.status === "published");
}

export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return Object.values(REGISTRY).filter((t) => t.category === category);
}

export function getAllTemplates(opts?: {
  tier?: TemplateTier;
  category?: string;
}): TemplateDefinition[] {
  return Object.values(REGISTRY).filter((t) => {
    if (opts?.tier && TIER_RANK[t.tier] > TIER_RANK[opts.tier]) return false;
    if (opts?.category && t.category !== opts.category) return false;
    return true;
  });
}

/** Whether a user on `userTier` can access this template. */
export function canUserAccessTemplate(
  template: TemplateDefinition,
  userTier: TemplateTier
): boolean {
  return TIER_RANK[template.tier] <= TIER_RANK[userTier];
}

/** Pure-data list of every template schema. Used by the registry → DB sync */
export const ALL_TEMPLATE_SCHEMAS: TemplateSchemaDefinition[] = [
  weddingElegantSchema,
  weddingModernSchema,
  weddingChristianSchema,
  kidsBirthdaySchema,
  weddingHinduSchema,
];
