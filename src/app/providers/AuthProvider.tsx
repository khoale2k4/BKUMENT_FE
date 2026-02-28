"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { initializeAuth } from '@/lib/redux/features/authSlice';
import AppLoading from '@/components/ui/AppLoading';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    
    const [isAuthRestored, setIsAuthRestored] = useState(false);
    
    useEffect(() => {
        dispatch(initializeAuth());
        
        setIsAuthRestored(true);
    }, [dispatch]);

    if (!isAuthRestored) {
        return <AppLoading/>;
    }

    return <>{children}</>;
}