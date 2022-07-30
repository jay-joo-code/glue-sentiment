export const getMonday = (d: Date) => {
  if (!d) return null

  d = new Date(d)
  const day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1)

  return new Date(d.setDate(diff))
}

export const getSunday = (d: Date) => {
  if (!d) return null

  const monday = getMonday(d)
  const sunday = new Date()
  sunday.setDate(monday.getDate() + 6)
  return sunday
}
