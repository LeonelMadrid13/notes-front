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
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
            <AuthProvider>
                <HeaderComponent />
                <main className="p-6">{children}</main>
            </AuthProvider>
        </div>
    );
}
