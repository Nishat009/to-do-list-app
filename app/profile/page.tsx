'use client';

import { getUser, clearAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function ProfilePage() {
  const user = getUser();
  const router = useRouter();
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/users/me/');
        setProfile(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      {profile && (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{profile.first_name} {profile.last_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{profile.email}</p>
          </div>
          {profile.bio && (
            <div>
              <p className="text-sm text-gray-600">Bio</p>
              <p className="font-medium">{profile.bio}</p>
            </div>
          )}
        </div>
      )}
      <button
        onClick={clearAuth}
        className="mt-8 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}