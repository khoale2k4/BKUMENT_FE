"use client";

import { usePathname } from 'next/navigation';
import Sidebar from "@/components/layouts/Sidebar";
import '@mantine/core/styles.css';
import "../globals.css";
import Header from "@/components/layouts/Header/Header";
import Footer from "@/components/layouts/Footer";
import SocketProvider from "@/app/providers/SocketProvider";
import AuthProvider from '../providers/AuthProvider';

const ROUTES_WITHOUT_FOOTER_AND_CONTAINER = ['/messages'];

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isMessageRoute = ROUTES_WITHOUT_FOOTER_AND_CONTAINER.some(route =>
        pathname === route || pathname?.startsWith(`${route}/`)
    );

    return (
        <AuthProvider>
            <SocketProvider>
                <div className="min-h-screen flex flex-col bg-white">
                    <Header />
                    <div className={`flex flex-1 w-full ${isMessageRoute ? '' : 'container mx-auto md:px-6'}`}>
                        <Sidebar />
                        <main className="flex-1 min-w-0 transition-all duration-300">
                            {children}
                        </main>
                    </div>
                    {!isMessageRoute && <Footer />}
                </div>
            </SocketProvider>
        </AuthProvider>
    );
}