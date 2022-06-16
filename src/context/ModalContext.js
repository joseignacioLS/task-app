import React from "react"

export const ModalContext = React.createContext()

const INITIAL_STATE = {
  isVisible: false,
  message: "",
  options: [
    {
      title: "Ok",
      f: () => {},
    },
  ],
}

const reducer = (state, action) => {
  switch (action.type) {
    case "error":
      return {
        message: action.payload.message,
        isVisible: true,
        isError: true,
        options: null,
      }
    case "message":
      return {
        message: action.payload.message,
        isVisible: true,
        isError: false,
        options: null,
      }
    case "options":
      return {
        message: action.payload.message,
        isVisible: true,
        isError: false,
        options: action.payload.options,
      }
    default:
      throw new Error()
  }
}

const ModalProvider = ({ children }) => {
  const [modalData2, modalDispatcher] = React.useReducer(reducer, INITIAL_STATE)

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
        modalDispatcher,
        modalData2,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
