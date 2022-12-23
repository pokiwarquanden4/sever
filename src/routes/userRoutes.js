import express from "express";
import {
  createUser,
  getUserByName,
  getActiveUser,
  getRecommendUser,
  uploadTempVideo,
  deleteUploadTempVideo,
  getOneUserByName,
  logoutUser,
  followUser,
  editUser,
  unFollowUser,
} from "../controllers/userControllers/userControllers.js";
import {
  uploadVideo,
  deleteUploadVideo,
  getVideosByNickName,
  updateVideoComment,
  getVideo,
  likeVideo,
  unLikeVideo,
  likeCommentVideo,
  unLikeCommentVideo,
} from "../controllers/videoControllers/videoControllers.js";
import uploadImageMid from "../middleware/upload/uploadImage.js";
import uploadTempVideoMid from "../middleware/upload/uploadTempVideo.js";
import {
  createMessage,
  getMessage,
  seenMessage,
  updateMessage,
} from "../controllers/messageControllers/messageControllers.js";

const userRoutes = express.Router();

userRoutes.post("/createUser", uploadImageMid.single("avatar"), createUser);

userRoutes.get("/getUserByName", getUserByName);

userRoutes.get("/getOneUserByName", getOneUserByName);

userRoutes.get("/activeAccount", getActiveUser);

userRoutes.get("/recommendUser", getRecommendUser);

userRoutes.post("/uploadVideo", uploadVideo);

userRoutes.put("/deleteUploadVideo", deleteUploadVideo);

userRoutes.get("/getVideosByNickName", getVideosByNickName);

userRoutes.post("/getVideo", getVideo);

userRoutes.post("/updateVideoComment", updateVideoComment);

userRoutes.put("/logoutUser", logoutUser);

userRoutes.post("/createMessage", createMessage);

userRoutes.get("/getMessage", getMessage);

userRoutes.post("/updateMessage", updateMessage);

userRoutes.put("/followUser", followUser);

userRoutes.put("/unFollowUser", unFollowUser);

userRoutes.put("/likeVideo", likeVideo);

userRoutes.put("/unLikeVideo", unLikeVideo);

userRoutes.put("/likeCommentVideo", likeCommentVideo);

userRoutes.put("/unLikeCommentVideo", unLikeCommentVideo);

userRoutes.put("/editUser", uploadImageMid.single("avatar"), editUser);

userRoutes.put(
  "/uploadTempVideo",
  uploadTempVideoMid.single("video"),
  uploadTempVideo
);

userRoutes.put("/seenMessage", seenMessage);

userRoutes.put("/deleteUploadTempVideo", deleteUploadTempVideo);

export default userRoutes;
