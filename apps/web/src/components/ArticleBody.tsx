import React from "react";

/**
 * Minimal Lexical rich-text renderer.
 * Handles the node types the CMS produces: root, paragraph, heading, list,
 * listitem, link, text, quote, horizontalrule. Unknown nodes render their
 * children so content is never silently dropped.
 */

interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  text?: string;
  tag?: string;
  listType?: string;
  format?: number | string;
  url?: string;
  fields?: { url?: string; newTab?: boolean };
  direction?: string;
}

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;
const FORMAT_STRIKETHROUGH = 4;
const FORMAT_UNDERLINE = 8;
const FORMAT_CODE = 16;

function renderText(node: LexicalNode, key: number): React.ReactNode {
  let content: React.ReactNode = node.text ?? "";
  const format = typeof node.format === "number" ? node.format : 0;
  if (format & FORMAT_BOLD) content = <strong key={key}>{content}</strong>;
  if (format & FORMAT_ITALIC) content = <em key={key}>{content}</em>;
  if (format & FORMAT_STRIKETHROUGH) content = <s key={key}>{content}</s>;
  if (format & FORMAT_UNDERLINE) content = <u key={key}>{content}</u>;
  if (format & FORMAT_CODE) content = <code key={key}>{content}</code>;
  return <React.Fragment key={key}>{content}</React.Fragment>;
}

function renderChildren(nodes?: LexicalNode[]): React.ReactNode {
  if (!nodes?.length) return null;
  return nodes.map((n, i) => renderNode(n, i));
}

export function renderNode(node: LexicalNode, key: number): React.ReactNode {
  switch (node.type) {
    case "text":
      return renderText(node, key);
    case "paragraph":
      return <p key={key}>{renderChildren(node.children)}</p>;
    case "heading": {
      const tag = node.tag || "h2";
      const Tag = tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return <Tag key={key}>{renderChildren(node.children)}</Tag>;
    }
    case "list": {
      const Tag = node.listType === "number" ? "ol" : "ul";
      return <Tag key={key}>{renderChildren(node.children)}</Tag>;
    }
    case "listitem":
      return <li key={key}>{renderChildren(node.children)}</li>;
    case "link": {
      const url = node.fields?.url || node.url || "#";
      const newTab = node.fields?.newTab;
      return (
        <a
          key={key}
          href={url}
          {...(newTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        >
          {renderChildren(node.children)}
        </a>
      );
    }
    case "quote":
      return <blockquote key={key}>{renderChildren(node.children)}</blockquote>;
    case "horizontalrule":
      return <hr key={key} />;
    case "root":
      return <React.Fragment key={key}>{renderChildren(node.children)}</React.Fragment>;
    default:
      // Unknown node — render children so content is never dropped.
      if (node.children?.length) {
        return <React.Fragment key={key}>{renderChildren(node.children)}</React.Fragment>;
      }
      if (node.text) return <React.Fragment key={key}>{node.text}</React.Fragment>;
      return null;
  }
}

/** Render a full Lexical document. */
export function ArticleBody({ body }: { body: unknown }) {
  if (!body || typeof body !== "object") return null;
  // Payload nests the Lexical document under a `root` key — unwrap it.
  const doc = body as { root?: LexicalNode } & LexicalNode;
  const root = doc.root ?? (doc.type === "root" ? doc : null);
  if (!root || root.type !== "root") return null;
  return <div className="article-body">{renderNode(root, 0)}</div>;
}
