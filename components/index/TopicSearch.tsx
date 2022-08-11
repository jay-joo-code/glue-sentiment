import { Container, Input, Text } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import SearchIcon from "@mui/icons-material/Search"
import Flex from "components/glue/Flex"
import TopicListItem from "components/topic/TopicListItem"
import useGlueQuery from "hooks/glue/useGlueQuery"
import useRecentTopics from "hooks/useRecentTopics"
import Image from "next/image"
import { useState } from "react"

interface ITopicSearchProps {
  categoryName?: string
  renderByDefault?: boolean
}

const TopicSearch = ({
  categoryName,
  renderByDefault = false,
}: ITopicSearchProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500)
  const queryConfig = {
    url: "/glue/topics",
    args: {
      where: {
        name: {
          contains: debouncedSearchQuery,
          mode: "insensitive",
        },
        category: {
          name: categoryName,
        },
      },
      include: {
        _count: {
          select: { reviews: true },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        reviews: {
          _count: "desc",
        },
      },
      page: 0,
      limit: 5,
      parseConfig: {
        parseNumbers: false,
      },
    },
  }
  const queryRequest = renderByDefault
    ? queryConfig
    : debouncedSearchQuery
    ? queryConfig
    : null
  const { data: topics } = useGlueQuery(queryRequest)

  const [recentTopics] = useRecentTopics()

  return (
    <Container>
      <Input
        radius="xl"
        icon={<SearchIcon />}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event?.target?.value)}
      />
      {topics?.length > 0 && (
        <Container p="sm" mt="md">
          {topics?.map((topic) => (
            <TopicListItem key={topic?.id} topic={topic} />
          ))}
        </Container>
      )}

      {/* recently viewed */}
      {!renderByDefault && !debouncedSearchQuery && recentTopics?.length > 0 && (
        <Container p="sm" mt="md">
          <Text size="xs" weight={500} mb="xs" color="dimmed" ml=".5rem">
            Recently viewed
          </Text>
          {recentTopics?.map((topic) => (
            <TopicListItem key={topic?.id} topic={topic} />
          ))}
        </Container>
      )}

      {/* empty state */}
      {(renderByDefault || debouncedSearchQuery) && topics?.length === 0 && (
        <Flex direction="column" align="center" py="3rem">
          <Image
            src="/empty-states/topic-search.svg"
            alt=""
            height={120}
            width={150}
          />
          <Text weight={500}>No search results</Text>
        </Flex>
      )}
    </Container>
  )
}

export default TopicSearch
