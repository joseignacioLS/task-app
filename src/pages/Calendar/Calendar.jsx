import React from "react"
import { getTodayDate } from "../../shared/utils/date.mjs"
import "./Calendar.scss"
import MonthView from "./MonthView/MonthView.jsx"

/**
 * Resets the state today to the current date
 * @param {*} setToday setter of the state today
 */
const resetToday = (setToday) => {
  setToday(getTodayDate())
}
const Calendar = () => {
  // varriables
  const [today, setToday] = React.useState(getTodayDate())

  return (
    <>
      <section className="calendar-btns">
        <button
          className="calendar-btns__reset"
          onClick={() => resetToday(setToday)}
        >
          {"Reset date"}
        </button>
      </section>
      <MonthView date={today} setToday={setToday} />
    </>
  )
}

export default Calendar
