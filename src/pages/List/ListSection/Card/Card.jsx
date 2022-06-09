import React from "react"
import { Link } from "react-router-dom"
import "./Card.scss"
import { checkExpiration } from "../../../../shared/utils/date.mjs"

const Card = ({ _id, title, status, group, deadline }) => {
  const className = `task-item__title ${
    status === "pending" && checkExpiration(deadline)
      ? "task-item__title--expired"
      : ""
  }`
  return (
    <Link to={`/detail/${_id}`} className="task-item">
      <p className={className}>
        {title}
        <p className={className}>({deadline})</p>
      </p>
    </Link>
  )
}

export default Card
