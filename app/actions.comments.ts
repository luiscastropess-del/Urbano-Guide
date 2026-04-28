"use server";

import { db } from "@/lib/prisma";
import { getUserSession } from "@/app/actions.auth";
import { revalidatePath } from "next/cache";

export async function getComments({ placeId, cityId, guideId }: { placeId?: string, cityId?: string, guideId?: string }) {
  const where: any = {};
  if (placeId) where.placeId = placeId;
  if (cityId) where.cityId = cityId;
  if (guideId) where.guideId = guideId;

  return await db.comment.findMany({
    where,
    include: {
        user: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function addComment({ placeId, cityId, guideId, text, rating }: { 
    placeId?: string, 
    cityId?: string, 
    guideId?: string, 
    text: string, 
    rating: number 
}) {
  const session = await getUserSession();
  if (!session) throw new Error('Auth required');

  const commentData: any = {
    userId: session.id,
    text,
    rating
  };
  
  if (placeId) commentData.placeId = placeId;
  if (cityId) commentData.cityId = cityId;
  if (guideId) commentData.guideId = guideId;
  
  const comment = await db.comment.create({ data: commentData });
  
  let path = '/';
  if (placeId) path = `/place/${placeId}`;
  else if (cityId) path = `/cidades/${cityId}`;
  else if (guideId) path = `/guias/${guideId}`;

  revalidatePath(path);
  return comment;
}
