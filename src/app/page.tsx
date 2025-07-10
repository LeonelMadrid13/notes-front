import LoginButton from '@/components/LoginButton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold">
          Welcome to <span className="text-primary">Notes</span>
        </h1>
        <p className="text-muted-foreground text-base">
          Your secure and minimal notes app. Log in or create a free account to begin.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
          <LoginButton />
          <Link href="/register">
            <Button variant="outline" className="w-full sm:w-auto">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
