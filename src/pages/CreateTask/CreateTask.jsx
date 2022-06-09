import React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ModalContext } from "../../context/ModalContext.js"
import { UserDataContext } from "../../context/UserDataContext.js"
import { createTask, getUserGroups } from "../../shared/utils/api.mjs"
import "./CreateTask.scss"

const getGroups = async (userId, setUserGroups) => {
  const data = await getUserGroups(userId)
  if (data) {
    const owned = data.ownedGroups.map((g) => ({ _id: g._id, name: g.name }))
    const member = data.memberGroups.map((g) => ({ _id: g._id, name: g.name }))
    setUserGroups([{ _id: "", name: "Private" }, ...owned, ...member])
  }
}

const CreateTask = () => {
  const { user } = React.useContext(UserDataContext)
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    deadline: "",
    group: "",
  })

  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()
  const { updateModalData } = React.useContext(ModalContext)
  const [userGroups, setUserGroups] = React.useState([
    { _id: "", name: "Private" },
  ])
  const [selectedGroup, setSelectedGroup] = React.useState("")

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
      formData.deadline
    )
    if (!response) {
      updateModalData("Task could not be created", true, [
        { title: "Ok", f: () => {} },
      ])
      return
    }

    navigate(`/?list=${selectedGroup}`)
  }

  React.useEffect(() => {
    if (userGroups.length <= 1) {
      return
    }

    const list = searchParams.get("list") ?? "Private"
    const group = userGroups.find((g) => g.name === list)

    if (!group) return navigate("/")

    setSelectedGroup(group ? group.name : "Private")
    setFormData((oldValue) => {
      return { ...oldValue, group: group ? group._id : "" }
    })
  }, [userGroups])

  React.useEffect(() => {
    if (user) {
      getGroups(user._id, setUserGroups)
    }
  }, [user])

  return (
    <>
      <h2>Adding task to {selectedGroup}</h2>
      <form className="new-task-form" onSubmit={handleSubmit}>
        <label>
          <p>title</p>
          <input onInput={handleInput} type="text" name="title" />
        </label>
        <label>
          <p>description</p>
          <textarea onInput={handleInput} type="text" name="description" />
        </label>
        <label>
          <p>Deadline</p>
          <input onInput={handleInput} type="date" name="deadline" />
        </label>
        <button type="submit">Create</button>
      </form>
    </>
  )
}

export default CreateTask
