import React from "react"
import { ModalContext } from "../../context/ModalContext"

const ModalBlock = ({ component }) => {
  const { isVisible } = React.useContext(ModalContext)
  console.log(isVisible)

  if (!isVisible) return component
}

export default ModalBlock
