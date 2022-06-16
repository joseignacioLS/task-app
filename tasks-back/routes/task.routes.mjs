import express from "express"
import { Task } from "../models/task.model.mjs"
import { User } from "../models/user.model.mjs"
import { Group } from "../models/group.model.mjs"

const router = express.Router()

router.get("/:id", async (req, res, next) => {
  const { id } = req.params
  try {
    const task = await Task.findById(id)
      .populate("user")
      .populate({
        path: "log",
        populate: "user",
      })
      .populate("group")
    res.status(200).json({
      status: 200,
      data: task,
    })
    //get task
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get("/userTasks/:userId", async (req, res, next) => {
  const { userId } = req.params
  let { deadline} = req.query
  try {
    if (!deadline) deadline = /.*/
    const ownedGroups = await Group.find({ user: userId })
    const ownedGroupsIds = ownedGroups.map((g) => g._id)
    const memberGroups = await Group.find({ member: userId })
    const memberGroupsIds = memberGroups.map((g) => g._id)
    const groupsIds = [...ownedGroupsIds, ...memberGroupsIds]
    const tasksPv = await Task.find(
      { user: userId, deadline },
      { group: 1, user: 1, title: 1, status: 1, deadline: 1 }
    )
    const tasksGroup = await Task.find(
      { group: groupsIds, deadline },
      { group: 1, user: 1, title: 1, status: 1, deadline: 1 }
    )
    res.status(200).json({
      status: 200,
      data: [...tasksPv, ...tasksGroup],
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post("/", async (req, res, next) => {
  const { userId, groupId, title, description, deadline } = req.body
  try {
    // get private tasks
    const task = await new Task({
      user: groupId !== "" ? null : userId,
      group: groupId !== "" ? groupId : null,
      title: title,
      status: "pending",
      description: description,
      log: [
        {
          user: userId,
          message: "Task created",
        },
      ],
      deadline: deadline,
    })

    const savedTask = await task.save()

    res.status(200).json({
      status: 200,
      data: savedTask,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

router.patch("/:taskId", async (req, res, next) => {
  const { taskId } = req.params
  try {
    const modTask = await Task.findByIdAndUpdate(taskId, {
      $set: req.body,
    })
    res.status(200).json({
      status: 200,
      data: modTask,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

router.patch("/addlog/:taskId", async (req, res, next) => {
  const { taskId } = req.params
  const { message, userId } = req.body
  try {
    const msg = {
      user: userId,
      message: message,
    }
    const modTask = await Task.findByIdAndUpdate(taskId, {
      $push: { log: { $each: [msg], $position: 0 } },
    })
    res.status(200).json({
      status: 200,
      data: modTask,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

router.patch("/removelog/:taskId", async (req, res, next) => {
  const { taskId } = req.params
  const { index } = req.body
  try {
    const task = await Task.findById(taskId)

    let log = [...task.log]

    log.splice(index, 1)

    const modTask = await Task.findByIdAndUpdate(taskId, {
      $set: { log },
    })
    res.status(200).json({
      status: 200,
      data: modTask,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

router.delete("/:taskId", async (req, res, next) => {
  const { taskId } = req.params
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId)
    res.status(200).json({
      status: 200,
      data: deletedTask,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})
export { router }
