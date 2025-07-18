// /src/app/api/user/route.ts

import { NextResponse } from 'next/server';
import { getAuthCookies } from '@/app/lib/auth';

export async function GET() {

    const authCookies = await getAuthCookies();

    if (!authCookies || !authCookies.token || !authCookies.userId || !authCookies.refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { userId, refreshToken, token } = authCookies;

    const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/users/${userId}`, {
        method: 'GET',
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

    if (!response.ok) {
        return NextResponse.json({ message: 'Failed to fetch user data' }, { status: response.status });
    }

    const { data } = await response.json();
    return NextResponse.json(data, { status: 200 });
}

