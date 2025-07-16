import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
        return NextResponse.json({ message: response.json() || 'Registration failed' }, { status: response.status });
    }

    return NextResponse.json({ message: 'Registered successfully' });
}
