import React from "react"
import { addDaysToDate, getTodayDate } from "../../shared/utils/date.mjs"
import "./Calendar.scss"
import MonthView from "./MonthView/MonthView.jsx"

const resetToday = (setToday) => {
  setToday(getTodayDate())
}
const Calendar = () => {
  // varriables
  const [today, setToday] = React.useState(getTodayDate())

  const handleTodayChange = (delta) => {
    return (e) => {
      e.preventDefault()
      const newToday = addDaysToDate(today, delta)
      setToday(newToday)
    }
  }

  return (
    <>
      <section className="calendar-btns">
        <button className="calendar-btns__page" onClick={handleTodayChange(-1)}>
          {"<"}
        </button>
        <button
          className="calendar-btns__reset"
          onClick={() => resetToday(setToday)}
        >
          {"Reset date"}
        </button>
        <button className="calendar-btns__page" onClick={handleTodayChange(1)}>
          {">"}
        </button>
      </section>
      <MonthView date={today} />
    </>
  )
}

export default Calendar
