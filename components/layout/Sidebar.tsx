'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Task from '../logo/Task';
import Profile from '../logo/Profile';
import Logout from '../logo/Logout';
import { useAuth } from '@/app/(auth)/contextapi/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // read from AuthContext

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0D224A] text-white flex flex-col justify-between py-8">
      
      {/* Top User Section */}
      <div className="flex flex-col items-center mt-8">
        <Image
          src={user?.photo || '/avatar.png'} // dynamic from context
          alt="User Photo"
          width={86}
          height={86}
          className="rounded-full border-2 border-white"
        />
        <h3 className="mt-3 font-semibold">
          {user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`}
        </h3>
        <p className="text-xs">{user?.email}</p>

        {/* Navigation */}
        <nav className="mt-[46px] w-full ">
          <Link
            href="/dashboard"
            className={`flex items-center text-[#8CA3CD] gap-3 px-6 py-3 hover:bg-linear-65 from-[#5272ff54] to-[#0D224A] transition ${
              pathname === '/dashboard' ? 'text-white bg-linear-65 from-[#5272ff54] to-[#0D224A]' : ''
            }`}
          >
            <Task />
            Todos
          </Link>

          <Link
            href="/profile"
            className={`flex items-center text-[#8CA3CD] gap-3 px-6 py-3 hover:bg-linear-65 from-[#5272ff54] to-[#0D224A] transition ${
              pathname === '/profile' ? 'text-white bg-linear-65 from-[#5272ff54] to-[#0D224A]' : ''
            }`}
          >
            <Profile />
            Account Information
          </Link>
        </nav>
      </div>

      {/* Logout */}
      <div className="px-6">
        <button
          onClick={logout} // use logout from context
          className="flex items-center text-[#8CA3CD] gap-3 px-6 py-3 hover:bg-linear-65 from-[#5272ff54] to-[#0D224A] transition"
        >
          <Logout />
          Logout
        </button>
      </div>
    </aside>
  );
}
