const checkExpiration = (date) => {
  const parsedDate = date.split("-").map((n) => parseInt(n))
  const parsedToday = getTodayDate()
    .split("-")
    .map((n) => parseInt(n))

  const yearCheck = parsedDate[0] < parsedToday[0]
  if (yearCheck) return true

  const monthCheck =
    parsedDate[0] === parsedToday[0] && parsedDate[1] < parsedToday[1]

  if (monthCheck) return true

  const dayCheck =
    parsedDate[0] === parsedToday[0] &&
    parsedDate[1] === parsedToday[1] &&
    parsedDate[2] <= parsedToday[2]

  if (dayCheck) return true
  return false
}

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0]
}

export { checkExpiration, getTodayDate }
