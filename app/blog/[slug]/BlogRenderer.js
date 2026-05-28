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

// Returns { type: "fullpage" | "html", content: string }
export function renderContent(content) {
  if (!content) return { type: "html", content: "" };

  // Try EditorJS JSON blocks
  try {
    const parsed = JSON.parse(content);
    if (parsed.blocks)
      return { type: "html", content: blocksToHtml(parsed.blocks) };
    if (Array.isArray(parsed))
      return { type: "html", content: blocksToHtml(parsed) };
  } catch (e) {}

  // Full HTML document
  if (
    content.trim().startsWith("<!DOCTYPE") ||
    content.trim().startsWith("<html")
  ) {
    const cleaned = prepareFullPageHtml(content);
    return { type: "fullpage", content: cleaned };
  }

  return { type: "html", content };
}

function prepareFullPageHtml(html) {
  // 1. Remove editor artifacts
  html = html
    .replace(/\s*contenteditable="[^"]*"/gi, "")
    .replace(/\s*spellcheck="[^"]*"/gi, "");

  // 2. Remove site nav section wrapper + any nav with nav-inner pattern
  html = html.replace(
    /<section[^>]*data-section="navigation"[^>]*>[\s\S]*?<\/section>/gi,
    "",
  );
  html = html.replace(/<nav[^>]*>[\s\S]*?nav-inner[\s\S]*?<\/nav>/gi, "");

  // 3. Remove progress bar div
  html = html.replace(/<div[^>]*id="progress-bar"[^>]*>[\s\S]*?<\/div>/gi, "");
  html = html.replace(/<div[^>]*id="progress-bar"[^>]*\/>/gi, "");

  // 4. Remove hero section wrapper + any remaining <header>
  html = html.replace(
    /<section[^>]*data-section="hero"[^>]*>[\s\S]*?<\/section>/gi,
    "",
  );
  html = html.replace(/<header[\s\S]*?<\/header>/gi, "");

  // 5. Remove back link
  html = html.replace(
    /<a[^>]*class="[^"]*back-link[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    "",
  );

  // 6. Remove footer
  html = html.replace(/<footer[\s\S]*?<\/footer>/gi, "");

  // 7. Remove progress bar script
  html = html.replace(/<script>[\s\S]*?progress-bar[\s\S]*?<\/script>/gi, "");

  // 8. Inject overrides before </head>
  //    Key rules:
  //    - body margin/padding 0 so no dark gap appears at top of iframe
  //    - nav position static so TOC nav doesn't stick (but ONLY nav, not breaking anything else)
  //    - #progress-bar hidden
  //    - html/body height auto so iframe can measure full content height
  //    - Do NOT use a blanket "nav { position: static }" as it could affect
  //      the parent page — instead scope it tightly to known nav classes
  const injectedStyles = `
<style id="iframe-isolation">
  #progress-bar { display: none !important; }

  nav.toc,
  nav[aria-label="Table of contents"] {
    position: static !important;
    top: auto !important;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    min-height: unset !important;
    overflow: visible !important;
    background: #f9f7f4 !important;
    scroll-behavior: auto !important;
  }

  .post-body {
    padding-top: 3rem !important;
    padding-bottom: 2rem !important;
  }

  [style*="position: fixed"],
  [style*="position:fixed"] {
    position: static !important;
  }
</style>

<script id="anchor-intercept">
(function () {
  function patchAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id = a.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        var iframeEl = window.frameElement;
        if (!iframeEl) return;
        var iframeRect = iframeEl.getBoundingClientRect();
        var targetRect = target.getBoundingClientRect();
        // targetRect.top is relative to iframe viewport top
        // iframeRect.top is iframe's position in parent page viewport
        var scrollY = window.parent.scrollY || window.parent.pageYOffset || 0;
        var absoluteTop = scrollY + iframeRect.top + targetRect.top - 80;
        window.parent.scrollTo({ top: absoluteTop, behavior: 'smooth' });
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchAnchors);
  } else {
    patchAnchors();
  }
})();
</script>`;

  html = html.replace(/<\/head>/i, injectedStyles + "\n</head>");

  return html;
}
