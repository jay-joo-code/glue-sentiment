import { Container, Text } from "@mantine/core"
import React from "react"

interface ICategoryCardProps {
  name: string
  svg: React.ReactNode
}

const CategoryCard = ({ name, svg }: ICategoryCardProps) => {
  return (
    <Container
      px="md"
      py="sm"
      sx={(theme) => ({
        background: theme.colors.gray[1],
        borderRadius: "6px",
        width: "44%",
        height: "120px",
        position: "relative",
      })}
    >
      <Text size="lg" weight={500}>
        {name}
      </Text>
      <Container
        sx={(theme) => ({
          position: "absolute",
          bottom: "10px",
          right: "10px",
        })}
      >
        {svg}
      </Container>
    </Container>
  )
}

export default CategoryCard
