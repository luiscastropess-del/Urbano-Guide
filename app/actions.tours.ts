"use server";

import { db } from "@/lib/prisma";

export async function getRouteUrl(name: string, fallbackUrl: string) {
  try {
    const route = await db.apiRoute.findUnique({ where: { name } });
    if (route && route.isActive) {
      return route.url;
    }
  } catch (error) {
    console.error(`Error looking up route ${name}:`, error);
  }
  return fallbackUrl;
}

function getApiUrl() {
  return process.env.GUIDE_API_URL || "https://pguia.onrender.com";
}

export async function getFeaturedGuides() {
  try {
    const baseFallback = `${getApiUrl()}/api/public/guides/featured`;
    const url = await getRouteUrl("GUIDES_API", baseFallback);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      // Fallback for when the API is not yet available
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
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching featured guides:", error);
    return [];
  }
}

export async function getPublicPackage(id: string) {
  try {
    const baseFallback = `${getApiUrl()}/api/public/packages/{id}`;
    let url = await getRouteUrl("DETALHES_PACOTE_ESPECIFICADO_API", baseFallback);
    if (url.includes("{id}")) {
      url = url.replace("{id}", id);
    } else if (url.includes("[id]")) {
      url = url.replace("[id]", id);
    } else {
      url = url.endsWith("/") ? url + id : url + "/" + id;
    }
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching package:", error);
    return null;
  }
}

export async function getPublicPackages() {
  try {
    const baseFallback = `${getApiUrl()}/api/public/packages?limit=50`;
    const url = await getRouteUrl("PACOTES_GERAIS_API", baseFallback);
    const res = await fetch(url, { cache: "no-store" });
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

