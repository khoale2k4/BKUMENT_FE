import { useState, useEffect } from 'react';
import httpClient from '../services/http';

export function useSecureImage(src: string | null) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!src) return;

        let objectUrl: string;
        let isMounted = true;

        const fetchImage = async () => {
            setIsLoading(true);
            try {
                const response = await httpClient.get(src, { responseType: 'blob' });
                if (isMounted) {
                    objectUrl = URL.createObjectURL(response.data);
                    setImageUrl(objectUrl);
                }
            } catch (err) {
                console.error("Failed to load image", err);
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [src]);

    return { imageUrl, isLoading, error };
}