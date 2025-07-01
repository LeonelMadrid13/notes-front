'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            await fetch('/api/logout', { method: 'POST' });
            router.push('/login');
        };
        logout();
    }, [router]);

    return (
        <div className="text-center mt-20 text-lg text-gray-600">
            Logging you out...
        </div>
    );
}
