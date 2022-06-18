import React, { useContext, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { UserDataContext } from "../../context/UserDataContext.js"
import Loading from "../../shared/components/Loading/Loading.jsx"
import { requestGetUserGroups } from "../../shared/utils/api.mjs"
import "./List.scss"
import ListSection from "./ListSection/ListSection.jsx"

/**
 * Makes a request to retrieve the groups of the user. If a userList is pased, the index is updated to match
 * that list
 * @param {*} userId id of the user
 * @param {*} setFilter setter of the filter state
 * @param {*} setIsLoaded setter of the isLoaded state
 * @param {*} userList current list visited by the user
 * @param {*} updateGroupIndex function to update the current list
 */
const getGroups = async (
  userId,
  setFilter,
  setIsLoaded,
  userList,
  updateGroupIndex
) => {
  const data = await requestGetUserGroups(userId)
  let res = [{ _id: null, name: "Private" }]
  if (data) {
    const owned = data.ownedGroups.map((g) => ({ _id: g._id, name: g.name }))
    const member = data.memberGroups.map((g) => ({ _id: g._id, name: g.name }))
    if (owned.length > 0) res = [...res, ...owned]
    if (member.length > 0) res = [...res, ...member]
  }
  setIsLoaded(true)
  setFilter((oldValue) => {
    return { ...oldValue, userGroups: res }
  })

  if (userList) updateGroupIndex(userList, res)
}

const List = () => {
  // contexts
  const { user } = useContext(UserDataContext)

  // variables
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState({
    userGroups: [],
    listIndex: 0,
    statusFilter: "pending",
    sortAscending: true,
  })

  const handleToggleSort = () => {
    setFilter((oldValue) => {
      return { ...oldValue, sortAscending: !oldValue.sortAscending }
    })
  }

  const handleListChange = () => {
    let newIndex = filter.listIndex + 1
    if (newIndex >= filter.userGroups.length)
      newIndex -= filter.userGroups.length

    const list = filter.userGroups[newIndex].name
    setSearchParams({ list })

    setFilter((oldValue) => {
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

  const updateGroupIndex = (list, data) => {
    let index = 0
    data.forEach((g, i) => {
      if (g.name === list) index = i
    })
    setFilter((oldValue) => {
      return { ...oldValue, listIndex: index }
    })
  }

  useEffect(() => {
    const list = searchParams.get("list")
    getGroups(user._id, setFilter, setIsLoaded, list, updateGroupIndex)
  }, [])

  useEffect(() => {
    const list = searchParams.get("list")
    if (list) updateGroupIndex(searchParams.get("list"), filter.userGroups)
  }, [searchParams, filter.userGroups])

  return (
    <>
      {isLoaded ? (
        <>
          <section className="filter-section">
            <button
              className="filter-section__button"
              onClick={handleListChange}
            >
              {filter.userGroups[filter.listIndex].name}
            </button>
            <button
              className="filter-section__button"
              onClick={handleToggleSort}
            >{`Sort ${filter.sortAscending ? "🔺" : "🔻"}`}</button>
            <button
              className="filter-section__button"
              onClick={handleStatusToggle}
            >
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
      ) : (
        <Loading />
      )}
    </>
  )
}

export default List
