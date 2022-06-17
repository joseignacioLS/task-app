import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { UserDataContext } from "../../context/UserDataContext"

const AuthRoute = ({ component }) => {
  const { user } = useContext(UserDataContext)

  if (user) return component

  return (
    <Navigate to="/login" state={{ prevRoute: window.location.pathname }} />
  )
}

export default AuthRoute
