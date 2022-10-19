import { useRouter } from "next/router"

const useOpenModal = (glueKey: string) => {
  const router = useRouter()
  const modalKey = `modal-${glueKey}`
  const openModal = () => {
    router?.replace(
      {
        query: {
          ...router?.query,
          [modalKey]: "true",
        },
      },
      undefined,
      { shallow: true }
    )
  }
  return openModal
}
export default useOpenModal
