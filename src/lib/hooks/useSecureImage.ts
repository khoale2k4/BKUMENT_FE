"use client";

import { useState, useEffect } from 'react';
import httpClient from '../services/http';

// Module-level cache: src → blob object URL
// Persists for the lifetime of the page, prevents re-fetching on every re-render
const imageCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string>>();

export function useSecureImage(src: string | null) {
    const [imageUrl, setImageUrl] = useState<string | null>(() =>
        src ? (imageCache.get(src) ?? null) : null
    );
    const [isLoading, setIsLoading] = useState(() =>
        src ? !imageCache.has(src) : false
    );
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!src) return;

        // Already cached — use immediately, no loading state needed
        if (imageCache.has(src)) {
            setImageUrl(imageCache.get(src)!);
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        setIsLoading(true);
        setError(false);

        // Deduplicate concurrent requests for the same URL
        let request = pendingRequests.get(src);
        if (!request) {
            request = httpClient
                .get(src, { responseType: 'blob' })
                .then((response) => {
                    const objectUrl = URL.createObjectURL(response.data);
                    imageCache.set(src, objectUrl);
                    pendingRequests.delete(src);
                    return objectUrl;
                })
                .catch((err) => {
                    pendingRequests.delete(src);
                    throw err;
                });
            pendingRequests.set(src, request);
        }

        request
            .then((objectUrl) => {
                if (isMounted) {
                    setImageUrl(objectUrl);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.error('Failed to load image', err);
                if (isMounted) {
                    setError(true);
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [src]);

    return { imageUrl, isLoading, error };
}