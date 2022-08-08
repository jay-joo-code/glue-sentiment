import { Button, Container, Text } from "@mantine/core"
import React from "react"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import ReactStars from "react-stars"
import styled from "styled-components"
import { Review } from "@prisma/client"

interface IReviewItemProps {
  review: Review
}

const ReviewItem = ({ review }: IReviewItemProps) => {
  const { stars, content, upvotes } = review

  return (
    <Container>
      <ReactStars edit={false} value={stars} />
      <Text>{content}</Text>
      <Button variant="default" leftIcon={<UpIcon />} size="xs">
        Agree {upvotes}
      </Button>
    </Container>
  )
}

const UpIcon = styled(KeyboardArrowUpIcon)`
  height: 20px;
  width: 20px;
`

export default ReviewItem
