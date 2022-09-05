import Script from "next/script"
import React from "react"

const GlueGA = () => {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-ZSK49RL2CR"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-ZSK49RL2CR');
`,
        }}
      />
    </>
  )
}

export default GlueGA
