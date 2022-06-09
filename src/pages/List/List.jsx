import React from "react"
import { Link, useSearchParams } from "react-router-dom"
import { UserDataContext } from "../../context/UserDataContext.js"
import { getUserGroups } from "../../shared/utils/api.mjs"
import "./List.scss"
import ListSection from "./ListSection/ListSection.jsx"

const getGroups = async (userId) => {
  const data = await getUserGroups(userId)
  if (data) {
    const owned = data.ownedGroups.map((g) => ({ _id: g._id, name: g.name }))
    const member = data.memberGroups.map((g) => ({ _id: g._id, name: g.name }))
    return [{ _id: null, name: "Private" }, ...owned, ...member]
  }
  return [{ _id: null, name: "Private" }]
}

const List = () => {
  const { user } = React.useContext(UserDataContext)
  const [filter, setFilter] = React.useState({
    userGroups: [{ _id: null, name: "Private" }],
    listIndex: 0,
    statusFilter: "pending",
    sortAscending: true,
  })
  const [searchParams, setSearchParams] = useSearchParams()

  const handleToggleSort = () => {
    setFilter((oldValue) => {
      return { ...oldValue, sortAscending: !oldValue.sortAscending }
    })
  }

  const handleListChange = () => {
    setFilter((oldValue) => {
      let newIndex = oldValue.listIndex + 1
      if (newIndex >= oldValue.userGroups.length)
        newIndex -= oldValue.userGroups.length

      return {
        ...oldValue,
        statusFilter: "pending",
        sortAscending: true,
        listIndex: newIndex,
      }
    })
  }

  const handleStatusToggle = () => {
    setFilter((oldValue) => {
      const newValue = { pending: "completed", completed: "pending" }[
        oldValue.statusFilter
      ]
      return { ...oldValue, statusFilter: newValue }
    })
  }

  React.useEffect(() => {
    //get query params
    const userInputList = searchParams.get("list")

    getGroups(user._id).then((data) => {
      let index = 0
      data.forEach((g, i) => {
        if (g.name === userInputList) index = i
      })
      setFilter((oldValue) => {
        return { ...oldValue, userGroups: data, listIndex: index }
      })
    })
  }, [])

  React.useEffect(() => {
    setSearchParams({ list: filter.userGroups[filter.listIndex].name })
  }, [filter.userGroups, filter.listIndex])

  return (
    <>
      <section className="filter-section">
        <button className="filter-section__button" onClick={handleListChange}>
          {filter.userGroups[filter.listIndex].name}
        </button>
        <button
          className="filter-section__button"
          onClick={handleToggleSort}
        >{`Sort ${filter.sortAscending ? "🔺" : "🔻"}`}</button>
        <button className="filter-section__button" onClick={handleStatusToggle}>
          {filter.statusFilter}
        </button>
      </section>

      <ListSection filter={filter} />
      <section className="sticky-btns">
        <Link to="/calendar" className="to-calendar">
          <button className="to-calendar__btn">📅</button>
        </Link>
        <Link
          to={`/newtask?list=${filter.userGroups[filter.listIndex].name}`}
          className="to-new-task"
        >
          <button className="to-new-task__btn">+</button>
        </Link>
      </section>
    </>
  )
}

export default List
