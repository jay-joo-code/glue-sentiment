import { Container, ContainerProps } from "@mantine/core"
import React, { useEffect, useRef, useState } from "react"

interface IGlueSpoilerProps extends ContainerProps {
  children: React.ReactNode
  previewHeight: number
  expandOnly?: boolean
}

const GlueSpoiler = ({
  children,
  previewHeight,
  expandOnly = false,
  ...rest
}: IGlueSpoilerProps) => {
  const [height, setHeight] = useState<number>(0)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const ref = useRef(null)
  const isOverflowing = height > previewHeight

  useEffect(() => {
    if (ref?.current?.clientHeight) {
      setHeight(ref.current.clientHeight)
    }
  }, [ref])

  const responsiveStyles =
    isOverflowing && !isExpanded
      ? {
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        }
      : {
          maxHeight: height || "unset",
        }

  const toggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    } else if (isExpanded && !expandOnly) {
      setIsExpanded(false)
    }
  }

  return (
    <Container
      ref={ref}
      sx={() => ({
        maxHeight: `${previewHeight}px`,
        overflow: "hidden",
        transition: "max-height 200ms ease-in-out",
        ...responsiveStyles,
      })}
      onClick={toggleExpand}
      {...rest}
    >
      {children}
    </Container>
  )
}

export default GlueSpoiler
