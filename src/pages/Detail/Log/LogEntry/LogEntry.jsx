import React, { useContext } from "react"
import { UserDataContext } from "../../../../context/UserDataContext"
import style from "./LogEntry.module.scss"

const LogEntry = ({ entry, userId, index, handleDelete }) => {
  // contexts
  const { user } = useContext(UserDataContext)

  const isLogged = user !== undefined

  return (
    <div
      className={`${style.logItem} ${
        isLogged && userId === user._id ? style.logItemSelf : style.logItemOther
      }`}
    >
      <span className={style.logEntry}>
        {entry.message} - {entry.user.username}{" "}
      </span>
      {isLogged && (
        <button name={index} onClick={handleDelete}>
          X
        </button>
      )}
    </div>
  )
}

export default LogEntry
