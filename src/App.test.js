import { prettyDOM, render, screen } from "@testing-library/react"
import App from "./App"
import { createMemoryHistory } from "history"
import { Router } from "react-router-dom"
import { ModalContext } from "./context/ModalContext"

const testF = jest.fn()

describe("App", () => {
  let view
  beforeEach(() => {
    const history = createMemoryHistory()
    view = render(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    )
  })

  test("renders appropriately", () => {
    // Arrange
    // Assert
    const ele = view.container.querySelector(".pageContainer")
    expect(ele).not.toBeUndefined()
  })
})
