import { Button, ButtonProps } from "@mantine/core"
import React from "react"
import ReactGA from "react-ga4"

interface IGlueButtonProps extends ButtonProps<"button"> {}

const GlueButton = React.forwardRef<HTMLButtonElement, IGlueButtonProps>(
  (props, ref) => {
    const { onClick, children, ...rest } = props

    const handleTrackedClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      ReactGA.event({
        category: "Button",
        action: "Button click",
        label: children as string,
      })
      onClick(event)
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
