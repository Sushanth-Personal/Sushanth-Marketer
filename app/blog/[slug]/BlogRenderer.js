// No "use client" — server-safe

export function blocksToHtml(blocks) {
  if (!blocks || !blocks.length) return "";
  return blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
        case "paragraph":
          return `<p>${block.data.text}</p>`;
        case "list": {
          const tag = block.data.style === "ordered" ? "ol" : "ul";
          const items = block.data.items.map((i) => `<li>${i}</li>`).join("");
          return `<${tag}>${items}</${tag}>`;
        }
        case "quote":
          return `<blockquote>${block.data.text}</blockquote>`;
        case "raw":
          return block.data.html || "";
        default:
          return "";
      }
    })
    .join("\n");
}

// Returns { type: "html", content: string, styles: string }
export function renderContent(content) {
  if (!content) return { type: "html", content: "", styles: "" };

  // Try EditorJS JSON blocks
  try {
    const parsed = JSON.parse(content);
    if (parsed.blocks)
      return { type: "html", content: blocksToHtml(parsed.blocks), styles: "" };
    if (Array.isArray(parsed))
      return { type: "html", content: blocksToHtml(parsed), styles: "" };
  } catch (e) {}

  // Full standalone HTML file
  if (
    content.trim().startsWith("<!DOCTYPE") ||
    content.trim().startsWith("<html")
  ) {
    return extractFromFullPage(content);
  }

  return { type: "html", content, styles: "" };
}

function extractFromFullPage(html) {
  // Extract the article's own <style> block
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const articleStyles = styleMatch ? styleMatch[1] : "";

  // Remove editor artifacts
  html = html
    .replace(/\s*contenteditable="[^"]*"/gi, "")
    .replace(/\s*spellcheck="[^"]*"/gi, "");

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : html;

  // Strip only elements that duplicate the site chrome
  body = body
    .replace(/<nav>\s*<div class="nav-inner">[\s\S]*?<\/nav>/gi, "") // site nav only, not TOC
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<div[^>]*id="progress-bar"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*id="progress-bar"[^>]*\/>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<a[^>]*class="[^"]*back-link[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Build scoped styles:
  // 1. Redefine CSS variables for light theme inside .article-body
  // 2. Prefix all article selectors with .article-body
  //    but skip html/body/:root since we're not in a full document
  const varOverrides = `
.article-body {
  --bg: #f9f7f4;
  --surface: #ffffff;
  --surface2: #f0ede6;
  --border: #e8e4dc;
  --text: #1a1814;
  --text-secondary: #3a3530;
  --text-muted: #6b6560;
  --accent: #4a7c3f;
  --serif: 'DM Serif Display', Georgia, serif;
  --sans: 'DM Sans', sans-serif;
  background: #f9f7f4;
  color: #1a1814;
  font-family: 'DM Sans', sans-serif;
}
/* Offset anchors so fixed navbar doesn't cover headings */
.article-body h1[id],
.article-body h2[id],
.article-body h3[id],
.article-body h4[id],
.article-body section[id],
.article-body [id] {
  scroll-margin-top: 88px;
}`;

  // Prefix article styles with .article-body, skip html/body/:root rules
  const prefixed = articleStyles.replace(
    /([^{},]+)(,?\s*\{)/g,
    (match, selector, brace) => {
      const s = selector.trim();
      if (!s) return match;
      if (s.startsWith("@") || s.startsWith("/*")) return match;
      const parts = s
        .split(",")
        .map((part) => {
          const p = part.trim();
          if (!p) return "";
          if (p === "html" || p === "body" || p === ":root" || p === "*")
            return ".article-body";
          if (p.startsWith("html ") || p.startsWith("body "))
            return p.replace(/^(html|body)\s+/, ".article-body ");
          return `.article-body ${p}`;
        })
        .filter(Boolean)
        .join(", ");
      return `${parts}${brace}`;
    },
  );

  const styles = varOverrides + "\n" + prefixed;

  return { type: "html", content: body, styles };
}
