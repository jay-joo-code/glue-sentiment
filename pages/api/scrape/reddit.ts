import type { NextApiRequest, NextApiResponse } from "next"
import { fetchRedditComments } from "util/scrape"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      if (!req?.query?.query) {
        return res
          .status(400)
          .send({ message: "Enter a keyword to start the sentiment analysis" })
      }

      const comments = await fetchRedditComments({
        query: req?.query?.query as string,
        variant: "course",
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      })

      res.json({ comments })
      break

    default:
      break
  }
}
