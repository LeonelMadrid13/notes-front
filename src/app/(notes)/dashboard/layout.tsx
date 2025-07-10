// app/dashboard/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AuthProvider } from '@/contexts/AuthContext';
import HeaderComponent from '@/components/HeaderComponent';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) redirect('/login');

    return (
        <AuthProvider>
            <HeaderComponent />
            <main className="w-full px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {children}
            </main>
        </AuthProvider>
    );
}
