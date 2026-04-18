import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import TiptapImage from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import { Link, RichTextEditor } from "@mantine/tiptap";

// Lưu ý: Import đúng đường dẫn của bạn
import EditorToolbar from "../../../blogs/write/EditorToolbar";
import { TiptapAuthImage } from "../../../blogs/write/TiptapAuthImage";

// Import hàm upload ảnh
import { useAppDispatch } from "@/lib/redux/hooks";
import { uploadImage } from "@/lib/redux/features/blogSlice";

// FIX 1: Dạy cho Tiptap cách xuất ra file HTML chuẩn từ Custom Node
const SecureImageExtension = TiptapImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TiptapAuthImage);
  },
  // THÊM ĐOẠN NÀY: Ép Tiptap khi gọi getHTML() phải in ra thẻ <img> kèm thuộc tính
  renderHTML({ HTMLAttributes }) {
    return ["img", HTMLAttributes];
  },
});

interface CourseRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function CourseRichTextEditor({
  value,
  onChange,
}: CourseRichTextEditorProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const editorInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File, view?: any, pos?: number) => {
    setIsUploading(true);
    try {
      const url = await dispatch(uploadImage(file)).unwrap();

      if (view && url) {
        const node = view.state.schema.nodes.image.create({ src: url });
        const transaction = pos
          ? view.state.tr.insert(pos, node)
          : view.state.tr.replaceSelectionWith(node);
        view.dispatch(transaction);
      } else if (editor && url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      if (editorInputRef.current) editorInputRef.current.value = "";
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TextStyle,
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Nhập mô tả chi tiết cho khóa học...",
      }),
      // FIX 2: XÓA bỏ TiptapImage.configure cũ đi, CHỈ DÙNG SecureImageExtension
      SecureImageExtension.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: "editor-image" },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      // LOG KIỂM TRA: Sẽ in ra mỗi khi bạn gõ phím hoặc thêm ảnh
      console.log("=== 🔍 DEBUG TIPTAP HTML OUTPUT ===");
      console.log("html của dés", html);
      console.log("👉 CÓ CHỨA THẺ IMG KHÔNG?:", html.includes("<img"));

      onChange(html);
    },
    editorProps: {
      handlePaste: (view, event) => {
        const item = Array.from(event.clipboardData?.items || []).find((x) =>
          x.type.startsWith("image"),
        );
        if (item) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) handleImageUpload(file, view);
          return true;
        }
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (
          !moved &&
          event.dataTransfer?.files?.[0]?.type.startsWith("image/")
        ) {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          const coords = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (coords) handleImageUpload(file, view, coords.pos);
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="prose prose-sm md:prose-base max-w-none prose-p:text-gray-700 prose-headings:font-bold prose-a:text-orange-600 bg-white border border-gray-200 rounded-md overflow-hidden">
      <input
        type="file"
        ref={editorInputRef}
        onChange={(e) =>
          e.target.files?.[0] && handleImageUpload(e.target.files[0])
        }
        className="hidden"
        accept="image/*"
      />

      <RichTextEditor
        editor={editor}
        variant="subtle"
        styles={{
          root: {
            border: "none",
            background: "transparent",
            display: "flex",
            flexDirection: "column",
          },
          content: {
            padding: "16px",
            background: "transparent",
            minHeight: "200px",
            // Đảm bảo content luôn nằm dưới toolbar
            marginTop: "0px",
          },
          toolbar: {
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            padding: "8px",
            // Vô hiệu hóa hành vi sticky mặc định gây lỗi đè chữ
            position: "static",
            zIndex: 10,
          },
        }}
      >
        <EditorToolbar
          editor={editor}
          onImageUpload={() => editorInputRef.current?.click()}
          isUploadingImage={isUploading}
        />
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
}
