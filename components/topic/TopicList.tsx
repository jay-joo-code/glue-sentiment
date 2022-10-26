import { Container, Space, Stack } from "@mantine/core"
import useTopics, { queryConfigTopics } from "hooks/queries/useTopics"
import React from "react"
import SearchIcon from "@mui/icons-material/Search"
import Input from "components/glue/Input"
import { useRouter } from "next/router"
import TopicListItem from "./TopicListItem"
import GlueInfiniteScroll from "components/glue/GlueInfiniteScroll"

interface ITopicListProps {
  categoryName: string
}

const TopicList = ({ categoryName }: ITopicListProps) => {
  const router = useRouter()
  const query = router?.query["category-details-topic-search"] as string

  return (
    <Container>
      <Input
        glueKey="category-details-topic-search"
        sourceOfTruth="url-query"
        radius="xl"
        icon={<SearchIcon />}
      />
      <Space mb="lg" />
      <GlueInfiniteScroll
        queryConfig={queryConfigTopics({
          categoryName,
          query,
        })}
        limit={10}
      >
        {(providedData) => {
          const { data: topics } = providedData

          return (
            <Stack spacing="xs">
              {topics?.map((topic) => (
                <TopicListItem
                  key={topic?.id}
                  topic={topic}
                  searchQuery={
                    router?.query["category-details-topic-search"] as string
                  }
                />
              ))}
            </Stack>
          )
        }}
      </GlueInfiniteScroll>
      <Space mb="lg" />
    </Container>
  )
}

export default TopicList
