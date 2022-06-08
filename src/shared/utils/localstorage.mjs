/**
 * Funcion para recuperar y almacenar (opcional esto ultimo, gestionado por set) el user del
 * localstorage. Es necesario el set para poder utilizarlo dentro del authroute si quiero
 * usar esta funcion para comprobar si el user esta loggeado al hacer refresh
 *
 * @param {*} setUser setter del hook
 * @param {*} set value del hook
 * @returns devuelve en boolean representando si el user se puede recuperar del localstorage
 */
const retrieveUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem("user")
  if (storedUser) {
    return JSON.parse(storedUser)
  }
  return undefined
}

const clearUserFromLocalStorage = () => {
  localStorage.removeItem("user")
}

const setUserLocalStorage = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData))
}

export {
  retrieveUserFromLocalStorage,
  clearUserFromLocalStorage,
  setUserLocalStorage,
}
