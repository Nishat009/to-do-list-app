'use client';

import Image from 'next/image';
import logo from '../../public/img/logo.png';
import Calendar from '@/components/logo/Calendar';
import Bell from '../logo/Bell';

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
        <Image src={logo} alt="Logo" width={105} height={32} />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <button className="bg-[#4F76FF] text-white p-2 rounded-lg">
          <Bell />
        </button>

        <button className="bg-[#4F76FF] text-white p-2 rounded-lg">
          <Calendar/>
        </button>

        <div className="text-right">
          <p className="font-medium">{today.split(',')[0]}</p>
          <p className="text-sm text-gray-500">{today.split(',')[1]}</p>
        </div>
      </div>

    </header>
  );
}
