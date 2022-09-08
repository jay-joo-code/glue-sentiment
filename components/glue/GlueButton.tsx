import * as amplitude from "@amplitude/analytics-browser"
import { Button, ButtonProps } from "@mantine/core"
import React from "react"
import { toKebabCase } from "util/glue/strings"

interface IGlueButtonProps extends ButtonProps<"button"> {}

const GlueButton = React.forwardRef<HTMLButtonElement, IGlueButtonProps>(
  (props, ref) => {
    const { onClick, children, ...rest } = props

    const handleTrackedClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      amplitude.track(`button-click-${toKebabCase(children as string)}`)

      if (onClick) {
        onClick(event)
      }
    }

    return (
      <Button ref={ref} {...rest} onClick={handleTrackedClick}>
        {children}
      </Button>
    )
  }
)

GlueButton.displayName = "GlueButton"

export default GlueButton
