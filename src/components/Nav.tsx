// @ts-nocheck
"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "#process", label: "Process" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#platform", label: "Platform" },
  { href: "#pricing", label: "Pricing" },
  { href: "#why-us", label: "Why Us" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/admin";
    if (user.role === "engineer" || user.role === "contractor") return "/staff/dashboard";
    return "/dashboard";
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intercept all anchor links to gracefully handle the "Process" section's height collapse
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;
      
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        
        // 1. Tell Process to collapse its height if it hasn't already
        window.dispatchEvent(new CustomEvent("nav-jump"));
        
        // 2. Wait 50ms for React to commit the layout change, then scroll smoothly
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
          setOpen(false); // Close mobile menu if open
        }, 50);
      }
    };
    
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        className={`bg-paper/90 backdrop-blur border-b transition-all duration-300 ${
          scrolled ? "border-charcoal/10 shadow-sm" : "border-transparent"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-[64px]" : "h-[80px]"
          }`}
        >
          <a href="#top" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand_logo.svg"
              alt="Brick Basket"
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? "h-11" : "h-14"
              }`}
            />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-charcoal/80">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-red transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href={getDashboardLink()}
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-charcoal hover:text-red px-4 py-2 rounded-full border border-charcoal/20 hover:border-red transition-all"
              >
                <User size={15} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[14px] font-semibold text-charcoal/80 hover:text-red transition-colors px-2 py-1"
                >
                  Track Project
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center text-[14px] font-semibold text-charcoal hover:text-red px-4 py-2 rounded-full border border-charcoal/25 hover:border-red hover:bg-charcoal/5 transition-all"
                >
                  Login
                </Link>
              </>
            )}
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 bg-red hover:bg-red-dark text-paper text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
            >
              Book Free Consultation
            </Link>
          </div>

          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-charcoal"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-paper border-b border-charcoal/10"
          >
            <div className="px-6 py-5 space-y-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="block font-medium text-charcoal hover:text-red transition-colors"
                >
                  {l.label}
                </a>
              ))}
              
              <div className="pt-3 border-t border-charcoal/10 space-y-2.5">
                {isAuthenticated ? (
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full text-center font-semibold px-5 py-2.5 rounded-full border border-charcoal/25 text-charcoal hover:border-red hover:text-red transition-all"
                  >
                    <User size={16} />
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center font-semibold px-5 py-2.5 rounded-full border border-charcoal/25 text-charcoal hover:border-red hover:text-red transition-all"
                  >
                    Login to Portal
                  </Link>
                )}
                <Link
                  href="/enquiry"
                  onClick={() => setOpen(false)}
                  className="block w-full bg-red text-paper text-center font-semibold px-5 py-3 rounded-full hover:bg-red-dark transition-colors shadow-sm"
                >
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
