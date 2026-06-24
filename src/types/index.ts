// ============================================
// User & Auth Types
// ============================================

export type UserRole = "customer" | "engineer" | "admin" | "contractor";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// Project Types
// ============================================

export type ProjectStage =
  | "planning"
  | "foundation"
  | "columns"
  | "walls"
  | "slab"
  | "plumbing"
  | "electrical"
  | "finishing"
  | "handover";

export type ProjectStatus =
  | "not_started"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

export interface ProjectMilestone {
  id: string;
  stage: ProjectStage;
  title: string;
  status: "completed" | "in_progress" | "upcoming";
  startDate?: string;
  completedDate?: string;
  description: string;
  photoCount: number;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  siteAddress: string;
  city: string;
  plotSize: string;
  builtUpArea: string;
  startDate: string;
  expectedCompletion: string;
  currentStage: ProjectStage;
  status: ProjectStatus;
  completionPercentage: number;
  assignedEngineer: string;
  milestones: ProjectMilestone[];
  totalValue: number;
  amountPaid: number;
}

// ============================================
// Progress Update Types
// ============================================

export interface ProgressUpdate {
  id: string;
  projectId: string;
  title: string;
  description: string;
  stage: ProjectStage;
  completionPercentage: number;
  photos: string[];
  uploadedBy: string;
  uploadedByRole: UserRole;
  date: string;
  time: string;
}

// ============================================
// Document Types
// ============================================

export type DocumentCategory =
  | "agreement"
  | "plan"
  | "receipt"
  | "certificate"
  | "government"
  | "other";

export type FileType = "pdf" | "doc" | "img" | "dwg" | "xls";

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  category: DocumentCategory;
  fileType: FileType;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  url: string;
  isVisible: boolean;
}

// ============================================
// Payment Types
// ============================================

export type PaymentStatus = "paid" | "pending" | "overdue";

export interface PaymentMilestone {
  id: string;
  projectId: string;
  name: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  receiptUrl?: string;
  description: string;
}

export interface PaymentSummary {
  totalValue: number;
  amountPaid: number;
  amountDue: number;
  nextDueDate: string;
  nextDueAmount: number;
}

// ============================================
// Lead / Enquiry Types
// ============================================

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "rejected";

export type HomeType =
  | "independent_house"
  | "duplex"
  | "villa"
  | "row_house"
  | "farmhouse"
  | "commercial";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  plotSize: string;
  builtUpArea: string;
  budgetRange: string;
  homeType: HomeType;
  servicesNeeded: string[];
  timeline: string;
  preferredContact: "phone" | "email" | "whatsapp";
  notes: string;
  status: LeadStatus;
  assignedTo?: string;
  createdAt: string;
  lastContactedAt?: string;
}

// ============================================
// Plan Types
// ============================================

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  priceUnit: string;
  description: string;
  sqftRange: string;
  duration: string;
  features: PlanFeature[];
  idealFor: string;
  isPopular?: boolean;
}

// ============================================
// Service Types
// ============================================

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  includes: string[];
  idealFor: string;
}

// ============================================
// Testimonial Types
// ============================================

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  projectType: string;
  avatar?: string;
}

// ============================================
// Notification Types
// ============================================

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

// ============================================
// Analytics Types (Admin)
// ============================================

export interface AdminStats {
  totalCustomers: number;
  activeProjects: number;
  newEnquiries: number;
  pendingPayments: number;
  overdueTasks: number;
  todayUpdates: number;
  totalRevenue: number;
  monthlyEnquiries: { month: string; count: number }[];
  projectStatusBreakdown: { status: string; count: number }[];
  revenueByMonth: { month: string; amount: number }[];
}

// ============================================
// FAQ Types
// ============================================

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// ============================================
// Enquiry Form Types
// ============================================

export interface EnquiryFormData {
  // Step 1
  name: string;
  phone: string;
  email: string;
  city: string;
  // Step 2
  plotSize: string;
  builtUpArea: string;
  budgetRange: string;
  homeType: HomeType;
  timeline: string;
  // Step 3
  servicesNeeded: string[];
  preferredContact: "phone" | "email" | "whatsapp";
  notes: string;
}
