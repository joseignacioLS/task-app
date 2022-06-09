import React from "react"
import { Link } from "react-router-dom"
import "./Card.scss"
import { checkExpiration } from "../../../../shared/utils/date.mjs"

const generateClass = (status, className, deadline) => {
  if (checkExpiration(deadline) && status === "pending") {
    return className + "--expired"
  }
  return ""
}
const Card = ({ _id, title, status, deadline }) => {
  return (
    <Link to={`/detail/${_id}`} className="task-item">
      <p
        className={
          "task-item__title " +
          generateClass(status, "task-item__title", deadline)
        }
      >
        {title}
      </p>
      <p
        className={
          "task-item__date " +
          generateClass(status, "task-item__date", deadline)
        }
      >
        ({deadline})
      </p>
    </Link>
  )
}

export default Card
