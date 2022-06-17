import React, { useContext, useState } from "react"
import { ModalContext } from "../../../context/ModalContext"
import { UserDataContext } from "../../../context/UserDataContext"
import { requestRemoveMessageFromLog } from "../../../shared/utils/api.mjs"
import style from "./Log.module.scss"
import LogEntry from "./LogEntry/LogEntry"

/**
 * Generates the view of the log of the task
 * @param {*} tasklog log of the task
 * @param {*} handleDelete function to handle the deletion of a log entry
 * @returns A JSX object containing the log
 */
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
  const { user } = useContext(UserDataContext)

  const isLogged = user !== undefined

  const { modalDispatcher } = useContext(ModalContext)

  // forms
  const [newMessage, setNewMessage] = useState("")

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
    modalDispatcher({
      type: "options",
      payload: {
        message: "Delete the comment?",
        options: [
          {
            title: "Yes",
            f: async () => {
              const index = e.target.name
              await requestRemoveMessageFromLog(_id, index)
              await getTaskInformation()
            },
          },
          { title: "No", f: null },
        ],
      },
    })
  }

  return (
    <section className={style.taskLog} onSubmit={handleSubmit}>
      <h2>Task Log</h2>
      {isLogged && (
        <form className={style.taskLogFrom}>
          <input type="text" value={newMessage} onInput={handleInput} />
          <button type="submit">Add log</button>
        </form>
      )}
      <section className={style.taskLogList}>
        {showLogEntries(tasklog, handleDelete)}
      </section>
    </section>
  )
}

export default Log
