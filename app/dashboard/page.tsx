'use client';

import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';
import { Plus, Filter } from 'lucide-react';
import AddTaskLogo from '@/components/logo/AddTaskLogo';
import Search from '@/components/logo/Search';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#EEF7FF] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Body */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
             <h2 className="text-4xl font-bold border-b-2 text-[#0D224A] border-[#5272FF] pb-0 mb-6 w-max">
              Todos
            </h2>

              <button className="bg-[#5272FF] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#3e5ce4] transition shadow-md">
                <Plus size={20} />
                New Task
              </button>
            </div>

            {/* Search + Filter Row */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 relative">
                
                <input
                  type="text"
                  placeholder="Search your task here..."
                  className="w-full pl-4 h-10 pr-16 bg-white border text-[#4B5563] font-semibold text-xs border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-0 focus:ring-[#5272FF]  focus:border-transparent placeholder:text-[#4B5563] placeholder:font-semibold placeholder:text-xs"
                />
                <Search className="absolute right-0 top-0 h-9 w-10 rounded-lg p-3 text-white bg-[#5272FF]" />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                  <Filter size={18} />
                  Filter
                </button>

                {/* Dropdown (static for design) */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Deadline Today
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Expires in 5 days
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Expires in 10 days
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Expires in 30 days
                    </label>
                  </div>
                 
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
              <div className="relative inline-block">
                
                <button className="flex items-center justify-center transition">
                  <AddTaskLogo/>
                </button>
              </div>
              <p className="mt-2 text-2xl font-regular text-[#201F1E]">No todos yet</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}