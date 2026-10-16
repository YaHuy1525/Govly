import type { CollectionConfig } from "payload";

/** Shared SEO block for every content collection. */
const seoFields = [
  { name: "seoTitle", type: "text" as const, label: "SEO Title" },
  { name: "seoDescription", type: "textarea" as const, label: "SEO Description", maxLength: 320 },
  { name: "ogImage", type: "upload" as const, relationTo: "media" as const },
];

/** Auto-slug + SEO defaults on save. */
export const withHooks: Pick<CollectionConfig, "hooks"> = {
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data && !data.slug && data.title) {
          data.slug = String(data.title)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }
        if (data && !data.seoTitle && data.title) data.seoTitle = data.title;
        if (data && !data.seoDescription && data.excerpt) data.seoDescription = data.excerpt;
        return data;
      },
    ],
  },
};

export { seoFields };
