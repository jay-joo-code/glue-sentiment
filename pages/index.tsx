import PageContainer from "components/glue/PageContainer"
import CategoriesCardList from "components/index/CategoriesCardList"
import TopicSearch from "components/index/TopicSearch"
import React from "react"

const Index = () => {
  return (
    <PageContainer variant="mobile-only" title="Sentiment | Reviews at Cornell">
      <TopicSearch />
      <CategoriesCardList />
    </PageContainer>
  )
}

export default Index
