import { Button, Container, Spoiler, Stack, Text } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { capitalize } from "@mui/material"
import { Category, Review, Topic } from "@prisma/client"
import Flex from "components/glue/Flex"
import IconButton from "components/glue/IconButton"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import api from "lib/glue/api"
import moment from "moment"
import { useSession } from "next-auth/react"
import Link from "next/link"
import styled from "styled-components"
import ReviewStars from "./ReviewStars"
import EastIcon from "@mui/icons-material/East"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

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
  const isAdmin = session?.user?.email === "cornellsentiment@gmail.com"

  const [isVotedInvalid, setIsVotedInvalid] = useGlueLocalStorage({
    key: `review-voted-invalid-${review?.id}`,
    defaultValue: false,
  })

  const handleUpvote = async () => {
    const newUpvotes = isUpvoted ? review?.upvotes - 1 : review?.upvotes + 1
    onUpvoteToggle(review?.id, newUpvotes)
    setIsUpvoted(!isUpvoted)
  }

  const handleVoteInvalid = async () => {
    showNotification({
      title: "This review has been marked as unhelpful",
      message:
        "An administrator will decide whether to permanantly delete this unhelpful review",
      color: "green",
    })
    api.put(`/glue/reviews/${review?.id}`, {
      invalidVotes: (review?.invalidVotes || 0) + 1,
    })
    setIsVotedInvalid(true)
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

  if (!isAdmin && isVotedInvalid !== undefined && isVotedInvalid) {
    return null
  }

  return (
    <Container>
      <Container
        p="md"
        pt={0}
        sx={(theme) => ({
          borderBottom: `1px solid ${theme.colors.gray[1]}`,
        })}
      >
        {renderTopic && (
          <Flex align="center" mb="xs" spacing={0}>
            {/* category link */}
            {/* <Link href={`/category/${review?.topic?.category?.id}`}>
              <Button variant="light" size="sm" compact={true}>
                {capitalize(review?.topic?.category?.name)}
              </Button>
            </Link> */}
            <Link href={`/topic/${review?.topic?.id}`}>
              <Button
                variant="light"
                size="sm"
                color="button-gray"
                compact={true}
                // rightIcon={<ArrowForwardIcon />}
                sx={(theme) => ({
                  "& .mantine-Button-rightIcon": {
                    marginLeft: "4px",
                  },
                  "& svg": {
                    width: "20px",
                  },
                })}
              >
                {review?.topic?.name}
              </Button>
            </Link>
          </Flex>
        )}
        <Stack spacing="xs">
          <Flex justify="space-between" align="center">
            <Flex align="center" spacing="xs">
              <ReviewStars edit={false} value={review?.stars} size={18} />
              <Text size="xs">{moment(review?.createdAt).fromNow()}</Text>
            </Flex>

            {/* toolbar */}
            <Flex align="center" spacing="xs">
              {isAdmin ? (
                <Flex align="center" spacing="xs">
                  <Text size="lg" weight={600} color="dimmed">
                    {review?.invalidVotes}
                  </Text>
                  <IconButton
                    tooltipLabel="Invalidate review"
                    color="button-gray"
                    position="left"
                    onClick={handleInvalidate}
                  >
                    <FlagOutlinedIcon />
                  </IconButton>
                </Flex>
              ) : (
                <IconButton
                  tooltipLabel="Hide unhelpful review"
                  color="button-gray"
                  position="left"
                  onClick={handleVoteInvalid}
                >
                  <CloseOutlinedIcon />
                </IconButton>
              )}
            </Flex>
          </Flex>
          <Spoiler
            maxHeight={196}
            showLabel="Read more"
            hideLabel="Hide"
            mb="sm"
            sx={(theme) => ({
              "& .mantine-Spoiler-control": {
                fontSize: "14px",
              },
            })}
          >
            <Text
              sx={(theme) => ({
                lineHeight: "1.5",

                // display: "-webkit-box",
                // "-webkit-line-clamp": "7",
                // "-webkit-box-orient": "vertical",
                // overflow: "hidden",
              })}
            >
              {content}
            </Text>
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
