import React from "react"
import { Link } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import styles from "./Footer.module.scss"
const Footer = () => {
  const { theme } = React.useContext(ThemeContext)
  return (
    <footer
      className={`${styles.footer} ${
        theme === "dark" ? "darkMode" : "lightMode"
      }`}
    >
      <Link to="/about">About</Link>
      <a target="_blank" href="https://github.com/joseignacioLS">
        Github
      </a>
    </footer>
  )
}

export default Footer
