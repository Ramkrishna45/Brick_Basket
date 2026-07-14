"use server";

import { auth } from "@/lib/auth";
import * as adminService from "@/lib/services/admin.service";

export async function getAdminStatsAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await adminService.getAdminStats((session.user as any).role || "");
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch admin stats." };
  }
}

export async function getStaffAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const data = await adminService.getStaffList((session.user as any).role || "");
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch staff." };
  }
}
