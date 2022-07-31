import PageContainer from "components/glue/PageContainer"
import { useRouter } from "next/router"
import React from "react"

const TopicDetailsPage = () => {
  const router = useRouter()
  const topicId = router.query.topicId

  return (
    <PageContainer title="TODO" variant="mobile-only">
      {topicId}
    </PageContainer>
  )
}

export default TopicDetailsPage
