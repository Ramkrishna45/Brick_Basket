"use server";

import { auth } from "@/lib/auth";
import * as staffService from "@/lib/services/staff.service";

export async function getAllStaffAction() {
  try {
    const session = await auth();
    if (!session) return { error: "Forbidden" };

    const staff = await staffService.getAllStaff((session.user as any).role || "");
    return { success: true, data: staff };
  } catch (error: any) {
    console.error("Failed to fetch staff:", error);
    return { error: error.message || "Failed to fetch staff members." };
  }
}

export async function createStaffAction(data: { name: string; email: string; phone: string; role: string }) {
  try {
    const session = await auth();
    if (!session) return { error: "Forbidden" };

    const result = await staffService.createStaff((session.user as any).role || "", data);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to create staff:", error);
    return { error: error.message || "Failed to create staff member." };
  }
}

export async function updateStaffAction(id: string, data: { name: string; phone: string; role: string }) {
  try {
    const session = await auth();
    if (!session) return { error: "Forbidden" };

    await staffService.updateStaff((session.user as any).role || "", id, data);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update staff:", error);
    return { error: error.message || "Failed to update staff member." };
  }
}

export async function deleteStaffAction(id: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Forbidden" };

    await staffService.deleteStaff((session.user as any).role || "", id);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete staff:", error);
    return { error: error.message || "Failed to delete staff member." };
  }
}
