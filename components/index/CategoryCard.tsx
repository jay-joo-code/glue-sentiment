import { Container, Text } from "@mantine/core"
import React from "react"

interface ICategoryCardProps {
  name: string
}

const CategoryCard = ({ name }: ICategoryCardProps) => {
  return (
    <Container
      sx={(theme) => ({
        background: theme.colors.gray[1],
        borderRadius: "6px",
        width: "44%",
      })}
    >
      <Text>{name}</Text>
    </Container>
  )
}

export default CategoryCard
