import { MessageModel } from "../../models/messageModel.js";
import { UserModel } from "../../models/userModel.js";

export const createMessage = async (req, res) => {
  try {
    //Lấy dữ liệu từ phía client
    const message = req.body;

    //Tạo mới và lưu người dùng vào DTB
    const newMessage = new MessageModel(message);
    await newMessage.save();

    //Find new message
    const currentMessage = await MessageModel.findOne({
      _id: message._id,
    });

    const user1 = await UserModel.findOne({
      nickName: message.members[0],
    });
    await UserModel.updateOne(
      {
        nickName: message.members[0],
      },
      {
        message: [...user1.message, message._id],
      }
    );

    const user2 = await UserModel.findOne({
      nickName: message.members[1],
    });
    await UserModel.updateOne(
      {
        nickName: message.members[1],
      },
      {
        message: [...user2.message, message._id],
      }
    );

    return res.status(200).json(currentMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getMessage = async (req, res) => {
  try {
    const messages = await MessageModel.find();

    return res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const seenMessage = async (req, res) => {
  const data = req.body;

  try {
    const messages = await MessageModel.findOne({
      _id: data._id,
    });

    for (let i = 0; i < messages.comment.length; i++) {
      if (
        messages.comment[i].seen === false &&
        messages.comment[i].nickName !== data.nickName
      ) {
        messages.comment[i].seen = true;
      }
    }

    await MessageModel.updateOne(
      {
        _id: data._id,
      },
      {
        comment: messages.comment,
      }
    );

    const result = await MessageModel.findOne({
      _id: data._id,
    });

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMessage = async (req, res) => {
  const mainId = req.body.mainId;
  const comment = req.body.comment;
  try {
    const currentComment = await MessageModel.findOne({
      _id: mainId,
    });

    await MessageModel.updateOne(
      {
        _id: mainId,
      },
      {
        comment: [...currentComment.comment, comment],
      }
    );

    const result = await MessageModel.find();

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
