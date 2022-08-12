import ReviewItem from "./ReviewItem"
import GlueInfiniteScroll from "components/glue/GlueInfiniteScroll"
import api from "lib/glue/api"

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
    <GlueInfiniteScroll queryConfig={queryConfig} limit={2}>
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

        return data.map((review) => (
          <ReviewItem
            key={review?.id}
            review={review}
            onUpvoteToggle={onUpvoteToggle}
            renderTopic={true}
          />
        ))
      }}
    </GlueInfiniteScroll>
  )
}

export default RecentReviews
