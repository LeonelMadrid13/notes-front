// app/api/notes/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
    const authCookies = await getAuthCookies();

    if (!authCookies || !authCookies.token || !authCookies.userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { token, userId } = authCookies;

    if (!token || !userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, tags } = body;

    if (!title || !content) {
        return NextResponse.json({ message: 'Title and content required' }, { status: 400 });
    }

    const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, userId, tags }),
    });

    const data = await response.json();
    if (!response.ok) {
        return NextResponse.json({ message: data.message || 'Failed to create note' }, { status: response.status });
    }

    return NextResponse.json(data);
}
