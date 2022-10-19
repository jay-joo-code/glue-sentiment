import { Stack } from "@mantine/core"
import Button from "components/glue/Button"
import PageContainer from "components/glue/PageContainer"
import React from "react"

const ReactGAPage = () => {
  return (
    <PageContainer variant="mobile-only" title="GA test page title">
      <Stack>
        <Button>test button A</Button>
        <Button>test button B</Button>
        <Button>test button C</Button>
      </Stack>
    </PageContainer>
  )
}

export default ReactGAPage
