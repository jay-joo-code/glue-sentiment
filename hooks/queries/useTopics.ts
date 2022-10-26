import useGlueQuery from "hooks/glue/useGlueQuery"

export interface IUseTopicsArgs {
  categoryName: string
  query: string
  orderBy?: string
}

export const queryConfigTopics = ({ categoryName, query }: IUseTopicsArgs) => ({
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
      category: {
        name: categoryName,
      },
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
    parseConfig: {
      parseNumbers: false,
    },
  },
})

const useTopics = ({ categoryName, query }: IUseTopicsArgs) => {
  return useGlueQuery(
    queryConfigTopics({
      categoryName,
      query,
    })
  )
}

export default useTopics
