import { Container } from "@mantine/core"
import React from "react"
import Flex from "./Flex"
import Header from "./Header"
import Footer from "./Footer"

interface IAppShellProps {
  children: React.ReactNode
}

const AppShell = ({ children }: IAppShellProps) => {
  return (
    <Flex direction="column" align="center" spacing={0}>
      <Header />
      <Container
        py="sm"
        px="md"
        sx={(theme) => ({
          width: "100%",
          minHeight: "100vh",
          color: theme.colors.text[3],

          [`@media (min-width: ${theme.breakpoints.md}px)`]: {
            width: theme.breakpoints.md,
            maxWidth: "unset",
          },
        })}
      >
        {children}
      </Container>
      <Footer />
    </Flex>
  )
}

export default AppShell
