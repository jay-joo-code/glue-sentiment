import { Container, Title } from "@mantine/core"
import HorizontalScrollMenu from "components/glue/HorizontalScrollMenu"
import useSWR from "swr"
import CategoryCard from "./CategoryCard"

const CategoriesCardList = () => {
  const { data: categories } = useSWR([
    "/glue/categories",
    {
      include: {
        _count: {
          select: { topics: true },
        },
      },
    },
  ])

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
