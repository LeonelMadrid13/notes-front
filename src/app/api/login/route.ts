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
        return NextResponse.json(
            { success: false, error: data.error || 'Login failed' },
            { status: response.status }
        );
    }

    const token = data.data?.token;
    const user = data.data?.user;

    if (!token || !user?.id) {
        return NextResponse.json(
            { success: false, error: 'Invalid login response from server' },
            { status: 500 }
        );
    }

    const cookieStore = await cookies();

    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
    });

    cookieStore.set('id', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
    });

    return NextResponse.json({
        success: true,
        data: {
            user,
        },
    });
}
