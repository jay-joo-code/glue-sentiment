import { Container } from "@mantine/core"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import Flex from "./Flex"

interface IPageContainerProps {
  children: React.ReactNode
  variant: "mobile-only"
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
      router.push("/api/auth/signin")
    }
  }, [isPrivate, status])

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
