import { Text, ThemeIcon, useMantineTheme } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import Flex from "./Flex"

interface INavItemProps {
  icon: React.ReactNode
  label: string
  href: string
  onClick?: () => void
}

const NavItem = ({ icon, label, href, onClick }: INavItemProps) => {
  const theme = useMantineTheme()
  const router = useRouter()

  return (
    <Link href={href}>
      <Flex
        mb="xs"
        onClick={onClick}
        align="center"
        p="sm"
        pl="lg"
        sx={(theme) => ({
          width: "100%",
          background: "#FFFFFF",
          borderRadius: theme.radius.lg,
        })}
      >
        <ThemeIcon variant="light" color="brand" size="lg">
          {icon}
        </ThemeIcon>
        <Text
          size="lg"
          color={
            router.pathname === href
              ? theme.colors.brand[6]
              : theme.colors.text[3]
          }
          weight={500}
        >
          {label}
        </Text>
      </Flex>
    </Link>
  )
}

export default NavItem
