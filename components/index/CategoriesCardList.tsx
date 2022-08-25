import { Container, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import HorizontalScrollMenu from "components/glue/HorizontalScrollMenu"
import useGlueQuery from "hooks/glue/useGlueQuery"
import Skeleton from "react-loading-skeleton"
import CategoryCard from "./CategoryCard"

const CategoriesCardList = () => {
  const { data: categories, isLoading } = useGlueQuery({
    url: "/glue/categories",
    args: {
      include: {
        _count: {
          select: { topics: true },
        },
      },
    },
    autoRefetch: false,
  })

  return (
    <Container my="3rem">
      <Title order={2} mb="md">
        Categories
      </Title>
      <HorizontalScrollMenu>
        {isLoading
          ? [...Array(3)].map((_, idx) => (
              <Container key={idx} mr="md">
                <Skeleton width={140} height={224} />
              </Container>
            ))
          : categories?.map((category) => (
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
