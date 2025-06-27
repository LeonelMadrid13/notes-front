// app/dashboard/layout.tsx
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) redirect('/login');

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-sm">
                <h1 className="text-xl font-semibold">My Notes App</h1>
                <form action="/api/logout" method="POST">
                    <Button type="submit" variant="outline">Logout</Button>
                </form>
            </header>

            <main className="p-6">{children}</main>
        </div>
    );
}
