import * as amplitude from "@amplitude/analytics-browser"
import { Container, Modal as MantineModal, ModalProps } from "@mantine/core"
import React from "react"
import { toKebabCase } from "util/glue/strings"
import { PolymorphicComponentProps } from "@mantine/utils"

interface IModalProps extends PolymorphicComponentProps<"Modal", ModalProps> {}

const Modal = React.forwardRef<HTMLDivElement, IModalProps>((props, ref) => {
  const { children, ...rest } = props

  // TODO: tracking open, close
  // const handleTrackedClick = (event: React.MouseEvent<HTMLModalElement>) => {
  //   amplitude.track(`Modal-click-${toKebabCase(children as string)}`)

  //   if (onClick) {
  //     onClick(event)
  //   }
  // }

  return (
    <Container ref={ref}>
      <MantineModal {...rest}>{children}</MantineModal>
    </Container>
  )
})

Modal.displayName = "Modal"

export default Modal
