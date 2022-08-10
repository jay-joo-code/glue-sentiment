import { Container, Space, Stack, Title } from "@mantine/core"
import { Category, Review, Topic } from "@prisma/client"
import api from "lib/glue/api"
import React from "react"
import useSWRImmutable from "swr/immutable"
import ReviewItem from "./ReviewItem"

interface IRecentReviewsProps {
  categoryId?: number
}

const RecentReviews = ({ categoryId }: IRecentReviewsProps) => {
  const { data: reviews, mutate } = useSWRImmutable([
    "/glue/reviews",
    {
      where: {
        topic: {
          categoryId,
        },
      },
      include: {
        topic: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      limit: 5,
      page: 0,
    },
  ])

  const onUpvoteToggle = (reviewId: number, newUpvotes: number) => {
    const newReviews = reviews?.map((review) => {
      if (review?.id === reviewId) {
        return {
          ...review,
          upvotes: newUpvotes,
        }
      }
      return review
    })
    mutate(
      async () => {
        await api.put(`/glue/reviews/${reviewId}`, {
          upvotes: newUpvotes,
        })
        return newReviews
      },
      {
        optimisticData: newReviews,
        rollbackOnError: true,
        revalidate: false,
      }
    )
  }

  return (
    <Container>
      <Title order={2} mb="lg">
        Recent reviews
      </Title>
      <Stack>
        {reviews?.map((review) => (
          <ReviewItem
            key={review?.id}
            review={review}
            onUpvoteToggle={onUpvoteToggle}
            renderTopic={true}
          />
        ))}
      </Stack>
    </Container>
  )
}

export default RecentReviews
