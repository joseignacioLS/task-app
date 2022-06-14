import React from "react"
import { Link, useParams } from "react-router-dom"
import { UserDataContext } from "../../../../context/UserDataContext"
import { requestGetUserTasks } from "../../../../shared/utils/api.mjs"

const getDayTasks = async (userId, date, setTasks) => {
  const data = await requestGetUserTasks(userId, date)
  if (data) setTasks(data)
}

const DayView = () => {
  const { user } = React.useContext(UserDataContext)
  const { date } = useParams()
  const [tasks, setTasks] = React.useState([])

  React.useEffect(() => {
    getDayTasks(user._id, date, setTasks)
  }, [user, date])

  return (
    <>
      <div>{date}</div>
      <div>
        {tasks.map((t) => {
          return (
            <li key={t._id}>
              <Link to={`/detail/${t._id}`}>{t.title}</Link>
            </li>
          )
        })}
      </div>
    </>
  )
}

export default DayView
