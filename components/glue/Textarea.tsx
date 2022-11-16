import { Textarea as MantineTextarea, TextareaProps } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { PolymorphicComponentProps } from "@mantine/utils"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Container from "./Container"
import Input from "./Input"
import Text from "./Text"

interface ITextareaProps
  extends Omit<
    PolymorphicComponentProps<"textarea", TextareaProps>,
    "variant"
  > {
  glueKey?: string
  sourceOfTruth?: "url-query"
  onDebouncedChange?: (value: string) => void
  variant?: "unstyled" | "default" | "filled" | "subtle"
  isDivOnBlur?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, ITextareaProps>(
  (props, ref) => {
    const {
      glueKey,
      sourceOfTruth,
      variant: propVariant = "default",
      value: propValue,
      onChange: propOnChange,
      onDebouncedChange,
      onFocus: propOnFocus,
      onBlur: propOnBlur,
      autoFocus: propAutoFocus,
      isDivOnBlur = false,
      ...rest
    } = props
    // TODO: fix this stupid bug that jumps the cursor to the end

    // sourceOfTruth = url-query
    const router = useRouter()
    const routerQueryValue = router?.query[glueKey]
    const [urlQueryValue, setUrlQueryValue] = useState<string>()
    const [debouncedUrlQueryValue] = useDebouncedValue(urlQueryValue, 300)
    const urlQueryOnChange = (event) => {
      setUrlQueryValue(event?.target?.value)
    }

    useEffect(() => {
      if (urlQueryValue === undefined && routerQueryValue !== undefined) {
        setUrlQueryValue(routerQueryValue as string)
      }
    }, [urlQueryValue, routerQueryValue])

    useEffect(() => {
      if (sourceOfTruth === "url-query" && router?.isReady) {
        router?.replace(
          {
            query: {
              ...router?.query,
              [glueKey]: debouncedUrlQueryValue,
            },
          },
          undefined,
          { shallow: true }
        )
      }
    }, [sourceOfTruth, debouncedUrlQueryValue])

    // onDebouncedChange
    const [debouncedPropValue] = useDebouncedValue(propValue, 300)
    const [isChanged, setIsChanged] = useState<boolean>(false)

    useEffect(() => {
      if (onDebouncedChange && debouncedPropValue !== undefined && isChanged) {
        onDebouncedChange(debouncedPropValue as string)
      }
    }, [debouncedPropValue])

    // TODO: track focus, debounced values, blur, etc
    // const handleTrackedClick = (event: React.MouseEvent<HTMLTextareaElement>) => {
    //   amplitude.track(`Textarea-click-${toKebabCase(children as string)}`)

    //   if (onClick) {
    //     onClick(event)
    //   }
    // }

    // dynamic value, onChange
    const value =
      (sourceOfTruth === "url-query" ? urlQueryValue : (propValue as string)) ||
      ""
    const onChange = (event) => {
      setIsChanged(true)
      if (propOnChange) propOnChange(event)
    }
    const dynamicOnChange =
      sourceOfTruth === "url-query" ? urlQueryOnChange : onChange

    // dynamic styles
    const variant = propVariant === "subtle" ? "unstyled" : propVariant
    const commonWrapperStyles = {
      padding: ".3rem .1rem",
    }
    const dynamicStyles =
      propVariant === "subtle"
        ? (theme) => ({
            wrapper: {
              ...commonWrapperStyles,
              background: value?.length === 0 && theme.colors.gray[0],
              borderRadius: theme.radius.sm,

              "&:hover": {
                background: theme.colors.gray[0],
              },

              "&:focus": {
                background: theme.colors.gray[0],
              },
            },
            input: {
              paddingTop: "0 !important",
              paddingBottom: "0 !important",
              transition: "background 200ms ease-in-out",
              height: "unset",
              lineHeight: 1.5,
              borderRadius: theme.radius.md,
            },
          })
        : {
            wrapper: {
              ...commonWrapperStyles,
            },
          }

    // isDivOnBlur
    const [isDiv, setIsDiv] = useState<boolean>(true)

    const onFocus = (event) => {
      setIsDiv(false)
      if (propOnFocus) propOnFocus(event)
    }

    const onBlur = (event) => {
      setIsDiv(true)
      if (propOnBlur) propOnBlur(event)
    }

    const handleRenderTextarea = () => {
      setIsDiv(false)
    }

    if (isDivOnBlur && isDiv) {
      return (
        <Container
          onClick={handleRenderTextarea}
          sx={(theme) => ({
            padding: ".3rem .22rem",
            minHeight: "36px",
            background:
              propVariant === "subtle" &&
              value?.length === 0 &&
              theme.colors.gray[0],
            borderRadius: theme.radius.sm,
          })}
        >
          {/* dummy input component for tab focus handling */}
          <Input
            onFocus={handleRenderTextarea}
            sx={(theme) => ({
              width: 0,
              height: 0,
              opacity: 0,
              zIndex: -9999,
              padding: 0,
            })}
          />

          {/* text component to auto link */}
          <Text
            sx={(theme) => ({
              lineHeight: 1.5,
            })}
          >
            {value}
          </Text>
        </Container>
      )
    }

    return (
      <MantineTextarea
        ref={ref}
        value={value}
        onChange={dynamicOnChange}
        variant={variant}
        styles={dynamicStyles}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={isDivOnBlur ? !isDiv : propAutoFocus}
        {...rest}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea
