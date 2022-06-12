import { fireEvent, getByLabelText, prettyDOM, queryByLabelText, render, screen } from "@testing-library/react"
import { Router } from "react-router-dom"
import { createMemoryHistory } from "history"
import { UserDataContext } from "../../context/UserDataContext"
import Footer from "./Footer"

const testF = jest.fn()

describe("Footer", () => {
  let view
  beforeEach(() => {
    const history = createMemoryHistory()
    view = render(
      <UserDataContext.Provider value={{ user: undefined, logout: testF }}>
        <Router location={history.location} navigator={history}>
          <Footer />
        </Router>
      </UserDataContext.Provider>
    )
  })

  test("renders appropriately", () => {
    expect(screen.getByText(/About/i)).toBeInTheDocument()
  })
})
