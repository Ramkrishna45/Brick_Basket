"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export function ComingSoon({
  title,
  description = "This feature is currently under development and will be available soon.",
  backHref = "/",
  backLabel = "Go Back",
}: ComingSoonProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 mx-auto mb-6">
          <Construction className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">{title}</h1>
        <p className="text-slate-500 mb-8">{description}</p>
        <Button render={<Link href={backHref} />} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
        </Button>
      </motion.div>
    </div>
  );
}
