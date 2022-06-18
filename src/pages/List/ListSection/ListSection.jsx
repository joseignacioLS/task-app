import React, { useContext, useEffect, useState } from "react"
import { UserDataContext } from "../../../context/UserDataContext.js"
import Loading from "../../../shared/components/Loading/Loading.jsx"
import { requestGetUserTasks } from "../../../shared/utils/api.mjs"
import Card from "./Card/Card.jsx"
import "./ListSection.scss"

/**
 * Makes a request to retrieve the tasks of an user
 *
 * @param {*} userId id of the user
 * @param {*} setTasks setter for the tasks state
 * @param {*} setIsLoaded setter for the isLoaded state
 */
const getTasksList = async (userId, setTasks, setIsLoaded) => {
  const data = await requestGetUserTasks(userId)
  if (data) {
    setTasks(data)
    setIsLoaded(true)
  }
}

const showCards = (currentList) => {
  return (
    <ul className="tasks-list">
      {currentList.map(({ _id, title, status, deadline }) => {
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

const generateFilteredList = (tasks, filter) => {
  return tasks
    .filter((task) => {
      return task.group === filter.userGroups[filter.listIndex]._id
    })
    .filter((task) => {
      return (
        filter.statusFilter === "all" || task.status === filter.statusFilter
      )
    })
    .sort((a, b) => {
      if (filter.sortAscending)
        return new Date(a.deadline) - new Date(b.deadline)
      return new Date(b.deadline) - new Date(a.deadline)
    })
}

const ListSection = ({ filter }) => {
  // contexts
  const { user } = useContext(UserDataContext)

  // fetched data
  const [tasks, setTasks] = useState([])

  // variables
  const [isLoaded, setIsLoaded] = useState(false)
  const [listDOM, setListDOM] = useState(null)

  useEffect(() => {
    if (user) {
      getTasksList(user._id, setTasks, setIsLoaded)
    }
  }, [user])

  useEffect(() => {
    if (listDOM) {
      listDOM.style.animation = "none"
      setTimeout(
        () => (listDOM.style.animation = "grow-from-top 500ms forwards"),
        0
      )
    } else {
      setListDOM(() => {
        return document.querySelector(".tasks-list")
      })
    }
  }, [filter, isLoaded])

  return (
    <>
      {isLoaded ? showCards(generateFilteredList(tasks, filter)) : <Loading />}
    </>
  )
}

export default ListSection
