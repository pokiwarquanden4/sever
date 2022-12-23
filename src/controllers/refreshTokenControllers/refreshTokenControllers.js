import { RefreshTokenModel } from "../../models/refreshToken.js";

export const tokenDuplication = async (token) => {
  const refreshTokenDuplication = await RefreshTokenModel.findOne({
    refreshToken: token,
  });

  if (refreshTokenDuplication) {
    return true;
  } else {
    return false;
  }
};

export const tokenDelete = async (token) => {
  await RefreshTokenModel.deleteOne({
    refreshToken: token,
  });
};

export const tokenAdd = async (nickName, token) => {
  const value = {
    nickName: nickName,
    refreshToken: token,
  };

  const newToken = new RefreshTokenModel(value);
  await newToken.save();
};
