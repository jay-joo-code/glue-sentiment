import { Container, Input, Text, Title } from "@mantine/core"
import Flex from "components/glue/Flex"
import React from "react"
import SearchIcon from "@mui/icons-material/Search"

const TopicSearch = () => {
  return (
    <Container>
      <Title order={2} mb="md">
        Search
      </Title>
      <Input radius="xl" icon={<SearchIcon />} />
    </Container>
  )
}

export default TopicSearch
