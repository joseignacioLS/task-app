import React, { useContext } from "react"
import "./Modal.scss"
import { ModalContext } from "../../context/ModalContext"

const showOptions = (options, handleAcceptModal) => {
  if (!options || options.length === 0)
    return <button onClick={handleAcceptModal(() => {})}>Ok</button>

  return options.map((opt) => {
    return (
      <button key={opt.title} onClick={handleAcceptModal(opt.f)}>
        {opt.title}
      </button>
    )
  })
}

const Modal = () => {
  const { modalData, modalDispatcher } = useContext(ModalContext)

  const handleAcceptModal = (f) => {
    return () => {
      if (f) f()
      modalDispatcher({ type: "hide" })
    }
  }

  return (
    <>
      {modalData.isVisible && (
        <div className="screen">
          <div className={`modal ${modalData.isError ? "error" : ""}`}>
            <p>{modalData.message}</p>
            <div className="modal__actions">
              {showOptions(modalData.options, handleAcceptModal)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
