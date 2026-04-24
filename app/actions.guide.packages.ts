"use server";

import { db } from "@/lib/prisma";
import { getUserSession } from "@/app/actions.auth";

export async function getGuidePackages() {
  const user = await getUserSession();
  if (!user) throw new Error("Não autenticado");

  const profile = await db.guideProfile.findUnique({ where: { userId: user.id }});
  if (!profile) throw new Error("Perfil de guia não encontrado");

  return await db.tourPackage.findMany({
    where: { guideId: profile.id },
    include: {
      routes: true,
      _count: { select: { reservations: true } }
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createTourPackage(data: { title: string, price: number }) {
  const user = await getUserSession();
  if (!user) throw new Error("Não autenticado");

  const profile = await db.guideProfile.findUnique({ where: { userId: user.id }});
  if (!profile) throw new Error("Perfil de guia não encontrado");

  return await db.tourPackage.create({
    data: {
      guideId: profile.id,
      title: data.title,
      price: data.price,
      status: "DRAFT"
    }
  });
}
