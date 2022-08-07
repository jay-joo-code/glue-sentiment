import { Container, Input, Stack, Text, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import React, { useState } from "react"
import SearchIcon from "@mui/icons-material/Search"
import useSWR from "swr"
import { useDebouncedValue } from "@mantine/hooks"
import TopicListItem from "components/topic/TopicListItem"

const TopicSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500)
  const { data: topics } = useSWR(
    debouncedSearchQuery
      ? [
          "/glue/topics",
          {
            where: {
              name: {
                contains: debouncedSearchQuery,
                mode: "insensitive",
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
            page: 0,
            limit: 5,
            parseConfig: {
              parseNumbers: false,
            },
          },
        ]
      : null
  )

  return (
    <Container>
      <Title order={2} mb="md">
        Search
      </Title>
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
    </Container>
  )
}

export default TopicSearch
