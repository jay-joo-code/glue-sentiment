import useGlueQuery from "hooks/glue/useGlueQuery"

export interface IUseTopicsArgs {
  categoryId: number
  query: string
  orderBy?: string
}

export const queryConfigTopics = ({ categoryId, query }: IUseTopicsArgs) => ({
  url: "/glue/topics",
  args: {
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          aliasesString: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          subtitle: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
      categoryId,
    },
    include: {
      _count: {
        select: { reviews: true },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      reviews: {
        _count: "desc",
      },
    },
  },
})

const useTopics = ({ categoryId, query }: IUseTopicsArgs) => {
  return useGlueQuery(
    queryConfigTopics({
      categoryId,
      query,
    })
  )
}

export default useTopics
