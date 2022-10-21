import { Container } from "@mantine/core"
import Button from "components/glue/Button"
import api from "lib/glue/api"
import React from "react"

const TestSentryPage = () => {
  const handleClick = async () => {
    const data = await api.get("/route/doesnt/exist")
    const foo = data.data.nice.nice
  }

  return (
    <Container>
      <Button onClick={handleClick}>Create 404 error</Button>
    </Container>
  )
}

export default TestSentryPage
