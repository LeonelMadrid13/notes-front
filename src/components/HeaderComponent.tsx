'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogoutConfirmDialog } from '@/components/LogoutConfirmDialog';

const HeaderComponent = () => {
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <header className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-sm">
            <h1 className="text-xl font-semibold">My Notes App</h1>
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
