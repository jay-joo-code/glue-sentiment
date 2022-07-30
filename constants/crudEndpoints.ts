import prisma from "lib/glue/prisma"

const crudEndpoints = {
  topics: { model: prisma.topic },
  categories: { model: prisma.category },
  reviews: { model: prisma.review },
}

export default crudEndpoints
