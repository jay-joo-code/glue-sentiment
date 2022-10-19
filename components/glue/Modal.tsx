import { Container, Modal as MantineModal, ModalProps } from "@mantine/core"
import { PolymorphicComponentProps } from "@mantine/utils"
import { useRouter } from "next/router"
import React from "react"

interface IModalProps
  extends Omit<
    PolymorphicComponentProps<"Modal", ModalProps>,
    "opened" | "onClose" | "component"
  > {
  glueKey: string
  title: string
  onClose?: () => void
}

const Modal = React.forwardRef<HTMLDivElement, IModalProps>((props, ref) => {
  const { children, glueKey, onClose: onCloseProp, ...rest } = props
  const router = useRouter()
  const modalKey = `modal-${glueKey}`

  const handleClose = () => {
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

    if (onCloseProp) onCloseProp()
  }

  // TODO: tracking open, close
  // const handleTrackedClick = (event: React.MouseEvent<HTMLModalElement>) => {
  //   amplitude.track(`Modal-click-${toKebabCase(children as string)}`)

  //   if (onClick) {
  //     onClick(event)
  //   }
  // }

  return (
    <Container ref={ref}>
      <MantineModal
        {...rest}
        opened={router?.query[modalKey] === "true"}
        onClose={handleClose}
      >
        {children}
      </MantineModal>
    </Container>
  )
})

Modal.displayName = "Modal"

export default Modal
