"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  side?: "top" | "bottom";
  className?: string;
}

export function CustomDropdown({ trigger, children, align = "end", side = "bottom", className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer inline-flex w-full items-center">
        {trigger}
      </div>
      
      {open && (
        <div 
          className={cn(
            "absolute z-50 min-w-[12rem] rounded-md bg-white dark:bg-slate-950 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            align === "end" ? "right-0 origin-right" : "left-0 origin-left",
            side === "top" ? "bottom-full mb-2 origin-bottom" : "mt-2 origin-top",
            "animate-in fade-in-0 zoom-in-95",
            className
          )}
          onClick={() => setOpen(false)}
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomDropdownItem({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <div 
      onClick={onClick}
      className={cn("block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-900 hover:text-slate-900 dark:text-slate-100 cursor-pointer w-full text-left", className)}
    >
      {children}
    </div>
  );
}

export function CustomDropdownLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{children}</div>;
}

export function CustomDropdownSeparator() {
  return <div className="border-t border-slate-100 dark:border-slate-800 my-1" />;
}
