import { Container, Space, Stack } from "@mantine/core"
import useTopics from "hooks/queries/useTopics"
import React from "react"
import SearchIcon from "@mui/icons-material/Search"
import Input from "components/glue/Input"
import { useRouter } from "next/router"
import TopicListItem from "./TopicListItem"

interface ITopicListProps {
  categoryId: number
}

const TopicList = ({ categoryId }: ITopicListProps) => {
  const router = useRouter()
  const { data: topics } = useTopics({
    categoryId,
    query: router?.query["category-details-topic-search"] as string,
    orderBy: "",
  })
  console.log("topics", topics)

  return (
    <Container>
      <Input
        glueKey="category-details-topic-search"
        sourceOfTruth="url-query"
        radius="xl"
        icon={<SearchIcon />}
      />
      <Space mb="lg" />
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
      <Space mb="lg" />
    </Container>
  )
}

export default TopicList
