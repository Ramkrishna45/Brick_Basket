"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import * as projectService from "@/lib/services/project.service";

export async function getMyProjectAction() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "Unauthorized" };

    const project = await projectService.getMyProject(session.user.id);
    return { success: true, data: project };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch project." };
  }
}

export async function getMyProjectsAction() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "Unauthorized" };

    const projects = await projectService.getMyProjects(session.user.id);
    return { success: true, data: projects };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch projects." };
  }
}

export async function getMyEnquiriesAction() {
  try {
    const session = await auth();
    if (!session || !session.user?.email) return { error: "Unauthorized" };

    const leads = await projectService.getMyEnquiries(session.user.email);
    return { success: true, data: leads };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch enquiries." };
  }
}

export async function getAllProjectsAction() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") return { error: "Forbidden" };

    const projects = await projectService.getAllProjects();
    return { success: true, data: projects };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch projects." };
  }
}

export async function createProjectAction(data: any) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") return { error: "Unauthorized" };

    const result = await projectService.createProject(data);
    
    if (data.leadId) {
      revalidatePath("/admin/leads");
    }
    revalidatePath("/admin/projects");
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Create project error:", error);
    return { error: error.message || "Failed to create project." };
  }
}

export async function updateProjectAction(id: string, data: any) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") return { error: "Forbidden" };

    const result = await projectService.updateProject(id, data);
    
    revalidatePath("/admin/projects");
    revalidatePath("/staff/dashboard");
    revalidatePath("/staff/progress");
    revalidatePath("/staff/documents");
    
    return { success: true, data: result };
  } catch (error: any) {
    return { error: error.message || "Failed to update project." };
  }
}

export async function getProjectByIdAction(id: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    const project = await projectService.getProjectById(id);
    if (!project) return { error: "Project not found" };

    return { success: true, data: project };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch project." };
  }
}
