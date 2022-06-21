import React, { useContext, useEffect } from "react"
import styles from "./Modal.module.scss"
import { ModalContext } from "../../context/ModalContext"
import { useLocation } from "react-router-dom"

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
  const location = useLocation()

  const handleAcceptModal = (f) => {
    return () => {
      if (f) f()
      modalDispatcher({ type: "hide" })
    }
  }

  useEffect(() => {
    console.log(location.pathname)
    modalDispatcher({ type: "hide" })
  }, [location.pathname])

  return (
    <>
      {modalData.isVisible && (
        <div className={styles.screen}>
          <div
            className={`${styles.modal} ${
              modalData.isError ? styles.error : ""
            }`}
          >
            <p>{modalData.message}</p>
            <div className={styles.modalActions}>
              {showOptions(modalData.options, handleAcceptModal)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
