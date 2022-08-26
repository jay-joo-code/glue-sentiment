import { ActionIcon, Container, Text } from "@mantine/core"
import { Topic } from "@prisma/client"
import ClickableContainer from "components/glue/ClickableContainer"
import Flex from "components/glue/Flex"
import ReviewStars from "components/review/ReviewStars"
import categoryNameToIcon from "constants/categoryNameToIcon"
import Link from "next/link"

interface ITopicListItemProps {
  topic: Topic & {
    _count: {
      reviews: number
    }
    category: {
      name: string
    }
  }
  searchQuery?: string
}

const TopicListItem = ({ topic, searchQuery }: ITopicListItemProps) => {
  const Icon = categoryNameToIcon[topic?.category?.name]
  const isNotMatchingName =
    searchQuery &&
    !topic?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  let hasMatchingAlias = false
  const matchedAlias = topic?.aliases?.find((alias) => {
    const isMatch = alias?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    if (isMatch) {
      hasMatchingAlias = true
    }
    return isMatch
  })

  return (
    <Link href={`/topic/${topic?.id}`}>
      <ClickableContainer>
        <Flex align="flex-start" spacing="sm" noWrap p="xs">
          <ActionIcon variant="light" color="brand" size="xl">
            <Icon />
          </ActionIcon>
          <Container>
            <Text size="sm" weight={600} mt=".2rem">
              {isNotMatchingName && hasMatchingAlias
                ? matchedAlias
                : topic?.name}
            </Text>
            <Text size="sm" mt=".2rem" lineClamp={1}>
              {topic?.subtitle}
            </Text>
            {topic?.isInitialized && (
              <Flex align="center" mt=".5rem" spacing="xs">
                <Text weight={500} size="xs">
                  {topic?.stars?.toFixed(1)}
                </Text>
                <ReviewStars value={topic?.stars} allowHalf={true} />
                <Text weight={500} size="xs">
                  {topic?._count?.reviews} reviews
                </Text>
              </Flex>
            )}
          </Container>
        </Flex>
      </ClickableContainer>
    </Link>
  )
}

export default TopicListItem
