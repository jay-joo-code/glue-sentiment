import { Menu, MenuItemProps } from "@mantine/core"
import { NextLink } from "@mantine/next"

interface IMenuItemProps extends MenuItemProps {
  href?: string
  onClick?: React.MouseEventHandler
}

const MenuItem = ({ children, href, ...rest }: IMenuItemProps) => {
  if (href) {
    return (
      <Menu.Item
        component={NextLink}
        href={href}
        py="sm"
        {...rest}
        sx={(theme) => ({
          paddingTop: "0.6rem !important",
          paddingBottom: "0.6rem !important",
        })}
      >
        {children}
      </Menu.Item>
    )
  }
  return (
    <Menu.Item
      py="sm"
      {...rest}
      sx={(theme) => ({
        paddingTop: "0.6rem !important",
        paddingBottom: "0.6rem !important",
      })}
    >
      {children}
    </Menu.Item>
  )
}

export default MenuItem
