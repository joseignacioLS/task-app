import React from "react"

const LogEntry = ({ entry, userId,  index, handleDelete }) => {
  console.log(entry.user._id, userId)
  return (
    <div className={`log-item log-item--${userId === entry.user._id? "self":"other"}`}  >
      {entry.message} - {entry.user.username}{" "}
      <button name={index} onClick={handleDelete}>
        X
      </button>
    </div>
  )
}

export default LogEntry
