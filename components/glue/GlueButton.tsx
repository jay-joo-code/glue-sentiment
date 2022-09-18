import * as amplitude from "@amplitude/analytics-browser"
import { Button, ButtonProps } from "@mantine/core"
import React from "react"
import { toKebabCase } from "util/glue/strings"
import { PolymorphicComponentProps } from "@mantine/utils"

interface IGlueButtonProps
  extends PolymorphicComponentProps<"button", ButtonProps> {}

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
