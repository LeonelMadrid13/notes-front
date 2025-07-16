import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const response = await fetch(`${process.env.API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
         },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            { success: false, error: data.error || 'Login failed' },
            { status: response.status }
        );
    }

    const user = data.data?.user;

    // Create the response
    const nextResponse = NextResponse.json({
        success: true,
        data: {
            user,
        },
    });

    // Forward all Set-Cookie headers from the backend to the frontend
    const setCookieHeaders = response.headers.get('set-cookie');
    if (setCookieHeaders) {
        nextResponse.headers.set('Set-Cookie', setCookieHeaders);
    }

    return nextResponse;
}
