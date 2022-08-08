import { Container, Select, Text, Title } from "@mantine/core"
import { Review } from "@prisma/client"
import Flex from "components/glue/Flex"
import Image from "next/image"
import React from "react"

interface IAllReviewsProps {
  reviews: Review[]
}

const AllReviews = ({ reviews }: IAllReviewsProps) => {
  const emptyState = (
    <Flex direction="column" align="center" py="3rem">
      <Image src="/empty-states/reviews.svg" alt="" height={150} width={200} />
      <Text weight={500}>Be the first to write a review!</Text>
    </Flex>
  )
  return (
    <Container>
      <Flex align="center" justify="space-between">
        <Title order={2}>All Reviews ({reviews?.length})</Title>
        {/* TODO: sort select */}
        {/* <Select /> */}
      </Flex>
      {/* TODO: render list */}
      {reviews?.length === 0 ? emptyState : <div>render list</div>}
    </Container>
  )
}

export default AllReviews
