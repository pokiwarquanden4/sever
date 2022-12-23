import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {
  tokenDuplication,
  tokenDelete,
  tokenAdd,
} from "../refreshTokenControllers/refreshTokenControllers.js";

let key = process.env.JWT_SECRET;
let refreshKey = process.env.JWT_REFRESH;

export const createJWT = (payload) => {
  let data = null;
  try {
    const decoded = jwt.sign(payload, key, { expiresIn: "30d" });
    data = decoded;
  } catch (err) {
    console.log(err);
  }
  return data;
};
export const createRefreshToken = (payload) => {
  let data = null;
  try {
    const decoded = jwt.sign(payload, refreshKey, { expiresIn: "30d" });
    data = decoded;
  } catch (err) {
    console.log(err);
  }
  return data;
};

//Lưu các refreshToken cũ vào DTB (trên video vì không có DTB nên họ tạo bằng 1 cái arr trong server)
export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("You are not authenticated");

  //Kiểm tra token có bị trùng lặp trong mảng không
  if (!tokenDuplication(refreshToken)) {
    return res.status(403).json("Refresh Token is not valid");
  }

  jwt.verify(refreshToken, refreshKey, (err, user) => {
    if (err) {
      console.log(err);
    }

    //Loại bỏ giá trị refreshToken cũ khỏi arr
    tokenDelete(refreshToken);

    //Tạo mới token
    const newAccessToken = createJWT(user);
    const newRefreshToken = createRefreshToken(user);

    //Lưu refreshToken mới vào array
    tokenAdd(req.body.nickName, newRefreshToken);

    //Save to cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    return res.status(200).json(newAccessToken);
  });
};
