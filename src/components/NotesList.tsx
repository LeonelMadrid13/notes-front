'use client';

import { useState } from 'react';
import { X, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EditNoteModal } from './EditNoteModal';
import type { Note } from '@/app/(notes)/dashboard/page';

interface NotesListProps {
    notes: Note[];
    onDelete: (id: string) => void;
    onTagClick?: (tag: string) => void;
    onNoteUpdated?: () => void;
}

export function NotesList({ notes, onDelete, onTagClick, onNoteUpdated }: NotesListProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [editNote, setEditNote] = useState<Note | null>(null);

    return (
        <>
            <div className="space-y-4">
                {notes.map(note => (
                    <div key={note.id} className="p-4 border rounded-xl shadow-sm bg-white">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-lg font-semibold leading-tight break-words">
                                {note.title || 'Untitled'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setEditNote(note);
                                        setEditOpen(true);
                                    }}
                                    aria-label="Edit note"
                                >
                                    <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                                </button>
                                <button onClick={() => onDelete(note.id)} aria-label="Delete note">
                                    <X className="w-4 h-4 text-red-500 hover:text-red-700" />
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-2">
                            {note.content.length > 200 ? note.content.slice(0, 200) + '...' : note.content}
                        </p>

                        {Array.isArray(note.tags) && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {note.tags.map(tag => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-muted"
                                        onClick={() => onTagClick?.(tag)}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <EditNoteModal
                open={editOpen}
                onOpenChange={setEditOpen}
                note={editNote}
                onNoteUpdated={onNoteUpdated}
            />
        </>
    );
}
