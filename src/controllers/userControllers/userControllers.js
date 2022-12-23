import { UserModel } from "../../models/userModel.js";
import { VideoModel } from "../../models/videoModel.js";
import fs from "fs";
import fse from "fs-extra";
import {
  createJWT,
  createRefreshToken,
} from "../authControllers/authControllers.js";
import bcrypt from "bcrypt";
import { RefreshTokenModel } from "../../models/refreshToken.js";

//Lấy danh sách người dùng bằng tên
export const getUserByName = async (req, res) => {
  const keyword = req.query.keyword;

  try {
    const users = await UserModel.find({
      full_name: new RegExp(keyword, "i"),
    });
    //Trả về client status
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Tạo người dùng
export const createUser = async (req, res) => {
  try {
    //Hash PassWord
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    //Lấy dữ liệu từ phía client
    const newUser = req.body;
    newUser.avatar = req.file.filename;
    newUser.password = hashed;

    //Check duplication
    const userDuplication = await UserModel.findOne({
      nickName: newUser.nickName,
    });

    if (userDuplication) {
      return res.status(200).json("The Account Exit");
    }

    //Tạo mới và lưu người dùng vào DTB
    const user = new UserModel(newUser);
    await user.save();

    return res.status(200).json("Create Success");
  } catch (err) {
    res.status(500).json(err);
  }
};

//Sửa người dùng
export const editUser = async (req, res) => {
  const editUser = req.body;

  try {
    if (req.file) {
      const nickName = editUser.nickName;
      const avatarName = editUser.avatarName;
      const filePath = `src/uploads/avatar/${nickName}/${avatarName}`;
      fs.unlinkSync(filePath);

      await UserModel.updateOne(
        {
          nickName: nickName,
        },
        {
          nickName: editUser.nickName,
          avatar: req.file.filename,
          full_name: editUser.full_name,
          description: editUser.description,
        }
      );
    } else {
      await UserModel.updateOne(
        {
          nickName: editUser.nickName,
        },
        {
          nickName: editUser.nickName,
          full_name: editUser.full_name,
          description: editUser.description,
        }
      );
    }

    const updatedUser = await UserModel.findOne({
      nickName: editUser.nickName,
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Login User
export const getActiveUser = async (req, res) => {
  try {
    const info = req.query;
    const user = await UserModel.findOne({
      nickName: info.nickName,
    });

    if (!user) {
      return res.status(404).json("Wrong User Name");
    }

    const validPass = await bcrypt.compare(info.password, user.password);

    if (!validPass) {
      return res.status(404).json("Wrong PassWord");
    }

    if (user && validPass) {
      const jwt = createJWT({
        nickName: user.nickName,
      });
      const refreshJWT = createRefreshToken({
        nickName: user.nickName,
      });

      await UserModel.updateOne(
        {
          nickName: info.nickName,
        },
        { active: true }
      );
      return res.status(200).json({ user, jwt, refreshJWT });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const nickName = req.body.nickName;
    await UserModel.updateOne(
      {
        nickName: nickName,
      },
      { active: false }
    );
    res.status(200).json("Logout !!!");
  } catch (err) {
    res.status(500).json(err);
  }
};

//Tìm người dùng bằng tên
export const getOneUserByName = async (req, res) => {
  const nickName = req.query.nickName;
  try {
    const user = await UserModel.findOne({
      nickName: nickName,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Lấy người dùng
export const getRecommendUser = async (req, res) => {
  const nickName = req.query.nickName;
  const suggestAccount = [];
  const followingAccount = [];

  try {
    const users = await UserModel.find();
    for (let i = 0; i < users.length; i++) {
      let bo = true;
      if (users[i].nickName !== nickName) {
        for (let j = 0; j < users[i].follower.length; j++) {
          if (users[i].follower[j] === nickName) {
            followingAccount.push(users[i]);
            bo = false;
          }
        }
        if (bo) {
          suggestAccount.push(users[i]);
        }
      }
    }

    res.status(200).json({ suggestAccount, followingAccount });
  } catch (err) {
    res.status(500).json(err);
  }
};

//Upload video tạm thời lên server
export const uploadTempVideo = async (req, res) => {
  const video = { video: req.file.filename };

  try {
    await UserModel.updateOne(
      { nickName: req.body.nickName },
      { uploadTempVideo: video }
    );

    const user = await UserModel.findOne({
      nickName: req.body.nickName,
    });

    res.status(200).json(user.uploadTempVideo.video);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Xóa video tạm thời trên server
export const deleteUploadTempVideo = async (req, res) => {
  try {
    const nickName = req.body.nickName;
    const videoName = req.body.videoName;

    const filePath = `src/uploads/video/${nickName}/TempVideo/${videoName}`;
    fs.unlinkSync(filePath);
    await UserModel.updateOne(
      {
        nickName: nickName,
      },
      { uploadTempVideo: { video: null } }
    );

    res.status(200).json("OK");
  } catch (err) {
    res.status(500).json(err);
  }
};

//Following And Follower
export const followUser = async (req, res) => {
  try {
    //Người đang follow
    const followingUser = await UserModel.findOne({
      nickName: req.body.followingUser,
    });

    await UserModel.updateOne(
      {
        nickName: req.body.followingUser,
      },
      {
        following: [...followingUser.following, req.body.followerUser],
      }
    );

    //Người được follow
    const followerUser = await UserModel.findOne({
      nickName: req.body.followerUser,
    });

    await UserModel.updateOne(
      {
        nickName: req.body.followerUser,
      },
      {
        follower: [...followerUser.follower, req.body.followingUser],
      }
    );
    res.status(200).json(req.body.followerUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Unfollow And Follower
export const unFollowUser = async (req, res) => {
  try {
    //Người đang follow
    const followingUser = await UserModel.findOne({
      nickName: req.body.followingUser,
    });
    followingUser.following.splice(
      followingUser.following.indexOf(req.body.followerUser),
      1
    );
    await UserModel.updateOne(
      {
        nickName: req.body.followingUser,
      },
      {
        following: followingUser.following,
      }
    );

    //Người được follow
    const followerUser = await UserModel.findOne({
      nickName: req.body.followerUser,
    });
    followerUser.follower.splice(
      followerUser.follower.indexOf(req.body.followingUser),
      1
    );

    await UserModel.updateOne(
      {
        nickName: req.body.followerUser,
      },
      {
        follower: followerUser.follower,
      }
    );
    res.status(200).json(req.body.followerUser);
  } catch (err) {
    res.status(500).json(err);
  }
};
