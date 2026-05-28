"use client";
import { useRef, useState, useEffect } from "react";

const SECTIONS = [
  { key: "navigation", num: "01", label: "Navigation Bar" },
  { key: "hero", num: "02", label: "Hero Header" },
  { key: "table-of-contents", num: "03", label: "Table of Contents" },
  { key: "intro", num: "04", label: "Introduction" },
  { key: "why-hires-go-wrong", num: "05", label: "Why Hires Go Wrong" },
  {
    key: "what-good-consultant-does",
    num: "06",
    label: "What Good Looks Like",
  },
  { key: "questions-to-ask", num: "07", label: "Questions to Ask" },
  { key: "red-flags", num: "08", label: "Red Flags" },
  { key: "in-practice", num: "09", label: "In Practice" },
  { key: "faq", num: "10", label: "FAQ" },
  { key: "closing", num: "11", label: "Closing" },
  { key: "cta", num: "12", label: "Call to Action" },
  { key: "author-bio", num: "13", label: "Author Bio" },
];

function extractSections(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const result = {};
  doc.querySelectorAll("[data-section]").forEach((el) => {
    result[el.getAttribute("data-section")] = el.innerHTML;
  });
  return result;
}

function extractStyles(html) {
  const match = html.match(/<style>([\s\S]*?)<\/style>/);
  return match ? match[1] : "";
}

function patchSection(fullHtml, sectionKey, newInnerHtml) {
  const regex = new RegExp(
    `(<section[^>]*data-section="${sectionKey}"[^>]*>)([\\s\\S]*?)(<\\/section>)`,
    "i",
  );
  return fullHtml.replace(regex, `$1\n${newInnerHtml}\n$3`);
}

function buildIframeDoc(sectionKey, sectionHtml, articleStyles) {
  const isHero = sectionKey === "hero";
  const isNav = sectionKey === "navigation";
  const bodyBg = isHero ? "#1a1814" : "#f9f7f4";
  const bodyPad = isNav ? "0" : "2rem 2.5rem";
  const safeKey = sectionKey.replace(/`/g, "\\`");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
${articleStyles}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;background:${bodyBg};}
body{padding:${bodyPad};}
nav{position:static!important;}
[contenteditable]{outline:none;cursor:text;}
[contenteditable]:hover{box-shadow:inset 0 0 0 1.5px rgba(74,124,63,0.35);border-radius:2px;}
[contenteditable]:focus{box-shadow:inset 0 0 0 2px rgba(74,124,63,0.6);border-radius:2px;}
</style>
</head>
<body>
${sectionHtml}
<script>
(function(){
  var KEY = "${safeKey}";
  var savedRange = null;
  var sel = ["p","h1","h2","h3","h4","li","blockquote",
    ".post-excerpt",".post-tag",".callout-label",
    ".faq-question",".faq-answer",".author-bio-name",
    ".toc-label",".post-cta-heading"];
  document.querySelectorAll(sel.join(",")).forEach(function(el){
    el.contentEditable = "true";
    el.spellcheck = true;
  });
  document.addEventListener("input", function(){
    window.parent.postMessage({type:"sectionChanged", key:KEY, html:document.body.innerHTML}, "*");
  });
  document.addEventListener("mouseup", function(){
    setTimeout(function(){
      var s = window.getSelection();
      if(s && s.rangeCount > 0 && s.toString().trim()){
        savedRange = s.getRangeAt(0).cloneRange();
        var r = savedRange.getBoundingClientRect();
        window.parent.postMessage({
          type:"textSelected",
          rect:{top:r.top, left:r.left, width:r.width, bottom:r.bottom, height:r.height}
        }, "*");
      } else {
        savedRange = null;
        window.parent.postMessage({type:"selectionCleared"}, "*");
      }
    }, 10);
  });
  function restore(){
    if(!savedRange) return false;
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(savedRange);
    return true;
  }
  window.addEventListener("message", function(e){
    if(!e.data || e.data.type !== "execCmd") return;
    var cmd = e.data.cmd;
    var val = e.data.val || null;
    restore();
    if(cmd === "createLink"){
      if(val) document.execCommand("createLink", false, val);
    } else {
      document.execCommand(cmd, false, val);
    }
    var s = window.getSelection();
    if(s && s.rangeCount > 0) savedRange = s.getRangeAt(0).cloneRange();
    window.parent.postMessage({type:"sectionChanged", key:KEY, html:document.body.innerHTML}, "*");
  });
  function sendH(){
    window.parent.postMessage({type:"iframeHeight", height: document.body.scrollHeight + 40}, "*");
  }
  sendH();
  setTimeout(sendH, 800);
  new ResizeObserver(sendH).observe(document.body);
})();
<\/script>
</body>
</html>`;
}

export function extractMeta(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const getMeta = (n) =>
    doc.querySelector(`meta[name="${n}"]`)?.getAttribute("content") || "";
  const getOg = (p) =>
    doc.querySelector(`meta[property="${p}"]`)?.getAttribute("content") || "";
  const rawTitle = doc.querySelector("title")?.textContent || "";
  const metaTitle = rawTitle.replace(/\s*\|.*$/, "").trim();
  const metaDescription =
    getMeta("description") || getOg("og:description") || "";
  const keywords = getMeta("keywords") || "";
  const canonicalUrl =
    doc.querySelector("link[rel='canonical']")?.getAttribute("href") || "";
  const bodyText = doc.body?.textContent || "";
  const readingTimeMatch = bodyText.match(/(\d+)\s*min\s*read/i);
  const readingTime = readingTimeMatch ? readingTimeMatch[1] : "";
  const datePublished =
    doc
      .querySelector("meta[property='article:published_time']")
      ?.getAttribute("content")
      ?.slice(0, 10) || "";
  let faqSchema = "";
  doc
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((script) => {
      try {
        const data = JSON.parse(script.textContent);
        if (data["@type"] === "FAQPage" && data.mainEntity) {
          faqSchema = JSON.stringify(
            data.mainEntity.map((item) => ({
              q: item.name,
              a: item.acceptedAnswer?.text || "",
            })),
            null,
            2,
          );
        }
      } catch (e) {}
    });
  let slug = "";
  if (canonicalUrl)
    slug = canonicalUrl.replace(/.*\/blog\//, "").replace(/\/$/, "");
  const tag =
    doc
      .querySelector("meta[property='article:tag']")
      ?.getAttribute("content") ||
    doc
      .querySelector("meta[property='article:section']")
      ?.getAttribute("content") ||
    "";
  return {
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl,
    readingTime,
    dateModified: datePublished,
    faqSchema,
    slug,
    tag,
  };
}

export function blocksToHtml(blocks) {
  if (!blocks || !blocks.length) return "";
  return blocks
    .map((b) => {
      switch (b.type) {
        case "header":
          return `<h${b.data.level}>${b.data.text}</h${b.data.level}>`;
        case "paragraph":
          return `<p>${b.data.text}</p>`;
        case "list":
          const t = b.data.style === "ordered" ? "ol" : "ul";
          return `<${t}>${b.data.items.map((i) => `<li>${i}</li>`).join("")}</${t}>`;
        case "quote":
          return `<blockquote>${b.data.text}</blockquote>`;
        case "raw":
          return b.data.html || "";
        default:
          return "";
      }
    })
    .join("\n");
}

export function renderContent(content) {
  if (!content) return "";
  try {
    const parsed = JSON.parse(content);
    if (parsed.blocks) return blocksToHtml(parsed.blocks);
    if (Array.isArray(parsed)) return blocksToHtml(parsed);
  } catch (e) {}
  return content;
}

// ── Code Panel ────────────────────────────────────────────────────────────────
function CodePanel({ html, onClose, onSave }) {
  const [code, setCode] = useState(html);
  useEffect(() => setCode(html), [html]);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(900px,96vw)",
          maxHeight: "88vh",
          background: "#0f0d0c",
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "12px 20px",
            background: "#1a1814",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#b8f03c",
              fontFamily: "DM Sans,sans-serif",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            SECTION HTML — {html.length} chars
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setCode(html)} style={smallBtn}>
              Reset
            </button>
            <button
              onClick={() => onSave(code)}
              style={{
                ...smallBtn,
                background: "#b8f03c",
                color: "#1a1814",
                fontWeight: 700,
                borderColor: "#b8f03c",
              }}
            >
              Apply Changes
            </button>
            <button onClick={onClose} style={smallBtn}>
              ✕ Close
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          style={{
            flex: 1,
            background: "#0f0d0c",
            color: "#7ec8a0",
            border: "none",
            padding: "20px 24px",
            fontFamily: "monospace",
            fontSize: 12.5,
            lineHeight: 1.7,
            resize: "none",
            outline: "none",
            overflowY: "auto",
          }}
        />
      </div>
    </div>
  );
}

const smallBtn = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#9a9690",
  padding: "5px 14px",
  borderRadius: 4,
  fontSize: 12,
  cursor: "pointer",
  fontFamily: "DM Sans,sans-serif",
};

// ── Floating Toolbar ──────────────────────────────────────────────────────────
function FloatingToolbar({
  iframeRef,
  execCmd,
  visible,
  rect,
  linkState,
  setLinkState,
}) {
  const inputRef = useRef(null);
  useEffect(() => {
    if (linkState.open && inputRef.current) inputRef.current.focus();
  }, [linkState.open]);

  if (!visible || !rect) return null;
  const fr = iframeRef.current?.getBoundingClientRect();
  if (!fr) return null;

  const top = Math.max(8, fr.top + rect.top - 46);
  const left = Math.max(8, fr.left + rect.left + rect.width / 2 - 190);

  const tb = {
    background: "transparent",
    border: "none",
    color: "#f5f2ec",
    padding: "5px 9px",
    cursor: "pointer",
    fontSize: 13,
    borderRadius: 3,
    fontFamily: "DM Sans,sans-serif",
  };
  const sep = (
    <span
      style={{
        width: 1,
        height: 16,
        background: "rgba(255,255,255,0.18)",
        display: "inline-block",
        verticalAlign: "middle",
        margin: "0 3px",
      }}
    />
  );

  function cmd(c, v) {
    execCmd(c, v || null);
  }

  return (
    <div
      style={{
        position: "fixed",
        top,
        left,
        zIndex: 9999,
        background: "#1a1814",
        borderRadius: 6,
        padding: "3px 5px",
        display: "flex",
        alignItems: "center",
        gap: 0,
        boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.08)",
        pointerEvents: "all",
      }}
    >
      {linkState.open ? (
        <>
          <span style={{ fontSize: 11, color: "#9a9690", padding: "0 6px" }}>
            URL:
          </span>
          <input
            ref={inputRef}
            type="url"
            placeholder="https://..."
            value={linkState.val}
            onChange={(e) =>
              setLinkState((l) => ({ ...l, val: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (linkState.val) cmd("createLink", linkState.val);
                setLinkState({ open: false, val: "" });
              }
              if (e.key === "Escape") setLinkState({ open: false, val: "" });
            }}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: 4,
              fontSize: 12,
              outline: "none",
              width: 210,
              fontFamily: "DM Sans,sans-serif",
            }}
          />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              if (linkState.val) cmd("createLink", linkState.val);
              setLinkState({ open: false, val: "" });
            }}
            style={{
              ...tb,
              background: "#b8f03c",
              color: "#1a1814",
              fontWeight: 700,
              marginLeft: 5,
              padding: "4px 12px",
            }}
          >
            Apply
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              setLinkState({ open: false, val: "" });
            }}
            style={{ ...tb, color: "#9a9690" }}
          >
            ✕
          </button>
        </>
      ) : (
        <>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              cmd("bold");
            }}
            style={tb}
            title="Bold"
          >
            <b>B</b>
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              cmd("italic");
            }}
            style={tb}
            title="Italic"
          >
            <i>I</i>
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              cmd("underline");
            }}
            style={tb}
            title="Underline"
          >
            <u>U</u>
          </button>
          {sep}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              cmd("formatBlock", "<h2>");
            }}
            style={{ ...tb, fontSize: 11 }}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              cmd("formatBlock", "<h3>");
            }}
            style={{ ...tb, fontSize: 11 }}
            title="Heading 3"
          >
            H3
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              cmd("formatBlock", "<p>");
            }}
            style={{ ...tb, fontSize: 11 }}
            title="Paragraph"
          >
            ¶
          </button>
          {sep}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              setLinkState({ open: true, val: "" });
            }}
            style={tb}
            title="Add Link"
          >
            🔗
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              cmd("unlink");
            }}
            style={{ ...tb, fontSize: 11 }}
            title="Remove Link"
          >
            ✕lnk
          </button>
          {sep}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              cmd("undo");
            }}
            style={tb}
            title="Undo"
          >
            ↩
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              cmd("redo");
            }}
            style={tb}
            title="Redo"
          >
            ↪
          </button>
          {sep}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              cmd("removeFormat");
            }}
            style={{ ...tb, fontSize: 10 }}
            title="Clear formatting"
          >
            Clear
          </button>
        </>
      )}
    </div>
  );
}

// ── Main Editor ───────────────────────────────────────────────────────────────
export default function RichEditor({ content, onChange, onMetaExtracted }) {
  const fileInputRef = useRef(null);
  const iframeRef = useRef(null);

  const [fullHtml, setFullHtml] = useState("");
  const [sectionMap, setSectionMap] = useState({});
  const [articleStyles, setArticleStyles] = useState("");
  const [activeSection, setActiveSection] = useState("intro");
  const [hasFile, setHasFile] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(500);
  const [unsaved, setUnsaved] = useState(new Set());
  const [saveStatus, setSaveStatus] = useState("");
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarRect, setToolbarRect] = useState(null);
  const [linkState, setLinkState] = useState({ open: false, val: "" });
  const [showCode, setShowCode] = useState(false);
  const [iframeVersion, setIframeVersion] = useState(0);

  // ── Auto-initialize from existing content prop (edit mode) ──────────────────
  useEffect(() => {
    if (!content) return;
    if (
      !content.trim().startsWith("<!DOCTYPE") &&
      !content.trim().startsWith("<html")
    )
      return;
    if (hasFile) return; // already initialized, don't overwrite

    const sections = extractSections(content);
    setFullHtml(content);
    setSectionMap(sections);
    setArticleStyles(extractStyles(content));
    setHasFile(true);

    const first = SECTIONS.find((s) => sections[s.key] !== undefined);
    if (first) setActiveSection(first.key);
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen to iframe messages
  useEffect(() => {
    function onMsg(e) {
      if (!e.data) return;
      switch (e.data.type) {
        case "sectionChanged":
          setSectionMap((prev) => ({ ...prev, [e.data.key]: e.data.html }));
          setUnsaved((prev) => new Set([...prev, e.data.key]));
          break;
        case "iframeHeight":
          setIframeHeight(Math.max(300, e.data.height));
          break;
        case "textSelected":
          setToolbarRect(e.data.rect);
          setToolbarVisible(true);
          setLinkState({ open: false, val: "" });
          break;
        case "selectionCleared":
          setToolbarVisible(false);
          break;
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  function execCmd(cmd, val) {
    const iwin = iframeRef.current?.contentWindow;
    if (!iwin) return;
    iwin.postMessage({ type: "execCmd", cmd, val: val || null }, "*");
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const raw = ev.target.result;
      const sections = extractSections(raw);
      setFullHtml(raw);
      setSectionMap(sections);
      setArticleStyles(extractStyles(raw));
      setHasFile(true);
      setUnsaved(new Set());
      setSaveStatus("");
      const first = SECTIONS.find((s) => sections[s.key] !== undefined);
      if (first) setActiveSection(first.key);
      if (onMetaExtracted) onMetaExtracted(extractMeta(raw));
      onChange(raw);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleSaveAll() {
    if (!fullHtml) return;
    setSaveStatus("saving");
    let updated = fullHtml;
    Object.entries(sectionMap).forEach(([key, html]) => {
      updated = patchSection(updated, key, html);
    });
    onChange(updated);
    setFullHtml(updated);
    setUnsaved(new Set());
    setTimeout(() => setSaveStatus("saved"), 200);
    setTimeout(() => setSaveStatus(""), 2500);
  }

  function handleCodeSave(newHtml) {
    setSectionMap((prev) => ({ ...prev, [activeSection]: newHtml }));
    setUnsaved((prev) => new Set([...prev, activeSection]));
    setIframeVersion((v) => v + 1);
    setShowCode(false);
  }

  const availableSections = SECTIONS.filter(
    (s) => sectionMap[s.key] !== undefined,
  );
  const iframeSrcDoc =
    hasFile && sectionMap[activeSection] !== undefined
      ? buildIframeDoc(activeSection, sectionMap[activeSection], articleStyles)
      : null;

  const tbStyle = {
    background: "transparent",
    border: "none",
    color: "#3a3530",
    padding: "5px 11px",
    cursor: "pointer",
    fontSize: 13,
    borderRadius: 3,
    fontFamily: "inherit",
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", height: "100%" }}>
      {showCode && (
        <CodePanel
          html={sectionMap[activeSection] || ""}
          onClose={() => setShowCode(false)}
          onSave={handleCodeSave}
        />
      )}

      <FloatingToolbar
        iframeRef={iframeRef}
        execCmd={execCmd}
        visible={toolbarVisible}
        rect={toolbarRect}
        linkState={linkState}
        setLinkState={setLinkState}
      />

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 0 12px",
          borderBottom: "1px solid #e8e4dc",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: "#1a1814",
            color: "#b8f03c",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          ↑ {hasFile ? "Replace HTML" : "Upload HTML"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        {hasFile && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                background: "#f5f2ec",
                borderRadius: 5,
                padding: "2px 4px",
              }}
            >
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCmd("bold");
                }}
                style={{ ...tbStyle, fontWeight: 700 }}
                title="Bold"
              >
                B
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCmd("italic");
                }}
                style={{ ...tbStyle, fontStyle: "italic" }}
                title="Italic"
              >
                I
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCmd("underline");
                }}
                style={{ ...tbStyle, textDecoration: "underline" }}
                title="Underline"
              >
                U
              </button>
              <span
                style={{
                  width: 1,
                  height: 16,
                  background: "#e0dbd4",
                  display: "inline-block",
                  margin: "0 3px",
                  verticalAlign: "middle",
                }}
              />
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  setLinkState({ open: true, val: "" });
                  setToolbarVisible(true);
                  setToolbarRect({ top: 40, left: 80, width: 0, height: 0 });
                }}
                style={tbStyle}
                title="Link"
              >
                🔗
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCmd("unlink");
                }}
                style={{ ...tbStyle, fontSize: 11 }}
                title="Remove link"
              >
                ✕lnk
              </button>
              <span
                style={{
                  width: 1,
                  height: 16,
                  background: "#e0dbd4",
                  display: "inline-block",
                  margin: "0 3px",
                  verticalAlign: "middle",
                }}
              />
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCmd("undo");
                }}
                style={tbStyle}
                title="Undo ⌘Z"
              >
                ↩
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCmd("redo");
                }}
                style={tbStyle}
                title="Redo ⌘Y"
              >
                ↪
              </button>
            </div>

            <button
              onClick={() => setShowCode(true)}
              style={{
                background: "transparent",
                border: "1px solid #e8e4dc",
                color: "#6b6560",
                padding: "6px 14px",
                borderRadius: 4,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span style={{ fontFamily: "monospace", fontSize: 12 }}>
                &lt;/&gt;
              </span>{" "}
              Section HTML
            </button>

            {unsaved.size > 0 && (
              <span
                style={{
                  fontSize: 11,
                  color: "#b8832a",
                  background: "#fff8ee",
                  border: "1px solid #f0d090",
                  padding: "4px 10px",
                  borderRadius: 20,
                }}
              >
                {unsaved.size} unsaved
              </span>
            )}

            <button
              onClick={handleSaveAll}
              style={{
                marginLeft: "auto",
                background: saveStatus === "saved" ? "#4a7c3f" : "#1a1814",
                color: saveStatus === "saved" ? "#fff" : "#b8f03c",
                border: "none",
                padding: "8px 20px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                  ? "✓ Saved"
                  : "Save All"}
            </button>
          </>
        )}
      </div>

      {/* Empty state */}
      {!hasFile ? (
        <div
          style={{
            border: "2px dashed #e8e4dc",
            borderRadius: 8,
            padding: "64px 40px",
            textAlign: "center",
            background: "#faf8f5",
            marginTop: 12,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>📄</div>
          <p
            style={{
              fontSize: 16,
              color: "#6b6560",
              marginBottom: 8,
              fontFamily: "'DM Serif Display',Georgia,serif",
            }}
          >
            Upload your article HTML file
          </p>
          <p
            style={{
              fontSize: 13,
              color: "#9a9690",
              maxWidth: 360,
              margin: "0 auto 28px",
            }}
          >
            Splits into sections. Click any section on the left, edit live on
            the right.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: "#1a1814",
              color: "#b8f03c",
              border: "none",
              padding: "11px 28px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Upload HTML File
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            marginTop: 10,
            border: "1px solid #e8e4dc",
            borderRadius: 8,
            overflow: "hidden",
            height: "calc(100vh - 195px)",
            minHeight: 600,
          }}
        >
          {/* Sidebar */}
          <div
            style={{
              width: 175,
              flexShrink: 0,
              background: "#f5f2ec",
              borderRight: "1px solid #e8e4dc",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderBottom: "1px solid #e8e4dc",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#9a9690",
                }}
              >
                Sections
              </span>
            </div>
            {availableSections.map((sec) => {
              const isActive = sec.key === activeSection;
              const isDirty = unsaved.has(sec.key);
              return (
                <button
                  key={sec.key}
                  onClick={() => {
                    setActiveSection(sec.key);
                    setToolbarVisible(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "10px 12px",
                    background: isActive ? "#1a1814" : "transparent",
                    border: "none",
                    borderBottom: "1px solid #ebe8e2",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: isActive ? "#b8f03c" : "#b0a898",
                      fontWeight: 700,
                      minWidth: 20,
                      flexShrink: 0,
                    }}
                  >
                    {sec.num}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: isActive ? "#f5f2ec" : "#3a3530",
                      flex: 1,
                      lineHeight: 1.3,
                    }}
                  >
                    {sec.label}
                  </span>
                  {isDirty && (
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#b8832a",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Preview pane */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <div
              style={{
                padding: "8px 18px",
                borderBottom: "1px solid #e8e4dc",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 11, color: "#9a9690" }}>
                {availableSections.find((s) => s.key === activeSection)?.num}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "#1a1814",
                  fontFamily: "'DM Serif Display',Georgia,serif",
                }}
              >
                {availableSections.find((s) => s.key === activeSection)?.label}
              </span>
              <span
                style={{ marginLeft: "auto", fontSize: 11, color: "#9a9690" }}
              >
                Select text → formatting toolbar appears
              </span>
            </div>
            <div style={{ flex: 1, overflow: "auto", background: "#f9f7f4" }}>
              {iframeSrcDoc && (
                <iframe
                  key={`${activeSection}-${iframeVersion}`}
                  ref={iframeRef}
                  srcDoc={iframeSrcDoc}
                  style={{
                    width: "100%",
                    height: iframeHeight,
                    minHeight: "100%",
                    border: "none",
                    display: "block",
                  }}
                  title={`Section: ${activeSection}`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
