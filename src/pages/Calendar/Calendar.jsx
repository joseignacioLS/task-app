import React from "react"
import { addDaysToDate, getTodayDate } from "../../shared/utils/date.mjs"
import "./Calendar.scss"
import { UserDataContext } from "../../context/UserDataContext.js"
import { requestGetUserTasks } from "../../shared/utils/api.mjs"
import { Link } from "react-router-dom"

const getDayTasks = async (userId, date) => {
  const tasks = await requestGetUserTasks(userId, date)
  return tasks
}

const getWeek = async (today, setWeekDates, setIsLoaded) => {
  const newWeekDates = []

  const refDate = addDaysToDate(today, -1)

  for (let i = 0; i < 3; i++) {
    const newDate = addDaysToDate(refDate, i)
    newWeekDates.push(newDate)
  }

  setWeekDates(newWeekDates)

  setIsLoaded(true)
}

const getWeekData = async (userId, weekDates, setWeekTasks) => {
  let newData = []
  for (let i = 0; i < weekDates.length; i++) {
    const data = await getDayTasks(userId, weekDates[i])
    newData = [...newData, ...data]
  }
  setWeekTasks(newData)
}

const resetToday = (setToday) => {
  setToday(getTodayDate())
}

const showTasks = (d, weekTasks) => {
  return (
    <ul className="day__tasks">
      {weekTasks
        .filter((t) => t.deadline === d)
        .map(({ _id, title, status }) => (
          <li key={_id}>
            <Link
              className={`task ${
                status === "completed" ? "task--completed" : ""
              }`}
              to={`/detail/${_id}`}
            >
              {title}
            </Link>
          </li>
        ))}
    </ul>
  )
}

const showWeek = (weekDates, weekTasks) => {
  return (
    <div className="week">
      {weekDates.map((d) => {
        return (
          <div className="day" key={d}>
            <p className="day__date">{d}</p>
            {weekTasks.length > 0 && showTasks(d, weekTasks)}
          </div>
        )
      })}
    </div>
  )
}

const Calendar = () => {
  // context
  const { user } = React.useContext(UserDataContext)

  // fetch data
  const [weekDates, setWeekDates] = React.useState([])
  const [weekTasks, setWeekTasks] = React.useState([])

  // varriables
  const [today, setToday] = React.useState(getTodayDate())
  const [isLoaded, setIsLoaded] = React.useState(false)

  const handleTodayChange = (delta) => {
    return (e) => {
      e.preventDefault()
      const newToday = addDaysToDate(today, delta)
      setToday(newToday)
    }
  }

  React.useEffect(() => {
    getWeek(today, setWeekDates, setIsLoaded)
  }, [today, user])

  React.useEffect(() => {
    getWeekData(user._id, weekDates, setWeekTasks)
  }, [user, weekDates])

  return (
    <>
      {isLoaded && (
        <>
          <section className="calendar-btns">
            <button
              className="calendar-btns__page"
              onClick={handleTodayChange(-1)}
            >
              {"<"}
            </button>
            <button
              className="calendar-btns__reset"
              onClick={() => resetToday(setToday)}
            >
              {"Reset date"}
            </button>
            <button
              className="calendar-btns__page"
              onClick={handleTodayChange(1)}
            >
              {">"}
            </button>
          </section>
          {showWeek(weekDates, weekTasks)}
        </>
      )}
    </>
  )
}

export default Calendar
