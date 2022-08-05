import { Container, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import HorizontalScrollMenu from "components/glue/HorizontalScrollMenu"
import useSWR from "swr"
import CategoryCard from "./CategoryCard"
import pluralize from "pluralize"

const CategoriesCardList = () => {
  const { data: categories } = useSWR(["/glue/categories"])

  return (
    <Container my="3rem">
      <Title order={2} mb="md">
        Categories
      </Title>
      <HorizontalScrollMenu>
        {categories?.map((category) => (
          <CategoryCard
            key={category?.id}
            itemId={category?.name}
            category={category}
          />
        ))}
      </HorizontalScrollMenu>
    </Container>
  )
}

export default CategoriesCardList
