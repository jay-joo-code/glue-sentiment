import { Input, Text } from "@mantine/core"
import Flex from "components/glue/Flex"
import React from "react"
import SearchIcon from "@mui/icons-material/Search"

const TopicSearch = () => {
  return (
    <Flex direction="column" align="center">
      <Text
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
        weight={500}
        sx={(theme) => ({
          fontSize: "3rem",
          letterSpacing: "2px",
        })}
      >
        Sentiment
      </Text>
      <Input
        radius="xl"
        iconWidth={44}
        icon={<SearchIcon />}
        sx={(theme) => ({
          width: "100%",
          maxWidth: "400px",

          "& svg": {
            marginLeft: "1rem",
          },
        })}
      />
    </Flex>
  )
}

export default TopicSearch
