import { useLocalStorage } from "@mantine/hooks"

const useRecentTopics = () => {
  return useLocalStorage({
    key: "recently-viewed-topics",
    defaultValue: [],
  })
}

export default useRecentTopics
