import React, { createContext, useReducer } from "react"

export const ThemeContext = createContext()

const INITIAL_STATE = { theme: localStorage.getItem("theme") || "light" }

const reducer = (state, action) => {
  switch (action.type) {
    case "toggle":
      const newTheme = state.theme === "light" ? "dark" : "light"
      return { theme: newTheme }
    default:
      throw new Error()
  }
}

const ThemeProvider = ({ children }) => {
  const [themeData, themeDispatcher] = useReducer(reducer, INITIAL_STATE)

  return (
    <ThemeContext.Provider value={{ theme: themeData.theme, themeDispatcher }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
