import React from "react"
import Card from "./Card/Card.jsx"

const ListSection = ({ currentList }) => {
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

export default ListSection
