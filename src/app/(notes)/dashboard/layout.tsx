// app/dashboard/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import HeaderComponent from '@/components/HeaderComponent';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) redirect('/login');

    return (
        <div className="min-h-screen bg-gray-50">
            <HeaderComponent />
            <main className="p-6">{children}</main>
        </div>
    );
}
