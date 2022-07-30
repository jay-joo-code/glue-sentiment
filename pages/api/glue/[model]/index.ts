import { withSentry } from "@sentry/nextjs"
import crudEndpoints from "constants/crudEndpoints"
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import qs from "qs"

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const query = qs.parse(req?.url?.split("?")[1])
  const model = crudEndpoints[req?.query?.model as string]?.model
  delete query?.model

  switch (req.method) {
    case "GET":
      const skip =
        query?.page && query?.limit
          ? Number(query?.page) * Number(query?.limit)
          : undefined
      const take = query?.limit ? Number(query?.limit) : undefined

      delete query?.page
      delete query?.limit

      const docs = await model.findMany({
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        skip,
        take,
        ...query,
      })

      res.send(docs)
      break

    case "POST":
      const sessionData = session
        ? {
            user: { connect: { email: session?.user?.email } },
          }
        : {}

      const doc = await model.create({
        data: {
          ...req?.body,
          ...sessionData,
        },
      })

      res.send(doc)
      break

    default:
      res.status(500).send("Invalid http method")
      break
  }
  return res.end()
}

export default withSentry(handle)
