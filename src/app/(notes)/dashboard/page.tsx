// app/dashboard/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { NotesList } from '@/components/NotesList';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { debounce } from 'lodash';

const CreateNoteModal = dynamic(() => import('@/components/CreateNoteModal'), { ssr: false });

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    tag?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [notes, setNotes] = useState<Note[] | null>(null);
    const [filteredNotes, setFilteredNotes] = useState<Note[] | null>(null);
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notes`);
            if (!res.ok) throw new Error('Failed to fetch notes');
            const data = await res.json();
            const sorted = data.sort((a: Note, b: Note) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotes(sorted);
            setFilteredNotes(sorted);
        } catch (err) {
            setError('Error loading notes');
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
                            (note.tag && note.tag.toLowerCase().includes(filter));
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
            if (!searchTags.includes(input.trim())) {
                setSearchTags(prev => [...prev, input.trim()]);
            }
            setInput('');
        }
    };

    useEffect(() => {
        if (!notes || !input) {
            setSuggestions([]);
            return;
        }
        const existing = new Set(searchTags);
        const matches = notes
            .flatMap(n => [n.title, n.content, n.tag || ''])
            .filter(Boolean)
            .map(s => s.toLowerCase())
            .filter(s => s.includes(input.toLowerCase()) && !existing.has(s));
        setSuggestions(Array.from(new Set(matches)).slice(0, 5));
    }, [input, notes, searchTags]);

    const selectSuggestion = (value: string) => {
        if (!searchTags.includes(value)) {
            setSearchTags(prev => [...prev, value]);
        }
        setInput('');
    };

    const removeTag = (tag: string) => {
        setSearchTags(prev => prev.filter(t => t !== tag));
    };

    const clearTags = () => {
        setSearchTags([]);
    };

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
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
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
                <NotesList notes={filteredNotes} />
            )}
        </main>
    );
}
