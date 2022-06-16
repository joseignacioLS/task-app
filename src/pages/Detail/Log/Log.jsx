import React from "react"
import { ModalContext } from "../../../context/ModalContext"
import { UserDataContext } from "../../../context/UserDataContext"
import { requestRemoveMessageFromLog } from "../../../shared/utils/api.mjs"
import "./Log.scss"
import LogEntry from "./LogEntry/LogEntry"

const showLogEntries = (tasklog, handleDelete) => {
  return tasklog?.map((entry, index) => (
    <LogEntry
      key={JSON.stringify(entry + index)}
      entry={entry}
      index={index}
      handleDelete={handleDelete}
    />
  ))
}

const Log = ({ _id, tasklog, updateTaskLog, getTaskInformation }) => {
  // contexts
  const { user } = React.useContext(UserDataContext)
  const { updateModalData } = React.useContext(ModalContext)

  // forms
  const [newMessage, setNewMessage] = React.useState("")

  const handleInput = (e) => {
    setNewMessage(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setNewMessage("")

    await updateTaskLog(user._id, _id, newMessage)
    await getTaskInformation()
  }

  const handleDelete = (e) => {
    e.preventDefault()
    updateModalData("Delete the comment?", true, [
      {
        title: "Yes",
        f: async () => {
          const index = e.target.name
          await requestRemoveMessageFromLog(_id, index)
          await getTaskInformation()
        },
      },
      { title: "No", f: () => {} },
    ])
  }

  return (
    <section className="task-log" onSubmit={handleSubmit}>
      <h2>Task Log</h2>
      {user?._id && (
        <form className="task-log__form">
          <input type="text" value={newMessage} onInput={handleInput} />
          <button type="submit">Add log</button>
        </form>
      )}
      <section className="task-log__list">
        {showLogEntries(tasklog, handleDelete)}
      </section>
    </section>
  )
}

export default Log
