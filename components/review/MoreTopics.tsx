import { Container, Title } from "@mantine/core"
import { Category, Review, Topic } from "@prisma/client"
import TopicSearch from "components/index/TopicSearch"
import pluralize from "pluralize"

interface IMoreTopicsProps {
  topic: Topic & {
    category: Category
  }
}

const MoreTopics = ({ topic }: IMoreTopicsProps) => {
  return (
    <Container>
      <Title order={2} mb="lg">
        More {pluralize(topic?.category?.name)}
      </Title>
      <TopicSearch
        categoryName={topic?.category?.name}
        renderByDefault={true}
      />
    </Container>
  )
}

export default MoreTopics
