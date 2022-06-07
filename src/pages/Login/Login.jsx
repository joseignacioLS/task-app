import React from "react"
import { useNavigate } from "react-router-dom"
import { ModalContext } from "../../core/Modal/ModalContext.js"
import { login } from "../../shared/utils/api.mjs"

const Login = ({ setUser }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = React.useState({ username: "", password: "" })

  const updateModalData = React.useContext(ModalContext)

  const onInput = (e) => {
    const key = e.target.name
    const value = e.target.value
    setFormData((oldValue) => {
      return { ...oldValue, [key]: value }
    })
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    const response = await login(formData.username, formData.password)
    if (response) {
      setUser(response)
      localStorage.setItem("user", JSON.stringify(response))
      navigate("/")
    } else {
      updateModalData("Login Error")
    }
  }
  return (
    <>
      <form>
        <label>
          <p>Username</p>
          <input
            onInput={onInput}
            name="username"
            type="text"
            value={formData.username}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            onInput={onInput}
            name="password"
            type="password"
            value={formData.password}
          />
        </label>
        <button onClick={onSubmit}>Login</button>
      </form>
    </>
  )
}

export default Login
