import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    (await cookies()).delete('token');
    (await cookies()).delete('id');

    return NextResponse.json({ message: 'Logged out' });
}
