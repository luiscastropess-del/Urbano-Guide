import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  let url = process.env.DATABASE_URL || '';
  if (url.includes('postgresql://') && url.lastIndexOf('postgresql://') > 0) {
    url = url.substring(0, url.lastIndexOf('postgresql://'));
  }

  return new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const db = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
