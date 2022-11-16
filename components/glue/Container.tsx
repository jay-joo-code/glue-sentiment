import * as amplitude from "@amplitude/analytics-browser"
import {
  Container as MantineContainer,
  ContainerProps,
  CSSObject,
  MantineTheme,
  useMantineTheme,
} from "@mantine/core"
import React from "react"
import { toKebabCase } from "util/glue/strings"
import { PolymorphicComponentProps } from "@mantine/utils"

interface IContainerProps
  extends Omit<PolymorphicComponentProps<"div", ContainerProps>, "sx"> {
  glueKey?: string
  isClickable?: boolean
  clickableHoverColor?: string
  sx?: (theme?: MantineTheme) => CSSObject
}

const Container = React.forwardRef<HTMLDivElement, IContainerProps>(
  (props, ref) => {
    const {
      onClick,
      children,
      glueKey,
      isClickable = false,
      clickableHoverColor,
      sx,
      ...rest
    } = props

    const handleTrackedClick = (event: React.MouseEvent<HTMLDivElement>) => {
      amplitude.track(`container-click-${toKebabCase(glueKey || "")}`)

      if (onClick) {
        onClick(event)
      }
    }

    const theme = useMantineTheme()
    const sxObj = sx ? sx(theme) : {}

    return (
      <MantineContainer
        ref={ref}
        onClick={handleTrackedClick}
        sx={(theme) => ({
          cursor: isClickable && "pointer",
          "&:hover": {
            background:
              isClickable && (clickableHoverColor || theme.colors.gray[0]),
          },
          ...sxObj,
        })}
        {...rest}
      >
        {children}
      </MantineContainer>
    )
  }
)

Container.displayName = "Container"

export default Container
