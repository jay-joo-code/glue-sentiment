import useSWRImmutable from "swr/immutable"
import useSWR, { SWRConfiguration } from "swr"

interface IGlueQueryConfig extends SWRConfiguration {
  url?: string
  args?: any
  variant?: "default" | "static" | "infinite-scroll"
  disabled?: boolean
}

const useGlueQuery = <T = any>(config: IGlueQueryConfig = {}) => {
  const {
    url,
    args = {},
    variant = "default",
    disabled = false,
    ...rest
  } = config || {}
  const queryConfig = !config || disabled ? null : { url, args }
  const defaultQueryData = useSWR<T>(queryConfig, { ...rest })
  const staticQueryData = useSWRImmutable<T>(queryConfig, { ...rest })

  if (variant === "default") {
    return defaultQueryData
  } else if (variant === "static") {
    return staticQueryData
  } else if (variant === "infinite-scroll") {
    // TODO:
    return
  }
}

export default useGlueQuery
