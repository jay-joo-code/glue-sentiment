import { Container, Header, Text, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import React from "react"
import CategoryCard from "./CategoryCard"
import ChairIcon from "@mui/icons-material/Chair"

const CategoriesCardList = () => {
  return (
    <Container my="3rem">
      <Title order={2} mb="md">
        Categories
      </Title>
      <Flex align="center" direction="row">
        <CategoryCard name="Dorm" svg={<ChairIcon />} />
        <CategoryCard name="Course" svg={<ChairIcon />} />
      </Flex>
    </Container>
  )
}

export default CategoriesCardList
