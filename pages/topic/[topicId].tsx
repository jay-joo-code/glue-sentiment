import { Badge, Container, Spoiler, Text, Title } from "@mantine/core"
import { Category, Review, Topic } from "@prisma/client"
import Flex from "components/glue/Flex"
import PageContainer from "components/glue/PageContainer"
import AllReviews from "components/review/AllReviews"
import MoreTopics from "components/review/MoreTopics"
import MyReview from "components/review/MyReview"
import ReviewStars from "components/review/ReviewStars"
import useRecentTopics from "hooks/useRecentTopics"
import prisma from "lib/glue/prisma"
import { GetServerSideProps } from "next"
import { useEffect, useState } from "react"

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const topic = await prisma.topic.findFirst({
    where: {
      id: Number(query?.topicId),
    },
    include: {
      reviews: true,
      category: true,
    },
  })

  if (!topic?.isInitialized) {
    return {
      redirect: {
        destination: `/topic/init/${topic?.id}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      key: query?.topicId,
      topic,
    },
  }
}

interface ITopicDetailsPageProps {
  topic: Topic & {
    reviews: Review[]
    category: Category
  }
}

const TopicDetailsPage = ({ topic }: ITopicDetailsPageProps) => {
  const [recentTopics, setRecentTopics] = useRecentTopics()
  const [isAddedRecentTopic, setIsAddedRecentTopic] = useState<boolean>(false)

  useEffect(() => {
    if (recentTopics && !isAddedRecentTopic) {
      const newTopics = recentTopics?.filter(
        (recentTopic) => recentTopic?.id !== topic?.id
      )

      if (newTopics?.length >= 5) newTopics.pop()

      newTopics?.unshift(topic)
      setRecentTopics(newTopics)
      setIsAddedRecentTopic(true)
    }
  }, [recentTopics])

  return (
    <PageContainer
      title={`${topic?.name} | Sentiment - Reviews at Cornell`}
      variant="mobile-only"
    >
      <Badge radius="sm" size="sm">
        {topic?.category?.name}
      </Badge>
      <Title order={1} mb="xs">
        {topic?.name}
      </Title>
      <Text size="sm" ml=".2rem">
        {topic?.subtitle}
      </Text>
      <Flex align="center" mt="lg" spacing="xs">
        <ReviewStars value={topic?.stars} size={18} allowHalf={true} />
        <Text weight={600} size="sm">
          {topic?.reviews?.length} reviews
        </Text>
      </Flex>
      <Spoiler
        mt="xs"
        maxHeight={104}
        showLabel="Read more"
        hideLabel="Hide"
        sx={(theme) => ({
          "& .mantine-Spoiler-control": {
            fontSize: "12px",
          },
        })}
      >
        <Text
          size="sm"
          sx={(theme) => ({
            lineHeight: "1.5",
          })}
        >
          {topic?.desc}
        </Text>
      </Spoiler>
      <Container mb="4rem" />
      <MyReview topicId={topic?.id} />
      <Container mb="4rem" />
      <AllReviews
        topicId={topic?.id}
        totalReviewCount={topic?.reviews?.length}
      />
      <Container mb="4rem" />
      <MoreTopics topic={topic} />
    </PageContainer>
  )
}

export default TopicDetailsPage
