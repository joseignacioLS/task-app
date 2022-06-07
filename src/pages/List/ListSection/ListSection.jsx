import React from "react"
import Card from "./Card/Card.jsx"
import "./ListSection.scss"

const ListSection = ({ currentList }) => {
  const showCards = () => {
    return (
      <ul className="tasks-list">
        {currentList.map((task) => {
          return (
            <Card
              key={JSON.stringify(task)}
              _id={task._id}
              title={task.title}
              status={task.status}
              group={task.group}
              deadline={task.deadline}
            />
          )
        })}
      </ul>
    )
  }
  return showCards()
}

export default ListSection
