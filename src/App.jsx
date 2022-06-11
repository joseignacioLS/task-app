import { Route, Routes } from "react-router-dom"
import Footer from "./core/Footer/Footer"
import Modal from "./core/Modal/Modal"
import Navbar from "./core/Navbar/Navbar"
import React from "react"
import ModalProvider from "./context/ModalContext.js"
import UserProvider from "./context/UserDataContext.js"
import routes, { secureRoute } from "./config/routes"
import styles from "./App.module.scss"

function App() {
  return (
    <>
      <UserProvider>
        <ModalProvider>
          <Navbar />
          <main className={styles.pageContainer}>
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
