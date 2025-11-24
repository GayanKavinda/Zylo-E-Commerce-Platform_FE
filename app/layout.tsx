'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import useAuthStore from "@/lib/authStore";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex`} suppressHydrationWarning>
        {/* Sidebar */}
        {user && <Sidebar />}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Navbar */}
          {user && <Navbar />}

          {/* Page content */}
          <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
