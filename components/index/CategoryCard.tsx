import { Badge, Container, Text } from "@mantine/core"
import Flex from "components/glue/Flex"
import Image from "next/image"
import React from "react"

interface ICategoryCardProps {
  name: string
  titleLabel: string
  countLabel: string
  svgName: string
  isComingSoon: boolean
}

const CategoryCard = ({
  name,
  titleLabel,
  countLabel,
  svgName,
  isComingSoon,
}: ICategoryCardProps) => {
  return (
    <Container>
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
            src={`/category-icons/${svgName}`}
            alt=""
            height={80}
            width={80}
          />
        </div>
      </Flex>
      <Text mb=".2rem" ml=".2rem" weight={600} size="md">
        {titleLabel}
      </Text>
      {isComingSoon ? (
        <Badge radius="sm" size="xs">
          Coming soon
        </Badge>
      ) : (
        <Text size="xs" ml=".2rem" weight={500} color="dimmed">
          0 {countLabel}
        </Text>
      )}
    </Container>
  )
}

export default CategoryCard
