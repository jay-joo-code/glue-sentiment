import { useLocalStorage } from "@mantine/hooks"

const useRecentTopics = () => {
  return useLocalStorage({
    key: "recently-viewed-topics",
    defaultValue: [],
    getInitialValueInEffect: true,
  })
}

export default useRecentTopics
