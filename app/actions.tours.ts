"use server";

import { db } from "@/lib/prisma";

export async function getPublicPackage(id: string) {
  return await db.tourPackage.findUnique({
    where: { id, status: "PUBLISHED" },
    include: {
      guide: {
        include: { user: true }
      },
      routes: {
        include: {
          places: {
            include: { place: true }
          }
        }
      },
      _count: { select: { reviews: true } }
    }
  });
}
export async function getPublicPackages() {
  return await db.tourPackage.findMany({
    where: { status: "PUBLISHED" },
    include: {
      guide: {
        include: { user: true }
      },
      routes: {
        include: {
          places: {
            include: { place: true }
          }
        }
      },
      _count: { select: { reviews: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });
}
