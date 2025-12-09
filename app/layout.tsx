'use client';

import { Inter, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import useUIStore from "@/lib/uiStore";
import { useEffect, useState } from "react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ['300', '400', '500', '600', '700'],
});

const roboto = Roboto({ 
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ['300', '400', '500', '700', '900'],
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useUIStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeClass = mounted ? theme : 'light'; // Avoid hydration mismatch

  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${montserrat.variable} ${themeClass}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100" suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}

