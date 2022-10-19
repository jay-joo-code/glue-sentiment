import { useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

const useIsDevice = () => {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm}px)`,
    false,
    {
      getInitialValueInEffect: true,
    }
  )
  const isBiggerThanMobile = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm}px)`,
    false,
    {
      getInitialValueInEffect: true,
    }
  )
  const isSmallerThanDesktop = useMediaQuery(
    `(max-width: ${theme.breakpoints.md}px)`,
    false,
    {
      getInitialValueInEffect: true,
    }
  )
  const isDesktop = useMediaQuery(
    `(min-width: ${theme.breakpoints.md}px)`,
    false,
    {
      getInitialValueInEffect: true,
    }
  )

  return {
    isMobile,
    isTablet: isBiggerThanMobile && isSmallerThanDesktop,
    isDesktop,
  }
}

export default useIsDevice
