import { Container } from "@mantine/core"
import React from "react"
import Flex from "./Flex"

interface IMobileContainerProps {
  children: React.ReactNode
}

const MobileContainer = ({ children }: IMobileContainerProps) => {
  return (
    <Flex justify="center">
      <Container
        sx={(theme) => ({
          width: "100%",

          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            width: theme.breakpoints.xs,
          },
        })}
      >
        {children}
      </Container>
    </Flex>
  )
}

export default MobileContainer
