import {
  Burger,
  Container,
  MediaQuery,
  Text,
  useMantineTheme,
} from "@mantine/core"
import useIsMobile from "hooks/glue/isMobile"
import Link from "next/link"
import { useState } from "react"
import AuthButton from "./AuthButton"
import Flex from "./Flex"
import NavList from "./NavList"

const Header = () => {
  const [opened, setOpened] = useState<boolean>(false)
  const theme = useMantineTheme()
  const HEIGHT = 48
  const isMobile = useIsMobile()

  return (
    <Container>
      {/* header */}
      <Flex justify="center">
        <Flex
          justify="center"
          sx={(theme) => ({
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: 2,
            height: `${HEIGHT}px`,
            background: "rgba(255, 255, 255, 0.92)",

            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          })}
          py="sm"
          px="md"
        >
          <Flex
            justify="space-between"
            sx={(theme) => ({
              width: "100%",

              [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                width: "85vw",
              },
            })}
          >
            <Flex spacing="xs">
              <MediaQuery largerThan="xs" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened(!opened)}
                  size="sm"
                  color={theme.colors.dark[9]}
                />
              </MediaQuery>

              <Link href="/">
                <Text
                  size="md"
                  weight={700}
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                  sx={(theme) => ({
                    cursor: "pointer",
                  })}
                >
                  sentiment
                </Text>
              </Link>
            </Flex>
            <Flex>
              {!isMobile && <NavList />}
              <AuthButton />
            </Flex>
          </Flex>
        </Flex>
        <Container
          sx={(theme) => ({
            height: `${HEIGHT}px`,
          })}
        />
      </Flex>

      {/* mobile fullscreen nav */}
      {opened && (
        <Container
          sx={(theme) => ({
            position: "fixed",
            top: HEIGHT,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            background: theme.colors.gray[0],
          })}
          p="md"
          pt="xl"
        >
          <NavList closeNavOverlay={() => setOpened(false)} />
        </Container>
      )}
    </Container>
  )
}

export default Header
