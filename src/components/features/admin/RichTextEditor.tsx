"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import { RICH_TEXT_COPY } from "@/constants/rich-text";
import { RichTextToolbar } from "@/components/features/admin/RichTextToolbar";
import { RichTextUrlBar } from "@/components/features/admin/RichTextUrlBar";

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [imageSelected, setImageSelected] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ controls: true, width: 640, height: 360 }),
      Placeholder.configure({
        placeholder: placeholder ?? RICH_TEXT_COPY.placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate({ editor: current }) {
      onChange(current.getHTML());
      setCharCount(current.getText().length);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm min-h-56 max-w-none px-4 py-3 text-sm leading-relaxed text-dark focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return;
    editor.commands.setContent(value || "", { emitUpdate: false });
    setCharCount(editor.getText().length);
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    const sync = () => {
      setImageSelected(editor.isActive("image"));
      setCharCount(editor.getText().length);
    };
    editor.on("selectionUpdate", sync);
    editor.on("transaction", sync);
    sync();
    return () => {
      editor.off("selectionUpdate", sync);
      editor.off("transaction", sync);
    };
  }, [editor]);

  const closeBars = useCallback(() => {
    setShowImageInput(false);
    setShowYoutubeInput(false);
    setShowLinkInput(false);
    setShowColorMenu(false);
  }, []);

  const insertImage = useCallback(() => {
    if (!editor || !imageUrl.trim()) return;
    editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
    setImageUrl("");
    setShowImageInput(false);
  }, [editor, imageUrl]);

  const insertYoutube = useCallback(() => {
    if (!editor || !youtubeUrl.trim()) return;
    editor.commands.setYoutubeVideo({ src: youtubeUrl.trim() });
    setYoutubeUrl("");
    setShowYoutubeInput(false);
  }, [editor, youtubeUrl]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    const href = linkUrl.trim();
    if (!href) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <RichTextToolbar
        editor={editor}
        showImageInput={showImageInput}
        showYoutubeInput={showYoutubeInput}
        showLinkInput={showLinkInput}
        showColorMenu={showColorMenu}
        imageSelected={imageSelected}
        onRemoveImage={() => {
          if (editor.isActive("image")) editor.chain().focus().deleteSelection().run();
        }}
        onToggleImage={() => {
          const next = !showImageInput;
          closeBars();
          setShowImageInput(next);
        }}
        onToggleYoutube={() => {
          const next = !showYoutubeInput;
          closeBars();
          setShowYoutubeInput(next);
        }}
        onToggleLink={() => {
          const next = !showLinkInput;
          closeBars();
          setShowLinkInput(next);
          if (editor.isActive("link")) setLinkUrl(editor.getAttributes("link").href ?? "");
        }}
        onToggleColor={() => {
          const next = !showColorMenu;
          closeBars();
          setShowColorMenu(next);
        }}
      />
      {showLinkInput ? (
        <RichTextUrlBar value={linkUrl} onChange={setLinkUrl} onSubmit={applyLink} placeholder={RICH_TEXT_COPY.linkPrompt} submitLabel={RICH_TEXT_COPY.insert} />
      ) : null}
      {showImageInput ? (
        <RichTextUrlBar value={imageUrl} onChange={setImageUrl} onSubmit={insertImage} placeholder={RICH_TEXT_COPY.imagePlaceholder} submitLabel={RICH_TEXT_COPY.insert} />
      ) : null}
      {showYoutubeInput ? (
        <RichTextUrlBar value={youtubeUrl} onChange={setYoutubeUrl} onSubmit={insertYoutube} placeholder={RICH_TEXT_COPY.youtubePlaceholder} submitLabel={RICH_TEXT_COPY.embed} />
      ) : null}
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between gap-3 border-t border-border bg-cream/40 px-3 py-2">
        <p className="text-[11px] text-muted">{RICH_TEXT_COPY.footerHelp}</p>
        <p className="shrink-0 text-[11px] font-medium text-muted">
          {charCount} {RICH_TEXT_COPY.characters}
        </p>
      </div>
    </div>
  );
}
