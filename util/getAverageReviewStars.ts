import { Review } from "@prisma/client"

const getAverageReviewStars = (reviews: Review[]) => {
  const stars = reviews?.map((review) => review?.stars)
  const average = stars.reduce((a, b) => a + b) / stars.length
  return average
}

export default getAverageReviewStars
