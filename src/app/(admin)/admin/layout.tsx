// app/(admin)/admin/layout.tsx
'use client';

import { ReactNode } from 'react';
import HeaderComponent from '@/components/HeaderComponent';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <AuthProvider>
                <HeaderComponent />
                <div className="flex-1 w-full">{children}</div>
            </AuthProvider>
        </div>
    );
}
