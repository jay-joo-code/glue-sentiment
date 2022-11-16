import { Input as MantineInput, InputProps } from "@mantine/core"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { PolymorphicComponentProps } from "@mantine/utils"
import { useDebouncedValue } from "@mantine/hooks"

interface IInputProps
  extends Omit<PolymorphicComponentProps<"input", InputProps>, "variant"> {
  glueKey?: string
  sourceOfTruth?: "url-query"
  onDebouncedChange?: (value: string) => void
  variant?: "unstyled" | "default" | "filled" | "subtle"
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
  const {
    glueKey,
    sourceOfTruth,
    variant: propVariant = "default",
    value: propValue,
    onChange: propOnChange,
    onDebouncedChange,
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

  // TODO: track focus, debounced values, blur, etc
  // const handleTrackedClick = (event: React.MouseEvent<HTMLInputElement>) => {
  //   amplitude.track(`Input-click-${toKebabCase(children as string)}`)

  //   if (onClick) {
  //     onClick(event)
  //   }
  // }

  // dynamic styles
  const variant = propVariant === "subtle" ? "unstyled" : propVariant
  const commonWrapperStyles = {
    padding: ".3rem .1rem",

    "& svg": {
      marginLeft: ".5rem",
    },
  }
  const dynamicStyles =
    propVariant === "subtle"
      ? (theme) => ({
          wrapper: {
            ...commonWrapperStyles,
            background: value?.length === 0 && theme.colors.gray[0],
            borderRadius: theme.radius.md,

            "&:hover": {
              background: theme.colors.gray[0],
            },

            "&:focus": {
              background: theme.colors.gray[0],
            },
          },
          input: {
            background: value?.length === 0 && theme.colors.gray[0],
            transition: "background 200ms ease-in-out",
            height: "unset",
            lineHeight: 1.2,
          },
        })
      : {
          wrapper: {
            ...commonWrapperStyles,
          },
        }

  return (
    <MantineInput
      ref={ref}
      value={value}
      onChange={dynamicOnChange}
      variant={variant}
      styles={dynamicStyles}
      {...rest}
    />
  )
})

Input.displayName = "Input"

export default Input
