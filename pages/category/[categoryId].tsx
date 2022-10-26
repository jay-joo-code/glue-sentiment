import { Title } from "@mantine/core"
import { capitalize } from "@mui/material"
import PageContainer from "components/glue/PageContainer"
import TopicList from "components/topic/TopicList"
import prisma from "lib/glue/prisma"
import { GetServerSideProps } from "next"
import pluralize from "pluralize"

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const category = await prisma.category.findFirst({
    where: {
      id: Number(query?.categoryId),
    },
  })

  return {
    props: { category },
  }
}

const CategoryDetailsPage = ({ category }) => {
  const categoryName = capitalize(pluralize(category?.name))
  return (
    <PageContainer
      title={`${categoryName} | Sentiment - Reviews at Cornell`}
      variant="mobile-only"
    >
      <Title order={1} mb="xl">
        {categoryName}
      </Title>
      <TopicList categoryName={category?.name} />
    </PageContainer>
  )
}

export default CategoryDetailsPage
