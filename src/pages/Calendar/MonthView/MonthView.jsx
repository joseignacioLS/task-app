import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserDataContext } from "../../../context/UserDataContext.js"
import Loading from "../../../shared/components/Loading/Loading.jsx"
import { requestGetUserTasks } from "../../../shared/utils/api.mjs"
import {
  addDaysToDate,
  doubleDigitMonthToText,
  getDayOfTheWeek,
} from "../../../shared/utils/date.mjs"
import Day from "./Day/Day.jsx"
import styles from "./MonthView.module.scss"

/**
 * Makes a call to the API requesting all the tasks for the provided userId
 *
 * @param {*} userId the id of the user
 * @param {*} setTasks the setter of the tasks state
 * @param {*} setIsLoaded  the setter of the isLoaded state
 */
const getTasksList = async (userId, setTasks, setIsLoaded) => {
  setIsLoaded(false)
  const data = await requestGetUserTasks(userId)
  if (data) {
    setTasks(data)
    setIsLoaded(true)
  }
}

/**
 * Produces an array of 5 dates (all mondays) corresponding to the 2 previous, current and 2 posterior weeks
 * of the provided date
 *
 * @param {*} date  date in format yyy-mm-dd
 * @returns Array with the calculated dates
 */
const generateMondays = (date) => {
  const monday = addDaysToDate(date, -(getDayOfTheWeek(date) - 1))
  const newMondays = [-2, -1, 0, 1, 2].map((delta) => {
    return addDaysToDate(monday, 7 * delta)
  })
  return newMondays
}

const showWeek = (date, monday, tasks, handleClick) => {
  return [0, 1, 2, 3, 4, 5, 6].map((delta) => {
    const newDate = addDaysToDate(monday, delta)
    const today = newDate === date
    const sameMonth = newDate.split("-")[1] === date.split("-")[1]
    const pendingTasks =
      tasks.filter((t) => t.deadline === newDate && t.status === "pending")
        .length > 0
    const completedTasks =
      tasks.filter((t) => t.deadline === newDate && t.status === "completed")
        .length > 0
    if (pendingTasks || completedTasks)
      return (
        <Day
          key={newDate}
          date={newDate}
          today={today}
          hasTasks={[pendingTasks, completedTasks]}
          sameMonth={sameMonth}
          handleClick={handleClick(newDate, date, true)}
        />
      )
    return (
      <Day
        key={newDate}
        date={newDate}
        today={today}
        hasTasks={[false, false]}
        sameMonth={sameMonth}
        handleClick={handleClick(newDate, date, false)}
      />
    )
  })
}

/**
 * Generates a JSX with the grid structure of the calendar
 *
 * @param {*} date current date
 * @param {*} tasks array of tasks
 * @param {*} handleClick function to handle click on the day components
 * @returns A JSX object containing divs (weeks) which contain Day components
 */
const showWeeks = (date, tasks, handleClick) => {
  const mondays = generateMondays(date)
  return mondays.map((monday) => (
    <div key={JSON.stringify(monday)} className={styles.week}>
      {showWeek(date, monday, tasks, handleClick)}
    </div>
  ))
}

const MonthView = ({ date, setToday }) => {
  const [tasks, setTasks] = useState([])
  const { user } = useContext(UserDataContext)
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  const handleClick = (clickedDate, currentDate, visit) => {
    return () => {
      if (clickedDate === currentDate && visit) {
        return navigate(`/dayview/${clickedDate}`)
      }
      setToday(clickedDate)
    }
  }

  useEffect(() => {
    getTasksList(user._id, setTasks, setIsLoaded)
  }, [user._id])

  return (
    <>
      {isLoaded ? (
        <div className={styles.calendarContainer}>
          {showWeeks(date, tasks, handleClick)}
          <span className={styles.currentMonth}>
            {`${doubleDigitMonthToText(date.split("-")[1])} ${
              date.split("-")[0]
            }`}
          </span>
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default MonthView
