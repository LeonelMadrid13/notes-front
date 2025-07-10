'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';

export default function RegisterComponent() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (res.status === 401) redirect('/login');
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            router.push('/dashboard'); // auto-login + redirect
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-2xl shadow-lg">
            <h1 className="text-xl font-semibold mb-4">Register</h1>

            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-3" />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3" />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-3" />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <Button onClick={handleRegister} disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Register'}
            </Button>
        </div>
    );
}
