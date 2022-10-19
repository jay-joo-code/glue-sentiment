import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core"
import useIsDevice from "hooks/glue/useIsDevice"
import { PolymorphicComponentProps } from "@mantine/utils"
import React from "react"

interface IIconButtonProps
  extends PolymorphicComponentProps<"button", ActionIconProps> {
  tooltipLabel?: string
  position?: "bottom" | "left" | "right" | "top"
}

const IconButton = React.forwardRef<HTMLButtonElement, IIconButtonProps>(
  ({ tooltipLabel, position, children, ...rest }, ref) => {
    const { isMobile } = useIsDevice()

    if (tooltipLabel) {
      return (
        <Tooltip label={tooltipLabel} position={position} disabled={isMobile}>
          <ActionIcon ref={ref} {...rest}>
            {children}
          </ActionIcon>
        </Tooltip>
      )
    }

    return <ActionIcon {...rest}>{children}</ActionIcon>
  }
)

IconButton.displayName = "IconButton"

export default IconButton
