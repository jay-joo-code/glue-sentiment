import { Button, Container, Textarea, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import React, { useState } from "react"
import ReviewStars from "./ReviewStars"

interface IMyReviewProps {
  topicId: number
}

const MyReview = ({ topicId }: IMyReviewProps) => {
  const [starsValue, setStarsValue] = useState<number>(0.5)

  return (
    <Container>
      <Title order={2} mb="sm">
        My review
      </Title>
      <ReviewStars
        value={starsValue}
        onChange={(newValue) => setStarsValue(newValue)}
        edit={true}
        size={24}
      />
      <Container
        mt="sm"
        pb="md"
        sx={(theme) => ({
          background: theme.colors.gray[0],
          borderRadius: theme.radius.md,
        })}
      >
        <Textarea
          autosize={true}
          minRows={3}
          sx={(theme) => ({
            "& textarea": {
              background: theme.colors.gray[0],
              border: "none",
            },
          })}
        />
        <Flex justify="flex-end" pr="sm">
          <Button size="xs">Save</Button>
        </Flex>
      </Container>
    </Container>
  )
}

export default MyReview
