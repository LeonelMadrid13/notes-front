// app/api/users/route.ts
import { getAuthCookies } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const authCookies = await getAuthCookies(); 
    if (!authCookies || !authCookies.token || !authCookies.userId || !authCookies.refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { token, userId, refreshToken } = authCookies;

    if (!authCookies || !authCookies.token || !authCookies.userId || !authCookies.refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            id: userId || '',
            Authorization: `Bearer ${token}`,
            refreshToken: refreshToken || '',
        },
    });

    if (res.status === 401) {
        // User is unauthenticated — return 401 response
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!res.ok) {
        return NextResponse.json({ message: 'Failed to fetch users' }, { status: res.status });
    }

    const users = await res.json();
    return NextResponse.json(users, { status: 200 });
}
