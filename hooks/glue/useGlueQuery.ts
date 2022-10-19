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

type IUpdateVariant =
  | "update"
  | "update-item"
  | "append-start"
  | "append-end"
  | "delete"
  | "delete-item"

interface IOptimisticUpdate {
  variant: IUpdateVariant
  itemData: any
  asyncRequest: (prevData: any) => any
  rollbackOnError?: boolean
  refetchAfterRequest?: boolean
}

const useGlueQuery = (config: IGlueQueryConfig = {}) => {
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
  const swrData = useSWR(swrKey, { ...refetchConfig, ...rest })

  const update = (updateArg: Function | IUpdateVariant, data?: any) => {
    if (typeof updateArg === "string") {
      switch (updateArg) {
        case "update":
          {
            swrData?.mutate(data, {
              revalidate: false,
            })
          }
          break
        case "update-item":
          {
            swrData?.mutate(
              async (prevData) => {
                const newData = prevData?.map((item: any) => {
                  if (item?.id === data?.id) {
                    return {
                      ...item,
                      ...data,
                    }
                  }
                  return item
                })
                return newData
              },
              {
                revalidate: false,
              }
            )
          }
          break
        case "delete":
          {
            swrData?.mutate(
              async () => {
                return null
              },
              {
                revalidate: false,
              }
            )
          }
          break
        case "delete-item":
          {
            swrData?.mutate(
              async (prevData) => {
                const newData = prevData?.filter(
                  (item) => item?.id !== data?.id
                )
                return newData
              },
              {
                revalidate: false,
              }
            )
          }
          break
        case "append-start":
          {
            swrData?.mutate(
              async (prevData) => {
                const newData = [data, ...prevData]
                return newData
              },
              {
                revalidate: false,
              }
            )
          }
          break
        case "append-end":
          {
            swrData?.mutate(
              async (prevData) => {
                const newData = [...prevData, data]
                return newData
              },
              {
                revalidate: false,
              }
            )
          }
          break
      }
    } else if (typeof updateArg === "function") {
      swrData?.mutate(
        async (prevData) => {
          const res = await updateArg(prevData)
          return res
        },
        {
          revalidate: false,
        }
      )
    }
  }

  /**
   * @deprecated in favor of update
   */
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
    update,
    optimisticUpdate,
    refetch: swrData?.mutate,
    isLoading: swrData?.isValidating,
    swrKey,
  }
}

export default useGlueQuery
