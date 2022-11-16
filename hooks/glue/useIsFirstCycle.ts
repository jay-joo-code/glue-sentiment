import { useRef, useEffect } from "react"

const useIsFirstCycle = () => {
  const isMountRef = useRef(true)

  useEffect(() => {
    isMountRef.current = false
  }, [])

  return isMountRef.current
}

export default useIsFirstCycle
