import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: any): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blog_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_glossary_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__glossary_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_coverage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_coverage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_papers_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__papers_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_learn_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__learn_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_newsletters_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__newsletters_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_analyst_coverage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__analyst_coverage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_press_release_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__press_release_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_case_study_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_study_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_red_teaming_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__red_teaming_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_executive_bios_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__executive_bios_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_role_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__role_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_industry_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__industry_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_use_case_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__use_case_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_forms_fields_type" AS ENUM('text', 'email', 'select', 'textarea', 'checkbox');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"primary_cta" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta" varchar,
  	"secondary_cta_href" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"source" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "pages_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_richtext" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_slug" varchar,
  	"min_height" numeric DEFAULT 560,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"primary_cta" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta" varchar,
  	"secondary_cta_href" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"source" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_richtext" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_slug" varchar,
  	"min_height" numeric DEFAULT 560,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "event_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "paper_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "type_of_blog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "industries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "use_cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "model_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"type_of_blog_id" integer,
  	"reading_time" numeric,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "blog_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"blog_categories_id" integer
  );
  
  CREATE TABLE "_blog_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_type_of_blog_id" integer,
  	"version_reading_time" numeric,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_blog_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"blog_categories_id" integer
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"source" varchar,
  	"source_url" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"news_categories_id" integer
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_source" varchar,
  	"version_source_url" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"news_categories_id" integer
  );
  
  CREATE TABLE "glossary" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"term" varchar,
  	"definition" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_glossary_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "glossary_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"glossary_id" integer
  );
  
  CREATE TABLE "_glossary_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_term" varchar,
  	"version_definition" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__glossary_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_glossary_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"glossary_id" integer
  );
  
  CREATE TABLE "media_coverage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"outlet" varchar,
  	"url" varchar,
  	"logo_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_media_coverage_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "media_coverage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_media_coverage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_outlet" varchar,
  	"version_url" varchar,
  	"version_logo_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__media_coverage_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_media_coverage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "papers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"abstract" varchar,
  	"pdf_id" integer,
  	"authors_list" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_papers_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "papers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"paper_categories_id" integer
  );
  
  CREATE TABLE "_papers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_abstract" varchar,
  	"version_pdf_id" integer,
  	"version_authors_list" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__papers_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_papers_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"paper_categories_id" integer
  );
  
  CREATE TABLE "learn" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"category" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_learn_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "learn_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"learn_id" integer
  );
  
  CREATE TABLE "_learn_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_category" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__learn_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_learn_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"learn_id" integer
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"description" jsonb,
  	"date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"location" varchar,
  	"type_id" integer,
  	"registration_url" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_description" jsonb,
  	"version_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_type_id" integer,
  	"version_registration_url" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "newsletters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"issue" numeric,
  	"month" varchar,
  	"year" numeric,
  	"pdf_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_newsletters_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "newsletters_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_newsletters_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_issue" numeric,
  	"version_month" varchar,
  	"version_year" numeric,
  	"version_pdf_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__newsletters_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_newsletters_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "analyst_coverage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"firm" varchar,
  	"report" varchar,
  	"url" varchar,
  	"quote" varchar,
  	"logo_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_analyst_coverage_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "analyst_coverage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_analyst_coverage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_firm" varchar,
  	"version_report" varchar,
  	"version_url" varchar,
  	"version_quote" varchar,
  	"version_logo_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__analyst_coverage_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_analyst_coverage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "press_release" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"dateline" varchar,
  	"contact" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_press_release_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "press_release_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_press_release_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_dateline" varchar,
  	"version_contact" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__press_release_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_press_release_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "case_study_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "case_study" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"client" varchar,
  	"industry_id" integer,
  	"challenge" jsonb,
  	"solution" jsonb,
  	"logo_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_study_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "case_study_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_case_study_v_version_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_study_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_client" varchar,
  	"version_industry_id" integer,
  	"version_challenge" jsonb,
  	"version_solution" jsonb,
  	"version_logo_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_study_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_case_study_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "red_teaming" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"model" varchar,
  	"vendor" varchar,
  	"findings" jsonb,
  	"report_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_red_teaming_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "red_teaming_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_red_teaming_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_model" varchar,
  	"version_vendor" varchar,
  	"version_findings" jsonb,
  	"version_report_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__red_teaming_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_red_teaming_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "executive_bios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"name" varchar,
  	"role" varchar,
  	"bio" jsonb,
  	"photo_id" integer,
  	"linkedin" varchar,
  	"twitter" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_executive_bios_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "executive_bios_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_executive_bios_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_bio" jsonb,
  	"version_photo_id" integer,
  	"version_linkedin" varchar,
  	"version_twitter" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__executive_bios_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_executive_bios_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "role_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"role_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_role_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "role_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_role_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_role_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__role_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_role_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "industry_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"industry_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_industry_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "industry_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_industry_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_industry_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__industry_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_industry_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "use_case_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"use_case_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_use_case_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "use_case_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "_use_case_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_use_case_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__use_case_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_use_case_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "forms_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "forms_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_forms_fields_type" NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"placeholder" varchar,
  	"required" boolean DEFAULT false
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"theme" jsonb,
  	"min_height" numeric DEFAULT 560,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"blog_categories_id" integer,
  	"news_categories_id" integer,
  	"event_categories_id" integer,
  	"paper_categories_id" integer,
  	"type_of_blog_id" integer,
  	"roles_id" integer,
  	"industries_id" integer,
  	"use_cases_id" integer,
  	"model_categories_id" integer,
  	"blog_id" integer,
  	"news_id" integer,
  	"glossary_id" integer,
  	"media_coverage_id" integer,
  	"papers_id" integer,
  	"learn_id" integer,
  	"events_id" integer,
  	"newsletters_id" integer,
  	"analyst_coverage_id" integer,
  	"press_release_id" integer,
  	"case_study_id" integer,
  	"red_teaming_id" integer,
  	"executive_bios_id" integer,
  	"role_pages_id" integer,
  	"industry_pages_id" integer,
  	"use_case_pages_id" integer,
  	"forms_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_stats" ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_logos" ADD CONSTRAINT "pages_blocks_logos_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_logos" ADD CONSTRAINT "pages_blocks_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos" ADD CONSTRAINT "pages_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_richtext" ADD CONSTRAINT "pages_blocks_richtext_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_embed" ADD CONSTRAINT "pages_blocks_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_stats" ADD CONSTRAINT "_pages_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos_logos" ADD CONSTRAINT "_pages_v_blocks_logos_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos_logos" ADD CONSTRAINT "_pages_v_blocks_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos" ADD CONSTRAINT "_pages_v_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_richtext" ADD CONSTRAINT "_pages_v_blocks_richtext_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_embed" ADD CONSTRAINT "_pages_v_blocks_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_type_of_blog_id_type_of_blog_id_fk" FOREIGN KEY ("type_of_blog_id") REFERENCES "public"."type_of_blog"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_rels" ADD CONSTRAINT "blog_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_rels" ADD CONSTRAINT "blog_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_rels" ADD CONSTRAINT "blog_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_parent_id_blog_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_version_type_of_blog_id_type_of_blog_id_fk" FOREIGN KEY ("version_type_of_blog_id") REFERENCES "public"."type_of_blog"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v_rels" ADD CONSTRAINT "_blog_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_blog_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_v_rels" ADD CONSTRAINT "_blog_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_v_rels" ADD CONSTRAINT "_blog_v_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_news_categories_fk" FOREIGN KEY ("news_categories_id") REFERENCES "public"."news_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_news_categories_fk" FOREIGN KEY ("news_categories_id") REFERENCES "public"."news_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary" ADD CONSTRAINT "glossary_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "glossary" ADD CONSTRAINT "glossary_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "glossary_rels" ADD CONSTRAINT "glossary_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_rels" ADD CONSTRAINT "glossary_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_rels" ADD CONSTRAINT "glossary_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_glossary_v" ADD CONSTRAINT "_glossary_v_parent_id_glossary_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."glossary"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_glossary_v" ADD CONSTRAINT "_glossary_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_glossary_v" ADD CONSTRAINT "_glossary_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_glossary_v_rels" ADD CONSTRAINT "_glossary_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_glossary_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_glossary_v_rels" ADD CONSTRAINT "_glossary_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_glossary_v_rels" ADD CONSTRAINT "_glossary_v_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_coverage_rels" ADD CONSTRAINT "media_coverage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_coverage_rels" ADD CONSTRAINT "media_coverage_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_parent_id_media_coverage_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_coverage"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v" ADD CONSTRAINT "_media_coverage_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_coverage_v_rels" ADD CONSTRAINT "_media_coverage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_media_coverage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_coverage_v_rels" ADD CONSTRAINT "_media_coverage_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "papers" ADD CONSTRAINT "papers_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "papers" ADD CONSTRAINT "papers_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "papers" ADD CONSTRAINT "papers_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "papers_rels" ADD CONSTRAINT "papers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."papers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "papers_rels" ADD CONSTRAINT "papers_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "papers_rels" ADD CONSTRAINT "papers_rels_paper_categories_fk" FOREIGN KEY ("paper_categories_id") REFERENCES "public"."paper_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_papers_v" ADD CONSTRAINT "_papers_v_parent_id_papers_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."papers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_papers_v" ADD CONSTRAINT "_papers_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_papers_v" ADD CONSTRAINT "_papers_v_version_pdf_id_media_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_papers_v" ADD CONSTRAINT "_papers_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_papers_v_rels" ADD CONSTRAINT "_papers_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_papers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_papers_v_rels" ADD CONSTRAINT "_papers_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_papers_v_rels" ADD CONSTRAINT "_papers_v_rels_paper_categories_fk" FOREIGN KEY ("paper_categories_id") REFERENCES "public"."paper_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learn" ADD CONSTRAINT "learn_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "learn" ADD CONSTRAINT "learn_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "learn_rels" ADD CONSTRAINT "learn_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."learn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learn_rels" ADD CONSTRAINT "learn_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "learn_rels" ADD CONSTRAINT "learn_rels_learn_fk" FOREIGN KEY ("learn_id") REFERENCES "public"."learn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learn_v" ADD CONSTRAINT "_learn_v_parent_id_learn_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."learn"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_learn_v" ADD CONSTRAINT "_learn_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_learn_v" ADD CONSTRAINT "_learn_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_learn_v_rels" ADD CONSTRAINT "_learn_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_learn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learn_v_rels" ADD CONSTRAINT "_learn_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_learn_v_rels" ADD CONSTRAINT "_learn_v_rels_learn_fk" FOREIGN KEY ("learn_id") REFERENCES "public"."learn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_type_id_event_categories_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."event_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_type_id_event_categories_id_fk" FOREIGN KEY ("version_type_id") REFERENCES "public"."event_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "newsletters_rels" ADD CONSTRAINT "newsletters_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletters_rels" ADD CONSTRAINT "newsletters_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_newsletters_v" ADD CONSTRAINT "_newsletters_v_parent_id_newsletters_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."newsletters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_newsletters_v" ADD CONSTRAINT "_newsletters_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_newsletters_v" ADD CONSTRAINT "_newsletters_v_version_pdf_id_media_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_newsletters_v" ADD CONSTRAINT "_newsletters_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_newsletters_v_rels" ADD CONSTRAINT "_newsletters_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_newsletters_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_newsletters_v_rels" ADD CONSTRAINT "_newsletters_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "analyst_coverage" ADD CONSTRAINT "analyst_coverage_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "analyst_coverage" ADD CONSTRAINT "analyst_coverage_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "analyst_coverage" ADD CONSTRAINT "analyst_coverage_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "analyst_coverage_rels" ADD CONSTRAINT "analyst_coverage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."analyst_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "analyst_coverage_rels" ADD CONSTRAINT "analyst_coverage_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_analyst_coverage_v" ADD CONSTRAINT "_analyst_coverage_v_parent_id_analyst_coverage_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."analyst_coverage"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_analyst_coverage_v" ADD CONSTRAINT "_analyst_coverage_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_analyst_coverage_v" ADD CONSTRAINT "_analyst_coverage_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_analyst_coverage_v" ADD CONSTRAINT "_analyst_coverage_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_analyst_coverage_v_rels" ADD CONSTRAINT "_analyst_coverage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_analyst_coverage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_analyst_coverage_v_rels" ADD CONSTRAINT "_analyst_coverage_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "press_release" ADD CONSTRAINT "press_release_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "press_release" ADD CONSTRAINT "press_release_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "press_release_rels" ADD CONSTRAINT "press_release_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."press_release"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "press_release_rels" ADD CONSTRAINT "press_release_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_press_release_v" ADD CONSTRAINT "_press_release_v_parent_id_press_release_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."press_release"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_press_release_v" ADD CONSTRAINT "_press_release_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_press_release_v" ADD CONSTRAINT "_press_release_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_press_release_v_rels" ADD CONSTRAINT "_press_release_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_press_release_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_press_release_v_rels" ADD CONSTRAINT "_press_release_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_study_results" ADD CONSTRAINT "case_study_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_study" ADD CONSTRAINT "case_study_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_study" ADD CONSTRAINT "case_study_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_study" ADD CONSTRAINT "case_study_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_study" ADD CONSTRAINT "case_study_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_study_rels" ADD CONSTRAINT "case_study_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_study_rels" ADD CONSTRAINT "case_study_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_study_v_version_results" ADD CONSTRAINT "_case_study_v_version_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_study_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_study_v" ADD CONSTRAINT "_case_study_v_parent_id_case_study_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_study"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_study_v" ADD CONSTRAINT "_case_study_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_study_v" ADD CONSTRAINT "_case_study_v_version_industry_id_industries_id_fk" FOREIGN KEY ("version_industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_study_v" ADD CONSTRAINT "_case_study_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_study_v" ADD CONSTRAINT "_case_study_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_study_v_rels" ADD CONSTRAINT "_case_study_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_study_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_study_v_rels" ADD CONSTRAINT "_case_study_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "red_teaming" ADD CONSTRAINT "red_teaming_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "red_teaming" ADD CONSTRAINT "red_teaming_report_id_media_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "red_teaming" ADD CONSTRAINT "red_teaming_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "red_teaming_rels" ADD CONSTRAINT "red_teaming_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."red_teaming"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "red_teaming_rels" ADD CONSTRAINT "red_teaming_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_red_teaming_v" ADD CONSTRAINT "_red_teaming_v_parent_id_red_teaming_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."red_teaming"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_red_teaming_v" ADD CONSTRAINT "_red_teaming_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_red_teaming_v" ADD CONSTRAINT "_red_teaming_v_version_report_id_media_id_fk" FOREIGN KEY ("version_report_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_red_teaming_v" ADD CONSTRAINT "_red_teaming_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_red_teaming_v_rels" ADD CONSTRAINT "_red_teaming_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_red_teaming_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_red_teaming_v_rels" ADD CONSTRAINT "_red_teaming_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "executive_bios" ADD CONSTRAINT "executive_bios_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "executive_bios" ADD CONSTRAINT "executive_bios_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "executive_bios" ADD CONSTRAINT "executive_bios_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "executive_bios_rels" ADD CONSTRAINT "executive_bios_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."executive_bios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "executive_bios_rels" ADD CONSTRAINT "executive_bios_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_executive_bios_v" ADD CONSTRAINT "_executive_bios_v_parent_id_executive_bios_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."executive_bios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_executive_bios_v" ADD CONSTRAINT "_executive_bios_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_executive_bios_v" ADD CONSTRAINT "_executive_bios_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_executive_bios_v" ADD CONSTRAINT "_executive_bios_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_executive_bios_v_rels" ADD CONSTRAINT "_executive_bios_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_executive_bios_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_executive_bios_v_rels" ADD CONSTRAINT "_executive_bios_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "role_pages" ADD CONSTRAINT "role_pages_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "role_pages" ADD CONSTRAINT "role_pages_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "role_pages" ADD CONSTRAINT "role_pages_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "role_pages_rels" ADD CONSTRAINT "role_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."role_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "role_pages_rels" ADD CONSTRAINT "role_pages_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_role_pages_v" ADD CONSTRAINT "_role_pages_v_parent_id_role_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."role_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_role_pages_v" ADD CONSTRAINT "_role_pages_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_role_pages_v" ADD CONSTRAINT "_role_pages_v_version_role_id_roles_id_fk" FOREIGN KEY ("version_role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_role_pages_v" ADD CONSTRAINT "_role_pages_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_role_pages_v_rels" ADD CONSTRAINT "_role_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_role_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_role_pages_v_rels" ADD CONSTRAINT "_role_pages_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industry_pages" ADD CONSTRAINT "industry_pages_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industry_pages" ADD CONSTRAINT "industry_pages_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industry_pages" ADD CONSTRAINT "industry_pages_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industry_pages_rels" ADD CONSTRAINT "industry_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."industry_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industry_pages_rels" ADD CONSTRAINT "industry_pages_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industry_pages_v" ADD CONSTRAINT "_industry_pages_v_parent_id_industry_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."industry_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industry_pages_v" ADD CONSTRAINT "_industry_pages_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industry_pages_v" ADD CONSTRAINT "_industry_pages_v_version_industry_id_industries_id_fk" FOREIGN KEY ("version_industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industry_pages_v" ADD CONSTRAINT "_industry_pages_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industry_pages_v_rels" ADD CONSTRAINT "_industry_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_industry_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industry_pages_v_rels" ADD CONSTRAINT "_industry_pages_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_case_pages" ADD CONSTRAINT "use_case_pages_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "use_case_pages" ADD CONSTRAINT "use_case_pages_use_case_id_use_cases_id_fk" FOREIGN KEY ("use_case_id") REFERENCES "public"."use_cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "use_case_pages" ADD CONSTRAINT "use_case_pages_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "use_case_pages_rels" ADD CONSTRAINT "use_case_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."use_case_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_case_pages_rels" ADD CONSTRAINT "use_case_pages_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_case_pages_v" ADD CONSTRAINT "_use_case_pages_v_parent_id_use_case_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."use_case_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_use_case_pages_v" ADD CONSTRAINT "_use_case_pages_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_use_case_pages_v" ADD CONSTRAINT "_use_case_pages_v_version_use_case_id_use_cases_id_fk" FOREIGN KEY ("version_use_case_id") REFERENCES "public"."use_cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_use_case_pages_v" ADD CONSTRAINT "_use_case_pages_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_use_case_pages_v_rels" ADD CONSTRAINT "_use_case_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_use_case_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_case_pages_v_rels" ADD CONSTRAINT "_use_case_pages_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields_options" ADD CONSTRAINT "forms_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields" ADD CONSTRAINT "forms_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_categories_fk" FOREIGN KEY ("news_categories_id") REFERENCES "public"."news_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_categories_fk" FOREIGN KEY ("event_categories_id") REFERENCES "public"."event_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_paper_categories_fk" FOREIGN KEY ("paper_categories_id") REFERENCES "public"."paper_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_type_of_blog_fk" FOREIGN KEY ("type_of_blog_id") REFERENCES "public"."type_of_blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_roles_fk" FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_use_cases_fk" FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_model_categories_fk" FOREIGN KEY ("model_categories_id") REFERENCES "public"."model_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_coverage_fk" FOREIGN KEY ("media_coverage_id") REFERENCES "public"."media_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_papers_fk" FOREIGN KEY ("papers_id") REFERENCES "public"."papers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_learn_fk" FOREIGN KEY ("learn_id") REFERENCES "public"."learn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletters_fk" FOREIGN KEY ("newsletters_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analyst_coverage_fk" FOREIGN KEY ("analyst_coverage_id") REFERENCES "public"."analyst_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_press_release_fk" FOREIGN KEY ("press_release_id") REFERENCES "public"."press_release"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_study_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_red_teaming_fk" FOREIGN KEY ("red_teaming_id") REFERENCES "public"."red_teaming"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_executive_bios_fk" FOREIGN KEY ("executive_bios_id") REFERENCES "public"."executive_bios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_role_pages_fk" FOREIGN KEY ("role_pages_id") REFERENCES "public"."role_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_industry_pages_fk" FOREIGN KEY ("industry_pages_id") REFERENCES "public"."industry_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_use_case_pages_fk" FOREIGN KEY ("use_case_pages_id") REFERENCES "public"."use_case_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_stats_stats_order_idx" ON "pages_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_stats_parent_id_idx" ON "pages_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_logos_logos_order_idx" ON "pages_blocks_logos_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_logos_parent_id_idx" ON "pages_blocks_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_logos_image_idx" ON "pages_blocks_logos_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logos_order_idx" ON "pages_blocks_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_parent_id_idx" ON "pages_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_path_idx" ON "pages_blocks_logos" USING btree ("_path");
  CREATE INDEX "pages_blocks_richtext_order_idx" ON "pages_blocks_richtext" USING btree ("_order");
  CREATE INDEX "pages_blocks_richtext_parent_id_idx" ON "pages_blocks_richtext" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_richtext_path_idx" ON "pages_blocks_richtext" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_embed_order_idx" ON "pages_blocks_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_embed_parent_id_idx" ON "pages_blocks_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_embed_path_idx" ON "pages_blocks_embed" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_og_image_idx" ON "pages" USING btree ("og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_stats_stats_order_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_stats_parent_id_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logos_logos_order_idx" ON "_pages_v_blocks_logos_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logos_logos_parent_id_idx" ON "_pages_v_blocks_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_logos_image_idx" ON "_pages_v_blocks_logos_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_logos_order_idx" ON "_pages_v_blocks_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logos_parent_id_idx" ON "_pages_v_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_path_idx" ON "_pages_v_blocks_logos" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_richtext_order_idx" ON "_pages_v_blocks_richtext" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_richtext_parent_id_idx" ON "_pages_v_blocks_richtext" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_richtext_path_idx" ON "_pages_v_blocks_richtext" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_embed_order_idx" ON "_pages_v_blocks_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_embed_parent_id_idx" ON "_pages_v_blocks_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_embed_path_idx" ON "_pages_v_blocks_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_og_image_idx" ON "_pages_v" USING btree ("version_og_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");
  CREATE INDEX "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "news_categories_slug_idx" ON "news_categories" USING btree ("slug");
  CREATE INDEX "news_categories_updated_at_idx" ON "news_categories" USING btree ("updated_at");
  CREATE INDEX "news_categories_created_at_idx" ON "news_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "event_categories_slug_idx" ON "event_categories" USING btree ("slug");
  CREATE INDEX "event_categories_updated_at_idx" ON "event_categories" USING btree ("updated_at");
  CREATE INDEX "event_categories_created_at_idx" ON "event_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "paper_categories_slug_idx" ON "paper_categories" USING btree ("slug");
  CREATE INDEX "paper_categories_updated_at_idx" ON "paper_categories" USING btree ("updated_at");
  CREATE INDEX "paper_categories_created_at_idx" ON "paper_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "type_of_blog_slug_idx" ON "type_of_blog" USING btree ("slug");
  CREATE INDEX "type_of_blog_updated_at_idx" ON "type_of_blog" USING btree ("updated_at");
  CREATE INDEX "type_of_blog_created_at_idx" ON "type_of_blog" USING btree ("created_at");
  CREATE UNIQUE INDEX "roles_slug_idx" ON "roles" USING btree ("slug");
  CREATE INDEX "roles_updated_at_idx" ON "roles" USING btree ("updated_at");
  CREATE INDEX "roles_created_at_idx" ON "roles" USING btree ("created_at");
  CREATE UNIQUE INDEX "industries_slug_idx" ON "industries" USING btree ("slug");
  CREATE INDEX "industries_updated_at_idx" ON "industries" USING btree ("updated_at");
  CREATE INDEX "industries_created_at_idx" ON "industries" USING btree ("created_at");
  CREATE UNIQUE INDEX "use_cases_slug_idx" ON "use_cases" USING btree ("slug");
  CREATE INDEX "use_cases_updated_at_idx" ON "use_cases" USING btree ("updated_at");
  CREATE INDEX "use_cases_created_at_idx" ON "use_cases" USING btree ("created_at");
  CREATE UNIQUE INDEX "model_categories_slug_idx" ON "model_categories" USING btree ("slug");
  CREATE INDEX "model_categories_updated_at_idx" ON "model_categories" USING btree ("updated_at");
  CREATE INDEX "model_categories_created_at_idx" ON "model_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "blog_slug_idx" ON "blog" USING btree ("slug");
  CREATE INDEX "blog_cover_idx" ON "blog" USING btree ("cover_id");
  CREATE INDEX "blog_type_of_blog_idx" ON "blog" USING btree ("type_of_blog_id");
  CREATE INDEX "blog_og_image_idx" ON "blog" USING btree ("og_image_id");
  CREATE INDEX "blog_updated_at_idx" ON "blog" USING btree ("updated_at");
  CREATE INDEX "blog_created_at_idx" ON "blog" USING btree ("created_at");
  CREATE INDEX "blog__status_idx" ON "blog" USING btree ("_status");
  CREATE INDEX "blog_rels_order_idx" ON "blog_rels" USING btree ("order");
  CREATE INDEX "blog_rels_parent_idx" ON "blog_rels" USING btree ("parent_id");
  CREATE INDEX "blog_rels_path_idx" ON "blog_rels" USING btree ("path");
  CREATE INDEX "blog_rels_users_id_idx" ON "blog_rels" USING btree ("users_id");
  CREATE INDEX "blog_rels_blog_categories_id_idx" ON "blog_rels" USING btree ("blog_categories_id");
  CREATE INDEX "_blog_v_parent_idx" ON "_blog_v" USING btree ("parent_id");
  CREATE INDEX "_blog_v_version_version_slug_idx" ON "_blog_v" USING btree ("version_slug");
  CREATE INDEX "_blog_v_version_version_cover_idx" ON "_blog_v" USING btree ("version_cover_id");
  CREATE INDEX "_blog_v_version_version_type_of_blog_idx" ON "_blog_v" USING btree ("version_type_of_blog_id");
  CREATE INDEX "_blog_v_version_version_og_image_idx" ON "_blog_v" USING btree ("version_og_image_id");
  CREATE INDEX "_blog_v_version_version_updated_at_idx" ON "_blog_v" USING btree ("version_updated_at");
  CREATE INDEX "_blog_v_version_version_created_at_idx" ON "_blog_v" USING btree ("version_created_at");
  CREATE INDEX "_blog_v_version_version__status_idx" ON "_blog_v" USING btree ("version__status");
  CREATE INDEX "_blog_v_created_at_idx" ON "_blog_v" USING btree ("created_at");
  CREATE INDEX "_blog_v_updated_at_idx" ON "_blog_v" USING btree ("updated_at");
  CREATE INDEX "_blog_v_latest_idx" ON "_blog_v" USING btree ("latest");
  CREATE INDEX "_blog_v_rels_order_idx" ON "_blog_v_rels" USING btree ("order");
  CREATE INDEX "_blog_v_rels_parent_idx" ON "_blog_v_rels" USING btree ("parent_id");
  CREATE INDEX "_blog_v_rels_path_idx" ON "_blog_v_rels" USING btree ("path");
  CREATE INDEX "_blog_v_rels_users_id_idx" ON "_blog_v_rels" USING btree ("users_id");
  CREATE INDEX "_blog_v_rels_blog_categories_id_idx" ON "_blog_v_rels" USING btree ("blog_categories_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_cover_idx" ON "news" USING btree ("cover_id");
  CREATE INDEX "news_og_image_idx" ON "news" USING btree ("og_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_users_id_idx" ON "news_rels" USING btree ("users_id");
  CREATE INDEX "news_rels_news_categories_id_idx" ON "news_rels" USING btree ("news_categories_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_cover_idx" ON "_news_v" USING btree ("version_cover_id");
  CREATE INDEX "_news_v_version_version_og_image_idx" ON "_news_v" USING btree ("version_og_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_users_id_idx" ON "_news_v_rels" USING btree ("users_id");
  CREATE INDEX "_news_v_rels_news_categories_id_idx" ON "_news_v_rels" USING btree ("news_categories_id");
  CREATE UNIQUE INDEX "glossary_slug_idx" ON "glossary" USING btree ("slug");
  CREATE INDEX "glossary_cover_idx" ON "glossary" USING btree ("cover_id");
  CREATE INDEX "glossary_og_image_idx" ON "glossary" USING btree ("og_image_id");
  CREATE INDEX "glossary_updated_at_idx" ON "glossary" USING btree ("updated_at");
  CREATE INDEX "glossary_created_at_idx" ON "glossary" USING btree ("created_at");
  CREATE INDEX "glossary__status_idx" ON "glossary" USING btree ("_status");
  CREATE INDEX "glossary_rels_order_idx" ON "glossary_rels" USING btree ("order");
  CREATE INDEX "glossary_rels_parent_idx" ON "glossary_rels" USING btree ("parent_id");
  CREATE INDEX "glossary_rels_path_idx" ON "glossary_rels" USING btree ("path");
  CREATE INDEX "glossary_rels_users_id_idx" ON "glossary_rels" USING btree ("users_id");
  CREATE INDEX "glossary_rels_glossary_id_idx" ON "glossary_rels" USING btree ("glossary_id");
  CREATE INDEX "_glossary_v_parent_idx" ON "_glossary_v" USING btree ("parent_id");
  CREATE INDEX "_glossary_v_version_version_slug_idx" ON "_glossary_v" USING btree ("version_slug");
  CREATE INDEX "_glossary_v_version_version_cover_idx" ON "_glossary_v" USING btree ("version_cover_id");
  CREATE INDEX "_glossary_v_version_version_og_image_idx" ON "_glossary_v" USING btree ("version_og_image_id");
  CREATE INDEX "_glossary_v_version_version_updated_at_idx" ON "_glossary_v" USING btree ("version_updated_at");
  CREATE INDEX "_glossary_v_version_version_created_at_idx" ON "_glossary_v" USING btree ("version_created_at");
  CREATE INDEX "_glossary_v_version_version__status_idx" ON "_glossary_v" USING btree ("version__status");
  CREATE INDEX "_glossary_v_created_at_idx" ON "_glossary_v" USING btree ("created_at");
  CREATE INDEX "_glossary_v_updated_at_idx" ON "_glossary_v" USING btree ("updated_at");
  CREATE INDEX "_glossary_v_latest_idx" ON "_glossary_v" USING btree ("latest");
  CREATE INDEX "_glossary_v_rels_order_idx" ON "_glossary_v_rels" USING btree ("order");
  CREATE INDEX "_glossary_v_rels_parent_idx" ON "_glossary_v_rels" USING btree ("parent_id");
  CREATE INDEX "_glossary_v_rels_path_idx" ON "_glossary_v_rels" USING btree ("path");
  CREATE INDEX "_glossary_v_rels_users_id_idx" ON "_glossary_v_rels" USING btree ("users_id");
  CREATE INDEX "_glossary_v_rels_glossary_id_idx" ON "_glossary_v_rels" USING btree ("glossary_id");
  CREATE UNIQUE INDEX "media_coverage_slug_idx" ON "media_coverage" USING btree ("slug");
  CREATE INDEX "media_coverage_cover_idx" ON "media_coverage" USING btree ("cover_id");
  CREATE INDEX "media_coverage_logo_idx" ON "media_coverage" USING btree ("logo_id");
  CREATE INDEX "media_coverage_og_image_idx" ON "media_coverage" USING btree ("og_image_id");
  CREATE INDEX "media_coverage_updated_at_idx" ON "media_coverage" USING btree ("updated_at");
  CREATE INDEX "media_coverage_created_at_idx" ON "media_coverage" USING btree ("created_at");
  CREATE INDEX "media_coverage__status_idx" ON "media_coverage" USING btree ("_status");
  CREATE INDEX "media_coverage_rels_order_idx" ON "media_coverage_rels" USING btree ("order");
  CREATE INDEX "media_coverage_rels_parent_idx" ON "media_coverage_rels" USING btree ("parent_id");
  CREATE INDEX "media_coverage_rels_path_idx" ON "media_coverage_rels" USING btree ("path");
  CREATE INDEX "media_coverage_rels_users_id_idx" ON "media_coverage_rels" USING btree ("users_id");
  CREATE INDEX "_media_coverage_v_parent_idx" ON "_media_coverage_v" USING btree ("parent_id");
  CREATE INDEX "_media_coverage_v_version_version_slug_idx" ON "_media_coverage_v" USING btree ("version_slug");
  CREATE INDEX "_media_coverage_v_version_version_cover_idx" ON "_media_coverage_v" USING btree ("version_cover_id");
  CREATE INDEX "_media_coverage_v_version_version_logo_idx" ON "_media_coverage_v" USING btree ("version_logo_id");
  CREATE INDEX "_media_coverage_v_version_version_og_image_idx" ON "_media_coverage_v" USING btree ("version_og_image_id");
  CREATE INDEX "_media_coverage_v_version_version_updated_at_idx" ON "_media_coverage_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_coverage_v_version_version_created_at_idx" ON "_media_coverage_v" USING btree ("version_created_at");
  CREATE INDEX "_media_coverage_v_version_version__status_idx" ON "_media_coverage_v" USING btree ("version__status");
  CREATE INDEX "_media_coverage_v_created_at_idx" ON "_media_coverage_v" USING btree ("created_at");
  CREATE INDEX "_media_coverage_v_updated_at_idx" ON "_media_coverage_v" USING btree ("updated_at");
  CREATE INDEX "_media_coverage_v_latest_idx" ON "_media_coverage_v" USING btree ("latest");
  CREATE INDEX "_media_coverage_v_rels_order_idx" ON "_media_coverage_v_rels" USING btree ("order");
  CREATE INDEX "_media_coverage_v_rels_parent_idx" ON "_media_coverage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_media_coverage_v_rels_path_idx" ON "_media_coverage_v_rels" USING btree ("path");
  CREATE INDEX "_media_coverage_v_rels_users_id_idx" ON "_media_coverage_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "papers_slug_idx" ON "papers" USING btree ("slug");
  CREATE INDEX "papers_cover_idx" ON "papers" USING btree ("cover_id");
  CREATE INDEX "papers_pdf_idx" ON "papers" USING btree ("pdf_id");
  CREATE INDEX "papers_og_image_idx" ON "papers" USING btree ("og_image_id");
  CREATE INDEX "papers_updated_at_idx" ON "papers" USING btree ("updated_at");
  CREATE INDEX "papers_created_at_idx" ON "papers" USING btree ("created_at");
  CREATE INDEX "papers__status_idx" ON "papers" USING btree ("_status");
  CREATE INDEX "papers_rels_order_idx" ON "papers_rels" USING btree ("order");
  CREATE INDEX "papers_rels_parent_idx" ON "papers_rels" USING btree ("parent_id");
  CREATE INDEX "papers_rels_path_idx" ON "papers_rels" USING btree ("path");
  CREATE INDEX "papers_rels_users_id_idx" ON "papers_rels" USING btree ("users_id");
  CREATE INDEX "papers_rels_paper_categories_id_idx" ON "papers_rels" USING btree ("paper_categories_id");
  CREATE INDEX "_papers_v_parent_idx" ON "_papers_v" USING btree ("parent_id");
  CREATE INDEX "_papers_v_version_version_slug_idx" ON "_papers_v" USING btree ("version_slug");
  CREATE INDEX "_papers_v_version_version_cover_idx" ON "_papers_v" USING btree ("version_cover_id");
  CREATE INDEX "_papers_v_version_version_pdf_idx" ON "_papers_v" USING btree ("version_pdf_id");
  CREATE INDEX "_papers_v_version_version_og_image_idx" ON "_papers_v" USING btree ("version_og_image_id");
  CREATE INDEX "_papers_v_version_version_updated_at_idx" ON "_papers_v" USING btree ("version_updated_at");
  CREATE INDEX "_papers_v_version_version_created_at_idx" ON "_papers_v" USING btree ("version_created_at");
  CREATE INDEX "_papers_v_version_version__status_idx" ON "_papers_v" USING btree ("version__status");
  CREATE INDEX "_papers_v_created_at_idx" ON "_papers_v" USING btree ("created_at");
  CREATE INDEX "_papers_v_updated_at_idx" ON "_papers_v" USING btree ("updated_at");
  CREATE INDEX "_papers_v_latest_idx" ON "_papers_v" USING btree ("latest");
  CREATE INDEX "_papers_v_rels_order_idx" ON "_papers_v_rels" USING btree ("order");
  CREATE INDEX "_papers_v_rels_parent_idx" ON "_papers_v_rels" USING btree ("parent_id");
  CREATE INDEX "_papers_v_rels_path_idx" ON "_papers_v_rels" USING btree ("path");
  CREATE INDEX "_papers_v_rels_users_id_idx" ON "_papers_v_rels" USING btree ("users_id");
  CREATE INDEX "_papers_v_rels_paper_categories_id_idx" ON "_papers_v_rels" USING btree ("paper_categories_id");
  CREATE UNIQUE INDEX "learn_slug_idx" ON "learn" USING btree ("slug");
  CREATE INDEX "learn_cover_idx" ON "learn" USING btree ("cover_id");
  CREATE INDEX "learn_og_image_idx" ON "learn" USING btree ("og_image_id");
  CREATE INDEX "learn_updated_at_idx" ON "learn" USING btree ("updated_at");
  CREATE INDEX "learn_created_at_idx" ON "learn" USING btree ("created_at");
  CREATE INDEX "learn__status_idx" ON "learn" USING btree ("_status");
  CREATE INDEX "learn_rels_order_idx" ON "learn_rels" USING btree ("order");
  CREATE INDEX "learn_rels_parent_idx" ON "learn_rels" USING btree ("parent_id");
  CREATE INDEX "learn_rels_path_idx" ON "learn_rels" USING btree ("path");
  CREATE INDEX "learn_rels_users_id_idx" ON "learn_rels" USING btree ("users_id");
  CREATE INDEX "learn_rels_learn_id_idx" ON "learn_rels" USING btree ("learn_id");
  CREATE INDEX "_learn_v_parent_idx" ON "_learn_v" USING btree ("parent_id");
  CREATE INDEX "_learn_v_version_version_slug_idx" ON "_learn_v" USING btree ("version_slug");
  CREATE INDEX "_learn_v_version_version_cover_idx" ON "_learn_v" USING btree ("version_cover_id");
  CREATE INDEX "_learn_v_version_version_og_image_idx" ON "_learn_v" USING btree ("version_og_image_id");
  CREATE INDEX "_learn_v_version_version_updated_at_idx" ON "_learn_v" USING btree ("version_updated_at");
  CREATE INDEX "_learn_v_version_version_created_at_idx" ON "_learn_v" USING btree ("version_created_at");
  CREATE INDEX "_learn_v_version_version__status_idx" ON "_learn_v" USING btree ("version__status");
  CREATE INDEX "_learn_v_created_at_idx" ON "_learn_v" USING btree ("created_at");
  CREATE INDEX "_learn_v_updated_at_idx" ON "_learn_v" USING btree ("updated_at");
  CREATE INDEX "_learn_v_latest_idx" ON "_learn_v" USING btree ("latest");
  CREATE INDEX "_learn_v_rels_order_idx" ON "_learn_v_rels" USING btree ("order");
  CREATE INDEX "_learn_v_rels_parent_idx" ON "_learn_v_rels" USING btree ("parent_id");
  CREATE INDEX "_learn_v_rels_path_idx" ON "_learn_v_rels" USING btree ("path");
  CREATE INDEX "_learn_v_rels_users_id_idx" ON "_learn_v_rels" USING btree ("users_id");
  CREATE INDEX "_learn_v_rels_learn_id_idx" ON "_learn_v_rels" USING btree ("learn_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_cover_idx" ON "events" USING btree ("cover_id");
  CREATE INDEX "events_type_idx" ON "events" USING btree ("type_id");
  CREATE INDEX "events_og_image_idx" ON "events" USING btree ("og_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_users_id_idx" ON "events_rels" USING btree ("users_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_cover_idx" ON "_events_v" USING btree ("version_cover_id");
  CREATE INDEX "_events_v_version_version_type_idx" ON "_events_v" USING btree ("version_type_id");
  CREATE INDEX "_events_v_version_version_og_image_idx" ON "_events_v" USING btree ("version_og_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_users_id_idx" ON "_events_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "newsletters_slug_idx" ON "newsletters" USING btree ("slug");
  CREATE INDEX "newsletters_cover_idx" ON "newsletters" USING btree ("cover_id");
  CREATE INDEX "newsletters_pdf_idx" ON "newsletters" USING btree ("pdf_id");
  CREATE INDEX "newsletters_og_image_idx" ON "newsletters" USING btree ("og_image_id");
  CREATE INDEX "newsletters_updated_at_idx" ON "newsletters" USING btree ("updated_at");
  CREATE INDEX "newsletters_created_at_idx" ON "newsletters" USING btree ("created_at");
  CREATE INDEX "newsletters__status_idx" ON "newsletters" USING btree ("_status");
  CREATE INDEX "newsletters_rels_order_idx" ON "newsletters_rels" USING btree ("order");
  CREATE INDEX "newsletters_rels_parent_idx" ON "newsletters_rels" USING btree ("parent_id");
  CREATE INDEX "newsletters_rels_path_idx" ON "newsletters_rels" USING btree ("path");
  CREATE INDEX "newsletters_rels_users_id_idx" ON "newsletters_rels" USING btree ("users_id");
  CREATE INDEX "_newsletters_v_parent_idx" ON "_newsletters_v" USING btree ("parent_id");
  CREATE INDEX "_newsletters_v_version_version_slug_idx" ON "_newsletters_v" USING btree ("version_slug");
  CREATE INDEX "_newsletters_v_version_version_cover_idx" ON "_newsletters_v" USING btree ("version_cover_id");
  CREATE INDEX "_newsletters_v_version_version_pdf_idx" ON "_newsletters_v" USING btree ("version_pdf_id");
  CREATE INDEX "_newsletters_v_version_version_og_image_idx" ON "_newsletters_v" USING btree ("version_og_image_id");
  CREATE INDEX "_newsletters_v_version_version_updated_at_idx" ON "_newsletters_v" USING btree ("version_updated_at");
  CREATE INDEX "_newsletters_v_version_version_created_at_idx" ON "_newsletters_v" USING btree ("version_created_at");
  CREATE INDEX "_newsletters_v_version_version__status_idx" ON "_newsletters_v" USING btree ("version__status");
  CREATE INDEX "_newsletters_v_created_at_idx" ON "_newsletters_v" USING btree ("created_at");
  CREATE INDEX "_newsletters_v_updated_at_idx" ON "_newsletters_v" USING btree ("updated_at");
  CREATE INDEX "_newsletters_v_latest_idx" ON "_newsletters_v" USING btree ("latest");
  CREATE INDEX "_newsletters_v_rels_order_idx" ON "_newsletters_v_rels" USING btree ("order");
  CREATE INDEX "_newsletters_v_rels_parent_idx" ON "_newsletters_v_rels" USING btree ("parent_id");
  CREATE INDEX "_newsletters_v_rels_path_idx" ON "_newsletters_v_rels" USING btree ("path");
  CREATE INDEX "_newsletters_v_rels_users_id_idx" ON "_newsletters_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "analyst_coverage_slug_idx" ON "analyst_coverage" USING btree ("slug");
  CREATE INDEX "analyst_coverage_cover_idx" ON "analyst_coverage" USING btree ("cover_id");
  CREATE INDEX "analyst_coverage_logo_idx" ON "analyst_coverage" USING btree ("logo_id");
  CREATE INDEX "analyst_coverage_og_image_idx" ON "analyst_coverage" USING btree ("og_image_id");
  CREATE INDEX "analyst_coverage_updated_at_idx" ON "analyst_coverage" USING btree ("updated_at");
  CREATE INDEX "analyst_coverage_created_at_idx" ON "analyst_coverage" USING btree ("created_at");
  CREATE INDEX "analyst_coverage__status_idx" ON "analyst_coverage" USING btree ("_status");
  CREATE INDEX "analyst_coverage_rels_order_idx" ON "analyst_coverage_rels" USING btree ("order");
  CREATE INDEX "analyst_coverage_rels_parent_idx" ON "analyst_coverage_rels" USING btree ("parent_id");
  CREATE INDEX "analyst_coverage_rels_path_idx" ON "analyst_coverage_rels" USING btree ("path");
  CREATE INDEX "analyst_coverage_rels_users_id_idx" ON "analyst_coverage_rels" USING btree ("users_id");
  CREATE INDEX "_analyst_coverage_v_parent_idx" ON "_analyst_coverage_v" USING btree ("parent_id");
  CREATE INDEX "_analyst_coverage_v_version_version_slug_idx" ON "_analyst_coverage_v" USING btree ("version_slug");
  CREATE INDEX "_analyst_coverage_v_version_version_cover_idx" ON "_analyst_coverage_v" USING btree ("version_cover_id");
  CREATE INDEX "_analyst_coverage_v_version_version_logo_idx" ON "_analyst_coverage_v" USING btree ("version_logo_id");
  CREATE INDEX "_analyst_coverage_v_version_version_og_image_idx" ON "_analyst_coverage_v" USING btree ("version_og_image_id");
  CREATE INDEX "_analyst_coverage_v_version_version_updated_at_idx" ON "_analyst_coverage_v" USING btree ("version_updated_at");
  CREATE INDEX "_analyst_coverage_v_version_version_created_at_idx" ON "_analyst_coverage_v" USING btree ("version_created_at");
  CREATE INDEX "_analyst_coverage_v_version_version__status_idx" ON "_analyst_coverage_v" USING btree ("version__status");
  CREATE INDEX "_analyst_coverage_v_created_at_idx" ON "_analyst_coverage_v" USING btree ("created_at");
  CREATE INDEX "_analyst_coverage_v_updated_at_idx" ON "_analyst_coverage_v" USING btree ("updated_at");
  CREATE INDEX "_analyst_coverage_v_latest_idx" ON "_analyst_coverage_v" USING btree ("latest");
  CREATE INDEX "_analyst_coverage_v_rels_order_idx" ON "_analyst_coverage_v_rels" USING btree ("order");
  CREATE INDEX "_analyst_coverage_v_rels_parent_idx" ON "_analyst_coverage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_analyst_coverage_v_rels_path_idx" ON "_analyst_coverage_v_rels" USING btree ("path");
  CREATE INDEX "_analyst_coverage_v_rels_users_id_idx" ON "_analyst_coverage_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "press_release_slug_idx" ON "press_release" USING btree ("slug");
  CREATE INDEX "press_release_cover_idx" ON "press_release" USING btree ("cover_id");
  CREATE INDEX "press_release_og_image_idx" ON "press_release" USING btree ("og_image_id");
  CREATE INDEX "press_release_updated_at_idx" ON "press_release" USING btree ("updated_at");
  CREATE INDEX "press_release_created_at_idx" ON "press_release" USING btree ("created_at");
  CREATE INDEX "press_release__status_idx" ON "press_release" USING btree ("_status");
  CREATE INDEX "press_release_rels_order_idx" ON "press_release_rels" USING btree ("order");
  CREATE INDEX "press_release_rels_parent_idx" ON "press_release_rels" USING btree ("parent_id");
  CREATE INDEX "press_release_rels_path_idx" ON "press_release_rels" USING btree ("path");
  CREATE INDEX "press_release_rels_users_id_idx" ON "press_release_rels" USING btree ("users_id");
  CREATE INDEX "_press_release_v_parent_idx" ON "_press_release_v" USING btree ("parent_id");
  CREATE INDEX "_press_release_v_version_version_slug_idx" ON "_press_release_v" USING btree ("version_slug");
  CREATE INDEX "_press_release_v_version_version_cover_idx" ON "_press_release_v" USING btree ("version_cover_id");
  CREATE INDEX "_press_release_v_version_version_og_image_idx" ON "_press_release_v" USING btree ("version_og_image_id");
  CREATE INDEX "_press_release_v_version_version_updated_at_idx" ON "_press_release_v" USING btree ("version_updated_at");
  CREATE INDEX "_press_release_v_version_version_created_at_idx" ON "_press_release_v" USING btree ("version_created_at");
  CREATE INDEX "_press_release_v_version_version__status_idx" ON "_press_release_v" USING btree ("version__status");
  CREATE INDEX "_press_release_v_created_at_idx" ON "_press_release_v" USING btree ("created_at");
  CREATE INDEX "_press_release_v_updated_at_idx" ON "_press_release_v" USING btree ("updated_at");
  CREATE INDEX "_press_release_v_latest_idx" ON "_press_release_v" USING btree ("latest");
  CREATE INDEX "_press_release_v_rels_order_idx" ON "_press_release_v_rels" USING btree ("order");
  CREATE INDEX "_press_release_v_rels_parent_idx" ON "_press_release_v_rels" USING btree ("parent_id");
  CREATE INDEX "_press_release_v_rels_path_idx" ON "_press_release_v_rels" USING btree ("path");
  CREATE INDEX "_press_release_v_rels_users_id_idx" ON "_press_release_v_rels" USING btree ("users_id");
  CREATE INDEX "case_study_results_order_idx" ON "case_study_results" USING btree ("_order");
  CREATE INDEX "case_study_results_parent_id_idx" ON "case_study_results" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "case_study_slug_idx" ON "case_study" USING btree ("slug");
  CREATE INDEX "case_study_cover_idx" ON "case_study" USING btree ("cover_id");
  CREATE INDEX "case_study_industry_idx" ON "case_study" USING btree ("industry_id");
  CREATE INDEX "case_study_logo_idx" ON "case_study" USING btree ("logo_id");
  CREATE INDEX "case_study_og_image_idx" ON "case_study" USING btree ("og_image_id");
  CREATE INDEX "case_study_updated_at_idx" ON "case_study" USING btree ("updated_at");
  CREATE INDEX "case_study_created_at_idx" ON "case_study" USING btree ("created_at");
  CREATE INDEX "case_study__status_idx" ON "case_study" USING btree ("_status");
  CREATE INDEX "case_study_rels_order_idx" ON "case_study_rels" USING btree ("order");
  CREATE INDEX "case_study_rels_parent_idx" ON "case_study_rels" USING btree ("parent_id");
  CREATE INDEX "case_study_rels_path_idx" ON "case_study_rels" USING btree ("path");
  CREATE INDEX "case_study_rels_users_id_idx" ON "case_study_rels" USING btree ("users_id");
  CREATE INDEX "_case_study_v_version_results_order_idx" ON "_case_study_v_version_results" USING btree ("_order");
  CREATE INDEX "_case_study_v_version_results_parent_id_idx" ON "_case_study_v_version_results" USING btree ("_parent_id");
  CREATE INDEX "_case_study_v_parent_idx" ON "_case_study_v" USING btree ("parent_id");
  CREATE INDEX "_case_study_v_version_version_slug_idx" ON "_case_study_v" USING btree ("version_slug");
  CREATE INDEX "_case_study_v_version_version_cover_idx" ON "_case_study_v" USING btree ("version_cover_id");
  CREATE INDEX "_case_study_v_version_version_industry_idx" ON "_case_study_v" USING btree ("version_industry_id");
  CREATE INDEX "_case_study_v_version_version_logo_idx" ON "_case_study_v" USING btree ("version_logo_id");
  CREATE INDEX "_case_study_v_version_version_og_image_idx" ON "_case_study_v" USING btree ("version_og_image_id");
  CREATE INDEX "_case_study_v_version_version_updated_at_idx" ON "_case_study_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_study_v_version_version_created_at_idx" ON "_case_study_v" USING btree ("version_created_at");
  CREATE INDEX "_case_study_v_version_version__status_idx" ON "_case_study_v" USING btree ("version__status");
  CREATE INDEX "_case_study_v_created_at_idx" ON "_case_study_v" USING btree ("created_at");
  CREATE INDEX "_case_study_v_updated_at_idx" ON "_case_study_v" USING btree ("updated_at");
  CREATE INDEX "_case_study_v_latest_idx" ON "_case_study_v" USING btree ("latest");
  CREATE INDEX "_case_study_v_rels_order_idx" ON "_case_study_v_rels" USING btree ("order");
  CREATE INDEX "_case_study_v_rels_parent_idx" ON "_case_study_v_rels" USING btree ("parent_id");
  CREATE INDEX "_case_study_v_rels_path_idx" ON "_case_study_v_rels" USING btree ("path");
  CREATE INDEX "_case_study_v_rels_users_id_idx" ON "_case_study_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "red_teaming_slug_idx" ON "red_teaming" USING btree ("slug");
  CREATE INDEX "red_teaming_cover_idx" ON "red_teaming" USING btree ("cover_id");
  CREATE INDEX "red_teaming_report_idx" ON "red_teaming" USING btree ("report_id");
  CREATE INDEX "red_teaming_og_image_idx" ON "red_teaming" USING btree ("og_image_id");
  CREATE INDEX "red_teaming_updated_at_idx" ON "red_teaming" USING btree ("updated_at");
  CREATE INDEX "red_teaming_created_at_idx" ON "red_teaming" USING btree ("created_at");
  CREATE INDEX "red_teaming__status_idx" ON "red_teaming" USING btree ("_status");
  CREATE INDEX "red_teaming_rels_order_idx" ON "red_teaming_rels" USING btree ("order");
  CREATE INDEX "red_teaming_rels_parent_idx" ON "red_teaming_rels" USING btree ("parent_id");
  CREATE INDEX "red_teaming_rels_path_idx" ON "red_teaming_rels" USING btree ("path");
  CREATE INDEX "red_teaming_rels_users_id_idx" ON "red_teaming_rels" USING btree ("users_id");
  CREATE INDEX "_red_teaming_v_parent_idx" ON "_red_teaming_v" USING btree ("parent_id");
  CREATE INDEX "_red_teaming_v_version_version_slug_idx" ON "_red_teaming_v" USING btree ("version_slug");
  CREATE INDEX "_red_teaming_v_version_version_cover_idx" ON "_red_teaming_v" USING btree ("version_cover_id");
  CREATE INDEX "_red_teaming_v_version_version_report_idx" ON "_red_teaming_v" USING btree ("version_report_id");
  CREATE INDEX "_red_teaming_v_version_version_og_image_idx" ON "_red_teaming_v" USING btree ("version_og_image_id");
  CREATE INDEX "_red_teaming_v_version_version_updated_at_idx" ON "_red_teaming_v" USING btree ("version_updated_at");
  CREATE INDEX "_red_teaming_v_version_version_created_at_idx" ON "_red_teaming_v" USING btree ("version_created_at");
  CREATE INDEX "_red_teaming_v_version_version__status_idx" ON "_red_teaming_v" USING btree ("version__status");
  CREATE INDEX "_red_teaming_v_created_at_idx" ON "_red_teaming_v" USING btree ("created_at");
  CREATE INDEX "_red_teaming_v_updated_at_idx" ON "_red_teaming_v" USING btree ("updated_at");
  CREATE INDEX "_red_teaming_v_latest_idx" ON "_red_teaming_v" USING btree ("latest");
  CREATE INDEX "_red_teaming_v_rels_order_idx" ON "_red_teaming_v_rels" USING btree ("order");
  CREATE INDEX "_red_teaming_v_rels_parent_idx" ON "_red_teaming_v_rels" USING btree ("parent_id");
  CREATE INDEX "_red_teaming_v_rels_path_idx" ON "_red_teaming_v_rels" USING btree ("path");
  CREATE INDEX "_red_teaming_v_rels_users_id_idx" ON "_red_teaming_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "executive_bios_slug_idx" ON "executive_bios" USING btree ("slug");
  CREATE INDEX "executive_bios_cover_idx" ON "executive_bios" USING btree ("cover_id");
  CREATE INDEX "executive_bios_photo_idx" ON "executive_bios" USING btree ("photo_id");
  CREATE INDEX "executive_bios_og_image_idx" ON "executive_bios" USING btree ("og_image_id");
  CREATE INDEX "executive_bios_updated_at_idx" ON "executive_bios" USING btree ("updated_at");
  CREATE INDEX "executive_bios_created_at_idx" ON "executive_bios" USING btree ("created_at");
  CREATE INDEX "executive_bios__status_idx" ON "executive_bios" USING btree ("_status");
  CREATE INDEX "executive_bios_rels_order_idx" ON "executive_bios_rels" USING btree ("order");
  CREATE INDEX "executive_bios_rels_parent_idx" ON "executive_bios_rels" USING btree ("parent_id");
  CREATE INDEX "executive_bios_rels_path_idx" ON "executive_bios_rels" USING btree ("path");
  CREATE INDEX "executive_bios_rels_users_id_idx" ON "executive_bios_rels" USING btree ("users_id");
  CREATE INDEX "_executive_bios_v_parent_idx" ON "_executive_bios_v" USING btree ("parent_id");
  CREATE INDEX "_executive_bios_v_version_version_slug_idx" ON "_executive_bios_v" USING btree ("version_slug");
  CREATE INDEX "_executive_bios_v_version_version_cover_idx" ON "_executive_bios_v" USING btree ("version_cover_id");
  CREATE INDEX "_executive_bios_v_version_version_photo_idx" ON "_executive_bios_v" USING btree ("version_photo_id");
  CREATE INDEX "_executive_bios_v_version_version_og_image_idx" ON "_executive_bios_v" USING btree ("version_og_image_id");
  CREATE INDEX "_executive_bios_v_version_version_updated_at_idx" ON "_executive_bios_v" USING btree ("version_updated_at");
  CREATE INDEX "_executive_bios_v_version_version_created_at_idx" ON "_executive_bios_v" USING btree ("version_created_at");
  CREATE INDEX "_executive_bios_v_version_version__status_idx" ON "_executive_bios_v" USING btree ("version__status");
  CREATE INDEX "_executive_bios_v_created_at_idx" ON "_executive_bios_v" USING btree ("created_at");
  CREATE INDEX "_executive_bios_v_updated_at_idx" ON "_executive_bios_v" USING btree ("updated_at");
  CREATE INDEX "_executive_bios_v_latest_idx" ON "_executive_bios_v" USING btree ("latest");
  CREATE INDEX "_executive_bios_v_rels_order_idx" ON "_executive_bios_v_rels" USING btree ("order");
  CREATE INDEX "_executive_bios_v_rels_parent_idx" ON "_executive_bios_v_rels" USING btree ("parent_id");
  CREATE INDEX "_executive_bios_v_rels_path_idx" ON "_executive_bios_v_rels" USING btree ("path");
  CREATE INDEX "_executive_bios_v_rels_users_id_idx" ON "_executive_bios_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "role_pages_slug_idx" ON "role_pages" USING btree ("slug");
  CREATE INDEX "role_pages_cover_idx" ON "role_pages" USING btree ("cover_id");
  CREATE INDEX "role_pages_role_idx" ON "role_pages" USING btree ("role_id");
  CREATE INDEX "role_pages_og_image_idx" ON "role_pages" USING btree ("og_image_id");
  CREATE INDEX "role_pages_updated_at_idx" ON "role_pages" USING btree ("updated_at");
  CREATE INDEX "role_pages_created_at_idx" ON "role_pages" USING btree ("created_at");
  CREATE INDEX "role_pages__status_idx" ON "role_pages" USING btree ("_status");
  CREATE INDEX "role_pages_rels_order_idx" ON "role_pages_rels" USING btree ("order");
  CREATE INDEX "role_pages_rels_parent_idx" ON "role_pages_rels" USING btree ("parent_id");
  CREATE INDEX "role_pages_rels_path_idx" ON "role_pages_rels" USING btree ("path");
  CREATE INDEX "role_pages_rels_users_id_idx" ON "role_pages_rels" USING btree ("users_id");
  CREATE INDEX "_role_pages_v_parent_idx" ON "_role_pages_v" USING btree ("parent_id");
  CREATE INDEX "_role_pages_v_version_version_slug_idx" ON "_role_pages_v" USING btree ("version_slug");
  CREATE INDEX "_role_pages_v_version_version_cover_idx" ON "_role_pages_v" USING btree ("version_cover_id");
  CREATE INDEX "_role_pages_v_version_version_role_idx" ON "_role_pages_v" USING btree ("version_role_id");
  CREATE INDEX "_role_pages_v_version_version_og_image_idx" ON "_role_pages_v" USING btree ("version_og_image_id");
  CREATE INDEX "_role_pages_v_version_version_updated_at_idx" ON "_role_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_role_pages_v_version_version_created_at_idx" ON "_role_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_role_pages_v_version_version__status_idx" ON "_role_pages_v" USING btree ("version__status");
  CREATE INDEX "_role_pages_v_created_at_idx" ON "_role_pages_v" USING btree ("created_at");
  CREATE INDEX "_role_pages_v_updated_at_idx" ON "_role_pages_v" USING btree ("updated_at");
  CREATE INDEX "_role_pages_v_latest_idx" ON "_role_pages_v" USING btree ("latest");
  CREATE INDEX "_role_pages_v_rels_order_idx" ON "_role_pages_v_rels" USING btree ("order");
  CREATE INDEX "_role_pages_v_rels_parent_idx" ON "_role_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_role_pages_v_rels_path_idx" ON "_role_pages_v_rels" USING btree ("path");
  CREATE INDEX "_role_pages_v_rels_users_id_idx" ON "_role_pages_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "industry_pages_slug_idx" ON "industry_pages" USING btree ("slug");
  CREATE INDEX "industry_pages_cover_idx" ON "industry_pages" USING btree ("cover_id");
  CREATE INDEX "industry_pages_industry_idx" ON "industry_pages" USING btree ("industry_id");
  CREATE INDEX "industry_pages_og_image_idx" ON "industry_pages" USING btree ("og_image_id");
  CREATE INDEX "industry_pages_updated_at_idx" ON "industry_pages" USING btree ("updated_at");
  CREATE INDEX "industry_pages_created_at_idx" ON "industry_pages" USING btree ("created_at");
  CREATE INDEX "industry_pages__status_idx" ON "industry_pages" USING btree ("_status");
  CREATE INDEX "industry_pages_rels_order_idx" ON "industry_pages_rels" USING btree ("order");
  CREATE INDEX "industry_pages_rels_parent_idx" ON "industry_pages_rels" USING btree ("parent_id");
  CREATE INDEX "industry_pages_rels_path_idx" ON "industry_pages_rels" USING btree ("path");
  CREATE INDEX "industry_pages_rels_users_id_idx" ON "industry_pages_rels" USING btree ("users_id");
  CREATE INDEX "_industry_pages_v_parent_idx" ON "_industry_pages_v" USING btree ("parent_id");
  CREATE INDEX "_industry_pages_v_version_version_slug_idx" ON "_industry_pages_v" USING btree ("version_slug");
  CREATE INDEX "_industry_pages_v_version_version_cover_idx" ON "_industry_pages_v" USING btree ("version_cover_id");
  CREATE INDEX "_industry_pages_v_version_version_industry_idx" ON "_industry_pages_v" USING btree ("version_industry_id");
  CREATE INDEX "_industry_pages_v_version_version_og_image_idx" ON "_industry_pages_v" USING btree ("version_og_image_id");
  CREATE INDEX "_industry_pages_v_version_version_updated_at_idx" ON "_industry_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_industry_pages_v_version_version_created_at_idx" ON "_industry_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_industry_pages_v_version_version__status_idx" ON "_industry_pages_v" USING btree ("version__status");
  CREATE INDEX "_industry_pages_v_created_at_idx" ON "_industry_pages_v" USING btree ("created_at");
  CREATE INDEX "_industry_pages_v_updated_at_idx" ON "_industry_pages_v" USING btree ("updated_at");
  CREATE INDEX "_industry_pages_v_latest_idx" ON "_industry_pages_v" USING btree ("latest");
  CREATE INDEX "_industry_pages_v_rels_order_idx" ON "_industry_pages_v_rels" USING btree ("order");
  CREATE INDEX "_industry_pages_v_rels_parent_idx" ON "_industry_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_industry_pages_v_rels_path_idx" ON "_industry_pages_v_rels" USING btree ("path");
  CREATE INDEX "_industry_pages_v_rels_users_id_idx" ON "_industry_pages_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "use_case_pages_slug_idx" ON "use_case_pages" USING btree ("slug");
  CREATE INDEX "use_case_pages_cover_idx" ON "use_case_pages" USING btree ("cover_id");
  CREATE INDEX "use_case_pages_use_case_idx" ON "use_case_pages" USING btree ("use_case_id");
  CREATE INDEX "use_case_pages_og_image_idx" ON "use_case_pages" USING btree ("og_image_id");
  CREATE INDEX "use_case_pages_updated_at_idx" ON "use_case_pages" USING btree ("updated_at");
  CREATE INDEX "use_case_pages_created_at_idx" ON "use_case_pages" USING btree ("created_at");
  CREATE INDEX "use_case_pages__status_idx" ON "use_case_pages" USING btree ("_status");
  CREATE INDEX "use_case_pages_rels_order_idx" ON "use_case_pages_rels" USING btree ("order");
  CREATE INDEX "use_case_pages_rels_parent_idx" ON "use_case_pages_rels" USING btree ("parent_id");
  CREATE INDEX "use_case_pages_rels_path_idx" ON "use_case_pages_rels" USING btree ("path");
  CREATE INDEX "use_case_pages_rels_users_id_idx" ON "use_case_pages_rels" USING btree ("users_id");
  CREATE INDEX "_use_case_pages_v_parent_idx" ON "_use_case_pages_v" USING btree ("parent_id");
  CREATE INDEX "_use_case_pages_v_version_version_slug_idx" ON "_use_case_pages_v" USING btree ("version_slug");
  CREATE INDEX "_use_case_pages_v_version_version_cover_idx" ON "_use_case_pages_v" USING btree ("version_cover_id");
  CREATE INDEX "_use_case_pages_v_version_version_use_case_idx" ON "_use_case_pages_v" USING btree ("version_use_case_id");
  CREATE INDEX "_use_case_pages_v_version_version_og_image_idx" ON "_use_case_pages_v" USING btree ("version_og_image_id");
  CREATE INDEX "_use_case_pages_v_version_version_updated_at_idx" ON "_use_case_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_use_case_pages_v_version_version_created_at_idx" ON "_use_case_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_use_case_pages_v_version_version__status_idx" ON "_use_case_pages_v" USING btree ("version__status");
  CREATE INDEX "_use_case_pages_v_created_at_idx" ON "_use_case_pages_v" USING btree ("created_at");
  CREATE INDEX "_use_case_pages_v_updated_at_idx" ON "_use_case_pages_v" USING btree ("updated_at");
  CREATE INDEX "_use_case_pages_v_latest_idx" ON "_use_case_pages_v" USING btree ("latest");
  CREATE INDEX "_use_case_pages_v_rels_order_idx" ON "_use_case_pages_v_rels" USING btree ("order");
  CREATE INDEX "_use_case_pages_v_rels_parent_idx" ON "_use_case_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_use_case_pages_v_rels_path_idx" ON "_use_case_pages_v_rels" USING btree ("path");
  CREATE INDEX "_use_case_pages_v_rels_users_id_idx" ON "_use_case_pages_v_rels" USING btree ("users_id");
  CREATE INDEX "forms_fields_options_order_idx" ON "forms_fields_options" USING btree ("_order");
  CREATE INDEX "forms_fields_options_parent_id_idx" ON "forms_fields_options" USING btree ("_parent_id");
  CREATE INDEX "forms_fields_order_idx" ON "forms_fields" USING btree ("_order");
  CREATE INDEX "forms_fields_parent_id_idx" ON "forms_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_slug_idx" ON "forms" USING btree ("slug");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX "payload_locked_documents_rels_news_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("news_categories_id");
  CREATE INDEX "payload_locked_documents_rels_event_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("event_categories_id");
  CREATE INDEX "payload_locked_documents_rels_paper_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("paper_categories_id");
  CREATE INDEX "payload_locked_documents_rels_type_of_blog_id_idx" ON "payload_locked_documents_rels" USING btree ("type_of_blog_id");
  CREATE INDEX "payload_locked_documents_rels_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("roles_id");
  CREATE INDEX "payload_locked_documents_rels_industries_id_idx" ON "payload_locked_documents_rels" USING btree ("industries_id");
  CREATE INDEX "payload_locked_documents_rels_use_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("use_cases_id");
  CREATE INDEX "payload_locked_documents_rels_model_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("model_categories_id");
  CREATE INDEX "payload_locked_documents_rels_blog_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_glossary_id_idx" ON "payload_locked_documents_rels" USING btree ("glossary_id");
  CREATE INDEX "payload_locked_documents_rels_media_coverage_id_idx" ON "payload_locked_documents_rels" USING btree ("media_coverage_id");
  CREATE INDEX "payload_locked_documents_rels_papers_id_idx" ON "payload_locked_documents_rels" USING btree ("papers_id");
  CREATE INDEX "payload_locked_documents_rels_learn_id_idx" ON "payload_locked_documents_rels" USING btree ("learn_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_newsletters_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletters_id");
  CREATE INDEX "payload_locked_documents_rels_analyst_coverage_id_idx" ON "payload_locked_documents_rels" USING btree ("analyst_coverage_id");
  CREATE INDEX "payload_locked_documents_rels_press_release_id_idx" ON "payload_locked_documents_rels" USING btree ("press_release_id");
  CREATE INDEX "payload_locked_documents_rels_case_study_id_idx" ON "payload_locked_documents_rels" USING btree ("case_study_id");
  CREATE INDEX "payload_locked_documents_rels_red_teaming_id_idx" ON "payload_locked_documents_rels" USING btree ("red_teaming_id");
  CREATE INDEX "payload_locked_documents_rels_executive_bios_id_idx" ON "payload_locked_documents_rels" USING btree ("executive_bios_id");
  CREATE INDEX "payload_locked_documents_rels_role_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("role_pages_id");
  CREATE INDEX "payload_locked_documents_rels_industry_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("industry_pages_id");
  CREATE INDEX "payload_locked_documents_rels_use_case_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("use_case_pages_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: any): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_stats_stats" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_logos_logos" CASCADE;
  DROP TABLE "pages_blocks_logos" CASCADE;
  DROP TABLE "pages_blocks_richtext" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_embed" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_logos_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_richtext" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_embed" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "news_categories" CASCADE;
  DROP TABLE "event_categories" CASCADE;
  DROP TABLE "paper_categories" CASCADE;
  DROP TABLE "type_of_blog" CASCADE;
  DROP TABLE "roles" CASCADE;
  DROP TABLE "industries" CASCADE;
  DROP TABLE "use_cases" CASCADE;
  DROP TABLE "model_categories" CASCADE;
  DROP TABLE "blog" CASCADE;
  DROP TABLE "blog_rels" CASCADE;
  DROP TABLE "_blog_v" CASCADE;
  DROP TABLE "_blog_v_rels" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  DROP TABLE "glossary" CASCADE;
  DROP TABLE "glossary_rels" CASCADE;
  DROP TABLE "_glossary_v" CASCADE;
  DROP TABLE "_glossary_v_rels" CASCADE;
  DROP TABLE "media_coverage" CASCADE;
  DROP TABLE "media_coverage_rels" CASCADE;
  DROP TABLE "_media_coverage_v" CASCADE;
  DROP TABLE "_media_coverage_v_rels" CASCADE;
  DROP TABLE "papers" CASCADE;
  DROP TABLE "papers_rels" CASCADE;
  DROP TABLE "_papers_v" CASCADE;
  DROP TABLE "_papers_v_rels" CASCADE;
  DROP TABLE "learn" CASCADE;
  DROP TABLE "learn_rels" CASCADE;
  DROP TABLE "_learn_v" CASCADE;
  DROP TABLE "_learn_v_rels" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "newsletters" CASCADE;
  DROP TABLE "newsletters_rels" CASCADE;
  DROP TABLE "_newsletters_v" CASCADE;
  DROP TABLE "_newsletters_v_rels" CASCADE;
  DROP TABLE "analyst_coverage" CASCADE;
  DROP TABLE "analyst_coverage_rels" CASCADE;
  DROP TABLE "_analyst_coverage_v" CASCADE;
  DROP TABLE "_analyst_coverage_v_rels" CASCADE;
  DROP TABLE "press_release" CASCADE;
  DROP TABLE "press_release_rels" CASCADE;
  DROP TABLE "_press_release_v" CASCADE;
  DROP TABLE "_press_release_v_rels" CASCADE;
  DROP TABLE "case_study_results" CASCADE;
  DROP TABLE "case_study" CASCADE;
  DROP TABLE "case_study_rels" CASCADE;
  DROP TABLE "_case_study_v_version_results" CASCADE;
  DROP TABLE "_case_study_v" CASCADE;
  DROP TABLE "_case_study_v_rels" CASCADE;
  DROP TABLE "red_teaming" CASCADE;
  DROP TABLE "red_teaming_rels" CASCADE;
  DROP TABLE "_red_teaming_v" CASCADE;
  DROP TABLE "_red_teaming_v_rels" CASCADE;
  DROP TABLE "executive_bios" CASCADE;
  DROP TABLE "executive_bios_rels" CASCADE;
  DROP TABLE "_executive_bios_v" CASCADE;
  DROP TABLE "_executive_bios_v_rels" CASCADE;
  DROP TABLE "role_pages" CASCADE;
  DROP TABLE "role_pages_rels" CASCADE;
  DROP TABLE "_role_pages_v" CASCADE;
  DROP TABLE "_role_pages_v_rels" CASCADE;
  DROP TABLE "industry_pages" CASCADE;
  DROP TABLE "industry_pages_rels" CASCADE;
  DROP TABLE "_industry_pages_v" CASCADE;
  DROP TABLE "_industry_pages_v_rels" CASCADE;
  DROP TABLE "use_case_pages" CASCADE;
  DROP TABLE "use_case_pages_rels" CASCADE;
  DROP TABLE "_use_case_pages_v" CASCADE;
  DROP TABLE "_use_case_pages_v_rels" CASCADE;
  DROP TABLE "forms_fields_options" CASCADE;
  DROP TABLE "forms_fields" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_blog_status";
  DROP TYPE "public"."enum__blog_v_version_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_glossary_status";
  DROP TYPE "public"."enum__glossary_v_version_status";
  DROP TYPE "public"."enum_media_coverage_status";
  DROP TYPE "public"."enum__media_coverage_v_version_status";
  DROP TYPE "public"."enum_papers_status";
  DROP TYPE "public"."enum__papers_v_version_status";
  DROP TYPE "public"."enum_learn_status";
  DROP TYPE "public"."enum__learn_v_version_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_newsletters_status";
  DROP TYPE "public"."enum__newsletters_v_version_status";
  DROP TYPE "public"."enum_analyst_coverage_status";
  DROP TYPE "public"."enum__analyst_coverage_v_version_status";
  DROP TYPE "public"."enum_press_release_status";
  DROP TYPE "public"."enum__press_release_v_version_status";
  DROP TYPE "public"."enum_case_study_status";
  DROP TYPE "public"."enum__case_study_v_version_status";
  DROP TYPE "public"."enum_red_teaming_status";
  DROP TYPE "public"."enum__red_teaming_v_version_status";
  DROP TYPE "public"."enum_executive_bios_status";
  DROP TYPE "public"."enum__executive_bios_v_version_status";
  DROP TYPE "public"."enum_role_pages_status";
  DROP TYPE "public"."enum__role_pages_v_version_status";
  DROP TYPE "public"."enum_industry_pages_status";
  DROP TYPE "public"."enum__industry_pages_v_version_status";
  DROP TYPE "public"."enum_use_case_pages_status";
  DROP TYPE "public"."enum__use_case_pages_v_version_status";
  DROP TYPE "public"."enum_forms_fields_type";`)
}
