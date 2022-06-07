//const BACKURL = "https://peaceful-woodland-96091.herokuapp.com"
const BACKURL = "http://localhost:4000"

const login = async (username, password) => {
  const res = await fetch(`${BACKURL}/user/login`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json()

  if (data.status !== 200) return false

  return data.data
}

const register = async (username, password) => {
  const res = await fetch(`${BACKURL}/user/register`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json()

  if (data.status !== 200) return false

  return data.data
}

const updateTask = async (taskId, newData) => {
  const res = await fetch(`${BACKURL}/task/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(newData),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json()

  if (data.status !== 200) return false

  return data.data
}

const addMessageToLog = async (taskId, userId, message) => {
  const res = await fetch(`${BACKURL}/task/addlog/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ userId, message }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json()

  if (data.status !== 200) return false

  return data.data
}

const removeMessageFromLog = async (taskId, index) => {
  const res = await fetch(`${BACKURL}/task/removelog/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ index }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json()

  if (data.status !== 200) return false

  return data.data
}
const getUserTasks = async (userId) => {
  const res = await fetch(`${BACKURL}/task/userTasks/${userId}`)
  const data = await res.json()

  if (data.status !== 200) return false

  return data.data
}

const createTask = async (userId, groupId, title, description, deadline) => {
  const res = await fetch(`${BACKURL}/task/`, {
    method: "POST",
    body: JSON.stringify({
      userId,
      groupId,
      title,
      description,
      deadline,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  const data = await res.json()

  return data.status === 200
}

const deleteTask = async (taskId) => {
  const res = await fetch(`${BACKURL}/task/${taskId}`, {
    method: "DELETE",
  })

  const data = await res.json()

  return data.status === 200
}
const getTask = async (taskId) => {
  const res = await fetch(`${BACKURL}/task/${taskId}`)
  const data = await res.json()

  if (data.status !== 200) return false

  return data.data
}

const createGroup = async (userId, name) => {
  const res = await fetch(`${BACKURL}/group`, {
    method: "POST",
    body: JSON.stringify({
      userId,
      name,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  const data = await res.json()

  return data.status === 200
}

const getGroup = async (id) => {
  const res = await fetch(`${BACKURL}/group/${id}`)
  const data = await res.json()

  if (data.status !== 200) return false
  return data.data
}

const getUserGroups = async (userId) => {
  const res = await fetch(`${BACKURL}/group/userGroups/${userId}`)

  const data = await res.json()

  if (data.status !== 200) return false

  return data.data
}

const deleteGroup = async (groupId) => {
  const res = await fetch(`${BACKURL}/group/${groupId}`, {
    method: "DELETE",
  })

  // find all tasks and deletethem
  const data = await res.json()

  return data.status === 200
}

const getUserInvitations = async (id) => {
  const res = await fetch(`${BACKURL}/invitation/userInvitations/${id}`)
  const data = await res.json()
  if (data.status !== 200) return false
  return data.data
}

const sendInvitation = async (username, groupId) => {
  const res = await fetch(`${BACKURL}/invitation`, {
    method: "POST",
    body: JSON.stringify({
      username,
      groupId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await res.json()

  return data.status === 200
}

const handleInvitation = async (invitationId, action) => {
  const res = await fetch(`${BACKURL}/invitation/${invitationId}/${action}`, {
    method: "DELETE",
  })
}

export {
  login,
  register,
  updateTask,
  getUserTasks,
  createTask,
  getTask,
  addMessageToLog,
  removeMessageFromLog,
  deleteTask,
  getGroup,
  createGroup,
  getUserGroups,
  deleteGroup,
  sendInvitation,
  handleInvitation,
  getUserInvitations,
}