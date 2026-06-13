// ─── Entry Point for @invitara/templates ─────────────────────────────────────

// 1. Export template components
export { default as WeddingElegant } from "./templates/wedding-elegant";
export { default as WeddingModern } from "./templates/wedding-modern";
export { default as WeddingChristian } from "./templates/wedding-christian";
export { default as KidsBirthday } from "./templates/kids-birthday";
export { default as WeddingHindu } from "./templates/wedding-hindu";

// 2. Export template schemas
export { templateConfig as weddingElegantSchema } from "./templates/wedding-elegant/schema";
export { templateConfig as weddingModernSchema } from "./templates/wedding-modern/schema";
export { templateConfig as weddingChristianSchema } from "./templates/wedding-christian/schema";
export { templateConfig as kidsBirthdaySchema } from "./templates/kids-birthday/schema";
export { templateConfig as weddingHinduSchema } from "./templates/wedding-hindu/schema";

// 3. Export template registry and helpers
export { templateRegistry } from "./registry/templates";
export {
  getTemplateDefinition,
  getTemplateComponent,
  getAllTemplates,
  canUserAccessTemplate,
  getTemplateBySlug,
  getPublishedTemplates,
  getTemplatesByCategory,
  ALL_TEMPLATE_SCHEMAS,
  REGISTERED_SLUGS,
} from "./lib/registry";
export { validateSchema } from "./lib/validate";

// 4. Export all core types
export * from "./types/invitation";
export * from "./types/invite-schema";
export * from "./types/block-schema";
export * from "./types/template";
