import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import styles from "./Footer.module.scss"
const Footer = ({className}) => {
  const { theme } = useContext(ThemeContext)
  return (
    <footer
      className={`${className} ${styles.footer} ${
        theme === "dark" ? "darkMode" : "lightMode"
      }`}
    >
      <Link to="/about">About</Link>
      <a target="_blank" href="https://github.com/joseignacioLS/task-app" rel="noopener noreferrer">
        Github
      </a>
    </footer>
  )
}

export default Footer
