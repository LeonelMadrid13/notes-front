import { getAuthCookies } from '@/app/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:5000';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authCookies = await getAuthCookies();
    
    if (!authCookies || !authCookies.token || !authCookies.userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { token, refreshToken, userId } = authCookies;

    if (!token || !refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authCookies = await getAuthCookies();

    if (!authCookies || !authCookies.token || !authCookies.userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { token, refreshToken, userId } = authCookies;

    if (!token || !refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

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
