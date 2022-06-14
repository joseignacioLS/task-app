import React from "react"
import styles from "./Day.module.scss"

const Day = ({ date, today, hasTasks, sameMonth, handleClick }) => {
  return (
    <span
      onClick={handleClick}
      key={JSON.stringify(date)}
      className={`${hasTasks? styles.dayWithTasks: ""} ${
        sameMonth ? styles.daySameMonth : ""
      } ${today ? styles.dayToday : ""} ${styles.day}`}
    >
      {date.slice(8)}
    </span>
  )
}

export default Day
