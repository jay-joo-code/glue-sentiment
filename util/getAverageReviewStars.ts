import { Review } from "@prisma/client"

const getAverageReviewStars = (reviews: Review[]) => {
  if (reviews?.length === 0) return 0
  const stars = reviews?.map((review) => review?.stars)
  const average = stars.reduce((a, b) => a + b, 0) / stars.length
  return average
}

export default getAverageReviewStars
