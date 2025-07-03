// /app/api/notes/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    // console.log('[DEBUG] Incoming request to /api/notes');
    // console.log('[DEBUG] Headers:', Object.fromEntries(req.headers.entries()));

    const token = (await cookies()).get('token')?.value || '';
    const userId = (await cookies()).get('id')?.value || '';


    // console.log('[DEBUG] Parsed token:', token ? '[REDACTED]' : 'None');

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = `${process.env.API_URL || 'http://localhost:5000'}/api/notes`;
    // console.log('[DEBUG] Fetching notes from:', url);

    try {
        const response = await fetch(url, {
            method: 'GET', // don't send body in GET
            headers: {
                Authorization: `Bearer ${token}`,
                id: `id ${userId}`, // include id if provided
            },
        });

        // console.log('[DEBUG] Notes API response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ message: errorData.message || 'Failed to fetch notes' }, { status: response.status });
        }

        const data = await response.json();
        // console.log('[DEBUG] Notes fetched:', Array.isArray(data) ? `${data.length} items` : data);
        return NextResponse.json(data);
    } catch {
        // console.error('[DEBUG] Unexpected error:', err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
