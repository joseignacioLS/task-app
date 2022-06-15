import React from "react"
import { Link, useParams } from "react-router-dom"
import { UserDataContext } from "../../../../context/UserDataContext"
import Loading from "../../../../shared/components/Loading/Loading"
import { requestGetUserTasks } from "../../../../shared/utils/api.mjs"
import style from "./DayView.module.scss"

const getDayTasks = async (userId, date, setTasks, setIsLoaded) => {
  setIsLoaded(false)
  const data = await requestGetUserTasks(userId, date)
  if (data) {
    setTasks(data)
    setIsLoaded(true)
  }
}
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
