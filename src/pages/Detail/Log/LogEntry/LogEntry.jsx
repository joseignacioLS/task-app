import React from "react"
import { UserDataContext } from "../../../../context/UserDataContext"
import styles from "./LogEntry.module.scss"

const LogEntry = ({ entry, userId, index, handleDelete }) => {
  // contexts
  const { user } = React.useContext(UserDataContext)

  return (
    <div
      className={`log-item log-item--${userId === user._id ? "self" : "other"}`}
    >
      <span className={styles.logEntry}>
        {entry.message} - {entry.user.username}{" "}
      </span>
      <button name={index} onClick={handleDelete}>
        X
      </button>
    </div>
  )
}

export default LogEntry
