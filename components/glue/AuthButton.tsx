import { Avatar, Button, Menu } from "@mantine/core"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import MenuItem from "./MenuItem"

const AuthButton = () => {
  const { status, data } = useSession()

  const PUBLIC_NAV = [
    {
      label: "My tasks",
      href: "/tasks/my-tasks",
    },
  ]

  if (status !== "authenticated") {
    return (
      <Link href="/api/auth/signin">
        <Button variant="light" color="button-gray" compact>
          Sign in
        </Button>
      </Link>
    )
  }

  return (
    <Menu
      styles={(theme) => ({
        root: {
          padding: "0 !important",
        },
      })}
      control={
        <Avatar
          src={data?.user?.image}
          radius="xl"
          alt="User profile image"
          size="sm"
          sx={(theme) => ({
            cursor: "pointer",
          })}
        />
      }
    >
      {PUBLIC_NAV?.map(({ label, href }) => (
        <MenuItem key={label} href={href}>
          {label}
        </MenuItem>
      ))}

      {/* {PUBLIC_NAV?.length > 0 && <MenuDivider />} */}

      <MenuItem onClick={() => signOut({ redirect: false })} color="red">
        Sign out
      </MenuItem>
    </Menu>
  )
}

export default AuthButton
