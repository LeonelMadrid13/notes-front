// app/page.tsx
import LoginButton from '@/components/LoginButton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <header className="w-full max-w-2xl flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Welcome to Notes</h1>
        <nav className="flex gap-4">
          <LoginButton />
          <Link href="/register">
            <Button variant="outline">Register</Button>
          </Link>
        </nav>
      </header>
      <section className="text-center text-muted-foreground max-w-xl">
        <p className="text-lg">Your secure and minimal notes app. Log in or create a free account to begin.</p>
      </section>
    </main>
  );
}
