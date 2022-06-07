import React from "react"
import "./Modal.scss"
import { ModalContext } from "../../context/ModalContext"

const Modal = ({ message, options }) => {
  const { updateModalData } = React.useContext(ModalContext)

  const handleAcceptModal = (f) => {
    return () => {
      f()
      updateModalData("", false)
    }
  }

  const showOptions = () => {
    return options.map((opt) => {
      return (
        <button key={JSON.stringify(opt)} onClick={handleAcceptModal(opt.f)}>
          {opt.title}
        </button>
      )
    })
  }

  return (
    <div className="screen">
      <div className="modal">
        <p>{message}</p>
        <div className="modal__actions">
          {showOptions()}
        </div>
      </div>
    </div>
  )
}

export default Modal
