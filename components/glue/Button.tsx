import * as amplitude from "@amplitude/analytics-browser"
import { Button as MantineButton, ButtonProps } from "@mantine/core"
import React from "react"
import { toKebabCase } from "util/glue/strings"
import { PolymorphicComponentProps } from "@mantine/utils"

interface IButtonProps
  extends PolymorphicComponentProps<"button", ButtonProps> {}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  (props, ref) => {
    const { onClick, children, ...rest } = props

    const handleTrackedClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      amplitude.track(`button-click-${toKebabCase(children as string)}`)

      if (onClick) {
        onClick(event)
      }
    }

    return (
      <MantineButton ref={ref} {...rest} onClick={handleTrackedClick}>
        {children}
      </MantineButton>
    )
  }
)

Button.displayName = "Button"

export default Button
