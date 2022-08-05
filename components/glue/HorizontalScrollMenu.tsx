import React from "react"
import { ScrollMenu } from "react-horizontal-scrolling-menu"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import { VisibilityContext } from "react-horizontal-scrolling-menu"
import styled from "styled-components"
import useIsMobile from "hooks/glue/isMobile"

type TChildren = React.ReactElement<{
  // unique itemId required for every item
  itemId: string
}>

interface IHorizontalScrollMenuProps {
  children: TChildren | TChildren[]
}

const HorizontalScrollMenu = ({ children }: IHorizontalScrollMenuProps) => {
  return (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
      {children}
    </ScrollMenu>
  )
}

function LeftArrow() {
  const {
    isFirstItemVisible,
    scrollPrev,
    visibleItemsWithoutSeparators,
    initComplete,
  } = React.useContext(VisibilityContext)

  const [disabled, setDisabled] = React.useState(
    !initComplete || (initComplete && isFirstItemVisible)
  )
  React.useEffect(() => {
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isFirstItemVisible)
    }
  }, [isFirstItemVisible, visibleItemsWithoutSeparators])

  const isMobile = useIsMobile()

  if (isMobile) return null

  return (
    <ArrowContainer>
      <ArrowButton disabled={disabled} onClick={() => scrollPrev()} isLeft>
        <LeftIcon />
      </ArrowButton>
    </ArrowContainer>
  )
}

function RightArrow() {
  const { isLastItemVisible, scrollNext, visibleItemsWithoutSeparators } =
    React.useContext(VisibilityContext)

  const [disabled, setDisabled] = React.useState(
    !visibleItemsWithoutSeparators.length && isLastItemVisible
  )
  React.useEffect(() => {
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isLastItemVisible)
    }
  }, [isLastItemVisible, visibleItemsWithoutSeparators])

  const isMobile = useIsMobile()

  if (isMobile) return null

  return (
    <ArrowContainer>
      <ArrowButton disabled={disabled} onClick={() => scrollNext()}>
        <RightIcon />
      </ArrowButton>
    </ArrowContainer>
  )
}

const ArrowContainer = styled.div`
  position: relative;
  background: transparent;
  display: flex;
  align-items: center;
`

interface IArrowButtonProps {
  isLeft?: boolean
}

const ArrowButton = styled.button<IArrowButtonProps>`
  z-index: 2;
  background: "#FFFFFF";
  border-radius: 50%;
  flex-grow: 0;
  flex-shrink: 0;
  position: absolute;
  left: 10px;

  /* disabled */
  display: ${(props) => props.disabled && "none"};

  /* isLeft */
  left: ${(props) => props.isLeft && "unset"};
  right: ${(props) => props.isLeft && "10px"};

  &:hover {
    background: ${(props) => props.theme.colors.gray[0]};
  }
`

const RightIcon = styled(ChevronRightIcon)`
  width: 2.8rem !important;
  height: 2.8rem !important;
  fill: ${(props) => props.theme.colors.gray[7]} !important;
`

const LeftIcon = styled(ChevronLeftIcon)`
  width: 2.8rem !important;
  height: 2.8rem !important;
  fill: ${(props) => props.theme.colors.gray[7]} !important;
`

export default HorizontalScrollMenu
