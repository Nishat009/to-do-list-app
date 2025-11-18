// app/layout.tsx
import './globals.css';
import { AuthProvider } from './(auth)/contextapi/AuthContext'; // adjust path
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
