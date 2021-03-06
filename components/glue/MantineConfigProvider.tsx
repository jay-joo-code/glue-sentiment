import { MantineProvider } from "@mantine/core"
import { NextLink } from "@mantine/next"
import React from "react"

interface IMantineConfigProviderProps {
  children: React.ReactNode
}

const MantineConfigProvider = ({ children }: IMantineConfigProviderProps) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        primaryColor: "brand",
        colors: {
          // don't override gray, dark colors
          // because a lot of default component styles
          // depend on them
          brand: [
            "#F7FCFF",
            "#F3FAFF",
            "#E7F5FF",
            "#74C0FC",
            "#4DABF7",
            "#339AF0",
            "#228BE6",
            "#1C7ED6",
            "#1971C2",
            "#1864AB",
          ],
          "button-dark": [
            "#F5F5F5",
            "#E0E1E2",
            "#D6D6D8",
            "#C1C2C5",
            "#A6A7AB",
            "#909296",
            "#5C5F66",
            "#373A40",
            "#2C2E33",
            "#1A1B1E",
          ],
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 12,
          lg: 20,
          xl: 28,
        },
      }}
      defaultProps={{
        Text: { component: "p" },
        Paper: {
          p: "md",
          radius: "md",
        },
        ActionIcon: {
          variant: "light",
          color: "dark",
        },
        Tooltip: {
          transition: "fade",
          position: "bottom",
          placement: "center",
        },
        Menu: {
          transition: "fade",
          p: "sm",
        },
        Container: {
          p: 0,
        },
      }}
    >
      {children}
    </MantineProvider>
  )
}

export default MantineConfigProvider
