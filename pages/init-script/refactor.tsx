import { GetServerSideProps } from "next"
import refactorAliasString from "util/refactorAliasString"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await refactorAliasString()

  return {
    props: {},
  }
}

const RefactorPage = () => {
  return <div>RefactorPage</div>
}

export default RefactorPage
