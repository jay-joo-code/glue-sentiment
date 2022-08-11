import { Container, ContainerProps } from "@mantine/core"
import React from "react"

const ClickableContainer = React.forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { children, ...rest } = props
    return (
      <Container
        ref={ref}
        sx={(theme) => ({
          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            cursor: "pointer",
            borderRadius: "8px",

            "&:hover": {
              background: theme.colors.gray[0],
            },
          },
        })}
        {...rest}
      >
        {children}
      </Container>
    )
  }
)

ClickableContainer.displayName = "ClickableContainer"

export default ClickableContainer
