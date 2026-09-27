"use client";

import { useState } from "react";

export default function Footer() {
  const [logoError, setLogoError] = useState(false);
  return (
    <footer className="bg-ink text-paper/60 px-6 lg:px-10 py-14">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          {logoError ? (
            <span className="font-display text-[20px] text-paper">
              Brick<span className="text-red">Basket</span>
            </span>
          ) : (
            <img
              src="/images/brand_logo.svg"
              alt="Brick Basket"
              className="h-12 w-auto brightness-0 invert"
              onError={() => setLogoError(true)}
            />
          )}
          <p className="text-[13.5px] mt-3 leading-relaxed max-w-[220px]">
            End-to-end construction, engineered on the ground and tracked in the open.
          </p>
        </div>
        <div>
          <p className="tag-mono text-[12px] uppercase text-paper/40 mb-3">Company</p>
          <ul className="space-y-2 text-[14px]">
            <li><a href="#process" className="hover:text-paper transition-colors">Process</a></li>
            <li><a href="#services" className="hover:text-paper transition-colors">Services</a></li>
            <li><a href="#pricing" className="hover:text-paper transition-colors">Pricing</a></li>
          </ul>
        </div>
        <div>
          <p className="tag-mono text-[12px] uppercase text-paper/40 mb-3">Platform</p>
          <ul className="space-y-2 text-[14px]">
            <li><a href="#platform" className="hover:text-paper transition-colors">Site Feed</a></li>
            <li><a href="#platform" className="hover:text-paper transition-colors">Digital Vault</a></li>
            <li><a href="#faq" className="hover:text-paper transition-colors">FAQ</a></li>
          </ul>
        </div>
        <div>
          <p className="tag-mono text-[12px] uppercase text-paper/40 mb-3">Get in touch</p>
          <ul className="space-y-2 text-[14px]">
            <li>hello@brickbasket.in</li>
            <li>+91 98765 43210</li>
            <li>Bengaluru · Chennai · Hyderabad</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-paper/10 text-[12.5px] flex flex-wrap justify-between gap-3">
        <span>© 2026 Brick Basket Construction Technologies Pvt. Ltd.</span>
        <span>Privacy · Terms · Warranty Policy</span>
      </div>
    </footer>
  );
}
