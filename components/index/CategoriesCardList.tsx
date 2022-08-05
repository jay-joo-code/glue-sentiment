import { Container, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import HorizontalScrollMenu from "components/glue/HorizontalScrollMenu"
import CategoryCard from "./CategoryCard"

const CategoriesCardList = () => {
  return (
    <Container my="3rem">
      <Title order={2} mb="md">
        Categories
      </Title>
      <HorizontalScrollMenu>
        <CategoryCard
          itemId="Courses"
          name="course"
          titleLabel="Courses"
          svgName="courses.svg"
          isComingSoon={false}
        />
        <CategoryCard
          itemId="Clubs"
          name="club"
          titleLabel="Clubs"
          svgName="clubs.svg"
          isComingSoon={true}
        />
        <CategoryCard
          itemId="Eateries"
          name="eatery"
          titleLabel="Eateries"
          svgName="eateries.svg"
          isComingSoon={true}
        />
        <CategoryCard
          itemId="Dorms"
          name="dorm"
          titleLabel="Dorms"
          svgName="dorms.svg"
          isComingSoon={true}
        />
        <CategoryCard
          itemId="Dining halls"
          name="dining hall"
          titleLabel="Dining halls"
          svgName="dining-halls.svg"
          isComingSoon={true}
        />
        <CategoryCard
          itemId="Professors"
          name="professor"
          titleLabel="Professors"
          svgName="professors.svg"
          isComingSoon={true}
        />
      </HorizontalScrollMenu>
    </Container>
  )
}

export default CategoriesCardList
