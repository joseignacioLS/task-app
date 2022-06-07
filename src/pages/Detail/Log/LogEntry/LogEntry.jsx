import React from "react"

const LogEntry = ({ entry, index, handleDelete }) => {
  return (
    <div className="log-item">
      {entry.message} - {entry.user.username}{" "}
      <button name={index} onClick={handleDelete}>
        X
      </button>
    </div>
  )
}

export default LogEntry
