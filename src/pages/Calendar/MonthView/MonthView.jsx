import React from "react"
import { Link, useNavigate } from "react-router-dom"
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

const getTasksList = async (userId, setTasks, setIsLoaded) => {
  setIsLoaded(false)
  const data = await requestGetUserTasks(userId)
  if (data) {
    setTasks(data)
    setIsLoaded(true)
  }
}

const generateMondays = (date) => {
  const monday = addDaysToDate(date, -(getDayOfTheWeek(date) - 1))
  const newMondays = [-2, -1, 0, 1, 2].map((delta) => {
    console.log(monday, delta * 7, addDaysToDate(monday, 7 * delta))
    return addDaysToDate(monday, 7 * delta)
  })
  return newMondays
}

const showWeeks = (date, tasks, handleClick) => {
  const mondays = generateMondays(date)
  return mondays.map((monday) => (
    <div key={JSON.stringify(monday)} className={styles.week}>
      {[0, 1, 2, 3, 4, 5, 6].map((delta) => {
        const newDate = addDaysToDate(monday, delta)
        const today = newDate === date
        const sameMonth = newDate.split("-")[1] === date.split("-")[1]
        const pendingTasks =
          tasks.filter((t) => t.deadline === newDate && t.status === "pending")
            .length > 0
        const completedTasks =
          tasks.filter(
            (t) => t.deadline === newDate && t.status === "completed"
          ).length > 0
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
      })}
    </div>
  ))
}

const MonthView = ({ date, setToday }) => {
  const [tasks, setTasks] = React.useState([])
  const { user } = React.useContext(UserDataContext)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const navigate = useNavigate()

  const handleClick = (clickedDate, currentDate, visit) => {
    return () => {
      if (clickedDate === currentDate && visit) {
        return navigate(`/dayview/${clickedDate}`)
      }
      setToday(clickedDate)
    }
  }

  React.useEffect(() => {
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
