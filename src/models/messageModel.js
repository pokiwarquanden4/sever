import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    boxChat: {
      type: String,
      default: "Single",
    },
    members: {
      type: Array,
      default: [],
    },
    comment: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model("Message", schema);
