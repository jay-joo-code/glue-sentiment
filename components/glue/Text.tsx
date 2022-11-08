import { Text as MantineText, TextProps } from "@mantine/core"
import React from "react"
import { PolymorphicComponentProps } from "@mantine/utils"
import Linkify from "react-linkify"
import { SecureLink } from "react-secure-link"

interface ITextProps extends PolymorphicComponentProps<"p", TextProps> {
  isDisableAutolink?: boolean
}

const Text = React.forwardRef<HTMLParagraphElement, ITextProps>(
  (props, ref) => {
    const { children, isDisableAutolink = false, ...rest } = props

    return (
      <MantineText ref={ref} {...rest}>
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <SecureLink href={decoratedHref} key={key}>
              {decoratedText}
            </SecureLink>
          )}
        >
          {children}
        </Linkify>
      </MantineText>
    )
  }
)

Text.displayName = "Text"

export default Text
