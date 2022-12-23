import { UserModel } from "../../models/userModel.js";
import { VideoModel } from "../../models/videoModel.js";
import fs from "fs";
import fse from "fs-extra";
import { v4 as uuidv4 } from "uuid";

//Tìm kiếm các Video bằng tên người dùng
export const getVideosByNickName = async (req, res) => {
  const nickName = req.query.nickName;

  try {
    const videos = await VideoModel.find({
      nickName: nickName,
    });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Upload video lên server
export const uploadVideo = async (req, res) => {
  const currentVideo = req.body;

  await fse.move(
    `./src/uploads/video/${currentVideo.nickName}/TempVideo/${currentVideo.video}`,
    `./src/uploads/video/${currentVideo.nickName}/MainVideo/${currentVideo.video}`
  );

  try {
    const newVideo = new VideoModel(currentVideo);
    await newVideo.save();

    const currentUser = await UserModel.findOne({
      nickName: currentVideo.nickName,
    });
    await UserModel.updateOne(
      { nickName: req.body.nickName },
      {
        video: [...currentUser.video, currentVideo.video],
        uploadTempVideo: { video: null },
      }
    );

    res.status(200).json(currentVideo.video);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Delete video trên server
export const deleteUploadVideo = async (req, res) => {
  const nickName = req.body.nickName;
  const videoName = req.body.videoName;

  try {
    const filePath = `src/uploads/video/${nickName}/mainVideo/${videoName}`;
    fs.unlinkSync(filePath);

    await UserModel.updateOne(
      {
        nickName: nickName,
      },
      { video: video.splice(indexOf(videoName), 1) }
    );
    res.status(200).json("OK");
  } catch (err) {
    res.status(500).json(err);
  }
};
//Lấy video trên server
export const getVideo = async (req, res) => {
  try {
    const nickName = req.body;
    let video = [];

    for (let i = 0; i < nickName.length; i++) {
      const newVideo = await VideoModel.find({
        nickName: nickName[i],
      });

      video = [...video, ...newVideo];
    }
    res.status(200).json({ video, nickName });
  } catch (err) {
    res.status(500).json(err);
  }
};

//Like Video
export const likeVideo = async (req, res) => {
  try {
    const video = req.body;

    const currentVideo = await VideoModel.findOne({
      video: video.video,
    });

    if (currentVideo.liker.indexOf(video.userName) === -1) {
      await VideoModel.updateOne(
        {
          video: video.video,
        },
        {
          liker: [...currentVideo.liker, video.userName],
        }
      );
    }
    res.status(200).json("OK");
  } catch (err) {
    res.status(500).json(err);
  }
};

//UnLike Video
export const unLikeVideo = async (req, res) => {
  try {
    const video = req.body;

    const currentVideo = await VideoModel.findOne({
      video: video.video,
    });

    let arr = currentVideo.liker;

    if (arr.indexOf(video.userName) > -1) {
      arr.splice(arr.indexOf(video.userName), 1);
    }

    await VideoModel.updateOne(
      {
        video: video.video,
      },
      {
        liker: arr,
      }
    );
    res.status(200).json("OK");
  } catch (err) {
    res.status(500).json(err);
  }
};

//Like Comment Video
export const likeCommentVideo = async (req, res) => {
  try {
    const video = req.body;

    const currentVideo = await VideoModel.findOne({
      video: video.video,
    });

    let arr = currentVideo.comment;
    let update = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === video.commentId) {
        arr[i].liker.push(video.userName);
        update = true;
        break;
      }
    }
    if (!update) {
      for (let i = 0; i < arr.length; i++) {
        if (!update) {
          for (let j = 0; j < arr[i].reply.length; j++) {
            if (arr[i].reply[j].id === video.commentId) {
              arr[i].reply[j].liker.push(video.userName);
              update = true;
              break;
            }
          }
        } else {
          break;
        }
      }
    }

    await VideoModel.updateOne(
      {
        video: video.video,
      },
      {
        comment: arr,
      }
    );
    res.status(200).json("OK");
  } catch (err) {
    res.status(500).json(err);
  }
};

//UnLike Comment Video
export const unLikeCommentVideo = async (req, res) => {
  try {
    const video = req.body;

    const currentVideo = await VideoModel.findOne({
      video: video.video,
    });

    let arr = currentVideo.comment;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === video.commentId) {
        arr[i].liker.splice(arr[i].liker.indexOf(video.userName), 1);
      }
    }

    await VideoModel.updateOne(
      {
        video: video.video,
      },
      {
        comment: arr,
      }
    );
    res.status(200).json("OK");
  } catch (err) {
    res.status(500).json(err);
  }
};

//Update Video Comment
export const updateVideoComment = async (req, res) => {
  const comment = req.body;
  let reset = false;

  try {
    if (comment.name) {
      const currentVideo = await VideoModel.findOne({
        video: comment.video,
      });

      if (comment.commentId) {
        for (let i = 0; i < currentVideo.comment.length; i++) {
          if (currentVideo.comment[i].id === comment.commentId) {
            currentVideo.comment[i].reply.push({
              id: uuidv4(),
              name: comment.name,
              avatar: comment.avatar,
              title: comment.title,
              liker: comment.liker,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            break;
          }
        }
      } else {
        currentVideo.comment.push({
          id: uuidv4(),
          name: comment.name,
          avatar: comment.avatar,
          title: comment.title,
          liker: comment.liker,
          reply: comment.reply,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await VideoModel.updateOne(
        {
          video: comment.video,
        },
        {
          comment: currentVideo.comment,
        }
      );
    } else {
      reset = true;
    }
    const updatedVideo = await VideoModel.findOne({
      video: comment.video,
    });

    res.status(200).json({ updatedVideo, reset });
  } catch (err) {
    res.status(500).json(err);
  }
};
