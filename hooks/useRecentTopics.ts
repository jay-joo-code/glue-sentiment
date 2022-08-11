import useGlueLocalStorage from "./glue/useGlueLocalStorage"

const useRecentTopics = () => {
  return useGlueLocalStorage({
    key: "recently-viewed-topics",
    defaultValue: [],
  })
}

export default useRecentTopics
