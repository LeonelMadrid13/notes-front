import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:5000';

function extractIdFromUrl(url: string) {
    const segments = url.split('/');
    return segments[segments.length - 1];
}

export async function PUT(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const id = cookieStore.get('id')?.value;
    const userId = extractIdFromUrl(req.url);

    if (!token) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                id: id || '',
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ success: false, error: data.error || 'Update failed' }, { status: res.status });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        console.error('[PUT /api/users/[id]]', err);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const id = cookieStore.get('id')?.value;
    const userId = extractIdFromUrl(req.url);

    if (!token) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                id: id || '',
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ success: false, error: data.error || 'Delete failed' }, { status: res.status });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        console.error('[DELETE /api/users/[id]]', err);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
