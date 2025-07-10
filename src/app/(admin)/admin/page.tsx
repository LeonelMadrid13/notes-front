'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteUserDialog';
import { Trash2 } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [edited, setEdited] = useState<Record<string, boolean>>({});
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) {
            router.push('/dashboard');
        }
        if (!loading && user?.isAdmin) {
            fetchUsers();
        }
    }, [user, loading]);

    const fetchUsers = async () => {
        const res = await fetch('/api/users');
        if (res.ok) {
            const data = await res.json();
            setUsers(data.data || data);
        }
    };

    const toggleAdmin = (userId: string, newValue: boolean) => {
        setEdited((prev) => ({ ...prev, [userId]: newValue }));
    };

    const saveChanges = async () => {
        for (const user of users) {
            const newValue = edited[user.id];
            if (newValue === undefined || newValue === user.isAdmin) continue;

            await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isAdmin: newValue }),
            });
        }

        await fetchUsers();
        setEdited({});
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/users/${deleteId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete user');
            setUsers((prev) => prev.filter((user) => user.id !== deleteId));
        } catch {
            console.error('Error deleting user');
        } finally {
            setDialogOpen(false);
            setDeleteId(null);
        }
    };

    if (loading || !user?.isAdmin) {
        return <Skeleton className="h-48 w-full" />;
    }

    return (
        <main className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <ul className="space-y-4">
                {users.map((u) => (
                    <li
                        key={u.id}
                        className="border rounded-md p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Admin</span>
                                <Switch
                                    checked={edited[u.id] !== undefined ? edited[u.id] : u.isAdmin}
                                    onCheckedChange={(val) => toggleAdmin(u.id, val)}
                                />
                            </div>

                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => confirmDelete(u.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="flex justify-end">
                <Button onClick={saveChanges} disabled={Object.keys(edited).length === 0}>
                    Save Changes
                </Button>
            </div>

            <ConfirmDeleteDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handleDelete}
            />
        </main>
    );
}
