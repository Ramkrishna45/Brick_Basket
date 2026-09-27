import { prisma } from '@/lib/db';

export async function auditLog(userId: string, action: string, entityType: string, entityId: string, details?: any) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        details: details ? JSON.stringify(details) : undefined
      }
    });
  } catch (e) {
    console.warn('Failed to write audit log', e);
  }
}

