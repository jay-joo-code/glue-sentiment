import { Button, Container, Textarea, Title } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { Review } from "@prisma/client"
import Flex from "components/glue/Flex"
import useGlueQuery from "hooks/glue/useGlueQuery"
import api from "lib/glue/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import getAverageReviewStars from "util/getAverageReviewStars"
import ReviewStars from "./ReviewStars"

interface IMyReviewProps {
  topicId: number
}

const MyReview = ({ topicId }: IMyReviewProps) => {
  const { data: session } = useSession()
  const { data: myReviews } = useGlueQuery({
    url: "/glue/reviews",
    args: {
      where: {
        topicId,
        userId: session?.user?.id,
      },
    },
    disabled: !session,
  })

  const { mutate } = useGlueQuery<Review[]>({
    variant: "static",
    url: "/glue/reviews",
    args: {
      where: {
        topicId,
      },
    },
  })

  const [stars, setStars] = useLocalStorage<number>({
    key: `my-review-${topicId}-stars`,
    defaultValue: myReviews ? myReviews[0]?.stars : 0,
  })

  const [content, setContent] = useLocalStorage<string>({
    key: `my-review-${topicId}-content`,
    defaultValue: "",
  })

  const router = useRouter()
  const handleSave = async () => {
    // validation
    if (stars < 1) {
      showNotification({
        title: "Please input atleast one star",
        message: "",
        color: "red",
      })
      return
    }

    if (content?.length < 20) {
      showNotification({
        title: "Your review must be atleast 20 characters long",
        message: "",
        color: "red",
      })
      return
    }

    // save logic
    if (session) {
      if (myReviews?.length === 0) {
        // create new
        await api.post("/glue/reviews", {
          content,
          stars,
          topic: { connect: { id: topicId } },
        })
      } else {
        // update existing
        await api.put(`/glue/reviews/${myReviews[0]?.id}`, {
          content,
          stars,
        })
      }
      showNotification({
        title: "Review saved",
        message: "Your review has been successfully saved",
        color: "green",
      })

      // recalculate topic stars
      const allReviews = await mutate()
      const newStars = getAverageReviewStars(allReviews)
      api.put(`/glue/topics/${topicId}`, {
        stars: newStars,
      })
    } else {
      router.push("/api/auth/signin")
    }
  }
  // TODO: debounced autosave

  return (
    <Container>
      <Title order={2} mb="sm">
        My review
      </Title>
      <ReviewStars
        value={stars}
        onChange={(newValue) => setStars(newValue)}
        edit={true}
        size={24}
      />
      <Container
        mt="sm"
        pb="md"
        sx={(theme) => ({
          background: theme.colors.gray[0],
          borderRadius: theme.radius.md,
        })}
      >
        <Textarea
          autosize={true}
          minRows={3}
          value={content}
          onChange={(event) => setContent(event?.target?.value)}
          sx={(theme) => ({
            "& textarea": {
              background: theme.colors.gray[0],
              border: "none",
            },
          })}
        />
        <Flex justify="flex-end" pr="sm">
          <Button size="xs" onClick={handleSave}>
            Save
          </Button>
        </Flex>
      </Container>
    </Container>
  )
}

export default MyReview
