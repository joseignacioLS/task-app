import React from "react"

export const ThemeContext = React.createContext()

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  )

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
