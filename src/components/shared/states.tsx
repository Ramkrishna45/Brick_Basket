"use client";

import { motion } from "motion/react";
import { FileX, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
        {icon || <FileX className="h-8 w-8 text-slate-400" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

// ============================================
// Loading State
// ============================================

interface LoadingStateProps {
  variant?: "page" | "card" | "table" | "inline";
  count?: number;
}

export function LoadingState({ variant = "page", count = 3 }: LoadingStateProps) {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-amber-600" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 animate-pulse"
          >
            <div className="h-4 w-3/4 bg-slate-200 rounded mb-4" />
            <div className="h-3 w-full bg-slate-100 rounded mb-2" />
            <div className="h-3 w-2/3 bg-slate-100 rounded mb-4" />
            <div className="h-8 w-24 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse">
        <div className="h-12 bg-slate-50 border-b border-slate-200" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100">
            <div className="h-4 w-1/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/4 bg-slate-100 rounded" />
            <div className="h-4 w-1/6 bg-slate-100 rounded" />
            <div className="h-4 w-1/6 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Page variant
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-amber-600 mb-4" />
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  );
}

// ============================================
// Error State
// ============================================

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
}

// ============================================
// Permission Denied
// ============================================

interface PermissionDeniedProps {
  onGoBack?: () => void;
}

export function PermissionDenied({ onGoBack }: PermissionDeniedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Access Denied</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        You don&apos;t have permission to view this page. Please contact your administrator if you
        believe this is an error.
      </p>
      {onGoBack && (
        <Button onClick={onGoBack} variant="outline">
          Go Back
        </Button>
      )}
    </motion.div>
  );
}

// ============================================
// Status Badge
// ============================================

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "dot";
}

const statusStyles: Record<string, string> = {
  // Payment
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  // Project
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  not_started: "bg-slate-50 text-slate-600 border-slate-200",
  on_hold: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  upcoming: "bg-slate-50 text-slate-600 border-slate-200",
  // Lead
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-purple-50 text-purple-700 border-purple-200",
  qualified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  // Stage
  planning: "bg-violet-50 text-violet-700 border-violet-200",
  foundation: "bg-amber-50 text-amber-700 border-amber-200",
  columns: "bg-orange-50 text-orange-700 border-orange-200",
  walls: "bg-blue-50 text-blue-700 border-blue-200",
  slab: "bg-cyan-50 text-cyan-700 border-cyan-200",
  plumbing: "bg-teal-50 text-teal-700 border-teal-200",
  electrical: "bg-yellow-50 text-yellow-700 border-yellow-200",
  finishing: "bg-pink-50 text-pink-700 border-pink-200",
  handover: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const dotColors: Record<string, string> = {
  paid: "bg-emerald-500",
  completed: "bg-emerald-500",
  in_progress: "bg-blue-500",
  pending: "bg-amber-500",
  overdue: "bg-red-500",
  not_started: "bg-slate-400",
  on_hold: "bg-amber-500",
  cancelled: "bg-red-500",
  new: "bg-blue-500",
  contacted: "bg-purple-500",
  qualified: "bg-emerald-500",
  converted: "bg-emerald-500",
  rejected: "bg-red-500",
  upcoming: "bg-slate-400",
};

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const style = statusStyles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  const formatted = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (variant === "dot") {
    const dotColor = dotColors[status] || "bg-slate-400";
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
        {formatted}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      {formatted}
    </span>
  );
}

// ============================================
// File Type Icon
// ============================================

interface FileTypeIconProps {
  type: string;
  className?: string;
}

export function FileTypeIcon({ type, className = "h-10 w-10" }: FileTypeIconProps) {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    pdf: { bg: "bg-red-100", text: "text-red-600", label: "PDF" },
    doc: { bg: "bg-blue-100", text: "text-blue-600", label: "DOC" },
    img: { bg: "bg-green-100", text: "text-green-600", label: "IMG" },
    dwg: { bg: "bg-purple-100", text: "text-purple-600", label: "DWG" },
    xls: { bg: "bg-emerald-100", text: "text-emerald-600", label: "XLS" },
  };

  const { bg, text, label } = colors[type] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    label: "FILE",
  };

  return (
    <div
      className={`${className} ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}
    >
      <span className={`text-xs font-bold ${text}`}>{label}</span>
    </div>
  );
}
