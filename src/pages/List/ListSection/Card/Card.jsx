import React from "react"
import { Link } from "react-router-dom"
import "./Card.scss"
import { daysUntilDeadline } from "../../../../shared/utils/date.mjs"

const Card = ({ _id, title, status, deadline }) => {
  const [daysLeft, setDaysLeft] = React.useState(
    (15 - daysUntilDeadline(deadline)) / 15
  )

  return (
    <Link to={`/detail/${_id}`} className="task-item">
      {status === "pending" && (
        <div
          className="color-filter"
          style={{ "--deadline": `${daysLeft}` }}
        ></div>
      )}
      <p className={"task-item__title"}>{title}</p>
      <p className={"task-item__date "}>({deadline})</p>
    </Link>
  )
}

export default Card
