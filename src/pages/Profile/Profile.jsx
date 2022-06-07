import React from "react"
import { Link } from "react-router-dom"
import {
  createGroup,
  getUserGroups,
  getUserInvitations,
  handleInvitation,
} from "../../shared/utils/api.mjs"

const getGroups = async (userId, setUserGroups) => {
  const data = await getUserGroups(userId)
  if (data) {
    setUserGroups(data)
  }
}

const getInvitations = async (userId, setUserInvitations) => {
  const data = await getUserInvitations(userId)
  if (data) {
    setUserInvitations(data)
  }
}

const Profile = ({ user }) => {
  const [formData, setFormData] = React.useState({ groupName: "" })
  const [userGroups, setUserGroups] = React.useState({
    ownedGroups: [],
    memberGroups: [],
  })
  const [userInvitations, setUserInvitations] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(false)


  const handleInput = (e) => {
    const key = e.target.name
    const value = e.target.value

    setFormData((oldValue) => ({ ...oldValue, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await createGroup(user._id, formData.groupName)
    if (response) {
      console.log("cool")
      setFormData({ groupName: "" })
      getGroups(user._id, setUserGroups)
    }
  }

  const handleInvitationAction = (id, action) => {
    return async (e) => {
      e.preventDefault()
      handleInvitation(id, action)
      getGroups(user._id, setUserGroups)
      getInvitations(user._id, setUserInvitations)
    }
  }

  React.useEffect(() => {
    if (user) {
      getGroups(user._id, setUserGroups)
      getInvitations(user._id, setUserInvitations)
      setIsLoaded(true)
    }
  }, [user])
  return (
    <>
      {isLoaded && (
        <div>
          <h1>{user.username}</h1>
          <h2>Tasks</h2>
          <p>Pending tasks:</p>
          <p>Completed tasks:</p>
          <h2>Groups</h2>
          <h3>Owner</h3>
          <ul>
            {userGroups.ownedGroups.map((group) => (
              <li key={JSON.stringify(group)}>
                <Link to={`/group/${group._id}`}>{group.name}</Link>
              </li>
            ))}
          </ul>
          <form>
            <input
              type="text"
              name="groupName"
              onInput={handleInput}
              value={formData.groupName}
            />
            <button onClick={handleSubmit}>Create</button>
          </form>
          <h3>Member</h3>
          <ul>
            {userGroups.memberGroups.map((group) => (
              <li key={JSON.stringify(group)}>
                <Link to={`/group/${group._id}`}>{group.name}</Link>
              </li>
            ))}
          </ul>
          <h3>Invitations</h3>
          <ul>
            {userInvitations.map((i) => (
              <li key={JSON.stringify(i)}>
                {i.group.name}
                <button onClick={handleInvitationAction(i._id, "accept")}>
                  Accept
                </button>
                <button onClick={handleInvitationAction(i._id, "decline")}>
                  Decline
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default Profile
