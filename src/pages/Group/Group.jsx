import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ModalContext } from "../../context/ModalContext.js"
import { UserDataContext } from "../../context/UserDataContext.js"
import Loading from "../../shared/components/Loading/Loading.jsx"
import {
  requestDeleteGroup,
  requestGetGroup,
  requestSendInvitation,
} from "../../shared/utils/api.mjs"

const getGroupData = async (id, setGroupData, setIsLoaded) => {
  const data = await requestGetGroup(id)
  if (data) {
    setGroupData(data)
    setIsLoaded(true)
  }
}

const showGroupMembers = (members) => {
  return (
    <ul>
      {members.map((member) => (
        <li key={JSON.stringify(member)}>{member.username}</li>
      ))}
    </ul>
  )
}

const Group = () => {
  // contexts
  const { user } = React.useContext(UserDataContext)
  const { updateModalData } = React.useContext(ModalContext)

  //forms
  const [formData, setFormData] = React.useState({ newUser: "" })

  // fetched data
  const [groupData, setGroupData] = React.useState({})

  //variables
  const { id } = useParams()
  const [isLoaded, setIsLoaded] = React.useState(false)

  // others
  const navigate = useNavigate()

  const handleDeleteGroup = (e) => {
    e.preventDefault()
    updateModalData("Delete Group?", true, [
      {
        title: "Yes",
        f: async () => {
          const response = await requestDeleteGroup(id)
          if (response) {
            updateModalData("Group deleted", true, [
              {
                title: "ok",
                f: () => {
                  navigate("/profile")
                },
              },
            ])
          }
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
    const response = await requestSendInvitation(formData.newUser, id)
    if (response) {
      setFormData({ newUser: "" })
    } else {
      updateModalData(`Error sending the invitation to '${formData.newUser}'`)
    }
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
      {!isLoaded && <Loading />}
      {isLoaded && (
        <div>
          <h1>{groupData.name}</h1>
          <h2>Owner</h2>
          <p>{groupData.user.username}</p>
          <h2>Members</h2>
          {showGroupMembers(groupData.members)}
          {user._id === groupData.user._id && (
            <form onSubmit={handleInvite}>
              <label>
                <p>Invite</p>
                <input
                  type="text"
                  name="newUser"
                  onInput={handleInput}
                  value={formData.newUser}
                />
              </label>
              <button type="submit">Send Invitation</button>
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
