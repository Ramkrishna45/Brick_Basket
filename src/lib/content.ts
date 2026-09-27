// Centralised copy + data. Editing site content should mean editing this
// file, not hunting through JSX — keeps components focused on layout/motion.

export const processSteps = [
  {
    id: "01",
    title: "Consultation & Vision Mapping",
    body: "We start with a conversation, not a contract. Our team maps your budget, must-haves, and timeline into a clear project brief before a single drawing is made.",
    image:
      "https://images.unsplash.com/photo-1714974528737-3e6c7e4d11af?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "02",
    title: "Plot Sourcing & Evaluation",
    body: "Already have land? We verify title, soil, and approvals. Still looking? Our sourcing team shortlists plots that genuinely fit your budget and vision.",
    image:
      "https://images.unsplash.com/photo-1747854805840-9be7d5e360e6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "03",
    title: "Custom Design & Planning",
    body: "Architects turn your brief into a Vastu-aligned design - structural drawings, material specs, and a locked build timeline, ready for your sign-off.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "04",
    title: "Agreement & Digital Onboarding",
    body: "Sign digitally, not in triplicate. Your contract, payment schedule, and drawings are onboarded into your Brick Basket account in one sitting.",
    image:
      "https://images.unsplash.com/photo-1758518731462-d091b0b4ed0d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "05",
    title: "Construction & Real-Time Tracking",
    body: "Ground breaks under a dedicated engineer. Daily photos, videos, and remarks land in your app - the same day they happen on site.",
    image:
      "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "06",
    title: "Milestone-Based Payments",
    body: "Every instalment is tied to verified progress. You review the site update; only then does that payment become due — never before.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "07",
    title: "Quality Inspection & Handover",
    body: "A 200-point audit, a final walkthrough, and snag-list closure - then the keys, and every document you'll ever need, are yours.",
    image:
      "https://images.unsplash.com/photo-1741156386380-0236c72eb6f9?auto=format&fit=crop&w=1200&q=80",
  },
];

export const services = [
  {
    tag: "SVC-01",
    title: "Construction Planning",
    body: "Structural drawings, material schedules, and a locked build timeline before ground is broken.",
  },
  {
    tag: "SVC-02",
    title: "Site Supervision & Quality Audits",
    body: "A dedicated engineer inspects every stage against a 200-point checklist - logged in your app, not a notebook.",
  },
  {
    tag: "SVC-03",
    title: "Design & Vastu Consultation",
    body: "In-house architects balance Vastu principles, natural light, and ventilation with how your family actually lives.",
  },
  {
    tag: "SVC-04",
    title: "Cost Estimation & BOQ",
    body: "A line-itemed bill of quantities before you sign anything - no \"market rate\" surprises mid-build.",
  },
];

export const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&w=900&q=80",
    caption: "STAGE 03 · WALL FRAMING",
    site: "Whitefield, Bengaluru",
  },
  {
    src: "https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?auto=format&fit=crop&w=900&q=80",
    caption: "STAGE 02 · STRUCTURE",
    site: "ECR, Chennai",
  },
  {
    src: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=900&q=80",
    caption: "STAGE 01 · EXCAVATION",
    site: "Gachibowli, Hyderabad",
  },
  {
    src: "https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc?auto=format&fit=crop&w=900&q=80",
    caption: "SITE SAFETY AUDIT",
    site: "Kondapur, Hyderabad",
  },
  {
    src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
    caption: "CREW BRIEFING",
    site: "Whitefield, Bengaluru",
  },
  {
    src: "https://images.unsplash.com/photo-1635006459494-c9b9665a666e?auto=format&fit=crop&w=900&q=80",
    caption: "STAGE 06 · HANDOVER",
    site: "Coimbatore",
  },
];

export const pricingPlans = [
  {
    name: "Basic",
    tagline: "Dependable, no-frills construction",
    rate: "1,650",
    features: [
      "Standard structural design",
      "IS-graded steel & branded cement",
      "Daily site photo updates",
      "3-stage milestone payments",
      "5-year structural warranty",
    ],
    highlight: false,
  },
  {
    name: "Standard",
    tagline: "The full transparency experience",
    rate: "2,100",
    badge: "Most Popular · NRI Friendly",
    features: [
      "Everything in Basic, plus:",
      "Vastu-aligned custom design",
      "Daily photo + video + engineer remarks",
      "6-stage milestone payments",
      "Dedicated NRI relationship manager",
      "10-year structural warranty",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    tagline: "Architect-led, statement builds",
    rate: "2,800",
    features: [
      "Everything in Standard, plus:",
      "Premium imported fittings & facades",
      "Named senior architect & site manager",
      "Weekly video walkthrough calls",
      "15-year structural warranty",
    ],
    highlight: false,
  },
];

export const differentiators = [
  {
    old: "Site visits when you can manage the drive",
    now: "Daily photos, videos & remarks, wherever you are",
  },
  {
    old: "Lump-sum advances, paid on trust",
    now: "Milestone payments, released on verified progress",
  },
  {
    old: "Receipts in a folder, drawings in a tube",
    now: "One digital vault - quotes, drawings, warranties",
  },
  {
    old: "Updates via a phone call you have to chase",
    now: "Push updates the moment a stage is signed off",
  },
  {
    old: "Quality checks, if and when you ask",
    now: "200-point audits logged at every milestone",
  },
];

export const testimonials = [
  {
    quote:
      "I built my parents' house from Dubai without a single site visit. The daily photos meant I caught a drainage slope issue before it was too late to fix.",
    name: "Arjun Menon",
    tag: "NRI · Dubai",
    initials: "AM",
  },
  {
    quote:
      "Between two jobs and a toddler, I had zero time for site visits. The app basically became my project manager - I just approved milestones on my commute.",
    name: "Sneha Rao",
    tag: "IT Professional · Bengaluru",
    initials: "SR",
  },
  {
    quote:
      "We'd heard every horror story about contractors vanishing mid-build. Milestone payments meant our money only ever moved after we'd seen the work ourselves.",
    name: "Mr. & Mrs. Krishnan",
    tag: "Retired Couple · Coimbatore",
    initials: "MK",
  },
  {
    quote:
      "Every receipt, drawing, and warranty card is still in the app a year after handover. When our AC needed service, the warranty PDF was one tap away.",
    name: "Farhan Ahmed",
    tag: "Returning Client · Hyderabad",
    initials: "FA",
  },
];

export const faqs = [
  {
    q: "Can I really track construction from abroad?",
    a: "Yes - this is the case Brick Basket is built for. You get daily photos, short videos, and written engineer notes in the app regardless of time zone, plus scheduled video walkthroughs on Standard and Premium plans.",
  },
  {
    q: "What if I want to change the plan mid-construction?",
    a: "Minor changes (fittings, finishes, room layouts before slab work) are common and quoted as a revised BOQ line item. Structural changes after a stage is complete are reviewed by our engineering team for feasibility and cost impact before approval.",
  },
  {
    q: "How exactly do milestone payments work?",
    a: "Your total cost is split across construction stages (foundation, structure, walls, roofing, finishing, handover). Each stage is photographed, logged, and signed off by your engineer in the app - only then does that instalment become payable. You approve every release before it's due.",
  },
  {
    q: "Do you handle government approvals and permits?",
    a: "Yes. Building plan approval, structural stability certificates, and utility connection paperwork are filed by our team, with copies of every approval stored in your digital repository as they're issued.",
  },
  {
    q: "How long does a typical build take?",
    a: "Most 2,000–3,000 sq.ft homes complete in 10–14 months from ground-breaking, depending on plan complexity and site access. Your exact timeline is locked into the contract before construction begins.",
  },
  {
    q: "What's covered under warranty after handover?",
    a: "Structural warranty (5–15 years depending on plan) covers foundation and load-bearing elements. Waterproofing and workmanship issues raised within 12 months of handover are rectified at no cost, tracked as tickets in your app.",
  },
];
