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
  const swrData = useSWR<T>(queryConfig, { ...refetchConfig, ...rest })
  const optimisticUpdate = <T>({
    variant,
    itemData,
    asyncRequest,
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
                rollbackOnError: true,
                revalidate: false,
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
                rollbackOnError: true,
                revalidate: false,
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
  }
}

export default useGlueQuery
