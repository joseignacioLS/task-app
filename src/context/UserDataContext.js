import React from "react"
import {
  clearUserFromLocalStorage,
  retrieveUserFromLocalStorage,
  setUserLocalStorage,
} from "../shared/utils/localstorage.mjs"

export const UserDataContext = React.createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case "set":
      console.log(action.userData)
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
  const [user, userDispatcher] = React.useReducer(
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
