'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogoutConfirmDialog } from '@/components/LogoutConfirmDialog';
import { useAuth } from '@/contexts/AuthContext';

const HeaderComponent = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); // 🔍 Detect current route

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userName, setUserName] = useState<string>('User');

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/');
    };

    useEffect(() => {
        const getUserName = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.status === 401) router.push('/login');
                if (!res.ok) throw new Error('Failed to fetch user data');
                const data = await res.json();
                setUserName(data.username || 'User');
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };
        getUserName();
    }, [router]);

    if (loading) return <p className="px-4 py-2">Loading...</p>;

    return (
        <header className="w-full border-b bg-white shadow-sm px-4 py-4">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:max-w-4xl sm:mx-auto">
                <h1 className="text-xl font-semibold text-center sm:text-left">
                    My Notes App - {userName}
                </h1>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto sm:items-end">
                    {user?.isAdmin && (
                        <Button
                            variant="secondary"
                            className="w-full sm:w-auto px-4 py-2 text-sm rounded-md"
                            onClick={() =>
                                router.push(pathname.startsWith('/admin') ? '/dashboard' : '/admin')
                            }
                        >
                            {pathname.startsWith('/admin') ? 'Back to Dashboard' : 'Admin Panel'}
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto px-4 py-2 text-sm rounded-md"
                        onClick={() => setConfirmOpen(true)}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <LogoutConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onConfirm={handleLogout}
            />
        </header>
    );
};

export default HeaderComponent;
