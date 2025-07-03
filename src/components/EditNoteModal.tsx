'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface EditNoteModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    note: {
        id: string;
        title: string;
        content: string;
        tags?: string[];
    } | null;
    onNoteUpdated?: () => void;
}

export function EditNoteModal({ open, onOpenChange, note, onNoteUpdated }: EditNoteModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setTags(note.tags || []);
        }
    }, [note]);

    const handleUpdate = async () => {
        setError(null);
        if (!note?.id || !title.trim() || !content.trim()) {
            setError('Title and content are required');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/notes/${note.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, tags }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            onOpenChange(false);
            onNoteUpdated?.();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Update failed');
            } else {
                setError('Update failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const addTag = () => {
        const value = tagInput.trim();
        if (value && !tags.includes(value)) {
            setTags(prev => [...prev, value]);
        }
        setTagInput('');
    };

    const removeTag = (tag: string) => {
        setTags(prev => prev.filter(t => t !== tag));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Note</DialogTitle>
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

                <div className="mb-3">
                    <div className="flex gap-2 mb-2">
                        <Input
                            placeholder="Add tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                        />
                        <Button type="button" variant="secondary" onClick={addTag}>
                            Add
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1" onClick={() => removeTag(tag)}>
                                {tag}
                                <X className="w-3 h-3 cursor-pointer" />
                            </Badge>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <Button onClick={handleUpdate} disabled={loading} className="w-full">
                    {loading ? 'Updating...' : 'Update Note'}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
