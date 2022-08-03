import { Container, Input, Text } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import PageContainer from "components/glue/PageContainer"
import ReviewItem from "components/review/ReviewItem"
import { useState } from "react"
import useSWR from "swr"

const RedditTestPage = () => {
  const [query, setQuery] = useState<string>("")
  const [debouncedQuery] = useDebouncedValue(query, 500)
  const { data } = useSWR(["/scrape/reddit", { query: debouncedQuery }])

  return (
    <PageContainer variant="mobile-only">
      <Input
        value={query}
        onChange={(event) => setQuery(event?.target?.value)}
      />
      {data?.comments?.map((comment) => (
        <ReviewItem
          key={comment?.body}
          stars={comment?.stars}
          body={comment?.body}
          upvotes={comment?.ups}
        />
      ))}
    </PageContainer>
  )
}

export default RedditTestPage
