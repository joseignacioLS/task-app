import mongoose from "mongoose"

const Schema = mongoose.Schema

const invitationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
  },
  {
    collection: "invitations",
  }
)

const Invitation = mongoose.model("Invitation", invitationSchema)

export { Invitation }
