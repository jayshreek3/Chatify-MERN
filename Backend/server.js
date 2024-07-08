const express = require("express");
const colors = require("colors");
const { chats } = require("./data/data");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

// const path = require('path')
dotenv.config();

connectDB();
const allowedOrigins = [
  "*",
  "http://localhost:3000",
  "https://chatify-mern-5fao.onrender.com",
  "https://chatify-mern-5fao.onrender.com/api",
];
app.use(cors());

app.use(express.json());

app.use(`${BASE_URL}/user`, userRoutes);
app.use(`${BASE_URL}/chat`, chatRoutes);
app.use(`${BASE_URL}/message`, messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.blue.italic)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000, // closed the connection after 60s if any inactivity

  cors: {
    origin: [
      "http://localhost:3000",
      "https://chatify-mern-5fao.onrender.com",
      "https://chatify-mern-5fao.onrender.com/api",
    ],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io successfully!");

  //create a new room w id of the userData
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("Join Chat", (room) => {
    socket.join(room);
    console.log("User joined the room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("New message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    //msgs to be emitted by all the grp members except the sender

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  // for socket memory clean up
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
