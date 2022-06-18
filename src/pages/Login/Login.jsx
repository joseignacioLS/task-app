import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ModalContext } from "../../context/ModalContext.js"
import { UserDataContext } from "../../context/UserDataContext.js"
import Loading from "../../shared/components/Loading/Loading.jsx"
import PasswordInput from "../../shared/components/PasswordInput/PasswordInput.jsx"
import { requestLogin, requestRegister } from "../../shared/utils/api.mjs"
import "./Login.scss"

const Login = () => {
  // context
  const { modalDispatcher } = useContext(ModalContext)
  const { userDispatcher } = useContext(UserDataContext)

  // forms
  const [formData, setFormData] = useState({ username: "", password: "" })

  // variables
  const [mode, setMode] = useState("login")
  const [isLogin, setIsLogin] = useState(false)

  // other
  const navigate = useNavigate()

  const handleInput = (e) => {
    const key = e.target.name
    const value = e.target.value
    setFormData((oldValue) => {
      return { ...oldValue, [key]: value }
    })
  }

  const handleModeTogle = () => {
    const newMode = { login: "register", register: "login" }[mode]
    setMode(newMode)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLogin(true)
    let response
    if (mode === "login")
      response = await requestLogin(formData.username, formData.password)
    else if (mode === "register")
      response = await requestRegister(formData.username, formData.password)
    if (response) {
      userDispatcher({ type: "set", userData: response })
      navigate("/")
    } else {
      modalDispatcher({
        type: "error",
        payload: {
          message: `${mode} error`,
        },
      })
    }
    setIsLogin(false)
  }
  return (
    <>
      {isLogin ? (
        <Loading />
      ) : (
        <>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-form__field">
              <p>Username</p>
              <input
                onInput={handleInput}
                name="username"
                type="text"
                value={formData.username}
              />
            </label>
            <label className="login-form__field">
              <p>Password</p>
              <PasswordInput
                onInput={handleInput}
                name="password"
                type="password"
                value={formData.password}
              />
            </label>
            <button type="submit">{mode}</button>
            <p onClick={handleModeTogle}>
              {mode === "login"
                ? "New? register here"
                : "Registered? Login here"}
            </p>
          </form>
        </>
      )}
    </>
  )
}

export default Login
