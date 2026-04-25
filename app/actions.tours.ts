"use server";

import { db } from "@/lib/prisma";

function getApiUrl() {
  return process.env.GUIDE_API_URL || "https://pguia.onrender.com";
}

export async function getFeaturedGuides() {
  try {
    return await db.guideProfile.findMany({
      where: {
        AND: [
          { status: "APPROVED" },
          { plan: { in: ["pro", "ultimate"] } }
        ]
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching featured guides:", error);
    return [];
  }
}

export async function getPublicPackage(id: string) {
  try {
    const res = await fetch(`${getApiUrl()}/api/public/packages/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching package:", error);
    return null;
  }
}

export async function getPublicPackages() {
  try {
    const res = await fetch(`${getApiUrl()}/api/public/packages?limit=50`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}

export async function getPremiumPackages() {
  try {
    const pkgs = await getPublicPackages();
    return pkgs.filter((p: any) => p.status === "PREMIUM").slice(0, 10);
  } catch (error) {
    console.error("Error fetching premium packages:", error);
    return [];
  }
}

export async function getFeaturedCities() {
  try {
    const res = await fetch(`https://adminguide.onrender.com/api/admin/cities/featured`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching featured cities:", error);
    return [];
  }
}

