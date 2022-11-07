import { withSentry } from "@sentry/nextjs"
import crudEndpoints from "constants/crudEndpoints"
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import parseQuery from "util/glue/parseQuery"
import qs from "qs"

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const model = crudEndpoints[req?.query?.model as string]?.model

  // TODO: conditional authorization (if object has a connected User)
  // if (!session) {
  //   res.status(401).send({ message: "Unauthorized" })
  //   return
  // }

  if (!req?.query?.id) {
    res.status(400).send({ message: "Invalid request: No id specified" })
    return
  }

  switch (req.method) {
    case "GET": {
      const queryString = req?.url?.split("?")[1]
      const { parseConfig } = qs.parse(queryString) as any
      const query = parseQuery(queryString, {
        parseNumbers: parseConfig?.parseNumbers !== "false",
        parseBooleans: parseConfig?.parseBooleans !== "false",
      })

      delete query?.model
      delete query?.parseConfig

      const prismaQuery = {
        ...query,
        where: {
          ...(query?.where as any),
          id: Number(req?.query?.id),
        },
      }

      const result = await model.findUnique(prismaQuery)
      res.json(result)
      break
    }

    case "PUT": {
      const data = { ...req?.body }
      delete data.id
      delete data.createdAt
      delete data.updatedAt
      delete data.userId

      try {
        const result = await model.update({
          where: { id: Number(req?.query?.id) },
          data,
        })
        res.json(result)
      } catch (error) {
        if (error?.meta?.cause === "Record to update not found.") {
          res.json(data)
        } else {
          throw error
        }
      }
      break
    }

    case "DELETE": {
      try {
        const result = await model.delete({
          where: { id: Number(req?.query?.id) },
        })
        res.json(result)
      } catch (error) {
        if (error?.code === "P2025") {
          res.status(400).send({ message: error?.meta?.cause })
        } else {
          res.status(500).send(error)
        }
      }
      break
    }

    default:
      break
  }
  return res.end()
}

export default withSentry(handle)
