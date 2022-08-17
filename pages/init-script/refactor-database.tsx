import { GetServerSideProps } from "next"
import refactorDatabase from "util/refactorDatabase"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await refactorDatabase()

  return {
    props: {},
  }
}

const RefactorPage = () => {
  return <div>RefactorPage</div>
}

export default RefactorPage
