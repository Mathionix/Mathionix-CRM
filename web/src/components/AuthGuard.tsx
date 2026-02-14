"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AppShell from './AppShell';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Allow access to auth pages without checking token
        if (pathname.startsWith('/auth')) {
            setIsAuthenticated(false); // It's a public page
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
        } else {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If on auth page, render children directly (no AppShell)
    if (pathname.startsWith('/auth')) {
        return <>{children}</>;
    }

    // If authenticated and not on auth page, wrap with AppShell
    return (
        <AppShell>
            {children}
        </AppShell>
    );
}
