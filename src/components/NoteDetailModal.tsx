// src/components/NoteDetailModal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Note {
    id: string;
    title: string;
    content: string;
    tags?: string[];
}

export function NoteDetailModal({
    open,
    onOpenChange,
    note,
    onEdit,
    onDelete,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    note: Note | null;
    onEdit: () => void;
    onDelete: () => void;
}) {
    if (!note) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="max-w-2xl w-full">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2 break-words">{note.title}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto border p-3 rounded bg-gray-50 whitespace-pre-wrap text-sm mb-4">
                    {note.content}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <Button onClick={onEdit} variant="secondary">
                        Edit
                    </Button>
                    <Button onClick={onDelete} variant="destructive">
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
