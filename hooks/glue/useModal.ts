import { useRouter } from "next/router"

const useModal = (glueKey: string) => {
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

  const closeModal = () => {
    router?.replace(
      {
        query: {
          ...router?.query,
          [modalKey]: "false",
        },
      },
      undefined,
      { shallow: true }
    )
  }

  return { openModal, closeModal }
}
export default useModal
