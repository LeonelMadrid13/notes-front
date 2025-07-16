import { cookies } from 'next/headers';

export async function getAuthCookies() {
    const cookieStore = await cookies();
    const token = cookieStore.get('authorization')?.value;
    const userId = cookieStore.get('id')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!token || !userId || !refreshToken) return null;

    return { token, userId, refreshToken };
}