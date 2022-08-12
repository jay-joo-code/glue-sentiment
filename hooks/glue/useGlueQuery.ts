import useSWR, { SWRConfiguration } from "swr"
import useSWRImmutable from "swr/immutable"

// NOTE: useSWRInfinite is unusable
// it has terrible support for mutate, optimistic updates

interface IGlueQueryConfig extends SWRConfiguration {
  url?: string
  args?: any
  disabled?: boolean
  autoRefetch?: boolean
}

interface IOptimisticUpdate<T = any> {
  variant: "update" | "append-start" | "append-end" | "delete"
  itemData: T
  asyncRequest: (prevData: T) => T
}

const useGlueQuery = <T = any>(config: IGlueQueryConfig = {}) => {
  const {
    url,
    args = {},
    disabled = false,
    autoRefetch = true,
    ...rest
  } = config || {}
  const queryConfig = !config || disabled ? null : { url, args }
  const refetchConfig = autoRefetch
    ? {}
    : {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
  const queryData = useSWR<T>(queryConfig, { ...refetchConfig, ...rest })

  const optimisticUpdate = ({
    variant,
    itemData,
    asyncRequest,
  }: IOptimisticUpdate) => {}

  return {
    ...queryData,
  }
}

export default useGlueQuery
