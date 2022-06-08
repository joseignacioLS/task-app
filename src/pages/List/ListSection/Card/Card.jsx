import React from "react"
import { Link } from "react-router-dom"
import "./Card.scss"
import { checkExpiration } from "../../../../shared/utils/date.mjs"

const Card = ({ _id, title, status, group, deadline }) => {
  return (
    <Link to={`/detail/${_id}`} className="task-item">
      <p
        className={`task-item__title ${
          status === "pending" && checkExpiration(deadline)
            ? "task-item__title--expired"
            : ""
        }`}
      >
        <strong>{title}</strong> ({deadline})
      </p>
      <p className="task-item__team">{group ? "🏣" : ""}</p>
    </Link>
  )
}

export default Card
