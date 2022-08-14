import ReviewItem from "./ReviewItem"
import GlueInfiniteScroll from "components/glue/GlueInfiniteScroll"
import api from "lib/glue/api"
import { Container, Stack, Title } from "@mantine/core"

interface IRecentReviewsProps {
  categoryId?: number
}

const RecentReviews = ({ categoryId }: IRecentReviewsProps) => {
  const queryConfig = {
    url: "/glue/reviews",
    args: {
      where: {
        topic: {
          categoryId,
        },
        isValid: true,
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
    },
  }

  return (
    <Container>
      <Title order={2} mb="2rem">
        Recent reviews
      </Title>
      <GlueInfiniteScroll queryConfig={queryConfig} limit={5}>
        {(providedData) => {
          const { data, optimisticUpdate } = providedData

          const onUpvoteToggle = (reviewId: number, newUpvotes: number) => {
            optimisticUpdate({
              variant: "update",
              itemData: {
                id: reviewId,
                upvotes: newUpvotes,
              },
              asyncRequest: async () => {
                api.put(`/glue/reviews/${reviewId}`, {
                  upvotes: newUpvotes,
                })
              },
            })
          }

          return (
            <Stack>
              {data.map((review) => (
                <ReviewItem
                  key={review?.id}
                  review={review}
                  onUpvoteToggle={onUpvoteToggle}
                  renderTopic={true}
                />
              ))}
            </Stack>
          )
        }}
      </GlueInfiniteScroll>
    </Container>
  )
}

export default RecentReviews
