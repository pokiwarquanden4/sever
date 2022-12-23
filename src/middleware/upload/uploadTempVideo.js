import multer from "multer";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const nickName = req.body.nickName;
    fs.mkdirsSync("./src/uploads/video/" + nickName + "/TempVideo");

    //Vị trí save file nếu không tìm được thư mục trả về null
    cb(null, "./src/uploads/video/" + nickName + "/TempVideo");
  },
  filename: function (req, file, cb) {
    //Trả về tên gốc của file nếu không có file trả về null
    cb(null, uuidv4() + file.originalname);
  },
});

var uploadTempVideoMid = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    //Chỉ up load file PNG và JPG
    if (file.mimetype == "video/mp4") {
      cb(null, true);
    } else {
      console.log("Only support for mp4 video");
      cb(null, false);
    }
  },
  //File limit size
  limits: {
    fieldSize: 1024 * 1024 * 50,
  },
});

export default uploadTempVideoMid;
