import React from "react"
import { useNavigate } from "react-router-dom"
import { ModalContext } from "../../context/ModalContext.js"
import { UserDataContext } from "../../context/UserDataContext.js"
import { login, register } from "../../shared/utils/api.mjs"
import "./Login.scss"

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = React.useState({ username: "", password: "" })
  const [mode, setMode] = React.useState("login")

  const { setUser } = React.useContext(UserDataContext)

  const { updateModalData } = React.useContext(ModalContext)

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
    let response
    if (mode === "login")
      response = await login(formData.username, formData.password)
    if (mode === "register")
      response = await register(formData.username, formData.password)
    if (response) {
      setUser(response)
      localStorage.setItem("user", JSON.stringify(response))
      navigate("/")
    } else {
      updateModalData(`${mode} error`)
    }
  }
  return (
    <>
      <form className="login-form">
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
          <input
            onInput={handleInput}
            name="password"
            type="password"
            value={formData.password}
          />
        </label>
        <button onClick={handleSubmit}>{mode}</button>
        <p onClick={handleModeTogle}>
          {mode === "login" ? "New? register here" : "Registered? Login here"}
        </p>
      </form>
    </>
  )
}

export default Login
