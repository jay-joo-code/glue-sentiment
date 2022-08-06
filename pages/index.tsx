import PageContainer from "components/glue/PageContainer"
import CategoriesCardList from "components/index/CategoriesCardList"
import TopicSearch from "components/index/TopicSearch"
import RecentReviews from "components/review/RecentReviews"
import { fetchAllClasses } from "util/scrapeRoster"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await fetchAllClasses({ reset: true })

  return {
    props: {},
  }
}

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
