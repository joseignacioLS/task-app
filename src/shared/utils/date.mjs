const checkExpiration = (date) => {
  return new Date(date) <= new Date(getTodayDate())
}

const daysUntilDeadline = (date) => {
  const diff = new Date(date) - new Date(getTodayDate())
  return Math.ceil((diff) / (1000 * 3600 * 24))
}

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0]
}

const dateToFormattedString = (d) => {
  return d.toISOString().split("T")[0]
}

const addDaysToDate = (date, days) => {
  let d = new Date(date)
  d.setDate(d.getDate() + days)
  const newDate = dateToFormattedString(d)
  return newDate

}

export {
  checkExpiration,
  getTodayDate,
  dateToFormattedString,
  daysUntilDeadline,
  addDaysToDate
}
