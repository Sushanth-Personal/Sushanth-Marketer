"use client";
import { useRef, useState, useEffect } from "react";

export default function IframeContent({ content, title }) {
  const iframeRef = useRef(null);
  const [height, setHeight] = useState(800);

  function measureHeight() {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc || !doc.body) return;
      doc.body.style.overflow = "visible";
      doc.documentElement.style.overflow = "visible";
      const h = Math.max(
        doc.body.scrollHeight,
        doc.body.offsetHeight,
        doc.documentElement.scrollHeight,
        doc.documentElement.offsetHeight,
      );
      if (h > 200) setHeight(h);
    } catch (e) {}
  }

  function patchAnchors() {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      doc.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const id = a.getAttribute("href").slice(1);
          const target = doc.getElementById(id);
          if (!target) return;

          // Get the element's position relative to the iframe's top
          const iframeTop = iframe.getBoundingClientRect().top + window.scrollY;
          const targetTop = target.getBoundingClientRect().top;
          // targetTop is relative to iframe viewport, which starts at iframeTop
          const absoluteTop = iframeTop + targetTop - 80; // 80px offset for navbar

          window.scrollTo({ top: absoluteTop, behavior: "smooth" });
        });
      });
    } catch (e) {}
  }

  useEffect(() => {
    const timers = [
      setTimeout(measureHeight, 100),
      setTimeout(measureHeight, 500),
      setTimeout(measureHeight, 1200),
      setTimeout(measureHeight, 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [content]);

  return (
    <div style={{ width: "100%", background: "#f9f7f4" }}>
      <iframe
        ref={iframeRef}
        srcDoc={content}
        onLoad={() => {
          measureHeight();
          setTimeout(measureHeight, 300);
          setTimeout(measureHeight, 1000);
          patchAnchors(); // patch after load
          setTimeout(patchAnchors, 800); // re-patch after dynamic content settles
        }}
        style={{
          width: "100%",
          border: "none",
          display: "block",
          height: `${height}px`,
        }}
        title={title}
      />
    </div>
  );
}
