import { Button } from "@mantine/core"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import AlignHorizontalLeftOutlinedIcon from "@mui/icons-material/AlignHorizontalLeftOutlined"
import useIsDevice from "hooks/glue/useIsDevice"
import Flex from "./Flex"
import NavItem from "./NavItem"

export interface INavListProps {
  closeNavOverlay?: () => void
}

const NavList = ({ closeNavOverlay }: INavListProps) => {
  const { isMobile } = useIsDevice()

  // private navigation is defined in AuthButton.tsx
  const PUBLIC_NAV = [
    // {
    //   label: "All tasks",
    //   href: "/tasks",
    //   icon: <AlignHorizontalLeftOutlinedIcon />,
    // },
  ]

  if (isMobile) {
    return (
      <Flex direction="column" spacing="sm">
        {PUBLIC_NAV?.map(({ label, href, icon }) => (
          <NavItem
            key={label}
            label={label}
            href={href}
            icon={icon}
            onClick={() => closeNavOverlay && closeNavOverlay()}
          />
        ))}
      </Flex>
    )
  }

  return (
    <Flex direction="row" spacing="md" align="center">
      {PUBLIC_NAV?.map(({ label, href }) => (
        <Button
          component="a"
          key={label}
          href={href}
          variant="light"
          color="button-gray"
          compact
        >
          {label}
        </Button>
      ))}
    </Flex>
  )
}

export default NavList
