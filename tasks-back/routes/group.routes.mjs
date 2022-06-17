import express from "express"
import { Group } from "../models/group.model.mjs"
import { Task } from "../models/task.model.mjs"

const router = express.Router()

router.get("/:id", async (req, res, next) => {
  const { id } = req.params
  try {
    const group = await Group.findById(id).populate("members").populate("user")
    res.status(200).json({
      status: 200,
      data: group,
    })
    //get task
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get("/userGroups/:userId", async (req, res, next) => {
  const { userId } = req.params
  try {
    // owner
    const ownedGroups = await Group.find({ user: userId })

    // member

    const memberGroups = await Group.find({ members: userId })
    res.status(200).json({
      status: 200,
      data: {
        ownedGroups,
        memberGroups,
      },
    })
    //get task
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post("/", async (req, res, next) => {
  const { userId, name } = req.body
  try {
    // get private tasks
    const group = await new Group({
      user: userId,
      name,
      members: [],
    })

    const savedGroup = await group.save()

    res.status(200).json({
      status: 200,
      data: savedGroup,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})
router.delete("/:groupId", async (req, res, next) => {
  const { groupId } = req.params
  try {
    const deletedGroup = await Group.findByIdAndDelete(groupId)

    // delete tasks

    const tasks = await Task.find({ group: deletedGroup._id })
    tasks.forEach(async (t) => await Task.findByIdAndDelete(t._id))
    res.status(200).json({
      status: 200,
      data: deletedGroup,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

router.put("/:groupId", async (req, res, next) => {
  const { groupId } = req.params
  const { userId } = req.body
  try {
    const modGroup = await Group.findByIdAndUpdate(groupId, {
      $pull: { members: userId },
    })

    if (!modGroup)
      return res.status(404).json({
        status: 404,
      })
    res.status(200).json({
      status: 200,
      data: modGroup,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

export { router }
