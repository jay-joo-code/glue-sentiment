import { Button, Container, Spoiler, Stack, Text } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { capitalize } from "@mui/material"
import { Category, Review, Topic } from "@prisma/client"
import Flex from "components/glue/Flex"
import moment from "moment"
import Link from "next/link"
import styled from "styled-components"
import ReviewStars from "./ReviewStars"
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import IconButton from "components/glue/IconButton"
import api from "lib/glue/api"
import { showNotification } from "@mantine/notifications"
import { useSession } from "next-auth/react"
import prisma from "lib/glue/prisma"
import getAverageReviewStars from "util/getAverageReviewStars"

interface IReviewItemProps {
  review: Review & {
    topic: Topic & {
      category: Category
    }
  }
  onUpvoteToggle: (reviewId: number, newUpvotes: number) => void
  renderTopic?: boolean
}

const ReviewItem = ({
  review,
  onUpvoteToggle,
  renderTopic = false,
}: IReviewItemProps) => {
  const { content, upvotes } = review
  const [isUpvoted, setIsUpvoted] = useLocalStorage({
    key: `review-is-upvoted-${review?.id}`,
    defaultValue: false,
  })
  const { data: session } = useSession()

  // don't render if current client marked as invalid

  const handleUpvote = async () => {
    const newUpvotes = isUpvoted ? review?.upvotes - 1 : review?.upvotes + 1
    onUpvoteToggle(review?.id, newUpvotes)
    setIsUpvoted(!isUpvoted)
  }

  const handleVoteInvalid = async () => {
    showNotification({
      title: "This review has been marked as invalid",
      message:
        "An administrator will decide whether to permanantly delete this review",
      color: "green",
    })
    api.put(`/glue/reviews/${review?.id}`, {
      invalidVotes: (review?.invalidVotes || 0) + 1,
    })
  }

  const handleInvalidate = async () => {
    await api.put(`/glue/reviews/${review?.id}`, {
      isValid: false,
    })

    const { data: topic } = await api.post(
      `/recompute-stars/${review?.topic?.id}`
    )

    showNotification({
      title: "Successfully set isValid to false",
      message: `Topic ${topic?.name} recomputed to ${topic?.stars}`,
      color: "green",
    })
  }

  return (
    <Container>
      {renderTopic && (
        <Flex align="center" mb="xs" mt="sm" spacing={0}>
          <Link href={`/category/${review?.topic?.category?.id}`}>
            <Button variant="light" size="sm" compact={true}>
              {capitalize(review?.topic?.category?.name)}
            </Button>
          </Link>
          <Link href={`/topic/${review?.topic?.id}`}>
            <Button
              variant="subtle"
              size="sm"
              color="button-gray"
              compact={true}
            >
              {review?.topic?.name}
            </Button>
          </Link>
        </Flex>
      )}
      <Container
        p="md"
        sx={(theme) => ({
          background: theme.colors.gray[0],
          borderRadius: theme.radius.md,
        })}
      >
        <Stack spacing="md">
          <Flex justify="space-between" align="center">
            <Flex align="center" spacing="xs">
              <ReviewStars edit={false} value={review?.stars} size={18} />
              <Text size="xs">{moment(review?.createdAt).fromNow()}</Text>
            </Flex>

            {/* toolbar */}
            <Flex align="center" spacing="xs">
              {session?.user?.email === "cornellsentiment@gmail.com" && (
                <IconButton
                  tooltipLabel="Invalidate review"
                  color="button-gray"
                  position="left"
                  onClick={handleInvalidate}
                >
                  <FlagOutlinedIcon />
                </IconButton>
              )}
              <IconButton
                tooltipLabel="Mark as an invalid review"
                color="button-gray"
                position="left"
                onClick={handleVoteInvalid}
              >
                <CloseOutlinedIcon />
              </IconButton>
            </Flex>
          </Flex>
          <Spoiler
            maxHeight={118}
            showLabel="Read more"
            hideLabel="Hide"
            mb="sm"
            sx={(theme) => ({
              "& .mantine-Spoiler-control": {
                fontSize: "12px",
              },
            })}
          >
            <Text>{content}</Text>
          </Spoiler>
          <div>
            <Button
              variant={isUpvoted ? "filled" : "white"}
              leftIcon={<UpIcon />}
              size="xs"
              onClick={handleUpvote}
              color={isUpvoted ? "brand" : "dark"}
              sx={(theme) => ({
                paddingTop: "0",
                paddingBottom: "0",
                paddingRight: "6px",
                paddingLeft: "4px",
                fontSize: ".7rem",
                height: "24px",

                "& .mantine-Button-icon": {
                  marginRight: "3px",
                },
              })}
            >
              Agree {upvotes}
            </Button>
          </div>
        </Stack>
      </Container>
    </Container>
  )
}

const UpIcon = styled(KeyboardArrowUpIcon)`
  height: 16px;
  width: 16px;
`

export default ReviewItem
