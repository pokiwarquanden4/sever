import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    full_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
      default: false,
    },

    dateOfBirth: {
      type: Date,
      require: true,
    },
    tick: {
      type: Boolean,
      default: false,
    },
    follower: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    message: {
      type: Array,
      default: [],
    },
    text: {
      type: String,
      default: "You need to add some text",
    },
    description: {
      type: String,
      default: "",
    },
    uploadTempVideo: {
      type: Object,
      default: {
        video: null,
      },
    },
    video: {
      type: Array,
      default: [],
    },
    likeVideo: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", schema);
