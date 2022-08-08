import "next-auth"

// augments session object type
declare module "next-auth" {
  interface Session {
    user: {
      id: number
      email: string
      name: string
      image: string
    }
  }
}
