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
        return <span className={`${className} bg-gray-100 animate-pulse inline-block`} />;
    }

    if (!imageUrl) {
        return <span className={`${className} bg-gray-200 inline-block`} />; // Fallback
    }

    return <img src={imageUrl} className={className} onError={onError} alt={alt || "Image"} />;
}