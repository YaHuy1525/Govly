import type { CollectionConfig } from "payload";

/**
 * Media — uploads with responsive sizes matching the original's usage
 * (thumb 150, card 400, hero 1200, og 1200x630).
 */
export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    imageSizes: [
      { name: "thumb", width: 150, height: 150, position: "centre" },
      { name: "card", width: 400, height: 300, position: "centre" },
      { name: "hero", width: 1200, height: 630, position: "centre" },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    adminThumbnail: "thumb",
    mimeTypes: ["image/*", "application/pdf"],
  },
  access: { read: () => true },
  fields: [
    { name: "alt", type: "text", required: true },
  ],
};
