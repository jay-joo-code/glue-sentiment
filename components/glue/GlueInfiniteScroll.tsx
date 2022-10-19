import { Container } from "@mantine/core"
import useOnScreen from "hooks/glue/useOnScreen"
import { useEffect, useRef, useState } from "react"
import Skeleton from "react-loading-skeleton"
import { useSWRConfig } from "swr"
import useSWRInfinite, {
  SWRInfiniteResponse,
  unstable_serialize,
} from "swr/infinite"

type IMutationFn = (prevPages: any) => any

interface IProvidedData extends SWRInfiniteResponse {
  optimisticUpdate: (args: IInfiniteOptimisticUpdate) => void
  data: any[]
  mutate: (mutationFn?: IMutationFn) => any
  refetch: (mutationFn?: IMutationFn) => any
  isLoading: boolean
}

// TODO: improve type definitions
interface IGlueInfiniteScrollProps {
  children: (providedData: IProvidedData) => any
  queryConfig: {
    url: string
    args?: any
  }
  limit: number
  loader?: React.ReactNode
}

type IUpdateVariant =
  | "update"
  | "update-item"
  | "append-start"
  | "append-end"
  | "delete"
  | "delete-item"

interface IInfiniteOptimisticUpdate<T = any> {
  variant: IUpdateVariant
  itemData: any
  asyncRequest: (prevData: T) => T
}

const GlueInfiniteScroll = ({
  children,
  loader,
  queryConfig,
  limit,
}: IGlueInfiniteScrollProps) => {
  const ref = useRef()
  const isVisible = useOnScreen(ref)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) {
      setHasMore(false)
      return null
    }

    return {
      url: queryConfig?.url,
      args: {
        ...queryConfig?.args,
        limit,
        page: pageIndex,
      },
    }
  }

  const { data, error, size, setSize, ...swrData } = useSWRInfinite(getKey, {
    revalidateFirstPage: false,
    revalidateAll: false,
  })

  const { mutate } = useSWRConfig()

  const flattedData = []

  if (data) {
    const ids = new Set()
    data?.forEach((page) =>
      page?.forEach((item) => {
        if (!ids.has(item?.id)) {
          flattedData?.push(item)
          ids.add(item?.id)
        }
      })
    )
  }

  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined")

  useEffect(() => {
    if (hasMore && isVisible) {
      setSize(size + 1)
    }
  }, [isVisible, hasMore])

  const update = (updateArg: Function | IUpdateVariant, data?: any) => {
    if (typeof updateArg === "string") {
      switch (updateArg) {
        case "update":
          {
            mutate(
              unstable_serialize(getKey),
              async (pages) => {
                return {
                  ...pages,
                  ...data,
                }
              },
              {
                revalidate: false,
              }
            )
          }
          break
        case "update-item":
          {
            mutate(
              unstable_serialize(getKey),
              (pages) => {
                return pages?.map((page) =>
                  page?.map((item) => {
                    if (item?.id === data?.id) {
                      return {
                        ...item,
                        ...data,
                      }
                    }
                    return item
                  })
                )
              },
              false
            )
          }
          break
        case "delete":
          {
            mutate(
              unstable_serialize(getKey),
              async () => {
                return null
              },
              false
            )
          }
          break
        case "delete-item":
          {
            mutate(
              unstable_serialize(getKey),
              async (pages) => {
                return pages?.map((page) =>
                  page?.filter((item) => item?.id !== data?.id)
                )
              },
              false
            )
          }
          break
        // TODO:
        // case "append-start":
        //   {
        //     mutate(
        //       unstable_serialize(getKey),
        //       async (pages) => {
        //         const newData = [data, ...pages]
        //         return newData
        //       },
        //       false
        //     )
        //   }
        //   break
        // TODO:
        // case "append-end":
        //   {
        //     mutate(
        //       unstable_serialize(getKey),
        //       async (pages) => {
        //         const newData = [...pages, data]
        //         return newData
        //       },
        //       false
        //     )
        //   }
        //   break
      }
    } else if (typeof updateArg === "function") {
      mutate(
        unstable_serialize(getKey),
        async (pages) => {
          const res = await updateArg(pages)
          return res
        },
        false
      )
    }
  }

  /**
   * @deprecated in favor of update
   */
  const optimisticUpdate = ({
    variant,
    itemData,
    asyncRequest,
  }: IInfiniteOptimisticUpdate) => {
    // NOTE: currently, swr doesn't support rollbacks for swr infinite
    switch (variant) {
      case "update":
        {
          mutate(
            unstable_serialize(getKey),
            (pages) => {
              return pages?.map((page) =>
                page?.map((item) => {
                  if (item?.id === itemData?.id) {
                    asyncRequest(item)
                    return {
                      ...item,
                      ...itemData,
                    }
                  }
                  return item
                })
              )
            },
            false
          )
        }
        break
      case "delete":
        {
          mutate(
            unstable_serialize(getKey),
            (pages) => {
              asyncRequest(itemData)
              return pages?.map((page) =>
                page?.filter((item) => item?.id !== itemData?.id)
              )
            },
            false
          )
        }
        break
    }
  }

  const infiniteMutate = (mutationFn?: IMutationFn) => {
    mutate(unstable_serialize(getKey), mutationFn, false)
  }

  const providedData = {
    ...swrData,
    data: flattedData,
    error,
    size,
    setSize,
    mutate: infiniteMutate,
    update,
    optimisticUpdate,
    refetch: infiniteMutate,
    isLoading: swrData?.isValidating,
    swrKey: unstable_serialize(getKey),
  }

  const defaultLoader = (
    <Container>
      {[...Array(limit)].map((_, idx) => (
        <Container key={idx} mb="md">
          <Skeleton height={100} />
        </Container>
      ))}
    </Container>
  )

  return (
    <div>
      {children(providedData)}
      <div ref={ref}>
        {hasMore && isLoadingMore && <div>{loader || defaultLoader}</div>}
      </div>
    </div>
  )
}

export default GlueInfiniteScroll
