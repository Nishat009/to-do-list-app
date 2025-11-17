'use client';

import { useState } from 'react';

import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import AddTaskLogo from '@/components/logo/AddTaskLogo';
import Search from '@/components/logo/Search';
import Filter from '@/components/logo/Filter';
import Plus from '@/components/logo/Plus';

export default function DashboardPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#EEF7FF] flex">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Navbar />

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-bold border-b-2 text-[#0D224A] border-[#5272FF] pb-0 mb-6 w-max">
                Todos
              </h2>

              <button
                onClick={() => setShowModal(true)}
                className="bg-[#5272FF] text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
              >
                <Plus />
                New Task
              </button>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search your task here..."
                  className="w-full pl-4 h-10 pr-16 bg-white border text-[#4B5563] font-semibold text-xs border-[#D1D5DB] rounded-lg"
                />
                <Search className="absolute right-0 top-0 h-10 w-10 rounded-lg p-3 text-white bg-[#5272FF]" />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilter((prev) => !prev)}
                  className="flex items-center gap-2 h-10 px-4 py-3 font-regular bg-white border border-[#D1D5DB] rounded-lg"
                >
                  <Filter />
                  Filter
                </button>

                {showFilter && (
                  <div className="absolute right-0 w-[164px] bg-[#FCFCFC] shadow-[#00000029] rounded-xs shadow-lg p-3 z-10">
                    <p className="text-xs text-[#4B5563] border-b pb-2 border-[#00000040]">Date</p>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" /> Deadline Today
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" /> Expires in 5 days
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" /> Expires in 10 days
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" /> Expires in 30 days
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Empty */}
            <div className="bg-white rounded-2xl border border-[#D1D5DB] p-16 text-center">
              <button className="flex w-full items-center justify-center transition">
                <AddTaskLogo />
              </button>
              <p className="mt-2 text-2xl font-regular text-[#201F1E]">No todos yet</p>
            </div>
          </div>
        </main>
      </div>

      {/* ------------- MODAL ------------- */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white w-[640px] rounded-xl p-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Add New Task</h2>
              <button
                className="text-sm text-[#5272FF]"
                onClick={() => setShowModal(false)}
              >
                Go Back
              </button>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="text-sm text-gray-700">Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 h-10 mt-1 text-sm"
              />
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="text-sm text-gray-700">Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 h-10 mt-1 text-sm"
              />
            </div>

            {/* Priority */}
            <div className="mb-4">
              <label className="text-sm text-gray-700">Priority</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" /> <span className="text-red-500">●</span> Extreme
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" /> <span className="text-green-500">●</span> Moderate
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" /> <span className="text-yellow-500">●</span> Low
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="text-sm text-gray-700">Task Description</label>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm"
                placeholder="Start writing here..."
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button className="bg-[#5272FF] text-white px-6 py-2 rounded-lg text-sm">
                Done
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
