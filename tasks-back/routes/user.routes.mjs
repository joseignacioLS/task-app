import express from "express"
import { User } from "../models/user.model.mjs"
import jwt from "jsonwebtoken"

const router = express.Router()

router.get("/", async (req, res, next) => {
  try {
    //get all users and send them back, only name and id
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body
  try {
    const prevUser = await User.findOne(
      { username, password },
      { _id: 1, username: 1 }
    )
    if (prevUser) {
      // generate token
      const token = jwt.sign(
        {
          id: prevUser._id,
          username: prevUser.username,
        },
        req.app.get("secretKey")
      )

      return res.status(200).json({
        status: 200,
        message: "Login Successful",
        data: {
          _id: prevUser._id,
          username: prevUser.username,
          token,
        },
      })
    }

    res.status(400).json({
      status: 400,
      message: "Login Error",
    })
    // login
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body
  try {
    const prevUser = await User.findOne({ username })

    if (prevUser) {
      return res.status(400).json({
        status: 400,
        message: "Register Error",
      })
    }

    const user = await new User({
      username,
      password,
    })

    const savedUser = await user.save()

    //generate token

    const token = jwt.sign(
      {
        id: savedUser._id,
        username: savedUser.username,
      },
      req.app.get("secretKey")
    )

    res.status(200).json({
      status: 200,
      message: "Register Successful",
      data: {
        _id: savedUser._id,
        username: savedUser.username,
        token,
      },
    })
    // register
  } catch (err) {
    res.status(500).json(err)
  }
})

router.put("/updatePassword", async (req, res, next) => {
  const { userId, oldPassword, newPassword } = req.body
  try {
    const prevUser = await User.findById(userId)
    if (!prevUser) {
      return res.status(400).json({
        status: 400,
        message: "user not found",
      })
    }

    if (prevUser.password !== oldPassword) {
      return res.status(400).json({
        status: 400,
        message: "wrong old password",
      })
    }
    const modUser = await User.findByIdAndUpdate(userId, {
      password: newPassword,
    })

    res.status(200).json({
      status: 200,
      message: "Password Updated",
      data: modUser,
    })
    // register
  } catch (err) {
    res.status(500).json(err)
  }
})

export { router }
