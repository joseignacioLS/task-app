import React from "react"
import { Link } from "react-router-dom"
import "./Footer.scss"
const Footer = () => {
  return (
    <footer className="footer">
      <Link to="/about">About</Link>
      <a target="_blank" href="https://github.com/joseignacioLS">
        Github
      </a>
    </footer>
  )
}

export default Footer
