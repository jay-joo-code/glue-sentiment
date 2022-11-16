import { Button, Stack, Text, Title } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import Flex from "components/glue/Flex"
import { GetServerSideProps } from "next"
import { Provider } from "next-auth/providers"
import { getProviders, getSession, signIn } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })

  if (session) {
    return {
      props: { providers: [] },
    }
  }

  const providers = await getProviders()

  return {
    props: { providers },
  }
}

interface ISigninProps {
  providers?: Provider
}

const Signin = ({ providers }: ISigninProps) => {
  // TODO: handle OAuthAccountNotLinked error
  // by auto linking accounts

  // sign out if already signed in
  // const { status } = useSession()
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     signOut({ redirect: true })
  //   }
  // }, [status])

  const ERROR_TO_MESSAGE = useMemo(
    () => ({
      Signin: "Try signing with a different account.",
      OAuthSignin: "Try signing with a different account.",
      OAuthCallback: "Try signing with a different account.",
      OAuthCreateAccount: "Try signing with a different account.",
      EmailCreateAccount: "Try signing with a different account.",
      Callback: "Try signing with a different account.",
      OAuthAccountNotLinked:
        "To confirm your identity, sign in with the same account you used originally.",
      EmailSignin: "Check your email address.",
      CredentialsSignin:
        "Sign in failed. Check the details you provided are correct.",
      default: "Unable to sign in.",
    }),
    []
  )

  const router = useRouter()

  useEffect(() => {
    if (router?.query?.error) {
      setTimeout(() => {
        showNotification({
          title: "Error",
          message: ERROR_TO_MESSAGE[router?.query?.error as string],
          color: "red",
        })
        // router.query.error = null
        router.push({
          query: {},
        })
      })
    }
  }, [router?.query?.error])

  const PROVIDER_NAME_TO_LOGO = {
    Google: (
      <Image
        src="/glue/logos/google-logo.png"
        alt="google logo"
        width="20px"
        height="20px"
      />
    ),
    GitHub: (
      <Image
        src="/glue/logos/github-logo.png"
        alt="github logo"
        width="20px"
        height="20px"
      />
    ),
  }

  return (
    <Flex
      align="center"
      justify="center"
      sx={(theme) => ({
        height: "70vh",
      })}
    >
      <Stack spacing="xs">
        <Title order={1}>Sign in</Title>
        <Text color="dimmed">Sign in to access your account</Text>
        <Stack
          mt="lg"
          sx={(theme) => ({
            "& > svg": {
              height: "20px",
              width: "20px",
            },
          })}
        >
          {providers &&
            Object.values(providers)?.map((provider) => (
              <Button
                key={provider.name}
                color="dark"
                fullWidth
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: router?.query?.callbackUrl as string,
                  })
                }
                variant="outline"
                radius="xl"
                leftIcon={PROVIDER_NAME_TO_LOGO[provider?.name]}
              >
                Sign in with {provider.name}
              </Button>
            ))}
        </Stack>
      </Stack>
    </Flex>
  )
}

export default Signin
