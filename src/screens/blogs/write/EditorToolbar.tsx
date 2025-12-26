'use client';
import { RichTextEditor } from '@mantine/tiptap';
import { IconPhoto, IconTypography } from '@tabler/icons-react';
import { Menu, Loader } from '@mantine/core';
import '@mantine/tiptap/styles.css';

const ToolbarDivider = () => <div className="w-[1px] h-5 bg-gray-200 mx-1 self-center" />;

interface Props {
    editor: any;
    onImageUpload: () => void;
    isUploadingImage: boolean;
}

export default function EditorToolbar({ editor, onImageUpload, isUploadingImage }: Props) {
    if (!editor) return null;

    return (
        <RichTextEditor.Toolbar
            sticky
            stickyOffset={84}
            className="!border !border-gray-200 !rounded-lg !bg-white/95 backdrop-blur shadow-sm mb-8 px-2 z-40 mx-auto w-fit flex flex-wrap items-center gap-0"
        >
            <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>

            <ToolbarDivider />

            <RichTextEditor.ControlsGroup>
                <Menu trigger="hover" shadow="md" width={200} zIndex={100}>
                    <Menu.Target>
                        <RichTextEditor.Control aria-label="Font Family">
                            <IconTypography stroke={1.5} size={18} />
                        </RichTextEditor.Control>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Phông chữ</Menu.Label>
                        <Menu.Item onClick={() => editor.chain().focus().unsetFontFamily().run()} style={{ fontFamily: 'Inter, sans-serif' }}>Mặc định</Menu.Item>
                        <Menu.Item onClick={() => editor.chain().focus().setFontFamily('Serif').run()} style={{ fontFamily: 'Serif' }}>Serif</Menu.Item>
                        <Menu.Item onClick={() => editor.chain().focus().setFontFamily('Monospace').run()} style={{ fontFamily: 'Monospace' }}>Monospace</Menu.Item>
                        <Menu.Item onClick={() => editor.chain().focus().setFontFamily('Cursive').run()} style={{ fontFamily: 'Cursive' }}>Cursive</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </RichTextEditor.ControlsGroup>

            <ToolbarDivider />

            <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
                <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>

            <ToolbarDivider />

            <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
            </RichTextEditor.ControlsGroup>

            <ToolbarDivider />

            <RichTextEditor.ControlsGroup>
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Blockquote />
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <ToolbarDivider />

            <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />

                <RichTextEditor.Control onClick={onImageUpload} disabled={isUploadingImage} className="relative">
                    {isUploadingImage ? <Loader size={14} color="gray" /> : <IconPhoto stroke={1.5} size={18} />}
                </RichTextEditor.Control>
            </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
    );
}