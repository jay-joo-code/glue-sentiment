import { useLocalStorage } from "@mantine/hooks"
import { useEffect, useState } from "react"

const useGlueLocalStorage = ({ key, defaultValue }) => {
  const [state, setState] = useLocalStorage({
    key,
    defaultValue,
    getInitialValueInEffect: true,
  })

  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    setIsInitialized(true)
  }, [])

  return [isInitialized ? state : undefined, setState]
}

export default useGlueLocalStorage
