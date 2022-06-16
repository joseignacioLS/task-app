import express from "express"
import { Group } from "../models/group.model.mjs"
import { Invitation } from "../models/invitation.model.mjs"
import { Task } from "../models/task.model.mjs"
import { User } from "../models/user.model.mjs"

const router = express.Router()

router.get("/:id", async (req, res, next) => {
  const { id } = req.params
  try {
    const group = await Group.findById(id)
    res.status(200).json({
      status: 200,
      data: group,
    })
    //get task
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get("/userInvitations/:userId", async (req, res, next) => {
  const { userId } = req.params
  try {
    const invitations = await Invitation.find({ user: userId }).populate("group")
    res.status(200).json({
      status: 200,
      data: invitations,
    })
    //get task
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post("/", async (req, res, next) => {
  const { username, groupId } = req.body
  try {
    const user = await User.findOne({username})
    if (!user) {
      return res.status(400).json({
        message:"user does not exist",
        status:400
      })
    }
    // get private tasks
    const invitation = await new Invitation({
      user: user._id,
      group: groupId,
    })

    const savedInvitation = await invitation.save()

    res.status(200).json({
      status: 200,
      data: savedInvitation,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})
router.delete("/:invitationId/:action", async (req, res, next) => {
  const { invitationId, action } = req.params
  try {
    const deletedInvitation = await Invitation.findByIdAndDelete(invitationId)
    if (action === "accept") {
      const modGroup = await Group.findByIdAndUpdate(deletedInvitation.group, {
        $push: { members: deletedInvitation.user },
      })
    }
    res.status(200).json({
      status: 200,
      data: deletedInvitation,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

export { router }
