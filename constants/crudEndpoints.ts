import prisma from "lib/glue/prisma"

// NOTE: don't combine crudEndpoints with appConfig
// because importing appConfig will always import prisma client
// and could slow down SSR

const crudEndpoints = {
  topics: { model: prisma.topic },
  categories: { model: prisma.category },
  reviews: { model: prisma.review },
}

export default crudEndpoints
