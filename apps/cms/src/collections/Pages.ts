import type { CollectionConfig } from "payload";
import { seoFields, withHooks } from "./shared";

/**
 * Pages — flexible block pages (static pages: about, careers, trust-center…).
 */
export const Pages: CollectionConfig = {
  slug: "pages",
  admin: { useAsTitle: "title" },
  versions: { drafts: true },
  access: { read: () => true },
  hooks: withHooks.hooks,
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "layout",
      type: "blocks",
      blocks: [
        {
          slug: "hero",
          fields: [
            { name: "heading", type: "text", required: true },
            { name: "subheading", type: "textarea" },
            { name: "primaryCta", type: "text" },
            { name: "primaryCtaHref", type: "text" },
            { name: "secondaryCta", type: "text" },
            { name: "secondaryCtaHref", type: "text" },
            { name: "image", type: "upload", relationTo: "media" },
          ],
        },
        {
          slug: "stats",
          fields: [
            {
              name: "stats",
              type: "array",
              fields: [
                { name: "value", type: "text", required: true },
                { name: "label", type: "text", required: true },
                { name: "source", type: "text" },
              ],
            },
          ],
        },
        {
          slug: "logos",
          fields: [
            { name: "label", type: "text" },
            { name: "logos", type: "array", fields: [{ name: "image", type: "upload", relationTo: "media" }, { name: "alt", type: "text" }] },
          ],
        },
        {
          slug: "richtext",
          fields: [{ name: "content", type: "richText" }],
        },
        {
          slug: "faq",
          fields: [
            { name: "items", type: "array", fields: [{ name: "question", type: "text" }, { name: "answer", type: "richText" }] },
          ],
        },
        {
          slug: "cta",
          fields: [
            { name: "heading", type: "text" },
            { name: "body", type: "textarea" },
            { name: "buttonLabel", type: "text" },
            { name: "buttonHref", type: "text" },
          ],
        },
        {
          slug: "embed",
          fields: [
            { name: "formSlug", type: "text" },
            { name: "minHeight", type: "number", defaultValue: 560 },
          ],
        },
      ],
    },
    ...seoFields,
  ],
};
