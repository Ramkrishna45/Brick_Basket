import Link from "next/link";
import { HardHat, CheckCircle2 } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Form side */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-2 mb-8 group w-fit">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
              <HardHat className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">{BRAND.name}</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Branding side */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='5' cy='5' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        <div className="relative z-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-slate-950/20 mb-6">
            <HardHat className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">{BRAND.tagline}</h2>
          <p className="text-amber-100 text-lg mb-10 leading-relaxed">{BRAND.description}</p>
          <ul className="space-y-4">
            {[
              "Daily photo & video updates from your site",
              "Milestone-based transparent payments",
              "All documents safe and accessible online",
              "Dedicated engineer assigned to your project",
              "Track everything from your phone, anywhere",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-amber-50">
                <CheckCircle2 className="h-5 w-5 text-amber-300 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
