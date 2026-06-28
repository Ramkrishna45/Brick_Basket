import Link from "next/link";
import { HardHat, Phone, Mail, MapPin, Share2, MessageCircle, Camera, Play } from "lucide-react";
import { BRAND, PUBLIC_NAV, SERVICES_LIST } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
                <HardHat className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">{BRAND.name}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {BRAND.description}
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Share2, href: "#", label: "Facebook" },
                { icon: MessageCircle, href: "#", label: "Twitter" },
                { icon: Camera, href: "#", label: "Instagram" },
                { icon: Play, href: "#", label: "Youtube" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-amber-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {PUBLIC_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/enquiry" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                  Free Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {SERVICES_LIST.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    href="/services"
                    className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <a href={`tel:${BRAND.phone}`} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                  {BRAND.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-400">{BRAND.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <Link key={link} href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-400 transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
