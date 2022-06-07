import React from "react"
import { ModalContext } from "../../../core/Modal/ModalContext"
import { removeMessageFromLog } from "../../../shared/utils/api.mjs"
import "./Log.scss"
import LogEntry from "./LogEntry/LogEntry"

const Log = ({ _id, tasklog, updateTaskLog, getTaskInformation }) => {
  const [newMessage, setNewMessage] = React.useState("")
  const updateModalData = React.useContext(ModalContext)

  const handleInput = (e) => {
    setNewMessage(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setNewMessage("")

    await updateTaskLog(_id, newMessage)
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
  return (
    <section className="task-log">
      <form className="task-log__form">
        <input type="text" value={newMessage} onInput={handleInput} />
        <button onClick={handleSubmit}>Add log</button>
      </form>
      <section className="task-log__list">
        {tasklog?.map((entry, index) => (
          <LogEntry key={JSON.stringify(entry + index)} entry={entry} index={index} handleDelete={handleDelete} />
        ))}
      </section>
    </section>
  )
}

export default Log
