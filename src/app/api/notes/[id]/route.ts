// /app/api/notes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

const NoteUpdateSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string().min(1)).optional(), // allow optional or empty
});


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = (await cookies()).get('token')?.value;
    const userId = (await cookies()).get('id')?.value;

    if (!token || !userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
}



export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const token = (await cookies()).get('token')?.value;
    const userId = (await cookies()).get('id')?.value;
    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const noteId = params.id;
    if (!noteId) {
        return NextResponse.json({ message: 'Note ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = NoteUpdateSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { message: parsed.error.errors[0].message },
            { status: 400 }
        );
    }

    const { title, content, tags } = parsed.data;

    try {
        const res = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content, tags }),
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ message: data.message || 'Failed to update note' }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch {
        // console.error('[UPDATE ERROR]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
