/**
 * Tries to retrieve the stored user in the localstorage and returns it
 * @returns An object with the stored user if defined, else undefined
 */
const retrieveUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem("user")
  return JSON.parse(storedUser) ?? undefined
}

/**
 * Removes stored data of user in localstorage
 */
const clearUserFromLocalStorage = () => {
  localStorage.removeItem("user")
}

/**
 * stores user data in localstorage
 * @param {*} userData date of the user
 */
const setUserLocalStorage = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData))
}

export {
  retrieveUserFromLocalStorage,
  clearUserFromLocalStorage,
  setUserLocalStorage,
}
