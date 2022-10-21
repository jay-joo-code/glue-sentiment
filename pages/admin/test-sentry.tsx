import { Container } from "@mantine/core"
import Button from "components/glue/Button"
import api from "lib/glue/api"
import React from "react"

const TestSentryPage = () => {
  const handleClick = () => {
    api.get("/route/doesnt/exist")
  }

  return (
    <Container>
      <Button onClick={handleClick}>Create 404 error</Button>
    </Container>
  )
}

export default TestSentryPage
