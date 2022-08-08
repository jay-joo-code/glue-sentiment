import qs from "qs"
import React from "react"
import { SWRConfig } from "swr"

interface ISWRProviderProps {
  children: React.ReactNode
}

const SWRProvider = ({ children }: ISWRProviderProps) => {
  return (
    <SWRConfig
      value={{
        errorRetryCount: 0,
        fetcher: async (url, args) => {
          const BASE_URL = "/api"
          const query = args ? `?${qs.stringify(args)}` : ""
          const completeUrl = `${BASE_URL}${url}${query}`
          const res = await fetch(completeUrl)

          // error handling done in /lib/glue/api.ts

          return res.json()
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}

export default SWRProvider
