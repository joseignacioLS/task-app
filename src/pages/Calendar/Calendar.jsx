import React from "react"
import {
  dateToFormattedString,
  getTodayDate,
} from "../../shared/utils/date.mjs"
import "./Calendar.scss"
import { UserDataContext } from "../../context/UserDataContext.js"
import { getUserTasks } from "../../shared/utils/api.mjs"
import { Link } from "react-router-dom"

const getDayTasks = async (userId, date) => {
  const tasks = await getUserTasks(userId, date)
  return tasks
}

const getWeek = async (today, setWeekDates, setIsLoaded) => {
  const newWeekDates = []

  const refDate = new Date(today)
  refDate.setDate(refDate.getDate() - 1)

  for (let i = 0; i < 3; i++) {
    const d = new Date(refDate)
    d.setDate(refDate.getDate() + i)
    const newDate = dateToFormattedString(d)
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

const Calendar = () => {
  const { user } = React.useContext(UserDataContext)
  const [weekDates, setWeekDates] = React.useState([])
  const [weekTasks, setWeekTasks] = React.useState([])
  const [today, setToday] = React.useState(getTodayDate())
  const [isLoaded, setIsLoaded] = React.useState(false)

  const handleTodayChange = (delta) => {
    return (e) => {
      e.preventDefault()
      let d = new Date(today)
      d.setDate(d.getDate() + delta)
      const newToday = dateToFormattedString(d)
      setToday(newToday)
    }
  }

  const resetToday = () => {
    setToday(getTodayDate())
  }

  const showWeek = () => {
    return (
      <div className="week">
        {weekDates.map((d) => {
          return (
            <div className="day" key={d}>
              <p className="day__date">{d}</p>
              {weekTasks.length > 0 && showTasks(d)}
            </div>
          )
        })}
      </div>
    )
  }

  const showTasks = (d) => {
    return (
      <ul className="day__tasks">
        {weekTasks
          .filter((t) => t.deadline === d)
          .map((t) => (
            <li key={t._id}>
              <Link to={`/detail/${t._id}`}>{t.title}</Link>
            </li>
          ))}
      </ul>
    )
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
            <button className="calendar-btns__reset" onClick={resetToday}>
              {"Reset date"}
            </button>
            <button
              className="calendar-btns__page"
              onClick={handleTodayChange(1)}
            >
              {">"}
            </button>
          </section>
          {showWeek()}
        </>
      )}
    </>
  )
}

export default Calendar
