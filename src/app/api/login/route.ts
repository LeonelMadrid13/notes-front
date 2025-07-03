// app/api/login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const response = await fetch(`${process.env.API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json({ message: data.message || 'Login failed' }, { status: response.status });
    }

    const token = data.token;
    const userId = data.id;

    if (!token) {
        return NextResponse.json({ message: 'No token returned' }, { status: 500 });
    }
    if (!userId) {
        return NextResponse.json({ message: 'No user ID returned' }, { status: 500 });
    }

    (await cookies()).set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
    });

    (await cookies()).set('id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
    });

    return NextResponse.json({ message: 'Logged in successfully' });
}
