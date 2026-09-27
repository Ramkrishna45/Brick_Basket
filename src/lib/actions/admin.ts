"use server";

import { auth } from "@/lib/auth";
import * as adminService from "@/lib/services/admin.service";

export async function getDashboardStatsAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await adminService.getDashboardStats();
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch dashboard stats:", error);
    return { error: error.message || "Failed to fetch stats." };
  }
}
