import {
  Burger,
  Container,
  MediaQuery,
  Text,
  useMantineTheme,
} from "@mantine/core"
import appConfig from "constants/appConfig"
import useIsDevice from "hooks/glue/useIsDevice"
import Link from "next/link"
import { useState } from "react"
import AuthButton from "./AuthButton"
import Flex from "./Flex"
import IconButton from "./IconButton"
import NavList from "./NavList"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"

const Header = () => {
  const [opened, setOpened] = useState<boolean>(false)
  const theme = useMantineTheme()
  const HEIGHT = 48
  const { isMobile } = useIsDevice()

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
          })}
        >
          <Flex
            justify="space-between"
            py="sm"
            px="md"
            sx={(theme) => ({
              width: "100%",
              maxWidth: theme.breakpoints.md,
            })}
          >
            <Flex spacing="xs">
              {/* NOTE: uncomment later when I have public nav items */}
              {/* <MediaQuery largerThan="xs" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened(!opened)}
                  size="sm"
                  color={theme.colors.dark[9]}
                />
              </MediaQuery> */}

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
                  {appConfig.name}
                </Text>
              </Link>
              <Text size="sm" weight={600} color="dimmed">
                beta
              </Text>
            </Flex>
            <Flex>
              {!isMobile && <NavList />}
              <Link href="/?isFocusSearch=true">
                <IconButton color="brand" tooltipLabel="Search">
                  <SearchOutlinedIcon />
                </IconButton>
              </Link>
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
