"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      onKeyDown={(e) => e.key === 'Enter' && setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
      title="Toggle Theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-600 dark:text-blue-400" />
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
