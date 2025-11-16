'use client';

import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Camera, Calendar } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#EAF3FF] flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />

        <div className="px-10 py-10">
          <h2 className="text-2xl font-semibold border-b pb-2">
            Account Information
          </h2>

          {/* Card */}
          <div className="bg-white mt-6 p-8 shadow rounded-2xl">

            {/* Photo Upload */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center relative">
                <Camera
                  size={28}
                  className="absolute bottom-1 right-1 bg-[#4F76FF] text-white p-1 rounded-full"
                />
              </div>

              <button className="bg-[#4F76FF] text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                Upload New Photo
              </button>
            </div>

            {/* Form */}
            <form className="space-y-6">

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">First Name</label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                    type="text"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Last Name</label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                    type="text"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg mt-1"
                  type="email"
                />
              </div>

              {/* Address & Contact */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Address</label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                    type="text"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Contact Number
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                    type="text"
                  />
                </div>
              </div>

              {/* Birthday */}
              <div>
                <label className="text-sm text-gray-600">Birthday</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                    type="date"
                  />
                  <Calendar
                    size={20}
                    className="absolute right-3 top-3 text-gray-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center items-center gap-4 pt-4">
                <button className="bg-[#4F76FF] text-white px-8 py-2 rounded-lg">
                  Save Changes
                </button>

                <button className="bg-gray-300 px-8 py-2 rounded-lg">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
