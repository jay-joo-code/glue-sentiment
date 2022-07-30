import prisma from "lib/glue/prisma"

const crudEndpoints = {
  "entry-logs": { model: prisma.entryLog },
}

export default crudEndpoints
