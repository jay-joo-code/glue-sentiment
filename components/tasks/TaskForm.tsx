import { Button, Paper, Stack, TextInput, Title } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { useDebouncedValue } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { Task } from "@prisma/client"
import Flex from "components/glue/Flex"
import api from "lib/api"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { z } from "zod"

interface ITaskFormProps {
  initialValues: Task
}

const schema = z.object({
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
})

const TaskForm = ({ initialValues }: ITaskFormProps) => {
  const router = useRouter()

  const form = useForm({
    initialValues,
    schema: zodResolver(schema),
  })
  const formRef = useRef<HTMLFormElement>(null)

  const [debouncedFormValues] = useDebouncedValue(form.values, 500)

  useEffect(() => {
    if (initialValues?.isValidated) {
      const { hasErrors } = form.validate()

      if (!hasErrors) {
        handleSubmit(debouncedFormValues)
        showNotification({
          message: "Changes saved",
          color: "green",
        })
      }
    }

    // eslint-disable-next-line
  }, [debouncedFormValues])

  const handleSubmit = async (values: Task) => {
    await api.put(`/tasks/${router?.query?.id}`, values)
  }

  return (
    <Paper>
      <Title></Title>
      <form ref={formRef} onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput label="Name" {...form.getInputProps("name")} />
          <Flex justify="flex-end">
            <Button onClick={() => router.push("/tasks/my-tasks")}>Save</Button>
          </Flex>
        </Stack>
      </form>
    </Paper>
  )
}

export default TaskForm