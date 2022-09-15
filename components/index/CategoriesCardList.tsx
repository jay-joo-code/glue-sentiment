import { Container, Title } from "@mantine/core"
import { Category } from "@prisma/client"
import HorizontalScrollMenu from "components/glue/HorizontalScrollMenu"
import CategoryCard from "./CategoryCard"

interface ICategoriesCardListProps {
  categories: (Category & {
    _count: {
      topics: number
    }
  })[]
}

const CategoriesCardList = ({ categories }: ICategoriesCardListProps) => {
  return (
    <Container mt="lg" mb="3rem">
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
