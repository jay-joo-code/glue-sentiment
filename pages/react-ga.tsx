import { Stack } from "@mantine/core"
import GlueButton from "components/glue/GlueButton"
import PageContainer from "components/glue/PageContainer"
import React from "react"

const ReactGAPage = () => {
  return (
    <PageContainer variant="mobile-only" title="GA test page title">
      <Stack>
        <GlueButton>test button A</GlueButton>
        <GlueButton>test button B</GlueButton>
        <GlueButton>test button C</GlueButton>
      </Stack>
    </PageContainer>
  )
}

export default ReactGAPage
