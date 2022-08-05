import { Container, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import CategoryCard from "./CategoryCard"

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
        spacing="xs"
      >
        <CategoryCard
          name="course"
          titleLabel="Courses"
          svgName="courses.svg"
          isComingSoon={false}
        />
        <CategoryCard
          name="club"
          titleLabel="Clubs"
          svgName="clubs.svg"
          isComingSoon={true}
        />
        <CategoryCard
          name="eatery"
          titleLabel="Eateries"
          svgName="eateries.svg"
          isComingSoon={true}
        />
        <CategoryCard
          name="dorm"
          titleLabel="Dorms"
          svgName="dorms.svg"
          isComingSoon={true}
        />
        <CategoryCard
          name="dining hall"
          titleLabel="Dining halls"
          svgName="dining-halls.svg"
          isComingSoon={true}
        />
        <CategoryCard
          name="professor"
          titleLabel="Professors"
          svgName="professors.svg"
          isComingSoon={true}
        />
      </Flex>
    </Container>
  )
}

export default CategoriesCardList
