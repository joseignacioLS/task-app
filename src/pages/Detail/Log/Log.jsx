import React from "react"
import { ModalContext } from "../../../context/ModalContext"
import { UserDataContext } from "../../../context/UserDataContext"
import { removeMessageFromLog } from "../../../shared/utils/api.mjs"
import "./Log.scss"
import LogEntry from "./LogEntry/LogEntry"

const Log = ({ _id, tasklog, updateTaskLog, getTaskInformation }) => {
  const { user } = React.useContext(UserDataContext)
  const [newMessage, setNewMessage] = React.useState("")
  const { updateModalData } = React.useContext(ModalContext)

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
          await removeMessageFromLog(_id, index)
          await getTaskInformation()
        },
      },
      { title: "No", f: () => {} },
    ])
  }

  const showLogEntries = () => {
    return tasklog?.map((entry, index) => (
      <LogEntry
        key={JSON.stringify(entry + index)}
        entry={entry}
        index={index}
        handleDelete={handleDelete}
      />
    ))
  }
  return (
    <section className="task-log" onSubmit={handleSubmit}>
      <form className="task-log__form">
        <input type="text" value={newMessage} onInput={handleInput} />
        <button type="submit">Add log</button>
      </form>
      <section className="task-log__list">{showLogEntries()}</section>
    </section>
  )
}

export default Log
