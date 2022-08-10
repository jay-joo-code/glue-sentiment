import { Review } from "@prisma/client"

const getAverageReviewStars = (reviews: Review[]) => {
  const stars = reviews?.map((review) => review?.stars)
  const average = stars.reduce((a, b) => a + b) / stars.length
  const roundAvg = Math.round(average * 2) / 2
  return roundAvg
}

export default getAverageReviewStars
