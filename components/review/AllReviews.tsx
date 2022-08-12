import { Container, Select, Stack, Text, Title } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import Flex from "components/glue/Flex"
import useGlueQuery from "hooks/glue/useGlueQuery"
import api from "lib/glue/api"
import Image from "next/image"
import ReviewItem from "./ReviewItem"

interface IAllReviewsProps {
  topicId: number
}

const AllReviews = ({ topicId }: IAllReviewsProps) => {
  const sortByToQuery = {
    popular: { upvotes: "desc" },
    recent: { createdAt: "desc" },
  }

  const reviewSortByOptions = [
    { value: "popular", label: "Popular" },
    { value: "recent", label: "Recent" },
  ]

  const [sortBy, setSortBy] = useLocalStorage({
    key: `all-reviews-sort-by-${topicId}`,
    defaultValue: "popular",
  })

  const handleSortByChange = (newValue: string) => {
    setSortBy(newValue)
  }

  const { data: reviews, mutate } = useGlueQuery({
    autoRefetch: false,
    url: "/glue/reviews",
    args: {
      where: {
        topicId,
      },
      include: {
        topic: {
          include: {
            category: true,
          },
        },
      },
      orderBy: sortByToQuery[sortBy],
      page: 0,
      limit: 5,
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
      <Flex align="center" justify="space-between" mb="2rem">
        <Title order={2}>All Reviews ({reviews?.length})</Title>
        <Select
          value={sortBy}
          onChange={handleSortByChange}
          data={reviewSortByOptions}
        />
      </Flex>
      {/* TODO: infinite scrolling */}
      {reviews?.length === 0 ? (
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
          {reviews?.map((review) => (
            <ReviewItem
              key={review?.id}
              review={review}
              onUpvoteToggle={onUpvoteToggle}
            />
          ))}
        </Stack>
      )}
    </Container>
  )
}

export default AllReviews
