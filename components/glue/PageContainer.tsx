import { Container } from "@mantine/core"
import Head from "next/head"
import React from "react"
import Flex from "./Flex"

interface IPageContainerProps {
  children: React.ReactNode
  variant: "mobile-only"
  title?: string
}

const PageContainer = ({ children, title, variant }: IPageContainerProps) => {
  if (variant === "mobile-only") {
    return (
      <>
        {title && (
          <Head>
            <title>{title}</title>
          </Head>
        )}
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
      </>
    )
  }

  return null
}

export default PageContainer
