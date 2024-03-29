import api from "lib/glue/api"
import markdownToTxt from "markdown-to-txt"

const unixTimestampToDate = (secondsSince: number) => {
  const date = new Date(0)
  date.setUTCSeconds(secondsSince)
  return date
}

export interface IFetchRedditCommentsArgs {
  query: string
  variant: "course" | "dorm"
  GOOGLE_API_KEY: string
}

export const fetchRedditComments = async ({
  query,
  variant,
  GOOGLE_API_KEY,
}: IFetchRedditCommentsArgs) => {
  const allComments: any[] = []

  const { data } = await api.get(
    `https://www.reddit.com/r/Cornell/search/.json?q=${encodeURIComponent(
      query
    )}&limit=30&restrict_sr=1&sr_nsfw=`
  )

  const recurseReplies = (replies, url, responseTo) => {
    if (!replies) return

    replies?.data?.children?.map((reply) => {
      allComments.push({
        ...reply?.data,
        responseTo,
        createdAt: unixTimestampToDate(reply?.data?.created_utc),
      })
      recurseReplies(reply?.data?.replies, url, reply?.data?.body)
    })
  }

  const promises = data?.data?.children?.map(async (post) => {
    const { data: postData } = await api.get(
      `https://www.reddit.com${post?.data?.permalink}.json`
    )
    if (postData && postData?.length >= 2) {
      const comments = postData[1]?.data?.children
      comments.map((comment) => {
        allComments.push({
          ...comment?.data,
          responseTo: postData[0]?.data?.children[0]?.data?.title,
          createdAt: unixTimestampToDate(comment?.data?.created_utc),
        })
        recurseReplies(
          comment?.data?.replies,
          post?.data?.url,
          comment?.data?.body
        )
      })
    }
  })

  await Promise.all(promises)

  let filteredComments = allComments?.filter((comment) => {
    // NOTE: hasKeyword set to true if includes any string in the array of strings
    // const matcher = queryKeywords
    //   .filter((part) => part.trim().length !== 0)
    //   .map((part) => `${part}`)
    //   .join("|")
    // const re = new RegExp(`\\b(${matcher})\\b`, "gi")
    // hasKeyword = re.test(comment?.body)

    let hasKeyword = false

    if (variant === "course") {
      const querySplit = query?.split(" ")
      if (querySplit?.length === 2) {
        const isBodyRelevant = comment?.body?.includes(querySplit[1])
        const isResponseToRelevant = comment?.responseTo?.includes(
          querySplit[1]
        )
        hasKeyword = isBodyRelevant || isResponseToRelevant

        if (!isBodyRelevant && isResponseToRelevant) {
          comment.body = `Re: ${comment?.responseTo}\n\n${comment?.body}`
        }
      }
    }

    const isIrrelevant =
      comment?.body?.includes("[deleted]") ||
      comment?.body?.toLowerCase()?.includes("another great look for") ||
      comment?.body?.toLowerCase()?.includes("schedule") ||
      comment?.body?.trim()?.slice(-1) === "?"

    return hasKeyword && comment?.ups > 0 && !isIrrelevant
  })

  if (filteredComments?.length >= 40) {
    filteredComments = filteredComments?.filter((comment) => comment?.ups > 1)
  }

  return filteredComments?.map((comment) => {
    return {
      ...comment,
      body: markdownToTxt(comment?.body),
    }
  })
}
