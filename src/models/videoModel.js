import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      require: true,
    },
    comment: {
      type: Object,
      default: [],
    },
    liker: {
      type: Array,
      default: [],
    },
    captions: {
      type: Array,
      default: [],
    },
    mentions: {
      type: Array,
      default: [],
    },
    coverPic: {
      type: String,
      default: "",
    },
    whoView: {
      type: String,
      default: "",
      require: true,
    },
    allowUser: {
      type: Array,
      default: [],
    },
    runACopy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const VideoModel = mongoose.model("Video", schema);
