// /app/api/notes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = (await cookies()).get('token')?.value;
    const userId = (await cookies()).get('id')?.value;

    if (!token || !userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await fetch(`${process.env.NOTES_API_URL || 'http://localhost:5000/api'}/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
}
