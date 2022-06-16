import mongoose from "mongoose"

const Schema = mongoose.Schema

const groupSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    members: { type: [Schema.Types.ObjectId], ref: "User" },
    name: { type: String }
  },
  {
    collection: "groups",
  }
)

const Group = mongoose.model("Group", groupSchema)

export { Group }
