// /src/app/api/user/route.ts

import { NextResponse } from 'next/server';
import { getAuthCookies } from '@/app/lib/auth';

export async function GET() {

    const authCookies = await getAuthCookies();

    if (!authCookies || !authCookies.token || !authCookies.userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { token, userId } = authCookies;

    const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },

    });

    if (!response.ok) {
        return NextResponse.json({ message: 'Failed to fetch user data' }, { status: response.status });
    }

    const userData = await response.json();
    return NextResponse.json(userData, { status: 200 });
}

