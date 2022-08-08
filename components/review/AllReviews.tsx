import { Container, Select, Stack, Text, Title } from "@mantine/core"
import { Review } from "@prisma/client"
import Flex from "components/glue/Flex"
import Image from "next/image"
import React from "react"
import ReviewItem from "./ReviewItem"

interface IAllReviewsProps {
  reviews: Review[]
}

const AllReviews = ({ reviews }: IAllReviewsProps) => {
  return (
    <Container>
      <Flex align="center" justify="space-between">
        <Title order={2}>All Reviews ({reviews?.length})</Title>
        {/* TODO: sort select */}
        {/* <Select /> */}
      </Flex>
      {/* TODO: render list */}
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
            <ReviewItem key={review?.id} review={review} />
          ))}
        </Stack>
      )}
    </Container>
  )
}

export default AllReviews
