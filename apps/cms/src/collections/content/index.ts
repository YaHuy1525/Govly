import type { CollectionConfig } from "payload";
import { seoFields, withHooks } from "../shared";

/** Generic content-collection factory for article-shaped content. */
function article(
  slug: string,
  label: string,
  extraFields: CollectionConfig["fields"] = [],
): CollectionConfig {
  return {
    slug,
    admin: { useAsTitle: "title", defaultColumns: ["title", "publishedAt", "updatedAt"] },
    versions: { drafts: true },
    access: { read: () => true },
    hooks: withHooks.hooks,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "slug", type: "text", required: true, unique: true, index: true },
      { name: "excerpt", type: "textarea", maxLength: 300 },
      { name: "cover", type: "upload", relationTo: "media" },
      { name: "body", type: "richText", required: true },
      { name: "authors", type: "relationship", relationTo: "users", hasMany: true },
      { name: "publishedAt", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
      { name: "featured", type: "checkbox", defaultValue: false },
      ...extraFields,
      ...seoFields,
    ],
  };
}

export const Blog = article("blog", "Blog", [
  { name: "categories", type: "relationship", relationTo: "blog-categories", hasMany: true },
  { name: "typeOfBlog", type: "relationship", relationTo: "type-of-blog" },
  { name: "readingTime", type: "number" },
]);

export const News = article("news", "News", [
  { name: "categories", type: "relationship", relationTo: "news-categories", hasMany: true },
  { name: "source", type: "text" },
  { name: "sourceUrl", type: "text" },
]);

export const Glossary = article("glossary", "Glossary", [
  { name: "term", type: "text", required: true },
  { name: "definition", type: "richText", required: true },
  { name: "related", type: "relationship", relationTo: "glossary", hasMany: true },
]);

export const MediaCoverage = article("media-coverage", "Media Coverage", [
  { name: "outlet", type: "text", required: true },
  { name: "url", type: "text" },
  { name: "logo", type: "upload", relationTo: "media" },
]);

export const Papers = article("papers", "Papers", [
  { name: "abstract", type: "textarea", required: true },
  { name: "pdf", type: "upload", relationTo: "media" },
  { name: "categories", type: "relationship", relationTo: "paper-categories", hasMany: true },
  { name: "authorsList", type: "text" },
]);

export const Learn = article("learn", "Learn", [
  { name: "category", type: "text" },
  { name: "related", type: "relationship", relationTo: "learn", hasMany: true },
]);

export const Events = article("events", "Events", [
  { name: "description", type: "richText", required: true },
  { name: "date", type: "date", required: true },
  { name: "endDate", type: "date" },
  { name: "location", type: "text" },
  { name: "type", type: "relationship", relationTo: "event-categories" },
  { name: "registrationUrl", type: "text" },
]);

export const Newsletters = article("newsletters", "Newsletters", [
  { name: "issue", type: "number" },
  { name: "month", type: "text" },
  { name: "year", type: "number" },
  { name: "pdf", type: "upload", relationTo: "media" },
]);

export const AnalystCoverage = article("analyst-coverage", "Analyst Coverage", [
  { name: "firm", type: "text", required: true },
  { name: "report", type: "text" },
  { name: "url", type: "text" },
  { name: "quote", type: "textarea" },
  { name: "logo", type: "upload", relationTo: "media" },
]);

export const PressRelease = article("press-release", "Press Release", [
  { name: "dateline", type: "text" },
  { name: "contact", type: "text" },
]);

export const CaseStudy = article("case-study", "Case Study", [
  { name: "client", type: "text", required: true },
  { name: "industry", type: "relationship", relationTo: "industries" },
  { name: "challenge", type: "richText", required: true },
  { name: "solution", type: "richText", required: true },
  { name: "results", type: "array", fields: [{ name: "value", type: "text" }, { name: "label", type: "text" }] },
  { name: "logo", type: "upload", relationTo: "media" },
]);

export const RedTeaming = article("red-teaming", "Red Teaming", [
  { name: "model", type: "text", required: true },
  { name: "vendor", type: "text" },
  { name: "findings", type: "richText", required: true },
  { name: "report", type: "upload", relationTo: "media" },
]);

export const ExecutiveBios = article("executive-bios", "Executive Bios", [
  { name: "name", type: "text", required: true },
  { name: "role", type: "text", required: true },
  { name: "bio", type: "richText", required: true },
  { name: "photo", type: "upload", relationTo: "media" },
  { name: "linkedin", type: "text" },
  { name: "twitter", type: "text" },
]);

/** Persona / industry / use-case pages — article shell, content from CMS. */
export const RolePages = article("role-pages", "Role Pages", [
  { name: "role", type: "relationship", relationTo: "roles" },
]);
export const IndustryPages = article("industry-pages", "Industry Pages", [
  { name: "industry", type: "relationship", relationTo: "industries" },
]);
export const UseCasePages = article("use-case-pages", "Use Case Pages", [
  { name: "useCase", type: "relationship", relationTo: "use-cases" },
]);
