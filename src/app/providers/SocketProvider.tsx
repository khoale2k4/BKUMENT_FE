"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '@/lib/services/socket.service';
import { RootState, AppDispatch } from '@/lib/redux/store';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if (token) {
            console.log("Đã có token, bắt đầu gọi socket connect...");
            socketService.connect(token, dispatch);
        }

        return () => {
            socketService.disconnect();
        };
    }, [token, dispatch]); 

    return <>{children}</>;
}