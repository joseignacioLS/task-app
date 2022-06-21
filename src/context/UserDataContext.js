import React, { createContext, useReducer } from "react"
import {
  clearUserFromLocalStorage,
  retrieveUserFromLocalStorage,
  setUserLocalStorage,
} from "../shared/utils/localstorage.mjs"

export const UserDataContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case "set":
      setUserLocalStorage(action.userData)
      return action.userData
    case "logout":
      clearUserFromLocalStorage()
      return undefined
    default:
      throw new Error()
  }
}

const UserProvider = ({ children }) => {
  const [user, userDispatcher] = useReducer(
    reducer,
    retrieveUserFromLocalStorage()
  )

  return (
    <UserDataContext.Provider value={{ user, userDispatcher }}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserProvider
