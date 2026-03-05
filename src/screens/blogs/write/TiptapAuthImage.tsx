// components/editor/TiptapAuthImage.tsx
import { useSecureImage } from '@/lib/hooks/useSecureImage';
import { NodeViewWrapper } from '@tiptap/react';

export function TiptapAuthImage(props: any) {
    const { node, selected } = props;
    const { imageUrl, isLoading } = useSecureImage(node.attrs.src);

    return (
        <NodeViewWrapper className="my-4">
            <div className={`relative inline-block ${selected ? 'ring-2 ring-blue-500 rounded' : ''}`}>
                {isLoading && (
                    <div className="w-full h-48 bg-gray-50 flex items-center justify-center rounded border border-dashed border-gray-300">
                        <span className="text-gray-400 text-sm">Đang tải ảnh...</span>
                    </div>
                )}

                {!isLoading && imageUrl && (
                    <img
                        src={imageUrl} 
                        alt={node.attrs.alt}
                        className="max-w-full h-auto rounded-lg"
                    />
                )}

                {!isLoading && !imageUrl && (
                    <div className="p-4 bg-red-50 text-red-500 text-sm rounded">
                        Ảnh bị lỗi
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
}