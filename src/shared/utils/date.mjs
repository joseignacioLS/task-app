/**
 * Calculates whether the date is older than today date
 *
 * @param {*} date date in yyyy-mm-dd
 * @returns Boolean
 */

const checkExpiration = (date) => {
  return new Date(date) <= new Date(getTodayDate())
}

/**
 * Gets the current today date
 * @returns a string in yyyy-mm-dd format
 */
const getTodayDate = () => {
  return dateToFormattedString(new Date())
}

/**
 * Compares a date with today date and calculates the difference in days
 * @param {*} date date to compare
 * @returns An integer
 */
const daysUntilDeadline = (date) => {
  const diff = new Date(date) - new Date(getTodayDate())
  return Math.ceil(diff / (1000 * 3600 * 24))
}

/**
 * Formates a date object into a yyyy-mm-dd string
 * @param {*} d date to format
 * @returns A yyyy-mm-dd string
 */
const dateToFormattedString = (d) => {
  return d.toISOString().split("T")[0]
}

/**
 * Adds a number of days to a date
 * @param {*} date yyyy-mm-dd string
 * @param {*} days integer
 * @returns A yyyy-mm-dd string
 */
const addDaysToDate = (date, days) => {
  const oldDate = new Date(date)
  const newDate = new Date(
    oldDate.getFullYear(),
    oldDate.getMonth(),
    oldDate.getDate() + (days + 1)
  )
  return dateToFormattedString(newDate)
}

/**
 * Gets the day of the week from a date (1-monday; 7-sunday)
 * @param {*} date yyyy-mm-dd date
 * @returns Integer
 */
const getDayOfTheWeek = (date) => {
  const d = new Date(date)
  const englishDay = d.getDay()
  const normDay = englishDay + 7
  return normDay > 7 ? normDay - 7 : normDay
}

/**
 * Gets the number of the month as a string and returns its name
 * @param {*} dd number of month in double digit string format
 * @returns string
 */
const doubleDigitMonthToText = (dd) => {
  const dict = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  }

  return dict[dd]
}

export {
  checkExpiration,
  getTodayDate,
  dateToFormattedString,
  daysUntilDeadline,
  addDaysToDate,
  getDayOfTheWeek,
  doubleDigitMonthToText,
}
