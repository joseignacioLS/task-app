import React from "react"
import { Link } from "react-router-dom"
import { ModalContext } from "../../context/ModalContext.js"
import { ThemeContext } from "../../context/ThemeContext.js"
import { UserDataContext } from "../../context/UserDataContext.js"
import Loading from "../../shared/components/Loading/Loading.jsx"
import PasswordInput from "../../shared/components/PasswordInput/PasswordInput.jsx"
import {
  requestCreateGroup,
  requestGetUserGroups,
  requestGetUserInvitations,
  requestHandleInvitation,
  requestUpdatePassword,
} from "../../shared/utils/api.mjs"
import { passwordValidator } from "../../shared/utils/passwordValidation.mjs"
import "./Profile.scss"

/**
 * Makes a request to retrieve the groups of the user
 * @param {*} userId id of the user
 * @param {*} setUserGroups setter of the userGroups state
 */
const getGroups = async (userId, setUserGroups) => {
  const data = await requestGetUserGroups(userId)
  if (data) {
    setUserGroups(data)
  }
}

/**
 * Makes a request to retrieve the invitations to groups of an user
 * @param {*} userId id of the user
 * @param {*} setUserInvitations setter of the userInvitations state
 */
const getInvitations = async (userId, setUserInvitations) => {
  const data = await requestGetUserInvitations(userId)
  if (data) {
    setUserInvitations(data)
  }
}

/**
 * Generates the view of the list of groups owned by the user
 * @param {*} userGroups array of groups of a user
 * @returns A JSX object with the list of groups
 */
const showOwnedGroups = (userGroups) => {
  return (
    <ul>
      {userGroups.ownedGroups.map(({ _id, name }) => (
        <li key={_id}>
          <Link to={`/group/${_id}`}>{name}</Link>
        </li>
      ))}
    </ul>
  )
}

/**
 * Generates the view of the list of groups the user is member of
 * @param {*} userGroups array of groups of a user
 * @returns A JSX object with the list of groups
 */
const showMemberGroups = (userGroups) => {
  return (
    <ul>
      {userGroups.memberGroups.map(({ _id, name }) => (
        <li key={_id}>
          <Link to={`/group/${_id}`}>{name}</Link>
        </li>
      ))}
    </ul>
  )
}

/**
 * Generates the view of the list of invitations
 * @param {*} userInvitations array of invitations of an user
 * @param {*} handleInvitationAction function to handle the invitation
 * @returns A JSX object with the list of invitations
 */
const showUserInvitations = (userInvitations, handleInvitationAction) => {
  return (
    <ul>
      {userInvitations.map(({ _id, group: { name } }) => (
        <li key={_id}>
          {name}
          <button onClick={handleInvitationAction(_id, "accept")}>
            Accept
          </button>
          <button onClick={handleInvitationAction(_id, "decline")}>
            Decline
          </button>
        </li>
      ))}
    </ul>
  )
}

const Profile = () => {
  // contexts
  const { user } = React.useContext(UserDataContext)
  const { modalDispatcher } = React.useContext(ModalContext)
  const { theme, toggleTheme } = React.useContext(ThemeContext)

  // forms
  const [formDataGroup, setFormDataGroup] = React.useState({ groupName: "" })
  const [formDataPwd, setFormDataPwd] = React.useState({
    oldPassword: "",
    newPassword: "",
  })

  // fetched data
  const [userGroups, setUserGroups] = React.useState({
    ownedGroups: [],
    memberGroups: [],
  })
  const [userInvitations, setUserInvitations] = React.useState([])

  // variables
  const [isLoaded, setIsLoaded] = React.useState(false)

  const handleInputGroup = (e) => {
    const key = e.target.name
    const value = e.target.value

    setFormDataGroup((oldValue) => ({ ...oldValue, [key]: value }))
  }

  const handleSubmitNewGroup = async (e) => {
    e.preventDefault()

    if (formDataGroup.groupName.length < 4) {
      modalDispatcher({
        type: "error",
        payload: {
          message: "Group name too short",
        },
      })
      return
    }

    const response = await requestCreateGroup(user._id, formDataGroup.groupName)
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
      modalDispatcher({
        type: "error",
        payload: {
          message: "Password too short",
        },
      })
      return
    }

    const response = await requestUpdatePassword(
      user._id,
      formDataPwd.oldPassword,
      formDataPwd.newPassword
    )
    if (response) {
      setFormDataPwd({ oldPassword: "", newPassword: "" })
      modalDispatcher({
        type: "message",
        payload: {
          message: "Password updated",
        },
      })
    }
  }

  const handleInvitationAction = (id, action) => {
    return async (e) => {
      e.preventDefault()
      requestHandleInvitation(id, action)
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
      {isLoaded ? (
        <div className="profile-container">
          <h1>{user.username}</h1>
          <section className="groups">
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
          </section>
          <section className="user-settings">
            <h2>Change Theme</h2>
            <p>
              Currently in <button onClick={toggleTheme}>{theme}</button> mode
            </p>
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
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Profile
