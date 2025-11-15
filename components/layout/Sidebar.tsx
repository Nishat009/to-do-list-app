import Link from 'next/link';
import { logout } from '@/lib/auth';
import { CheckSquare, LogOut, User } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-indigo-700 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold">MyTodo</h1>
      </div>
      <nav className="mt-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-600 transition"
        >
          <CheckSquare size={20} />
          Todos
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-600 transition"
        >
          <User size={20} />
          Profile
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-600 transition w-full text-left"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}