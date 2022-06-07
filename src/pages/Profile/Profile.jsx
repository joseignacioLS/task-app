import React from "react"
import { Link } from "react-router-dom"
import { UserDataContext } from "../../context/UserDataContext.js"
import {
  createGroup,
  getUserGroups,
  getUserInvitations,
  handleInvitation,
} from "../../shared/utils/api.mjs"
import "./Profile.scss"

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

const Profile = () => {
  const { user } = React.useContext(UserDataContext)
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

  const showOwnedGroups = () => {
    return (
      <ul>
        {userGroups.ownedGroups.map((group) => (
          <li key={JSON.stringify(group)}>
            <Link to={`/group/${group._id}`}>{group.name}</Link>
          </li>
        ))}
      </ul>
    )
  }

  const showMemberGroups = () => {
    return (
      <ul>
        {userGroups.memberGroups.map((group) => (
          <li key={JSON.stringify(group)}>
            <Link to={`/group/${group._id}`}>{group.name}</Link>
          </li>
        ))}
      </ul>
    )
  }

  const showUserInvitations = () => {
    return (
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
    )
  }

  return (
    <>
      {isLoaded && (
        <div>
          <h1>{user.username}</h1>
          <div className="groups">
            <h2>Groups</h2>
            <h3>Owner</h3>
            {showOwnedGroups()}
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
            {showMemberGroups()}

            <h3>Invitations</h3>
            {showUserInvitations()}
          </div>
        </div>
      )}
    </>
  )
}

export default Profile
