import { Input as MantineInput, InputProps } from "@mantine/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { PolymorphicComponentProps } from "@mantine/utils"
import { useDebouncedValue } from "@mantine/hooks"

interface IInputProps extends PolymorphicComponentProps<"button", InputProps> {
  glueKey?: string
  sourceOfTruth?: "url-query"
  onDebouncedChange?: (value: string) => void
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
  const {
    glueKey,
    sourceOfTruth,
    onDebouncedChange,
    value: propValue,
    onChange: propOnChange,
    ...rest
  } = props

  // source of truth: url query
  const router = useRouter()
  const [localValue, setLocalValue] = useState<string>(null)
  const [debouncedLocalValue] = useDebouncedValue(localValue, 300)

  const localOnChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setLocalValue(event?.currentTarget?.value)
    if (propOnChange) propOnChange(event)
  }

  useEffect(() => {
    if (sourceOfTruth === "url-query" && localValue !== null) {
      router?.replace({
        query: {
          ...router?.query,
          [glueKey]: debouncedLocalValue,
        },
      })
    }

    if (onDebouncedChange) {
      onDebouncedChange(debouncedLocalValue)
    }
  }, [debouncedLocalValue])

  useEffect(() => {
    if (sourceOfTruth === "url-query" && localValue === null) {
      setLocalValue(router?.query[glueKey] as string)
    }
  }, [router?.query])

  // TODO: track focus, debounced values, blur, etc
  // const handleTrackedClick = (event: React.MouseEvent<HTMLInputElement>) => {
  //   amplitude.track(`Input-click-${toKebabCase(children as string)}`)

  //   if (onClick) {
  //     onClick(event)
  //   }
  // }

  return (
    <MantineInput
      ref={ref}
      {...rest}
      value={sourceOfTruth === "url-query" ? localValue : propValue}
      onChange={localOnChange}
    />
  )
})

Input.displayName = "Input"

export default Input
