import express from "express";
import routes from "./routes/index.js";
import connect from "./config/connectDB.js";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//Socket.io
var server = http.createServer(app);
const io = new Server(server, { cors: { origin: ["http://localhost:3000"] } });

//IO handle
io.on("connection", (socket) => {
  socket.on("updateMessageVideo", (videoName) => {
    socket.broadcast.emit(`updateMessageVideo/${videoName}`);
  });
  socket.on("updateMessage", () => {
    socket.broadcast.emit(`updateMessage`);
  });
});

//Middleware, 30mb là giới hạn tối đa dung lượng client có thể submit lên server
app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use("/uploads", express.static("src/uploads"));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
routes(app);

//DTB connect
connect();

server.listen(port, () => {
  console.log("Runing on the port : " + port);
});
