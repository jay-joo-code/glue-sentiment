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

interface IFetchAllClassesOptions {
  reset?: boolean
}

export const fetchAllClasses = ({
  reset = false,
}: IFetchAllClassesOptions): Promise<boolean> =>
  new Promise((resolve) => {
    ;(async () => {
      const courseCategory = await prisma.category.findFirst({
        where: {
          name: "course",
        },
      })

      if (reset) {
        // delete all existing course topics
        await prisma.topic.deleteMany({
          where: {
            categoryId: courseCategory?.id,
          },
        })
      }

      const subjects = await fetchSubjects("SP22")
      let allClasses: any[] = []
      const tempSubjects = [subjects[0]]
      const promises = tempSubjects.map(
        ({ value }, idx): Promise<void> =>
          new Promise((resolve) => {
            setTimeout(() => {
              ;(async () => {
                const classes = await fetchAllClassesBySubject(value)
                allClasses = allClasses.concat(classes)
                console.log(`Fetched ${classes.length} ${value} courses`)
                resolve()
              })()
            }, 1000 * idx)
          })
      )
      await Promise.all(promises)
      const savePromises = allClasses?.map(async (classObj) => {
        const classData = {
          name: `${classObj?.subject} ${classObj?.catalogNbr}`,
          subtitle: classObj?.titleLong,
          desc: classObj?.description,
          categoryId: courseCategory?.id,
          provider: "roster",
          providerId: String(classObj?.crseId),
        }
        await prisma.topic.upsert({
          create: classData,
          update: classData,
          where: {
            providerId: String(classObj?.crseId),
          },
        })
      })
      await Promise.all(savePromises)
      resolve(true)
    })()
  })
