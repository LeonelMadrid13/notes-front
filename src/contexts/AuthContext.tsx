'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/user');
                if (!res.ok) throw new Error('Not authenticated');
                const data = await res.json();
                setUser(data.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }

        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
