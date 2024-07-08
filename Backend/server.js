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
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
// Load environment variables
dotenv.config();

// Initialize Express app
app.use(express.json());

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigins = [
  "*",
  "https://chatify-io-git-master-jayshree-s-projects.vercel.app",
  "https://chatify-io-ten.vercel.app",
  "http://localhost:3000",
  "https://chatify-mern-5fao.onrender.com",
  "https://chatify-mern-5fao.onrender.com/api",
  "https://chatify-lnzgj0x3j-jayshree-s-projects.vercel.app/"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));



app.get("/", (req, res) => {
  res.send("Welcome to Chatify API"); // Example response
});

// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);
// Routes

app.use(`${BASE_URL}/api/user`, userRoutes);
app.use(`${BASE_URL}/api/chat`, chatRoutes);
app.use(`${BASE_URL}/api/message`, messageRoutes);
// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || "http://localhost:5000";
const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.blue.italic)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,

  cors: {
    origin: [allowedOrigins, "http://localhost:3000", "https://chatify-io-git-master-jayshree-s-projects.vercel.app", "https://chatify-io-ten.vercel.app", "https://chatify-lnzgj0x3j-jayshree-s-projects.vercel.app"]
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io successfully!");

  socket.on("setup", (userData) => {
    socket.join(userData._id);

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
