import React from "react"
import { useNavigate } from "react-router-dom"
import { ModalContext } from "../../core/Modal/ModalContext.js"
import { createTask, getUserGroups } from "../../shared/utils/api.mjs"
import "./CreateTask.scss"


const getGroups = async (userId, setUserGroups) => {
  const data = await getUserGroups(userId)
  if (data) {
    const owned = data.ownedGroups.map((g) => ({ _id: g._id, name: g.name }))
    const member = data.memberGroups.map((g) => ({ _id: g._id, name: g.name }))
    console.log(owned, member)
    setUserGroups([{ _id: null, name: "private" }, ...owned, ...member])
  }
}
const CreateTask = ({ user }) => {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    deadline: "",
    group: "",
  })

  const navigate = useNavigate()
  const updateModalData = React.useContext(ModalContext)
  const [userLists, setUserLists] = React.useState([])
  const [userGroups, setUserGroups] = React.useState([
    { _id: null, name: "private" },
  ])

  const handleInput = (e) => {
    const key = e.target.name
    const value = e.target.value

    setFormData((oldData) => {
      return { ...oldData, [key]: value }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.deadline) {
      updateModalData("Please, fill all fields", true, [
        { title: "Ok", f: () => {} },
      ])
      return
    }
    const response = await createTask(
      user._id,
      formData.group,
      formData.title,
      formData.description,
      formData.deadline,
    )
    if (!response) {
      updateModalData("Task could not be created", true, [
        { title: "Ok", f: () => {} },
      ])
      return
    }

    navigate("/")
  }

  React.useEffect(() => {
    if (user) {
      getGroups(user._id, setUserGroups)
    }
  }, [user])

  return (
    <form className="new-task-form">
      <label>
        <p>title</p>
        <input onInput={handleInput} type="text" name="title" />
      </label>
      <label>
        <p>description</p>
        <input onInput={handleInput} type="text" name="description" />
      </label>
      <label>
        <p>Deadline</p>
        <input onInput={handleInput} type="date" name="deadline" />
      </label>
      <label>
        <p>Group</p>
        <select name="group" onInput={handleInput}>
          {userGroups.map((list) => {
            return (
              <option key={JSON.stringify(list)} value={list._id}>
                {list.name}
              </option>
            )
          })}
        </select>
      </label>
      <button onClick={handleSubmit}>Create</button>
    </form>
  )
}

export default CreateTask
