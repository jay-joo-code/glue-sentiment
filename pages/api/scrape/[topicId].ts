import getAverageReviewStars from "util/getAverageReviewStars"
import axios from "axios"
import prisma from "lib/glue/prisma"
import type { NextApiRequest, NextApiResponse } from "next"
import { fetchRedditComments } from "util/scrapeReddit"

const fetchSentiment = async ({ content }) => {
  const URL = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${process.env.GOOGLE_API_KEY}`
  const { data } = await axios.post(URL, {
    document: {
      content,
      type: "PLAIN_TEXT",
    },
    encodingType: "UTF32",
  })

  return data
}

const scoreToStars = (score: number) => {
  const stars = ((score + 1) / 2) * 5
  const roundedStars = Math.round(stars)

  if (roundedStars === 0) return 1
  return roundedStars
}

const saveData = async (dataArray: any, topicId: number) => {
  const allReviews = []

  for (var i = 0; i < dataArray.length; i++) {
    await new Promise<void>(async (next) => {
      const data = dataArray[i]
      const reviewData = {
        createdAt: data?.createdAt,
        upvotes: data?.ups,
        content: data?.body,

        stars: data?.stars,

        provider: "reddit",
        providerId: data?.id,
        providerData: data,

        topicId,
      }

      allReviews.push(reviewData)

      const existingReview = await prisma.review.findFirst({
        where: {
          providerId: reviewData?.providerId,
        },
      })

      if (!existingReview) {
        // NOTE: didn't think updating existing would be necessary

        const { documentSentiment } = await fetchSentiment({
          content: reviewData?.content,
        })
        reviewData.providerData.sentimentScore = documentSentiment?.score
        reviewData.stars = scoreToStars(documentSentiment?.score)

        await prisma.review.create({
          data: reviewData,
        })
      }

      next()
    })
  }

  return allReviews
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      if (!req?.query?.topicId) {
        return res.status(400).send({ message: "No topic id provided" })
      }

      const topic = await prisma.topic.findFirst({
        where: {
          id: Number(req?.query?.topicId),
        },
        include: {
          category: true,
        },
      })

      // TODO: fetch for all aliases, and merge without duplicates
      const rawData = await fetchRedditComments({
        query: topic?.name,
        variant: "course",
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      })

      const reviews = await saveData(rawData, topic?.id)
      const allReviews = await prisma.review.findMany({
        where: {
          topicId: Number(req?.query?.topicId),
        },
      })
      const newTopicStars = getAverageReviewStars(allReviews)
      await prisma.topic.update({
        where: {
          id: Number(req?.query?.topicId),
        },
        data: {
          isInitialized: true,
          stars: newTopicStars,
        },
      })

      res.json({ reviews })
      break

    default:
      break
  }
}
