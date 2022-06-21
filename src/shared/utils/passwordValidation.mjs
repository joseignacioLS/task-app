/**
 * Tests whether a password passes all the validations
 * min length 4
 * max length 12
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
