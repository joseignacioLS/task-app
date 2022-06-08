import React from "react"
import { UserDataContext } from "../../../context/UserDataContext.js"
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
  userGroups,
  listIndex = 0,
  statusFilter = "pending",
  sortAscending = false
) => {
  const filteredTaskList = tasks
    .filter((task) => {
      return task.group === userGroups[listIndex]._id
    })
    .filter((task) => {
      return task.status === statusFilter
    })
    .sort((a, b) => {
      if (sortAscending) return new Date(a.deadline) - new Date(b.deadline)
      return new Date(b.deadline) - new Date(a.deadline)
    })
  setCurrentList(filteredTaskList)
}

const ListSection = ({
  userGroups,
  listIndex,
  statusFilter,
  sortAscending,
}) => {
  const { user } = React.useContext(UserDataContext)
  const [isLoaded, setIsLoaded] = React.useState(false)

  const [tasks, setTasks] = React.useState([])
  const [currentList, setCurrentList] = React.useState([])

  React.useEffect(() => {
    if (user) {
      getTasksList(user._id, setTasks, setIsLoaded, handleCurrentListChange)
    }
  }, [user])

  React.useEffect(() => {
    handleCurrentListChange(
      tasks,
      setCurrentList,
      userGroups,
      listIndex,
      statusFilter,
      sortAscending
    )
  }, [tasks, userGroups, listIndex, statusFilter, sortAscending])

  const showCards = () => {
    return isLoaded ? (
      <ul className="tasks-list">
        {currentList.map((task) => {
          return (
            <Card
              key={task._id}
              _id={task._id}
              title={task.title}
              status={task.status}
              group={task.group}
              deadline={task.deadline}
            />
          )
        })}
      </ul>
    ) : (
      "Loading"
    )
  }
  return showCards()
}

export default ListSection
