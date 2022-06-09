const passwordValidator = (password) => {
  // length
  if (password.length < 4) return false
  if (password.length > 12) return false

  return true
}

export {passwordValidator}