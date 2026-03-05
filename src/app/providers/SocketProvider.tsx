"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '@/lib/services/socket.service';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { getMyProfile } from '@/lib/redux/features/profileSlice';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    
    const { token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(getMyProfile());
            socketService.connect(token, dispatch);
        }

        return () => {
            socketService.disconnect();
        };
    }, [token, dispatch]); 

    return <>{children}</>;
}