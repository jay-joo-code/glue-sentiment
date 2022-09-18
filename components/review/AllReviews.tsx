import { Container, Select, Stack, Text, Title } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import Flex from "components/glue/Flex"
import GlueInfiniteScroll from "components/glue/GlueInfiniteScroll"
import useGlueQuery from "hooks/glue/useGlueQuery"
import api from "lib/glue/api"
import Image from "next/image"
import Skeleton from "react-loading-skeleton"
import ReviewItem from "./ReviewItem"

interface IAllReviewsProps {
  topicId: number
  totalReviewCount: number
}

const AllReviews = ({ topicId, totalReviewCount }: IAllReviewsProps) => {
  const sortByToQuery = {
    popular: { upvotes: "desc" },
    recent: { createdAt: "desc" },
    "lower-ratings": { stars: "asc" },
    "higher-ratings": { stars: "desc" },
  }

  const reviewSortByOptions = [
    { value: "popular", label: "Popular" },
    { value: "recent", label: "Recent" },
    { value: "lower-ratings", label: "Lower ratings" },
    { value: "higher-ratings", label: "Higher ratings" },
  ]

  const [sortBy, setSortBy] = useLocalStorage({
    key: `all-reviews-sort-by-${topicId}`,
    defaultValue: "recent",
  })

  const handleSortByChange = (newValue: string) => {
    setSortBy(newValue)
  }

  return (
    <Container>
      <Flex align="center" justify="space-between" mb="2rem">
        <Title order={2}>All Reviews ({totalReviewCount})</Title>
        <Select
          value={sortBy}
          onChange={handleSortByChange}
          data={reviewSortByOptions}
        />
      </Flex>
      <GlueInfiniteScroll
        queryConfig={{
          url: "/glue/reviews",
          args: {
            where: {
              topicId,
              isValid: true,
            },
            include: {
              topic: {
                include: {
                  category: true,
                },
              },
            },
            orderBy: sortByToQuery[sortBy],
            limit: 4,
          },
        }}
        limit={4}
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
          const { data: reviews, optimisticUpdate, isLoading } = providedData
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

          return !isLoading && reviews?.length === 0 ? (
            <Flex direction="column" align="center" py="3rem">
              <Image
                src="/empty-states/reviews.svg"
                alt=""
                height={150}
                width={200}
              />
              <Text weight={500}>Be the first to write a review!</Text>
            </Flex>
          ) : (
            <Stack>
              {reviews?.map((review, idx) => (
                <ReviewItem
                  key={review?.id}
                  review={review}
                  onUpvoteToggle={onUpvoteToggle}
                  isShowTutorial={idx === 0}
                />
              ))}
            </Stack>
          )
        }}
      </GlueInfiniteScroll>
    </Container>
  )
}

export default AllReviews
