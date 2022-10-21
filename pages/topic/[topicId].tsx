import { Badge, Container, Spoiler, Text, Title } from "@mantine/core"
import { Category, Topic } from "@prisma/client"
import Flex from "components/glue/Flex"
import PageContainer from "components/glue/PageContainer"
import AllReviews from "components/review/AllReviews"
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

  const reviewCount = await prisma.review.count({
    where: {
      topicId: topic?.id,
      isValid: true,
      invalidVotes: {
        lt: 2,
      },
    },
  })

  return {
    props: {
      key: query?.topicId,
      topic,
      reviewCount,
    },
  }
}

interface ITopicDetailsPageProps {
  topic: Topic & {
    category: Category
  }
  reviewCount: number
}

const TopicDetailsPage = ({ topic, reviewCount }: ITopicDetailsPageProps) => {
  const [recentTopics, setRecentTopics] = useRecentTopics()
  const [isAddedRecentTopic, setIsAddedRecentTopic] = useState<boolean>(false)

  useEffect(() => {
    if (recentTopics && !isAddedRecentTopic) {
      const newTopics = recentTopics?.filter(
        (recentTopic) => recentTopic?.id !== topic?.id
      )

      if (newTopics?.length >= 4) newTopics.pop()

      newTopics?.unshift({
        ...topic,
        _count: {
          reviews: reviewCount,
        },
      })
      setRecentTopics(newTopics)
      setIsAddedRecentTopic(true)
    }
  }, [recentTopics])

  return (
    <PageContainer
      title={`${topic?.name} | Sentiment - Reviews at Cornell`}
      variant="mobile-only"
    >
      <Badge radius="sm" size="md" mb="xs" ml="-.3rem">
        {topic?.category?.name}
      </Badge>
      <Title order={1}>{topic?.name}</Title>
      <Text size="sm" ml=".2rem">
        {topic?.subtitle}
      </Text>
      {topic?.aliases?.length > 0 && (
        <Text size="sm" ml=".2rem" mt="xl" mb="xl">
          Also known as{" "}
          <Text
            weight={600}
            component="span"
            sx={(theme) => ({
              fontSize: "1rem",
            })}
          >
            {topic?.aliases?.join(", ")}
          </Text>
        </Text>
      )}
      <Flex align="center" mt="lg" spacing="xs">
        <Text weight={600} size="sm">
          {topic?.stars?.toFixed(1)}
        </Text>
        <ReviewStars value={topic?.stars} size={18} allowHalf={true} />
        <Text weight={600} size="sm">
          {reviewCount} reviews
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
      <AllReviews topicId={topic?.id} totalReviewCount={reviewCount} />
    </PageContainer>
  )
}

export default TopicDetailsPage
