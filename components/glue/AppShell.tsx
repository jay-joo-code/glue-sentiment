import { Container } from "@mantine/core"
import React from "react"
import Flex from "./Flex"
import Header from "./Header"

interface IAppShellProps {
  children: React.ReactNode
}

const AppShell = ({ children }: IAppShellProps) => {
  return (
    <Flex direction="column" align="center">
      <Header />
      <Container
        py="sm"
        px="md"
        sx={(theme) => ({
          width: "100%",
          minHeight: "100vh",
          color: theme.colors.gray[8],

          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            width: "85vw",
            maxWidth: "unset",
          },
        })}
      >
        {children}
      </Container>
    </Flex>
  )
}

export default AppShell
