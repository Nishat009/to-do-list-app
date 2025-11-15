'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { saveTokens } from '@/lib/auth';
import Image from 'next/image';
import { AxiosError } from 'axios';

export default function SignupPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ---------- Validation ----------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.first_name.trim()) newErrors.first_name = 'Please enter a valid name format.';
    if (!form.last_name.trim()) newErrors.last_name = 'Please enter a valid name format.';

    if (!form.email.includes('@')) newErrors.email = 'Please enter a valid email.';

    if (form.password.length < 6) newErrors.password = '4 characters minimum.';
    if (form.password !== form.confirm_password)
      newErrors.confirm_password = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Submit ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('email', form.email);
    formData.append('password', form.password);

    try {
      // 1. Signup
      await api.post('/api/users/signup/', formData);

      // 2. Auto‑login
      const loginData = new FormData();
      loginData.append('email', form.email);
      loginData.append('password', form.password);
      const loginRes = await api.post('/api/auth/login/', loginData);
      saveTokens(loginRes.data.access, loginRes.data.refresh);

      // 3. Profile
      const profileRes = await api.get('/api/users/me/');
      localStorage.setItem('user', JSON.stringify(profileRes.data));

      // 4. Toast + redirect
      toast.success('Account created & logged in successfully!', {
        duration: 3000,
        style: { background: '#10b981', color: '#fff' },
      });
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err: unknown) {
  let message = "Login failed";

  if (err instanceof AxiosError) {
    message = err.response?.data?.message || message;
  }

  setError(message);
}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* ---------- Illustration ---------- */}
        <div className="hidden md:block">
          <Image
            src="/signup-illustration.svg"   // ← put your illustration in public/
            alt="Signup illustration"
            width={600}
            height={600}
            className="w-full"
          />
        </div>

        {/* ---------- Form ---------- */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Create your account</h1>
          <p className="text-center text-gray-600 mb-8">
            Start managing your tasks efficiently
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                minLength={6}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirm_password}
                onChange={(e) =>
                  setForm({ ...form, confirm_password: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-full hover:bg-indigo-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}