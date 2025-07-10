'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { EditNoteModal } from './EditNoteModal';
import { NoteDetailModal } from './NoteDetailModal';
import type { Note } from '@/app/(notes)/dashboard/page';
import { cn } from '@/lib/utils';

interface NotesListProps {
    notes: Note[];
    onDelete: (id: string) => void;
    onTagClick?: (tag: string) => void;
    onNoteUpdated?: () => void;
}

export function NotesList({ notes, onDelete, onTagClick, onNoteUpdated }: NotesListProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [editNote, setEditNote] = useState<Note | null>(null);

    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);


    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
                {notes.map(note => (
                    <div
                        key={note.id}
                        className={cn(
                            'p-4 border rounded-xl shadow-sm bg-white transition hover:shadow-md break-words',
                            'col-span-1',
                            note.content.length > 300 ? 'sm:col-span-2' : ''
                        )}
                        onClick={() => {
                            setSelectedNote(note);
                            setDetailOpen(true);
                        }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-lg font-semibold leading-tight break-words">
                                {note.title || 'Untitled'}
                            </h2>
                        </div>

                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-2">
                            {note.content.length > 200 ? note.content.slice(0, 200) + '...' : note.content}
                        </p>

                        {Array.isArray(note.tags) && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-4">
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

            <NoteDetailModal
                open={detailOpen}
                onOpenChange={setDetailOpen}
                note={selectedNote}
                onEdit={() => {
                    setDetailOpen(false);
                    setEditNote(selectedNote); // reuse existing modal
                    setEditOpen(true);
                }}
                onDelete={() => {
                    setDetailOpen(false);
                    onDelete(selectedNote!.id);
                }}
            />

        </>
    );
}
