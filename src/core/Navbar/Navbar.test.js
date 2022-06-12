import { fireEvent, prettyDOM, render, screen } from "@testing-library/react"
import { Router } from "react-router-dom"
import { createMemoryHistory } from "history"
import { UserDataContext } from "../../context/UserDataContext"
import Navbar from "./Navbar"

const testF = jest.fn()

describe("Navbar Logged out", () => {
  let view
  beforeEach(() => {
    const history = createMemoryHistory()
    view = render(
      <UserDataContext.Provider
        value={{ user: undefined, logout: testF }}
      >
        <Router location={history.location} navigator={history}>
          <Navbar />
        </Router>
      </UserDataContext.Provider>
    )
  })

  test("renders appropriately", () => {
    console.log(prettyDOM(view.container))
    console.log(view.user)
    // Arrange
    // Assert
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument()
  })

  test("does not render logout button", () => {
    // Assert
    const logoutButton = screen.queryByText(/logout/i)
    expect(logoutButton).toBeNull()
  })
})

describe("Navbar Logged in", () => {
  let view
  beforeEach(() => {
    const history = createMemoryHistory()
    view = render(
      <UserDataContext.Provider
        value={{ user: { username: "username" }, logout: testF }}
      >
        <Router location={history.location} navigator={history}>
          <Navbar />
        </Router>
      </UserDataContext.Provider>
    )
  })

  test("renders appropriately", () => {
    // Arrange
    // Assert
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument()
  })

  test("renders username", () => {
    // Arrange
    // Assert
    expect(screen.getByText(/username/i)).toBeInTheDocument()
  })


  test("renders logout button", () => {
    // Assert
    expect(screen.getByText(/logout/i)).toBeInTheDocument()
  })

  test("logs out", () => {
    // Arrange
    const button = screen.getByText(/logout/i)
    fireEvent.click(button)
    // Assert
    expect(testF).toHaveBeenCalledTimes(1)
  })
})
