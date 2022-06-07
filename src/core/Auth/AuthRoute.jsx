import React from "react"
import { Navigate } from "react-router-dom"
import { UserDataContext } from "../../context/UserDataContext"
import { retrieveUserFromLocalStorage } from "../../shared/utils/localstorage.mjs"

const AuthRoute = ({ component }) => {
  const { user, setUser } = React.useContext(UserDataContext)
  if (user) return component

  if (!retrieveUserFromLocalStorage(setUser, false)) {
    return (
      <Navigate to="/login" state={{ prevRoute: window.location.pathname }} />
    )
  }
}

export default AuthRoute
