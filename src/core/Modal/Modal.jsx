import React from "react"
import "./Modal.scss"
import { ModalContext } from "./ModalContext"
const Modal = ({ message, options }) => {
  const updateModalData = React.useContext(ModalContext)
  const onAcceptModal = (f) => {
    return () => {
      f()
      updateModalData("", false)
    }
  }
  return (
    <div className="screen">
      <div className="modal">
        <p>{message}</p>
        <div className="modal__actions">
          {options.map((opt) => {
            return (
              <button key={JSON.stringify(opt)} onClick={onAcceptModal(opt.f)}>
                {opt.title}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Modal
