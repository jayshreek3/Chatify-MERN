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

dotenv.config();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.blue.italic)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000, // closed the connection after 60s if any inactivity

  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io successfully!");

  //create a new room w id of the userData
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("Connection");
  });

  socket.on("Join Chat", (room) => {
    socket.join(room);
    console.log("User joined the room: " + room);
  });
});
