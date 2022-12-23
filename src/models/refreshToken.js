import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const RefreshTokenModel = mongoose.model("refreshToken", schema);
