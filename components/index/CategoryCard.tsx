import { Badge, Container, Text } from "@mantine/core"
import { capitalize } from "@mui/material"
import { Category } from "@prisma/client"
import Flex from "components/glue/Flex"
import Image from "next/image"
import Link from "next/link"
import pluralize from "pluralize"
import React from "react"

interface ICategoryCardProps {
  itemId?: string
  category: Category
}

const CategoryCard = ({ category }: ICategoryCardProps) => {
  return (
    <Link href={`/category/${category?.id}`}>
      <Container
        p="xs"
        sx={(theme) => ({
          borderRadius: "6px",
          cursor: "pointer",

          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            "&:hover": {
              background: theme.colors.gray[0],
            },
          },
        })}
      >
        <Flex
          align="center"
          justify="center"
          sx={(theme) => ({
            background: theme.colors.gray[1],
            borderRadius: "8px",
            width: "10rem",
            height: "14rem",
          })}
          mb=".4rem"
        >
          <div>
            <Image
              src={`/category-icons/${pluralize(category?.name)}.svg`}
              alt=""
              height={80}
              width={80}
            />
          </div>
        </Flex>
        <Text mb=".2rem" ml=".2rem" weight={600} size="md">
          {capitalize(pluralize(category?.name))}
        </Text>
        {category?.isComingSoon ? (
          <Badge radius="sm" size="xs">
            Coming soon
          </Badge>
        ) : (
          <Text size="xs" ml=".2rem" weight={500} color="dimmed">
            0 {pluralize(category?.name)}
          </Text>
        )}
      </Container>
    </Link>
  )
}

export default CategoryCard
