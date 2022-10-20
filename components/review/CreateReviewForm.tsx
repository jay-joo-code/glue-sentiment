import { Container, Space, Stack, Textarea } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { Topic } from "@prisma/client"
import Button from "components/glue/Button"
import Flex from "components/glue/Flex"
import useModal from "hooks/glue/useModal"
import api from "lib/glue/api"
import { useState } from "react"
import ReviewStars from "./ReviewStars"

interface ICreateReviewFormProps {
  topicId: number
}

const CreateReviewForm = ({ topicId }: ICreateReviewFormProps) => {
  /*

  stars : custom component
  content : textarea

  force sign in on form submit (persist form data)

  */
  const [stars, setStars] = useState<number>(0)
  const [content, setContent] = useState<string>("")
  const { closeModal } = useModal("write-review")

  const handleSubmit = (values) => {
    if (stars === 0) {
      showNotification({
        title: "Please select star rating",
        message: "",
        color: "red",
      })
    } else if (content?.length < 10) {
      showNotification({
        title: "Please write a rating that's longer than 10 characters",
        message: "",
        color: "red",
      })
    } else {
      api.post("/glue/reviews", {
        content,
        stars,
        topicId,
      })
      closeModal()
      showNotification({
        title: "Your review has been saved!",
        message: "",
        color: "green",
      })
    }
  }

  return (
    <Stack>
      <ReviewStars
        value={stars}
        size={30}
        edit={true}
        onChange={(newRating) => setStars(newRating)}
      />
      <Textarea
        minRows={5}
        value={content}
        onChange={(event) => setContent(event?.target?.value)}
      />
      <Flex justify="flex-end">
        <Button onClick={handleSubmit}>Add review</Button>
      </Flex>
    </Stack>
  )
}

export default CreateReviewForm
