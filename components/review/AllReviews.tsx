import { Container, Select, Stack, Text, Title } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import CreateIcon from "@mui/icons-material/Create"
import Button from "components/glue/Button"
import Flex from "components/glue/Flex"
import GlueInfiniteScroll from "components/glue/GlueInfiniteScroll"
import Modal from "components/glue/Modal"
import useIsDevice from "hooks/glue/useIsDevice"
import useModal from "hooks/glue/useModal"
import api from "lib/glue/api"
import Image from "next/image"
import Skeleton from "react-loading-skeleton"
import CreateReviewForm from "./CreateReviewForm"
import ReviewItem from "./ReviewItem"

interface IAllReviewsProps {
  topicId: number
  totalReviewCount: number
}

const AllReviews = ({ topicId, totalReviewCount }: IAllReviewsProps) => {
  const { isMobile } = useIsDevice()
  const { openModal } = useModal("write-review")

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
        <Flex
          align="center"
          justify="space-between"
          sx={(theme) => ({
            width: "100%",
          })}
        >
          <Title order={2}>Reviews ({totalReviewCount})</Title>
          <Button
            size="sm"
            leftIcon={<CreateIcon />}
            onClick={() => openModal()}
          >
            {isMobile ? "Review" : "Write review"}
          </Button>
        </Flex>
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
                  onDelete={onDelete}
                  isShowTutorial={idx === 0}
                />
              ))}
            </Stack>
          )
        }}
      </GlueInfiniteScroll>
      <Modal glueKey="write-review" title="Write a review">
        <CreateReviewForm topicId={topicId} />
      </Modal>
    </Container>
  )
}

export default AllReviews
