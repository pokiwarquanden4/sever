import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/TiktokApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DTB connected");
  } catch (err) {
    console.log("Error");
  }
};

export default connect;
