import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import "./App.scss"
import Footer from "./core/Footer/Footer"
import Modal from "./core/Modal/Modal"
import Navbar from "./core/Navbar/Navbar"
import About from "./pages/About/About"
import Detail from "./pages/Detail/Detail"
import List from "./pages/List/List"
import Login from "./pages/Login/Login"
import React from "react"
import { ModalContext } from "./core/Modal/ModalContext.js"
import CreateTask from "./pages/CreateTask/CreateTask"
import Profile from "./pages/Profile/Profile"
import Group from "./pages/Group/Group"

function App() {
  const [user, setUser] = React.useState()
  const navigate = useNavigate()
  const location = useLocation()
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
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        if (location.pathname !== "/about") navigate("/login")
      }
    }
  }, [user, navigate])
  return (
    <>
      <ModalContext.Provider value={updateModalData}>
        <Navbar user={user} logout={logout} />
        <main className="page-container">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/" element={<List user={user} />} />
            <Route path="/detail/:id" element={<Detail user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/newtask" element={<CreateTask user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/group/:id" element={<Group user={user} />} />
          </Routes>
        </main>
        <Footer />
        {modalData.isVisible && (
          <Modal message={modalData.message} options={modalData.options} />
        )}
      </ModalContext.Provider>
    </>
  )
}

export default App
