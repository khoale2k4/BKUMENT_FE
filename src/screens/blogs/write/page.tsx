'use client';

import React, { useState, useRef } from 'react';
import { Button, ActionIcon, Loader, Select } from '@mantine/core'; // Thêm Loader
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import TiptapImage from '@tiptap/extension-image';
import { Link } from '@mantine/tiptap';
import { RichTextEditor } from '@mantine/tiptap';
import { IconPhoto, IconX, IconChevronLeft, IconPlus, IconWorld, IconLock } from '@tabler/icons-react';

import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { API_ENDPOINTS } from '@/lib/apiEndPoints';

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visibility, setVisibility] = useState<string | null>('PUBLIC');

    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [isUploadingEditor, setIsUploadingEditor] = useState(false);

    const coverInputRef = useRef<HTMLInputElement>(null);
    const editorInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Highlight,
            TiptapImage.configure({ inline: true, allowBase64: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'Hãy kể câu chuyện của bạn...' }),
        ],
        content: '',
        immediatelyRender: false,
        editorProps: {
            handlePaste: (view, event, slice) => {
                const items = Array.from(event.clipboardData?.items || []);
                const item = items.find((x) => x.type.indexOf('image') === 0);

                if (item) {
                    event.preventDefault();
                    const file = item.getAsFile();

                    if (file) {
                        setIsUploadingEditor(true);

                        uploadImageToCloud(file).then((url) => {
                            if (url) {
                                const imageNode = view.state.schema.nodes.image.create({
                                    src: url
                                });
                                const transaction = view.state.tr.replaceSelectionWith(imageNode);
                                view.dispatch(transaction);
                            }
                            setIsUploadingEditor(false);
                        });
                    }
                    return true;
                }

                return false;
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        event.preventDefault();

                        setIsUploadingEditor(true);
                        uploadImageToCloud(file).then((url) => {
                            if (url) {
                                const { schema } = view.state;
                                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                                if (coordinates) {
                                    const node = schema.nodes.image.create({ src: url });
                                    const transaction = view.state.tr.insert(coordinates.pos, node);
                                    view.dispatch(transaction);
                                }
                            }
                            setIsUploadingEditor(false);
                        });
                        return true;
                    }
                }
                return false;
            }
        },
    });

    const uploadImageToCloud = async (file: File): Promise<string | null> => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            alert('Chỉ hỗ trợ định dạng ảnh JPG, PNG, WEBP');
            return null;
        }

        try {
            const presignedRes = await fetch(
                `${API_ENDPOINTS.RESOURCE.GET_PRESIGNED_URL(encodeURIComponent(file.name))}`,
                { method: 'GET' }
            );
            const presignedData = await presignedRes.json();

            if (presignedData.code !== 1000) {
                throw new Error(presignedData.message || 'Lỗi lấy link upload');
            }

            const uploadUrl = presignedData.result.url;
            const fileId = presignedData.result.assetId;

            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });

            if (!uploadRes.ok) {
                throw new Error('Upload lên cloud thất bại');
            }

            return API_ENDPOINTS.RESOURCE.LINK_IMAGE_FILEID(fileId);

        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi tải ảnh lên.');
            return null;
        }
    };

    const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingCover(true);
        const url = await uploadImageToCloud(file);
        if (url) {
            setCoverImage(url);
        }
        setIsUploadingCover(false);

        if (coverInputRef.current) coverInputRef.current.value = '';
    };

    const removeCoverImage = () => {
        setCoverImage(null);
    };

    const handleEditorIconClick = () => {
        editorInputRef.current?.click();
    };

    const handleEditorFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        editor.chain().focus();

        setIsUploadingEditor(true);
        const url = await uploadImageToCloud(file);

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }

        setIsUploadingEditor(false);
        if (editorInputRef.current) editorInputRef.current.value = '';
    };

    const handleSubmit = () => {
        if (!title.trim()) return alert('Thiếu tiêu đề!');
        if (!editor || editor.isEmpty) return alert('Nội dung đang trống!');

        setIsSubmitting(true);
        const contentHTML = editor.getHTML();
        const postData = {
            title,
            coverImage,
            contentHTML,
            visibility: visibility || 'PUBLIC',
            type: 'POST',
        };

        console.log('=== DỮ LIỆU GỬI ĐI ===', postData);

        setTimeout(() => {
            setIsSubmitting(false);
            alert('Đã xuất bản (Check Console)!');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans pb-20">

            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="lg"
                            radius="xl"
                            className="hover:bg-gray-100"
                        >
                            <IconChevronLeft size={20} stroke={1.5} />
                        </ActionIcon>
                        <span className="text-sm font-medium text-gray-500 hidden sm:block">Soạn thảo bài viết</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select
                            placeholder="Visibility"
                            data={[
                                { value: 'PUBLIC', label: 'Công khai' },
                                { value: 'PRIVATE', label: 'Riêng tư' },
                            ]}
                            value={visibility}
                            onChange={setVisibility}
                            allowDeselect={false}
                            radius="xl"
                            size="sm"
                            w={140}
                            leftSection={visibility === 'PUBLIC' ? <IconWorld size={16} /> : <IconLock size={16} />}
                            className="font-medium"
                        />

                        <Button
                            radius="xl"
                            size="sm"
                            color="dark"
                            className="px-6 font-medium shadow-sm hover:shadow transition-all bg-black hover:bg-gray-800"
                            loading={isSubmitting}
                            onClick={handleSubmit}
                        >
                            Xuất bản
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto mt-8 px-4 sm:px-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-12 min-h-[80vh]">
                    <input
                        type="file"
                        ref={coverInputRef}
                        onChange={handleCoverFileChange}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                    />

                    <input
                        type="file"
                        ref={editorInputRef}
                        onChange={handleEditorFileChange}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                    />

                    {!coverImage && !isUploadingCover && (
                        <div className="group mb-6">
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                className="flex items-center gap-2 text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50 cursor-pointer"
                            >
                                <IconPlus size={16} stroke={1.5} />
                                <span>Thêm ảnh bìa</span>
                            </button>
                        </div>
                    )}

                    {isUploadingCover && (
                        <div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-6 animate-pulse">
                            <span className="text-sm text-gray-400">Đang tải ảnh lên...</span>
                        </div>
                    )}

                    {coverImage && (
                        <div className="relative w-full mb-10 group animate-in fade-in duration-500">
                            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border border-gray-100">
                                <img
                                    src={coverImage}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={removeCoverImage}
                                className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full text-gray-600 hover:text-red-600 border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                title="Xóa ảnh bìa"
                            >
                                <IconX size={18} />
                            </button>
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Tiêu đề bài viết"
                        className="w-full text-4xl md:text-5xl font-extrabold text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 bg-transparent py-2 mb-6 leading-tight"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />

                    <div className="prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:font-bold prose-a:text-blue-600">
                        <RichTextEditor
                            editor={editor}
                            variant="subtle"
                            styles={{
                                root: { border: 'none', background: 'transparent' },
                                content: { padding: 0, background: 'transparent', minHeight: '300px' },
                                toolbar: { background: 'white', borderBottom: '1px solid #f3f4f6' }
                            }}
                        >
                            <RichTextEditor.Toolbar
                                sticky
                                stickyOffset={84}
                                className="!border !border-gray-200 !rounded-lg !bg-white/95 backdrop-blur shadow-sm mb-8 px-2 z-40 mx-auto w-fit"
                            >
                                <div className="flex flex-wrap gap-1 border-r border-gray-200 pr-2 mr-2">
                                    <RichTextEditor.Bold />
                                    <RichTextEditor.Italic />
                                    <RichTextEditor.Underline />
                                    <RichTextEditor.Highlight />
                                </div>

                                <div className="flex flex-wrap gap-1 border-r border-gray-200 pr-2 mr-2">
                                    <RichTextEditor.H1 />
                                    <RichTextEditor.H2 />
                                    <RichTextEditor.BulletList />
                                </div>

                                <div className="flex flex-wrap gap-1 border-r border-gray-200 pr-2 mr-2">
                                    <RichTextEditor.Link />
                                    <RichTextEditor.Unlink />
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    <RichTextEditor.AlignLeft />
                                    <RichTextEditor.AlignCenter />

                                    <RichTextEditor.Control
                                        onClick={handleEditorIconClick}
                                        aria-label="Insert image"
                                        title="Insert image"
                                        className="hover:bg-gray-100 text-gray-600 relative"
                                        disabled={isUploadingEditor}
                                    >
                                        {isUploadingEditor ? (
                                            <Loader size={14} color="gray" />
                                        ) : (
                                            <IconPhoto stroke={1.5} size={18} />
                                        )}
                                    </RichTextEditor.Control>
                                </div>
                            </RichTextEditor.Toolbar>

                            <RichTextEditor.Content className="prose prose-lg max-w-none leading-relaxed prose-p:my-4" />
                        </RichTextEditor>
                    </div>
                </div>
            </main>
        </div>
    );
}