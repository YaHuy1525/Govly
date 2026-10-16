// Load .env before anything reads process.env. ESM imports are hoisted, so a
// script that calls dotenv() after importing this module would be too late —
// the DB connection string would silently fall back to a default.
import { config as loadEnv } from "dotenv";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";

import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { Pages } from "./collections/Pages";
import { Forms } from "./collections/content/Forms";

import {
  AnalystCoverage,
  Blog,
  CaseStudy,
  Events,
  ExecutiveBios,
  Glossary,
  IndustryPages,
  Learn,
  MediaCoverage,
  News,
  Newsletters,
  Papers,
  PressRelease,
  RedTeaming,
  RolePages,
  UseCasePages,
} from "./collections/content";

import {
  BlogCategories,
  EventCategories,
  Industries,
  ModelCategories,
  NewsCategories,
  PaperCategories,
  Roles,
  TypeOfBlog,
  UseCases,
} from "./collections/taxonomies";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env before anything reads process.env. ESM imports are hoisted, so a
// script that calls dotenv() after importing this module would be too late —
// the DB connection string would silently fall back to a default.
loadEnv({ path: path.resolve(dirname, "../.env") });

const DATABASE_URI = process.env.DATABASE_URI;
if (!DATABASE_URI) {
  throw new Error(
    "DATABASE_URI is not set. Copy apps/cms/.env.example to apps/cms/.env " +
      "(or run `docker compose up -d` for the local Postgres on port 5433).",
  );
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname, "src") },
  },
  collections: [
    Users,
    Media,
    Pages,
    // taxonomies
    BlogCategories,
    NewsCategories,
    EventCategories,
    PaperCategories,
    TypeOfBlog,
    Roles,
    Industries,
    UseCases,
    ModelCategories,
    // content
    Blog,
    News,
    Glossary,
    MediaCoverage,
    Papers,
    Learn,
    Events,
    Newsletters,
    AnalystCoverage,
    PressRelease,
    CaseStudy,
    RedTeaming,
    ExecutiveBios,
    RolePages,
    IndustryPages,
    UseCasePages,
    Forms,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  typescript: { outputFile: path.resolve(dirname, "src/payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: DATABASE_URI },
  }),
  sharp,
});
