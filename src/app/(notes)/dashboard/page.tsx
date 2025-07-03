// app/dashboard/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';

import { X } from 'lucide-react';
import { NotesList } from '@/components/NotesList';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { addTagIfNotExists, generateSuggestions } from '@/utils/dashboard';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { LogoutConfirmDialog } from '@/components/LogoutConfirmDialog';


const CreateNoteModal = dynamic(() => import('@/components/CreateNoteModal'), { ssr: false });

export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    tags?: string[];
}

export default function DashboardPage() {
    const router = useRouter();
    const [notes, setNotes] = useState<Note[] | null>(null);
    const [filteredNotes, setFilteredNotes] = useState<Note[] | null>(null);
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);


    const fetchNotes = async () => {
        try {
            const res = await fetch('/api/notes');
            if (!res.ok) throw new Error('Failed to fetch notes');
            const data = await res.json();
            const sorted = data.sort((a: Note, b: Note) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotes(sorted);
            setFilteredNotes(sorted);
        } catch (err) {
            setError('Error loading notes');
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/notes/${deleteId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete note');
            setNotes(prev => prev?.filter(note => note.id !== deleteId) || null);
            setFilteredNotes(prev => prev?.filter(note => note.id !== deleteId) || null);
        } catch (err) {
            setError('Error deleting note');
        } finally {
            setDialogOpen(false);
            setDeleteId(null);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleSearch = useMemo(
        () =>
            debounce((filters: string[], sourceNotes: Note[]) => {
                const filtered = sourceNotes.filter(note => {
                    return filters.every(filter => {
                        const match =
                            note.title.toLowerCase().includes(filter) ||
                            note.content.toLowerCase().includes(filter) ||
                            (note.tags && note.tags.some(tag => tag.toLowerCase().includes(filter)));
                        return match;
                    });
                });
                setFilteredNotes(filtered);
            }, 300),
        []
    );

    useEffect(() => {
        if (!notes) return;
        handleSearch(searchTags.map(tag => tag.toLowerCase()), notes);
    }, [searchTags, notes, handleSearch]);

    const addSearchTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            setSearchTags(prev => addTagIfNotExists(prev, input.trim()));
            setInput('');
        }
    };

    const handleTagClick = (tag: string) => {
        setSearchTags(prev => addTagIfNotExists(prev, tag));
    };

    useEffect(() => {
        if (!notes || !input) {
            setSuggestions([]);
            return;
        }
        setSuggestions(generateSuggestions(notes, input, searchTags));
    }, [input, notes, searchTags]);

    const selectSuggestion = (value: string) => {
        setSearchTags(prev => addTagIfNotExists(prev, value));
        setInput('');
    };

    const removeTag = (tag: string) => {
        setSearchTags(prev => prev.filter(t => t !== tag));
    };

    const clearTags = () => {
        setSearchTags([]);
    };

    // handle note updates, do not refetch all notes
    const handleNoteUpdated = () => {
        fetchNotes();
    }

    return (
        <main className="max-w-2xl mx-auto mt-20 p-6 border rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Notes</h1>
                <CreateNoteModal onNoteCreated={fetchNotes} />
            </div>

            <div className="mb-4 relative">
                <Input
                    placeholder="Search title, content, or tags..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={addSearchTag}
                />
                {suggestions.length > 0 && (
                    <div className="absolute z-10 bg-white border shadow rounded w-full mt-1">
                        {suggestions.map((s) => (
                            <div
                                key={s}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => selectSuggestion(s)}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                    {searchTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1">
                            <span>{tag}</span>
                            <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 p-0.5 hover:bg-gray-300 rounded"
                                aria-label={`Remove ${tag}`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                    {searchTags.length > 0 && (
                        <button
                            onClick={clearTags}
                            className="text-xs text-blue-500 hover:underline ml-2"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {!filteredNotes ? (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                </div>
            ) : (
                <NotesList notes={filteredNotes} onDelete={confirmDelete} onTagClick={handleTagClick} onNoteUpdated={handleNoteUpdated} />
            )}

            <ConfirmDeleteDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handleDelete}
            />
        </main>
    );
}
