import api from "lib/glue/api"

export interface IRedditComment {
  body: string
  responseTo: string
  permalink: string
  ups: number
  createdAt: Date
  sentimentScore?: number
  stars?: number // 0.5 - 5.0
}

export interface IFetchSentimentArgs {
  content: string
  GOOGLE_API_KEY: string
}

export const fetchSentiment = async ({
  content,
  GOOGLE_API_KEY,
}: IFetchSentimentArgs) => {
  const URL = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${GOOGLE_API_KEY}`

  const { data } = await api.post(URL, {
    document: {
      content,
      type: "PLAIN_TEXT",
    },
    encodingType: "UTF32",
  })

  return data
}

function roundHalf(num) {
  return Math.round(num * 2) / 2
}

export const scoreToStars = (score: number) => {
  const stars = ((score + 1) / 2) * 5
  const roundedStars = Math.round(stars * 2) / 2

  if (roundedStars === 0) return 0.5
  return roundedStars
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
  const allComments: IRedditComment[] = []

  const { data } = await api.get(
    `https://www.reddit.com/r/Cornell/search/.json?q=${encodeURIComponent(
      query
    )}&limit=30&restrict_sr=1&sr_nsfw=`
  )

  const recurseReplies = (replies, url, responseTo) => {
    if (!replies) return

    replies?.data?.children?.map((reply) => {
      // console.log(
      //   "reply",
      //   url,
      //   reply?.data?.body,
      //   reply?.data?.ups,
      //   reply?.data?.permalink,
      //   reply?.data?.replies,
      //   {
      //     body: reply?.data?.body,
      //     permalink: reply?.data?.permalink,
      //     ups: reply?.data?.ups,
      //     createdAt: new Date(reply?.data?.created_utc),
      //   }
      // )
      allComments.push({
        body: reply?.data?.body,
        responseTo,
        permalink: reply?.data?.permalink,
        ups: reply?.data?.ups,
        createdAt: new Date(reply?.data?.created_utc),
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
        // console.log(
        //   "postData",
        //   post?.data?.url,
        //   comment?.data?.body,
        //   comment?.data?.ups,
        //   comment?.data?.permalink,
        //   comment?.data?.replies
        // )
        allComments.push({
          body: comment?.data?.body,
          responseTo: postData[0]?.data?.children[0]?.data?.title,
          permalink: comment?.data?.permalink,
          ups: comment?.data?.ups,
          createdAt: new Date(comment?.data?.created_utc),
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

  // allComments?.forEach((comment) => {
  //   console.log("comment?.body", comment?.body)
  // })

  // console.log("allComments?.length", allComments?.length)

  const filteredComments = allComments?.filter((comment) => {
    // hasKeyword set to true if includes any string in the array of strings
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
        hasKeyword = comment?.body?.includes(querySplit[1])
      }
    }
    // TODO: filter for dorm variant

    return hasKeyword && comment?.ups > 1
  })

  const sentimentPromises = filteredComments?.map(async (comment) => {
    const { documentSentiment } = await fetchSentiment({
      content: comment?.body,
      GOOGLE_API_KEY,
    })
    comment.sentimentScore = documentSentiment?.score
    comment.stars = scoreToStars(documentSentiment?.score)
    return comment
  })

  const populatedComments = await Promise.all(sentimentPromises)

  populatedComments.sort((commentA, commentB) => commentB?.ups - commentA?.ups)

  populatedComments?.forEach((comment) => {
    console.log(comment?.ups, comment?.stars, comment?.body)
  })

  return populatedComments
}
