import Link from 'next/link';
import { getUser } from '@/lib/auth';

export default function Navbar() {
  const user = getUser();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Hello, {user?.name}</h2>
        <nav className="flex gap-4">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Todos
          </Link>
          <Link href="/profile" className="text-blue-600 hover:underline">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}