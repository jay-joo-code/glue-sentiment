import { MediaQuery, MediaQueryProps } from "@mantine/core"
import React from "react"

interface IGlueResponsiveRenderProps extends Omit<MediaQueryProps, "styles"> {
  renderIn: "mobile" | "desktop"
}

const GlueResponsiveRender = ({
  renderIn,
  children,
  ...rest
}: IGlueResponsiveRenderProps) => {
  if (renderIn === "mobile") {
    return (
      <MediaQuery largerThan="xs" styles={{ display: "none" }} {...rest}>
        {children}
      </MediaQuery>
    )
  }

  return (
    <MediaQuery smallerThan="xs" styles={{ display: "none" }} {...rest}>
      {children}
    </MediaQuery>
  )
}

export default GlueResponsiveRender
