import { useSecureImage } from "@/lib/hooks/useSecureImage";

interface Props {
    src: string;
    className?: string;
    alt?: string;
}

export function AuthenticatedImage({ src, className, alt }: Props) {
    const { imageUrl, isLoading } = useSecureImage(src);

    if (isLoading) {
        return <div className={`${className} bg-gray-100 animate-pulse`} />;
    }

    if (!imageUrl) {
        return <div className={`${className} bg-gray-200`} />; // Fallback
    }

    return <img src={imageUrl} className={className} alt={alt || "Image"} />;
}