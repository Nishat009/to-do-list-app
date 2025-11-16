'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, Home, CheckSquare, User } from 'lucide-react';
import { clearAuth, getUser } from '@/lib/auth';

export default function Sidebar() {
  const pathname = usePathname();
  const user = getUser();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0D1B4C] text-white flex flex-col justify-between py-8">
      
      {/* Top User Section */}
      <div className="flex flex-col items-center px-4">
        <Image
          src={user?.photo || '/avatar.png'}
          alt="User Photo"
          width={90}
          height={90}
          className="rounded-full border-2 border-white"
        />
        <h3 className="mt-3 text-lg font-semibold">{user?.name}</h3>
        <p className="text-sm text-gray-300">{user?.email}</p>

        {/* Navigation */}
        <nav className="mt-10 w-full">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-6 py-3 hover:bg-[#13235f] transition rounded-r-full ${
              pathname === '/dashboard' ? 'bg-[#13235f]' : ''
            }`}
          >
            <CheckSquare size={20} />
            Todos
          </Link>

          <Link
            href="/profile"
            className={`flex items-center gap-3 px-6 py-3 hover:bg-[#13235f] transition rounded-r-full ${
              pathname === '/profile' ? 'bg-[#13235f]' : ''
            }`}
          >
            <User size={20} />
            Account Information
          </Link>
        </nav>
      </div>

      {/* Logout */}
      <div className="px-6">
        <button
          onClick={clearAuth}
          className="flex items-center gap-3 text-gray-300 hover:text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
