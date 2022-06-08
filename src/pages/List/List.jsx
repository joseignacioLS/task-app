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

const List = () => {
  const { user } = React.useContext(UserDataContext)
  const [tasks, setTasks] = React.useState([])
  const [userGroups, setUserGroups] = React.useState([
    { _id: null, name: "Private" },
  ])
  const [listIndex, setListIndex] = React.useState(0)
  const [statusFilter, setStatusFilter] = React.useState("pending")
  const [isLoaded, setIsLoaded] = React.useState(false)

  const [currentList, setCurrentList] = React.useState([])

  const [sortAscending, setSortAscending] = React.useState(true)

  const handleToggleSort = () => {
    setSortAscending((oldValue) => !oldValue)
  }

  const handleListChange = () => {
    // reset filter and sort order on list change
    setStatusFilter("pending")
    setSortAscending(true)
    setListIndex((oldValue) => {
      let newValue = oldValue + 1
      if (newValue >= userGroups.length) newValue -= userGroups.length
      return newValue
    })
  }

  const handleStatusToggle = () => {
    setStatusFilter((oldValue) => {
      // change pending-->completed or completed-->pending
      const newValue = { pending: "completed", completed: "pending" }[oldValue]
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
      statusFilter,
      sortAscending
    )
  }, [tasks, userGroups, listIndex, statusFilter, sortAscending])

  return (
    <>
      {!isLoaded && <p>Loading</p>}
      {isLoaded && (
        <>
          <section className="filter-section">
            <button
              className="filter-section__button"
              onClick={handleListChange}
            >
              {userGroups[listIndex].name}
            </button>
            <button
              className="filter-section__button"
              onClick={handleToggleSort}
            >{`Sort ${sortAscending ? "🔺" : "🔻"}`}</button>
            <button
              className="filter-section__button"
              onClick={handleStatusToggle}
            >
              {statusFilter}
            </button>
          </section>

          {currentList.length > 0 ? (
            <ListSection currentList={currentList} />
          ) : (
            <p>Nothing to complete here!</p>
          )}

          <Link to="/newtask" className="to-new-task-container">
            <button className="to-new-task-container__btn">+</button>
          </Link>
          <Link to="/calendar" className="to-calendar-container">
            <button className="to-calendar-container__btn">📅</button>
          </Link>
        </>
      )}
    </>
  )
}

export default List
