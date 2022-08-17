import React from "react"
import { fetchAllClasses } from "util/scrapeRoster"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await fetchAllClasses()

  return {
    props: {},
  }
}

const ScrapeRosterPage = () => {
  return <div>ScrapeRosterPage</div>
}

export default ScrapeRosterPage
