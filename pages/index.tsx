import PageContainer from "components/glue/PageContainer"
import CategoriesCardList from "components/index/CategoriesCardList"
import TopicSearch from "components/index/TopicSearch"
import RecentReviews from "components/review/RecentReviews"

const Index = () => {
  return (
    <PageContainer variant="mobile-only" title="Sentiment | Reviews at Cornell">
      <TopicSearch />
      <CategoriesCardList />
      <RecentReviews />
    </PageContainer>
  )
}

export default Index
