import {
  Button,
  Container,
  Stack,
  Text,
  Timeline,
  Transition,
} from "@mantine/core"
import Flex from "components/glue/Flex"
import PageContainer from "components/glue/PageContainer"
import useGlueQuery from "hooks/glue/useGlueQuery"
import prisma from "lib/glue/prisma"
import { GetServerSideProps } from "next"
import Link from "next/link"
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

  if (topic?.isInitialized) {
    return {
      redirect: {
        destination: `/topic/${topic?.id}`,
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

const TopicDetailsInitPage = ({ topic }) => {
  const [isLabelDisplayed, setIsLabelDisplayed] = useState<boolean>(false)
  const [isNameDisplayed, setIsNameDisplayed] = useState<boolean>(false)
  const [isTimeline1Displayed, setIsTimelineDisplayed] =
    useState<boolean>(false)
  const [isButtonDisplayed, setIsButtonDisplayed] = useState<boolean>(false)

  useEffect(() => {
    setIsLabelDisplayed(true)
  }, [])

  const { data, isValidating } = useGlueQuery({
    url: `/scrape/${topic?.id}`,
    autoRefetch: false,
  })

  const isLoading = !data && isValidating

  return (
    <PageContainer
      title={`Initializing ${topic?.name} | Sentiment - Reviews at Cornell`}
      variant="mobile-only"
    >
      <Flex justify="center">
        <Stack
          spacing="xl"
          mt="2rem"
          sx={(theme) => ({
            width: "400px",
          })}
        >
          <Transition
            mounted={isLabelDisplayed}
            onEntered={() => setIsNameDisplayed(true)}
            transition="fade"
            timingFunction="ease"
            duration={1000}
          >
            {(style) => (
              <div style={style}>
                <Text
                  weight={600}
                  sx={(theme) => ({
                    fontSize: "1.5rem",
                  })}
                >
                  Gathering Reddit comments for
                </Text>
              </div>
            )}
          </Transition>
          <Transition
            mounted={isNameDisplayed}
            onEntered={() => setIsTimelineDisplayed(true)}
            transition="fade"
            timingFunction="ease"
            duration={1000}
          >
            {(style) => (
              <div style={style}>
                <Text
                  mb="lg"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                  weight={600}
                  sx={(theme) => ({
                    fontSize: "3rem",
                  })}
                >
                  {topic?.name}
                </Text>
              </div>
            )}
          </Transition>
          <Transition
            mounted={isTimeline1Displayed}
            onEntered={() => setIsButtonDisplayed(true)}
            transition="fade"
            timingFunction="ease"
            duration={1600}
          >
            {(style) => (
              <div style={style}>
                <Timeline active={2} bulletSize={12} lineWidth={2}>
                  <Timeline.Item title="Scrape Reddit comments">
                    <Text color="dimmed" size="sm" mt=".5rem">
                      Sentiment gathers initial review data from Reddit
                      comments.
                    </Text>
                  </Timeline.Item>
                  <Timeline.Item title="Run Sentiment AI analysis">
                    <Text color="dimmed" size="sm" mt=".5rem">
                      Sentiment AI reads over the Reddit comments and assigns
                      star ratings to the reviews.
                    </Text>
                  </Timeline.Item>
                  <Timeline.Item title="Finalize the review data ..." />
                </Timeline>
              </div>
            )}
          </Transition>
          <Transition
            mounted={isButtonDisplayed}
            transition="fade"
            timingFunction="ease"
            duration={500}
          >
            {(style) => (
              <div style={style}>
                <Flex direction="column" align="center" mt="xl">
                  <Link href={`/topic/${topic?.id}`}>
                    <Button radius="xl" loading={isLoading}>
                      Go to {topic?.category?.name}
                    </Button>
                  </Link>
                  <Container>
                    <Text
                      size="xs"
                      color="dimmed"
                      align="center"
                      sx={(theme) => ({
                        lineHeight: "1.5",
                      })}
                    >
                      This process can take up to 3 minutes because Sentiment AI
                      has to read hundreds of relevant Reddit comments.
                    </Text>
                  </Container>
                </Flex>
              </div>
            )}
          </Transition>
        </Stack>
      </Flex>
    </PageContainer>
  )
}

export default TopicDetailsInitPage
