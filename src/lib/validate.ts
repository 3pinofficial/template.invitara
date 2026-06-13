import { z } from "zod";
import type { TemplateSchemaDefinition } from "../types/template";

export const FieldTypeSchema = z.enum([
  "text",
  "textarea",
  "date",
  "time",
  "url",
  "phone",
  "image",
  "video",
  "color",
  "select",
  "toggle",
  "number",
]);

export const SupportedLanguageSchema = z.enum(["en", "te", "ta", "hi", "kn", "ml"]);

export const AddonPlanSchema = z.enum(["free", "pro"]);

export const FieldDefinitionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: FieldTypeSchema,
  required: z.boolean().optional(),
  optional: z.boolean().optional(),
  multilingual: z.boolean().optional(),
  placeholder: z.string().optional(),
  aspectRatio: z.string().optional(),
  maxSizeMb: z.number().optional(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  group: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  defaultValue: z.unknown().optional(),
});

export const EventSchemaVal = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().optional(),
  optional: z.boolean().optional(),
  fields: z.array(FieldDefinitionSchema),
});

export const AddonDefinitionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  plan: AddonPlanSchema,
  default: z.boolean(),
  icon: z.string().optional(),
});

export const SectionTypeSchema = z.enum([
  "hero",
  "intro",
  "schedule",
  "event-details",
  "gallery",
  "rsvp",
  "footer",
]);

export const SectionFieldTypeSchema = z.enum([
  "text",
  "textarea",
  "date",
  "time",
  "url",
  "phone",
  "image",
  "video",
  "color",
  "select",
  "toggle",
]);

export const SectionFieldDefSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: SectionFieldTypeSchema,
  required: z.boolean().optional(),
  optional: z.boolean().optional(),
  multilingual: z.boolean().optional(),
  placeholder: z.string().optional(),
  aspectRatio: z.string().optional(),
  maxSizeMb: z.number().optional(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  defaultValue: z.union([z.string(), z.boolean()]).optional(),
});

export const SectionStyleConfigSchema = z.object({
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  textColor: z.string().optional(),
  accentColor: z.string().optional(),
  padding: z.string().optional(),
  borderRadius: z.string().optional(),
});

export const EffectNameSchema = z.enum([
  "reveal",
  "scale-in",
  "float",
  "parallax",
  "stagger",
  "slide-left",
  "slide-right",
  "typewriter",
  "none",
]);

export const SectionDefinitionSchema = z.object({
  id: z.string().min(1),
  type: SectionTypeSchema,
  label: z.string().min(1),
  icon: z.string().optional(),
  required: z.boolean(),
  pinned: z.enum(["top", "bottom"]).optional(),
  defaultEnabled: z.boolean(),
  plan: AddonPlanSchema.optional(),
  order: z.number(),
  fields: z.array(SectionFieldDefSchema),
  style: SectionStyleConfigSchema.optional(),
  repeatable: z.boolean().optional(),
  maxInstances: z.number().optional(),
  variant: z.string().optional(),
  effects: z.array(EffectNameSchema).optional(),
});

export const TemplateSchemaDefinitionVal = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  categorySlug: z.string().min(1),
  description: z.string().optional(),
  thumbnail: z.string().min(1),
  canvasWidth: z.number().positive(),
  tier: z.enum(["free", "basic", "premium", "royal"]),
  motionLevel: z.enum(["classic", "animated", "cinematic"]),
  supportedLanguages: z.array(SupportedLanguageSchema).min(1),
  version: z.string().regex(/^[0-9]+\.[0-9]+\.[0-9]+$/),
  status: z.enum(["draft", "preview", "published", "deprecated"]),
  globalFields: z.array(FieldDefinitionSchema),
  events: z.array(EventSchemaVal),
  addons: z.array(AddonDefinitionSchema),
  sections: z.array(SectionDefinitionSchema),
});

export function validateSchema(schema: unknown): { success: true; data: TemplateSchemaDefinition } | { success: false; error: string } {
  const result = TemplateSchemaDefinitionVal.safeParse(schema);
  if (result.success) {
    return { success: true, data: result.data as unknown as TemplateSchemaDefinition };
  } else {
    return { success: false, error: result.error.issues.map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`).join("\n") };
  }
}
