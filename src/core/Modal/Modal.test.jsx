import { fireEvent, render, screen } from "@testing-library/react"
import { ModalContext } from "../../context/ModalContext"
import Modal from "./Modal"

const testF = jest.fn()

describe("Modal", () => {
  let view
  beforeEach(() => {
    view = render(
      <ModalContext.Provider
        value={{
          isVisible: true,
          message: "Message",
          options: [
            {
              title: "Test button",
              f: testF,
            },
          ],
          updateModalData: () => {},
        }}
      >
        <Modal />
      </ModalContext.Provider>
    )
  })

  test("renders appropriately", () => {
    // Arrange
    // Assert
    expect(screen.getByText(/Message/i)).toBeInTheDocument()
  })

  test("renders button", () => {
    // Assert
    expect(screen.getByText(/Test button/i)).toBeInTheDocument()
  })

  test("closes default click", () => {
    // Arrange
    const button = screen.getByText(/Test button/i)
    fireEvent.click(button)
    // Assert
    expect(view.isVisible).toBeFalsy()
  })

  test("executes passed function", () => {
    // Arrange
    const button = screen.getByText(/Test button/i)
    fireEvent.click(button)
    // Assert
    expect(testF).toHaveBeenCalledTimes(1)
  })
})
