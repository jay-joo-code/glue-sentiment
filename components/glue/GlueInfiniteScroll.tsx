import useOnScreen from "hooks/glue/useOnScreen"
import { useEffect, useRef, useState } from "react"
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

interface IInfiniteOptimisticUpdate<T = any> {
  variant: "create" | "update" | "append-start" | "append-end" | "delete"
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
    optimisticUpdate,
    refetch: infiniteMutate,
    isLoading: swrData?.isValidating,
  }

  return (
    <div>
      {children(providedData)}
      <div ref={ref}>
        {hasMore && isLoadingMore && <div>{loader || "loading..."}</div>}
      </div>
    </div>
  )
}

export default GlueInfiniteScroll
