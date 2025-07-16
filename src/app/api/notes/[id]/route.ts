// /app/api/notes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/app/lib/auth';
import { z } from 'zod';

const NoteUpdateSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string().min(1)).optional(), // allow optional or empty
});


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authCookies = await getAuthCookies();

    if (!authCookies || !authCookies.token || !authCookies.userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { token, refreshToken } = authCookies;

    if (!token || !refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            refreshToken: refreshToken || '',
        },
    });
    if (response.status === 401) {
        // User is unauthenticated — return 401 response
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
}



export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authCookies = await getAuthCookies();

    if (!authCookies || !authCookies.token || !authCookies.userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { token, userId, refreshToken } = authCookies;

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: noteId } = await params;
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
                refreshToken: refreshToken || '',
            },
            credentials: 'include',
            body: JSON.stringify({ title, content, tags }),
        });

        if (res.status === 401) {
            // User is unauthenticated — return 401 response
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

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
