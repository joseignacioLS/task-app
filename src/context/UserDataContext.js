import React from "react"
import {
  clearUserFromLocalStorage,
  retrieveUserFromLocalStorage,
  setUserLocalStorage,
} from "../shared/utils/localstorage.mjs"

export const UserDataContext = React.createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState(retrieveUserFromLocalStorage())

  const storeUser = (data) => {
    setUserLocalStorage(data)
    setUser(data)
  }

  const logout = () => {
    setUser(undefined)
    clearUserFromLocalStorage()
  }

  return (
    <UserDataContext.Provider value={{ user, setUser, logout, storeUser }}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserProvider
