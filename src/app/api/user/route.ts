import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const token = (await cookies()).get('token')?.value;
    const userId = (await cookies()).get('id')?.value;

    if (!token || !userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

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
