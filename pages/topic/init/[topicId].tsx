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
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

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
  const [isTimeline1Displayed, setIsTimeline1Displayed] =
    useState<boolean>(false)
  const [isTimeline2Displayed, setIsTimeline2Displayed] =
    useState<boolean>(false)
  const [isTimeline3Displayed, setIsTimeline3Displayed] =
    useState<boolean>(false)
  const [isButtonDisplayed, setIsButtonDisplayed] = useState<boolean>(false)

  useEffect(() => {
    setIsLabelDisplayed(true)
  }, [])

  // TODO: uncomment
  const { data, isValidating } = useGlueQuery({
    // url: `/scrape/${topic?.id}`,
    url: "",
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
                  You&apos;re the first to search for
                </Text>
              </div>
            )}
          </Transition>

          <Transition
            mounted={isNameDisplayed}
            onEntered={() => setIsTimeline1Displayed(true)}
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

          {/* timeline 1 */}
          <Transition
            mounted={isTimeline1Displayed}
            onEntered={() => setIsTimeline2Displayed(true)}
            transition="fade"
            timingFunction="ease"
            duration={1600}
          >
            {(style) => (
              <div style={style}>
                <Flex align="start" noWrap={true}>
                  <Container
                    mt=".1rem"
                    sx={(theme) => ({
                      "& svg": {
                        fill: theme.colors.brand[6],
                      },
                    })}
                  >
                    <CheckCircleIcon />
                  </Container>
                  <Container>
                    <Text>Scraping Reddit comments</Text>
                    <Text color="dimmed" size="sm" mt=".2rem">
                      Sentiment gathers initial review data from Reddit
                      comments.
                    </Text>
                  </Container>
                </Flex>
              </div>
            )}
          </Transition>

          {/* timeline 2 */}
          <Transition
            mounted={isTimeline2Displayed}
            onEntered={() => setIsTimeline3Displayed(true)}
            transition="fade"
            timingFunction="ease"
            duration={1600}
          >
            {(style) => (
              <div style={style}>
                <Flex align="start" noWrap={true}>
                  <Container
                    mt=".1rem"
                    sx={(theme) => ({
                      "& svg": {
                        fill: theme.colors.brand[6],
                      },
                    })}
                  >
                    <CheckCircleIcon />
                  </Container>
                  <Container>
                    <Text>Running Sentiment AI analysis</Text>
                    <Text color="dimmed" size="sm" mt=".2rem">
                      Sentiment AI reads over the Reddit comments and assigns
                      star ratings to the reviews.
                    </Text>
                  </Container>
                </Flex>
              </div>
            )}
          </Transition>

          {/* timeine 3 */}
          <Transition
            mounted={isTimeline3Displayed}
            onEntered={() => setIsButtonDisplayed(true)}
            transition="fade"
            timingFunction="ease"
            duration={1600}
          >
            {(style) => (
              <div style={style}>
                <Flex align="start">
                  <Container
                    sx={(theme) => ({
                      "& svg": {
                        fill: theme.colors.brand[6],
                      },
                    })}
                  >
                    <CheckCircleIcon />
                  </Container>
                  <Container mt=".1rem">
                    <Text>Finalizing the review data ...</Text>
                  </Container>
                </Flex>
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
