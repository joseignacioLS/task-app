import React from "react"
import { Link } from "react-router-dom"
import "./Card.scss"
import { daysUntilDeadline } from "../../../../shared/utils/date.mjs"

const Card = ({ _id, title, status, deadline }) => {
  const daysLeft = daysUntilDeadline(deadline)
  const opacity = (15 - daysLeft) / 15
  const highContrastOpacity = opacity >= 1 ? 1 : opacity - 0.5

  return (
    <Link to={`/detail/${_id}`} className="task-item">
      {status === "pending" && (
        <div
          className="color-filter"
          style={{ "--deadline": `${highContrastOpacity}` }}
        ></div>
      )}
      <p className={"task-item__title"}>{title}</p>
      <p className={"task-item__date "}>({deadline})</p>
    </Link>
  )
}

export default Card
