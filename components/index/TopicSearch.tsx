import { Container, Input, Text, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import React, { useState } from "react"
import SearchIcon from "@mui/icons-material/Search"
import useSWR from "swr"
import { useDebouncedValue } from "@mantine/hooks"

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

  console.log("topics", topics)

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
      {}
    </Container>
  )
}

export default TopicSearch
