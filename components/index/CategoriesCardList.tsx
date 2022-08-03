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
      <Flex
        align="flex-start"
        noWrap={true}
        sx={(theme) => ({
          overflowX: "auto",
          scrollbarWidth: "none",

          "::-webkit-scrollbar": {
            background: "transparent",
            width: "0px",
          },
        })}
      >
        <CategoryCard
          name="course"
          titleLabel="Courses"
          countLabel="courses"
          svgName="courses.svg"
          isComingSoon={false}
        />
        <CategoryCard
          name="club"
          titleLabel="Clubs"
          countLabel="clubs"
          svgName="clubs.svg"
          isComingSoon={true}
        />
        <CategoryCard
          name="eatery"
          titleLabel="Eateries"
          countLabel="eateries"
          svgName="eateries.svg"
          isComingSoon={true}
        />
        <CategoryCard
          name="dorm"
          titleLabel="Dorms"
          countLabel="dorms"
          svgName="dorms.svg"
          isComingSoon={true}
        />
        <CategoryCard
          name="dining hall"
          titleLabel="Dining halls"
          countLabel="dining halls"
          svgName="dining-halls.svg"
          isComingSoon={true}
        />
      </Flex>
    </Container>
  )
}

export default CategoriesCardList
