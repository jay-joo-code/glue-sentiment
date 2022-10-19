import useSWR, { SWRConfiguration } from "swr"

/* NOTE:
useSWRInfinite has terrible support for mutate, optimistic updates
but it's also basically impossible to implement inf scroll with useSwrQuery
so I have to use useSWRInfinite even if it's horrible

I have to use unstable_serialize to access the key,
which might be removed in future versions of swr.
But hopefully, that future version will have better mutation support.

Ended up building GlueInfiniteScroll.tsx separately. fml.
*/

// NOTE: cache.get(key) straight up doesn't work in this swr version (wtf?)

export interface IGlueQueryConfig extends SWRConfiguration {
  url?: string
  args?: any
  disabled?: boolean
  autoRefetch?: boolean
}

interface IOptimisticUpdate<T = any> {
  variant: "create" | "update" | "append-start" | "append-end" | "delete"
  itemData: any
  asyncRequest: (prevData: T) => T
  rollbackOnError?: boolean
  refetchAfterRequest?: boolean
}

const useGlueQuery = <T = any>(config: IGlueQueryConfig = {}) => {
  const {
    url,
    args = {},
    disabled = false,
    autoRefetch = true,
    ...rest
  } = config || {}
  const swrKey = !config || disabled ? null : { url, args }
  const refetchConfig = autoRefetch
    ? {}
    : {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
  const swrData = useSWR<T>(swrKey, { ...refetchConfig, ...rest })
  const optimisticUpdate = <T>({
    variant,
    itemData,
    asyncRequest,
    rollbackOnError = true,
    refetchAfterRequest = false,
  }: IOptimisticUpdate) => {
    if (Array.isArray(swrData?.data)) {
      switch (variant) {
        case "update":
          {
            const newData = swrData?.data?.map((item) => {
              if (item?.id === itemData?.id) {
                return {
                  ...item,
                  ...itemData,
                }
              }
              return item
            })
            swrData?.mutate(
              async () => {
                const res = await asyncRequest(swrData?.data)
                return res
              },
              {
                optimisticData: newData as any,
                rollbackOnError,
                revalidate: refetchAfterRequest,
              }
            )
          }
          break
        case "delete":
          {
            const newData = swrData?.data?.filter(
              (item) => item?.id !== itemData?.id
            )
            swrData?.mutate(
              async () => {
                const res = await asyncRequest(swrData?.data)
                return res
              },
              {
                optimisticData: newData as any,
                rollbackOnError,
                revalidate: refetchAfterRequest,
              }
            )
          }
          break
        case "append-end":
          {
            const newData = [...swrData?.data, itemData]
            swrData?.mutate(
              async () => {
                await asyncRequest(swrData?.data)
                return newData as any
              },
              {
                optimisticData: newData as any,
                rollbackOnError,
                revalidate: refetchAfterRequest,
              }
            )
          }
          break
      }
    }
  }

  return {
    ...swrData,
    optimisticUpdate,
    refetch: swrData?.mutate,
    isLoading: swrData?.isValidating,
    swrKey,
  }
}

export default useGlueQuery
