import axios from "axios"
import prisma from "lib/glue/prisma"

export type ISemesterSlug = "SP22" | "FA21" | "SP21" | "FA20"
export type ISubjectSlug = string

const BASE_URL = "https://classes.cornell.edu/api/2.0"

export const fetchSubjects = async (semester: ISemesterSlug) => {
  try {
    const result = await axios.get(
      `${BASE_URL}/config/subjects.json?roster=${semester}`
    )

    if (result.status !== 200) {
      return []
    }
    return result.data.data.subjects
  } catch (error) {
    return error.response
  }
}

export const fetchClasses = async (
  semester: ISemesterSlug,
  subjectSlug: ISubjectSlug
) => {
  try {
    const result = await axios.get(
      `${BASE_URL}/search/classes.json?roster=${semester}&subject=${subjectSlug}`
    )

    if (result.status !== 200) {
      return []
    }
    return result.data.data.classes
  } catch (error) {
    return error.response
  }
}

export const fetchAllClassesBySubject = (
  subjectSlug: ISubjectSlug
): Promise<any[]> =>
  new Promise((resolve, reject) => {
    ;(async () => {
      const slugs = ["SP22", "FA21", "SP21", "FA20"]

      const promises = slugs.map(
        (slug) =>
          new Promise<any[]>((resolve, reject) => {
            ;(async () => {
              try {
                resolve(
                  (
                    await axios.get(
                      `${BASE_URL}/search/classes.json?roster=${slug}&subject=${subjectSlug}`
                    )
                  ).data.data.classes
                )
              } catch (error) {
                resolve([])
              }
            })()
          })
      )

      Promise.all(promises)
        .then((classesBySemester: any[][]) => {
          const crseIds = {}
          const mergedClasses: any[] = []
          classesBySemester.forEach((classes: any[]) => {
            classes.forEach((classData) => {
              if (!crseIds[classData.crseId]) {
                // if this class has not been added before,
                // add it
                crseIds[classData.crseId] = classData.crseId
                mergedClasses.push(classData)
              }
            })
          })
          resolve(mergedClasses)
        })
        .catch((e) => reject(e))
    })()
  })

export const fetchAllClasses = (): Promise<boolean> =>
  new Promise((resolve) => {
    ;(async () => {
      const courseCategory = await prisma.category.findFirst({
        where: {
          name: "course",
        },
      })

      const subjects = await fetchSubjects("SP22")
      const allClasses = []
      const promises = subjects.map(
        ({ value }, idx): Promise<void> =>
          new Promise((resolve) => {
            setTimeout(() => {
              ;(async () => {
                const classes = await fetchAllClassesBySubject(value)

                // NOTE: synchronus save
                // classes?.forEach((classData) => allClasses.push(classData))

                const savePromises = classes?.map(
                  async (classObj, classIdx) => {
                    const classData = {
                      name: `${classObj?.subject} ${classObj?.catalogNbr}`,
                      subtitle: classObj?.titleLong,
                      desc: classObj?.description,
                      categoryId: courseCategory?.id,
                      provider: "roster",
                      providerId: String(classObj?.crseId),
                    }
                    setTimeout(async () => {
                      await prisma.topic.upsert({
                        create: classData,
                        update: classData,
                        where: {
                          providerId: String(classObj?.crseId),
                        },
                      })
                      console.log(
                        "saved",
                        `${classObj?.subject} ${classObj?.catalogNbr}`
                      )

                      // NOTE: synchronus save
                      // console.log(
                      //   "saved",
                      //   `${classObj?.subject} ${classObj?.catalogNbr}`,
                      //   (classIdx / allClasses?.length) * 100,
                      //   "% saved"
                      // )
                    }, 100 * classIdx)
                  }
                )

                await Promise.all(savePromises)

                console.log(`Fetched ${classes.length} ${value} courses`)
                resolve()
              })()
            }, 250 * idx)
          })
      )
      await Promise.all(promises)

      // NOTE: synchronus save
      // const savePromises = allClasses?.map(async (classObj, classIdx) => {
      //   const classData = {
      //     name: `${classObj?.subject} ${classObj?.catalogNbr}`,
      //     subtitle: classObj?.titleLong,
      //     desc: classObj?.description,
      //     categoryId: courseCategory?.id,
      //     provider: "roster",
      //     providerId: String(classObj?.crseId),
      //   }
      //   setTimeout(async () => {
      //     await prisma.topic.upsert({
      //       create: classData,
      //       update: classData,
      //       where: {
      //         providerId: String(classObj?.crseId),
      //       },
      //     })
      //     console.log(
      //       "saved",
      //       `${classObj?.subject} ${classObj?.catalogNbr}`,
      //       (classIdx / allClasses?.length) * 100,
      //       "% saved"
      //     )
      //   }, 100 * classIdx)
      // })
      // await Promise.all(savePromises)
      resolve(true)
    })()
  })
