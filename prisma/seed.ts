import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧱 Seeding Brick Basket database...\n");

  // ============================================
  // 1. Hash password for all demo users
  // ============================================
  const passwordHash = await bcrypt.hash("demo123", 10);

  // ============================================
  // 2. Upsert Users
  // ============================================
  const admin = await prisma.user.upsert({
    where: { email: "admin@brickbasket.in" },
    update: {},
    create: {
      name: "Ananya Reddy",
      email: "admin@brickbasket.in",
      phone: "+91 98765 43210",
      passwordHash,
      role: "admin",
    },
  });
  console.log(`✅ Admin user: ${admin.name} (${admin.email})`);

  const engineer = await prisma.user.upsert({
    where: { email: "arjun@brickbasket.in" },
    update: {},
    create: {
      name: "Arjun Nair",
      email: "arjun@brickbasket.in",
      phone: "+91 97654 32100",
      passwordHash,
      role: "engineer",
    },
  });
  console.log(`✅ Engineer user: ${engineer.name} (${engineer.email})`);

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Vikram Patel",
      email: "customer@example.com",
      phone: "+91 99887 76655",
      passwordHash,
      role: "customer",
    },
  });
  console.log(`✅ Customer user: ${customer.name} (${customer.email})`);

  const contractor = await prisma.user.upsert({
    where: { email: "ravi@brickbasket.in" },
    update: {},
    create: {
      name: "Ravi Kumar",
      email: "ravi@brickbasket.in",
      phone: "+91 96543 21000",
      passwordHash,
      role: "contractor",
    },
  });
  console.log(`✅ Contractor user: ${contractor.name} (${contractor.email})`);

  // Additional customers for other projects
  const customerPriya = await prisma.user.upsert({
    where: { email: "priya@example.com" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 98765 11223",
      passwordHash,
      role: "customer",
    },
  });
  console.log(`✅ Customer user: ${customerPriya.name} (${customerPriya.email})`);

  const customerIrfan = await prisma.user.upsert({
    where: { email: "irfan@example.com" },
    update: {},
    create: {
      name: "Mohammed Irfan",
      email: "irfan@example.com",
      phone: "+91 98765 44556",
      passwordHash,
      role: "customer",
    },
  });
  console.log(`✅ Customer user: ${customerIrfan.name} (${customerIrfan.email})`);

  const customerFatima = await prisma.user.upsert({
    where: { email: "fatima@example.com" },
    update: {},
    create: {
      name: "Fatima Begum",
      email: "fatima@example.com",
      phone: "+91 98765 44444",
      passwordHash,
      role: "customer",
    },
  });
  console.log(`✅ Customer user: ${customerFatima.name} (${customerFatima.email})`);

  // ============================================
  // 3. Create Projects
  // ============================================

  // Clean existing data (so re-running seed is safe)
  await prisma.notification.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.paymentMilestone.deleteMany();
  await prisma.document.deleteMany();
  await prisma.progressUpdate.deleteMany();
  await prisma.projectMilestone.deleteMany();
  await prisma.project.deleteMany();
  console.log("\n🗑️  Cleared existing project data");

  // Project 1: Patel Residence
  const patelResidence = await prisma.project.create({
    data: {
      name: "Patel Residence",
      customerId: customer.id,
      staff: { connect: [{ id: engineer.id }] },
      siteAddress: "Plot 42, Sunrise Layout, Whitefield",
      city: "Bengaluru",
      plotSize: "2,400 sq.ft",
      builtUpArea: "1,800 sq.ft",
      startDate: new Date("2025-06-01"),
      expectedCompletion: new Date("2026-04-30"),
      currentStage: "walls",
      status: "in_progress",
      completionPercentage: 42,
      totalValue: 3780000,
      amountPaid: 1512000,
      planName: "Premium",
    },
  });
  console.log(`\n🏗️  Project: ${patelResidence.name}`);

  // Project 2: Sharma Villa
  const sharmaVilla = await prisma.project.create({
    data: {
      name: "Sharma Villa",
      customerId: customerPriya.id,
      staff: { connect: [{ id: contractor.id }] },
      siteAddress: "Plot 78, Green Valley, Jubilee Hills",
      city: "Hyderabad",
      plotSize: "3,000 sq.ft",
      builtUpArea: "2,400 sq.ft",
      startDate: new Date("2025-08-15"),
      expectedCompletion: new Date("2026-08-30"),
      currentStage: "foundation",
      status: "in_progress",
      completionPercentage: 18,
      totalValue: 5040000,
      amountPaid: 1008000,
      planName: "Premium Plus",
    },
  });
  console.log(`🏗️  Project: ${sharmaVilla.name}`);

  // Project 3: Irfan Residence
  const irfanResidence = await prisma.project.create({
    data: {
      name: "Irfan Residence",
      customerId: customerIrfan.id,
      staff: { connect: [{ id: engineer.id }] },
      siteAddress: "Plot 15, Lake View, Anna Nagar",
      city: "Chennai",
      plotSize: "1,800 sq.ft",
      builtUpArea: "1,400 sq.ft",
      startDate: new Date("2025-04-01"),
      expectedCompletion: new Date("2026-02-28"),
      currentStage: "electrical",
      status: "in_progress",
      completionPercentage: 78,
      totalValue: 2940000,
      amountPaid: 2352000,
      planName: "Standard",
    },
  });
  console.log(`🏗️  Project: ${irfanResidence.name}`);

  // Project 4: Begum Palace
  const begumPalace = await prisma.project.create({
    data: {
      name: "Begum Palace",
      customerId: customerFatima.id,
      // No engineer assigned yet
      siteAddress: "Plot 5, Palm Grove, Koramangala",
      city: "Bengaluru",
      plotSize: "4,000 sq.ft",
      builtUpArea: "3,200 sq.ft",
      startDate: new Date("2026-07-01"),
      expectedCompletion: new Date("2027-10-31"),
      currentStage: "planning",
      status: "not_started",
      completionPercentage: 0,
      totalValue: 8960000,
      amountPaid: 896000,
      planName: "Luxury",
    },
  });
  console.log(`🏗️  Project: ${begumPalace.name}`);

  // ============================================
  // 4. Project Milestones (9 for Patel Residence)
  // ============================================

  const milestones = await prisma.$transaction([
    prisma.projectMilestone.create({
      data: {
        projectId: patelResidence.id,
        stage: "planning",
        title: "Planning & Design",
        status: "completed",
        startDate: new Date("2025-06-01"),
        completedDate: new Date("2025-07-15"),
        description: "Design finalization and government approvals",
        photoCount: 12,
        notes: "All approvals obtained. Design finalized with client.",
      },
    }),
    prisma.projectMilestone.create({
      data: {
        projectId: patelResidence.id,
        stage: "foundation",
        title: "Foundation",
        status: "completed",
        startDate: new Date("2025-07-20"),
        completedDate: new Date("2025-09-10"),
        description: "Excavation and foundation laying",
        photoCount: 45,
        notes: "Foundation completed. Soil quality excellent.",
      },
    }),
    prisma.projectMilestone.create({
      data: {
        projectId: patelResidence.id,
        stage: "columns",
        title: "Columns & Beams",
        status: "completed",
        startDate: new Date("2025-09-15"),
        completedDate: new Date("2025-11-20"),
        description: "Structural framework erected",
        photoCount: 38,
        notes: "All columns and beams completed per structural plan.",
      },
    }),
    prisma.projectMilestone.create({
      data: {
        projectId: patelResidence.id,
        stage: "walls",
        title: "Walls",
        status: "in_progress",
        startDate: new Date("2025-11-25"),
        description: "Brick and block work in progress",
        photoCount: 22,
        notes: "Ground floor walls 80% complete. First floor starting soon.",
      },
    }),
    prisma.projectMilestone.create({
      data: {
        projectId: patelResidence.id,
        stage: "slab",
        title: "Roof Slab",
        status: "upcoming",
        description: "Roof slab casting",
        photoCount: 0,
      },
    }),
    prisma.projectMilestone.create({
      data: {
        projectId: patelResidence.id,
        stage: "plumbing",
        title: "Plumbing",
        status: "upcoming",
        description: "Water and drainage line installation",
        photoCount: 0,
      },
    }),
    prisma.projectMilestone.create({
      data: {
        projectId: patelResidence.id,
        stage: "electrical",
        title: "Electrical",
        status: "upcoming",
        description: "Wiring and electrical fixtures",
        photoCount: 0,
      },
    }),
    prisma.projectMilestone.create({
      data: {
        projectId: patelResidence.id,
        stage: "finishing",
        title: "Finishing",
        status: "upcoming",
        description: "Plastering, painting, and flooring",
        photoCount: 0,
      },
    }),
    prisma.projectMilestone.create({
      data: {
        projectId: patelResidence.id,
        stage: "handover",
        title: "Handover",
        status: "upcoming",
        description: "Final inspection and key handover",
        photoCount: 0,
      },
    }),
  ]);
  console.log(`\n📋 Created ${milestones.length} milestones for Patel Residence`);

  // ============================================
  // 5. Progress Updates (5 for Patel Residence)
  // ============================================

  const progressUpdates = await prisma.$transaction([
    prisma.progressUpdate.create({
      data: {
        projectId: patelResidence.id,
        uploadedById: engineer.id,
        title: "Ground floor wall work – East side completed",
        description:
          "Completed brick laying on the east wall of the ground floor. Mortar quality checked and approved. Window openings left as per design. Ready for lintel casting next week.",
        stage: "walls",
        completionPercentage: 42,
        photos: JSON.stringify([
          "/api/placeholder/800/600",
          "/api/placeholder/800/600",
          "/api/placeholder/800/600",
        ]),
        date: "2026-06-14",
        time: "17:30",
      },
    }),
    prisma.progressUpdate.create({
      data: {
        projectId: patelResidence.id,
        uploadedById: engineer.id,
        title: "Ground floor wall work – South side progress",
        description:
          "Started brick laying on south wall. Foundation alignment verified. Using Grade-A bricks as specified. 40% of south wall completed today.",
        stage: "walls",
        completionPercentage: 38,
        photos: JSON.stringify([
          "/api/placeholder/800/600",
          "/api/placeholder/800/600",
        ]),
        date: "2026-06-13",
        time: "18:00",
      },
    }),
    prisma.progressUpdate.create({
      data: {
        projectId: patelResidence.id,
        uploadedById: engineer.id,
        title: "Lintel preparation and steel binding",
        description:
          "Steel reinforcement bars cut and bent for lintel. Binding work started for ground floor lintels above windows and doors. TMT bars checked for quality certification.",
        stage: "walls",
        completionPercentage: 35,
        photos: JSON.stringify(["/api/placeholder/800/600"]),
        date: "2026-06-12",
        time: "16:45",
      },
    }),
    prisma.progressUpdate.create({
      data: {
        projectId: patelResidence.id,
        uploadedById: engineer.id,
        title: "North wall brick work completed",
        description:
          "Completed the north-facing wall of ground floor. Checked plumb line and horizontal levels — all within tolerance. Curing started.",
        stage: "walls",
        completionPercentage: 30,
        photos: JSON.stringify([
          "/api/placeholder/800/600",
          "/api/placeholder/800/600",
          "/api/placeholder/800/600",
          "/api/placeholder/800/600",
        ]),
        date: "2026-06-10",
        time: "17:15",
      },
    }),
    prisma.progressUpdate.create({
      data: {
        projectId: patelResidence.id,
        uploadedById: engineer.id,
        title: "Column casting completed successfully",
        description:
          "All 16 columns for ground floor have been successfully cast. M25 grade concrete used. Vibrator compaction done. Curing schedule — 7 days water curing started.",
        stage: "columns",
        completionPercentage: 25,
        photos: JSON.stringify([
          "/api/placeholder/800/600",
          "/api/placeholder/800/600",
        ]),
        date: "2025-11-18",
        time: "16:00",
      },
    }),
  ]);
  console.log(
    `📸 Created ${progressUpdates.length} progress updates for Patel Residence`
  );

  // ============================================
  // 6. Documents (8 for Patel Residence)
  // ============================================

  const documents = await prisma.$transaction([
    prisma.document.create({
      data: {
        projectId: patelResidence.id,
        name: "Construction Agreement",
        category: "agreement",
        fileType: "pdf",
        fileSize: "2.4 MB",
        uploadDate: "2025-06-01",
        uploadedBy: "Brick Basket Team",
        url: "#",
        isVisible: true,
      },
    }),
    prisma.document.create({
      data: {
        projectId: patelResidence.id,
        name: "Architectural Plan – Ground Floor",
        category: "plan",
        fileType: "pdf",
        fileSize: "5.1 MB",
        uploadDate: "2025-06-15",
        uploadedBy: "Design Team",
        url: "#",
        isVisible: true,
      },
    }),
    prisma.document.create({
      data: {
        projectId: patelResidence.id,
        name: "Structural Drawing",
        category: "plan",
        fileType: "dwg",
        fileSize: "8.3 MB",
        uploadDate: "2025-06-20",
        uploadedBy: "Design Team",
        url: "#",
        isVisible: true,
      },
    }),
    prisma.document.create({
      data: {
        projectId: patelResidence.id,
        name: "Building Permit",
        category: "government",
        fileType: "pdf",
        fileSize: "1.2 MB",
        uploadDate: "2025-07-10",
        uploadedBy: "Brick Basket Team",
        url: "#",
        isVisible: true,
      },
    }),
    prisma.document.create({
      data: {
        projectId: patelResidence.id,
        name: "Foundation Payment Receipt",
        category: "receipt",
        fileType: "pdf",
        fileSize: "0.8 MB",
        uploadDate: "2025-09-12",
        uploadedBy: "Accounts Team",
        url: "#",
        isVisible: true,
      },
    }),
    prisma.document.create({
      data: {
        projectId: patelResidence.id,
        name: "Material Quality Certificate",
        category: "certificate",
        fileType: "pdf",
        fileSize: "1.5 MB",
        uploadDate: "2025-10-05",
        uploadedBy: "Quality Team",
        url: "#",
        isVisible: true,
      },
    }),
    prisma.document.create({
      data: {
        projectId: patelResidence.id,
        name: "First Floor Plan",
        category: "plan",
        fileType: "pdf",
        fileSize: "4.8 MB",
        uploadDate: "2025-06-15",
        uploadedBy: "Design Team",
        url: "#",
        isVisible: true,
      },
    }),
    prisma.document.create({
      data: {
        projectId: patelResidence.id,
        name: "Soil Test Report",
        category: "certificate",
        fileType: "pdf",
        fileSize: "3.2 MB",
        uploadDate: "2025-06-25",
        uploadedBy: "Testing Lab",
        url: "#",
        isVisible: true,
      },
    }),
  ]);
  console.log(
    `📄 Created ${documents.length} documents for Patel Residence`
  );

  // ============================================
  // 7. Payment Milestones (8 for Patel Residence)
  // ============================================

  const payments = await prisma.$transaction([
    prisma.paymentMilestone.create({
      data: {
        projectId: patelResidence.id,
        name: "Booking & Design",
        amount: 378000,
        dueDate: "2025-06-01",
        paidDate: "2025-06-01",
        status: "paid",
        receiptUrl: "#",
        description: "10% — Agreement signing and design initiation",
      },
    }),
    prisma.paymentMilestone.create({
      data: {
        projectId: patelResidence.id,
        name: "Foundation Start",
        amount: 567000,
        dueDate: "2025-07-20",
        paidDate: "2025-07-18",
        status: "paid",
        receiptUrl: "#",
        description: "15% — Before foundation work begins",
      },
    }),
    prisma.paymentMilestone.create({
      data: {
        projectId: patelResidence.id,
        name: "Foundation Completion",
        amount: 567000,
        dueDate: "2025-09-15",
        paidDate: "2025-09-12",
        status: "paid",
        receiptUrl: "#",
        description: "15% — After foundation is completed and verified",
      },
    }),
    prisma.paymentMilestone.create({
      data: {
        projectId: patelResidence.id,
        name: "Column & Wall Stage",
        amount: 756000,
        dueDate: "2026-01-15",
        status: "pending",
        description: "20% — During structural and wall work",
      },
    }),
    prisma.paymentMilestone.create({
      data: {
        projectId: patelResidence.id,
        name: "Slab Completion",
        amount: 567000,
        dueDate: "2026-03-15",
        status: "pending",
        description: "15% — After roof slab is cast",
      },
    }),
    prisma.paymentMilestone.create({
      data: {
        projectId: patelResidence.id,
        name: "Electrical & Plumbing",
        amount: 378000,
        dueDate: "2026-05-15",
        status: "pending",
        description: "10% — During MEP work",
      },
    }),
    prisma.paymentMilestone.create({
      data: {
        projectId: patelResidence.id,
        name: "Finishing Work",
        amount: 378000,
        dueDate: "2026-07-15",
        status: "pending",
        description: "10% — Plastering, painting, flooring",
      },
    }),
    prisma.paymentMilestone.create({
      data: {
        projectId: patelResidence.id,
        name: "Final Handover",
        amount: 189000,
        dueDate: "2026-09-15",
        status: "pending",
        description: "5% — Upon final inspection and key handover",
      },
    }),
  ]);
  console.log(
    `💰 Created ${payments.length} payment milestones for Patel Residence`
  );

  // ============================================
  // 8. Leads (6 with various statuses)
  // ============================================

  const leads = await prisma.$transaction([
    prisma.lead.create({
      data: {
        name: "Suresh Menon",
        email: "suresh@email.com",
        phone: "+91 98765 11111",
        city: "Bengaluru",
        plotSize: "2,400 sq.ft",
        builtUpArea: "1,600 sq.ft",
        budgetRange: "₹40 – 60 Lakhs",
        homeType: "independent_house",
        servicesNeeded: JSON.stringify([
          "Construction Planning",
          "Site Supervision",
        ]),
        timeline: "Within 1 month",
        preferredContact: "phone",
        notes:
          "Wants Vastu-compliant design. Has existing plot in Whitefield.",
        status: "new",
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lakshmi Devi",
        email: "lakshmi@email.com",
        phone: "+91 98765 22222",
        city: "Hyderabad",
        plotSize: "3,000 sq.ft",
        builtUpArea: "2,200 sq.ft",
        budgetRange: "₹60 – 80 Lakhs",
        homeType: "duplex",
        servicesNeeded: JSON.stringify([
          "Construction Planning",
          "Design Consultation",
          "Progress Tracking",
        ]),
        timeline: "1 – 3 months",
        preferredContact: "whatsapp",
        notes:
          "NRI client based in Dubai. Needs complete remote management.",
        status: "contacted",
        assignedToId: admin.id,
        lastContactedAt: new Date("2026-06-13"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Arun Krishnan",
        email: "arun@email.com",
        phone: "+91 98765 33333",
        city: "Chennai",
        plotSize: "1,800 sq.ft",
        builtUpArea: "1,200 sq.ft",
        budgetRange: "₹20 – 40 Lakhs",
        homeType: "row_house",
        servicesNeeded: JSON.stringify(["Construction Planning"]),
        timeline: "3 – 6 months",
        preferredContact: "email",
        notes:
          "Looking for basic construction management. Budget-conscious.",
        status: "qualified",
        assignedToId: contractor.id,
        lastContactedAt: new Date("2026-06-12"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Fatima Begum",
        email: "fatima.lead@email.com",
        phone: "+91 98765 44444",
        city: "Bengaluru",
        plotSize: "4,000 sq.ft",
        builtUpArea: "3,200 sq.ft",
        budgetRange: "₹1 – 2 Crore",
        homeType: "villa",
        servicesNeeded: JSON.stringify([
          "Construction Planning",
          "Design Consultation",
          "Site Supervision",
          "Progress Tracking",
          "Material Coordination",
        ]),
        timeline: "Immediately",
        preferredContact: "phone",
        notes:
          "Premium client. Wants full-service villa construction with interior design.",
        status: "converted",
        assignedToId: admin.id,
        lastContactedAt: new Date("2026-06-08"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Deepak Joshi",
        email: "deepak@email.com",
        phone: "+91 98765 55555",
        city: "Pune",
        plotSize: "1,500 sq.ft",
        builtUpArea: "1,000 sq.ft",
        budgetRange: "Under ₹20 Lakhs",
        homeType: "independent_house",
        servicesNeeded: JSON.stringify(["Cost Estimation"]),
        timeline: "Just exploring",
        preferredContact: "email",
        notes: "Very early stage. Just wants a cost estimate.",
        status: "rejected",
        assignedToId: contractor.id,
        lastContactedAt: new Date("2026-06-03"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Kavitha Rajan",
        email: "kavitha@email.com",
        phone: "+91 98765 66666",
        city: "Bengaluru",
        plotSize: "2,000 sq.ft",
        builtUpArea: "1,500 sq.ft",
        budgetRange: "₹40 – 60 Lakhs",
        homeType: "independent_house",
        servicesNeeded: JSON.stringify([
          "Construction Planning",
          "Progress Tracking",
        ]),
        timeline: "Within 1 month",
        preferredContact: "whatsapp",
        notes: "Referred by Vikram Patel. Has approved house plan.",
        status: "new",
      },
    }),
  ]);
  console.log(`\n📞 Created ${leads.length} leads`);

  // ============================================
  // 9. Notifications (3 for the customer user)
  // ============================================

  const notifications = await prisma.$transaction([
    prisma.notification.create({
      data: {
        userId: customer.id,
        title: "New Progress Update",
        message:
          "Arjun uploaded new progress for Patel Residence — Wall work",
        type: "info",
        read: false,
        link: "/progress",
      },
    }),
    prisma.notification.create({
      data: {
        userId: customer.id,
        title: "Payment Due Soon",
        message:
          "Column & Wall Stage payment of ₹7,56,000 is due on Jan 15",
        type: "warning",
        read: false,
        link: "/payments",
      },
    }),
    prisma.notification.create({
      data: {
        userId: customer.id,
        title: "Document Uploaded",
        message:
          "Material Quality Certificate has been uploaded to your project",
        type: "success",
        read: true,
        link: "/documents",
      },
    }),
  ]);
  console.log(`🔔 Created ${notifications.length} notifications`);

  // ============================================
  // Summary
  // ============================================
  console.log("\n" + "=".repeat(50));
  console.log("🎉 Seed completed successfully!");
  console.log("=".repeat(50));
  console.log("\nDemo Login Credentials (password: demo123):");
  console.log(`  Admin:      admin@brickbasket.in`);
  console.log(`  Engineer:   arjun@brickbasket.in`);
  console.log(`  Customer:   customer@example.com`);
  console.log(`  Contractor: ravi@brickbasket.in`);
  console.log("");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
