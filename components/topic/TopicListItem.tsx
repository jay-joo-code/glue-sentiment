import { ActionIcon, Container, Text } from "@mantine/core"
import { Topic } from "@prisma/client"
import ClickableContainer from "components/glue/ClickableContainer"
import Flex from "components/glue/Flex"
import categoryNameToIcon from "constants/categoryNameToIcon"
import Link from "next/link"
import React from "react"

interface ITopicListItemProps {
  topic: Topic & {
    _count: {
      reviews: number
    }
    category: {
      name: string
    }
  }
}

const TopicListItem = ({ topic }: ITopicListItemProps) => {
  const Icon = categoryNameToIcon[topic?.category?.name]

  console.log("`/topic/${topic?.id}`", `/topic/${topic?.id}`)

  return (
    <Link href={`/topic/${topic?.id}`}>
      <ClickableContainer>
        <Flex align="flex-start" spacing="sm" noWrap p="xs">
          <ActionIcon variant="light" color="brand" size="xl">
            <Icon />
          </ActionIcon>
          <Container>
            <Text size="sm" weight={600} mt=".2rem">
              {topic?.name}
            </Text>
            <Text size="sm" mt=".2rem" lineClamp={1}>
              {topic?.subtitle}
            </Text>
          </Container>
        </Flex>
      </ClickableContainer>
    </Link>
  )
}

export default TopicListItem
