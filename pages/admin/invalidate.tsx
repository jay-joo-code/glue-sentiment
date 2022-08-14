import { Stack } from "@mantine/core"
import GlueInfiniteScroll from "components/glue/GlueInfiniteScroll"
import PageContainer from "components/glue/PageContainer"
import ReviewItem from "components/review/ReviewItem"
import { useSession } from "next-auth/react"
import React from "react"

const AdminInvalidatePage = () => {
  const { data: session } = useSession()

  if (session?.user?.email !== "cornellsentiment@gmail.com") {
    return <div>unauthorized</div>
  }

  return (
    <PageContainer
      title="Invalid reviews"
      variant="mobile-only"
      isPrivate={true}
    >
      <GlueInfiniteScroll
        queryConfig={{
          url: "/glue/reviews",
          args: {
            where: {
              invalidVotes: {
                gte: 1,
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
              invalidVotes: "desc",
            },
          },
        }}
        limit={5}
      >
        {(providedData) => {
          const { data } = providedData

          if (data?.length === 0) {
            return <div>no data</div>
          }
          return (
            <Stack>
              {data?.map((review) => (
                <ReviewItem
                  key={review?.id}
                  review={review}
                  onUpvoteToggle={() => {}}
                  renderTopic={true}
                />
              ))}
            </Stack>
          )
        }}
      </GlueInfiniteScroll>
    </PageContainer>
  )
}

export default AdminInvalidatePage
