import React from "react"
import { Link } from "react-router-dom"
import { UserDataContext } from "../../context/UserDataContext"
import "./Navbar.scss"

const Navbar = () => {
  const {user, logout} = React.useContext(UserDataContext)
  const logged = user !== undefined
  return (
    <header className="navbar">
      <Link className="navbar__item" to="/">
        Tasks
      </Link>
      <div className="account-actions">
        {logged ? (
          <Link to="/profile">
            {user.username}
          </Link>
        ) : (
          ""
        )}
        {logged && <button onClick={logout}>Logout</button>}
      </div>
    </header>
  )
}

export default Navbar
