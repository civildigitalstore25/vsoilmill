"use client";

import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Palette,
  PlayCircle,
  Quote,
  RemoveFormatting,
  Trash2,
  UnderlineIcon,
} from "lucide-react";
import { RICH_TEXT_COLORS, RICH_TEXT_COPY } from "@/constants/rich-text";
import { cn } from "@/lib/utils/cn";

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={cn(
        "rounded p-1.5 text-dark transition-colors hover:bg-primary/10",
        active && "bg-primary/20",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-border" />;
}

export function RichTextToolbar({
  editor,
  showImageInput,
  showYoutubeInput,
  showLinkInput,
  showColorMenu,
  imageSelected,
  onRemoveImage,
  onToggleImage,
  onToggleYoutube,
  onToggleLink,
  onToggleColor,
}: {
  editor: Editor;
  showImageInput: boolean;
  showYoutubeInput: boolean;
  showLinkInput: boolean;
  showColorMenu: boolean;
  imageSelected: boolean;
  onRemoveImage: () => void;
  onToggleImage: () => void;
  onToggleYoutube: () => void;
  onToggleLink: () => void;
  onToggleColor: () => void;
}) {
  const styleValue = editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
      ? "h3"
      : "p";

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-cream/60 px-2 py-1.5">
      <select
        aria-label={RICH_TEXT_COPY.textStyle}
        className="mr-1 h-8 rounded-md border border-border bg-card px-2 text-xs text-dark"
        value={styleValue}
        onChange={(event) => {
          const next = event.target.value;
          if (next === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
          else if (next === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
          else editor.chain().focus().setParagraph().run();
        }}
      >
        <option value="p">{RICH_TEXT_COPY.styleNormal}</option>
        <option value="h2">{RICH_TEXT_COPY.styleH2}</option>
        <option value="h3">{RICH_TEXT_COPY.styleH3}</option>
      </select>
      <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <AlignRight className="h-3.5 w-3.5" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton title="Link" active={showLinkInput || editor.isActive("link")} onClick={onToggleLink}>
        <LinkIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Image" active={showImageInput} onClick={onToggleImage}>
        <ImageIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      {imageSelected ? (
        <ToolbarButton title={RICH_TEXT_COPY.removeImage} onClick={onRemoveImage}>
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </ToolbarButton>
      ) : null}
      <ToolbarButton title="YouTube" active={showYoutubeInput} onClick={onToggleYoutube}>
        <PlayCircle className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code2 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <Divider />
      <div className="relative">
        <ToolbarButton title="Text color" active={showColorMenu} onClick={onToggleColor}>
          <Palette className="h-3.5 w-3.5" />
        </ToolbarButton>
        {showColorMenu ? (
          <div className="absolute left-0 top-full z-20 mt-1 flex gap-1 rounded-lg border border-border bg-card p-2 shadow-md">
            {RICH_TEXT_COLORS.map((color) => (
              <button
                key={color.label}
                type="button"
                title={color.label}
                className={cn("h-5 w-5 rounded-full border border-border", color.swatch)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  if (!color.value) editor.chain().focus().unsetColor().run();
                  else editor.chain().focus().setColor(color.value).run();
                  onToggleColor();
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
      <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}
