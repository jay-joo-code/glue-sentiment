import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core"
import useIsMobile from "hooks/glue/isMobile"
import React from "react"

interface IIconButtonProps extends ActionIconProps<"button"> {
  tooltipLabel?: string
  position?: "bottom" | "left" | "right" | "top"
}

const IconButton = ({
  tooltipLabel,
  position,
  children,
  ...rest
}: IIconButtonProps) => {
  const isMobile = useIsMobile()

  if (tooltipLabel) {
    return (
      <Tooltip label={tooltipLabel} position={position} disabled={isMobile}>
        <ActionIcon {...rest}>{children}</ActionIcon>
      </Tooltip>
    )
  }

  return <ActionIcon {...rest}>{children}</ActionIcon>
}

export default IconButton
