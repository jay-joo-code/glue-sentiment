import { Container, ContainerProps } from "@mantine/core"
import React from "react"

const ClickableContainer = ({ children, ...rest }: ContainerProps) => {
  return (
    <Container
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

export default ClickableContainer
