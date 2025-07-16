// /app/api/refresh/route.ts
import { NextResponse } from 'next/server';
import { getAuthCookies } from '@/app/lib/auth';

export async function POST() {
    const authCookies = await getAuthCookies();

    // We only need the refreshToken to refresh
    if (!authCookies || !authCookies.refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Optional: You could check userId, but refresh token itself should suffice
    // const { refreshToken, userId } = authCookies;

    const url = `${process.env.API_URL || 'http://localhost:5000'}/api/auth/refresh`;

    try {
        // Forward the refreshToken as a cookie to the backend!
        // (Server-side fetch does not auto-forward cookies, so we set it manually)
        const cookieHeader = `refreshToken=${authCookies.refreshToken}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Cookie: cookieHeader,
            },
            // No body needed unless your backend expects it
        });

        if (response.status === 401 || response.status === 403) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ message: errorData.message || 'Failed to refresh token' }, { status: response.status });
        }

        const data = await response.json();
        // You could also set the new access token as a cookie here, if your backend doesn't

        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
