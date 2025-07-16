// app/dashboard/layout.tsx
import { redirect } from 'next/navigation';

import { AuthProvider } from '@/contexts/AuthContext';
import HeaderComponent from '@/components/HeaderComponent';
import { getAuthCookies } from '@/app/lib/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const authCookies = await getAuthCookies();

    if (!authCookies?.token) redirect('/login');

    return (
        <AuthProvider>
            <HeaderComponent />
            <main className="w-full px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {children}
            </main>
        </AuthProvider>
    );
}
