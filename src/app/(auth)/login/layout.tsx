// app/(auth)/login/layout.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            router.push('/dashboard'); // redirect on success
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleLogin();
    };


    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-2xl shadow-lg">
            <h1 className="text-xl font-semibold mb-4">Login</h1>

            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-3"
            />

            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-3"
                onKeyDown={handleKeyDown}
            />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <Button onClick={handleLogin} disabled={loading} className="w-full">
                {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
                <Button
                    variant="outline"
                    onClick={() => router.push('/register')}
                    className="w-full"
                >
                    Register
                </Button>
            </div>
        </div>
    );
} 
