import React from "react"
import { Link, useParams } from "react-router-dom"
import { UserDataContext } from "../../../../context/UserDataContext"
import Loading from "../../../../shared/components/Loading/Loading"
import { requestGetUserTasks } from "../../../../shared/utils/api.mjs"
import style from "./DayView.module.scss"

/**
 * Makes a request to retrieve the tasks for the desired user and deadline (date)
 * 
 * @param {*} userId id of the user
 * @param {*} date date in format yyyy-mm-dd
 * @param {*} setTasks setter for the tasks state
 * @param {*} setIsLoaded setter for the isLoaded state
 */
const getDayTasks = async (userId, date, setTasks, setIsLoaded) => {
  setIsLoaded(false)
  const data = await requestGetUserTasks(userId, date)
  if (data) {
    setTasks(data)
    setIsLoaded(true)
  }
}

/**
 * Generates the JSX view of the list of tasks
 * @param {*} tasks list of tasks
 * @returns An JSX object
 */
const showTasks = (tasks) => {
  return tasks.map((t) => {
    return (
      <li
        className={`${style.taskListItem} ${
          t.status === "completed" ? style.completed : ""
        }`}
        key={t._id}
      >
        <Link to={`/detail/${t._id}`}>{t.title}</Link>
      </li>
    )
  })
}

const DayView = () => {
  const { user } = React.useContext(UserDataContext)
  const { date } = useParams()
  const [tasks, setTasks] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    getDayTasks(user._id, date, setTasks, setIsLoaded)
  }, [user, date])

  return (
    <div className={style.container}>
      <p className={style.date}>{date}</p>
      {isLoaded ? (
        <ul className={style.taskList}>{showTasks(tasks)}</ul>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default DayView
