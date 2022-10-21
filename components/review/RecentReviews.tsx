import ReviewItem from "./ReviewItem"
import GlueInfiniteScroll from "components/glue/GlueInfiniteScroll"
import api from "lib/glue/api"
import { Container, Stack, Title } from "@mantine/core"
import Skeleton from "react-loading-skeleton"
import { showNotification } from "@mantine/notifications"

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
        invalidVotes: {
          lt: 2,
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
    },
  }

  return (
    <Container>
      <Title order={2} mb="md">
        Recent reviews
      </Title>
      <GlueInfiniteScroll
        queryConfig={queryConfig}
        limit={5}
        loader={
          <Container>
            {[...Array(3)].map((_, idx) => (
              <Container key={idx} mb="md">
                <Skeleton height={100} />
              </Container>
            ))}
          </Container>
        }
      >
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

          const onDelete = (reviewId: number) => {
            optimisticUpdate({
              variant: "delete",
              itemData: {
                id: reviewId,
              },
              asyncRequest: async () => {
                api.delete(`/glue/reviews/${reviewId}`)
              },
            })
            showNotification({
              title: "Your review was deleted",
              message: "",
              color: "green",
            })
          }

          return (
            <Stack>
              {data.map((review) => (
                <ReviewItem
                  key={review?.id}
                  review={review}
                  onUpvoteToggle={onUpvoteToggle}
                  onDelete={onDelete}
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
