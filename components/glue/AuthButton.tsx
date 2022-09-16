import { Avatar, Button, Menu } from "@mantine/core"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import MenuItem from "./MenuItem"

const AuthButton = () => {
  const { status, data } = useSession()

  const PRIVATE_NAV = [
    {
      label: "My reviews",
      href: "/profile/my-reviews",
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
    <Menu position="bottom-end" width={140}>
      <Menu.Target>
        <Avatar
          src={data?.user?.image}
          radius="xl"
          alt="User profile image"
          size="sm"
          sx={(theme) => ({
            cursor: "pointer",
          })}
        />
      </Menu.Target>
      <Menu.Dropdown>
        {PRIVATE_NAV?.map(({ label, href }) => (
          <MenuItem key={label} href={href}>
            {label}
          </MenuItem>
        ))}

        <Menu.Divider />

        <MenuItem onClick={() => signOut({ redirect: false })} color="red">
          Sign out
        </MenuItem>
      </Menu.Dropdown>
    </Menu>
  )
}

export default AuthButton
