import { Text, TextProps, useMantineTheme } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { memo } from "react"
import styled from "styled-components"

interface INav {
  label: string
  route: string
  icon: React.ReactNode
}

interface INavHeaderProps {
  navs: INav[]
}

const NavHeader = ({ navs }: INavHeaderProps) => {
  const router = useRouter()
  const theme = useMantineTheme()

  return (
    <Container>
      {navs.map(({ label, route, icon }) => (
        <Link key={route} href={route}>
          <NavItem $isSelected={router.pathname === route} theme={theme}>
            {icon}
            <Label $isSelected={router.pathname === route} theme={theme}>
              {label}
            </Label>
          </NavItem>
        </Link>
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  & > * {
    margin-right: 1rem;
  }
`

interface NavItemProps {
  $isSelected: boolean
}

const NavItem = styled.div<NavItemProps>`
  border-radius: 8px;
  border: 2px solid ${(props) => props.theme.colors.gray[0]};
  background: ${(props) => props.theme.colors.gray[0]};
  padding: 0.3rem 0.2rem 0.3rem 0.5rem;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  & > *:first-of-type {
    margin-right: 0.5rem;
  }

  & svg {
    height: 20px !important;
    width: 20px !important;
    fill: ${(props) => props.theme.colors.gray[6]};
  }

  &:hover {
    border-color: ${(props) =>
      !props.$isSelected && props.theme.colors.gray[1]};
    background: ${(props) => !props.$isSelected && props.theme.colors.gray[1]};
  }

  // $isSelected
  background: ${(props) => props.$isSelected && props.theme.colors.brand[2]};
  border-color: ${(props) => props.$isSelected && props.theme.colors.brand[2]};

  & svg {
    fill: ${(props) => props.$isSelected && props.theme.colors.brand[5]};
  }
`

interface LabelProps extends TextProps<"p"> {
  $isSelected: boolean
}

const Label = styled(Text)<LabelProps>`
  font-weight: 700;
  color: ${(props) => props.theme.colors.gray[6]};
  white-space: nowrap;

  // $isSelected
  color: ${(props) => props.$isSelected && props.theme.colors.brand[5]};
`

export default memo(NavHeader)
