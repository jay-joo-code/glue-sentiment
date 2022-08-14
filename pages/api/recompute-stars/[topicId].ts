import prisma from "lib/glue/prisma"
import type { NextApiRequest, NextApiResponse } from "next"
import getAverageReviewStars from "util/getAverageReviewStars"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req?.query?.topicId) {
    res.status(400).send({ message: "Invalid request: No id specified" })
    return
  }

  switch (req.method) {
    case "POST": {
      const topicId = Number(req?.query?.topicId)
      const allReviews = await prisma.review.findMany({
        where: {
          topicId,
        },
      })
      const newStars = getAverageReviewStars(allReviews)
      const topic = await prisma.topic.update({
        where: {
          id: topicId,
        },
        data: {
          stars: newStars,
        },
      })
      res.json(topic)
      break
    }

    default:
      break
  }
  return res.end()
}
