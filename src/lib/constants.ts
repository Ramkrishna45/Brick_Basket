import {
  Home,
  Building2,
  ClipboardList,
  FileText,
  CreditCard,
  BarChart3,
  Users,
  Upload,
  FolderOpen,
  Settings,
  HardHat,
  Ruler,
  PencilRuler,
  Calculator,
  Activity,
  FileCheck,
  Package,
  Plus,
  Compass,
  type LucideIcon,
} from "lucide-react";

// ============================================
// Brand
// ============================================

export const BRAND = {
  name: "Brick Basket",
  tagline: "Build Your Dream Home With Complete Transparency",
  description:
    "India's trusted home construction management platform. Track every brick, every day.",
  phone: "+91 98765 43210",
  email: "hello@brickbasket.in",
  address: "123, Construction Hub, Bengaluru, Karnataka 560001",
};

// ============================================
// Navigation
// ============================================

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
}

export const PUBLIC_NAV: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Plans", href: "/plans" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export const CUSTOMER_NAV: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "My Project", href: "/project", icon: Building2 },
  { title: "Daily Progress", href: "/progress", icon: ClipboardList },
  { title: "Documents", href: "/documents", icon: FileText },
  { title: "Payments", href: "/payments", icon: CreditCard },
  { title: "New Enquiry", href: "/new-enquiry", icon: Plus },
  { title: "Explore Plans", href: "/plans", icon: Compass },
];

export const ADMIN_NAV: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: BarChart3 },
  { title: "Leads", href: "/leads", icon: Users },
  { title: "Projects", href: "/projects", icon: Building2 },
  { title: "Upload Progress", href: "/uploads", icon: Upload },
  { title: "Payments", href: "/admin-payments", icon: CreditCard },
  { title: "Documents", href: "/admin-documents", icon: FolderOpen },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Settings", href: "/admin-settings", icon: Settings },
];

// ============================================
// Construction Stages
// ============================================

export const CONSTRUCTION_STAGES = [
  {
    key: "planning",
    label: "Planning",
    description: "Design approval and permits",
  },
  {
    key: "foundation",
    label: "Foundation",
    description: "Excavation and foundation laying",
  },
  {
    key: "columns",
    label: "Columns & Beams",
    description: "Structural framework",
  },
  { key: "walls", label: "Walls", description: "Brick and block work" },
  { key: "slab", label: "Slab", description: "Roof slab casting" },
  {
    key: "plumbing",
    label: "Plumbing",
    description: "Water and drainage lines",
  },
  {
    key: "electrical",
    label: "Electrical",
    description: "Wiring and fixtures",
  },
  {
    key: "finishing",
    label: "Finishing",
    description: "Plastering, painting, flooring",
  },
  {
    key: "handover",
    label: "Handover",
    description: "Final inspection and keys",
  },
] as const;

// ============================================
// Services
// ============================================

export const SERVICES_LIST = [
  {
    id: "construction-planning",
    title: "Construction Planning",
    description:
      "End-to-end planning from blueprint to completion with expert architects and engineers.",
    icon: "PencilRuler",
    lucideIcon: PencilRuler,
    includes: [
      "Architectural design",
      "Structural planning",
      "Government approvals",
      "Material estimation",
      "Timeline preparation",
    ],
    idealFor: "Anyone planning to build a new home from scratch",
  },
  {
    id: "site-supervision",
    title: "Site Supervision",
    description:
      "Dedicated on-site engineers ensuring quality construction at every stage.",
    icon: "HardHat",
    lucideIcon: HardHat,
    includes: [
      "Daily site visits",
      "Quality checks",
      "Worker management",
      "Safety compliance",
      "Progress reporting",
    ],
    idealFor: "Homeowners who can't visit the site daily",
  },
  {
    id: "design-consultation",
    title: "Design Consultation",
    description:
      "Modern architectural designs tailored to your plot, budget, and lifestyle.",
    icon: "Ruler",
    lucideIcon: Ruler,
    includes: [
      "2D & 3D designs",
      "Interior layouts",
      "Elevation designs",
      "Vastu consultation",
      "Design revisions",
    ],
    idealFor: "Those wanting a custom-designed home",
  },
  {
    id: "cost-estimation",
    title: "Cost Estimation",
    description:
      "Transparent, itemized cost breakdowns so you know exactly where every rupee goes.",
    icon: "Calculator",
    lucideIcon: Calculator,
    includes: [
      "Material cost breakdown",
      "Labor cost estimation",
      "Contingency planning",
      "Payment scheduling",
      "Budget optimization",
    ],
    idealFor: "Budget-conscious homebuilders",
  },
  {
    id: "progress-tracking",
    title: "Progress Tracking",
    description:
      "Real-time daily updates with photos, videos, and stage-wise tracking on your phone.",
    icon: "Activity",
    lucideIcon: Activity,
    includes: [
      "Daily photo updates",
      "Stage-wise tracking",
      "Milestone notifications",
      "Engineer notes",
      "Timeline visibility",
    ],
    idealFor: "NRI customers and busy professionals",
  },
  {
    id: "documentation",
    title: "Documentation Support",
    description:
      "All your construction documents organized, accessible, and safely stored online.",
    icon: "FileCheck",
    lucideIcon: FileCheck,
    includes: [
      "Agreement management",
      "Plan storage",
      "Payment receipts",
      "Government documents",
      "Completion certificates",
    ],
    idealFor: "Everyone — simplifies paperwork headaches",
  },
  {
    id: "material-coordination",
    title: "Material Coordination",
    description:
      "We source and manage quality materials from trusted suppliers at competitive prices.",
    icon: "Package",
    lucideIcon: Package,
    includes: [
      "Vendor management",
      "Quality verification",
      "Delivery coordination",
      "Rate negotiation",
      "Wastage control",
    ],
    idealFor: "Those wanting hassle-free material management",
  },
];

// ============================================
// Plans
// ============================================

export const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "₹1,650",
    priceUnit: "per sq.ft",
    description:
      "Essential construction management for straightforward home builds.",
    sqftRange: "800 – 2,000 sq.ft",
    duration: "8 – 12 months",
    idealFor: "First-time homebuilders with clear plans",
    isPopular: false,
    features: [
      { name: "Architectural design", included: true },
      { name: "Construction management", included: true },
      { name: "Weekly progress updates", included: true },
      { name: "Basic material coordination", included: true },
      { name: "Payment milestone tracking", included: true },
      { name: "Document storage", included: true },
      { name: "Daily photo updates", included: false },
      { name: "Dedicated engineer", included: false },
      { name: "Interior coordination", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: "₹2,100",
    priceUnit: "per sq.ft",
    description:
      "Comprehensive tracking and management with daily updates and dedicated support.",
    sqftRange: "1,000 – 3,500 sq.ft",
    duration: "10 – 16 months",
    idealFor: "Professionals & NRIs who need full visibility",
    isPopular: true,
    features: [
      { name: "Architectural design", included: true },
      { name: "Construction management", included: true },
      { name: "Daily progress updates", included: true },
      { name: "Full material coordination", included: true },
      { name: "Payment milestone tracking", included: true },
      { name: "Document storage", included: true },
      { name: "Daily photo updates", included: true },
      { name: "Dedicated engineer", included: true },
      { name: "Interior coordination", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹2,800",
    priceUnit: "per sq.ft",
    description:
      "White-glove service with interior design, priority support, and premium materials.",
    sqftRange: "1,500 – 5,000+ sq.ft",
    duration: "12 – 20 months",
    idealFor: "Luxury homebuilders who want the best",
    isPopular: false,
    features: [
      { name: "Architectural design", included: true },
      { name: "Construction management", included: true },
      { name: "Daily progress updates", included: true },
      { name: "Premium material coordination", included: true },
      { name: "Payment milestone tracking", included: true },
      { name: "Document storage", included: true },
      { name: "Daily photo & video updates", included: true },
      { name: "Dedicated senior engineer", included: true },
      { name: "Interior coordination", included: true },
      { name: "Priority 24/7 support", included: true },
    ],
  },
];

// ============================================
// Trust Stats
// ============================================

export const TRUST_STATS = [
  { label: "Homes Built", value: "500+", icon: "Building2" },
  { label: "Years Experience", value: "8+", icon: "Calendar" },
  { label: "On-Time Delivery", value: "98%", icon: "Clock" },
  { label: "Customer Satisfaction", value: "4.9★", icon: "Star" },
];

// ============================================
// FAQs
// ============================================

export const FAQS = [
  {
    id: "1",
    question: "How does the progress tracking work?",
    answer:
      "Once your project starts, your assigned engineer uploads daily photos, videos, and notes directly to your dashboard. You can view these updates on your phone or computer anytime, from anywhere in the world.",
  },
  {
    id: "2",
    question: "Can I change my plan after starting?",
    answer:
      "Yes, you can upgrade your plan at any time during construction. The pricing difference will be adjusted in your next milestone payment. Downgrades are available only before the foundation stage begins.",
  },
  {
    id: "3",
    question: "How are payments structured?",
    answer:
      "Payments are split into milestone-based installments tied to construction stages. You pay as each stage is completed and verified, ensuring complete transparency and accountability.",
  },
  {
    id: "4",
    question: "What if I'm an NRI and can't visit the site?",
    answer:
      "Our Standard and Premium plans are designed specifically for remote homeowners. You'll receive daily photo/video updates, can communicate with your engineer through the platform, and have full document access online.",
  },
  {
    id: "5",
    question: "Do you handle government approvals and permits?",
    answer:
      "Yes, all plans include assistance with necessary government approvals, building permits, and compliance documentation. We handle the paperwork so you can focus on your dream home.",
  },
];

// ============================================
// Testimonials
// ============================================

export const TESTIMONIALS = [
  {
    id: "1",
    name: "Rajesh Kumar",
    location: "Bengaluru",
    rating: 5,
    review:
      "Being an NRI, I was worried about construction quality. Brick Basket's daily photo updates gave me complete peace of mind. My house was delivered on time and exactly as planned.",
    projectType: "3BHK Independent House",
  },
  {
    id: "2",
    name: "Priya Sharma",
    location: "Hyderabad",
    rating: 5,
    review:
      "The transparency is unmatched. I could see every rupee spent, every brick laid. The payment tracking and document management saved me so much hassle.",
    projectType: "Duplex Villa",
  },
  {
    id: "3",
    name: "Mohammed Irfan",
    location: "Chennai",
    rating: 4,
    review:
      "Professional team, excellent communication. My engineer Arjun was always available for questions. The progress tracking app is brilliant — I checked it every morning with my coffee!",
    projectType: "2BHK Row House",
  },
];

// ============================================
// Home Types
// ============================================

export const HOME_TYPES = [
  { value: "independent_house", label: "Independent House" },
  { value: "duplex", label: "Duplex" },
  { value: "villa", label: "Villa" },
  { value: "row_house", label: "Row House" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "commercial", label: "Commercial" },
];

// ============================================
// Budget Ranges
// ============================================

export const BUDGET_RANGES = [
  "Under ₹20 Lakhs",
  "₹20 – 40 Lakhs",
  "₹40 – 60 Lakhs",
  "₹60 – 80 Lakhs",
  "₹80 Lakhs – 1 Crore",
  "₹1 – 2 Crore",
  "Above ₹2 Crore",
];

// ============================================
// Timeline Options
// ============================================

export const TIMELINE_OPTIONS = [
  "Immediately",
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "6 – 12 months",
  "Just exploring",
];
