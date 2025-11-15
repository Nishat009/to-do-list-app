import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">My Todo App</h1>
        <p className="text-lg text-gray-600 mb-8">Organize your life, beautifully.</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}