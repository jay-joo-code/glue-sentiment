import prisma from "lib/glue/prisma"
import { fetchRedditComments } from "./scrapeReddit"

const refactorDatabase = async () => {
  // const rawData = await fetchRedditComments({
  //   query: "PAM 2300",
  //   variant: "course",
  //   GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  // })
  // console.log("rawData", rawData?.length)

  console.log("refactor complete")
}

export default refactorDatabase
