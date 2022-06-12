import React from "react"
import { Link } from "react-router-dom"
import styles from "./Footer.module.scss"
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link to="/about">About</Link>
      <a target="_blank" href="https://github.com/joseignacioLS">
        Github
      </a>
    </footer>
  )
}

export default Footer
