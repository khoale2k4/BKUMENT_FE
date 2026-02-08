'use client';
import { useRef, useState, useEffect } from 'react';
import { ReactNodeViewRenderer, useEditor } from '@tiptap/react';
import TiptapImage from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';
import { Link } from '@mantine/tiptap';
import { RichTextEditor } from '@mantine/tiptap';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setContent, uploadImage } from '@/lib/redux/features/blogSlice';
import EditorToolbar from './EditorToolbar';
import { TiptapAuthImage } from './TiptapAuthImage';

const SecureImageExtension = TiptapImage.extend({
    addNodeView() {
        return ReactNodeViewRenderer(TiptapAuthImage);
    },
});

export default function TiptapEditor() {
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
            }
            else if (editor && url) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
            if (editorInputRef.current) editorInputRef.current.value = '';
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit, Underline, Link, Highlight, TextStyle, FontFamily,
            TiptapImage.configure({
                inline: false,
                allowBase64: false,
                HTMLAttributes: {
                    class: 'editor-image',
                },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'Hãy kể câu chuyện của bạn...' }),
            SecureImageExtension.configure({ inline: false }),
        ],
        content: '',
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            dispatch(setContent(editor.getHTML()));
        },
        editorProps: {
            handlePaste: (view, event) => {
                const item = Array.from(event.clipboardData?.items || []).find(x => x.type.startsWith('image'));
                if (item) {
                    event.preventDefault();
                    const file = item.getAsFile();
                    if (file) handleImageUpload(file, view);
                    return true;
                }
                return false;
            },
            handleDrop: (view, event, _slice, moved) => {
                if (!moved && event.dataTransfer?.files?.[0]?.type.startsWith('image/')) {
                    event.preventDefault();
                    const file = event.dataTransfer.files[0];
                    const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
                    if (coords) handleImageUpload(file, view, coords.pos);
                    return true;
                }
                return false;
            }
        },
    });

    return (
        <div className="prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:font-bold prose-a:text-blue-600">
            <input
                type="file"
                ref={editorInputRef}
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                className="hidden"
                accept="image/*"
            />

            <RichTextEditor
                editor={editor}
                variant="subtle"
                styles={{
                    root: { border: 'none', background: 'transparent' },
                    content: { padding: 0, background: 'transparent', minHeight: '300px' },
                    toolbar: { background: 'white', borderBottom: '1px solid #f3f4f6' }
                }}
            >
                <EditorToolbar
                    editor={editor}
                    onImageUpload={() => editorInputRef.current?.click()}
                    isUploadingImage={isUploading}
                />
                <RichTextEditor.Content className="prose prose-lg max-w-none leading-relaxed prose-p:my-4 prose-img:w-full prose-img:my-8" />
            </RichTextEditor>
        </div>
    );
}