import { cookies } from 'next/headers';

export async function getAuthCookies() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userId = cookieStore.get('id')?.value;

    if (!token || !userId) return null;

    return { token, userId };
}