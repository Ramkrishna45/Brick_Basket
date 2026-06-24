"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, HardHat, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV, BRAND } from "@/lib/constants";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 group-hover:bg-amber-700 transition-colors">
              <HardHat className="h-4 w-4 text-white" />
            </div>
            <span className={cn(
              "text-lg font-bold transition-colors",
              scrolled ? "text-slate-900" : "text-white"
            )}>
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? scrolled ? "text-amber-600 bg-amber-50" : "text-amber-300"
                    : scrolled ? "text-slate-700 hover:text-amber-600 hover:bg-amber-50" : "text-white/80 hover:text-white"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                "text-sm font-medium transition-colors",
                scrolled ? "text-slate-700 hover:text-amber-600" : "text-white/80 hover:text-white"
              )}
            >
              Sign In
            </Link>
            <Link href="/enquiry"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 transition-colors"
            >
              Get Free Consultation
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors",
                scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
              )}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
                      <HardHat className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-slate-900">{BRAND.name}</span>
                  </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {PUBLIC_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "text-amber-600 bg-amber-50"
                          : "text-slate-700 hover:text-amber-600 hover:bg-amber-50"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-amber-600" />
                    {BRAND.phone}
                  </div>
                  <Link href="/enquiry"
                    onClick={() => setMobileOpen(false)}
                    className="w-full inline-flex items-center justify-center rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 transition-colors"
                  >
                    Get Free Consultation
                  </Link>
                  <Link href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full inline-flex items-center justify-center rounded-lg border border-slate-300 hover:border-amber-400 text-slate-700 hover:text-amber-700 text-sm font-medium px-4 py-2 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
