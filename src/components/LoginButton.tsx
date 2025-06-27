'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // if you're using shadcn/ui

export default function LoginButton() {
    const router = useRouter();

    return (
        <Button onClick={() => router.push('/login')}>
            Login
        </Button>
    );
}
