import React from "react"
import { Link } from "react-router-dom"
import { UserDataContext } from "../../../context/UserDataContext.js"
import Loading from "../../../shared/components/Loading/Loading.jsx"
import { requestGetUserTasks } from "../../../shared/utils/api.mjs"
import { addDaysToDate, getDayOfTheWeek } from "../../../shared/utils/date.mjs"
import styles from "./MonthView.module.scss"

const getTasksList = async (userId, setTasks, setIsLoaded) => {
  setIsLoaded(false)
  const data = await requestGetUserTasks(userId)
  if (data) {
    setTasks(data)
    setIsLoaded(true)
  }
}

const showWeeks = (mondays, date, tasks) => {
  return mondays.map((monday) => (
    <div key={JSON.stringify(monday)} className={styles.week}>
      {[0, 1, 2, 3, 4, 5, 6].map((delta) => {
        const newDate = addDaysToDate(monday, delta)
        const today = newDate === date
        const sameMonth = newDate.split("-")[1] === date.split("-")[1]
        const isTasks = tasks.filter((t) => t.deadline === newDate).length > 0
        if (isTasks)
          return (
            <Link
              to={`/dayview/${newDate}`}
              key={JSON.stringify(monday + delta)}
              className={`${styles.dayWithTasks} ${
                sameMonth ? styles.daySameMonth : ""
              } ${today ? styles.dayToday : ""} ${styles.day}`}
            >
              {newDate.slice(8)}
            </Link>
          )
        return (
          <span
            key={JSON.stringify(monday + delta)}
            className={`${sameMonth ? styles.daySameMonth : ""} ${
              today ? styles.dayToday : ""
            } ${styles.day}`}
          >
            {newDate.slice(8)}
          </span>
        )
      })}
    </div>
  ))
}

const MonthView = ({ date }) => {
  const [mondays, setMondays] = React.useState([])
  const [tasks, setTasks] = React.useState([])
  const { user } = React.useContext(UserDataContext)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    const monday = addDaysToDate(date, 8 - getDayOfTheWeek(date))
    const newMondays = [-3, -2, -1, 0, 1].map((delta) =>
      addDaysToDate(monday, 7 * delta)
    )

    if (mondays === []) {
      setMondays(() => newMondays)
    } else if (mondays[0] !== newMondays[0]) {
      setMondays(() => newMondays)
    }
  }, [date, user])

  React.useEffect(() => {
    getTasksList(user._id, setTasks, setIsLoaded)
  }, [])

  return (
    <>
      {isLoaded ? (
        <div className="calendarContainer">
          {showWeeks(mondays, date, tasks)}
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default MonthView
