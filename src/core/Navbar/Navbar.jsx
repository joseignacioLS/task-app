import React, { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import { UserDataContext } from "../../context/UserDataContext"

import styles from "./Navbar.module.scss"

const Navbar = ({ className }) => {
  const { user, userDispatcher } = useContext(UserDataContext)
  const { theme } = useContext(ThemeContext)

  const location = useLocation()

  const isLogged = user !== undefined

  return (
    <header
      className={`${className} ${styles.navbar} ${
        theme === "dark" ? "darkMode" : "lightMode"
      }`}
    >
      <section className={`${styles.navbarSection}`}>
        <Link className={styles.title} to="/?list=Private">
          My Tasks
        </Link>
      </section>
      <section className={`accountActionsSelector ${styles.navbarSection}`}>
        {isLogged && (
          <>
            <Link to="/profile" className={styles.username}>
              {user.username}
            </Link>
            <button onClick={() => userDispatcher({ type: "logout" })}>
              Logout
            </button>
          </>
        )}
        {!isLogged && location.pathname !== "/login" && (
          <Link to="/login">Login</Link>
        )}
      </section>
    </header>
  )
}

export default Navbar
