import React, { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ModalContext } from "../../context/ModalContext"
import { UserDataContext } from "../../context/UserDataContext"
import Loading from "../../shared/components/Loading/Loading"
import {
  requestAddMessageToLog,
  requestDeleteTask,
  requestGetTask,
  requestUpdateTask,
} from "../../shared/utils/api.mjs"
import { checkExpiration } from "../../shared/utils/date.mjs"
import EditableField from "./EditableField/EditableField"
import Log from "./Log/Log"
import style from "./Detail.module.scss"

/**
 * Makes a request to Add a new message by the user to the log of the tasks  *
 * @param {*} userId id of the user
 * @param {*} taskId id of the tasks
 * @param {*} newMessage new message to add to the log
 */
const updateTaskLog = async (userId, taskId, newMessage) => {
  if (newMessage !== "") {
    await requestAddMessageToLog(taskId, userId, newMessage)
  }
}

/**
 * Makes a request to update the the desired field of a tasks with a new value
 *
 * @param {*} taskId id of the task
 * @param {*} name name of the field to update
 * @param {*} value new value of the field
 */
const updateTaskField = async (taskId, name, value) => {
  await requestUpdateTask(taskId, { [name]: value })
}

const Detail = () => {
  // contexts
  const { user } = useContext(UserDataContext)
  const { modalDispatcher } = useContext(ModalContext)

  const isLogged = user !== undefined

  // fetched data
  const [task, setTask] = useState({})

  // variables
  const { id } = useParams()
  const [isLoaded, setIsLoaded] = useState(false)
  const isExpired = task.status === "pending" && checkExpiration(task.deadline)

  // others
  const navigate = useNavigate()

  const getTaskInformation = async (id) => {
    const newData = await requestGetTask(id)
    setTask(newData)
    setIsLoaded(true)
  }

  const handleCompleteTask = () => {
    modalDispatcher({
      type: "options",
      payload: {
        message: `Is '${task.title}' completed?`,
        options: [
          {
            title: "Yes",
            f: async () => {
              await updateTaskField(task._id, "status", "completed")
              await updateTaskLog(user._id, task._id, "Task completed")
              navigate(
                `/?list=${task.group?.name ? task.group.name : "Private"}`
              )
            },
          },
          {
            title: "No",
            f: null,
          },
        ],
      },
    })
  }

  const handleUnCompleteTask = () => {
    modalDispatcher({
      type: "options",
      payload: {
        message: `Reopen '${task.title}'?`,
        options: [
          {
            title: "Yes",
            f: async () => {
              await updateTaskField(task._id, "status", "pending")
              await updateTaskLog(user._id, task._id, "Task reopened")
              await getTaskInformation(id)
            },
          },
          {
            title: "No",
            f: null,
          },
        ],
      },
    })
  }

  const handleRemoveTask = () => {
    modalDispatcher({
      type: "options",
      payload: {
        message: `Delete '${task.title}'?`,
        options: [
          {
            title: "Yes",
            f: async () => {
              const response = await requestDeleteTask(task._id)
              if (!response) {
                modalDispatcher({
                  type: "error",
                  payload: {
                    message: "Error deleting the task",
                  },
                })
                return
              }
              const query = task.group?.name ?? "Private"
              navigate(`/?list=${query}`)
            },
          },
          {
            title: "No",
            f: () => {},
          },
        ],
      },
    })
  }

  const handleDescriptionUpdate = async (newDescription) => {
    await updateTaskField(task._id, "description", newDescription)
    await updateTaskLog(user._id, task._id, "Description Updated")
    await getTaskInformation(id)
  }
  const handleTitleUpdate = async (newTitle) => {
    await updateTaskField(task._id, "title", newTitle)
    await updateTaskLog(user._id, task._id, "Title Updated")
    await getTaskInformation(id)
  }
  const handleDeadlineUpdate = async (newDeadline) => {
    await updateTaskField(task._id, "deadline", newDeadline)
    await updateTaskLog(user._id, task._id, "Deadline Updated")
    await getTaskInformation(id)
  }

  useEffect(() => {
    getTaskInformation(id)
  }, [id])

  return (
    <>
      {isLoaded ? (
        <div className={style.detailContainer}>
          <div className={style.taskDetail}>
            <EditableField
              value={task.title}
              onUpdateF={handleTitleUpdate}
              textClass={style.taskDetailTitle}
              inputClass={style.taskDetailTitleInput}
              type="input"
              isEditable={isLogged}
            />
            <p className={style.taskDetailOwnership}>
              Owner:{" "}
              {task.user?.username ? task.user?.username : task.group.name}
            </p>
            <p className={style.taskDetailStatus}>
              Status: {isExpired ? "missed" : task.status}
            </p>
            <EditableField
              type="date"
              onUpdateF={handleDeadlineUpdate}
              value={task.deadline}
              textClass={style.taskDetailDeadline}
              inputClass={style.taskDetailDeadlineInput}
              classMod={style.expired}
              classModCheck={isExpired}
              isEditable={isLogged}
            />
            <EditableField
              value={task.description}
              onUpdateF={handleDescriptionUpdate}
              textClass={style.taskDetailDescription}
              inputClass={style.taskDetailDescriptionInput}
              maxLength={25600}
              type="textarea"
              isEditable={isLogged}
            />

            {user?._id && (
              <section className={style.taskDetailHandle}>
                {task.status === "pending" && (
                  <button onClick={handleCompleteTask}>Complete Task</button>
                )}
                {task.status === "completed" && (
                  <button onClick={handleUnCompleteTask}>Reopen Task</button>
                )}
                <button onClick={handleRemoveTask}>Remove Task</button>
              </section>
            )}
          </div>
          <Log
            _id={task._id}
            tasklog={task.log}
            updateTaskLog={updateTaskLog}
            getTaskInformation={() => getTaskInformation(id)}
          />
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Detail
