import React from "react"
import { Link } from "react-router-dom"
import { UserDataContext } from "../../context/UserDataContext.js"
import { getUserGroups } from "../../shared/utils/api.mjs"
import "./List.scss"
import ListSection from "./ListSection/ListSection.jsx"

const getGroups = async (userId, setUserGroups) => {
  const data = await getUserGroups(userId)
  if (data) {
    const owned = data.ownedGroups.map((g) => ({ _id: g._id, name: g.name }))
    const member = data.memberGroups.map((g) => ({ _id: g._id, name: g.name }))
    setUserGroups([{ _id: null, name: "Private" }, ...owned, ...member])
  }
}

const List = () => {
  const { user } = React.useContext(UserDataContext)
  const [userGroups, setUserGroups] = React.useState([
    { _id: null, name: "Private" },
  ])
  const [listIndex, setListIndex] = React.useState(0)
  const [statusFilter, setStatusFilter] = React.useState("pending")

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
    }
  }, [user])

  const showListSection = () => {
    return (
      <ListSection
        userGroups={userGroups}
        listIndex={listIndex}
        statusFilter={statusFilter}
        sortAscending={sortAscending}
      />
    )
  }

  return (
    <>
      <section className="filter-section">
        <button className="filter-section__button" onClick={handleListChange}>
          {userGroups[listIndex].name}
        </button>
        <button
          className="filter-section__button"
          onClick={handleToggleSort}
        >{`Sort ${sortAscending ? "🔺" : "🔻"}`}</button>
        <button className="filter-section__button" onClick={handleStatusToggle}>
          {statusFilter}
        </button>
      </section>

      {showListSection()}

      <Link to="/newtask" className="to-new-task-container">
        <button className="to-new-task-container__btn">+</button>
      </Link>
      <Link to="/calendar" className="to-calendar-container">
        <button className="to-calendar-container__btn">📅</button>
      </Link>
    </>
  )
}

export default List
