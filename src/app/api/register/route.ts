import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
        return NextResponse.json({ message: response.json() || 'Registration failed' }, { status: response.status });
    }
    const { data } = await response.json();

    const { token, id } = data;

    if (!token || !id) {
        return NextResponse.json({ message: 'Invalid response from API' }, { status: 500 });
    }

    // Set token + user ID in secure cookies
    (await cookies()).set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    (await cookies()).set('id', id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    return NextResponse.json({ message: 'Registered successfully' });
}
