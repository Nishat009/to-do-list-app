"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider, useAuth } from "./(auth)/contextapi/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // pages where sidebar/navbar should NOT appear
  const authRoutes = ["/login", "/register"];
  const isAuthPage = authRoutes.includes(pathname);

  // show loader while checking user
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking session...
      </div>
    );
  }

  // If user is NOT logged in → show page normally (auth pages)
  if (!user || isAuthPage) {
    return (
      <>
        {children}
        <Toaster position="top-center" />
      </>
    );
  }

  // If user IS logged in → show full layout
  return (
    
    <div className="min-h-screen bg-[#EEF7FF] flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />
        <div>{children}</div>
      </div>

      <Toaster position="top-center" />
    </div>
    
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
