import prisma from "lib/glue/prisma"

const refactorDatabase = async () => {
  // await prisma.topic.updateMany({
  //   where: {
  //     isInitialized: true,
  //   },
  //   data: {
  //     isInitialized: false,
  //   },
  // })
  // const dataArray = await prisma.topic.findMany({

  // })

  // for (var i = 0; i < dataArray.length; i++) {
  //   await new Promise<void>(async (next) => {
  //     const data = dataArray[i]

  //     if (data?.aliases?.length > 0) {
  //       const topic = await prisma.topic.update({
  //         where: {
  //           id: data?.id,
  //         },
  //         data: {
  //           aliasesString: data?.aliases?.join(" "),
  //         },
  //       })
  //       console.log(
  //         "updated",
  //         topic?.name,
  //         topic?.aliases,
  //         topic?.aliasesString
  //       )
  //     }

  //     next()
  //   })
  // }

  console.log("refactor complete")
}

export default refactorDatabase
