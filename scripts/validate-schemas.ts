import {
  ALL_TEMPLATE_SCHEMAS,
  REGISTERED_SLUGS,
  getTemplateDefinition,
  getTemplateComponent,
} from "../src/lib/registry";
import { validateSchema } from "../src/lib/validate";

console.log("Starting template validation and integrity checks...");

let hasErrors = false;

// 1. Zod Schema Validation
console.log("\n--- Running Schema Schema Validation ---");
for (const schema of ALL_TEMPLATE_SCHEMAS) {
  console.log(`Validating schema config for: ${schema.slug}...`);
  const result = validateSchema(schema);
  if (!result.success) {
    console.error(`❌ Validation failed for template: ${schema.slug}`);
    console.error(result.error);
    hasErrors = true;
  } else {
    console.log(`✅ Template ${schema.slug} schema is valid!`);
  }
}

// 2. Duplicate Slug Protection
console.log("\n--- Checking for Duplicate Slugs ---");
const slugToTemplates = new Map<string, string[]>();
for (const schema of ALL_TEMPLATE_SCHEMAS) {
  if (!slugToTemplates.has(schema.slug)) {
    slugToTemplates.set(schema.slug, []);
  }
  slugToTemplates.get(schema.slug)!.push(schema.name);
}

for (const [slug, names] of slugToTemplates.entries()) {
  if (names.length > 1) {
    console.error(`❌ Duplicate template slug detected:\n${slug}\n\nFound in:\n${names.join("\n")}`);
    hasErrors = true;
  }
}
if (!hasErrors) {
  console.log("✅ No duplicate slugs detected.");
}

// 3. Registry Integrity Validation
console.log("\n--- Running Registry Integrity Checks ---");
const schemaSlugs = new Set(ALL_TEMPLATE_SCHEMAS.map((s) => s.slug));

// Check registered slugs mapping
for (const slug of REGISTERED_SLUGS) {
  console.log(`Checking registry entry: ${slug}...`);
  
  // Verify metadata exists for registered slug
  if (!schemaSlugs.has(slug)) {
    console.error(`❌ Registry mismatch: Slug "${slug}" is registered in REGISTRY but is missing from ALL_TEMPLATE_SCHEMAS.`);
    hasErrors = true;
    continue;
  }

  // Verify definition resolves correctly
  const def = getTemplateDefinition(slug);
  if (!def) {
    console.error(`❌ Registry mismatch: getTemplateDefinition("${slug}") returned null.`);
    hasErrors = true;
    continue;
  }

  // Verify component is registered
  const component = getTemplateComponent(slug);
  if (!component) {
    console.error(`❌ Component missing: Template "${slug}" is registered but component is undefined/missing.`);
    hasErrors = true;
  } else {
    console.log(`✅ Registry entry "${slug}" resolves to a valid component and has matching metadata.`);
  }
}

// Check if any schema is not registered in the REGISTRY
const registeredSlugsSet = new Set(REGISTERED_SLUGS);
for (const schema of ALL_TEMPLATE_SCHEMAS) {
  if (!registeredSlugsSet.has(schema.slug)) {
    console.error(`❌ Registry mismatch: Schema for "${schema.slug}" is in ALL_TEMPLATE_SCHEMAS but is missing from the REGISTRY.`);
    hasErrors = true;
  }
}

// Final result reporting
console.log("\n--- Summary ---");
if (hasErrors) {
  console.error("❌ Validation failed! Please fix the errors listed above.");
  process.exit(1);
} else {
  console.log("🎉 All schemas, slugs, and registry entries are 100% valid and verified!");
  process.exit(0);
}
