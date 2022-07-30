import { PrismaClient as ProdPrismaClient } from "@prisma/client/edge"
import { PrismaClient as DevPrismaClient } from "@prisma/client"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: ProdPrismaClient | DevPrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new ProdPrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new DevPrismaClient()
  }
  prisma = global.prisma
}

export default prisma
