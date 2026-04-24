"use server";

import { db } from "@/lib/prisma";
import { getUserSession } from "@/app/actions.auth";

export async function getGuides() {
  const user = await getUserSession();
  if (!user || user.role !== "admin") throw new Error("Acesso negado");

  return await db.guideProfile.findMany({
    include: {
      user: true,
      _count: {
        select: { routes: true, packages: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateGuideStatus(profileId: string, status: string, commissionRate?: number) {
  const user = await getUserSession();
  if (!user || user.role !== "admin") throw new Error("Acesso negado");

  const data: any = { status };
  if (commissionRate !== undefined) {
    data.commissionRate = commissionRate;
  }

  // Update profile
  const profile = await db.guideProfile.update({
    where: { id: profileId },
    data
  });

  // If approved, ensure user has guide role
  if (status === "APPROVED") {
     await db.user.update({
       where: { id: profile.userId },
       data: { role: "guide" }
     });
  } else if (status === "BLOCKED" || status === "REJECTED") {
     // Optional: downgrade role to user if they are blocked
     const existingUser = await db.user.findUnique({ where: { id: profile.userId }});
     if (existingUser?.role === "guide") {
        await db.user.update({
           where: { id: profile.userId },
           data: { role: "user" }
        });
     }
  }

  return profile;
}
