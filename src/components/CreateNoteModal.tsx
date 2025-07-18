// components/CreateNoteModal.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { TagInput } from '@/components/TagInput';

export default function CreateNoteModal({ onNoteCreated }: { onNoteCreated?: () => void }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateForm = () => {
        if (!title.trim() || !content.trim()) {
            setError('Title and content are required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError(null);
        if (!validateForm()) return;
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch('/api/notes/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, tags }),
            });

            if (res.status === 401) redirect('/login');
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setTitle('');
            setContent('');
            setTags([]);
            setOpen(false);
            onNoteCreated?.();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to create note');
            } else {
                setError('Failed to create note');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">New Note</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Note</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-3"
                />
                <Textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mb-3"
                />
                <TagInput tags={tags} setTags={setTags} />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <Button onClick={handleSubmit} disabled={loading} className="w-full mt-4">
                    {loading ? 'Saving...' : 'Save Note'}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
