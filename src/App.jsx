import { Route, Routes } from "react-router-dom"
import Footer from "./core/Footer/Footer"
import Modal from "./core/Modal/Modal"
import Navbar from "./core/Navbar/Navbar"
import React, { useContext } from "react"
import ModalProvider from "./context/ModalContext.js"
import UserProvider from "./context/UserDataContext.js"
import routes, { secureRoute } from "./config/routes"
import styles from "./App.module.scss"
import { ThemeContext } from "./context/ThemeContext"

function App() {
  const { theme } = useContext(ThemeContext)
  return (
    <>
      <UserProvider>
        <ModalProvider>
          <Navbar />
          <main
            className={`${styles.pageContainer} ${
              theme === "dark" ? "darkMode" : "lightMode"
            }`}
          >
            <Routes>
              {routes.map((route) => {
                return (
                  <Route
                    path={route.path}
                    key={route.path}
                    element={secureRoute(route.element, route.secured)}
                  />
                )
              })}
            </Routes>
          </main>
          <Footer />
          <Modal />
        </ModalProvider>
      </UserProvider>
    </>
  )
}

export default App
