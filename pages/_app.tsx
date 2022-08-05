import { useMantineTheme } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { NotificationsProvider } from "@mantine/notifications"
import AppDefaultHead from "components/glue/AppDefaultHead"
import AppShell from "components/glue/AppShell"
import MantineConfigProvider from "components/glue/MantineConfigProvider"
import SWRProvider from "components/glue/SWRProvider"
import { useScrollRestoration } from "hooks/glue/useScrollRestoration"
import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import "react-loading-skeleton/dist/skeleton.css"
import { ThemeProvider } from "styled-components"
import "styles/glue/reset.css"

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  useScrollRestoration(router)
  const theme = useMantineTheme()

  return (
    <SessionProvider session={pageProps.session}>
      <MantineConfigProvider>
        <ThemeProvider theme={theme}>
          <NotificationsProvider>
            <ModalsProvider>
              <SWRProvider>
                <AppShell>
                  <AppDefaultHead />
                  <Component {...pageProps} />
                </AppShell>
              </SWRProvider>
            </ModalsProvider>
          </NotificationsProvider>
        </ThemeProvider>
      </MantineConfigProvider>
    </SessionProvider>
  )
}

export default App
