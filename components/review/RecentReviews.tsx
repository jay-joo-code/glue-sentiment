import { Container, Stack, Title } from "@mantine/core"
import useGlueQuery from "hooks/glue/useGlueQuery"
import api from "lib/glue/api"
import ReviewItem from "./ReviewItem"
import InfiniteScrollComponent from "react-infinite-scroll-component"

interface IRecentReviewsProps {
  categoryId?: number
}

const RecentReviews = ({ categoryId }: IRecentReviewsProps) => {
  const { data: reviews, mutate } = useGlueQuery({
    url: "/glue/reviews",
    args: {
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
      limit: 6,
    },
  })

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
      {/* <InfiniteScrollComponent> */}
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
      {/* </InfiniteScrollComponent> */}
    </Container>
  )
}

export default RecentReviews
