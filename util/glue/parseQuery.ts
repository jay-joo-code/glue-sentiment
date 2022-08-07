import qs from "qs"

interface IOptions {
  parseNumbers?: boolean
  parseBooleans?: boolean
}

const parseQuery = (
  query: string,
  { parseNumbers = true, parseBooleans = true }: IOptions
) => {
  return qs.parse(query, {
    decoder(str, decoder, charset) {
      const strWithoutPlus = str.replace(/\+/g, " ")
      if (charset === "iso-8859-1") {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape)
      }

      if (parseNumbers && /^(\d+|\d*\.\d+)$/.test(str)) {
        return parseFloat(str)
      }

      const keywords = {
        null: null,
        undefined,
      }

      if (str in keywords) {
        return keywords[str]
      }

      const boolean = {
        true: true,
        false: false,
      }

      if (parseBooleans && str in boolean) {
        return boolean[str]
      }

      // utf-8
      try {
        return decodeURIComponent(strWithoutPlus)
      } catch (e) {
        return strWithoutPlus
      }
    },
  })
}

export default parseQuery
