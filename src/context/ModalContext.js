import React from "react"

export const ModalContext = React.createContext()

const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = React.useState({
    isVisible: false,
    message: "",
    options: [
      {
        title: "Ok",
        f: () => {},
      },
    ],
  })
  const updateModalData = (
    message,
    isVisible = true,
    options = [
      {
        title: "Ok",
        f: () => {},
      },
    ]
  ) => {
    setModalData({
      isVisible,
      message,
      options,
    })
  }

  return (
    <ModalContext.Provider
      value={{
        isVisible: modalData.isVisible,
        message: modalData.message,
        options: modalData.options,
        updateModalData,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
