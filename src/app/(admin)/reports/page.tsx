import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Users, Building2, TrendingUp, IndianRupee, Activity, CheckCircle2 } from "lucide-react";
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

// Make this a server component
export default async function ReportsPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    redirect("/login");
  }

  // 1. Projects Breakdown
  const totalProjects = await prisma.project.count();
  const completedProjects = await prisma.project.count({ where: { status: "completed" } });
  const inProgressProjects = await prisma.project.count({ where: { status: "in_progress" } });
  const notStartedProjects = await prisma.project.count({ where: { status: "not_started" } });

  // 2. Financials
  const projects = await prisma.project.findMany({
    select: { totalValue: true, amountPaid: true }
  });
  const totalRevenueExpected = projects.reduce((sum, p) => sum + (p.totalValue || 0), 0);
  const totalRevenueCollected = projects.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
  const outstandingRevenue = totalRevenueExpected - totalRevenueCollected;

  // 3. Leads Data
  const totalLeads = await prisma.lead.count();
  const convertedLeads = await prisma.lead.count({ where: { status: "converted" } });
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0.0";

  // 4. Staff Workload
  const staffMembers = await prisma.user.findMany({
    where: { role: { in: ["engineer", "contractor"] } },
    include: {
      assignedProjects: {
        where: { status: { notIn: ["completed", "cancelled"] } }
      }
    }
  });

  const staffWorkload = staffMembers.map(staff => ({
    name: staff.name,
    role: staff.role,
    activeProjects: staff.assignedProjects.length
  })).sort((a, b) => b.activeProjects - a.activeProjects);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Detailed overview of business performance</p>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalRevenueExpected)}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Collected</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalRevenueCollected)}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Projects</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{inProgressProjects}</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Lead Conversion</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{conversionRate}%</h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-500" />
              Project Portfolio Status
            </CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Total Projects</span>
                <span className="text-xl font-bold">{totalProjects}</span>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>In Progress</span>
                  </div>
                  <span className="font-medium">{inProgressProjects}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Completed</span>
                  </div>
                  <span className="font-medium">{completedProjects}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <span>Not Started</span>
                  </div>
                  <span className="font-medium">{notStartedProjects}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Workload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" />
              Staff Workload
            </CardTitle>
            <CardDescription>Active projects per engineer/contractor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staffWorkload.length === 0 ? (
                <p className="text-center text-slate-500 py-4">No staff members found.</p>
              ) : (
                staffWorkload.map((staff, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{staff.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{staff.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Active:</span>
                      <span className="bg-slate-100 text-slate-900 font-bold px-3 py-1 rounded-full text-sm">
                        {staff.activeProjects}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
