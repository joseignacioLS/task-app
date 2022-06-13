import React from "react"
import { Link } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import { UserDataContext } from "../../context/UserDataContext"

import styles from "./Navbar.module.scss"

const Navbar = () => {
  const { user, logout } = React.useContext(UserDataContext)
  const isLogged = user !== undefined
  const { theme, toggleTheme } = React.useContext(ThemeContext)

  return (
    <header
      className={`${styles.navbar} ${theme === "dark" ? "darkMode" : "lightMode"}`}
    >
      <button className={styles.themeBtn} onClick={toggleTheme}>
        {theme}
      </button>
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
