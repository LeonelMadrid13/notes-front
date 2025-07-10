'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            router.push('/dashboard'); // auto-login redirect
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

            <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-3"
            />

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
            />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <Button onClick={handleRegister} disabled={loading} className="w-full">
                {loading ? 'Registering...' : 'Register'}
            </Button>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
                <Button
                    variant="outline"
                    onClick={() => router.push('/register')}
                    className="w-full"
                >
                    Login
                </Button>
            </div>
        </div>
    );
}
