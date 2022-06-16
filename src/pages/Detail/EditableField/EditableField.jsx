import React from "react"
import "./EditableField.scss"

const EditableField = ({
  value,
  onUpdateF,
  textClass,
  inputClass,
  maxLength,
  type,
  classMod,
  classModCheck,
  isEditable = false,
}) => {
  const [data, setData] = React.useState(value)
  const [isEdit, setIsEdit] = React.useState(false)

  const handleInput = (e) => {
    setData(e.target.value)
  }
  const handleEditToggle = (e) => {
    if (isEditable) setIsEdit((oldValue) => !oldValue)
  }

  React.useEffect(() => {
    if (!isEdit && value !== data) {
      //validation
      const isValue = data.length > 0
      if (!isValue) {
        setData(value)
        return
      }

      onUpdateF(data)
    }
  }, [isEdit])

  return (
    <>
      {!isEdit && (
        <p
          className={`${textClass} ${
            classModCheck ? textClass + classMod : ""
          }`}
          onClick={handleEditToggle}
        >
          {value === null || !value ? "Not setted" : value}
        </p>
      )}
      {isEdit && type === "textarea" && (
        <textarea
          maxLength={maxLength || 32}
          autoFocus
          value={data}
          type="text"
          className={`${inputClass} ${
            classModCheck ? inputClass + classMod : ""
          }`}
          onBlur={handleEditToggle}
          onInput={handleInput}
        />
      )}
      {isEdit && type === "input" && (
        <input
          maxLength={maxLength || 32}
          autoFocus
          value={data}
          type="text"
          className={`${inputClass} ${
            classModCheck ? inputClass + classMod : ""
          }`}
          onBlur={handleEditToggle}
          onInput={handleInput}
        />
      )}
      {isEdit && type === "date" && (
        <input
          autoFocus
          value={data}
          type="date"
          className={`${inputClass} ${
            classModCheck ? inputClass + classMod : ""
          }`}
          onBlur={handleEditToggle}
          onInput={handleInput}
        />
      )}
    </>
  )
}

export default EditableField
