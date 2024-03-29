import { Container, Input, Text } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import SearchIcon from "@mui/icons-material/Search"
import Flex from "components/glue/Flex"
import TopicListItem from "components/topic/TopicListItem"
import useGlueQuery from "hooks/glue/useGlueQuery"
import useRecentTopics from "hooks/useRecentTopics"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import qs from "qs"
import Skeleton from "react-loading-skeleton"

interface ITopicSearchProps {
  categoryName?: string
  renderByDefault?: boolean
}

const TopicSearch = ({
  categoryName,
  renderByDefault = false,
}: ITopicSearchProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500)
  const queryConfig = {
    url: "/glue/topics",
    args: {
      where: {
        OR: [
          {
            name: {
              contains: debouncedSearchQuery,
              mode: "insensitive",
            },
          },
          {
            aliasesString: {
              contains: debouncedSearchQuery,
              mode: "insensitive",
            },
          },
          {
            subtitle: {
              contains: debouncedSearchQuery,
              mode: "insensitive",
            },
          },
        ],
        category: {
          name: categoryName,
        },
      },
      include: {
        _count: {
          select: { reviews: true },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        reviews: {
          _count: "desc",
        },
      },
      page: 0,
      limit: 5,
      parseConfig: {
        parseNumbers: false,
      },
    },
  }
  const queryRequest = renderByDefault
    ? queryConfig
    : debouncedSearchQuery
    ? queryConfig
    : null
  const { data: topics, isLoading } = useGlueQuery(queryRequest)
  const [recentTopics] = useRecentTopics()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const router = useRouter()
  const inputRef = useRef(null)

  useEffect(() => {
    if (router.query?.isFocusSearch === "true") {
      inputRef.current.focus()
      const newQuery = { ...router.query }
      delete newQuery.isFocusSearch
      router.replace(
        { pathname: "/", query: qs.stringify(newQuery) },
        undefined,
        { shallow: true }
      )
    }
  }, [router.query?.isFocusSearch])

  return (
    <Container>
      <Input
        ref={inputRef}
        radius="xl"
        icon={<SearchIcon />}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event?.target?.value)}
        onFocus={() => setIsExpanded(true)}
      />
      <Container
        sx={(theme) => ({
          height: "460px",
          maxHeight: isExpanded ? "460px" : "0px",
          overflow: "hidden",
          transition: "max-height 300ms ease-in-out",
        })}
      >
        {/* search results */}
        {!isLoading && topics?.length > 0 && (
          <Container p="sm" mt="md">
            {topics?.map((topic) => (
              <TopicListItem
                key={topic?.id}
                topic={topic}
                searchQuery={debouncedSearchQuery}
              />
            ))}
          </Container>
        )}

        {/* loading skeletons */}
        {isLoading && (
          <Container p="sm" mt="md">
            {[...Array(5)].map((_, idx) => (
              <Container key={idx} mt="sm">
                <Skeleton height={54} />
              </Container>
            ))}
          </Container>
        )}

        {/* recently viewed */}
        {!isLoading &&
          !renderByDefault &&
          !debouncedSearchQuery &&
          recentTopics?.length > 0 && (
            <Container p="sm" mt="md">
              <Text size="xs" weight={500} mb="xs" color="dimmed" ml=".5rem">
                Recently viewed
              </Text>
              {recentTopics?.map((topic) => (
                <TopicListItem key={topic?.id} topic={topic} />
              ))}
            </Container>
          )}

        {/* empty state */}
        {!isLoading && !recentTopics?.length && !topics?.length && (
          <Flex direction="column" align="center" justify="center" py="5rem">
            <Image
              src="/empty-states/topic-search.svg"
              alt=""
              height={120}
              width={150}
            />
            <Text weight={500}>No search results</Text>
          </Flex>
        )}
      </Container>
    </Container>
  )
}

export default TopicSearch
