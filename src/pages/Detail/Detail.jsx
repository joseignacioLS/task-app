import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ModalContext } from "../../context/ModalContext"
import { UserDataContext } from "../../context/UserDataContext"
import {
  addMessageToLog,
  deleteTask,
  getTask,
  updateTask,
} from "../../shared/utils/api.mjs"
import { checkExpiration } from "../../shared/utils/date.mjs"
import "./Detail.scss"
import EditableField from "./EditableField/EditableField"
import Log from "./Log/Log"

const updateTaskLog = async (userId, taskId, newMessage) => {
  if (newMessage !== "") {
    await addMessageToLog(taskId, userId, newMessage)
  }
}

const updateTaskField = async (taskId, name, value) => {
  await updateTask(taskId, { [name]: value })
}

const Detail = () => {
  const { user } = React.useContext(UserDataContext)
  const { id } = useParams()
  const [task, setTask] = React.useState({})
  const [isLoaded, setIsLoaded] = React.useState(false)
  const { updateModalData } = React.useContext(ModalContext)
  const isExpired = task.status === "pending" && checkExpiration(task.deadline)

  const navigate = useNavigate()

  const getTaskInformation = (id) => {
    return async () => {
      const newData = await getTask(id)
      setTask(newData)
      setIsLoaded(true)
    }
  }

  const handleCompleteTask = () => {
    updateModalData(`Is '${task.title}' completed?`, true, [
      {
        title: "Yes",
        f: async () => {
          await updateTaskField(task._id, "status", "completed")
          await updateTaskLog(user._id, task._id, "Task completed")
          await getTaskInformation(id)()
        },
      },
      {
        title: "No",
        f: () => {},
      },
    ])
  }

  const handleUnCompleteTask = () => {
    updateModalData(`Reopen '${task.title}'?`, true, [
      {
        title: "Yes",
        f: async () => {
          await updateTaskField(task._id, "status", "pending")
          await updateTaskLog(user._id, task._id, "Task reopened")
          await getTaskInformation(id)()
        },
      },
      {
        title: "No",
        f: () => {},
      },
    ])
  }

  const handleRemoveTask = () => {
    updateModalData(`Delete '${task.title}'?`, true, [
      {
        title: "Yes",
        f: async () => {
          const response = await deleteTask(task._id)
          if (!response) {
            updateModalData("Error deleting the task", true, [
              {
                title: "ok",
                f: () => {},
              },
            ])
            return
          }
          navigate("/")
        },
      },
      {
        title: "No",
        f: () => {},
      },
    ])
  }

  const handleDescriptionUpdate = async (newDescription) => {
    await updateTaskField(task._id, "description", newDescription)
    await updateTaskLog(user._id, task._id, "Description Updated")
    await getTaskInformation(id)()
  }
  const handleTitleUpdate = async (newTitle) => {
    await updateTaskField(task._id, "title", newTitle)
    await updateTaskLog(user._id, task._id, "Title Updated")
    await getTaskInformation(id)()
  }
  const handleDeadlineUpdate = async (newDeadline) => {
    await updateTaskField(task._id, "deadline", newDeadline)
    await updateTaskLog(user._id, task._id, "Deadline Updated")
    await getTaskInformation(id)()
  }

  React.useEffect(() => {
    getTaskInformation(id)()
  }, [id])

  return (
    <>
      {!isLoaded && <p>Loading</p>}
      {isLoaded && (
        <article className="task-detail">
          <EditableField
            value={task.title}
            onUpdateF={handleTitleUpdate}
            textClass="task-detail__title"
            inputClass="task-detail__title-input"
            type="input"
          />
          <p className="task-detail__ownership">
            Owner: {task.user?.username ? task.user?.username : task.group.name}
          </p>
          <p className="task-detail__status">
            Status: {isExpired ? "missed" : task.status}
          </p>
          <EditableField
            type="date"
            onUpdateF={handleDeadlineUpdate}
            value={task.deadline}
            textClass="task-detail__deadline"
            inputClass="task-detail__deadline-input"
            classMod="--expired"
            classModCheck={isExpired}
          />
          <EditableField
            value={task.description}
            onUpdateF={handleDescriptionUpdate}
            textClass="task-detail__description"
            inputClass="task-detail__description-input"
            maxLength={25600}
            type="textarea"
          />

          <section className="task-detail__handler">
            {task.status === "pending" && (
              <button onClick={handleCompleteTask}>Complete Task</button>
            )}
            {task.status === "completed" && (
              <button onClick={handleUnCompleteTask}>Reopen Task</button>
            )}
            <button onClick={handleRemoveTask}>Remove Task</button>
          </section>
          <Log
            _id={task._id}
            tasklog={task.log}
            updateTaskLog={updateTaskLog}
            getTaskInformation={getTaskInformation(id)}
          />
        </article>
      )}
    </>
  )
}

export default Detail
