import type { CollectionConfig } from "payload";
import { withHooks } from "../shared";

/**
 * Forms — embeddable form configs, mirrored to the Convex `forms` table.
 * The web app reads the slug; hai-brain renders the form.
 */
export const Forms: CollectionConfig = {
  slug: "forms",
  admin: { useAsTitle: "slug" },
  access: { read: () => true },
  hooks: withHooks.hooks,
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "title", type: "text", required: true },
    {
      name: "fields",
      type: "array",
      fields: [
        {
          name: "type",
          type: "select",
          required: true,
          options: ["text", "email", "select", "textarea", "checkbox"],
        },
        { name: "name", type: "text", required: true },
        { name: "label", type: "text", required: true },
        { name: "placeholder", type: "text" },
        { name: "required", type: "checkbox", defaultValue: false },
        { name: "options", type: "array", fields: [{ name: "value", type: "text" }] },
      ],
    },
    { name: "theme", type: "json" },
    { name: "minHeight", type: "number", defaultValue: 560 },
    { name: "active", type: "checkbox", defaultValue: true },
  ],
};
