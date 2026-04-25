"use server";

import { db } from "@/lib/prisma";
import { getUserSession } from "./actions.auth";

export async function createReservation({
  packageId,
  date,
  guests,
  notes,
}: {
  packageId: string;
  date: string;
  guests: number;
  notes?: string;
}) {
  const user = await getUserSession();
  if (!user) throw new Error("Unauthorized");

  const apiUrl = process.env.GUIDE_API_URL || "https://pguia.onrender.com";

  const res = await fetch(`${apiUrl}/api/public/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      packageId,
      date: new Date(date).toISOString(),
      guests,
      notes,
      customerName: user.name,
      customerEmail: user.email
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to create reservation");
  }

  return await res.json();
}

export async function getCustomerReservations() {
  const user = await getUserSession();
  if (!user) throw new Error("Unauthorized");

  const apiUrl = process.env.GUIDE_API_URL || "https://pguia.onrender.com";
  try {
     const res = await fetch(`${apiUrl}/api/public/reservations?email=${encodeURIComponent(user.email)}`, { cache: "no-store" });
     if(res.ok) {
       return await res.json();
     }
  } catch(e) {
     console.error("Could not fetch remote customer reservations", e);
  }
  return [];
}


export async function cancelReservation(id: string) {
  const user = await getUserSession();
  if (!user) throw new Error("Unauthorized");

  throw new Error("Cannot cancel remote reservations from client via local DB.");
}

