import { Container, Header, Text, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import React from "react"
import CategoryCard from "./CategoryCard"

const CategoriesCardList = () => {
  return (
    <Container my="3rem">
      <Title order={2}>Categories</Title>
      <Flex align="center" direction="row">
        <CategoryCard name="Dorm" />
        <CategoryCard name="Course" />
      </Flex>
    </Container>
  )
}

export default CategoriesCardList
