import React from "react"
import { Link } from "react-router-dom"
import { UserDataContext } from "../../context/UserDataContext"

import styles from "./Navbar.module.scss"

const Navbar = () => {
  const { user, logout } = React.useContext(UserDataContext)
  const isLogged = user !== undefined

  return (
    <header className={styles.navbar}>
      <Link className={styles.navbarItem} to="/">
        My Tasks
      </Link>
      <div className={styles.accountActions}>
        {isLogged ? <Link to="/profile">{user.username}</Link> : ""}
        {isLogged && <button onClick={logout}>Logout</button>}
      </div>
    </header>
  )
}

export default Navbar
