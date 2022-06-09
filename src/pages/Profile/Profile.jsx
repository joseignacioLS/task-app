import React from "react"
import { Link } from "react-router-dom"
import { ModalContext } from "../../context/ModalContext.js"
import { UserDataContext } from "../../context/UserDataContext.js"
import Loading from "../../shared/components/Loading/Loading.jsx"
import PasswordInput from "../../shared/components/PasswordInput/PasswordInput.jsx"
import {
  createGroup,
  getUserGroups,
  getUserInvitations,
  handleInvitation,
  updatePassword,
} from "../../shared/utils/api.mjs"
import { passwordValidator } from "../../shared/utils/passwordValidation.mjs"
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

const showOwnedGroups = (userGroups) => {
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

const showMemberGroups = (userGroups) => {
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

const showUserInvitations = (userInvitations, handleInvitationAction) => {
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

const Profile = () => {
  const { user } = React.useContext(UserDataContext)
  const [formDataGroup, setFormDataGroup] = React.useState({ groupName: "" })
  const [formDataPwd, setFormDataPwd] = React.useState({
    oldPassword: "",
    newPassword: "",
  })
  const [userGroups, setUserGroups] = React.useState({
    ownedGroups: [],
    memberGroups: [],
  })
  const [userInvitations, setUserInvitations] = React.useState([])
  const [isLoaded, setIsLoaded] = React.useState(false)
  const { updateModalData } = React.useContext(ModalContext)

  const handleInputGroup = (e) => {
    const key = e.target.name
    const value = e.target.value

    setFormDataGroup((oldValue) => ({ ...oldValue, [key]: value }))
  }

  const handleSubmitNewGroup = async (e) => {
    e.preventDefault()

    if (formDataGroup.groupName.length < 4) {
      updateModalData("Group name too short")
      return
    }

    const response = await createGroup(user._id, formDataGroup.groupName)
    if (response) {
      setFormDataGroup({ groupName: "" })
      getGroups(user._id, setUserGroups)
    }
  }

  const handleInputPassword = (e) => {
    const key = e.target.name
    const value = e.target.value

    setFormDataPwd((oldValue) => ({ ...oldValue, [key]: value }))
  }

  const handleSubmitUpdatePassword = async (e) => {
    e.preventDefault()

    if (!passwordValidator(formDataPwd.newPassword)) {
      updateModalData("Password too short")
      return
    }

    const response = await updatePassword(
      user._id,
      formDataPwd.oldPassword,
      formDataPwd.newPassword
    )
    if (response) {
      setFormDataPwd({ oldPassword: "", newPassword: "" })
      updateModalData("Password updated successfuly")
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
      {!isLoaded && <Loading />}
      {isLoaded && (
        <>
          <div>
            <h1>{user.username}</h1>
            <div className="groups">
              <h2>Groups</h2>
              <h3>Owner</h3>
              {showOwnedGroups(userGroups)}
              <form onSubmit={handleSubmitNewGroup}>
                <input
                  type="text"
                  name="groupName"
                  onInput={handleInputGroup}
                  value={formDataGroup.groupName}
                  placeholder="New Group Name"
                />
                <button type="submit">Create Group</button>
              </form>
              <h3>Member</h3>
              {showMemberGroups(userGroups)}

              <h3>Invitations</h3>
              {showUserInvitations(userInvitations, handleInvitationAction)}
            </div>
          </div>
          <section className="user-settings">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmitUpdatePassword}>
              <label>
                <p>Old password</p>
                <PasswordInput
                  onInput={handleInputPassword}
                  value={formDataPwd.oldPassword}
                  name="oldPassword"
                  className=""
                />
              </label>
              <label>
                <p>New password</p>
                <PasswordInput
                  onInput={handleInputPassword}
                  value={formDataPwd.newPassword}
                  name="newPassword"
                  className=""
                />
              </label>
              <button type="submit">Update Password</button>
            </form>
          </section>
        </>
      )}
    </>
  )
}

export default Profile
