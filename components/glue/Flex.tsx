import {
  CSSObject,
  Group,
  GroupProps,
  MantineTheme,
  Stack,
  useMantineTheme,
} from "@mantine/core"
import React from "react"

interface IFlexProps extends GroupProps {
  justify?: React.CSSProperties["alignItems"]
  sx?: (theme?: MantineTheme) => CSSObject
  direction?: "row" | "column"
}

const Flex = ({
  justify,
  grow,
  sx,
  direction = "row",
  ...rest
}: IFlexProps) => {
  const theme = useMantineTheme()
  const sxObj = sx ? sx(theme) : {}

  if (direction === "row") {
    return (
      <Group
        sx={(theme) => ({
          justifyContent: justify,
          flexGrow: grow ? 1 : 0,
          ...sxObj,
        })}
        {...rest}
      />
    )
  }

  return (
    <Stack
      sx={(theme) => ({
        justifyContent: justify,
        flexGrow: grow ? 1 : 0,
        ...sxObj,
      })}
      {...rest}
    />
  )
}

export default Flex
