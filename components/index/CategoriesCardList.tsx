import { Container, Title } from "@mantine/core"
import HorizontalScrollMenu from "components/glue/HorizontalScrollMenu"
import useGlueQuery from "hooks/glue/useGlueQuery"
import CategoryCard from "./CategoryCard"

const CategoriesCardList = () => {
  const { data: categories } = useGlueQuery({
    url: "/glue/categories",
    args: {
      include: {
        _count: {
          select: { topics: true },
        },
      },
    },
  })

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
