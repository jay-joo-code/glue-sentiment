import { Button, Container, Spoiler, Stack, Text } from "@mantine/core"
import React from "react"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import ReactStars from "react-stars"
import styled from "styled-components"
import { Review } from "@prisma/client"
import Flex from "components/glue/Flex"
import moment from "moment"
import api from "lib/glue/api"
import { useLocalStorage } from "@mantine/hooks"

interface IReviewItemProps {
  review: Review
  onUpvoteToggle: (reviewId: number, newUpvotes: number) => void
}

const ReviewItem = ({ review, onUpvoteToggle }: IReviewItemProps) => {
  const { stars, content, upvotes } = review
  const [isUpvoted, setIsUpvoted] = useLocalStorage({
    key: `review-is-upvoted-${review?.id}`,
    defaultValue: false,
  })

  const handleUpvote = async () => {
    const newUpvotes = isUpvoted ? review?.upvotes - 1 : review?.upvotes + 1
    onUpvoteToggle(review?.id, newUpvotes)
    setIsUpvoted(!isUpvoted)
  }

  return (
    <Container
      p="md"
      sx={(theme) => ({
        background: theme.colors.gray[0],
        borderRadius: theme.radius.md,
      })}
    >
      <Stack spacing="md">
        <Flex align="center" spacing="xs">
          <ReactStars edit={false} value={stars} />
          <Text size="xs">{moment(review?.createdAt).fromNow()}</Text>
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
  )
}

const UpIcon = styled(KeyboardArrowUpIcon)`
  height: 16px;
  width: 16px;
`

export default ReviewItem
