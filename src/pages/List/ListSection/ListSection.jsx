import React from "react"
import { UserDataContext } from "../../../context/UserDataContext.js"
import Loading from "../../../shared/components/Loading/Loading.jsx"
import { getUserTasks } from "../../../shared/utils/api.mjs"
import Card from "./Card/Card.jsx"
import "./ListSection.scss"

const getTasksList = async (userId, setTasks, setIsLoaded) => {
  const data = await getUserTasks(userId)
  if (data) {
    setTasks(data)
    setIsLoaded(true)
  }
}

const handleCurrentListChange = (
  tasks,
  setCurrentList,

  filter
) => {
  const filteredTaskList = tasks
    .filter((task) => {
      return task.group === filter.userGroups[filter.listIndex]._id
    })
    .filter((task) => {
      return task.status === filter.statusFilter
    })
    .sort((a, b) => {
      if (filter.sortAscending)
        return new Date(a.deadline) - new Date(b.deadline)
      return new Date(b.deadline) - new Date(a.deadline)
    })
  setCurrentList(filteredTaskList)
}

const showCards = (currentList) => {
  return (
    <ul className="tasks-list">
      {currentList.map(({ _id, title, status, group, deadline }) => {
        return (
          <Card
            key={_id}
            _id={_id}
            title={title}
            status={status}
            deadline={deadline}
          />
        )
      })}
    </ul>
  )
}

const ListSection = ({ filter }) => {
  // contexts
  const { user } = React.useContext(UserDataContext)

  // fetched data
  const [tasks, setTasks] = React.useState([])

  // variables
  const [currentList, setCurrentList] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      getTasksList(user._id, setTasks, setIsLoaded, handleCurrentListChange)
    }
  }, [user])

  React.useEffect(() => {
    handleCurrentListChange(tasks, setCurrentList, filter)
  }, [tasks, filter])

  return (
    <>
      {!isLoaded && <Loading />}
      {isLoaded && showCards(currentList)}
    </>
  )
}

export default ListSection
