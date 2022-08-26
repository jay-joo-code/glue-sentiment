import prisma from "lib/glue/prisma"
import { GetServerSideProps } from "next"
import refactorDatabase from "util/refactorDatabase"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const result = await refactorDatabase()

  return {
    props: { result },
  }
}

const RefactorPage = ({ result }) => {
  console.log("result", result)
  return <div>RefactorPage</div>
}

export default RefactorPage
