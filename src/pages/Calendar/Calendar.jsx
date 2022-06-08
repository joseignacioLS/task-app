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
  console.log("setting week")
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
  weekDates.forEach((d) =>
    getDayTasks(userId, d).then((data) => {
      setWeekTasks((oldValue) => [...oldValue, ...data])
    })
  )
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
            <li key={JSON.stringify(t)}>
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
    setWeekTasks([])
    getWeekData(user._id, weekDates, setWeekTasks)
  }, [user, weekDates])
  return (
    <>
      {!isLoaded && <p>Loading</p>}
      {isLoaded && (
        <>
          <section className="calendar-btns">
            <button onClick={handleTodayChange(-1)}>{"<"}</button>
            <button onClick={handleTodayChange(1)}>{">"}</button>
          </section>
          {showWeek()}
        </>
      )}
    </>
  )
}

export default Calendar
