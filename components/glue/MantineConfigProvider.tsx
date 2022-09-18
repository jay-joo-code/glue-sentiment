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
            "#F6F9FF",
            "#EDF2FF",
            "#DBE4FF",
            "#BAC8FF",
            "#91A7FF",
            "#748FFC",
            "#5C7CFA",
            "#4C6EF5",
            "#4263EB",
            "#3B5BDB",
          ],
          "button-gray": [
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

          // text array values
          //  0      1           2      3
          // [muted, very light, light, regular]
          text: ["#BCC8D5", "#9AADC0", "#617181", "#3B4550"],
        },
        spacing: {
          xs: 8,
          sm: 12,
          md: 16,
          lg: 20,
          xl: 28,
        },
        fontSizes: {
          md: 16,
          lg: 20,
          xl: 24,
        },
        components: {
          Text: {
            defaultProps: {
              component: "p",
            },
            styles: {
              root: {
                lineHeight: "1.2",
                whiteSpace: "pre-line",
              },
            },
          },
          Title: {
            styles: {
              root: {
                fontWeight: 600,
              },
            },
          },
          Paper: {
            defaultProps: {
              radius: "md",
            },
          },
          ActionIcon: {
            defaultProps: {
              variant: "light",
              color: "dark",
            },
          },
          Tooltip: {
            defaultProps: {
              transition: "fade",
              position: "bottom",
              placement: "center",
            },
          },
          Menu: {
            defaultProps: {
              transition: "fade",
            },
          },
          Container: {
            defaultProps: {
              p: 0,
              m: 0,
            },
            styles: {
              root: {
                maxWidth: "unset",
              },
            },
          },
        },
      }}
    >
      {children}
    </MantineProvider>
  )
}

export default MantineConfigProvider
