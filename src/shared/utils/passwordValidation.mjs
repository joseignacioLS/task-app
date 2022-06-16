/**
 * Tests whether a password passes all the validations
 * @param {*} password string, password to test
 * @returns boolean
 */
const passwordValidator = (password) => {
  // length
  if (password.length < 4) return false
  if (password.length > 12) return false

  return true
}

export { passwordValidator }
