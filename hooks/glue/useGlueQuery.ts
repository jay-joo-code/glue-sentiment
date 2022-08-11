import useSWRImmutable from "swr/immutable"
import useSWR, { SWRConfiguration } from "swr"

interface IGlueQueryConfig extends SWRConfiguration {
  url: string
  args?: any
  variant?: "default" | "static" | "infinite-scroll"
}

const useGlueQuery = <T = any>({
  url,
  args = {},
  variant = "default",
  ...rest
}: IGlueQueryConfig) => {
  const defaultQueryData = useSWR<T>(
    {
      url,
      args,
    },
    { ...rest }
  )

  const staticQueryData = useSWRImmutable<T>(
    {
      url,
      args,
    },
    { ...rest }
  )

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
