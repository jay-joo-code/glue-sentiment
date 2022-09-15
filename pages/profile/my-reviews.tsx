import { Container, Stack, Text, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import GlueInfiniteScroll from "components/glue/GlueInfiniteScroll"
import PageContainer from "components/glue/PageContainer"
import ReviewItem from "components/review/ReviewItem"
import api from "lib/glue/api"
import { useSession } from "next-auth/react"
import Image from "next/image"
import React from "react"
import Skeleton from "react-loading-skeleton"

const MyReviewsPage = () => {
  const { data: session } = useSession()

  return (
    <PageContainer
      title="My reviews | Sentiment - Reviews at Cornell"
      variant="mobile-only"
      isPrivate={true}
    >
      <Title order={1} mb="lg">
        My reviews
      </Title>
      <GlueInfiniteScroll
        limit={5}
        queryConfig={{
          url: "/glue/reviews",
          args: {
            where: {
              userId: session?.user?.id,
            },
            include: {
              topic: {
                include: {
                  category: true,
                },
              },
            },
          },
        }}
        loader={
          <Container>
            {[...Array(3)].map((_, idx) => (
              <Container key={idx} mb="md">
                <Skeleton height={120} />
              </Container>
            ))}
          </Container>
        }
      >
        {(providedData) => {
          const { data, optimisticUpdate, isLoading } = providedData
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

          if (!isLoading && (!data || data?.length === 0)) {
            return (
              <Flex direction="column" align="center" py="3rem">
                <Image
                  src="/empty-states/reviews.svg"
                  alt=""
                  height={150}
                  width={200}
                />
                <div>
                  <Text size="lg" weight={500} mb=".8rem" align="center">
                    No reviews!
                  </Text>
                  <Text size="sm" color="dimmed">
                    Make sure you&apos;re signed in to the correct account
                  </Text>
                </div>
              </Flex>
            )
          }

          return (
            <Stack>
              {data?.map((review) => (
                <ReviewItem
                  key={review?.id}
                  renderTopic={true}
                  review={review}
                  onUpvoteToggle={onUpvoteToggle}
                />
              ))}
            </Stack>
          )
        }}
      </GlueInfiniteScroll>
    </PageContainer>
  )
}

export default MyReviewsPage
