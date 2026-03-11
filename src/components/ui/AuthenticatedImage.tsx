import { useSecureImage } from "@/lib/hooks/useSecureImage";
import { ReactEventHandler } from "react";

interface Props {
    src: string;
    className?: string;
    alt?: string;
    onError?: ReactEventHandler<HTMLImageElement> | undefined;
}

export function AuthenticatedImage({ src, className, alt, onError }: Props) {
    const { imageUrl, isLoading } = useSecureImage(src);

    if (isLoading) {
        return <div className={`${className} bg-gray-100 animate-pulse`} />;
    }

    if (!imageUrl) {
        return <div className={`${className} bg-gray-200`} />; // Fallback
    }

    return <img src={imageUrl} className={className} onError={onError} alt={alt || "Image"} />;
}