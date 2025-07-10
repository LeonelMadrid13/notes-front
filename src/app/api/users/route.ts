// app/api/users/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const id = cookieStore.get('id')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/users`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            id: id || ''
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
