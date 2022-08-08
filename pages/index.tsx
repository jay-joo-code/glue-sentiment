import { Container, Title } from "@mantine/core"
import PageContainer from "components/glue/PageContainer"
import CategoriesCardList from "components/index/CategoriesCardList"
import TopicSearch from "components/index/TopicSearch"
import RecentReviews from "components/review/RecentReviews"

const Index = () => {
  return (
    <PageContainer variant="mobile-only" title="Sentiment | Reviews at Cornell">
      <Container>
        <Title order={2} mb="md">
          Search
        </Title>
        <TopicSearch />
      </Container>
      <CategoriesCardList />
      <RecentReviews />
    </PageContainer>
  )
}

export default Index
