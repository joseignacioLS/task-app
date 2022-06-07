import { Route, Routes, useNavigate, Navigate } from "react-router-dom"
import "./App.scss"
import Footer from "./core/Footer/Footer"
import Modal from "./core/Modal/Modal"
import Navbar from "./core/Navbar/Navbar"
import About from "./pages/About/About"
import Detail from "./pages/Detail/Detail"
import List from "./pages/List/List"
import Login from "./pages/Login/Login"
import React from "react"
import { ModalContext } from "./context/ModalContext.js"
import { UserDataContext } from "./context/UserDataContext.js"
import CreateTask from "./pages/CreateTask/CreateTask"
import Profile from "./pages/Profile/Profile"
import Group from "./pages/Group/Group"
import AuthRoute from "./core/Auth/AuthRoute"
import { retrieveUserFromLocalStorage } from "./shared/utils/localstorage.mjs"

function App() {
  const [user, setUser] = React.useState()
  const navigate = useNavigate()
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

  const logout = () => {
    setUser(undefined)
    localStorage.removeItem("user")
    navigate("/login")
  }

  React.useEffect(() => {
    if (!user) {
      retrieveUserFromLocalStorage(setUser)
    }
  }, [user])

  return (
    <>
      <UserDataContext.Provider value={{ user, setUser, logout }}>
        <ModalContext.Provider
          value={{ isVisible: modalData.isVisible, updateModalData }}
        >
          <Navbar />
          <main className="page-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<AuthRoute component={<List />} />} />
              <Route
                path="/detail/:id"
                element={<AuthRoute component={<Detail />} />}
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/newtask"
                element={<AuthRoute component={<CreateTask />} />}
              />
              <Route
                path="/profile"
                element={<AuthRoute component={<Profile />} />}
              />
              <Route
                path="/group/:id"
                element={<AuthRoute component={<Group />} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
          {modalData.isVisible && (
            <Modal message={modalData.message} options={modalData.options} />
          )}
        </ModalContext.Provider>
      </UserDataContext.Provider>
    </>
  )
}

export default App
