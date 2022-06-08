const checkExpiration = (date) => {
  return new Date(date) <= new Date(getTodayDate())
}

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0]
}

export { checkExpiration, getTodayDate }
