import mongoose from "mongoose"

const Schema = mongoose.Schema

const taskSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    status: { type: String },
    title: { type: String },
    description: { type: String },
    log: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        message: { type: String },
      },
    ],
    deadline: {type: String}
  },
  {
    collection: "tasks",
  }
)

const Task = mongoose.model("Task", taskSchema)

export { Task }
