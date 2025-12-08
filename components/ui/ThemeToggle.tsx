// components/ui/ThemeToggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import useUIStore from '@/lib/uiStore';
import { Button } from './button';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or nothing on the server to avoid hydration mismatch
    return <div className="w-9 h-9" />;
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white hover:bg-white/20 dark:text-gray-200 dark:hover:bg-gray-700">
      {theme === 'light' ? 
        <Moon className="h-5 w-5" /> : 
        <Sun className="h-5 w-5" />
      }
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
