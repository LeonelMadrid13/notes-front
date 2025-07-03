'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogoutConfirmDialog } from '@/components/LogoutConfirmDialog';

const HeaderComponent = () => {
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userName, setUserName] = useState<string>('User');

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/');
    };

    const getUserName = async () => {
        try {
            const res = await fetch('/api/user');
            if (!res.ok) throw new Error('Failed to fetch user data');
            const data = await res.json();
            setUserName(data.username || 'User');
        } catch (error) {
            console.error('Error fetching user name:', error);
        }
    }
    // Fetch user name on component mount
    useEffect(() => {
        getUserName();
    }, []);

    return (
        <header className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-sm">
            <h1 className="text-xl font-semibold">My Notes App - {userName}</h1>
            <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                Logout
            </Button>

            <LogoutConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onConfirm={handleLogout}
            />
        </header>
    );
};

export default HeaderComponent;
