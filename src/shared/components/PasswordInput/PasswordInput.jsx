import React from "react"

const PasswordInput = ({ className, name, value, onInput }) => {
  return (
    <input
      maxLength={12}
      type="password"
      value={value}
      name={name}
      onInput={onInput}
      className={className}
      pattern="^[A-Za-z0-9]{4,12}$"
      title="Password should be 4 to 12 and contain only letters and numbers"
    />
  )
}

export default PasswordInput
