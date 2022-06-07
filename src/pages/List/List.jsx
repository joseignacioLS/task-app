import React from "react"
import { Link } from "react-router-dom"
import { UserDataContext } from "../../context/UserDataContext.js"
import { getUserGroups, getUserTasks } from "../../shared/utils/api.mjs"
import "./List.scss"
import ListSection from "./ListSection/ListSection.jsx"

const getTasksList = async (userId, setTasks, setIsLoaded) => {
  const data = await getUserTasks(userId)
  if (data) {
    setTasks(data)
    setIsLoaded(true)
  }
}

const getGroups = async (userId, setUserGroups) => {
  const data = await getUserGroups(userId)
  if (data) {
    const owned = data.ownedGroups.map((g) => ({ _id: g._id, name: g.name }))
    const member = data.memberGroups.map((g) => ({ _id: g._id, name: g.name }))
    setUserGroups([{ _id: null, name: "Private" }, ...owned, ...member])
  }
}

const handleCurrentListChange = (
  tasks,
  setCurrentList,
  userGroups,
  listIndex = 0,
  statusFilter = "pending"
) => {
  const filteredTaskList = tasks
    .filter((task) => {
      return task.group === userGroups[listIndex]._id
    })
    .filter((task) => {
      return task.status === statusFilter
    })
  setCurrentList(filteredTaskList)
}

const List = () => {
  const {user} = React.useContext(UserDataContext)
  const [tasks, setTasks] = React.useState([])
  const [userGroups, setUserGroups] = React.useState([
    { _id: null, name: "Private" },
  ])
  const [listIndex, setListIndex] = React.useState(0)
  const [statusFilter, setStatusFilter] = React.useState("pending")
  const [isLoaded, setIsLoaded] = React.useState(false)

  const [currentList, setCurrentList] = React.useState([])

  const handleListChange = () => {
    setStatusFilter("pending")
    setListIndex((oldValue) => {
      let newValue = oldValue + 1
      if (newValue >= userGroups.length) newValue -= userGroups.length
      return newValue
    })
  }

  React.useEffect(() => {
    if (user) {
      getGroups(user._id, setUserGroups)
      getTasksList(user._id, setTasks, setIsLoaded, handleCurrentListChange)
    }
  }, [user])

  React.useEffect(() => {
    handleCurrentListChange(
      tasks,
      setCurrentList,
      userGroups,
      listIndex,
      statusFilter
    )
  }, [tasks, userGroups, listIndex, statusFilter])

  const handleStatusToggle = () => {
    setStatusFilter((oldValue) => {
      const newValue = { pending: "completed", completed: "pending" }[oldValue]
      return newValue
    })
  }

  return (
    <>
      {isLoaded && (
        <>
          <section className="filter-section">
            <button className="filter-section__button" onClick={handleListChange}>{userGroups[listIndex].name}</button>
            <button className="filter-section__button" onClick={handleStatusToggle}>{statusFilter}</button>
          </section>

          {currentList.length > 0 ? (
            <ListSection currentList={currentList} />
          ) : (
            <p>Nothing to complete here!</p>
          )}

          <Link to="/newtask">
          <button className="new-btn" >+</button>
          </Link>
        </>
      )}
    </>
  )
}

export default List
