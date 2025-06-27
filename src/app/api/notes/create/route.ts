// app/api/notes/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const token = (await cookies()).get('token')?.value;
    const userId = (await cookies()).get('id')?.value;

    if (!token || !userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
        return NextResponse.json({ message: 'Title and content required' }, { status: 400 });
    }

    const response = await fetch(`${process.env.NOTES_API_URL || 'http://localhost:5000/api'}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, userId }),
    });

    const data = await response.json();
    if (!response.ok) {
        return NextResponse.json({ message: data.message || 'Failed to create note' }, { status: response.status });
    }

    return NextResponse.json(data);
}
