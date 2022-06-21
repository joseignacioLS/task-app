import express from "express"
import cors from "cors"
import "dotenv/config"

import { connect } from "./db/db.mjs"

import { router as userRouter } from "./routes/user.routes.mjs"
import { router as taskRouter } from "./routes/task.routes.mjs"
import { router as groupRouter } from "./routes/group.routes.mjs"
import { router as invitationRouter } from "./routes/invitation.routes.mjs"

const server = express()
const router = express.Router()

server.use(cors())

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.set("secretKey", "theMostUnbreakableSecretKeyEverCreated4")

router.get("/", async (req, res, next) => {
  try {
    res.status(200).send("server up")
  } catch (err) {
    res.status(500).json(err)
  }
})

server.use("/", router)
server.use("/user", userRouter)
server.use("/task", taskRouter)
server.use("/group", groupRouter)
server.use("/invitation", invitationRouter)

const PORT = process.env.PORT

server.listen(PORT, () => {
  console.log(`server up at http://localhost:${PORT}`)
})
