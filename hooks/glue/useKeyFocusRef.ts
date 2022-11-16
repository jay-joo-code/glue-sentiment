import { useRef, useCallback } from "react"

function useKeyFocusRef() {
  const controls = useRef([])

  const changeFocus = (event, direction: "prev" | "next") => {
    // Required if the controls can be reordered
    controls.current = controls.current
      .filter((control) => document.body.contains(control))
      .sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )

    const index = controls.current.indexOf(event.target)
    const nextIdx = Math.min(controls.current?.length - 1, index + 1)
    const next =
      direction === "prev"
        ? controls.current[index - 1 || 0]
        : controls.current[nextIdx]
    next && next.focus()

    // IE 9, 10
    event.preventDefault()
  }

  const focusAtIdx = (idx: number) => {
    console.log("idx, controls.current", idx, controls.current)
    const next = controls.current[idx]
    next && next.focus()
  }

  const handler = (event) => {
    switch (event?.key) {
      case "ArrowDown":
        if (
          event?.target?.selectionStart === event?.target?.selectionEnd &&
          event?.target?.selectionEnd === event?.target?.value?.length
        ) {
          changeFocus(event, "next")
        }
        break
      case "ArrowUp":
        if (
          event?.target?.selectionStart === event?.target?.selectionEnd &&
          event?.target?.selectionEnd === 0
        ) {
          changeFocus(event, "prev")
        }
        break
    }
  }

  const keyFocusInputRef = useCallback((element) => {
    if (element && !controls.current.includes(element)) {
      controls.current.push(element)
      element.addEventListener("keydown", handler)
    }
  }, [])

  return {
    keyFocusInputRef,
    focusAtIdx,
  }
}

export default useKeyFocusRef
