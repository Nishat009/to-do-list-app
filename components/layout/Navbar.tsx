'use client';

import Image from 'next/image';
import { Bell, Calendar } from 'lucide-react';

export default function Navbar() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 bg-white border-b shadow-sm h-20 flex items-center justify-between px-10">
      
      {/* Logo */}
      <div>
        <Image src="/logo.png" alt="Logo" width={120} height={40} />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <button className="bg-[#4F76FF] text-white p-2 rounded-lg">
          <Bell size={20} />
        </button>

        <button className="bg-[#4F76FF] text-white p-2 rounded-lg">
          <Calendar size={20} />
        </button>

        <div className="text-right">
          <p className="font-medium">{today.split(',')[0]}</p>
          <p className="text-sm text-gray-500">{today.split(',')[1]}</p>
        </div>
      </div>

    </header>
  );
}
