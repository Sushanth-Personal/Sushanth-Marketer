"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback } from "react";

const btn = (active, onClick, title, content) => (
  <button
    key={title}
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    style={{
      background: active ? "#2A2A26" : "transparent",
      border: "none",
      color: active ? "var(--amber)" : "var(--text-muted)",
      padding: "6px 10px",
      cursor: "pointer",
      fontSize: 13,
      borderRadius: 3,
      fontFamily: "var(--font-sans)",
      minWidth: 32,
    }}
  >
    {content}
  </button>
);

export default function RichEditor({ content, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your post..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Image URL:");
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const e = editor;

  return (
    <div
      style={{
        border: "1px solid var(--border-light)",
        borderRadius: 4,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          padding: "8px 12px",
          background: "#F9F6F0",
          borderBottom: "1px solid var(--border-light)",
          alignItems: "center",
        }}
      >
        {btn(
          e.isActive("bold"),
          () => e.chain().focus().toggleBold().run(),
          "Bold",
          <b>B</b>,
        )}
        {btn(
          e.isActive("italic"),
          () => e.chain().focus().toggleItalic().run(),
          "Italic",
          <i>I</i>,
        )}
        {btn(
          e.isActive("underline"),
          () => e.chain().focus().toggleUnderline().run(),
          "Underline",
          <u>U</u>,
        )}
        {btn(
          e.isActive("strike"),
          () => e.chain().focus().toggleStrike().run(),
          "Strike",
          <s>S</s>,
        )}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border-light)",
            margin: "0 4px",
          }}
        />
        {btn(
          e.isActive("heading", { level: 1 }),
          () => e.chain().focus().toggleHeading({ level: 1 }).run(),
          "H1",
          "H1",
        )}
        {btn(
          e.isActive("heading", { level: 2 }),
          () => e.chain().focus().toggleHeading({ level: 2 }).run(),
          "H2",
          "H2",
        )}
        {btn(
          e.isActive("heading", { level: 3 }),
          () => e.chain().focus().toggleHeading({ level: 3 }).run(),
          "H3",
          "H3",
        )}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border-light)",
            margin: "0 4px",
          }}
        />
        {btn(
          e.isActive("bulletList"),
          () => e.chain().focus().toggleBulletList().run(),
          "Bullet list",
          "• List",
        )}
        {btn(
          e.isActive("orderedList"),
          () => e.chain().focus().toggleOrderedList().run(),
          "Numbered list",
          "1. List",
        )}
        {btn(
          e.isActive("blockquote"),
          () => e.chain().focus().toggleBlockquote().run(),
          "Blockquote",
          '" "',
        )}
        {btn(
          e.isActive("codeBlock"),
          () => e.chain().focus().toggleCodeBlock().run(),
          "Code block",
          "</>",
        )}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border-light)",
            margin: "0 4px",
          }}
        />
        {btn(
          e.isActive({ textAlign: "left" }),
          () => e.chain().focus().setTextAlign("left").run(),
          "Align left",
          "⬅",
        )}
        {btn(
          e.isActive({ textAlign: "center" }),
          () => e.chain().focus().setTextAlign("center").run(),
          "Align center",
          "↔",
        )}
        {btn(
          e.isActive({ textAlign: "right" }),
          () => e.chain().focus().setTextAlign("right").run(),
          "Align right",
          "➡",
        )}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border-light)",
            margin: "0 4px",
          }}
        />
        {btn(e.isActive("link"), setLink, "Link", "🔗")}
        {btn(false, addImage, "Image", "🖼")}
        {btn(
          false,
          () => e.chain().focus().setHorizontalRule().run(),
          "Divider",
          "—",
        )}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border-light)",
            margin: "0 4px",
          }}
        />
        {btn(false, () => e.chain().focus().undo().run(), "Undo", "↩")}
        {btn(false, () => e.chain().focus().redo().run(), "Redo", "↪")}
      </div>
      <EditorContent editor={editor} style={{ minHeight: 400 }} />
    </div>
  );
}
