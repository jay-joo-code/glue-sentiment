import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextApiHandler } from "next"
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import prisma from "lib/glue/prisma"

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options = {
  // TODO: change auth method to JWT
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // EmailProvider({
    //   server: {
    //     host: process.env.SMTP_HOST,
    //     port: Number(process.env.SMTP_PORT),
    //     auth: {
    //       user: process.env.SMTP_USER,
    //       pass: process.env.SMTP_PASSWORD,
    //     },
    //   },
    //   from: process.env.SMTP_FROM,
    // }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/signin", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    session: async ({ session, user }) => {
      // provides user id to session object
      session.user.id = user?.id
      return Promise.resolve(session)
    },
  },
}
