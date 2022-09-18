import { Button, Container, Popover, Stack, Text } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined"
import { Category, Review, Topic } from "@prisma/client"
import Flex from "components/glue/Flex"
import GlueResponsiveRender from "components/glue/GlueResponsiveRender"
import GlueSpoiler from "components/glue/GlueSpoiler"
import IconButton from "components/glue/IconButton"
import useGlueLocalStorage from "hooks/glue/useGlueLocalStorage"
import api from "lib/glue/api"
import moment from "moment"
import { useSession } from "next-auth/react"
import Link from "next/link"
import ReviewStars from "./ReviewStars"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"

interface IReviewItemProps {
  review: Review & {
    topic: Topic & {
      category: Category
    }
  }
  onUpvoteToggle: (reviewId: number, newUpvotes: number) => void
  onDelete: (reviewId: number) => void
  renderTopic?: boolean
  isShowTutorial?: boolean
}

const ReviewItem = ({
  review,
  onUpvoteToggle,
  onDelete,
  renderTopic = false,
  isShowTutorial = false,
}: IReviewItemProps) => {
  const { content, upvotes } = review
  const [isUpvoted, setIsUpvoted] = useLocalStorage({
    key: `review-is-upvoted-${review?.id}`,
    defaultValue: false,
  })

  const { data: session } = useSession()
  const isAdmin = session?.user?.email === "cornellsentiment@gmail.com"
  const isMyReview = session?.user?.id === review?.userId

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

  const [isClosedTutorial, setIsClosedTutorial] = useGlueLocalStorage({
    key: "is-review-item-tutorial-closed",
    defaultValue: false,
  })

  const handleDelete = async () => {
    onDelete(review?.id)
  }

  if (!isAdmin && isVotedInvalid !== undefined && isVotedInvalid) {
    return null
  }

  return (
    <Container>
      <Container
        pb="md"
        sx={(theme) => ({
          borderBottom: `1px solid ${theme.colors.gray[1]}`,
        })}
      >
        <Flex align="flex-start" mt="sm" spacing="sm" noWrap={true}>
          {/* up / down vote */}
          <Flex direction="column" align="center" spacing="xs">
            <IconButton
              color={isUpvoted ? "brand" : "button-gray"}
              tooltipLabel="Upvote"
              position="right"
              onClick={handleUpvote}
            >
              <ArrowUpwardOutlinedIcon />
            </IconButton>
            <Text weight={700} color={isUpvoted ? "brand" : undefined}>
              {upvotes}
            </Text>
          </Flex>
          <Stack
            spacing="xs"
            sx={(theme) => ({
              flexGrow: 2,
            })}
          >
            <Flex justify="space-between" align="center">
              <Flex align="center" spacing="xs">
                {/* category link */}
                {renderTopic && (
                  <Flex align="center" spacing={0}>
                    <Link href={`/topic/${review?.topic?.id}`}>
                      <Button
                        variant="light"
                        size="sm"
                        color="button-gray"
                        compact={true}
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
                <ReviewStars edit={false} value={review?.stars} size={18} />
                <GlueResponsiveRender renderIn="desktop">
                  <Text size="xs">{moment(review?.createdAt).fromNow()}</Text>
                </GlueResponsiveRender>
              </Flex>

              {/* toolbar */}
              <Flex align="center" spacing="xs">
                {/* admin - invalidate review */}
                {isAdmin && (
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
                )}

                {/* delete my review */}
                {!isAdmin && isMyReview && (
                  <IconButton
                    color="red"
                    tooltipLabel="Delete review"
                    position="left"
                    onClick={handleDelete}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                )}

                {/* hide unhelpful review */}
                {!isAdmin && !isMyReview && (
                  <Popover
                    opened={isShowTutorial && !isClosedTutorial}
                    position="bottom-end"
                    shadow="sm"
                    withArrow={true}
                    width={200}
                  >
                    <Popover.Target>
                      <IconButton
                        tooltipLabel="Hide unhelpful review"
                        color="button-gray"
                        position="left"
                        onClick={handleVoteInvalid}
                      >
                        <CloseOutlinedIcon />
                      </IconButton>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Text size="sm" weight={500} mb="sm">
                        Hide uphelpful reviews with this button
                      </Text>
                      <Flex direction="column" align="flex-end" spacing="xs">
                        <Button
                          size="xs"
                          variant="light"
                          compact={true}
                          onClick={() => setIsClosedTutorial(true)}
                        >
                          Got it!
                        </Button>
                      </Flex>
                    </Popover.Dropdown>
                  </Popover>
                )}
              </Flex>
            </Flex>

            {/* review body */}
            <GlueSpoiler previewHeight={300} expandOnly={true}>
              <Text
                sx={(theme) => ({
                  lineHeight: "1.5",
                })}
              >
                {content}
              </Text>
            </GlueSpoiler>

            {/* mobile date stamp */}
            <GlueResponsiveRender renderIn="mobile">
              <Text size="xs" mt="xs">
                {moment(review?.createdAt).fromNow()}
              </Text>
            </GlueResponsiveRender>
          </Stack>
        </Flex>
      </Container>
    </Container>
  )
}

export default ReviewItem
