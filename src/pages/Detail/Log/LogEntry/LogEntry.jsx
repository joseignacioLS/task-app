import React from "react"
import { UserDataContext } from "../../../../context/UserDataContext"

const LogEntry = ({ entry, userId, index, handleDelete }) => {
  // contexts
  const { user } = React.useContext(UserDataContext)

  return (
    <div
      className={`log-item log-item--${userId === user._id ? "self" : "other"}`}
    >
      {entry.message} - {entry.user.username}{" "}
      <button name={index} onClick={handleDelete}>
        X
      </button>
    </div>
  )
}

export default LogEntry
