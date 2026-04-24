"use server";

import { db } from "@/lib/prisma";
import { getUserSession } from "@/app/actions.auth";

export async function getGuideProfile() {
  const user = await getUserSession();
  if (!user) return { error: "Não autenticado" };

  try {
    let profile = await db.guideProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile && user.role === "guide") {
      profile = await db.guideProfile.create({
        data: {
          userId: user.id,
          status: "APPROVED", // Auto-approve if they already have the role somehow
        },
      });
    }

    return { profile, user };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function registerAsGuide(data: { bio: string; languages: string[]; pixKey?: string }) {
  const user = await getUserSession();
  if (!user) throw new Error("Não autenticado");

  const existing = await db.guideProfile.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    return await db.guideProfile.update({
      where: { userId: user.id },
      data,
    });
  }

  const profile = await db.guideProfile.create({
    data: {
      userId: user.id,
      bio: data.bio,
      languages: data.languages,
      pixKey: data.pixKey,
      status: "PENDING",
    },
  });

  return profile;
}
