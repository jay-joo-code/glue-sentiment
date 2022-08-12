import api from "lib/glue/api"
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
  variant: "create" | "update" | "append-start" | "append-end" | "delete"
  itemData: any
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

  const optimisticUpdate = <T>({
    variant,
    itemData,
    asyncRequest,
  }: IOptimisticUpdate) => {
    if (Array.isArray(queryData?.data)) {
      if (variant === "update") {
        const newData = queryData?.data?.map((item) => {
          if (item?.id === itemData?.id) {
            return {
              ...item,
              ...itemData,
            }
          }
          return item
        })
        queryData?.mutate(
          async () => {
            const res = await asyncRequest(queryData?.data)
            return res
          },
          {
            optimisticData: newData as any,
            rollbackOnError: true,
            revalidate: false,
          }
        )
      }
    } else {
    }
  }

  return {
    ...queryData,
    optimisticUpdate,
    refetch: queryData?.mutate,
  }
}

export default useGlueQuery
