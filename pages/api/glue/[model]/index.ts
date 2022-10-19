import { withSentry } from "@sentry/nextjs"
import crudEndpoints from "constants/crudEndpoints"
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import parseQuery from "util/glue/parseQuery"
import qs from "qs"

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const queryString = req?.url?.split("?")[1]
  const { parseConfig } = qs.parse(queryString) as any
  const query = parseQuery(queryString, {
    parseNumbers: parseConfig?.parseNumbers !== "false",
    parseBooleans: parseConfig?.parseBooleans !== "false",
  })
  const model = crudEndpoints[req?.query?.model as string]?.model

  delete query?.model
  delete query?.parseConfig

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
        orderBy: {
          // TODO: not working
          updatedAt: "asc",
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
            userId: session?.user?.id,
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
