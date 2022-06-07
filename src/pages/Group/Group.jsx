import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ModalContext } from "../../core/Modal/ModalContext.js"
import {
  deleteGroup,
  getGroup,
  sendInvitation,
} from "../../shared/utils/api.mjs"

const getGroupData = async (id, setGroupData, setIsLoaded) => {
  const data = await getGroup(id)
  if (data) {
    setGroupData(data)
    setIsLoaded(true)
  }
}

const Group = ({ user }) => {
  const { id } = useParams()
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [groupData, setGroupData] = React.useState({})
  const updateModalData = React.useContext(ModalContext)
  const navigate = useNavigate()

  const [formData, setFormData] = React.useState({ newUser: "" })

  const handleDeleteGroup = (e) => {
    e.preventDefault()
    updateModalData("Delete Group?", true, [
      {
        title: "Yes",
        f: async () => {
          const response = await deleteGroup(id)
          navigate("/profile")
        },
      },
      {
        title: "No",
        f: () => {},
      },
    ])
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    const response = await sendInvitation(formData.newUser, id)
    setFormData({ newUser: "" })
  }

  const handleInput = (e) => {
    e.preventDefault()
    const key = e.target.name
    const value = e.target.value
    setFormData((oldValue) => ({ ...oldValue, [key]: value }))
  }

  React.useEffect(() => {
    // get group
    getGroupData(id, setGroupData, setIsLoaded)
  }, [id])

  return (
    <>
      {isLoaded && (
        <div>
          <h1>{groupData.name}</h1>
          <h2>Owner</h2>
          <p>{groupData.user.username}</p>
          <h2>Members</h2>
          <ul>
            {groupData.members.map((member) => (
              <li key={JSON.stringify(member)}>{member.username}</li>
            ))}
          </ul>
          {user._id === groupData.user._id && (
            <form>
              <label>
                <p>Invite</p>
                <input
                  type="text"
                  name="newUser"
                  onInput={handleInput}
                  value={formData.newUser}
                />
              </label>
              <button onClick={handleInvite}>Send Invitation</button>
            </form>
          )}
          {user._id === groupData.user._id && (
            <button onClick={handleDeleteGroup}>X</button>
          )}
        </div>
      )}
    </>
  )
}

export default Group
