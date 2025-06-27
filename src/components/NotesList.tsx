// components/NotesList.tsx
'use client';

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

export function NotesList({ notes }: { notes: Note[] }) {
    if (notes.length === 0) {
        return <p>No notes found.</p>;
    }

    return (
        <ul className="space-y-4">
            {notes.map((note) => (
                <li key={note.id} className="border rounded-xl p-4 shadow">
                    <h2 className="font-semibold text-lg">{note.title}</h2>
                    <p className="text-sm text-gray-700">{note.content}</p>
                    <span className="text-xs text-gray-400 block mt-2">
                        {new Date(note.createdAt).toLocaleString()}
                    </span>
                </li>
            ))}
        </ul>
    );
}
