import PageContainer from "components/glue/PageContainer"
import CategoriesCardList from "components/index/CategoriesCardList"
import TopicSearch from "components/index/TopicSearch"
import RecentReviews from "components/review/RecentReviews"
import prisma from "lib/glue/prisma"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { topics: true },
      },
    },
  })

  return {
    props: {
      categories,
    },
  }
}

const Index = ({ categories }) => {
  return (
    <PageContainer variant="mobile-only" title="Sentiment | Reviews at Cornell">
      <TopicSearch />
      <CategoriesCardList categories={categories} />
      <RecentReviews />
    </PageContainer>
  )
}

export default Index
