import React, { createContext, useReducer } from "react"

export const ModalContext = createContext()

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
        options: action.payload.options,
      }
    case "options":
      return {
        message: action.payload.message,
        isVisible: true,
        isError: false,
        options: action.payload.options,
      }
    case "hide":
      return { message: "", isVisible: false, isError: false, options: [] }
    default:
      throw new Error()
  }
}

const ModalProvider = ({ children }) => {
  const [modalData, modalDispatcher] = useReducer(reducer, INITIAL_STATE)

  return (
    <ModalContext.Provider
      value={{
        modalDispatcher,
        modalData,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
