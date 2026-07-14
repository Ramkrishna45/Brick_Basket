import { prisma } from "@/lib/db";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";

// ── Zod Schemas ─────────────────────────────────────────────────────

const enquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  city: z.string().min(2),
  plotSize: z.string().optional(),
  builtUpArea: z.string().optional(),
  budgetRange: z.string().optional(),
  homeType: z.string().optional(),
  servicesNeeded: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  preferredContact: z.string().optional(),
  notes: z.string().optional(),
});

// ── Public: Submit Enquiry ──────────────────────────────────────────

export async function submitEnquiry(
  formData: z.infer<typeof enquirySchema>
) {
  const parsed = enquirySchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error("Invalid data. Please check your inputs.");
  }

  const email = parsed.data.email.toLowerCase();

  const lead = await prisma.lead.create({
    data: {
      name: parsed.data.name,
      email,
      phone: parsed.data.phone,
      city: parsed.data.city,
      plotSize: parsed.data.plotSize ?? null,
      builtUpArea: parsed.data.builtUpArea ?? null,
      budgetRange: parsed.data.budgetRange ?? null,
      homeType: parsed.data.homeType ?? null,
      servicesNeeded: JSON.stringify(parsed.data.servicesNeeded ?? []),
      timeline: parsed.data.timeline ?? null,
      preferredContact: parsed.data.preferredContact ?? "phone",
      notes: parsed.data.notes ?? null,
      status: "new",
    },
  });

  // Notify Admin
  await sendEmail({
    to: "tripathiramkrishna16@gmail.com",
    subject: `New Enquiry from ${lead.name}`,
    html: `
      <h2>New Enquiry Received!</h2>
      <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td><strong>Name:</strong></td><td>${lead.name}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${lead.email}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${lead.phone}</td></tr>
        <tr><td><strong>City/Location:</strong></td><td>${lead.city}</td></tr>
        <tr><td><strong>Plot Size:</strong></td><td>${lead.plotSize || "N/A"}</td></tr>
        <tr><td><strong>Built-up Area:</strong></td><td>${lead.builtUpArea || "N/A"}</td></tr>
        <tr><td><strong>Budget Range:</strong></td><td>${lead.budgetRange || "N/A"}</td></tr>
        <tr><td><strong>Type of Home:</strong></td><td>${(lead.homeType || "N/A").replace(/_/g, ' ')}</td></tr>
        <tr><td><strong>Timeline:</strong></td><td>${lead.timeline || "N/A"}</td></tr>
        <tr><td><strong>Services Needed:</strong></td><td>${JSON.parse(lead.servicesNeeded || "[]").join(', ') || "N/A"}</td></tr>
        <tr><td><strong>Preferred Contact:</strong></td><td>${lead.preferredContact}</td></tr>
        <tr><td><strong>Notes:</strong></td><td>${lead.notes || "None"}</td></tr>
      </table>
      <br/>
      <p>Log in to the Admin Dashboard to view more details and convert this lead.</p>
    `,
  });

  return { id: lead.id };
}

// ── Admin: Get Leads ────────────────────────────────────────────────

export async function getLeads(
  userRole: string,
  status?: string,
  search?: string
) {
  if (userRole !== "admin") throw new Error("Forbidden");

  const where: Record<string, unknown> = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { city: { contains: search } },
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    include: {
      assignedTo: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return leads.map((lead) => ({
    ...lead,
    servicesNeeded: JSON.parse(lead.servicesNeeded) as string[],
    createdAt: lead.createdAt.toISOString(),
    lastContactedAt: lead.lastContactedAt?.toISOString() ?? null,
  }));
}

// ── Admin: Update Lead Status ───────────────────────────────────────

export async function updateLeadStatus(
  userRole: string,
  id: string,
  status: string
) {
  if (userRole !== "admin") throw new Error("Forbidden");

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      status,
      lastContactedAt: new Date(),
    },
  });

  return { id: lead.id, status: lead.status };
}

// ── Admin: Assign Lead ──────────────────────────────────────────────

export async function assignLead(
  userRole: string,
  id: string,
  userId: string
) {
  if (userRole !== "admin") throw new Error("Forbidden");

  const lead = await prisma.lead.update({
    where: { id },
    data: { assignedToId: userId },
    include: {
      assignedTo: { select: { id: true, name: true } },
    },
  });

  return { id: lead.id, assignedTo: lead.assignedTo };
}

// ── Customer: Get My Enquiries ──────────────────────────────────────

export async function getMyEnquiries(userEmail: string) {
  if (!userEmail) throw new Error("Unauthorized");

  const leads = await prisma.lead.findMany({
    where: { email: userEmail },
    orderBy: { createdAt: "desc" },
  });

  return leads.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    lastContactedAt: l.lastContactedAt?.toISOString() ?? null,
  }));
}
