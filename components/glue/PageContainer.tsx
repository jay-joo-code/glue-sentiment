import { Container } from "@mantine/core"
import appConfig from "constants/appConfig"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import Flex from "./Flex"

interface IPageContainerProps {
  children: React.ReactNode
  variant: "mobile-only" | "responsive"
  title?: string
  isPrivate?: boolean
}

const PageContainer = ({
  children,
  title,
  variant,
  isPrivate = false,
}: IPageContainerProps) => {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (isPrivate && status === "unauthenticated") {
      router.push({
        pathname: "/api/auth/signin",
        query: {
          callbackUrl: window.location.href,
        },
      })
    }
  }, [isPrivate, status])

  const titleComponent = title && (
    <Head>
      <title>
        {title} | {appConfig.name}
      </title>
    </Head>
  )

  if (variant === "mobile-only") {
    return (
      <>
        {titleComponent}
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
  } else if (variant === "responsive") {
    return (
      <>
        {titleComponent}
        <Container
          sx={(theme) => ({
            width: "100%",
          })}
        >
          {children}
        </Container>
      </>
    )
  }

  return null
}

export default PageContainer
