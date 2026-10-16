import type { CollectionConfig } from "payload";

/** Generic taxonomy factory — one line per taxonomy collection. */
function taxonomy(slug: string, label: string): CollectionConfig {
  return {
    slug,
    admin: { useAsTitle: "name" },
    access: { read: () => true },
    fields: [
      { name: "name", type: "text", required: true },
      { name: "slug", type: "text", required: true, unique: true, index: true },
      { name: "description", type: "textarea" },
    ],
    hooks: {
      beforeChange: [
        ({ data }) => {
          if (data && !data.slug && data.name) {
            data.slug = String(data.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          }
          return data;
        },
      ],
    },
  };
}

export const BlogCategories = taxonomy("blog-categories", "Blog Categories");
export const NewsCategories = taxonomy("news-categories", "News Categories");
export const EventCategories = taxonomy("event-categories", "Event Categories");
export const PaperCategories = taxonomy("paper-categories", "Paper Categories");
export const TypeOfBlog = taxonomy("type-of-blog", "Type of Blog");
export const Roles = taxonomy("roles", "Roles");
export const Industries = taxonomy("industries", "Industries");
export const UseCases = taxonomy("use-cases", "Use Cases");
export const ModelCategories = taxonomy("model-categories", "Model Categories");
